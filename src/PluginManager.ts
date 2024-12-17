import { Plugin, TFile, PluginManifest} from 'obsidian';
import { IPlugin, TPluginStatus, TPluginGroup } from './types';
import { Settings } from './Settings';

export class PluginManager {
    constructor(private plugin: Plugin) {}

    async getAllPlugins(): Promise<IPlugin[]> {
        const settings = await Settings.loadSettings();
        const notesFolder = settings.notesFolder;
        const plugins: IPlugin[] = [];

        // 1. Obtenir tous les plugins installés
        const manifests = Object.entries(this.plugin.app.plugins.manifests) as [string, PluginManifest][];
        
        for (const [id, manifest] of manifests) {
            // Ignorer notre propre plugin
            if (id === this.plugin.manifest.id) continue;

            // 2. Vérifier si une note existe pour ce plugin
            const filePath = `${notesFolder}/${id}.md`;
            const abstractFile = this.plugin.app.vault.getAbstractFileByPath(filePath);

            if (abstractFile instanceof TFile) {
                // Si la note existe, lire ses données
                const noteData = await this.readPluginNote(abstractFile);
                if (noteData) {
                    plugins.push(noteData);
                }
            } else {
                // Si la note n'existe pas, la créer avec les données de base
                const newPlugin = await this.createPluginNote(id, manifest, notesFolder);
                if (newPlugin) {
                    plugins.push(newPlugin);
                }
            }
        }

        return plugins;
    }

    private async createPluginNote(id: string, manifest: PluginManifest, notesFolder: string): Promise<IPlugin | null> {
        const settings = await Settings.loadSettings();
        const folderExists = await this.plugin.app.vault.adapter.exists(notesFolder);
        if (!folderExists) {
            await this.plugin.app.vault.createFolder(notesFolder);
        }

        const filePath = `${notesFolder}/${id}.md`;
        const noteContent = `---
plugin: ${manifest.name}
id: ${id}
status: exploring
tags: []
group:
  - Sans groupe
rating: 0
urgency: 1
importance: 1
url: ${manifest.authorUrl || ''}
transcribe: false
activate: ${this.plugin.app.plugins.getPlugin(id)?.enabled || false}
description: ${manifest.description}
---

# ${manifest.name}

${manifest.description}

## Notes personnelles

`;
        await this.plugin.app.vault.create(filePath, noteContent);
        const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            return this.readPluginNote(file);
        }
        return null;
    }

    private async readPluginNote(file: TFile): Promise<IPlugin | null> {
        const content = await this.plugin.app.vault.read(file);
        const frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;

        if (frontmatter) {
            // Accepter soit un tableau soit une chaîne pour la rétrocompatibilité
            const groups = Array.isArray(frontmatter['group']) 
                ? frontmatter['group'] 
                : frontmatter['group']?.split(',').map((g: string) => g.trim()).filter((g: string) => g.length > 0) || ['Sans groupe'];

            const tags = Array.isArray(frontmatter['tags'])
                ? frontmatter['tags']
                : frontmatter['tags']?.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0) || [];

            return {
                id: frontmatter['id'],
                title: frontmatter['plugin'],
                status: [frontmatter['status'] as TPluginStatus],
                tags: tags,
                group: groups,
                rating: frontmatter['rating'] || 0,
                urgency: frontmatter['urgency'] || 1,
                importance: frontmatter['importance'] || 1,
                url: frontmatter['url'] || '',
                transcribe: frontmatter['transcribe'] || false,
                activate: frontmatter['activate'] === true,
                description: frontmatter['description'] || '',
                mdNote: file.path
            };
        }
        return null;
    }

    async updatePluginNote(plugin: IPlugin): Promise<void> {
        const settings = await Settings.loadSettings();
        const filePath = `${settings.notesFolder}/${plugin.id}.md`;
        const file = this.plugin.app.vault.getAbstractFileByPath(filePath);
        
        if (file instanceof TFile) {
            await this.plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
                frontmatter["plugin"] = plugin.title;
                frontmatter["id"] = plugin.id;
                frontmatter["status"] = plugin.status[0];
                frontmatter["tags"] = plugin.tags;
                frontmatter["group"] = plugin.group;
                frontmatter["rating"] = plugin.rating;
                frontmatter["urgency"] = plugin.urgency;
                frontmatter["importance"] = plugin.importance;
                frontmatter["url"] = plugin.url;
                frontmatter["transcribe"] = plugin.transcribe;
                frontmatter["activate"] = plugin.activate;
                frontmatter["description"] = plugin.description;
            });
        }
    }
} 