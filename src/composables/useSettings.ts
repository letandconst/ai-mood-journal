import { ref, watch } from "vue";

interface Settings {
  appLockEnabled: boolean;
  appPin: string;
  notificationsEnabled: boolean;
  reminderTime: string;
  theme: "light" | "dark" | "system";
}

const defaultSettings: Settings = {
  appLockEnabled: false,
  appPin: "",
  notificationsEnabled: true,
  reminderTime: "20:00",
  theme: "system",
};

export function useSettings() {
  const settings = ref<Settings>({ ...defaultSettings });

  // Load settings from localStorage
  const loadSettings = () => {
    try {
      const stored = localStorage.getItem("mood-journal-settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        settings.value = { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem("mood-journal-settings", JSON.stringify(settings.value));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  // Update a specific setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settings.value[key] = value;
  };

  // Reset settings to defaults
  const resetSettings = () => {
    settings.value = { ...defaultSettings };
  };

  // Watch for changes and auto-save
  watch(settings, saveSettings, { deep: true });

  // Initialize
  loadSettings();

  return {
    settings,
    updateSetting,
    resetSettings,
    saveSettings,
    loadSettings,
  };
}
