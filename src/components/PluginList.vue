<template>
  <div class="pluginflowz-plugins-list">
    <div 
      v-for="plugin in plugins" 
      :key="plugin.title"
      class="pluginflowz-plugin-item"
    >
      <!-- Ligne du haut : titre à gauche et toggle à droite -->
      <div class="pluginflowz-plugin-top-row">
        <div class="pluginflowz-plugin-left">
          <h4>{{ plugin.title }}</h4>
        </div>
        
        <div class="pluginflowz-plugin-right">
          <ToggleButton
            v-model="plugin.activate"
            @update:modelValue="handleToggle(plugin, $event)"
          />
        </div>
      </div>
      
      <!-- Ligne du bas : status sous le titre et tags à droite -->
      <div class="pluginflowz-plugin-bottom-row">
        <div class="pluginflowz-plugin-status-container">
          <status-tag 
            :status="plugin.status[0]" 
            @click="cycleStatus(plugin)"
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
}>()

const emit = defineEmits<{
  (e: 'update', plugin: IPlugin): void
}>()

const { t } = useTranslations()

// État pour le modal
const showAddTagModal = ref(false)
const selectedPluginForTag = ref<IPlugin | null>(null)

// Méthodes
const handleToggle = (plugin: IPlugin, value: boolean) => {
  emit('update', { ...plugin, activate: value })
}

const cycleStatus = (plugin: IPlugin) => {
  const statuses: TPluginStatus[] = ['exploring', 'active', 'inactive', 'ignoring']
  const currentIndex = statuses.indexOf(plugin.status[0] as TPluginStatus)
  const nextIndex = (currentIndex + 1) % statuses.length
  emit('update', { ...plugin, status: [statuses[nextIndex]] })
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
</script> 