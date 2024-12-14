import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('           🔎 Scanning...');

// Trouver automatiquement tous les plugins
const plugins = fs.readdirSync(__dirname)
   .filter(dir => dir.startsWith('obsidian-') || dir.startsWith('@obsidian-'))
   .filter(dir => {
      const mainTs = path.resolve(__dirname, dir, 'src/main.ts');
      const mainJs = path.resolve(__dirname, dir, 'src/main.js');
      try {
         if (fs.existsSync(mainTs) && fs.statSync(mainTs).isFile()) {
            console.log(`           📂 Found -> ${dir}`);
            return true;
         }
         if (fs.existsSync(mainJs) && fs.statSync(mainJs).isFile()) {
            console.log(`           📂 Found -> ${dir}`);
            return true;
         }
      } catch (error) {
         console.warn(`           ⚠️ Skipping invalid plugin: ${dir}`);
      }
      return false;
   });

console.log('           📦 Building...');

// Configuration de base pour esbuild
const baseConfig = {
   bundle: true,
   platform: 'node',
   format: 'cjs',
   target: 'es2018',
   sourcemap: 'inline',
   logLevel: 'silent',
   external: [
      'obsidian',
      '@codemirror/view',
      '@codemirror/state',
      '@codemirror/language'
   ],
   loader: {
      '.ts': 'ts'
   },
   treeShaking: true,
   minify: false
};

let isInitialBuild = true;

// Créer un contexte pour chaque plugin
const contexts = await Promise.all(plugins.map(async plugin => {
   const entryPoint = path.resolve(__dirname, plugin, 'src/main.ts');
   const outfile = path.resolve(__dirname, plugin, 'main.js');

   const ctx = await esbuild.context({
      ...baseConfig,
      entryPoints: [entryPoint],
      outfile,
      plugins: [{
         name: 'log-rebuild',
         setup(build) {
            let buildStart = Date.now();

            build.onStart(() => {
               buildStart = Date.now();
               if (!isInitialBuild) {
                  const changedFile = build.initialOptions.stdin?.contents || '';
                  if (changedFile) {
                     console.log(`\n           📝 Changed file: ${changedFile}`);
                  }
                  console.log(`           🏗️ Building ->    🌱 ${plugin}...`);
               }
            });
            
            build.onEnd(result => {
               const date = new Date().toLocaleTimeString();
               const buildTime = Date.now() - buildStart;
               
               if (result.errors.length > 0) {
                  console.error(`[${date}] ❌ Failed -> ${plugin}:`);
                  result.errors.forEach(error => {
                     console.error(`           🚫 ${error.text}`);
                  });
               } else {
                  if (isInitialBuild) {
                     console.log(`[${date}] 🎯 Success ->    🌺 ${plugin}`);
                  } else {
                     console.log(`[${date}] ⚡ Success ->    ⏳ ${buildTime}ms 🌷 ${plugin}`);
                     console.log(`           ✨ Watching...\n`);
                  }
               }
            });
         }
      }]
   });

   return { plugin, ctx };
}));

// Mode watch
if (process.argv.includes('--watch')) {
   // Faire le build initial de tous les plugins
   console.log('\n           🚀 Starting build...');
   await Promise.all(contexts.map(({ ctx }) => ctx.rebuild()));
   console.log('           ✅ Success!\n');
   
   isInitialBuild = false;
   console.log('           👀 Watching...\n');
   await Promise.all(contexts.map(({ ctx }) => ctx.watch()));
} 
// Build unique
else {
   await Promise.all(contexts.map(async ({ ctx }) => {
      await ctx.rebuild();
      await ctx.dispose();
   }));
   console.log('           ✅ Success!');
} 