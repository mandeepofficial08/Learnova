import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Learnova_backend': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },
})