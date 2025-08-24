<template>
  <div v-if="isOpen" class="dialog-overlay" @click="handleOverlayClick">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <div class="mood-indicator" :class="`mood-${selectedMood}`">
          <component :is="getMoodIcon(selectedMood)" class="mood-icon" />
        </div>
        <div class="header-text">
          <h2 class="dialog-title">How was your {{ getMoodLabel(selectedMood) }} moment?</h2>
          <p class="dialog-subtitle">Share your thoughts and feelings</p>
        </div>
        <button class="close-button" @click="$emit('close')">
          <XIcon class="close-icon" />
        </button>
      </div>

      <div class="dialog-body">
        <div class="suggestions-section">
          <h3 class="suggestions-title">Reflection prompts:</h3>
          <div class="suggestions-list">
            <button
              v-for="suggestion in getMoodSuggestions(selectedMood)"
              :key="suggestion"
              class="suggestion-button"
              @click="addSuggestionToEntry(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <div class="journal-section">
          <label class="journal-label">Your thoughts:</label>
          <textarea
            v-model="journalEntry"
            class="journal-textarea"
            placeholder="What's on your mind? How are you feeling right now?"
            rows="6"
          ></textarea>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="cancel-button" @click="$emit('close')">Cancel</button>
        <button class="save-button" :disabled="!journalEntry.trim()" @click="handleSave">
          Save Entry
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { XIcon, SmileIcon, FrownIcon, AngryIcon, ZapIcon } from "lucide-vue-next";
import { useJournal } from "../composables/useJournal";
interface Props {
  isOpen: boolean;
  selectedMood: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  // save: [entry: { mood: string; text: string; timestamp: string }];
}>();

const { saveEntry } = useJournal();

const journalEntry = ref("");

const moodData = {
  happy: {
    label: "happy",
    icon: SmileIcon,
    suggestions: [
      "What made you smile today?",
      "Who or what brought you joy?",
      "What are you grateful for right now?",
      "How can you share this happiness?",
    ],
  },
  sad: {
    label: "sad",
    icon: FrownIcon,
    suggestions: [
      "What triggered this feeling?",
      "What support do you need right now?",
      "What would help you feel better?",
      "Who can you reach out to?",
    ],
  },
  anger: {
    label: "angry",
    icon: AngryIcon,
    suggestions: [
      "What situation caused this anger?",
      "How can you express this safely?",
      "What boundaries need to be set?",
      "What would resolution look like?",
    ],
  },
  fear: {
    label: "fearful",
    icon: ZapIcon,
    suggestions: [
      "What are you worried about?",
      "What facts vs fears can you identify?",
      "What small step can you take?",
      "Who can support you through this?",
    ],
  },
  disgust: {
    label: "disgusted",
    icon: XIcon,
    suggestions: [
      "What situation feels uncomfortable?",
      "What values are being challenged?",
      "How can you protect your wellbeing?",
      "What changes need to happen?",
    ],
  },
};

const getMoodLabel = (mood: string | null) => {
  if (!mood) return "";
  return moodData[mood as keyof typeof moodData]?.label || mood;
};

const getMoodIcon = (mood: string | null) => {
  if (!mood) return SmileIcon;
  return moodData[mood as keyof typeof moodData]?.icon || SmileIcon;
};

const getMoodSuggestions = (mood: string | null) => {
  if (!mood) return [];
  return moodData[mood as keyof typeof moodData]?.suggestions || [];
};

const addSuggestionToEntry = (suggestion: string) => {
  if (journalEntry.value) {
    journalEntry.value += `\n\n${suggestion}\n`;
  } else {
    journalEntry.value = `${suggestion}\n`;
  }
};

const handleSave = () => {
  if (journalEntry.value.trim() && props.selectedMood) {
    saveEntry(props.selectedMood, journalEntry.value.trim());
    journalEntry.value = "";
    emit("close");
  }
};

const handleOverlayClick = () => {
  emit("close");
};

// Reset journal entry when dialog closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      journalEntry.value = "";
    }
  }
);
</script>

<style lang="scss" scoped>
.dialog-overlay {
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

.dialog-content {
  background: var(--color-card);
  border-radius: 1rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid var(--color-border);

  .mood-indicator {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .mood-icon {
      width: 1.5rem;
      height: 1.5rem;
      color: white;
    }

    &.mood-happy {
      background: linear-gradient(135deg, rgb(251, 191, 36), rgb(251, 146, 60));
    }
    &.mood-sad {
      background: linear-gradient(135deg, rgb(96, 165, 250), rgb(129, 140, 248));
    }
    &.mood-anger {
      background: linear-gradient(135deg, rgb(248, 113, 113), rgb(251, 113, 133));
    }
    &.mood-fear {
      background: linear-gradient(135deg, rgb(196, 181, 253), rgb(167, 139, 250));
    }
    &.mood-disgust {
      background: linear-gradient(135deg, rgb(134, 239, 172), rgb(74, 222, 128));
    }
  }

  .header-text {
    flex: 1;

    .dialog-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-foreground);
      margin-bottom: 0.25rem;
    }

    .dialog-subtitle {
      font-size: 0.875rem;
      color: var(--color-muted-foreground);
    }
  }

  .close-button {
    background: none;
    border: none;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    color: var(--color-muted-foreground);
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-accent);
      color: var(--color-foreground);
    }

    .close-icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

.dialog-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.suggestions-section {
  .suggestions-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 0.75rem;
  }

  .suggestions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .suggestion-button {
      background: var(--color-secondary);
      color: var(--color-secondary-foreground);
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--color-primary);
        color: var(--color-primary-foreground);
        transform: translateY(-1px);
      }
    }
  }
}

.journal-section {
  .journal-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 0.5rem;
  }

  .journal-textarea {
    width: 100%;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-size: 0.875rem;
    color: var(--color-foreground);
    resize: vertical;
    min-height: 6rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
    }

    &::placeholder {
      color: var(--color-muted-foreground);
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--color-border);

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

  .save-button {
    background: var(--color-primary);
    color: var(--color-primary-foreground);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: var(--color-primary);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(var(--color-primary-rgb), 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
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
</style>
