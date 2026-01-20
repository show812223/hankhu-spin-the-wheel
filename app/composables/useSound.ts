export function useSound() {
  const audioContext = ref<AudioContext | null>(null)
  const spinOscillator = ref<OscillatorNode | null>(null)
  const spinGain = ref<GainNode | null>(null)

  const initAudioContext = () => {
    if (import.meta.client && !audioContext.value) {
      audioContext.value = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
  }

  const playSpinSound = () => {
    initAudioContext()
    if (!audioContext.value) return

    // Stop any existing spin sound
    stopSpinSound()

    // Create a rhythmic clicking/ticking sound for spinning
    const ctx = audioContext.value
    spinGain.value = ctx.createGain()
    spinGain.value.connect(ctx.destination)
    spinGain.value.gain.setValueAtTime(0.3, ctx.currentTime)

    // Create a repeating tick pattern
    const playTick = (time: number, frequency: number) => {
      const osc = ctx.createOscillator()
      const tickGain = ctx.createGain()
      osc.connect(tickGain)
      tickGain.connect(spinGain.value!)

      osc.frequency.setValueAtTime(frequency, time)
      osc.type = 'square'

      tickGain.gain.setValueAtTime(0.5, time)
      tickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)

      osc.start(time)
      osc.stop(time + 0.05)
    }

    // Schedule ticks that slow down over time
    let time = ctx.currentTime
    let interval = 0.05
    for (let i = 0; i < 100; i++) {
      playTick(time, 800 + Math.random() * 400)
      time += interval
      interval *= 1.02 // Gradually slow down
    }
  }

  const stopSpinSound = () => {
    if (spinGain.value) {
      spinGain.value.disconnect()
      spinGain.value = null
    }
    if (spinOscillator.value) {
      spinOscillator.value.stop()
      spinOscillator.value = null
    }
  }

  const playWinnerSound = () => {
    stopSpinSound()
    initAudioContext()
    if (!audioContext.value) return

    const ctx = audioContext.value

    // Play a celebratory fanfare
    const playNote = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.setValueAtTime(frequency, startTime)
      osc.type = 'sine'

      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      osc.start(startTime)
      osc.stop(startTime + duration)
    }

    // Celebratory chord progression
    const now = ctx.currentTime
    // First chord (C major)
    playNote(523.25, now, 0.3) // C5
    playNote(659.25, now, 0.3) // E5
    playNote(783.99, now, 0.3) // G5

    // Second chord (higher)
    playNote(659.25, now + 0.2, 0.3) // E5
    playNote(783.99, now + 0.2, 0.3) // G5
    playNote(1046.50, now + 0.2, 0.5) // C6

    // Final triumphant note
    playNote(1046.50, now + 0.4, 0.8, 0.4) // C6
  }

  return {
    playSpinSound,
    stopSpinSound,
    playWinnerSound,
  }
}
