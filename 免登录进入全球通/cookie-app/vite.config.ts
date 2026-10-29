import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = Number(
    env.VITE_API_PORT ?? env.API_PORT ?? env.PORT ?? '3101',
  )

  return {
    plugins: [
      react(),
      tsconfigPaths(),
    ],
    server: {
      port: 5702,
      host: '0.0.0.0',
      allowedHosts: ['home.1008086.xyz'],
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('Sending Request to the Target:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(
                'Received Response from the Target:',
                proxyRes.statusCode,
                req.url,
              )
            })
          },
        },
        '/debug': {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
