# Three.js Performance Optimization & Memory Cleanup

High-performance WebGL requires strict resource management, draw call minimization, and exhaustive memory deallocation.

---

## 1. Exhaustive Scene Disposal Pattern

WebGL memory (buffers, textures, shaders) lives on the GPU and is **not** garbage collected automatically by JavaScript. Failing to dispose results in memory leaks and context loss.

```typescript
import * as THREE from 'three';

export function disposeHierarchy(root: THREE.Object3D): void {
  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;

    // 1. Dispose Geometry
    if (node.geometry) {
      node.geometry.dispose();
    }

    // 2. Dispose Materials and associated Textures
    if (node.material) {
      const materials = Array.isArray(node.material) ? node.material : [node.material];

      materials.forEach((mat) => {
        // Dispose all attached texture maps
        Object.keys(mat).forEach((prop) => {
          const value = (mat as unknown as Record<string, unknown>)[prop];
          if (value && typeof value === 'object' && 'isTexture' in value && (value as THREE.Texture).isTexture) {
            (value as THREE.Texture).dispose();
          }
        });

        mat.dispose();
      });
    }
  });

  // Remove from parent
  if (root.parent) {
    root.parent.remove(root);
  }
}
```

---

## 2. Complete Renderer & Loop Teardown

```typescript
export function destroyScene(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  animationFrameId?: number
): void {
  // 1. Cancel active animation frame
  if (animationFrameId !== undefined) {
    cancelAnimationFrame(animationFrameId);
  }
  renderer.setAnimationLoop(null);

  // 2. Dispose scene graph
  disposeHierarchy(scene);

  // 3. Dispose renderer and force context loss
  renderer.dispose();
  renderer.forceContextLoss();

  // 4. Remove DOM element
  if (renderer.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
}
```

---

## 3. Visibility & Off-Screen Throttling

Pause or throttle RAF loops when the canvas is hidden or scrolled out of view:

```typescript
let isVisible = true;
let isTabFocused = true;

// 1. Intersection Observer for viewport visibility
const observer = new IntersectionObserver(([entry]) => {
  isVisible = entry.isIntersecting;
}, { threshold: 0.05 });

observer.observe(renderer.domElement);

// 2. Tab visibility listener
document.addEventListener('visibilitychange', () => {
  isTabFocused = document.visibilityState === 'visible';
});

function animate(time: number): void {
  requestAnimationFrame(animate);

  // Skip computation & rendering when invisible
  if (!isVisible || !isTabFocused) return;

  const delta = clock.getDelta();
  // ... update mixers & render
  renderer.render(scene, camera);
}
```

---

## 4. Draw Call Minimization: InstancedMesh

When rendering identical geometry/materials in large numbers (particles, foliage, UI dots), use `THREE.InstancedMesh`:

```typescript
const count = 1000;
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0x4f46e5 });
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

const dummy = new THREE.Object3D();
for (let i = 0; i < count; i++) {
  dummy.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}
instancedMesh.instanceMatrix.needsUpdate = true;
scene.add(instancedMesh);
```

---

## 5. Performance Budget Checklist

- [ ] **Pixel Ratio:** Cap `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`. Never use unconstrained pixel ratio on 3x/4x retina screens.
- [ ] **Shadow Map Resolution:** Limit shadow map sizes to `1024x1024` or `2048x2048`, and only enable shadows on essential dynamic lights.
- [ ] **Geometry Complexity:** Use LOD (`THREE.LOD`) for complex assets; simplify polygon count with Draco compression.
- [ ] **Frustum Culling:** Ensure `mesh.frustumCulled = true` (default) is preserved unless modifying custom bounding spheres.
