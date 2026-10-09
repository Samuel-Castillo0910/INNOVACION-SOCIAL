import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // tambien acepta las variables con el formato next_public que a veces muestra supabase
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
