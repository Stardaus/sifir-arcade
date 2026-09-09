---
name: threejs
description: Build, animate, and optimize 3D WebGL scenes using Three.js or React Three Fiber (R3F). Use when creating Three.js animations, keyframe mixers, procedural motion, shaders, GLTF model loaders, camera controls, or resolving WebGL memory leaks and render-loop performance issues.
---

# Three.js Development & Animation

Authoritative guide for building deterministic, high-performance Three.js scenes, keyframe animation pipelines, procedural dynamics, and leak-free lifecycles.

## Core Workflow Steps

### Step 1: Scene & Render Target Setup
1. Define canvas mount container, viewport sizing (`clientWidth`, `clientHeight`), and device pixel ratio capped at `Math.min(window.devicePixelRatio, 2)`.
2. Instantiate `THREE.WebGLRenderer` with `{ antialias: true, alpha: true, powerPreference: 'high-performance' }`.
3. Set color space to `renderer.outputColorSpace = THREE.SRGBColorSpace` and enable `renderer.toneMapping = THREE.ACESFilmicToneMapping`.
4. Configure perspective camera FOV (default 45°–60°), aspect ratio, and near/far planes (`0.1` to `1000`).
*Completion Criterion:* Viewport resize listener updates `camera.aspect`, `camera.updateProjectionMatrix()`, and `renderer.setSize(w, h, false)`.

### Step 2: Asset Loading & Scene Assembly
1. Use `GLTFLoader` with `DRACOLoader` or `KTX2Loader` for compressed assets.
2. Traverse loaded hierarchies to enable `castShadow`/`receiveShadow` and verify texture encoding.
3. Structure meshes into hierarchical `THREE.Group` nodes for multi-axis or compound rotations.
*Completion Criterion:* All imported meshes and materials verified in scene graph without unhandled Promise rejections.

### Step 3: Animation Pipeline Integration
Choose branch based on animation type:
- **Keyframe / Skeletal Rigging:** Consult [Animation System Reference](references/animation-system.md) to bind `THREE.AnimationMixer`, initialize `AnimationAction`, configure clip weight blending, and execute `clip.optimize()`.
- **Procedural / Interactive Motion:** Consult [Procedural Motion Reference](references/procedural-motion.md) for delta-scaled dampening (`MathUtils.damp`), spring physics, trigonometric noise, or mouse/scroll tracking.
*Completion Criterion:* Motion updates occur strictly inside the clock-driven render loop using delta time (`clock.getDelta()`).

### Step 4: Render Loop & Lifecycle Management
1. Establish a single `requestAnimationFrame` loop or `renderer.setAnimationLoop`.
2. Pass clock delta to all active `AnimationMixer.update(delta)` and procedural tick handlers.
3. Call `renderer.render(scene, camera)`.
4. Implement exhaustive teardown routine: cancel animation loop, remove window event listeners, and traverse scene tree to invoke `.dispose()` on geometries, materials, and textures.
*Completion Criterion:* Scene teardown leaves 0 active requestAnimationFrame callbacks and WebGL memory is fully released. Consult [Performance and Cleanup Guide](references/performance-and-cleanup.md).

## Reference Index
- [Animation System & Clip Blending](references/animation-system.md) — Mixers, actions, cross-fades, morph targets, additive clips.
- [Procedural Motion & Math](references/procedural-motion.md) — Delta dampening, noise, quaternion rotation, lerping.
- [Performance & Memory Cleanup](references/performance-and-cleanup.md) — Disposal patterns, draw calls, LOD, visibility culling.
- [Boilerplate Templates](references/boilerplate-templates.md) — Production-ready Vanilla TS and React Three Fiber scaffolds.
