<template>
  <button class="toggle-switch" :class="{ active: checked }" @click="$emit('change', !checked)">
    <div class="toggle-thumb"></div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  checked: boolean;
}

defineProps<Props>();
defineEmits<{
  change: [value: boolean];
}>();
</script>

<style lang="scss" scoped>
.toggle-switch {
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background: var(--color-muted);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    background: var(--color-primary);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.25rem;
    height: 1.25rem;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.active .toggle-thumb {
    transform: translateX(1.5rem);
  }
}
</style>
