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
例如：
小明
小華, 小美
大雄`
</script>

<template>
  <v-card>
    <v-card-title class="text-h6" style="color: #7D6B5D;">
      <v-icon start color="#A8D8EA">mdi-account-plus</v-icon>
      加入參與者
    </v-card-title>
    <v-card-text>
      <v-textarea
        v-model="inputText"
        :placeholder="placeholder"
        rows="4"
        auto-grow
        hide-details
        @keydown.ctrl.enter="handleAdd"
        @keydown.meta.enter="handleAdd"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        :disabled="!inputText.trim()"
        @click="handleAdd"
      >
        <v-icon start>mdi-plus</v-icon>
        加入名單
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
