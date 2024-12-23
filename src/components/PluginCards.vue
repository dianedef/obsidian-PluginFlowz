<template>
  <div class="pluginflowz-cards-grid">
    <div 
      v-for="plugin in plugins" 
      :key="plugin.id"
      class="pluginflowz-card"
      :data-plugin-title="plugin.title"
      @mouseleave="handleCardMouseLeave(plugin)"
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
            @click="(event) => showOptions(plugin, event)"
          >
            <span class="pluginflowz-more-vertical">⋮</span>
          </button>
        </div>
      </div>

      <!-- Status sous le titre -->
      <div class="pluginflowz-card-status-container">
        <status-tag 
          ref="statusTags"
          :status="plugin.status[0]" 
          :parent-handles-leave="true"
          @update="(newStatus) => handleStatusUpdate(plugin, newStatus)"
          @interaction="handleStatusInteraction"
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
        v-if="showNotes"
        class="pluginflowz-note-content"
      >
        {{ plugin.note }}
      </div>
    </div>

    <!-- Modal pour l'ajout de tag -->
    <add-tag-modal
      v-if="showAddTagModal"
      @submit="handleTagSubmit"
      @close="showAddTagModal = false"
    />

    <!-- Menu d'options -->
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
import { Notice } from 'obsidian'
import StatusTag from './ui/StatusTag.vue'
import Tag from './ui/Tag.vue'
import ToggleButton from './ui/ToggleButton.vue'
import RatingControl from './ui/RatingControl.vue'
import AddTagModal from './ui/AddTagModal.vue'
import { useTranslations } from '../composables/useTranslations'
import OptionsMenu from './ui/OptionsMenu.vue'

const props = defineProps<{
  plugins: IPlugin[]
  showNotes: boolean
}>()

const emit = defineEmits<{
  (e: 'update', plugin: IPlugin): void
  (e: 'delete', plugin: IPlugin): void
  (e: 'open', plugin: IPlugin): void
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
      // Si on active, le statut devient 'active'
      // Si on désactive, le statut devient 'inactive'
      // Les autres statuts (exploring, ignoring) ne sont pas touchés par le toggle
      status: [value ? 'active' as TPluginStatus : 'inactive' as TPluginStatus]
    }
    await emit('update', updatedPlugin)
  } catch (error) {
    console.error('Erreur lors du toggle:', error)
    // Forcer la mise à jour de l'état local pour refléter l'état réel
    plugin.activate = !value
  }
}

const handleStatusUpdate = (plugin: IPlugin, newStatus: TPluginStatus) => {
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
  emit('update', updatedPlugin)
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

const showOptions = (plugin: IPlugin, event?: MouseEvent) => {
  if (!event) {
    optionsMenuPosition.value = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
  } else {
    // Calculer la position du menu
    const button = event.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()
    
    // Dimensions approximatives du menu
    const menuWidth = 200
    const menuHeight = 180
    
    // Position initiale (légèrement décalée à gauche du bouton)
    let x = rect.left - menuWidth - 5 // On place le menu à gauche du bouton avec un petit décalage
    let y = rect.top
    
    // Si le menu sort à gauche, le placer à droite du bouton
    if (x < 0) {
      x = rect.right + 5 // On place le menu à droite du bouton avec un petit décalage
    }
    
    // Vérifier si le menu dépasse en bas de la fenêtre
    if (y + menuHeight > window.innerHeight) {
      y = Math.max(0, window.innerHeight - menuHeight) // Aligner en bas de la fenêtre
    }
    
    optionsMenuPosition.value = { x, y }
  }
  
  selectedPluginForOptions.value = plugin
  showOptionsMenu.value = true

  // Empêcher la propagation de l'événement
  event?.stopPropagation()
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
    // Afficher une notification de succès
    new Notice(t('settings.plugins.options.copySuccess'))
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

// Ajouter un gestionnaire de clic global pour fermer le menu
onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})

const handleGlobalClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.pluginflowz-options-menu') && !target.closest('.pluginflowz-more-button')) {
    showOptionsMenu.value = false
  }
}

const statusTags = ref<any[]>([])
const hasInteractedWithStatus = ref(false)

// Méthode pour gérer l'interaction avec le statut
const handleStatusInteraction = () => {
  hasInteractedWithStatus.value = true
}

const handleCardMouseLeave = (plugin: IPlugin) => {
  // Ne rien faire si l'utilisateur n'a pas interagi avec le statut
  if (!hasInteractedWithStatus.value) return

  // Trouver le StatusTag correspondant au plugin
  const index = props.plugins.findIndex(p => p.id === plugin.id)
  const statusTag = statusTags.value[index]
  
  if (statusTag?.hasChanged?.()) {
    handleStatusUpdate(plugin, statusTag.getCurrentStatus())
    statusTag.resetChanged()
  }

  // Réinitialiser le drapeau d'interaction
  hasInteractedWithStatus.value = false
}
</script> 