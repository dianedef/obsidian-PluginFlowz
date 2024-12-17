<template>
  <div 
    class="pluginflowz-tag pluginflowz-tag-status"
    :class="[status, { selected }]"
    @click="$emit('click')"
  >
    {{ t(`settings.plugins.status.${status}`) }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { TPluginStatus } from '../../types'
import { useTranslations } from '../../composables/useTranslations'

export default defineComponent({
  name: 'StatusTag',
  props: {
    status: {
      type: String as () => TPluginStatus,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { t } = useTranslations()
    return { t }
  }
})
</script>

<style scoped>
.pluginflowz-tag-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pluginflowz-tag-status.selected {
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
}

.pluginflowz-tag-status.exploring {
  background-color: var(--color-yellow);
  color: var(--text-normal);
}

.pluginflowz-tag-status.active {
  background-color: var(--color-green);
  color: var(--text-on-accent);
}

.pluginflowz-tag-status.inactive {
  background-color: var(--color-red);
  color: var(--text-on-accent);
}

.pluginflowz-tag-status.ignoring {
  background-color: var(--color-gray);
  color: var(--text-muted);
}
</style> 