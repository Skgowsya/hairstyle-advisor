import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/hairstyle-advisor/" : "/",
  plugins: [react()],
  server: {
    proxy: {
      '/generate-preview': {
      target: 'http://localhost:5000',
      changeOrigin: true,
},
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})