<template>
  <div class="pluginflowz-dashboard-container">
    <!-- Loading overlay -->
    <div 
      v-if="isLoading"
      class="pluginflowz-loading-overlay"
    >
      <div class="pluginflowz-loading-spinner">
        <div class="spinner"></div>
        <span>{{ t('dashboard.loading') }}</span>
      </div>
    </div>

    <!-- Header avec recherche et toggle de vue -->
    <div class="pluginflowz-header">
      <div class="pluginflowz-search">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="t('dashboard.searchPlaceholder')"
          class="pluginflowz-search-input"
          :disabled="isLoading"
        />
      </div>
      
      <div class="pluginflowz-header-buttons">
        <button 
          class="pluginflowz-view-button"
          @click="toggleView"
          :disabled="isLoading"
        >
          {{ t(currentViewMode === 'cards' ? 'dashboard.listView' : 'dashboard.cardView') }}
        </button>

        <button 
          class="pluginflowz-view-button"
          @click="toggleNotesDisplay"
          :disabled="isLoading"
        >
          {{ t(showNotes ? 'dashboard.hideNotes' : 'dashboard.showNotes') }}
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="pluginflowz-filters">
      <div class="pluginflowz-filter-groups">
        <tri-state-toggle 
          :initial-state="globalToggleState"
          @change="handleGlobalToggle"
          :disabled="isLoading"
        />
      </div>

      <div class="pluginflowz-filter-status">
        <template v-for="status in availableStatuses" :key="status">
          <status-tag 
            :status="status"
            :selected="statusStore.isSelected(status)"
            :is-filter="true"
            @filter="statusStore.toggleStatus(status)"
            :disabled="isLoading"
          />
        </template>
      </div>

      <div class="pluginflowz-filter-tags">
        <template v-for="tag in uniqueTags" :key="tag">
          <tag 
            :text="tag"
            :removable="false"
            @click="filterByTag(tag)"
            :disabled="isLoading"
          />
        </template>
      </div>
    </div>

    <!-- Liste ou Grille de plugins -->
    <plugin-list
      v-if="currentViewMode === 'list'"
      :plugins="filteredPlugins"
      :show-notes="showNotes"
      @update="handlePluginUpdate"
      @delete="handlePluginDelete"
      :disabled="isLoading"
    />
    <plugin-cards
      v-else
      :plugins="filteredPlugins"
      :show-notes="showNotes"
      @update="handlePluginUpdate"
      @delete="handlePluginDelete"
      :disabled="isLoading"
    />

    <!-- Message si aucun plugin -->
    <div 
      v-if="!plugins.length && !isLoading"
      class="pluginflowz-no-plugins"
    >
      {{ t('dashboard.noPlugins') }}
    </div>

    <!-- Message si aucun résultat après filtrage -->
    <div 
      v-if="plugins.length > 0 && filteredPlugins.length === 0 && !isLoading"
      class="pluginflowz-no-results"
    >
      {{ t('settings.plugins.noResults') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive, nextTick } from 'vue'
import { Notice } from 'obsidian'
import type { Plugin } from 'obsidian'
import type { IPlugin, TPluginStatus, TDashboardView } from '../types'
import TriStateToggle from './ui/TriStateToggle.vue'
import StatusTag from './ui/StatusTag.vue'
import Tag from './ui/Tag.vue'
import PluginList from './PluginList.vue'
import PluginCards from './PluginCards.vue'
import { useTranslations } from '../composables/useTranslations'
import { usePluginManager } from '../composables/usePluginManager'
import { Settings } from '../Settings'
import { useStatusStore } from '../stores/useStatusStore'

// Props
const props = defineProps<{
  onLoaded?: (plugins: IPlugin[]) => void
}>()

// Composables
const { t } = useTranslations()
const { getAllPlugins, updatePluginNote, deletePluginNote, getPluginManager } = usePluginManager()
const statusStore = useStatusStore()

// État réactif
const plugins = ref<IPlugin[]>([])
const searchQuery = ref('')
const currentViewMode = ref<TDashboardView>('cards')
const isLoading = ref(false)
const showNotes = ref(false)

// Ajouter une ref pour suivre les mises à jour en cours
const updatingPlugins = ref(new Set<string>())

// Computed properties
const availableStatuses = computed<TPluginStatus[]>(() => 
  ['exploring', 'active', 'inactive', 'ignoring']
)

const uniqueTags = computed(() => 
  [...new Set(plugins.value.flatMap(p => p.tags))]
)

// Modifier la computed property filteredPlugins pour enlever la gestion temporaire
const filteredPlugins = computed(() => {
  return plugins.value.filter(plugin => {
    // Filtre par recherche
    const matchesSearch = 
      plugin.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))

    // Filtre par status
    const matchesStatus = 
      statusStore.selectedStatuses.length === 0 || 
      plugin.status.some(s => statusStore.selectedStatuses.includes(s as TPluginStatus))

    return matchesSearch && matchesStatus
  })
})

// Computed property pour l'état du toggle global
const globalToggleState = computed<'left' | 'middle' | 'right'>(() => {
  const activeCount = plugins.value.filter(p => p.activate).length;
  if (activeCount === 0) return 'left';
  if (activeCount === plugins.value.length) return 'right';
  return 'middle';
})

// Méthodes
const toggleView = () => {
  currentViewMode.value = currentViewMode.value === 'cards' ? 'list' : 'cards'
}

const handleGlobalToggle = async (state: 'left' | 'middle' | 'right') => {
  const newValue = state === 'right'
  isLoading.value = true
  const errors: string[] = []

  try {
    // Créer une copie des plugins pour les mises à jour
    const updatedPlugins = [...plugins.value]
    
    // Utiliser Promise.allSettled pour continuer même en cas d'erreur
    const updatePromises = updatedPlugins
      .filter(plugin => {
        const shouldUpdate = plugin.id !== 'pluginflowz'
        console.log(`Plugin ${plugin.id}: ${shouldUpdate ? 'à mettre à jour' : 'ignoré'}`)
        return shouldUpdate
      })
      .map(async (plugin) => {
        try {
          console.log(`Tentative de ${newValue ? 'activation' : 'désactivation'} de ${plugin.id}`)
          // Mettre à jour à la fois l'état d'activation et le statut
          const updatedPlugin = { 
            ...plugin, 
            activate: newValue,
            status: [newValue ? 'active' as TPluginStatus : 'inactive' as TPluginStatus]
          }
          await updatePluginNote(updatedPlugin)
          
          // Mettre à jour l'état dans la copie
          const index = updatedPlugins.findIndex(p => p.id === plugin.id)
          if (index !== -1) {
            updatedPlugins[index] = updatedPlugin
          }
          
          return { success: true, plugin: updatedPlugin }
        } catch (error) {
          console.error(`Erreur pour ${plugin.id}:`, error)
          errors.push(`${plugin.title}: ${error.message}`)
          return { success: false, plugin, error }
        }
      })

    await Promise.allSettled(updatePromises)
    
    // Mettre à jour l'état global avec la copie mise à jour
    plugins.value = updatedPlugins.map(plugin => ({
      ...plugin,
      activate: plugin.id === 'pluginflowz' ? true : plugin.activate
    }))

    // Afficher un résumé des erreurs s'il y en a
    if (errors.length > 0) {
      console.error('Erreurs lors de la mise à jour globale:', errors)
      new Notice(`${errors.length} plugins n'ont pas pu être ${newValue ? 'activés' : 'désactivés'}. Consultez la console pour plus de détails.`, 5000)
    } else {
      new Notice(`Tous les plugins ont été ${newValue ? 'activés' : 'désactivés'} avec succès.`)
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour globale:', error)
    new Notice('Une erreur est survenue lors de la mise à jour globale.')
  } finally {
    isLoading.value = false
  }
}

// Modifier handlePluginUpdate pour utiliser la réactivité de Vue
const handlePluginUpdate = async (plugin: IPlugin) => {
  // Si le plugin est déjà en cours de mise à jour, ignorer
  if (updatingPlugins.value.has(plugin.title)) {
    console.log('Plugin déjà en cours de mise à jour:', plugin.title)
    return
  }

  const index = plugins.value.findIndex(p => p.title === plugin.title)
  if (index !== -1) {
    // Marquer le plugin comme en cours de mise à jour
    updatingPlugins.value.add(plugin.title)
    
    try {
      // Sauvegarder l'état précédent
      const previousState = { ...plugins.value[index] }
      
      // Mettre à jour l'état local
      plugins.value[index] = { ...plugin }
      
      // Utiliser nextTick pour s'assurer que Vue a fini de mettre à jour le DOM
      await nextTick()
      
      // Sauvegarder dans Obsidian
      await updatePluginNote(plugin)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plugin:', error)
      // Restaurer l'état précédent en cas d'erreur
      if (error.message?.includes('ENOENT')) {
        // Si c'est une erreur de fichier manquant, forcer l'état à false
        plugins.value[index] = { ...plugins.value[index], activate: false }
      } else {
        // Pour les autres erreurs, restaurer l'état précédent
        plugins.value[index] = { ...plugins.value[index], activate: !plugin.activate }
      }
    } finally {
      // Retirer le plugin de la liste des mises à jour en cours
      updatingPlugins.value.delete(plugin.title)
    }
  }
}

const handlePluginDelete = async (plugin: IPlugin) => {
  try {
    await deletePluginNote(plugin)
    plugins.value = plugins.value.filter(p => p.title !== plugin.title)
  } catch (error) {
    console.error('Erreur lors de la suppression du plugin:', error)
  }
}

const filterByTag = (tag: string) => {
  searchQuery.value = tag
}

const loadPlugins = async (retryCount = 0, maxRetries = 3) => {
  isLoading.value = true
  try {
    plugins.value = await getAllPlugins()
    if (plugins.value.length === 0 && retryCount < maxRetries) {
      // Si aucun plugin n'est chargé et qu'on n'a pas dépassé le nombre max de tentatives
      console.log(`Tentative ${retryCount + 1}/${maxRetries} de chargement des plugins...`)
      // Attendre 500ms avant de réessayer
      setTimeout(() => loadPlugins(retryCount + 1, maxRetries), 500)
      return
    }
    // Si on a des plugins, appeler la callback onLoaded
    if (plugins.value.length > 0 && props.onLoaded) {
      props.onLoaded(plugins.value)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des plugins:', error)
    if (retryCount < maxRetries) {
      // En cas d'erreur, réessayer également
      setTimeout(() => loadPlugins(retryCount + 1, maxRetries), 500)
      return
    }
  } finally {
    isLoading.value = false
  }
}

// Sauvegarder le mode de vue quand il change
watch(currentViewMode, async (newMode) => {
  await Settings.saveSettings({
    currentViewMode: newMode
  })
})

// Charger les plugins au montage
onMounted(async () => {
  await statusStore.initializeStore()
  await loadPlugins()
})

const toggleNotesDisplay = () => {
  showNotes.value = !showNotes.value
}
</script> 