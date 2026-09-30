import { create } from 'zustand';

export const DEFAULT_FLUID_COLOR = '#d7d7d4';

export const useStore = create((set) => ({
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),
  introOut: false,
  setIntroOut: (introOut) => set({ introOut }),
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  fluidColor: DEFAULT_FLUID_COLOR,
  setFluidColor: (fluidColor) => set({ fluidColor }),
  isAbout: false,
  setIsAbout: (isAbout) => set({ isAbout }),
}));
