import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/chat': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Add this for Vercel deployment
  build: {
    outDir: 'dist'
  }
})
=======
      '/api': 'http://localhost:4000',
      '/chat': 'http://localhost:4000',
    }
  }
})
>>>>>>> ed1b09fa08a1c4a3cc71c9c4495500dc2d36dc07
