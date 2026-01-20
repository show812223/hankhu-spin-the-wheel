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
</script>

<template>
  <v-card>
    <v-card-title class="text-h6 d-flex align-center" style="color: #7D6B5D;">
      <v-icon start color="#B5EAD7">mdi-account-group</v-icon>
      參與者名單
      <v-chip class="ml-2" size="small" color="primary">
        {{ participants.filter(p => !p.isWinner).length }}
      </v-chip>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-list v-if="participants.length > 0" density="compact" class="participant-list">
        <v-list-item
          v-for="participant in participants"
          :key="participant.id"
          :class="{ 'is-winner': participant.isWinner }"
        >
          <template #prepend>
            <v-avatar :color="participant.color" size="32">
              <span class="text-caption font-weight-bold" style="color: #5D5D5D;">
                {{ participant.name.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>
          </template>
          <v-list-item-title :class="{ 'text-decoration-line-through text-medium-emphasis': participant.isWinner }">
            {{ participant.name }}
            <v-chip v-if="participant.isWinner" size="x-small" color="success" class="ml-2">
              已中獎
            </v-chip>
          </v-list-item-title>
          <template #append>
            <v-btn
              v-if="!participant.isWinner && !disabled"
              icon="mdi-close"
              size="x-small"
              variant="text"
              color="error"
              @click="handleRemove(participant.id)"
            />
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="pa-4 text-center text-medium-emphasis">
        <v-icon size="48" color="grey-lighten-1">mdi-account-off</v-icon>
        <p class="mt-2 mb-0">尚無參與者</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.participant-list {
  max-height: 300px;
  overflow-y: auto;
}

.is-winner {
  background-color: rgba(var(--v-theme-success), 0.08);
}
</style>
