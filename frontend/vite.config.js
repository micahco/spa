import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../ui/frontend',
  },
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://localhost:4000/',
        changeOrigin: true,
      }
    },
  },
})
