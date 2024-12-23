<template>
  <div 
    class="pluginflowz-tag pluginflowz-tag-status"
    :class="[currentStatus, { selected, disabled }]"
    @click="!disabled && handleClick()"
    @mouseleave="!parentHandlesLeave && handleMouseLeave"
    role="button"
    tabindex="0"
    @keyup.enter="!disabled && handleClick()"
    @keyup.space="!disabled && handleClick()"
  >
    {{ t(`settings.plugins.status.${currentStatus}`) }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TPluginStatus } from '../../types'
import { useTranslations } from '../../composables/useTranslations'

const props = defineProps<{
  status: TPluginStatus
  selected?: boolean
  disabled?: boolean
  isFilter?: boolean
  parentHandlesLeave?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'filter'): void
  (e: 'update', status: TPluginStatus): void
  (e: 'interaction'): void
}>()

const { t } = useTranslations()

const statusList: TPluginStatus[] = ['exploring', 'active', 'inactive', 'ignoring']
const currentStatus = ref<TPluginStatus>(props.status)
let hasChanged = false

onMounted(() => {
  currentStatus.value = props.status
})

function handleClick() {
  if (props.isFilter) {
    emit('filter')
    return
  }
  
  const currentIndex = statusList.indexOf(currentStatus.value)
  const nextIndex = (currentIndex + 1) % statusList.length
  currentStatus.value = statusList[nextIndex]
  hasChanged = true
  emit('interaction')
}

function handleMouseLeave() {
  if (hasChanged) {
    emit('update', currentStatus.value)
    hasChanged = false
  }
}

// Exposer ces fonctions pour le parent
defineExpose({
  hasChanged: () => hasChanged,
  getCurrentStatus: () => currentStatus.value,
  resetChanged: () => { hasChanged = false }
})
</script>

<style scoped>
.pluginflowz-tag-status {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.pluginflowz-tag-status:hover:not(.disabled) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.pluginflowz-tag-status.selected {
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
}

.pluginflowz-tag-status.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 