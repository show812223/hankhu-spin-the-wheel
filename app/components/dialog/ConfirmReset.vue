<script setup lang="ts">
interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', keepParticipants: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleReset = (keepParticipants: boolean) => {
  emit('confirm', keepParticipants)
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="400">
    <div class="reset-dialog">
      <!-- Icon -->
      <div class="icon-wrapper">
        <v-icon size="48" color="warning">mdi-restore-alert</v-icon>
      </div>

      <!-- Title -->
      <h2 class="dialog-title">重新開始遊戲</h2>
      <p class="dialog-subtitle">請選擇重新開始方式</p>

      <!-- Actions -->
      <div class="actions-wrapper">
        <button class="action-btn keep" @click="handleReset(true)">
          <v-icon size="20" class="mr-2">mdi-refresh</v-icon>
          保留名單，重新抽獎
        </button>

        <button class="action-btn clear" @click="handleReset(false)">
          <v-icon size="20" class="mr-2">mdi-delete-outline</v-icon>
          清除全部，重新開始
        </button>

        <button class="action-btn cancel" @click="dialog = false">
          取消
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<style scoped>
.reset-dialog {
  background: linear-gradient(180deg, #1A1A2E 0%, #0F0F23 100%);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 20px;
  margin-bottom: 1.25rem;
}

.dialog-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #E2E8F0;
  margin: 0;
}

.dialog-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9375rem;
  color: #94A3B8;
  margin: 0.5rem 0 1.5rem;
}

.actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-family: 'Nunito', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.keep {
  color: #FFFFFF;
  background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%);
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.action-btn.keep:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.action-btn.clear {
  color: #F43F5E;
  background: transparent;
  border: 1px solid rgba(244, 63, 94, 0.4);
}

.action-btn.clear:hover {
  background: rgba(244, 63, 94, 0.1);
  border-color: rgba(244, 63, 94, 0.6);
}

.action-btn.cancel {
  color: #64748B;
  background: transparent;
}

.action-btn.cancel:hover {
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.05);
}
</style>
