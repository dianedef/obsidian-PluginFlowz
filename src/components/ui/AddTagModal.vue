<template>
  <div class="modal-container pluginflowz-modal">
    <div class="modal">
      <div class="modal-content">
        <h2>{{ t('settings.plugins.add.name') }}</h2>
        <input 
          ref="inputRef"
          v-model="tagInput"
          type="text"
          :placeholder="t('settings.plugins.add.placeholder')"
          @keyup.enter="handleSubmit"
        />
        <div class="modal-button-container">
          <button 
            class="mod-cta"
            @click="handleSubmit"
          >
            {{ t('settings.plugins.add.success') }}
          </button>
          <button @click="$emit('close')">
            {{ t('settings.plugins.delete.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTranslations } from '../../composables/useTranslations'

const { t } = useTranslations()

const emit = defineEmits<{
  (e: 'submit', tag: string): void
  (e: 'close'): void
}>()

const tagInput = ref('')
const inputRef = ref<HTMLInputElement>()

onMounted(() => {
  // Focus sur l'input quand le modal s'ouvre
  inputRef.value?.focus()
})

const handleSubmit = () => {
  const tag = tagInput.value.trim()
  if (tag) {
    emit('submit', tag)
  }
  emit('close')
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: var(--background-primary);
  border-radius: 8px;
  padding: 20px;
  min-width: 300px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-button-container {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 4px;
  background-color: var(--background-primary);
  color: var(--text-normal);
}

button {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border);
  background-color: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
}

button.mod-cta {
  background-color: var(--interactive-accent);
  color: var(--text-on-accent);
  border: none;
}
</style> 