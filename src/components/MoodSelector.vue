<template>
  <div class="mood-selector">
    <div class="mood-description">
      <p v-if="hoveredMood" class="description-text">
        {{ getMoodDescription(hoveredMood) }}
      </p>
    </div>

    <div class="mood-grid">
      <button
        v-for="mood in moods"
        :key="mood.id"
        class="mood-button"
        :class="[
          `mood-${mood.id}`,
          { hovered: hoveredMood === mood.id },
          { selected: selectedMood === mood.id },
        ]"
        @click="handleMoodClick(mood.id)"
        @mouseenter="hoveredMood = mood.id"
        @mouseleave="hoveredMood = null"
      >
        <div class="mood-overlay"></div>

        <component
          :is="mood.icon"
          class="mood-icon"
          :class="{ bounce: selectedMood === mood.id }"
        />

        <span class="mood-label">{{ mood.label }}</span>

        <div v-if="selectedMood === mood.id" class="selection-border"></div>
      </button>
    </div>

    <div class="mood-instruction">
      <p class="instruction-text">Tap a mood that best represents how you're feeling right now</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SmileIcon, FrownIcon, AngryIcon, ZapIcon, XIcon } from "lucide-vue-next";

interface Props {
  onMoodSelect?: (mood: string) => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "mood-select": [mood: string];
}>();

const hoveredMood = ref<string | null>(null);
const selectedMood = ref<string | null>(null);

const moods = [
  {
    id: "happy",
    label: "Happy",
    icon: SmileIcon,
    description: "Feeling joyful, content, and optimistic",
  },
  {
    id: "sad",
    label: "Sad",
    icon: FrownIcon,
    description: "Feeling down, melancholy, or disappointed",
  },
  {
    id: "anger",
    label: "Angry",
    icon: AngryIcon,
    description: "Feeling frustrated, irritated, or upset",
  },
  {
    id: "fear",
    label: "Fearful",
    icon: ZapIcon,
    description: "Feeling anxious, worried, or uncertain",
  },
  {
    id: "disgust",
    label: "Disgusted",
    icon: XIcon,
    description: "Feeling repulsed, uncomfortable, or averse",
  },
];

const getMoodDescription = (moodId: string) => {
  return moods.find((mood) => mood.id === moodId)?.description || "";
};

const handleMoodClick = (moodId: string) => {
  selectedMood.value = moodId;
  setTimeout(() => {
    emit("mood-select", moodId);
    if (props.onMoodSelect) {
      props.onMoodSelect(moodId);
    }
    selectedMood.value = null;
  }, 200);
};
</script>

<style lang="scss" scoped>
.mood-selector {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mood-description {
  text-align: center;
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .description-text {
    font-size: 0.875rem;
    color: var(--color-muted-foreground);
    animation: fadeInSlideUp 0.3s ease-out;
  }
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
}

.mood-button {
  position: relative;
  height: 7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  color: white;
  font-weight: 600;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  &:hover {
    transform: scale(1.1) translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &.selected {
    transform: scale(1.05);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  &.hovered {
    animation: moodPulse 2s infinite;
  }

  // Mood-specific gradients
  &.mood-happy {
    background: linear-gradient(135deg, rgb(251, 191, 36), rgb(251, 146, 60));
    box-shadow: 0 10px 15px -3px rgba(251, 191, 36, 0.3);

    &:hover,
    &.hovered {
      background: linear-gradient(135deg, rgb(245, 158, 11), rgb(245, 101, 101));
      box-shadow: 0 20px 25px -5px rgba(251, 191, 36, 0.4);
    }
  }

  &.mood-sad {
    background: linear-gradient(135deg, rgb(96, 165, 250), rgb(129, 140, 248));
    box-shadow: 0 10px 15px -3px rgba(96, 165, 250, 0.3);

    &:hover,
    &.hovered {
      background: linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241));
      box-shadow: 0 20px 25px -5px rgba(96, 165, 250, 0.4);
    }
  }

  &.mood-anger {
    background: linear-gradient(135deg, rgb(248, 113, 113), rgb(251, 113, 133));
    box-shadow: 0 10px 15px -3px rgba(248, 113, 113, 0.3);

    &:hover,
    &.hovered {
      background: linear-gradient(135deg, rgb(239, 68, 68), rgb(236, 72, 153));
      box-shadow: 0 20px 25px -5px rgba(248, 113, 113, 0.4);
    }
  }

  &.mood-fear {
    background: linear-gradient(135deg, rgb(196, 181, 253), rgb(167, 139, 250));
    box-shadow: 0 10px 15px -3px rgba(196, 181, 253, 0.3);

    &:hover,
    &.hovered {
      background: linear-gradient(135deg, rgb(168, 85, 247), rgb(147, 51, 234));
      box-shadow: 0 20px 25px -5px rgba(196, 181, 253, 0.4);
    }
  }

  &.mood-disgust {
    background: linear-gradient(135deg, rgb(134, 239, 172), rgb(74, 222, 128));
    box-shadow: 0 10px 15px -3px rgba(134, 239, 172, 0.3);

    &:hover,
    &.hovered {
      background: linear-gradient(135deg, rgb(34, 197, 94), rgb(16, 185, 129));
      box-shadow: 0 20px 25px -5px rgba(134, 239, 172, 0.4);
    }
  }
}

.mood-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;

  .mood-button:hover & {
    opacity: 1;
  }
}

.mood-icon {
  width: 2.5rem;
  height: 2.5rem;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;

  .mood-button:hover & {
    transform: scale(1.1);
  }

  &.bounce {
    animation: bounce 1s ease-in-out;
  }
}

.mood-label {
  font-size: 0.875rem;
  font-weight: 600;
  position: relative;
  z-index: 10;
  letter-spacing: 0.025em;
}

.selection-border {
  position: absolute;
  inset: 0;
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  animation: pulse 1s infinite;
}

.mood-instruction {
  text-align: center;

  .instruction-text {
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
  }
}

// Animations
@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes moodPulse {
  0%,
  100% {
    transform: scale(1.1) translateY(-4px);
  }
  50% {
    transform: scale(1.15) translateY(-6px);
  }
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translateY(0);
  }
  40%,
  43% {
    transform: translateY(-10px);
  }
  70% {
    transform: translateY(-5px);
  }
  90% {
    transform: translateY(-2px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
