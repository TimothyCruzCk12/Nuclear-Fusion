# Nuclear Fusion Interactive

An educational React single-page experience that walks learners through hydrogen fusion in the Sun: opening copy, a draggable “fuse two hydrogens” moment, a zoomed solar interior with background pairs fusing into helium, and closing copy about energy output.

**Live demo:** [https://content-interactives.github.io/Nuclear-Fusion/](https://content-interactives.github.io/Nuclear-Fusion/)

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19 |
| Build | Vite 7 |
| Styling | Tailwind CSS 3 + inline styles for animation strings |
| Motion | CSS keyframes in `src/components/ui/reused-animations/` (`fade.css`, `scale.css`, `glow.css`) |
| Deploy | `gh-pages` → `dist` (see `package.json` scripts) |

Entry: `src/main.jsx` → `App.jsx` mounts [`NuclearFusion`](src/components/NuclearFusion.jsx).

---

## Repository layout (relevant paths)

```
src/
  App.jsx
  components/
    NuclearFusion.jsx          # All interactive logic and scene graph
    ui/
      reused-ui/               # Container, GlowButton, etc.
      reused-animations/       # Shared @keyframes and utility classes
```

The scene is hosted inside [`Container`](src/components/ui/reused-ui/Container.jsx): fixed **500×500px** (max width **500px**, min width **300px**) with an inner content area **min-height 420px**. When `contentDark` is true, the inner panel animates to a black background (used after “Begin Interactive”).

---

## Behaviour: phase model

State in `NuclearFusion` is effectively a linear flow with one branch (successful fuse vs. snap-back on drag end).

1. **Idle** — Only “Begin Interactive” is shown (`showStep1 === false`).
2. **Intro** — `showStep1`: Sun/stars/hydrogen field appear with timed CSS animations; “Continue” reveals fusion copy.
3. **Draggable fuse** — `showFusionText && !promptFaded`: two foreground hydrogens are draggable; hint text prompts the user.
4. **Fused** — `promptFaded`: user brought atoms within `FUSE_DISTANCE_PX` (5px). Main hydrogens flash away; central helium + flash appear; “camera” zoom animates; background pairs begin timed transitions to midpoints and then register as fused.
5. **Post-copy** — After all background pairs have fused (`fusedPairIndices.length === PAIR_COUNT`), `showPostFusionText` shows energy copy and a second “Continue”.
6. **Outro** — `postContinueClicked`: final sentence; container zoom phase 3; helium visuals can fade per `HELIUM_FADEOUT_DURATION`.

**Reset** (`handleReset`, wired to `Container`’s Reset button) clears all flags and restores atom positions; refs `pos1Ref` / `pos2Ref` stay in sync with React state for pointer math.

---

## Coordinate system and fuse detection

- Positions are stored as **percentage** `left` / `top` (0–100) relative to `atomsContainerRef` (the full-bleed scene `div`).
- `clientToPercent` maps pointer events from `getBoundingClientRect()`.
- `distancePx` converts both positions to pixel space using the container’s `offsetWidth` / `offsetHeight` and returns Euclidean distance.
- While dragging, if distance &lt; `FUSE_DISTANCE_PX`, `promptFaded` is set so the experience treats the pair as fused without waiting for pointer-up.
- On pointer-up, if distance ≥ threshold, both main atoms **snap back** to `MAIN_ATOM_1_ORIGINAL` / `MAIN_ATOM_2_ORIGINAL` over `SNAP_BACK_DURATION_MS` (400ms) via CSS `transition` on `left` / `top`.

Pointer handling uses **window-level** `mousemove` / `mouseup` / `touchmove` (`passive: false` where needed) / `touchend` / `touchcancel` so drag continues outside the 44×44 hit targets.

---

## Scene composition

| Element | Notes |
|---------|--------|
| Stars | `STAR_COUNT` (65) dots; random positions/sizes once per mount (`useMemo` empty deps). |
| Sun | Layered divs: orange radial fill, animated highlight, “flatten” overlay driven by `sunFlattenAnimation` / `sunUnflattenAnimation`. |
| Foreground H₂ | Two wrappers at `%` positions; inner 10px blue gradient sphere; `hydrogenShake` with staggered delays. |
| Background H₂ | `BACKGROUND_HYDROGENS` from `PRESET_HYDROGEN_POSITIONS.slice(2)`; shaken until `promptFaded`. |
| Fusion flash | `fusionFlashAnimation` radial burst at fuse sites. |
| He | Four small spheres (blue = protons, red = neutrons) in a composite; `heliumFadeInAnimation` / fade out when `postContinueClicked`. |

Background **pairs** are defined as consecutive entries in `BACKGROUND_HYDROGENS` (indices `0–1`, `2–3`, …). Each pair’s fusion target is the **midpoint** of its two hydrogen positions (`backgroundFusionTargets` / `pairMidpoints`).

When `promptFaded` is true, `useEffect` schedules timeouts per pair: delay `ZOOM_OUT_PAIR_DELAY_MS` (600ms) plus a **random** duration in `[PAIR_DURATION_MIN_MS, PAIR_DURATION_MIN_MS + PAIR_DURATION_RANGE_MS]` (1800–3000ms). Each completion appends that pair index to `fusedPairIndices`. When every pair is fused, another timeout sets `showPostFusionText` after 700ms.

---

## Animation timing

Nuclear fusion relies on **orchestrated CSS `animation` shorthand strings** (delays in ms baked into constants at the top of `NuclearFusion.jsx`), for example:

- Sun fade / stars / zoom / hydrogen fade-in / camera zoom phase 2 / continue button staggered on a single timeline.
- After fuse: `CAMERA_ZOOM_OUT_ANIMATION` vs. `CAMERA_ZOOM_OUT_PHASE3_ANIMATION` depending on `postContinueClicked`.

Domain-specific `@keyframes` live mainly in [`scale.css`](src/components/ui/reused-animations/scale.css) (`sunZoomInAnimation`, `cameraZoomInPhase2`, `hydrogenShake`, `fusionFlashAnimation`, `heliumFadeInAnimation`, etc.). Generic fades are in [`fade.css`](src/components/ui/reused-animations/fade.css).

---

## UI dependencies

- **`Container`** — Title, optional Reset, layout shell, `contentDark` for starfield background.
- **`GlowButton`** — Begin / Continue; `glow.css` supplies conic-gradient glow behavior for buttons.

---

## Scripts

```bash
npm install
npm run dev      # Vite dev server
npm run build    # Production bundle → dist/
npm run preview  # Serve dist locally
npm run deploy   # gh-pages (runs build via predeploy)
```

---

## Extending or modifying

- **Copy** — Replace the strings in the JSX paragraph elements (top instruction stack and bottom hints).
- **Fuse sensitivity** — Adjust `FUSE_DISTANCE_PX` or snap duration `SNAP_BACK_DURATION_MS`.
- **Layout** — Change `PRESET_HYDROGEN_POSITIONS` (first two entries are the main draggable atoms’ home positions).
- **Choreography** — Tune constants at the top of `NuclearFusion.jsx` or the `@keyframes` in `scale.css` / `fade.css`.
- **Pairing** — Background fusion assumes an even count of `BACKGROUND_HYDROGENS`; odd leftovers still render but the last index has no partner midpoint logic (see `backgroundFusionTargets` fallback).

There is **no external data API**; all behaviour is client-side React state plus CSS.
