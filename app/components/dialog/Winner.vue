<script setup lang="ts">
import type { Participant } from '~/types'

interface Props {
  modelValue: boolean
  winner: Participant | null
  isLastRound: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'continue'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleContinue = () => {
  emit('continue')
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card class="text-center pa-4">
      <div class="trophy-container">
        <v-icon size="80" color="#F8B4C4">mdi-trophy</v-icon>
      </div>

      <v-card-title class="text-h4 mt-4" style="color: #7D6B5D;">
        🌸 恭喜中獎 🌸
      </v-card-title>

      <v-card-text class="py-6">
        <v-chip
          v-if="winner"
          :color="winner.color"
          size="x-large"
          class="winner-chip"
        >
          <span class="text-h5 font-weight-bold" style="color: #5D5D5D;">
            {{ winner.name }}
          </span>
        </v-chip>
      </v-card-text>

      <v-card-actions class="justify-center pb-4">
        <v-btn
          v-if="!isLastRound"
          color="primary"
          size="large"
          variant="flat"
          @click="handleContinue"
        >
          <v-icon start>mdi-arrow-right</v-icon>
          繼續下一輪
        </v-btn>
        <v-btn
          v-else
          color="success"
          size="large"
          variant="flat"
          @click="handleContinue"
        >
          <v-icon start>mdi-check</v-icon>
          遊戲結束
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.trophy-container {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.winner-chip {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
