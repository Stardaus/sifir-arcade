# Three.js Animation System & Clip Blending

The Three.js animation system consists of three fundamental components:
- **`THREE.AnimationClip`**: Static data container holding keyframe tracks (position, rotation quaternion, scale, morph target weights).
- **`THREE.AnimationMixer`**: Player attached to a root object or scene graph hierarchy that computes animated state over time.
- **`THREE.AnimationAction`**: Playback controller for a specific clip on a mixer (looping, speed, weight, crossfades).

---

## 1. Initializing Mixer & Actions

```typescript
import * as THREE from 'three';

// 1. Instantiate mixer on the root object
const mixer = new THREE.AnimationMixer(modelRoot);

// 2. Pre-process clips for memory & track efficiency
clips.forEach((clip) => clip.optimize());

// 3. Create actions and configure loop behaviors
const actions = new Map<string, THREE.AnimationAction>();

clips.forEach((clip) => {
  const action = mixer.clipAction(clip);
  action.clampWhenFinished = true;
  action.loop = THREE.LoopRepeat;
  actions.set(clip.name, action);
});
```

---

## 2. Smooth Crossfading Between Actions

To transition smoothly between two distinct clips (e.g., `Idle` -> `Run`):

```typescript
function transitionTo(
  targetAction: THREE.AnimationAction,
  duration = 0.5,
  currentAction?: THREE.AnimationAction
): void {
  targetAction.reset();
  targetAction.setEffectiveTimeScale(1);
  targetAction.setEffectiveWeight(1);

  if (currentAction && currentAction !== targetAction) {
    currentAction.crossFadeTo(targetAction, duration, true);
  }

  targetAction.play();
}
```

### Synchronized Crossfading
For walking/running cycles to avoid foot sliding, synchronize warps:
```typescript
function crossFadeSynchronized(
  prevAction: THREE.AnimationAction,
  nextAction: THREE.AnimationAction,
  duration = 0.4
): void {
  nextAction.time = 0.0;
  nextAction.enabled = true;
  nextAction.setEffectiveTimeScale(1.0);
  nextAction.setEffectiveWeight(1.0);

  // Sync timescales if next action duration differs
  prevAction.crossFadeTo(nextAction, duration, true);
  nextAction.play();
}
```

---

## 3. Additive Animation Blending

Additive animations allow layering secondary motions (e.g., breathing, recoil, head turns) on top of base locomotion:

```typescript
import { makeClipAdditive } from 'three/examples/jsm/utils/AnimationUtils.js';

// Convert clip to additive relative to reference frame 0
const additiveClip = makeClipAdditive(breathingClip, 0);
const additiveAction = mixer.clipAction(additiveClip);

additiveAction.blendMode = THREE.AdditiveAnimationBlendMode;
additiveAction.setEffectiveWeight(0.5); // Tune influence (0.0 to 1.0)
additiveAction.play();
```

---

## 4. Morph Target Animation

Used for facial expressions, shape keys, and blendshapes:

```typescript
function setMorphWeight(mesh: THREE.Mesh, targetName: string, weight: number): void {
  if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
  const index = mesh.morphTargetDictionary[targetName];
  if (index !== undefined) {
    mesh.morphTargetInfluences[index] = THREE.MathUtils.clamp(weight, 0, 1);
  }
}
```

---

## 5. Animation Event Dispatching

Listen for finished loops or clip completions on the mixer:

```typescript
mixer.addEventListener('finished', (event) => {
  const finishedAction = event.action;
  const clipName = finishedAction.getClip().name;
  // Handle state transition after one-shot animation finishes
});

mixer.addEventListener('loop', (event) => {
  // Fired on each loop cycle completion
});
```

---

## 6. Update Loop Integration

Update all mixers inside the single RAF render loop using clock delta:

```typescript
function tick(delta: number): void {
  if (mixer) {
    mixer.update(delta);
  }
}
```
