import { Uniform, Vector3 } from 'three';

import { Effect } from 'postprocessing';
import fragmentShader from '@src/components/canvas/fluid/glsl/post.frag.js';
import hexToRgb from '@src/components/canvas/fluid/utils';

// How fast the fluid tint eases toward a new colour (higher = snappier).
const COLOR_EASE = 5;

class FluidEffect extends Effect {
  constructor({ tFluid, intensity = 1.0, fluidColor = '#ffffff', backgroundColor = '#000000' } = {}) {
    const uniforms = new Map(
      Object.entries({
        tFluid: new Uniform(tFluid),
        uIntensity: new Uniform(intensity),
        uColor: new Uniform(hexToRgb(fluidColor)),
        uBackgroundColor: new Uniform(hexToRgb(backgroundColor)),
      }),
    );

    super('FluidEffect', fragmentShader, { uniforms });

    this.state = {
      intensity,
      fluidColor,
      backgroundColor,
    };
    this.cachedFluidColor = fluidColor;
    this.cachedBackgroundColor = backgroundColor;
    this.targetColor = new Vector3().copy(this.uniforms.get('uColor').value);
  }

  setTexture(texture) {
    this.uniforms.get('tFluid').value = texture;
  }

  update(renderer, inputBuffer, deltaTime = 0.016) {
    if (this.state.fluidColor !== this.cachedFluidColor) {
      this.cachedFluidColor = this.state.fluidColor;
      this.targetColor.copy(hexToRgb(this.state.fluidColor));
    }

    if (this.state.backgroundColor !== this.cachedBackgroundColor) {
      this.cachedBackgroundColor = this.state.backgroundColor;
      this.uniforms.get('uBackgroundColor').value.copy(hexToRgb(this.state.backgroundColor));
    }

    // Ease the tint so hovering between projects blends colours instead of snapping.
    this.uniforms.get('uColor').value.lerp(this.targetColor, 1 - Math.exp(-deltaTime * COLOR_EASE));
    this.uniforms.get('uIntensity').value = this.state.intensity;
  }
}

export default FluidEffect;
