<template>
  <div class="rating-control">
    <div 
      class="stars"
      :title="t('settings.plugins.rating.tooltip')"
    >
      <span
        v-for="star in 5"
        :key="star"
        class="star"
        :class="{ 'filled': star <= modelValue }"
        @click="updateRating(star)"
        @mouseover="hoverRating = star"
        @mouseleave="hoverRating = 0"
      >
        ★
      </span>
    </div>
    <span v-if="showReset" class="reset" @click="updateRating(0)">
      {{ t('settings.plugins.delete.cancel') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTranslations } from '../../composables/useTranslations'

const { t } = useTranslations()

const props = defineProps<{
  modelValue: number
  showReset?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const hoverRating = ref(0)

const updateRating = (value: number) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.rating-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.star.filled {
  color: var(--text-accent);
}

.reset {
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.8em;
}

.reset:hover {
  color: var(--text-normal);
}
</style> 