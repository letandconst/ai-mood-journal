import { ref, onMounted, computed } from "vue";
import * as journalStorage from "../utils/journalStorage";
import type { JournalEntry } from "../utils/journalStorage";
import { useToaster } from "../composables/useToaster";

const entries = ref<JournalEntry[]>([]);
const isLoading = ref<boolean>(false);
let initialized = false;

// helpers
const loadEntries = () => {
  isLoading.value = true;
  try {
    entries.value = journalStorage.getAllEntries();
  } finally {
    isLoading.value = false;
  }
};

const getRecentEntries = (count: number) => computed(() => entries.value.slice(0, count));

export function useJournal() {
  const { addToast } = useToaster();

  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    loadEntries();

    // optional: keep in sync if localStorage changes (other tabs/windows)
    window.addEventListener("storage", (e) => {
      if (e.key === "mood-journal-entries") loadEntries();
    });
  }

  const saveEntry = (mood: string, text: string) => {
    try {
      const newEntry = journalStorage.saveEntry(mood, text);
      entries.value.unshift(newEntry);

      addToast({
        type: "success",
        title: "Entry saved",
        description: "Your mood entry has been added successfully.",
      });
      return newEntry;
    } catch (error) {
      console.error("Error saving entry:", error);
      throw error;
    }
  };

  const deleteEntry = (id: string) => {
    try {
      journalStorage.deleteEntry(id);
      entries.value = entries.value.filter((entry) => entry.id !== id);
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  };

  const updateEntry = (id: string, updates: Partial<Pick<JournalEntry, "text" | "mood">>) => {
    try {
      const updatedEntry = journalStorage.updateEntry(id, updates);
      if (updatedEntry) {
        const index = entries.value.findIndex((entry) => entry.id === id);
        if (index !== -1) {
          entries.value[index] = updatedEntry;
        }
      }
      return updatedEntry;
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  };

  const getMoodStats = () => {
    return computed(() => journalStorage.getMoodStats());
  };

  const exportEntries = () => {
    return journalStorage.exportEntries();
  };

  const importEntries = (jsonData: string) => {
    const success = journalStorage.importEntries(jsonData);
    if (success) {
      loadEntries();
    }
    return success;
  };

  const clearAllEntries = () => {
    journalStorage.clearAllEntries();
    entries.value = [];
  };

  onMounted(() => {
    loadEntries();
  });

  return {
    entries,
    isLoading,
    saveEntry,
    deleteEntry,
    updateEntry,
    getRecentEntries,
    getMoodStats,
    exportEntries,
    importEntries,
    clearAllEntries,
    refresh: loadEntries,
  };
}
