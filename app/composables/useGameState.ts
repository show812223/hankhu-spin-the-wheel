import type { Participant, GamePhase } from '~/types'
import { getColorForIndex } from '~/utils/colors'

const STORAGE_KEY = 'spin-the-wheel-participants'

export function useGameState() {
  const participants = ref<Participant[]>([])
  const winners = ref<Participant[]>([])
  const currentWinner = ref<Participant | null>(null)
  const gamePhase = ref<GamePhase>('idle')
  const round = ref(1)

  // Computed: active participants (not yet winners)
  const activeParticipants = computed(() =>
    participants.value.filter((p) => !p.isWinner)
  )

  // Load from localStorage
  const loadFromStorage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          participants.value = data.participants || []
          winners.value = data.winners || []
          round.value = data.round || 1
          // Reassign colors to ensure latest color scheme is used
          participants.value.forEach((p, i) => {
            p.color = getColorForIndex(i)
          })
          winners.value.forEach((w, i) => {
            const participant = participants.value.find((p) => p.id === w.id)
            if (participant) {
              w.color = participant.color
            }
          })
          // Restore game phase based on state
          if (activeParticipants.value.length === 0 && participants.value.length > 0) {
            gamePhase.value = 'finished'
          } else if (activeParticipants.value.length === 1 && winners.value.length > 0) {
            gamePhase.value = 'finished'
          }
        } catch {
          // Invalid data, ignore
        }
      }
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    if (import.meta.client) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          participants: participants.value,
          winners: winners.value,
          round: round.value,
        })
      )
    }
  }

  // Add participants from text input
  const addParticipants = (text: string) => {
    const names = text
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    const startIndex = participants.value.length

    const newParticipants: Participant[] = names.map((name, index) => ({
      id: crypto.randomUUID(),
      name,
      color: getColorForIndex(startIndex + index),
      isWinner: false,
    }))

    participants.value.push(...newParticipants)
    saveToStorage()
  }

  // Remove a participant
  const removeParticipant = (id: string) => {
    const index = participants.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      participants.value.splice(index, 1)
      // Reassign colors
      participants.value.forEach((p, i) => {
        p.color = getColorForIndex(i)
      })
      saveToStorage()
    }
  }

  // Set the winner after wheel stops
  const setWinner = (winner: Participant) => {
    currentWinner.value = winner
    gamePhase.value = 'showWinner'
  }

  // Confirm winner and proceed to next round
  const confirmWinner = () => {
    if (currentWinner.value) {
      const participant = participants.value.find(
        (p) => p.id === currentWinner.value!.id
      )
      if (participant) {
        participant.isWinner = true
        winners.value.push({ ...participant })
      }
      currentWinner.value = null
      round.value++

      // Check if game is finished (only 1 or 0 active participants left)
      if (activeParticipants.value.length <= 1) {
        gamePhase.value = 'finished'
      } else {
        gamePhase.value = 'idle'
      }
      saveToStorage()
    }
  }

  // Start spinning
  const startSpin = () => {
    if (activeParticipants.value.length >= 2) {
      gamePhase.value = 'spinning'
    }
  }

  // Reset the game
  const reset = () => {
    participants.value = []
    winners.value = []
    currentWinner.value = null
    gamePhase.value = 'idle'
    round.value = 1
    saveToStorage()
  }

  // Reset game but keep participants
  const restartWithSameParticipants = () => {
    participants.value.forEach((p) => {
      p.isWinner = false
    })
    winners.value = []
    currentWinner.value = null
    gamePhase.value = 'idle'
    round.value = 1
    saveToStorage()
  }

  // Initialize on mount
  onMounted(() => {
    loadFromStorage()
  })

  return {
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
  }
}
