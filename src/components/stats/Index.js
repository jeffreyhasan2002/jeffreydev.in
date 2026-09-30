import { gsap } from 'gsap';
import { useMemo } from 'react';
import _Stats from 'stats.js';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

// Debug-only FPS meter. Mount it in _app when profiling.
function Stats() {
  const stats = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new _Stats();
    }
    return undefined;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!stats) return undefined;
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    const tick = () => stats.update();
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      stats.dom.remove();
    };
  }, [stats]);

  return null;
}
export default Stats;
