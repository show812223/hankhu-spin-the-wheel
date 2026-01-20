<script setup lang="ts">
import type { GamePhase, Participant } from '~/types'

interface Props {
  gamePhase: GamePhase
  activeCount: number
  round: number
  winners: Participant[]
}

interface Emits {
  (e: 'spin'): void
  (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const canSpin = computed(() => {
  return props.gamePhase === 'idle' && props.activeCount >= 2
})

const spinButtonText = computed(() => {
  if (props.gamePhase === 'spinning') return '轉動中...'
  if (props.gamePhase === 'finished') return '遊戲結束'
  if (props.activeCount < 2) return '需要至少 2 位參與者'
  return '開始轉動！'
})
</script>

<template>
  <v-card>
    <v-card-title class="text-h6" style="color: #7D6B5D;">
      <v-icon start color="#F8B4C4">mdi-flower-tulip</v-icon>
      遊戲控制
    </v-card-title>
    <v-card-text>
      <!-- Progress info -->
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <span class="text-body-2 text-medium-emphasis">第</span>
          <span class="text-h5 mx-1 font-weight-bold text-primary">{{ round }}</span>
          <span class="text-body-2 text-medium-emphasis">輪</span>
        </div>
        <div>
          <span class="text-body-2 text-medium-emphasis">剩餘</span>
          <span class="text-h5 mx-1 font-weight-bold text-secondary">{{ activeCount }}</span>
          <span class="text-body-2 text-medium-emphasis">人</span>
        </div>
      </div>

      <!-- Spin button -->
      <v-btn
        color="primary"
        size="x-large"
        block
        :disabled="!canSpin"
        :loading="gamePhase === 'spinning'"
        class="mb-3 spin-button"
        @click="emit('spin')"
      >
        <v-icon v-if="canSpin" start size="large">mdi-rotate-right</v-icon>
        {{ spinButtonText }}
      </v-btn>

      <!-- Reset button -->
      <v-btn
        color="grey"
        variant="outlined"
        block
        :disabled="gamePhase === 'spinning'"
        @click="emit('reset')"
      >
        <v-icon start>mdi-restart</v-icon>
        重新開始
      </v-btn>
    </v-card-text>

    <!-- Winners history -->
    <v-card-text v-if="winners.length > 0" class="pt-0">
      <v-divider class="mb-3" />
      <div class="text-subtitle-2 text-medium-emphasis mb-2">
        <v-icon start size="small">mdi-trophy-outline</v-icon>
        中獎歷史
      </div>
      <div class="d-flex flex-wrap ga-1">
        <v-chip
          v-for="(winner, index) in winners"
          :key="winner.id"
          :color="winner.color"
          size="small"
        >
          <span style="color: #5D5D5D;">{{ index + 1 }}. {{ winner.name }}</span>
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.spin-button {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.05em;
}
</style>
