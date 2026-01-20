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
  <v-container fluid class="fill-height pa-4 pa-md-8">
    <v-row class="fill-height" align="center" justify="center">
      <!-- Wheel Section -->
      <v-col cols="12" md="6" class="d-flex justify-center align-center">
        <div class="wheel-section">
          <h1 class="text-h4 text-md-h3 text-center mb-6 font-weight-bold" style="color: #7D6B5D;">
            🌸 幸運輪盤 🌸
          </h1>
          <WheelSpinWheel
            :participants="activeParticipants"
            :rotation="rotation"
            :is-spinning="isSpinning"
          />
        </div>
      </v-col>

      <!-- Control Section -->
      <v-col cols="12" md="6" lg="5">
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
  </v-container>
</template>

<style scoped>
.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.control-section {
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .wheel-section {
    margin-bottom: 2rem;
  }
}
</style>
