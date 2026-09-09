# Three.js Boilerplate Templates

Production-ready scaffolds implementing deterministic lifecycles, resize observation, and clean disposal.

---

## 1. Vanilla TypeScript Scene Controller

```typescript
import * as THREE from 'three';
import { disposeHierarchy } from './performance-and-cleanup';

export interface SceneConfig {
  container: HTMLElement;
  antialias?: boolean;
}

export class ThreeSceneController {
  private readonly container: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly clock: THREE.Clock;
  private resizeObserver: ResizeObserver | null = null;
  private animationFrameId: number | null = null;
  private isDisposed = false;

  constructor(config: SceneConfig) {
    this.container = config.container;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 5);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: config.antialias ?? true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // 3. Clock & Setup
    this.clock = new THREE.Clock();
    this.setupLights();
    this.setupResize();
    this.startLoop();
  }

  private setupLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(5, 10, 7);
    this.scene.add(ambient, directional);
  }

  private setupResize(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      if (this.isDisposed) return;
      const entry = entries[0];
      if (!entry) return;

      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    });

    this.resizeObserver.observe(this.container);
  }

  private startLoop(): void {
    const tick = () => {
      if (this.isDisposed) return;
      this.animationFrameId = requestAnimationFrame(tick);

      const delta = this.clock.getDelta();
      this.update(delta);
      this.renderer.render(this.scene, this.camera);
    };

    tick();
  }

  protected update(delta: number): void {
    // Override or hook into per-frame updates
  }

  public destroy(): void {
    this.isDisposed = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    disposeHierarchy(this.scene);
    this.renderer.dispose();
    this.renderer.forceContextLoss();

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
```

---

## 2. React Three Fiber (R3F) Component

```tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
}

export const AnimatedModel: React.FC<ModelProps> = ({ url }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, groupRef);

  React.useEffect(() => {
    const firstAction = Object.values(actions)[0];
    if (firstAction) {
      firstAction.reset().fadeIn(0.5).play();
    }
    return () => {
      firstAction?.fadeOut(0.5);
    };
  }, [actions]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Delta-scaled procedural idle sway
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return <primitive ref={groupRef} object={scene} />;
};

export const SceneCanvas: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <AnimatedModel url="/models/character.glb" />
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
};
```
