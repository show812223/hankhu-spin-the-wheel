<script setup lang="ts">
import type { Participant } from '~/types'

interface Props {
  participants: Participant[]
  rotation: number
  isSpinning: boolean
}

const props = defineProps<Props>()

const size = 500
const centerX = size / 2
const centerY = size / 2
const radius = size / 2 - 35  // Leave room for pointer

// Calculate segment paths
const segments = computed(() => {
  const count = props.participants.length
  if (count === 0) return []

  const anglePerSegment = 360 / count

  return props.participants.map((participant, index) => {
    const startAngle = index * anglePerSegment - 90 // Start from top
    const endAngle = startAngle + anglePerSegment

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = anglePerSegment > 180 ? 1 : 0

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ')

    // Calculate text position (middle of segment)
    const midAngle = startAngle + anglePerSegment / 2
    const midRad = (midAngle * Math.PI) / 180
    const textRadius = radius * 0.65
    const textX = centerX + textRadius * Math.cos(midRad)
    const textY = centerY + textRadius * Math.sin(midRad)

    return {
      id: participant.id,
      name: participant.name,
      color: participant.color,
      path,
      textX,
      textY,
      textAngle: midAngle + 90, // Rotate text to be readable
    }
  })
})

const wheelStyle = computed(() => ({
  transform: `rotate(${props.rotation}deg)`,
  transition: props.isSpinning
    ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
    : 'none',
}))

// Truncate long names
const truncateName = (name: string, maxLength: number = 10) => {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength - 1) + '…'
}
</script>

<template>
  <div class="wheel-container">
    <svg viewBox="0 0 500 500" class="wheel-svg">
      <!-- Wheel group with rotation -->
      <g :style="wheelStyle" :transform-origin="`${centerX} ${centerY}`">
        <!-- Segments -->
        <g v-for="segment in segments" :key="segment.id">
          <path
            :d="segment.path"
            :fill="segment.color"
            stroke="#fff"
            stroke-width="2"
          />
          <text
            :x="segment.textX"
            :y="segment.textY"
            :transform="`rotate(${segment.textAngle}, ${segment.textX}, ${segment.textY})`"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#5D5D5D"
            font-size="16"
            font-weight="bold"
            class="segment-text"
          >
            {{ truncateName(segment.name) }}
          </text>
        </g>

        <!-- Center circle -->
        <circle :cx="centerX" :cy="centerY" r="38" fill="#fff" stroke="#E8DDD4" stroke-width="2" />
        <circle :cx="centerX" :cy="centerY" r="26" fill="#F8B4C4" />
      </g>

      <!-- Empty state -->
      <g v-if="participants.length === 0">
        <circle :cx="centerX" :cy="centerY" :r="radius" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2" />
        <text :x="centerX" :y="centerY" text-anchor="middle" dominant-baseline="middle" fill="#94a3b8" font-size="16">
          請加入參與者
        </text>
      </g>

      <!-- Pointer at top center (outside rotation group) -->
      <g class="pointer">
        <polygon :points="`${centerX},${centerY - radius + 35} ${centerX - 15},${centerY - radius - 5} ${centerX + 15},${centerY - radius - 5}`" fill="#7D6B5D" />
        <polygon :points="`${centerX},${centerY - radius + 28} ${centerX - 10},${centerY - radius}`" fill="#A89080" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.wheel-container {
  position: relative;
  display: inline-block;
  width: 60vw;
  max-width: 700px;
}

.wheel-svg {
  width: 100%;
  height: auto;
}

.segment-text {
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  pointer-events: none;
  user-select: none;
}

svg g {
  transform-origin: center center;
}

.pointer {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
}
</style>
