<template>
  <div v-if="isOpen" class="pin-setup-overlay">
    <div class="pin-setup-dialog">
      <div class="pin-setup-content">
        <div class="pin-setup-header">
          <h2 class="pin-title">{{ isConfirming ? "Confirm PIN" : "Set PIN" }}</h2>
          <p class="pin-subtitle">
            {{
              isConfirming
                ? "Enter your PIN again to confirm"
                : "Choose a 4-digit PIN to protect your journal"
            }}
          </p>
        </div>

        <div class="pin-display">
          <div v-for="i in 4" :key="i" class="pin-dot" :class="{ filled: pin.length >= i }"></div>
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

        <div class="pin-actions">
          <button class="cancel-button" @click="handleCancel">Cancel</button>
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
import { X } from "lucide-vue-next";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  "pin-set": [pin: string];
}>();

const pin = ref("");
const confirmPin = ref("");
const isConfirming = ref(false);
const error = ref("");

const addDigit = (digit: string) => {
  if (pin.value.length < 4) {
    pin.value += digit;

    if (pin.value.length === 4) {
      if (!isConfirming.value) {
        // First PIN entry complete, now confirm
        setTimeout(() => {
          isConfirming.value = true;
          confirmPin.value = pin.value;
          pin.value = "";
          error.value = "";
        }, 200);
      } else {
        // Confirmation complete
        setTimeout(() => {
          if (pin.value === confirmPin.value) {
            emit("pin-set", pin.value);
            resetState();
          } else {
            error.value = "PINs do not match. Please try again.";
            setTimeout(() => {
              isConfirming.value = false;
              pin.value = "";
              confirmPin.value = "";
              error.value = "";
            }, 1500);
          }
        }, 200);
      }
    }
  }
};

const removeDigit = () => {
  if (pin.value.length > 0) {
    pin.value = pin.value.slice(0, -1);
  }
};

const handleCancel = () => {
  resetState();
  emit("close");
};

const resetState = () => {
  pin.value = "";
  confirmPin.value = "";
  isConfirming.value = false;
  error.value = "";
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
.pin-setup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
  animation: fadeIn 0.2s ease-out;
}

.pin-setup-dialog {
  background: var(--color-card);
  border-radius: 1rem;
  width: 100%;
  max-width: 24rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.pin-setup-content {
  padding: 2rem;
  text-align: center;
}

.pin-setup-header {
  margin-bottom: 2rem;

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
  }
}

.pin-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

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

.pin-actions {
  .cancel-button {
    background: none;
    border: 1px solid var(--color-border);
    color: var(--color-foreground);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-accent);
    }
  }
}

.error-message {
  color: var(--color-destructive);
  font-size: 0.875rem;
  margin-top: 1rem;
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
