/**
 * Each page section tells the 3D estate how to look while it is on screen.
 *   state   0 = clustered estate · 1 = entangled · 2 = organised layers · 3 = continuous loop
 *   x       horizontal offset, as a fraction of the half-viewport width
 *   tilt    rotation towards the viewer (radians)
 *   scale   size multiplier
 *   opacity overall visibility
 *   scan    strength of the sweeping "make visible" scan line
 */
export type SceneConfig = {
  state: number;
  x?: number;
  tilt?: number;
  scale?: number;
  opacity?: number;
  scan?: number;
  xMobile?: number;
  opacityMobile?: number;
};

export function sceneAttrs(c: SceneConfig): Record<string, string> {
  const a: Record<string, string> = {
    "data-scene": String(c.state),
    "data-x": String(c.x ?? 0),
    "data-tilt": String(c.tilt ?? 0),
    "data-scale": String(c.scale ?? 1),
    "data-opacity": String(c.opacity ?? 1),
    "data-scan": String(c.scan ?? 0),
  };
  if (c.xMobile !== undefined) a["data-x-mobile"] = String(c.xMobile);
  if (c.opacityMobile !== undefined) a["data-opacity-mobile"] = String(c.opacityMobile);
  return a;
}
