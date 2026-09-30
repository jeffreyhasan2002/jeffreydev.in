import nextVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'out/**', 'dist/**'] },
  ...nextVitals,
  prettierRecommended,
  {
    settings: {
      next: { rootDir: '.' },
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto', printWidth: 200 }],
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off', // R3F props (args, attach, ...)
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      // React Compiler diagnostics (react-hooks v7). The site drives GSAP / three.js imperatively
      // through refs and isn't compiled with the React Compiler, so surface these as warnings.
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/globals': 'warn',
    },
  },
];
