import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '' },
        { src: 'popup/popup.html', dest: 'popup' },
        { src: 'Options/options.html', dest: 'options' },
        { src: 'assets/icons', dest: 'assets' },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/index.tsx',
        options: 'src/options/index.tsx',
        background: 'src/background.ts',
      },
      output: {
        entryFileNames: chunkInfo => {
          if (chunkInfo.name === 'popup') {
            return 'popup/[name].js'
          }
          if (chunkInfo.name === 'options') {
            return 'options/[name].js'
          }
          return '[name].js'
        },
        assetFileNames: () => {
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
