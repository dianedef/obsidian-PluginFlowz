<template>
  <div class="pluginflowz-cards-grid">
    <div 
      v-for="plugin in plugins" 
      :key="plugin.title"
      class="pluginflowz-card"
      :data-plugin-title="plugin.title"
    >
      <!-- Header avec titre et actions -->
      <div class="pluginflowz-card-header">
        <h3>{{ plugin.title }}</h3>
        <div class="pluginflowz-card-actions">
          <toggle-button
            :value="plugin.activate"
            @update:value="handleToggle(plugin, $event)"
          />
          <button 
            class="pluginflowz-more-button"
            @click="showOptions(plugin)"
          >
            <span class="more-vertical">⋮</span>
          </button>
        </div>
      </div>

      <!-- Status sous le titre -->
      <div class="pluginflowz-card-status-container">
        <status-tag 
          :status="plugin.status[0]" 
          @click="cycleStatus(plugin)"
        />
      </div>

      <!-- Description -->
      <p 
        v-if="plugin.description"
        class="pluginflowz-card-description"
        :title="t('settings.plugins.options.description')"
      >
        {{ plugin.description }}
      </p>

      <!-- Footer avec tags et stats -->
      <div class="pluginflowz-card-footer">
        <!-- Rating -->
        <div class="pluginflowz-card-rating">
          <rating-control
            v-model="plugin.rating"
            :show-reset="true"
            :title="t('settings.plugins.options.rating')"
          />
        </div>

        <!-- Tags -->
        <div class="pluginflowz-card-tags">
          <tag
            v-for="tag in plugin.tags"
            :key="tag"
            :text="tag"
            removable
            @remove="removeTag(plugin, tag)"
          />
          <button 
            class="pluginflowz-add-tag"
            @click="addTag(plugin)"
            :title="t('settings.plugins.add.name')"
          >
            +
          </button>
        </div>
      </div>

      <!-- Note du plugin -->
      <div 
        v-if="showNotes && plugin.note"
        class="pluginflowz-card-note"
      >
        <div class="note-content">
          {{ plugin.note }}
        </div>
      </div>
    </div>

    <!-- Modal pour l'ajout de tag -->
    <add-tag-modal
      v-if="showAddTagModal"
      @submit="handleTagSubmit"
      @close="showAddTagModal = false"
    />

    <!-- Ajouter le menu d'options -->
    <options-menu
      v-if="showOptionsMenu"
      :plugin="selectedPluginForOptions"
      :position="optionsMenuPosition"
      @open="openInObsidian"
      @github="openOnGithub"
      @copy-id="copyPluginId"
      @delete="deletePlugin"
      @close="showOptionsMenu = false"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import type { IPlugin, TPluginStatus } from '../types'
import StatusTag from './ui/StatusTag.vue'
import Tag from './ui/Tag.vue'
import ToggleButton from './ui/ToggleButton.vue'
import RatingControl from './ui/RatingControl.vue'
import AddTagModal from './ui/AddTagModal.vue'
import { useTranslations } from '../composables/useTranslations'
import OptionsMenu from './ui/OptionsMenu.vue'

const props = defineProps<{
  plugins: IPlugin[]
  showNotes?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', plugin: IPlugin): void
}>()

const { t } = useTranslations()

// État pour le modal
const showAddTagModal = ref(false)
const selectedPluginForTag = ref<IPlugin | null>(null)

// État pour le menu d'options
const showOptionsMenu = ref(false)
const selectedPluginForOptions = ref<IPlugin | null>(null)
const optionsMenuPosition = ref({ x: 0, y: 0 })

// Méthodes
const handleToggle = async (plugin: IPlugin, value: boolean) => {
  try {
    // Mettre à jour à la fois l'état d'activation et le statut
    const updatedPlugin = { 
      ...plugin, 
      activate: value,
      status: [value ? 'active' as TPluginStatus : 'inactive' as TPluginStatus]
    }
    await emit('update', updatedPlugin)
  } catch (error) {
    console.error('Erreur lors du toggle:', error)
    // Forcer la mise à jour de l'état local pour refléter l'état réel
    plugin.activate = !value
  }
}

const cycleStatus = async (plugin: IPlugin) => {
  const statuses: TPluginStatus[] = ['exploring', 'active', 'inactive', 'ignoring']
  const currentIndex = statuses.indexOf(plugin.status[0] as TPluginStatus)
  const nextIndex = (currentIndex + 1) % statuses.length
  const newStatus = statuses[nextIndex]
  
  // Créer une copie du plugin avec le nouveau statut
  const updatedPlugin = { 
    ...plugin, 
    status: [newStatus],
    // Si le nouveau statut est 'active', on active le plugin
    // Si le nouveau statut est 'inactive', on désactive le plugin
    // Pour les autres statuts, on garde l'état actuel
    activate: newStatus === 'active' ? true : 
             newStatus === 'inactive' ? false : 
             plugin.activate
  }

  // Émettre la mise à jour
  await emit('update', updatedPlugin)
}

const removeTag = (plugin: IPlugin, tagToRemove: string) => {
  emit('update', {
    ...plugin,
    tags: plugin.tags.filter(tag => tag !== tagToRemove)
  })
}

const addTag = async (plugin: IPlugin) => {
  selectedPluginForTag.value = plugin
  showAddTagModal.value = true
}

const handleTagSubmit = (tag: string) => {
  if (selectedPluginForTag.value && !selectedPluginForTag.value.tags.includes(tag)) {
    const updatedPlugin = {
      ...selectedPluginForTag.value,
      tags: [...selectedPluginForTag.value.tags, tag]
    }
    emit('update', updatedPlugin)
  }
  showAddTagModal.value = false
  selectedPluginForTag.value = null
}

const updateRating = (plugin: IPlugin, rating: number) => {
  emit('update', { ...plugin, rating })
}

const showOptions = (plugin: IPlugin, event: MouseEvent) => {
  // Calculer la position du menu
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  
  optionsMenuPosition.value = {
    x: rect.right,
    y: rect.bottom
  }
  
  selectedPluginForOptions.value = plugin
  showOptionsMenu.value = true
}

const openInObsidian = () => {
  if (selectedPluginForOptions.value) {
    // Ouvrir la note du plugin dans Obsidian
    emit('open', selectedPluginForOptions.value)
  }
  showOptionsMenu.value = false
}

const openOnGithub = () => {
  if (selectedPluginForOptions.value?.repository) {
    window.open(selectedPluginForOptions.value.repository, '_blank')
  }
  showOptionsMenu.value = false
}

const copyPluginId = () => {
  if (selectedPluginForOptions.value) {
    navigator.clipboard.writeText(selectedPluginForOptions.value.id)
    // TODO: Afficher une notification de succès
  }
  showOptionsMenu.value = false
}

const deletePlugin = async () => {
  if (selectedPluginForOptions.value) {
    if (confirm(t('plugins.options.deleteConfirm'))) {
      emit('delete', selectedPluginForOptions.value)
    }
  }
  showOptionsMenu.value = false
}
</script> 

<style scoped>
.pluginflowz-card.editing-status {
  outline: 2px solid var(--interactive-accent);
}
</style> 