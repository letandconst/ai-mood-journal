<template>
  <div class="settings-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <button class="back-button" @click="$router.back()">
          <ArrowLeftIcon class="back-icon" />
        </button>
        <div class="header-text">
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Customize your mood journal experience</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Appearance -->
        <div class="settings-card">
          <div class="card-header">
            <div class="header-icon primary">
              <PaletteIcon class="icon" />
            </div>
            <h2 class="card-title">Appearance</h2>
          </div>

          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-name">Dark Mode</p>
                <p class="setting-description">Switch between light and dark themes</p>
              </div>
              <ToggleSwitch :checked="theme.isDark.value" @change="theme.toggle" />
            </div>
          </div>
        </div>

        <!-- Privacy & Security -->
        <div class="settings-card">
          <div class="card-header">
            <div class="header-icon secondary">
              <ShieldIcon class="icon" />
            </div>
            <h2 class="card-title">Privacy & Security</h2>
          </div>

          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <p class="setting-name">App Lock</p>
                <p class="setting-description">Protect your journal with a PIN</p>
              </div>
              <ToggleSwitch :checked="settings.appLockEnabled" @change="handleAppLockToggle" />
            </div>

            <div v-if="settings.appLockEnabled" class="setting-action">
              <button class="change-pin-button" @click="showPinSetup = true">Change PIN</button>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <NotificationSettings />

        <!-- Data Management -->
        <DataManagement />

        <!-- About -->
        <div class="settings-card">
          <h2 class="card-title">About</h2>
          <div class="about-info">
            <p class="about-item">MoodJournal v1.0.0</p>
            <p class="about-item">Built with Vue 3 and SASS</p>
          </div>
        </div>
      </div>
    </main>

    <!-- PIN Setup Dialog -->
    <PinSetup :is-open="showPinSetup" @close="showPinSetup = false" @pin-set="handlePinSet" />
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { ArrowLeftIcon, ShieldIcon, PaletteIcon } from "lucide-vue-next";
import { useSettings } from "../composables/useSettings";
import ToggleSwitch from "../components/ui/ToggleSwitch.vue";
import PinSetup from "../components/pin/PinSetup.vue";
import NotificationSettings from "../components/NotificationSettings.vue";
import DataManagement from "../components/DataManagement.vue";

import type { ThemeInjection } from "../App.vue";

const theme = inject<ThemeInjection>("theme");
if (!theme) throw new Error("Theme not provided");

const { settings, updateSetting } = useSettings();
const showPinSetup = ref(false);

const handleAppLockToggle = (checked: boolean) => {
  if (checked) {
    showPinSetup.value = true;
  } else {
    updateSetting("appLockEnabled", false);
    updateSetting("appPin", "");
  }
};

const handlePinSet = (pin: string) => {
  updateSetting("appLockEnabled", true);
  updateSetting("appPin", pin);
  showPinSetup.value = false;
};
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-card) 50%,
    var(--color-muted) 100%
  );
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .back-button {
      background: transparent;
      border: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: rgba(var(--color-accent-rgb), 0.1);
      }

      .back-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-foreground);
      }
    }

    .header-text {
      .page-title {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--color-foreground);
      }

      .page-subtitle {
        font-size: 0.875rem;
        color: var(--color-muted-foreground);
      }
    }
  }
}

.main-content {
  padding: 0 1.5rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem 1.5rem;
  }

  .content-wrapper {
    max-width: 42rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.settings-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;

    .header-icon {
      padding: 0.5rem;
      border-radius: 50%;

      &.primary {
        background: rgba(var(--color-primary-rgb), 0.1);
      }

      &.secondary {
        background: rgba(var(--color-secondary-rgb), 0.1);
      }

      .icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-primary);
      }
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-foreground);
    }
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .setting-info {
        .setting-name {
          font-weight: 500;
          color: var(--color-foreground);
        }

        .setting-description {
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
        }
      }
    }

    .setting-action {
      .change-pin-button {
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-foreground);
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--color-accent);
        }
      }
    }
  }

  .about-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .about-item {
      font-size: 0.875rem;
      color: var(--color-muted-foreground);
    }
  }
}
</style>
