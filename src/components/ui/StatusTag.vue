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