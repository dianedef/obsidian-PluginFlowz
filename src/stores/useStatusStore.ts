import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TPluginStatus } from '../types'
import { Settings } from '../Settings'

export const useStatusStore = defineStore('status', () => {
  const selectedStatuses = ref<TPluginStatus[]>([])

  async function initializeStore() {
    try {
      const settings = await Settings.loadSettings()
      selectedStatuses.value = settings.selectedStatuses || []
    } catch (error) {
      console.error('[PluginFlowz] Erreur lors de l\'initialisation du store:', error)
      selectedStatuses.value = []
    }
  }

  async function toggleStatus(status: TPluginStatus) {
    try {
      const index = selectedStatuses.value.indexOf(status)
      const newStatuses = [...selectedStatuses.value]
      
      if (index > -1) {
        newStatuses.splice(index, 1)
      } else {
        newStatuses.push(status)
      }
      
      selectedStatuses.value = newStatuses

      // Sauvegarder dans les settings
      const settings = await Settings.loadSettings()
      await Settings.saveSettings({
        ...settings,
        selectedStatuses: newStatuses
      })
    } catch (error) {
      console.error('[PluginFlowz] Erreur lors de la mise à jour des statuts:', error)
    }
  }

  function isSelected(status: TPluginStatus): boolean {
    return selectedStatuses.value.includes(status)
  }

  return {
    selectedStatuses,
    initializeStore,
    toggleStatus,
    isSelected
  }
}) 