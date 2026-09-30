import { forwardRef, useEffect, useMemo } from 'react';

import FluidEffect from '@src/components/canvas/fluid/effect/FluidEffect';

// The effect is created once; colour/intensity changes are pushed into its state and
// eased on the GPU side, so there is no shader rebuild when the fluid colour changes.
const FluidEffectWrapper = forwardRef(({ tFluid, intensity = 1.0, fluidColor = '#ffffff', backgroundColor = '#000000' }, ref) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const effect = useMemo(() => new FluidEffect({ tFluid, intensity, fluidColor, backgroundColor }), []);

  useEffect(() => {
    effect.state.fluidColor = fluidColor;
    effect.state.backgroundColor = backgroundColor;
    effect.state.intensity = intensity;
  }, [effect, fluidColor, backgroundColor, intensity]);

  useEffect(() => () => effect.dispose(), [effect]);

  return <primitive ref={ref} object={effect} />;
});

export default FluidEffectWrapper;
