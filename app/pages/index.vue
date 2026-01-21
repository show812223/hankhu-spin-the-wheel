<script setup lang="ts">
const {
  participants,
  activeParticipants,
  winners,
  currentWinner,
  gamePhase,
  round,
  addParticipants,
  removeParticipant,
  setWinner,
  confirmWinner,
  startSpin,
  reset,
  restartWithSameParticipants,
} = useGameState()

const { rotation, isSpinning, spin, reset: resetWheel } = useWheelAnimation()
const { playSpinSound, stopSpinSound, playWinnerSound } = useSound()

const showWinnerDialog = ref(false)
const showResetDialog = ref(false)

// Watch for winner dialog
watch(
  () => gamePhase.value,
  (phase) => {
    if (phase === 'showWinner') {
      showWinnerDialog.value = true
    }
  }
)

// Handle spin
const handleSpin = () => {
  if (activeParticipants.value.length < 2) return

  startSpin()
  playSpinSound()

  spin(activeParticipants.value, (winner) => {
    stopSpinSound()
    playWinnerSound()
    setWinner(winner)
  })
}

// Handle winner dialog continue
const handleWinnerContinue = () => {
  confirmWinner()
  showWinnerDialog.value = false
}

// Handle reset
const handleResetClick = () => {
  showResetDialog.value = true
}

const handleResetConfirm = (keepParticipants: boolean) => {
  resetWheel()
  if (keepParticipants) {
    restartWithSameParticipants()
  } else {
    reset()
  }
}

// Check if this is the last round (only 2 active participants left)
const isLastRound = computed(() => activeParticipants.value.length <= 2)
</script>

<template>
  <div class="app-container">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <div class="main-content">
      <!-- Header -->
      <div class="text-center header-section">
        <h1 class="app-title">
          <span class="title-icon">
            <v-icon size="32" color="primary">mdi-star-four-points</v-icon>
          </span>
          Lucky Wheel
          <span class="title-icon">
            <v-icon size="32" color="accent">mdi-star-four-points</v-icon>
          </span>
        </h1>
      </div>

      <div class="content-row">
        <!-- Wheel Section -->
        <div class="wheel-section">
          <WheelSpinWheel
            :participants="activeParticipants"
            :rotation="rotation"
            :is-spinning="isSpinning"
          />
        </div>

        <!-- Control Section -->
        <div class="control-section">
          <div class="control-inner">
            <!-- Game Controls -->
            <ControlsGame
              :game-phase="gamePhase"
              :active-count="activeParticipants.length"
              :round="round"
              :winners="winners"
              class="mb-3"
              @spin="handleSpin"
              @reset="handleResetClick"
            />

            <!-- Participant Input (only show when not spinning or finished) -->
            <ParticipantInput
              v-if="gamePhase !== 'spinning'"
              class="mb-3"
              @add="addParticipants"
            />

            <!-- Participant List -->
            <ParticipantList
              :participants="participants"
              :disabled="gamePhase === 'spinning'"
              @remove="removeParticipant"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Winner Dialog -->
    <DialogWinner
      v-model="showWinnerDialog"
      :winner="currentWinner"
      :is-last-round="isLastRound"
      @continue="handleWinnerContinue"
    />

    <!-- Reset Confirm Dialog -->
    <DialogConfirmReset
      v-model="showResetDialog"
      @confirm="handleResetConfirm"
    />
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  height: 100dvh;
  position: relative;
  overflow: hidden;
  font-family: 'Nunito', sans-serif;
}

/* Animated Gradient Background */
.animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%);
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #7C3AED 0%, transparent 70%);
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #F43F5E 0%, transparent 70%);
  bottom: -100px;
  right: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #06B6D4 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(-30px, -20px) scale(1.02);
  }
}

.main-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
}

/* Header Styles */
.header-section {
  flex-shrink: 0;
  padding: 0.5rem 0;
}

.app-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #F43F5E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.title-icon {
  animation: sparkle 2s ease-in-out infinite;
}

.title-icon:last-child {
  animation-delay: 1s;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
}

/* Content Row */
.content-row {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-height: 0;
  padding: 0.5rem 0;
}

/* Sections */
.wheel-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 55%;
  height: 100%;
}

.control-section {
  flex: 0 0 380px;
  max-width: 380px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.control-inner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

.control-inner::-webkit-scrollbar {
  width: 4px;
}

.control-inner::-webkit-scrollbar-track {
  background: transparent;
}

.control-inner::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.3);
  border-radius: 2px;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-row {
    flex-direction: column;
    gap: 1rem;
  }

  .wheel-section {
    max-width: 100%;
    flex: 0 0 auto;
    height: auto;
    max-height: 50vh;
  }

  .control-section {
    flex: 1;
    max-width: 100%;
    width: 100%;
    min-height: 0;
  }

  .control-inner {
    flex: 1;
    overflow-y: auto;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 0.75rem 1rem;
  }

  .header-section {
    padding: 0.25rem 0;
  }

  .wheel-section {
    max-height: 45vh;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb,
  .title-icon {
    animation: none;
  }
}
</style>
