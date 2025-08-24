<template>
  <div class="app-container">
    <!-- PIN Lock Screen -->
    <div v-if="settings.appLockEnabled && settings.appPin && !isUnlocked" class="pin-lock-screen">
      <div class="pin-lock-content">
        <div class="app-logo">
          <span class="logo-text">M</span>
        </div>
        <h1 class="app-title">MoodJournal</h1>
        <p class="app-subtitle">Your journal is protected</p>
      </div>
      <PinLock :is-open="showPinLock" :correct-pin="settings.appPin" @unlock="handleUnlock" />
    </div>

    <!-- Main App -->
    <div v-else class="main-app">
      <!-- Header -->
      <header class="app-header">
        <div class="header-left">
          <div class="app-logo">
            <span class="logo-text">M</span>
          </div>
          <h1 class="app-title">MoodJournal</h1>
        </div>

        <div class="header-actions">
          <button class="icon-button" @click="toggleTheme">
            <SunIcon v-if="theme.isDark.value" class="icon" />
            <MoonIcon v-else class="icon" />
          </button>
          <button class="icon-button" @click="$router.push('/history')">
            <HistoryIcon class="icon" />
          </button>
          <button class="icon-button" @click="$router.push('/settings')">
            <SettingsIcon class="icon" />
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-container">
          <!-- Welcome Section -->
          <div class="welcome-section">
            <h2 class="welcome-title">How are you feeling today?</h2>
            <p class="welcome-subtitle">
              Take a moment to check in with yourself and track your emotional wellness
            </p>
          </div>

          <!-- Mood Selection -->
          <div class="mood-card">
            <MoodSelector @mood-select="handleMoodSelect" />
          </div>

          <!-- Mood Insights -->
          <MoodInsights v-if="entries.length > 0" />

          <!-- Recent Entries Preview -->
          <RecentEntries />
        </div>
      </main>

      <!-- Dialogs -->
      <JournalDialog
        :is-open="showJournalDialog"
        :selected-mood="selectedMood"
        @close="showJournalDialog = false"
      />

      <Onboarding :is-open="showOnboarding" @complete="handleOnboardingComplete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";

import { MoonIcon, SunIcon, SettingsIcon, HistoryIcon } from "lucide-vue-next";
import MoodSelector from "../components/MoodSelector.vue";
import JournalDialog from "../components/JournalDialog.vue";
import RecentEntries from "../components/RecentEntries.vue";
import MoodInsights from "../components/MoodInsights.vue";
import Onboarding from "../components/Onboarding.vue";
import PinLock from "../components/pin/PinLock.vue";
import { useSettings } from "../composables/useSettings";
import { useJournal } from "../composables/useJournal";

import type { ThemeInjection } from "../App.vue";

const theme = inject<ThemeInjection>("theme");
if (!theme) throw new Error("Theme not provided");

const { settings } = useSettings();
const { entries } = useJournal();

const selectedMood = ref<string | null>(null);
const showJournalDialog = ref(false);
const showOnboarding = ref(false);
const showPinLock = ref(false);
const isUnlocked = ref(false);

onMounted(() => {
  // Check if user is new
  const hasSeenOnboarding = localStorage.getItem("mood-journal-onboarding-complete");
  if (!hasSeenOnboarding) {
    showOnboarding.value = true;
  }

  // Check if app lock is enabled
  if (settings.value.appLockEnabled && settings.value.appPin && !isUnlocked.value) {
    showPinLock.value = true;
  }
});

const handleMoodSelect = (mood: string) => {
  selectedMood.value = mood;
  showJournalDialog.value = true;
};

const handleOnboardingComplete = () => {
  localStorage.setItem("mood-journal-onboarding-complete", "true");
  showOnboarding.value = false;
};

const handleUnlock = () => {
  isUnlocked.value = true;
  showPinLock.value = false;
};

const toggleTheme = () => {
  theme.toggle();
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-card) 50%,
    var(--color-muted) 100%
  );
}

.pin-lock-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-card) 50%,
    var(--color-muted) 100%
  );

  .pin-lock-content {
    text-align: center;

    .app-logo {
      width: 4rem;
      height: 4rem;
      background: var(--color-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;

      .logo-text {
        color: var(--color-primary-foreground);
        font-weight: bold;
        font-size: 1.25rem;
      }
    }

    .app-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-foreground);
      margin-bottom: 0.5rem;
    }

    .app-subtitle {
      color: var(--color-muted-foreground);
    }
  }
}

.main-app {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .app-logo {
      width: 2rem;
      height: 2rem;
      background: var(--color-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .logo-text {
        color: var(--color-primary-foreground);
        font-weight: bold;
        font-size: 0.875rem;
      }
    }

    .app-title {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--color-foreground);
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon-button {
      background: transparent;
      border: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: rgba(var(--color-accent-rgb), 0.1);
      }

      .icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-foreground);
      }
    }
  }
}

.main-content {
  padding: 0 1.5rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem 1.5rem;
  }

  .content-container {
    max-width: 42rem;
    margin: 0 auto;
  }

  .welcome-section {
    text-align: center;
    margin-bottom: 2rem;
    animation: slideUp 0.6s ease-out;

    .welcome-title {
      font-size: 2rem;
      font-weight: bold;
      color: var(--color-foreground);
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 1.875rem;
      }
    }

    .welcome-subtitle {
      color: var(--color-muted-foreground);
      font-size: 1.125rem;
    }
  }

  .mood-card {
    background: rgba(var(--color-card-rgb), 0.5);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    animation: slideUp 0.6s ease-out 0.1s both;
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
</style>
