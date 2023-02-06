import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/extension/manifest.json' assert { type: 'json' }

// input: {
//   drc: resolve(__dirname, 'src/drc/index.html')
// }

// const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
  
  optimizeDeps: {
    include: ['@qcampusmate-mate/types', '@qcampusmate-mate/plasapo-core', 'element-plus', 'vue'],
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/@qcampusmate-mate*/, /element-plus/, /node_modules/, /vue/],
      // esmExternals: true,
      transformMixedEsModules: true
    },
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        drc: resolve(__dirname, "/src/drc/index.html")
      }
    },
    outDir: resolve(__dirname, process.env.NODE_ENV === 'production'? "build" : "dist"),
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/drc/styles/element/index.scss" as *;`,
      },
    },
  },

  resolve: {
    alias: {
      '@':  fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
