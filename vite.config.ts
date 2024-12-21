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
      fileName: () => 'main.js'
    },
    rollupOptions: {
      external: ['obsidian'],
      output: {
        format: 'cjs',
        exports: 'default',
        globals: {
          obsidian: 'obsidian'
        }
      }
    },
    emptyOutDir: false,
    sourcemap: 'inline'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 