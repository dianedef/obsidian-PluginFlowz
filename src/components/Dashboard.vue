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
            :selected="selectedStatuses.has(status)"
            @click="toggleStatus(status)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { IPlugin, TPluginStatus, TDashboardView } from '../types'
import TriStateToggle from './ui/TriStateToggle.vue'
import StatusTag from './ui/StatusTag.vue'
import Tag from './ui/Tag.vue'
import PluginList from './PluginList.vue'
import PluginCards from './PluginCards.vue'
import { useTranslations } from '../composables/useTranslations'
import { usePluginManager } from '../composables/usePluginManager'
import { Settings } from '../Settings'

// Props
const props = defineProps<{
  onLoaded?: (plugins: IPlugin[]) => void
}>()

// Composables
const { t } = useTranslations()
const { getAllPlugins, updatePluginNote, deletePluginNote } = usePluginManager()

// État réactif
const plugins = ref<IPlugin[]>([])
const searchQuery = ref('')
const currentViewMode = ref<TDashboardView>('cards')
const selectedStatuses = ref<Set<TPluginStatus>>(new Set())
const isLoading = ref(false)
const showNotes = ref(false)

// Computed properties
const availableStatuses = computed<TPluginStatus[]>(() => 
  ['exploring', 'active', 'inactive', 'ignoring']
)

const uniqueTags = computed(() => 
  [...new Set(plugins.value.flatMap(p => p.tags))]
)

const filteredPlugins = computed(() => {
  return plugins.value.filter(plugin => {
    // Filtre par recherche
    const matchesSearch = 
      plugin.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))

    // Filtre par status
    const matchesStatus = 
      selectedStatuses.value.size === 0 || 
      plugin.status.some(s => selectedStatuses.value.has(s as TPluginStatus))

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

const toggleStatus = (status: TPluginStatus) => {
  if (selectedStatuses.value.has(status)) {
    selectedStatuses.value.delete(status)
  } else {
    selectedStatuses.value.add(status)
  }
}

const handleGlobalToggle = async (state: 'left' | 'middle' | 'right') => {
  const newValue = state === 'right'
  isLoading.value = true
  try {
    for (const plugin of plugins.value) {
      plugin.activate = newValue
      await updatePluginNote(plugin)
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour globale:', error)
  } finally {
    isLoading.value = false
  }
}

const handlePluginUpdate = async (plugin: IPlugin) => {
  const index = plugins.value.findIndex(p => p.title === plugin.title)
  if (index !== -1) {
    plugins.value[index] = plugin
    try {
      await updatePluginNote(plugin)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plugin:', error)
      // Restaurer l'état précédent en cas d'erreur
      plugins.value[index] = { ...plugins.value[index] }
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
  await loadPlugins()
})

// Exposer les méthodes nécessaires
defineExpose({
  refresh: loadPlugins
})

const toggleNotesDisplay = () => {
  showNotes.value = !showNotes.value
}
</script> 

<style scoped>
.pluginflowz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pluginflowz-header-buttons {
  display: flex;
  gap: 0.5rem;
}

.pluginflowz-view-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style> 