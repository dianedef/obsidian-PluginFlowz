import { Plugin, PluginManifest } from 'obsidian';
import { IPlugin, TPluginStatus } from './types';

export class PluginManager {
    constructor(private plugin: Plugin) {}

    async getInstalledPlugins(): Promise<IPlugin[]> {
        const plugins: IPlugin[] = [];
        const manifests = Object.entries(this.plugin.app.plugins.manifests) as [string, PluginManifest][];
        
        console.log('🔌 PluginManager - Détection des plugins:', manifests.length, 'plugins trouvés');
        
        // Parcourir tous les plugins installés
        for (const [id, manifest] of manifests) {
            // Ignorer notre propre plugin
            if (id === this.plugin.manifest.id) {
                console.log('🔌 PluginManager - Ignoré:', id, '(notre plugin)');
                continue;
            }

            plugins.push({
                title: manifest.name,
                url: manifest.authorUrl || '',
                tags: [],
                status: ['exploring' as TPluginStatus],
                activate: this.plugin.app.plugins.getPlugin(id)?.enabled || false,
                description: manifest.description,
                transcribe: false,
                group: ['Sans groupe'],
                rating: 0,
                urgency: 1,
                importance: 1,
                mdNote: `${id}.md`
            });
            console.log('🔌 PluginManager - Ajouté:', manifest.name, '(', id, ')');
        }

        console.log('🔌 PluginManager - Total:', plugins.length, 'plugins ajoutés');
        return plugins;
    }

    async syncPlugins(): Promise<void> {
        console.log('🔄 PluginManager - Début de la synchronisation');
        
        // Charger les données existantes
        const data = await this.plugin.loadData();
        const currentPlugins = data?.plugins || [];
        console.log('🔄 PluginManager - Plugins existants:', currentPlugins.length);
        
        // Récupérer les plugins installés
        const installedPlugins = await this.getInstalledPlugins();
        console.log('🔄 PluginManager - Plugins installés:', installedPlugins.length);
        
        // Fusionner les données
        const mergedPlugins = installedPlugins.map(newPlugin => {
            const existingPlugin = currentPlugins.find(p => p.title === newPlugin.title);
            return existingPlugin ? { ...newPlugin, ...existingPlugin } : newPlugin;
        });
        
        console.log('🔄 PluginManager - Plugins après fusion:', mergedPlugins.length);
        
        // Sauvegarder
        await this.plugin.saveData({
            ...data,
            plugins: mergedPlugins
        });
        console.log('🔄 PluginManager - Synchronisation terminée');
    }
} 