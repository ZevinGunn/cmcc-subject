import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ base: '/wed-puzzle/', plugins: [react()], server: { port: 4187, strictPort: true, proxy: { '/wed-puzzle/api': 'http://127.0.0.1:4186' } } })
