import { ref } from 'vue'
import type { Plugin, TFile } from 'obsidian'
import type { IPlugin } from '../types'
import { Settings } from '../Settings'

const plugin = ref<Plugin | null>(null)

export function usePluginManager() {
    const initializeManager = (p: Plugin) => {
        plugin.value = p
    }

    const getAllPlugins = async (): Promise<IPlugin[]> => {
        if (!plugin.value) {
            console.warn('Plugin manager not initialized')
            return []
        }

        // Récupérer tous les plugins depuis le plugin principal
        const manifests = plugin.value.app.plugins.manifests
        return Object.values(manifests).map(manifest => ({
            id: manifest.id,
            title: manifest.name,
            description: manifest.description,
            version: manifest.version,
            author: manifest.author,
            repository: manifest.repo,
            status: ['exploring'],
            tags: [],
            rating: 0,
            activate: plugin.value?.app.plugins.enabledPlugins.has(manifest.id) || false
        }))
    }

    const updatePluginNote = async (pluginData: IPlugin): Promise<void> => {
        if (!plugin.value) {
            console.warn('Plugin manager not initialized')
            return
        }

        // Mettre à jour le statut d'activation du plugin
        if (pluginData.activate) {
            await plugin.value.app.plugins.enablePlugin(pluginData.id)
        } else {
            await plugin.value.app.plugins.disablePlugin(pluginData.id)
        }

        // Récupérer les settings
        const settings = await Settings.loadSettings()
        const notesFolder = settings.notesFolder
        const template = settings.template

        // Créer le contenu de la note
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

        // Créer le chemin du fichier
        const filePath = `${notesFolder}/${pluginData.title}.md`

        // Vérifier si le dossier existe, sinon le créer
        if (!plugin.value.app.vault.getAbstractFileByPath(notesFolder)) {
            await plugin.value.app.vault.createFolder(notesFolder)
        }

        // Vérifier si le fichier existe
        const existingFile = plugin.value.app.vault.getAbstractFileByPath(filePath) as TFile

        try {
            if (existingFile) {
                // Mettre à jour le fichier existant
                await plugin.value.app.vault.modify(existingFile, content)
            } else {
                // Créer un nouveau fichier
                await plugin.value.app.vault.create(filePath, content)
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la note:', error)
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
        deletePluginNote
    }
} 