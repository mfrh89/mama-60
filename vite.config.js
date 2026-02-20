import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mama-60/',
  assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.PNG'],
})
