import { ref } from 'vue'
import { Plugin, WorkspaceLeaf, Modal } from 'obsidian'
import type { TViewMode } from '../types'
import { Settings } from '../Settings'
import { createApp } from 'vue'
import Dashboard from '../components/Dashboard.vue'

class DashboardModal extends Modal {
    private vueApp: ReturnType<typeof createApp> | null = null;

    constructor(plugin: Plugin) {
        super(plugin.app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        // Créer le conteneur pour Vue
        const mountPoint = contentEl.createDiv({ cls: 'pluginflowz-modal-container' });
        
        // Créer et monter l'application Vue
        this.vueApp = createApp(Dashboard);
        this.vueApp.mount(mountPoint);
    }

    onClose() {
        if (this.vueApp) {
            this.vueApp.unmount();
            this.vueApp = null;
        }
        const { contentEl } = this;
        contentEl.empty();
    }
}

interface ViewModeState {
    plugin: Plugin | null;
    currentMode: TViewMode;
    activeLeafId: string | null;
    modal: DashboardModal | null;
}

const state = ref<ViewModeState>({
    plugin: null,
    currentMode: 'tab',
    activeLeafId: null,
    modal: null
})

export function useViewMode() {
    const initializeViewMode = async (p: Plugin) => {
        state.value.plugin = p
        
        // Charger le mode depuis les settings
        try {
            const settings = await Settings.loadSettings()
            state.value.currentMode = settings.currentMode || 'tab'
            state.value.activeLeafId = settings.activeLeafId || null
        } catch (error) {
            console.warn('[PluginFlowz] Erreur lors du chargement des settings:', error)
        }
    }

    const setView = async (mode: TViewMode): Promise<void> => {
        if (!state.value.plugin) {
            throw new Error('[PluginFlowz] ViewMode non initialisé')
        }

        try {
            const workspace = state.value.plugin.app.workspace

            // Fermer la vue existante si elle existe
            const leaves = workspace.getLeavesOfType("pluginflowz-view")
            leaves.forEach(leaf => leaf.detach())

            // Fermer la modale si elle existe
            if (state.value.modal) {
                state.value.modal.close()
                state.value.modal = null
            }

            let leaf: WorkspaceLeaf | null = null

            // Créer la nouvelle vue selon le mode
            switch (mode) {
                case 'tab':
                    leaf = workspace.getLeaf('tab')
                    break
                    
                case 'sidebar':
                    leaf = workspace.getRightLeaf(false)
                    break
                    
                case 'popup':
                    // Créer et ouvrir la modale
                    state.value.modal = new DashboardModal(state.value.plugin)
                    state.value.modal.open()
                    break
                    
                default:
                    throw new Error(`[PluginFlowz] Mode non supporté: ${mode}`)
            }

            if (mode !== 'popup' && !leaf) {
                throw new Error('[PluginFlowz] Impossible de créer la vue')
            }

            if (leaf) {
                // Définir la vue
                await leaf.setViewState({
                    type: "pluginflowz-view",
                    active: true
                })

                // Activer la vue
                workspace.revealLeaf(leaf)

                // Générer un ID unique pour la feuille si nécessaire
                const leafId = (leaf as any).id || crypto.randomUUID()
                state.value.activeLeafId = leafId
            }

            // Mettre à jour l'état
            state.value.currentMode = mode

            // Sauvegarder dans les settings
            await Settings.saveSettings({ 
                currentMode: mode,
                activeLeafId: mode === 'popup' ? null : state.value.activeLeafId
            })

        } catch (error) {
            console.error('[PluginFlowz] Erreur lors du changement de vue:', error)
            throw error
        }
    }

    const getCurrentMode = (): TViewMode => {
        return state.value.currentMode
    }

    const getActiveLeafId = (): string | null => {
        return state.value.activeLeafId
    }

    const isViewActive = (): boolean => {
        if (state.value.currentMode === 'popup') {
            return state.value.modal !== null
        }
        
        if (!state.value.plugin || !state.value.activeLeafId) return false
        
        const leaves = state.value.plugin.app.workspace.getLeavesOfType("pluginflowz-view")
        return leaves.some(leaf => (leaf as any).id === state.value.activeLeafId)
    }

    return {
        initializeViewMode,
        setView,
        getCurrentMode,
        getActiveLeafId,
        isViewActive
    }
} 