<template>
  <div class="toaster-container">
    <transition-group name="toast" tag="div">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="[`toast-${toast.type}`]">
        <div class="toast-content">
          <component :is="getToastIcon(toast.type)" class="toast-icon" />
          <div class="toast-text">
            <p class="toast-title">{{ toast.title }}</p>
            <p v-if="toast.description" class="toast-description">
              {{ toast.description }}
            </p>
          </div>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">
          <XIcon class="close-icon" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, AlertCircleIcon, XCircleIcon, InfoIcon, XIcon } from "lucide-vue-next";
import { useToaster } from "../../composables/useToaster";

// get toaster state from composable
const { toasts, removeToast } = useToaster();

const getToastIcon = (type: string) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: AlertCircleIcon,
    info: InfoIcon,
  };
  return icons[type as keyof typeof icons] || InfoIcon;
};
</script>

<style lang="scss" scoped>
.toaster-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 24rem;
}

.toast {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  &.toast-success {
    border-left: 4px solid rgb(34, 197, 94);
  }

  &.toast-error {
    border-left: 4px solid rgb(239, 68, 68);
  }

  &.toast-warning {
    border-left: 4px solid rgb(245, 158, 11);
  }

  &.toast-info {
    border-left: 4px solid rgb(59, 130, 246);
  }

  .toast-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    flex: 1;

    .toast-icon {
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.125rem;
      flex-shrink: 0;

      .toast-success & {
        color: rgb(34, 197, 94);
      }

      .toast-error & {
        color: rgb(239, 68, 68);
      }

      .toast-warning & {
        color: rgb(245, 158, 11);
      }

      .toast-info & {
        color: rgb(59, 130, 246);
      }
    }

    .toast-text {
      .toast-title {
        font-weight: 600;
        color: var(--color-foreground);
        margin-bottom: 0.25rem;
      }

      .toast-description {
        font-size: 0.875rem;
        color: var(--color-muted-foreground);
      }
    }
  }

  .toast-close {
    background: none;
    border: none;
    padding: 0.25rem;
    border-radius: 0.25rem;
    cursor: pointer;
    color: var(--color-muted-foreground);
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-accent);
      color: var(--color-foreground);
    }

    .close-icon {
      width: 1rem;
      height: 1rem;
    }
  }
}

// Toast animations
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
