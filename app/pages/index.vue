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

    <v-container fluid class="main-content pa-4 pa-md-8">
      <!-- Header -->
      <div class="text-center mb-6 mb-md-10">
        <h1 class="app-title">
          <span class="title-icon">
            <v-icon size="40" color="primary">mdi-star-four-points</v-icon>
          </span>
          Lucky Wheel
          <span class="title-icon">
            <v-icon size="40" color="accent">mdi-star-four-points</v-icon>
          </span>
        </h1>
        <p class="app-subtitle">Spin to Win!</p>
      </div>

      <v-row align="center" justify="center">
        <!-- Wheel Section -->
        <v-col cols="12" lg="7" class="d-flex justify-center align-center">
          <div class="wheel-section">
            <WheelSpinWheel
              :participants="activeParticipants"
              :rotation="rotation"
              :is-spinning="isSpinning"
            />
          </div>
        </v-col>

        <!-- Control Section -->
        <v-col cols="12" lg="5">
          <div class="control-section">
            <!-- Game Controls -->
            <ControlsGame
              :game-phase="gamePhase"
              :active-count="activeParticipants.length"
              :round="round"
              :winners="winners"
              class="mb-4"
              @spin="handleSpin"
              @reset="handleResetClick"
            />

            <!-- Participant Input (only show when not spinning or finished) -->
            <ParticipantInput
              v-if="gamePhase !== 'spinning'"
              class="mb-4"
              @add="addParticipants"
            />

            <!-- Participant List -->
            <ParticipantList
              :participants="participants"
              :disabled="gamePhase === 'spinning'"
              @remove="removeParticipant"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>

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
  min-height: 100vh;
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
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #7C3AED 0%, transparent 70%);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #F43F5E 0%, transparent 70%);
  bottom: -150px;
  right: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 400px;
  height: 400px;
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
  min-height: 100vh;
}

/* Header Styles */
.app-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #F43F5E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 40px rgba(124, 58, 237, 0.5);
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

.app-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 1.25rem;
  color: rgba(226, 232, 240, 0.7);
  margin-top: 0.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Sections */
.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.control-section {
  max-width: 420px;
  margin: 0 auto;
}

@media (max-width: 1280px) {
  .wheel-section {
    margin-bottom: 2rem;
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
