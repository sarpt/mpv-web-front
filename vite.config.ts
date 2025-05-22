import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(),
    viteTsconfigPaths()
  ],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    port: 3000,
  },
  // No idea why suddenly prop-types default export started throwing in styled engine
  // This fixes it
  optimizeDeps: {
    include: ['prop-types'],
  },
  resolve: {
    alias: {
      'prop-types': 'prop-types/prop-types.js',
    },
  },
});
