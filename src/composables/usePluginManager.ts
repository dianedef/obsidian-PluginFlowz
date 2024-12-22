import { ref } from 'vue'
import { Plugin, TFile, Notice } from 'obsidian'
import type { IPlugin } from '../types'
import { Settings } from '../Settings'

const plugin = ref<Plugin | null>(null)

export function usePluginManager() {
    const initializeManager = async (p: Plugin) => {
        plugin.value = p
        
        // Initialiser les Settings avec le plugin
        await Settings.initialize(p)
        
        // Écouter les erreurs de plugin d'Obsidian
        plugin.value.app.workspace.on('plugin-error' as any, (error: Error, pluginId: string) => {
            const errorMessage = `Erreur du plugin ${pluginId}: ${error.message}`
            console.error('Plugin error:', error)
            new Notice(errorMessage, 8000)
        })

        // Vérifier et créer le dossier des notes si nécessaire
        const settings = await Settings.loadSettings()
        const notesFolder = settings.notesFolder
        
        // Vérifier si le dossier existe
        const folderExists = await plugin.value.app.vault.adapter.exists(notesFolder)
        if (!folderExists) {
            try {
                await plugin.value.app.vault.createFolder(notesFolder)
                console.log(`Dossier ${notesFolder} créé avec succès`)
                new Notice(`Dossier ${notesFolder} créé avec succès`)
            } catch (error) {
                console.error('Erreur lors de la création du dossier des notes:', error)
                new Notice('Erreur lors de la création du dossier des notes')
                throw error
            }
        } else {
            console.log(`Dossier ${notesFolder} existe déjà`)
        }
    }

    const getPluginManager = () => plugin.value

    const getAllPlugins = async (): Promise<IPlugin[]> => {
        if (!plugin.value) {
            console.warn('Plugin manager not initialized')
            return []
        }

        // Récupérer tous les plugins depuis le plugin principal
        const manifests = plugin.value.app.plugins.manifests
        const plugins = Object.values(manifests).map(manifest => ({
            id: manifest.id,
            title: manifest.name,
            description: manifest.description,
            version: manifest.version,
            author: manifest.author,
            repository: manifest.repo,
            status: ['exploring'],
            tags: [],
            group: ['Sans groupe'],
            rating: 0,
            urgency: 1,
            importance: 1,
            url: manifest.authorUrl || '',
            transcribe: false,
            activate: plugin.value?.app.plugins.enabledPlugins.has(manifest.id) || false
        }))

        // Créer les notes pour tous les plugins
        for (const pluginData of plugins) {
            try {
                const settings = await Settings.loadSettings()
                const filePath = `${settings.notesFolder}/${pluginData.id}.md`
                const existingFile = plugin.value.app.vault.getAbstractFileByPath(filePath)

                if (!existingFile) {
                    console.log(`Création de la note pour ${pluginData.title}...`)
                    await updatePluginNote(pluginData)
                }
            } catch (error) {
                console.error(`Erreur lors de la création de la note pour ${pluginData.title}:`, error)
            }
        }

        return plugins
    }

    const updatePluginNote = async (pluginData: IPlugin): Promise<void> => {
        if (!plugin.value) {
            const error = 'Plugin manager not initialized'
            console.warn(error)
            new Notice(error)
            throw new Error(error)
        }

        try {
            // Mettre à jour le statut d'activation du plugin
            if (pluginData.activate) {
                try {
                    await (plugin.value.app as any).plugins.enablePluginAndSave(pluginData.id)
                    new Notice(`Plugin ${pluginData.title} activé avec succès`)
                } catch (error) {
                    console.error(`Erreur lors de l'activation du plugin ${pluginData.title}:`, error)
                    pluginData.activate = false
                    throw error
                }
            } else {
                try {
                    await (plugin.value.app as any).plugins.disablePluginAndSave(pluginData.id)
                    new Notice(`Plugin ${pluginData.title} désactivé avec succès`)
                } catch (error) {
                    console.error(`Erreur lors de la désactivation du plugin ${pluginData.title}:`, error)
                    pluginData.activate = true
                    throw error
                }
            }

            // Récupérer les settings
            const settings = await Settings.loadSettings()
            const notesFolder = settings.notesFolder
            const filePath = `${notesFolder}/${pluginData.id}.md`

            try {
                const existingFile = plugin.value.app.vault.getAbstractFileByPath(filePath) as TFile
                if (existingFile) {
                    // Vérifier si le fichier a des métadonnées valides
                    const metadata = plugin.value.app.metadataCache.getFileCache(existingFile)?.frontmatter
                    const hasValidMetadata = metadata && 
                        metadata.plugin && 
                        metadata.id && 
                        metadata.status

                    if (!hasValidMetadata) {
                        console.log(`Métadonnées manquantes pour ${pluginData.title}, recréation du fichier...`)
                        // Sauvegarder le contenu existant
                        const existingContent = await plugin.value.app.vault.read(existingFile)
                        const contentWithoutFrontmatter = existingContent.replace(/^---[\s\S]*?---\n/, '')

                        // Créer le nouveau contenu avec les métadonnées
                        const template = settings.template
                        let content = template
                            .replace('{{name}}', pluginData.title)
                            .replace('{{description}}', pluginData.description || '')
                            .replace('{{url}}', pluginData.repository || '')
                            .replace('{{version}}', pluginData.version || '')
                            .replace('{{author}}', pluginData.author || '')
                            .replace('{{status}}', pluginData.status.join(', '))
                            .replace('{{rating}}', pluginData.rating.toString())
                            .replace('{{tags}}', pluginData.tags.join(', '))
                            .replace('{{activate}}', pluginData.activate ? 'Activé' : 'Désactivé')

                        // Ajouter le contenu existant après les métadonnées
                        content += '\n' + contentWithoutFrontmatter

                        // Supprimer l'ancien fichier et créer le nouveau
                        await plugin.value.app.vault.delete(existingFile)
                        await plugin.value.app.vault.create(filePath, content)
                        new Notice(`Métadonnées recréées pour ${pluginData.title}`)
                    } else {
                        // Mettre à jour les métadonnées existantes
                        await plugin.value.app.fileManager.processFrontMatter(existingFile, (frontmatter) => {
                            frontmatter["plugin"] = pluginData.title
                            frontmatter["id"] = pluginData.id
                            frontmatter["status"] = pluginData.status[0]
                            frontmatter["tags"] = pluginData.tags
                            frontmatter["group"] = pluginData.group
                            frontmatter["rating"] = pluginData.rating
                            frontmatter["urgency"] = pluginData.urgency
                            frontmatter["importance"] = pluginData.importance
                            frontmatter["url"] = pluginData.url
                            frontmatter["transcribe"] = pluginData.transcribe
                            frontmatter["activate"] = pluginData.activate
                            frontmatter["description"] = pluginData.description
                        })
                    }
                } else {
                    // Créer un nouveau fichier
                    const template = settings.template
                    let content = `---
plugin: ${pluginData.title}
id: ${pluginData.id}
status: ${pluginData.status[0]}
tags: [${pluginData.tags.join(', ')}]
group: [${pluginData.group.join(', ')}]
rating: ${pluginData.rating}
urgency: ${pluginData.urgency}
importance: ${pluginData.importance}
url: ${pluginData.url}
transcribe: ${pluginData.transcribe}
activate: ${pluginData.activate}
description: ${pluginData.description}
---

${template
    .replace('{{name}}', pluginData.title)
    .replace('{{description}}', pluginData.description || '')
    .replace('{{url}}', pluginData.repository || '')
    .replace('{{version}}', pluginData.version || '')
    .replace('{{author}}', pluginData.author || '')
    .replace('{{status}}', pluginData.status.join(', '))
    .replace('{{rating}}', pluginData.rating.toString())
    .replace('{{tags}}', pluginData.tags.join(', '))
    .replace('{{activate}}', pluginData.activate ? 'Activé' : 'Désactivé')}`

                    await plugin.value.app.vault.create(filePath, content)
                }
            } catch (error) {
                const errorMessage = `Erreur lors de la mise à jour de la note: ${error.message}`
                console.error(errorMessage)
                new Notice(errorMessage, 5000)
                throw new Error(errorMessage)
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Erreur inconnue lors de la mise à jour du plugin'
            console.error('Erreur détaillée:', error)
            new Notice(errorMessage)
            throw error
        }
    }

    const deletePluginNote = async (pluginData: IPlugin): Promise<void> => {
        if (!plugin.value) {
            console.warn('Plugin manager not initialized')
            return
        }

        const settings = await Settings.loadSettings()
        const filePath = `${settings.notesFolder}/${pluginData.title}.md`

        // Vérifier si le fichier existe
        const existingFile = plugin.value.app.vault.getAbstractFileByPath(filePath)
        if (existingFile) {
            try {
                await plugin.value.app.vault.delete(existingFile)
            } catch (error) {
                console.error('Erreur lors de la suppression de la note:', error)
                throw error
            }
        }
    }

    return {
        initializeManager,
        getAllPlugins,
        updatePluginNote,
        deletePluginNote,
        getPluginManager
    }
} 