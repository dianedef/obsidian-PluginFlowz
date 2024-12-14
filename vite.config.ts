import { defineConfig } from 'vite';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Trouver automatiquement tous les plugins
const plugins = fs.readdirSync(__dirname)
   .filter(dir => dir.startsWith('obsidian-') || dir.startsWith('@obsidian-'))
   .filter(dir => {
      const mainTs = path.resolve(__dirname, dir, 'src/main.ts');
      const mainJs = path.resolve(__dirname, dir, 'src/main.js');
      if (fs.existsSync(mainTs) && fs.statSync(mainTs).isFile()) {
         return true;
      }
      if (fs.existsSync(mainJs) && fs.statSync(mainJs).isFile()) {
         return true;
      }
      return false;
   });

// Créer les entrées pour chaque plugin
const inputs = Object.fromEntries(
   plugins.map(plugin => [
      plugin,
      path.resolve(__dirname, plugin, 'src/main.ts')
   ])
);

export default defineConfig({
   build: {
      chunkSizeWarningLimit: 1000,
      watch: {
         include: ['obsidian-*/src/**', '@obsidian-*/src/**'],
      },
      rollupOptions: {
         input: inputs,
         external: [
               'obsidian',
               '@codemirror/view',
               '@codemirror/state',
               '@codemirror/language',
               'events',
               'child_process',
               'fs',
               'https',
               'os',
               'stream',
               'fast-xml-parser',
               'node-fetch',
               'cheerio',
               'axios'
         ],
         output: {
               entryFileNames: (chunkInfo) => {
                  const pluginName = chunkInfo.name;
                  return `${pluginName}/main.js`;
               },
               format: 'cjs',
               globals: {
                  'obsidian': 'obsidian',
                  '@codemirror/view': 'CodeMirror.view',
                  '@codemirror/state': 'CodeMirror.state',
                  '@codemirror/language': 'CodeMirror.language'
               }
         }
      },
      outDir: '.',
      emptyOutDir: false
   },
   optimizeDeps: {
      include: ['video.js', 'videojs-youtube'],
      exclude: ['yt-dlp-wrap']
   },
   resolve: {
      alias: {
         'video.js': 'video.js/dist/video.js'
      },
      extensions: ['.ts', '.js']
   }
}); 