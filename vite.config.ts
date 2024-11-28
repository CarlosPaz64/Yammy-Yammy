import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './dist/',
    target: 'esnext', // Soporte de características modernas como top-level await
    chunkSizeWarningLimit: 1000, // Aumenta el límite de 500 KB a 1000 KB
  },
})
