import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
    plugins: [react(), eslintPlugin()],
    build: {
        outDir: 'build',
    },
    server: {
        open: true,
        port: 3000,
    },
});
