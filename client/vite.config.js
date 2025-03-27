import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'https://counter-game-with-auth.onrender.com/api'
  
  // Extract just the base URL without the /api path for the proxy target
  const targetUrl = apiUrl.endsWith('/api') 
    ? apiUrl.substring(0, apiUrl.length - 4) 
    : 'https://counter-game-with-auth.onrender.com'
  
  console.log(`Mode: ${mode}`)
  console.log(`API URL: ${apiUrl}`)
  console.log(`Proxy Target URL: ${targetUrl}`)
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT || '3000'),
      open: true,
      proxy: {
        // In development, proxy requests to the backend
        '/api': {
          target: targetUrl,
          changeOrigin: true,
          secure: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxy request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Proxy response:', proxyRes.statusCode, req.url);
            });
          },
        }
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
    // Define global environment variables available in the app
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __API_URL__: JSON.stringify(apiUrl),
    }
  }
})
