import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/extension/manifest.json' assert { type: 'json' }


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        drc: resolve(__dirname, 'src/drc/index.html')
      }
    },
  },
  plugins: [
    vue(),
    crx({ manifest }),
  ],
  test: {
    globals: true
  }
})
