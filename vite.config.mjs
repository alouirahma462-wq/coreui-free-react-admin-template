import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    plugins: [react()],

    optimizeDeps: {
      include: ['react', 'react-dom'],
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },

    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },

    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
      extensions: [
        '.mjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.scss',
      ],
    },

    server: {
      port: 3000,
    },
  }
})



