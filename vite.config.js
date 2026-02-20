import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   // Proxy /api requests to backend during development to avoid CORS
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.1.13:5000',
  //       changeOrigin: true,
  //       secure: false,
  //       // keep path /api intact
  //     },
  //   },
  // },
})
