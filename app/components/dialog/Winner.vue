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
  <v-dialog v-model="dialog" max-width="420" persistent>
    <div class="winner-dialog">
      <!-- Confetti background effect -->
      <div class="confetti-container">
        <div v-for="i in 20" :key="i" class="confetti" :style="{ '--i': i }"></div>
      </div>

      <!-- Trophy Icon -->
      <div class="trophy-wrapper">
        <div class="trophy-glow"></div>
        <v-icon size="72" color="warning" class="trophy-icon">mdi-trophy</v-icon>
      </div>

      <!-- Title -->
      <h2 class="dialog-title">恭喜中獎！</h2>
      <p class="dialog-subtitle">Lucky Winner</p>

      <!-- Winner Name -->
      <div v-if="winner" class="winner-display">
        <div class="winner-name-wrapper">
          <span class="winner-name">{{ winner.name }}</span>
        </div>
      </div>

      <!-- Action Button -->
      <button
        v-if="!isLastRound"
        class="action-btn primary"
        @click="handleContinue"
      >
        <v-icon class="mr-2">mdi-arrow-right-circle</v-icon>
        繼續下一輪
      </button>
      <button
        v-else
        class="action-btn success"
        @click="handleContinue"
      >
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        遊戲結束
      </button>
    </div>
  </v-dialog>
</template>

<style scoped>
.winner-dialog {
  position: relative;
  background: linear-gradient(180deg, #1A1A2E 0%, #0F0F23 100%);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  overflow: hidden;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(245, 158, 11, 0.15);
}

/* Confetti Animation */
.confetti-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  left: calc(var(--i) * 5%);
  background: linear-gradient(
    45deg,
    #7C3AED,
    #F43F5E,
    #06B6D4,
    #10B981,
    #F59E0B
  );
  background-size: 500% 500%;
  animation:
    confetti-fall 3s ease-in-out infinite,
    confetti-color 2s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.1s);
  border-radius: 2px;
  transform: rotate(45deg);
}

@keyframes confetti-fall {
  0% {
    top: -10px;
    opacity: 1;
    transform: rotate(0deg) translateX(0);
  }
  100% {
    top: 100%;
    opacity: 0;
    transform: rotate(720deg) translateX(50px);
  }
}

@keyframes confetti-color {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Trophy */
.trophy-wrapper {
  position: relative;
  display: inline-flex;
  margin-bottom: 1.5rem;
}

.trophy-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.trophy-icon {
  position: relative;
  z-index: 1;
  animation: bounce 1.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Text */
.dialog-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #F59E0B;
  margin: 0;
  text-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
}

.dialog-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0.25rem 0 1.5rem;
}

/* Winner Display */
.winner-display {
  margin-bottom: 2rem;
}

.winner-name-wrapper {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
  border: 2px solid rgba(245, 158, 11, 0.4);
  border-radius: 16px;
  animation: winner-pulse 2s ease-in-out infinite;
}

@keyframes winner-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 40px rgba(245, 158, 11, 0.4);
  }
}

.winner-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Action Buttons */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #FFFFFF;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(124, 58, 237, 0.5);
}

.action-btn.success {
  background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
}

.action-btn.success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(16, 185, 129, 0.5);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .confetti,
  .trophy-glow,
  .trophy-icon,
  .winner-name-wrapper {
    animation: none;
  }
}
</style>
