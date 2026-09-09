# Procedural Motion & Mathematical Animation

Procedural animation computes transformations in code per frame, delivering organic, physics-inspired, and interactive responsiveness.

---

## 1. Frame-Rate Independent Dampening

Never use fixed-rate lerp (`current += (target - current) * 0.1`) as it changes speed across 60Hz/120Hz/144Hz displays. Instead, use exponential dampening with delta time:

```typescript
import * as THREE from 'three';

// Damp a scalar value (e.g. opacity, scale, camera FOV)
// lambda represents smoothing speed (e.g., 4 to 12)
currentVal = THREE.MathUtils.damp(currentVal, targetVal, lambda, delta);

// Damp a Vector3 position or scale
function dampVector3(current: THREE.Vector3, target: THREE.Vector3, lambda: number, delta: number): void {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, delta);
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, delta);
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, delta);
}
```

---

## 2. Smooth Rotations with Quaternions

Avoid Euler angle interpolation to eliminate gimbal lock. Use `slerp` or `rotateTowards`:

```typescript
// Slerp to target orientation
const targetQuaternion = new THREE.Quaternion();
targetQuaternion.setFromEuler(new THREE.Euler(pitch, yaw, roll));

// Interpolate smoothly
mesh.quaternion.slerp(targetQuaternion, 1 - Math.exp(-lambda * delta));

// Constant angular speed rotation
mesh.quaternion.rotateTowards(targetQuaternion, maxStepRadians);
```

---

## 3. Harmonic Motion & Organic Hovering

Combine sine and cosine frequencies for natural, non-repetitive floating motion:

```typescript
function applyFloatingHover(object: THREE.Object3D, elapsedTime: number, basePosition: THREE.Vector3): void {
  const hoverY = Math.sin(elapsedTime * 1.5) * 0.15 + Math.sin(elapsedTime * 3.1) * 0.05;
  const swayX = Math.cos(elapsedTime * 0.8) * 0.08;
  const tiltZ = Math.sin(elapsedTime * 1.2) * 0.03;

  object.position.y = basePosition.y + hoverY;
  object.position.x = basePosition.x + swayX;
  object.rotation.z = tiltZ;
}
```

---

## 4. Cursor / Pointer Parallax (NDC)

Translate screen cursor to Normalized Device Coordinates (-1 to +1) and apply parallax:

```typescript
const pointerNDC = new THREE.Vector2(0, 0);

window.addEventListener('pointermove', (event) => {
  pointerNDC.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function updateParallax(camera: THREE.Camera, delta: number): void {
  const targetX = pointerNDC.x * 0.5;
  const targetY = pointerNDC.y * 0.3;

  camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, delta);
  camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 5, delta);
  camera.lookAt(0, 0, 0);
}
```

---

## 5. Scroll-Driven Progress Interpolation

Map page scroll percentage `[0, 1]` or section offset into curve animations:

```typescript
interface KeyframePoint {
  progress: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

function interpolateScrollTimeline(
  keyframes: KeyframePoint[],
  currentProgress: number,
  targetObject: THREE.Object3D
): void {
  const clamped = THREE.MathUtils.clamp(currentProgress, 0, 1);

  for (let i = 0; i < keyframes.length - 1; i++) {
    const start = keyframes[i];
    const end = keyframes[i + 1];

    if (clamped >= start.progress && clamped <= end.progress) {
      const segmentProgress = (clamped - start.progress) / (end.progress - start.progress);
      const eased = THREE.MathUtils.smoothstep(segmentProgress, 0, 1);

      targetObject.position.lerpVectors(start.position, end.position, eased);
      break;
    }
  }
}
```
