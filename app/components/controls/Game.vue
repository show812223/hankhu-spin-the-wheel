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

// Vibrant colors for winner chips
const chipColors = [
  '#7C3AED', '#F43F5E', '#06B6D4', '#10B981', '#F59E0B',
  '#EC4899', '#3B82F6', '#8B5CF6', '#14B8A6', '#EF4444',
]
</script>

<template>
  <div class="glass-card">
    <div class="card-header">
      <v-icon size="24" color="primary" class="mr-2">mdi-gamepad-variant</v-icon>
      <span class="card-title">遊戲控制</span>
    </div>

    <div class="card-content">
      <!-- Progress info -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-label">回合</span>
          <span class="stat-value gradient-text">{{ round }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">剩餘人數</span>
          <span class="stat-value" :class="{ 'text-warning': activeCount <= 2 }">{{ activeCount }}</span>
        </div>
      </div>

      <!-- Spin button -->
      <button
        class="spin-btn"
        :class="{ 'is-spinning': gamePhase === 'spinning', 'is-disabled': !canSpin }"
        :disabled="!canSpin"
        @click="emit('spin')"
      >
        <span class="btn-glow"></span>
        <span class="btn-content">
          <v-icon v-if="canSpin && gamePhase !== 'spinning'" class="mr-2">mdi-rotate-right</v-icon>
          <v-progress-circular
            v-if="gamePhase === 'spinning'"
            indeterminate
            size="20"
            width="2"
            class="mr-2"
          ></v-progress-circular>
          {{ spinButtonText }}
        </span>
      </button>

      <!-- Reset button -->
      <button
        class="reset-btn"
        :disabled="gamePhase === 'spinning'"
        @click="emit('reset')"
      >
        <v-icon size="18" class="mr-2">mdi-restart</v-icon>
        重新開始
      </button>
    </div>

    <!-- Winners history -->
    <div v-if="winners.length > 0" class="winners-section">
      <div class="section-divider"></div>
      <div class="winners-header">
        <v-icon size="18" color="warning" class="mr-1">mdi-trophy</v-icon>
        <span>中獎歷史</span>
      </div>
      <div class="winners-list">
        <div
          v-for="(winner, index) in winners"
          :key="winner.id"
          class="winner-chip"
          :style="{ '--chip-color': chipColors[index % chipColors.length] }"
        >
          <span class="chip-index">{{ index + 1 }}</span>
          <span class="chip-name">{{ winner.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.card-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #E2E8F0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Stats */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background: rgba(124, 58, 237, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #E2E8F0;
}

.gradient-text {
  background: linear-gradient(135deg, #A78BFA, #7C3AED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.5), transparent);
}

.text-warning {
  color: #F59E0B !important;
  -webkit-text-fill-color: #F59E0B !important;
}

/* Spin Button */
.spin-btn {
  position: relative;
  width: 100%;
  padding: 1rem 1.5rem;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
}

.spin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(124, 58, 237, 0.5);
}

.spin-btn:active:not(:disabled) {
  transform: translateY(0);
}

.spin-btn.is-disabled {
  background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.spin-btn.is-spinning {
  background: linear-gradient(135deg, #7C3AED 0%, #F43F5E 100%);
  animation: pulse-btn 1.5s ease-in-out infinite;
}

@keyframes pulse-btn {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(244, 63, 94, 0.6);
  }
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
}

.spin-btn:hover:not(:disabled) .btn-glow {
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.btn-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Reset Button */
.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #94A3B8;
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover:not(:disabled) {
  color: #E2E8F0;
  border-color: rgba(148, 163, 184, 0.5);
  background: rgba(148, 163, 184, 0.1);
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Winners Section */
.winners-section {
  margin-top: 1rem;
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.3), transparent);
  margin-bottom: 1rem;
}

.winners-header {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #94A3B8;
  margin-bottom: 0.75rem;
}

.winners-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.winner-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: color-mix(in srgb, var(--chip-color) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--chip-color) 40%, transparent);
  border-radius: 20px;
  font-size: 0.8125rem;
}

.chip-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--chip-color);
  border-radius: 50%;
  font-size: 0.625rem;
  font-weight: 700;
  color: #FFFFFF;
}

.chip-name {
  color: #E2E8F0;
  font-weight: 500;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .spin-btn,
  .btn-glow {
    animation: none;
  }
}
</style>
