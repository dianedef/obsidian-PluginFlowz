<template>
  <div class="pluginflowz-plugins-list">
    <div 
      v-for="plugin in plugins" 
      :key="plugin.id"
      class="pluginflowz-plugin-item"
      @mouseleave="handleItemMouseLeave(plugin)"
    >
      <!-- Ligne du haut : titre à gauche et toggle à droite -->
      <div class="pluginflowz-plugin-top-row">
        <div class="pluginflowz-plugin-left">
          <h4>{{ plugin.title }}</h4>
        </div>
        
        <div class="pluginflowz-plugin-right">
          <ToggleButton
            :value="plugin.activate"
            @update:value="handleToggle(plugin, $event)"
          />
        </div>
      </div>
      
      <!-- Ligne du bas : status sous le titre et tags à droite -->
      <div class="pluginflowz-plugin-bottom-row">
        <div class="pluginflowz-plugin-status-container">
          <status-tag 
            ref="statusTags"
            :status="plugin.status[0]" 
            :parent-handles-leave="true"
            @update="(newStatus) => handleStatusUpdate(plugin, newStatus)"
          />
        </div>
        
        <div class="pluginflowz-plugin-tags">
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
          >
            +
          </button>
        </div>
      </div>
      
      <!-- Description -->
      <p 
        v-if="plugin.description"
        class="pluginflowz-plugin-description"
        :title="t('settings.plugins.options.description')"
      >
        {{ plugin.description }}
      </p>
      
      <!-- Rating -->
      <div class="pluginflowz-plugin-rating">
        <rating-control
          v-model="plugin.rating"
          :show-reset="true"
          :title="t('settings.plugins.options.rating')"
        />
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import type { IPlugin, TPluginStatus } from '../types'
import StatusTag from './ui/StatusTag.vue'
import Tag from './ui/Tag.vue'
import ToggleButton from './ui/ToggleButton.vue'
import RatingControl from './ui/RatingControl.vue'
import AddTagModal from './ui/AddTagModal.vue'
import { useTranslations } from '../composables/useTranslations'

const props = defineProps<{
  plugins: IPlugin[]
  showNotes: boolean
}>()

const emit = defineEmits<{
  (e: 'update', plugin: IPlugin): void
}>()

const { t } = useTranslations()

// État pour le modal
const showAddTagModal = ref(false)
const selectedPluginForTag = ref<IPlugin | null>(null)

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

const statusTags = ref<any[]>([])

const handleItemMouseLeave = (plugin: IPlugin) => {
  // Trouver le StatusTag correspondant au plugin
  const index = plugins.findIndex(p => p.id === plugin.id)
  const statusTag = statusTags.value[index]
  
  if (statusTag?.hasChanged?.()) {
    handleStatusUpdate(plugin, statusTag.getCurrentStatus())
    statusTag.resetChanged()
  }
}
</script> 