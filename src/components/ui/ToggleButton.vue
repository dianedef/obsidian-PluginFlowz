<template>
  <button 
    class="pluginflowz-toggle-button"
    :class="{ active: value }"
    @click="toggle"
    :title="t(value ? 'settings.plugins.deactivate.tooltip' : 'settings.plugins.activate.tooltip')"
  >
    <div class="pluginflowz-toggle-slider" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTranslations } from '../../composables/useTranslations'

export default defineComponent({
  name: 'ToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { t } = useTranslations()

    const toggle = () => {
      emit('update:value', !props.value)
    }

    return {
      t,
      toggle
    }
  }
})
</script> 