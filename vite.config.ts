import { defineConfig } from 'vite';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plugin Vite personnalisé pour le hot reload sélectif
function selectiveHotReload(): Plugin {
   let modifiedPlugin = null;
   let isInitialBuild = true;
   let originalConsole = null;

   return {
      name: 'selective-hot-reload',
      buildStart() {
         // Sauvegarder la console originale au démarrage
         if (!originalConsole) {
            originalConsole = console.log;
            console.log = (...args) => {
               const message = args.join(' ');
               
               // Toujours afficher les messages de configuration et le premier build
               if (isInitialBuild || 
                   message.includes('Configuration initiale') || 
                   message.includes('Found plugin:') ||
                   message.includes('vite v')) {
                  originalConsole.apply(console, args);
                  return;
               }

               // Pour les builds suivants, filtrer les messages
               if (modifiedPlugin) {
                  if (message.includes(modifiedPlugin) || 
                      message.includes('modules transformed') ||
                      message.includes('build started') ||
                      message.includes('built in')) {
                     originalConsole.apply(console, args);
                  }
               }
            };
         }
      },
      buildEnd() {
         if (isInitialBuild) {
            isInitialBuild = false;
         }
      },
      closeBundle() {
         // Restaurer la console originale à la fin
         if (originalConsole) {
            console.log = originalConsole;
         }
      },
      watchChange(id, change) {
         // Identifier le plugin modifié à partir du chemin du fichier
         modifiedPlugin = plugins.find(plugin => id.includes(path.join(__dirname, plugin)));
         if (modifiedPlugin) {
            originalConsole(`\n🔍 Modification détectée dans: ${modifiedPlugin}`);
         }
      }
   };
}

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

console.log(`\n📦 Configuration initiale:`);
console.log(`- Nombre de plugins: ${plugins.length}`);
console.log(`- Plugins trouvés:`, plugins);

export default defineConfig(({ mode }) => ({
   plugins: [selectiveHotReload()],
   build: {
      lib: {
         entry: inputs,
         name: 'ObsidianPlugins',
         formats: ['cjs']
      },
      sourcemap: 'inline',
      cssCodeSplit: false,
      minify: mode === 'development' ? false : true,
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
      emptyOutDir: false,
      watch: {
         buildDelay: 100,
         clearScreen: false,
      }
   }
})); 