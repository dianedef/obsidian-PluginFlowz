<template>
  <button 
    class="pluginflowz-toggle-button"
    :class="{ active: modelValue }"
    @click="toggle"
    :title="t(modelValue ? 'settings.plugins.deactivate.tooltip' : 'settings.plugins.activate.tooltip')"
  >
    <div class="toggle-slider" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTranslations } from '../../composables/useTranslations'

export default defineComponent({
  name: 'ToggleButton',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const { t } = useTranslations()

    const toggle = () => {
      emit('update:modelValue', !props.modelValue)
    }

    return {
      t,
      toggle
    }
  }
})
</script>

<style scoped>
.pluginflowz-toggle-button {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background-color: var(--background-modifier-border);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 2px;
}

.pluginflowz-toggle-button.active {
  background-color: var(--interactive-accent);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: var(--background-primary);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.active .toggle-slider {
  transform: translateX(16px);
}
</style> 