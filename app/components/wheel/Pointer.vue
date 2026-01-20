<script setup lang="ts">
</script>

<template>
  <div class="pointer">
    <svg width="30" height="40" viewBox="0 0 30 40">
      <polygon points="15,40 0,0 30,0" fill="#1e293b" />
      <polygon points="15,32 5,5 25,5" fill="#334155" />
    </svg>
  </div>
</template>

<style scoped>
.pointer {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
