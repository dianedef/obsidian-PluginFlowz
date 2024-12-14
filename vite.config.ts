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
      try {
         if (fs.existsSync(mainTs) && fs.statSync(mainTs).isFile()) {
            console.log(`Found plugin: ${dir}`);
            return true;
         }
         if (fs.existsSync(mainJs) && fs.statSync(mainJs).isFile()) {
            console.log(`Found plugin: ${dir}`);
            return true;
         }
      } catch (error) {
         console.warn(`Skipping invalid plugin: ${dir}`);
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

console.log(`Building ${plugins.length} plugins...`);

export default defineConfig({
   build: {
      lib: {
         entry: inputs,
         name: 'ObsidianPlugins',
         formats: ['cjs']
      },
      sourcemap: 'inline',
      cssCodeSplit: false,
      rollupOptions: {
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
            'stream'
         ],
         output: {
            entryFileNames: '[name]/main.js',
            format: 'cjs',
            exports: 'default',
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
   }
}); 