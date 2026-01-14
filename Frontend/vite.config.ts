import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows the ngrok tunnel to bypass the host check
    allowedHosts: [
      '041a449098b3.ngrok-free.app'
    ],
    // Exposes the server to the local network (essential for some tunnel setups)
    host: true, 
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})