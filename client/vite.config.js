import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || '/api'
  const isProduction = mode === 'production'
  
  // Extract just the base URL without the /api path for the proxy target
  let targetUrl
  if (apiUrl.startsWith('http') && apiUrl.endsWith('/api')) {
    targetUrl = apiUrl.substring(0, apiUrl.length - 4)
  } else if (apiUrl === '/api' && !isProduction) {
    // In development, default to localhost if using relative /api path
    targetUrl = 'https://counter-game-with-auth.onrender.com'
  } else if (apiUrl.startsWith('http')) {
    targetUrl = apiUrl
  } else {
    targetUrl = 'https://counter-game-with-auth.onrender.com'
  }
  
  console.log(`Mode: ${mode}`)
  console.log(`API URL: ${apiUrl}`)
  console.log(`Proxy Target URL: ${targetUrl}`)
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT || '3000'),
      open: true,
      proxy: !isProduction ? {
        // Only use proxy in development
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
      } : undefined,
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      // Optimize chunks for production
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
          }
        }
      }
    },
    // Define global environment variables available in the app
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __API_URL__: JSON.stringify(apiUrl),
    }
  }
})
