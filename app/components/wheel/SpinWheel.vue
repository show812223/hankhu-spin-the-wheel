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
const radius = size / 2 - 40

// Vibrant color palette for segments
const segmentColors = [
  '#7C3AED', // Purple
  '#F43F5E', // Rose
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#14B8A6', // Teal
  '#EF4444', // Red
]

// Calculate segment paths
const segments = computed(() => {
  const count = props.participants.length
  if (count === 0) return []

  const anglePerSegment = 360 / count

  return props.participants.map((participant, index) => {
    const startAngle = index * anglePerSegment - 90
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

    const midAngle = startAngle + anglePerSegment / 2
    const midRad = (midAngle * Math.PI) / 180
    const textRadius = radius * 0.65
    const textX = centerX + textRadius * Math.cos(midRad)
    const textY = centerY + textRadius * Math.sin(midRad)

    return {
      id: participant.id,
      name: participant.name,
      color: segmentColors[index % segmentColors.length],
      path,
      textX,
      textY,
      textAngle: midAngle + 90,
    }
  })
})

const wheelStyle = computed(() => ({
  transform: `rotate(${props.rotation}deg)`,
  transition: props.isSpinning
    ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
    : 'none',
}))

const truncateName = (name: string, maxLength: number = 10) => {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength - 1) + '…'
}
</script>

<template>
  <div class="wheel-container" :class="{ 'is-spinning': isSpinning }">
    <!-- Outer Glow Ring -->
    <div class="glow-ring"></div>

    <!-- Decorative Ring -->
    <div class="deco-ring">
      <div v-for="i in 24" :key="i" class="deco-light" :style="{ '--i': i }"></div>
    </div>

    <svg viewBox="0 0 500 500" class="wheel-svg">
      <!-- Definitions for gradients and filters -->
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
        <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A78BFA"/>
          <stop offset="50%" stop-color="#7C3AED"/>
          <stop offset="100%" stop-color="#5B21B6"/>
        </linearGradient>
        <radialGradient id="wheelBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1A1A2E"/>
          <stop offset="100%" stop-color="#0F0F23"/>
        </radialGradient>
      </defs>

      <!-- Background circle with shadow -->
      <circle :cx="centerX" :cy="centerY" :r="radius + 5" fill="url(#wheelBg)" filter="url(#shadow)"/>

      <!-- Wheel group with rotation -->
      <g :style="wheelStyle" :transform-origin="`${centerX} ${centerY}`">
        <!-- Segments -->
        <g v-for="segment in segments" :key="segment.id">
          <path
            :d="segment.path"
            :fill="segment.color"
            stroke="rgba(255,255,255,0.3)"
            stroke-width="2"
            class="segment-path"
          />
          <text
            :x="segment.textX"
            :y="segment.textY"
            :transform="`rotate(${segment.textAngle}, ${segment.textX}, ${segment.textY})`"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#FFFFFF"
            font-size="15"
            font-weight="600"
            font-family="Nunito, sans-serif"
            class="segment-text"
          >
            {{ truncateName(segment.name) }}
          </text>
        </g>

        <!-- Center decoration circles -->
        <circle :cx="centerX" :cy="centerY" r="50" fill="url(#centerGradient)" filter="url(#glow)"/>
        <circle :cx="centerX" :cy="centerY" r="35" fill="#1A1A2E"/>
        <circle :cx="centerX" :cy="centerY" r="25" fill="url(#centerGradient)"/>
        <!-- Center star icon -->
        <text :x="centerX" :y="centerY + 2" text-anchor="middle" dominant-baseline="middle" fill="#FFFFFF" font-size="20">
          ★
        </text>
      </g>

      <!-- Empty state -->
      <g v-if="participants.length === 0">
        <circle :cx="centerX" :cy="centerY" :r="radius" fill="#1A1A2E" stroke="#4C1D95" stroke-width="3"/>
        <text :x="centerX" :y="centerY - 10" text-anchor="middle" fill="#A78BFA" font-size="18" font-family="Nunito, sans-serif">
          請加入參與者
        </text>
        <text :x="centerX" :y="centerY + 20" text-anchor="middle" fill="#6B7280" font-size="14" font-family="Nunito, sans-serif">
          Add Participants
        </text>
      </g>

      <!-- Pointer at top -->
      <g class="pointer" filter="url(#glow)">
        <polygon
          :points="`${centerX},${centerY - radius + 45} ${centerX - 18},${centerY - radius - 10} ${centerX + 18},${centerY - radius - 10}`"
          fill="url(#centerGradient)"
          stroke="#FFFFFF"
          stroke-width="2"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.wheel-container {
  position: relative;
  display: inline-block;
  width: min(50vw, 50vh);
  max-width: 480px;
  min-width: 280px;
}

/* Outer glow ring */
.glow-ring {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #7C3AED,
    #F43F5E,
    #06B6D4,
    #10B981,
    #F59E0B,
    #7C3AED
  );
  opacity: 0.5;
  filter: blur(30px);
  z-index: -1;
  transition: opacity 0.3s ease;
}

.wheel-container.is-spinning .glow-ring {
  opacity: 0.8;
  animation: pulse-glow 1s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

/* Decorative lights ring */
.deco-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  pointer-events: none;
}

.deco-light {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #FFFFFF;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: rotate(calc(var(--i) * 15deg)) translateY(calc(-50% - min(25vw, 25vh, 240px) - 5px));
  box-shadow: 0 0 8px #A78BFA, 0 0 16px #7C3AED;
  animation: blink 2s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.08s);
}

@keyframes blink {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

.wheel-svg {
  width: 100%;
  height: auto;
  display: block;
}

.segment-path {
  transition: filter 0.2s ease;
}

.segment-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
}

svg g {
  transform-origin: center center;
}

.pointer {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .deco-light {
    animation: none;
    opacity: 0.7;
  }

  .glow-ring {
    animation: none;
  }
}
</style>
