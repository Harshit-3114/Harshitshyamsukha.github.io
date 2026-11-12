import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { reticle } from '@reticlehq/vite-plugin'

export default defineConfig({
  plugins: [
    /* Reticle — dev-only in-app verification. It no-ops in a production build. */
    reticle(),
    react(),
    tailwindcss(),
  ],
  base: '/',
})
