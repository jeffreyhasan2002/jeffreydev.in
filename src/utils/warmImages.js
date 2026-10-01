const whenIdle = (cb) => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 1500 }) : window.setTimeout(cb, 200));

// Load + decode images one at a time during idle time, so the first time they scroll into
// view (or a hover reveals them) the browser doesn't stall on a large decode/raster.
// Returns a cancel function.
export default function warmImages(images) {
  const queue = [...images];
  let cancelled = false;

  const next = () => {
    if (cancelled || !queue.length) return;
    const img = queue.shift();
    if (img.loading === 'lazy') img.loading = 'eager';
    const decoded = typeof img.decode === 'function' ? img.decode() : Promise.resolve();
    decoded.catch(() => undefined).finally(() => whenIdle(next));
  };

  whenIdle(next);
  return () => {
    cancelled = true;
  };
}
