<template>
  <div class="settings-card">
    <div class="card-header">
      <div class="header-icon">
        <BellIcon class="icon" />
      </div>
      <h2 class="card-title">Notifications</h2>
    </div>

    <div class="settings-list">
      <div class="setting-item">
        <div class="setting-info">
          <p class="setting-name">Daily Reminders</p>
          <p class="setting-description">Get reminded to check in with your mood</p>
        </div>
        <ToggleSwitch
          :checked="settings.notificationsEnabled"
          @change="(value) => updateSetting('notificationsEnabled', value)"
        />
      </div>

      <div v-if="settings.notificationsEnabled" class="setting-item">
        <div class="setting-info">
          <p class="setting-name">Reminder Time</p>
          <p class="setting-description">When would you like to be reminded?</p>
        </div>
        <input
          type="time"
          class="time-input"
          :value="settings.reminderTime"
          @change="(e) => updateSetting('reminderTime', (e.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BellIcon } from "lucide-vue-next";
import { useSettings } from "../composables/useSettings";
import ToggleSwitch from "./ui/ToggleSwitch.vue";

const { settings, updateSetting } = useSettings();
</script>

<style lang="scss" scoped>
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
      background: rgba(var(--color-primary-rgb), 0.1);
      border-radius: 50%;

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

      .time-input {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 0.375rem;
        padding: 0.5rem;
        color: var(--color-foreground);
        font-size: 0.875rem;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
        }
      }
    }
  }
}
</style>
