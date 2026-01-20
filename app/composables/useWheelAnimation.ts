import type { Participant } from '~/types'

export function useWheelAnimation() {
  const rotation = ref(0)
  const isSpinning = ref(false)
  const currentRotation = ref(0)

  const spin = (
    participants: Participant[],
    onComplete: (winner: Participant) => void
  ) => {
    if (isSpinning.value || participants.length === 0) return

    isSpinning.value = true

    const segmentAngle = 360 / participants.length
    const winnerIndex = Math.floor(Math.random() * participants.length)
    const winner = participants[winnerIndex]

    // Calculate target rotation:
    // - Segments start at -90 degrees (top), so segment i's center is at: -90 + i*segmentAngle + segmentAngle/2
    // - To make winner segment point to top, we need to rotate so its center aligns with top
    // - Use INTEGER number of full rotations to ensure correct final position
    const numFullRotations = Math.floor(5 + Math.random() * 4) // 5, 6, 7, or 8 full rotations
    const fullRotations = numFullRotations * 360
    const segmentCenter = winnerIndex * segmentAngle + segmentAngle / 2
    const targetAbsolute = 360 - segmentCenter

    // Calculate relative rotation from current position
    const currentAngle = currentRotation.value % 360
    let relativeRotation = targetAbsolute - currentAngle
    if (relativeRotation <= 0) relativeRotation += 360

    // Total rotation = full spins + relative rotation to land on winner
    rotation.value = currentRotation.value + fullRotations + relativeRotation

    // Animation duration: 4-5 seconds
    const duration = 4000 + Math.random() * 1000

    setTimeout(() => {
      isSpinning.value = false
      // Store final position for next spin
      currentRotation.value = rotation.value
      onComplete(winner)
    }, duration)
  }

  const reset = () => {
    rotation.value = 0
    currentRotation.value = 0
    isSpinning.value = false
  }

  return {
    rotation,
    isSpinning,
    spin,
    reset,
  }
}
