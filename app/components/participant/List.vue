<script setup lang="ts">
import type { Participant } from '~/types'

interface Props {
  participants: Participant[]
  disabled?: boolean
}

interface Emits {
  (e: 'remove', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleRemove = (id: string) => {
  emit('remove', id)
}

// Avatar colors
const avatarColors = [
  '#7C3AED', '#F43F5E', '#06B6D4', '#10B981', '#F59E0B',
  '#EC4899', '#3B82F6', '#8B5CF6', '#14B8A6', '#EF4444',
]

const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length]
</script>

<template>
  <div class="glass-card">
    <div class="card-header">
      <v-icon size="24" color="success" class="mr-2">mdi-account-group</v-icon>
      <span class="card-title">參與者名單</span>
      <span class="participant-count">{{ participants.filter(p => !p.isWinner).length }}</span>
    </div>

    <div v-if="participants.length > 0" class="participant-list">
      <TransitionGroup name="list">
        <div
          v-for="(participant, index) in participants"
          :key="participant.id"
          class="participant-item"
          :class="{ 'is-winner': participant.isWinner }"
        >
          <div class="participant-avatar" :style="{ background: getAvatarColor(index) }">
            {{ participant.name.charAt(0).toUpperCase() }}
          </div>

          <div class="participant-info">
            <span class="participant-name" :class="{ 'strikethrough': participant.isWinner }">
              {{ participant.name }}
            </span>
            <span v-if="participant.isWinner" class="winner-badge">
              <v-icon size="12" class="mr-1">mdi-check</v-icon>
              已中獎
            </span>
          </div>

          <button
            v-if="!participant.isWinner && !disabled"
            class="remove-btn"
            @click="handleRemove(participant.id)"
          >
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>
      </TransitionGroup>
    </div>

    <div v-else class="empty-state">
      <v-icon size="48" color="secondary" class="mb-3">mdi-account-off-outline</v-icon>
      <p class="empty-text">尚無參與者</p>
      <p class="empty-hint">請在上方輸入框加入參與者</p>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #E2E8F0;
  flex: 1;
}

.participant-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 14px;
}

.participant-list {
  max-height: 180px;
  overflow-y: auto;
  padding-right: 4px;
}

.participant-list::-webkit-scrollbar {
  width: 6px;
}

.participant-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.participant-list::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.4);
  border-radius: 3px;
}

.participant-list::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 58, 237, 0.6);
}

.participant-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.375rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.participant-item:hover:not(.is-winner) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(124, 58, 237, 0.3);
}

.participant-item.is-winner {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.participant-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #FFFFFF;
  flex-shrink: 0;
}

.participant-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.participant-name {
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #E2E8F0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.participant-name.strikethrough {
  text-decoration: line-through;
  color: #64748B;
}

.winner-badge {
  display: flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #10B981;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 10px;
  flex-shrink: 0;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: rgba(244, 63, 94, 0.15);
  color: #F43F5E;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1rem;
  text-align: center;
}

.empty-text {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9375rem;
  color: #94A3B8;
  margin: 0;
}

.empty-hint {
  font-size: 0.75rem;
  color: #64748B;
  margin: 0.375rem 0 0;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
