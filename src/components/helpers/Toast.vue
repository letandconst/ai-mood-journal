<template>
  <transition name="fade">
    <div v-if="show" class="toast">
      <slot />
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
});
</script>

<style scoped lang="scss">
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--toast-bg);
  color: var(--toast-text);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  font-size: 0.9rem;
  z-index: 1000;
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
