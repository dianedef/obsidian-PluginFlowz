import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '.',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['cjs'],
      name: 'PluginFlowz'
    },
    rollupOptions: {
      external: ['obsidian'],
      output: {
        entryFileNames: 'main.js',
        globals: {
          obsidian: 'obsidian'
        }
      }
    },
    emptyOutDir: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 