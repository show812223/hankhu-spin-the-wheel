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
    <v-card>
      <v-card-title class="text-h6" style="color: #7D6B5D;">
        <v-icon start color="#FFE5B4">mdi-restore</v-icon>
        重新開始遊戲
      </v-card-title>

      <v-card-text>
        請選擇要如何重新開始：
      </v-card-text>

      <v-card-actions class="flex-column pa-4 pt-0">
        <v-btn
          color="primary"
          variant="flat"
          block
          class="mb-2"
          @click="handleReset(true)"
        >
          <v-icon start>mdi-refresh</v-icon>
          保留名單，重新抽獎
        </v-btn>
        <v-btn
          color="error"
          variant="outlined"
          block
          @click="handleReset(false)"
        >
          <v-icon start>mdi-delete</v-icon>
          清除全部，重新開始
        </v-btn>
        <v-btn
          variant="text"
          block
          class="mt-2"
          @click="dialog = false"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
