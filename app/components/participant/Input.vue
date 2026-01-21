<script setup lang="ts">
interface Emits {
  (e: 'add', text: string): void
}

const emit = defineEmits<Emits>()

const inputText = ref('')

const handleAdd = () => {
  if (inputText.value.trim()) {
    emit('add', inputText.value)
    inputText.value = ''
  }
}

const placeholder = `輸入參與者名稱
可用逗號或換行分隔
例如：小明, 小華, 小美`
</script>

<template>
  <div class="glass-card">
    <div class="card-header">
      <v-icon size="24" color="accent" class="mr-2">mdi-account-plus</v-icon>
      <span class="card-title">加入參與者</span>
    </div>

    <div class="input-wrapper">
      <textarea
        v-model="inputText"
        :placeholder="placeholder"
        class="custom-textarea"
        rows="3"
        @keydown.ctrl.enter="handleAdd"
        @keydown.meta.enter="handleAdd"
      ></textarea>
    </div>

    <button
      class="add-btn"
      :disabled="!inputText.trim()"
      @click="handleAdd"
    >
      <v-icon size="20" class="mr-2">mdi-plus-circle</v-icon>
      加入名單
    </button>
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(6, 182, 212, 0.3);
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
}

.input-wrapper {
  margin-bottom: 0.75rem;
}

.custom-textarea {
  width: 100%;
  padding: 0.75rem;
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  color: #E2E8F0;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 10px;
  resize: vertical;
  min-height: 60px;
  transition: all 0.2s ease;
}

.custom-textarea::placeholder {
  color: #64748B;
}

.custom-textarea:focus {
  outline: none;
  border-color: #06B6D4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.625rem 1.25rem;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
}

.add-btn:active:not(:disabled) {
  transform: translateY(0);
}

.add-btn:disabled {
  background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
  cursor: not-allowed;
  box-shadow: none;
}
</style>
