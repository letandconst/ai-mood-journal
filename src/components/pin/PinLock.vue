<template>
  <div v-if="isOpen" class="pin-lock-overlay">
    <div class="pin-lock-dialog">
      <div class="pin-lock-content">
        <div class="pin-lock-header">
          <div class="lock-icon-wrapper">
            <LockIcon class="lock-icon" />
          </div>
          <h2 class="pin-title">Enter PIN</h2>
          <p class="pin-subtitle">Enter your PIN to access your journal</p>
        </div>

        <div class="pin-display">
          <div
            v-for="i in 4"
            :key="i"
            class="pin-dot"
            :class="{ filled: enteredPin.length >= i, error: hasError }"
          ></div>
        </div>

        <div class="pin-keypad">
          <button
            v-for="number in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
            :key="number"
            class="keypad-button"
            @click="addDigit(number.toString())"
          >
            {{ number }}
          </button>
          <div class="keypad-spacer"></div>
          <button class="keypad-button" @click="addDigit('0')">0</button>
          <button class="keypad-button delete" @click="removeDigit">
            <X class="delete-icon" />
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { LockIcon, X } from "lucide-vue-next";

interface Props {
  isOpen: boolean;
  correctPin: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  unlock: [];
}>();

const enteredPin = ref("");
const error = ref("");
const hasError = ref(false);

const addDigit = (digit: string) => {
  if (enteredPin.value.length < 4) {
    enteredPin.value += digit;

    if (enteredPin.value.length === 4) {
      setTimeout(() => {
        if (enteredPin.value === props.correctPin) {
          emit("unlock");
          resetState();
        } else {
          error.value = "Incorrect PIN. Please try again.";
          hasError.value = true;
          setTimeout(() => {
            enteredPin.value = "";
            error.value = "";
            hasError.value = false;
          }, 1500);
        }
      }, 200);
    }
  }
};

const removeDigit = () => {
  if (enteredPin.value.length > 0) {
    enteredPin.value = enteredPin.value.slice(0, -1);
  }
};

const resetState = () => {
  enteredPin.value = "";
  error.value = "";
  hasError.value = false;
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      resetState();
    }
  }
);
</script>

<style lang="scss" scoped>
.pin-lock-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
  animation: fadeIn 0.2s ease-out;
}

.pin-lock-dialog {
  background: var(--color-card);
  border-radius: 1rem;
  width: 100%;
  max-width: 24rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.pin-lock-content {
  padding: 2rem;
  text-align: center;
}

.pin-lock-header {
  margin-bottom: 2rem;

  .lock-icon-wrapper {
    width: 4rem;
    height: 4rem;
    background: rgba(var(--color-primary-rgb), 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;

    .lock-icon {
      width: 2rem;
      height: 2rem;
      color: var(--color-primary);
    }
  }

  .pin-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-foreground);
    margin-bottom: 0.5rem;
  }

  .pin-subtitle {
    color: var(--color-muted-foreground);
  }
}

.pin-display {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  .pin-dot {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--color-muted);
    transition: all 0.2s ease;

    &.filled {
      background: var(--color-primary);
      transform: scale(1.2);
    }

    &.error {
      background: var(--color-destructive);
      animation: shake 0.5s ease-in-out;
    }
  }
}

.pin-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  .keypad-button {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 1px solid var(--color-border);
    background: var(--color-card);
    color: var(--color-foreground);
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: var(--color-accent);
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    &.delete {
      background: transparent;
      border: none;

      .delete-icon {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--color-muted-foreground);
      }

      &:hover {
        background: rgba(var(--color-destructive-rgb), 0.1);

        .delete-icon {
          color: var(--color-destructive);
        }
      }
    }
  }

  .keypad-spacer {
    // Empty space for layout
  }
}

.error-message {
  color: var(--color-destructive);
  font-size: 0.875rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
</style>
