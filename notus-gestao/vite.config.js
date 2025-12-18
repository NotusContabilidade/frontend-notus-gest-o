import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,       // <--- Define a porta fixa aqui
    strictPort: true, // Se a 5175 estiver ocupada, ele avisa (não tenta outra)
  }
})