<template>
  <div v-if="isOpen" class="onboarding-overlay">
    <div class="onboarding-dialog">
      <div class="onboarding-content">
        <!-- Progress Indicator -->
        <div class="progress-indicator">
          <div
            v-for="(_, index) in onboardingSteps"
            :key="index"
            class="progress-dot"
            :class="{ active: index <= currentStep }"
          ></div>
        </div>

        <!-- Content -->
        <div class="step-content">
          <div class="step-icon-wrapper" :class="currentStepData.bgClass">
            <component
              :is="currentStepData.icon"
              class="step-icon"
              :class="currentStepData.colorClass"
            />
          </div>

          <h2 class="step-title">{{ currentStepData.title }}</h2>
          <p class="step-description">{{ currentStepData.description }}</p>
        </div>

        <!-- Navigation -->
        <div class="navigation-buttons">
          <button class="skip-button" @click="handleSkip">Skip</button>

          <button class="next-button" @click="handleNext">
            <span v-if="currentStep < onboardingSteps.length - 1">Next</span>
            <span v-else>Get Started</span>
            <ChevronRightIcon v-if="currentStep < onboardingSteps.length - 1" class="next-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  HeartIcon,
  BookOpenIcon,
  TrendingUpIcon,
  ShieldIcon,
  ChevronRightIcon,
} from "lucide-vue-next";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  complete: [];
}>();

const currentStep = ref(0);

const onboardingSteps = [
  {
    icon: HeartIcon,
    title: "Welcome to MoodJournal",
    description:
      "Your personal space for emotional wellness and self-reflection. Track your moods, journal your thoughts, and discover patterns in your emotional journey.",
    colorClass: "text-primary",
    bgClass: "bg-primary",
  },
  {
    icon: BookOpenIcon,
    title: "Express Yourself",
    description:
      "Select your mood and write about your feelings. Our gentle prompts will guide you through meaningful self-reflection exercises.",
    colorClass: "text-secondary",
    bgClass: "bg-secondary",
  },
  {
    icon: TrendingUpIcon,
    title: "Track Your Progress",
    description:
      "Visualize your emotional patterns with beautiful charts and calendars. Understand your mood trends and celebrate your growth.",
    colorClass: "text-accent",
    bgClass: "bg-accent",
  },
  {
    icon: ShieldIcon,
    title: "Your Privacy Matters",
    description:
      "All your data stays on your device. Set up a PIN lock for extra security and export your entries anytime you want.",
    colorClass: "text-green",
    bgClass: "bg-green",
  },
];

const currentStepData = computed(() => onboardingSteps[currentStep.value]);

const handleNext = () => {
  if (currentStep.value < onboardingSteps.length - 1) {
    currentStep.value++;
  } else {
    emit("complete");
  }
};

const handleSkip = () => {
  emit("complete");
};
</script>

<style lang="scss" scoped>
.onboarding-overlay {
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

.onboarding-dialog {
  background: rgba(var(--color-card-rgb), 0.95);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  width: 100%;
  max-width: 32rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.onboarding-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress-indicator {
  display: flex;
  gap: 0.5rem;
  justify-content: center;

  .progress-dot {
    height: 0.5rem;
    border-radius: 9999px;
    transition: all 0.3s ease;
    background: var(--color-muted);
    width: 0.5rem;

    &.active {
      background: var(--color-primary);
      width: 2rem;
    }
  }
}

.step-content {
  text-align: center;

  .step-icon-wrapper {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    animation: zoomIn 0.5s ease-out;

    &.bg-primary {
      background: rgba(var(--color-primary-rgb), 0.1);
    }

    &.bg-secondary {
      background: rgba(var(--color-secondary-rgb), 0.1);
    }

    &.bg-accent {
      background: rgba(var(--color-accent-rgb), 0.1);
    }

    &.bg-green {
      background: rgba(34, 197, 94, 0.1);
    }

    .step-icon {
      width: 2.5rem;
      height: 2.5rem;

      &.text-primary {
        color: var(--color-primary);
      }

      &.text-secondary {
        color: var(--color-secondary);
      }

      &.text-accent {
        color: var(--color-accent);
      }

      &.text-green {
        color: rgb(34, 197, 94);
      }
    }
  }

  .step-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-foreground);
    margin-bottom: 1rem;
    animation: slideUp 0.5s ease-out;
  }

  .step-description {
    color: var(--color-muted-foreground);
    line-height: 1.5;
    animation: slideUp 0.5s ease-out 0.1s both;
  }
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;

  .skip-button {
    background: none;
    border: none;
    color: var(--color-muted-foreground);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-foreground);
    }
  }

  .next-button {
    background: var(--color-primary);
    color: var(--color-primary-foreground);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-primary);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(var(--color-primary-rgb), 0.3);
    }

    .next-icon {
      width: 1rem;
      height: 1rem;
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
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
