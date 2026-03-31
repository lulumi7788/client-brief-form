import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/client-brief-form/',  // GitHub Pages 需要 repo 名稱作為 base path
})
