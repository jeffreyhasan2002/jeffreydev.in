/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['page.jsx'],
  reactStrictMode: false, // GSAP timelines and WebGL contexts are set up imperatively; avoid double-mount in dev.

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 85, 100],
  },

  // Shaders are plain JS string modules (src/components/canvas/**/glsl), so no custom
  // webpack loaders are needed and the default Turbopack bundler works for dev and build.

  headers: async () => [
    {
      // Dev-only manifests are served as JSON with a .js name; nosniff would block them.
      source: '/((?!_next/static/development).*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
    {
      source: '/404',
      destination: '/',
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
