import { ref, onMounted } from "vue";
import { useToast } from "./useToast";

export function useMoodEntries() {
  const { showToast } = useToast();

  const selectedMood = ref(null);
  const journalEntry = ref("");
  const moodEntries = ref([]);
  const showStats = ref(false);

  const selectMood = (mood) => {
    selectedMood.value = mood;
    journalEntry.value = "";
  };

  const saveMoodEntry = () => {
    if (!selectedMood.value || !journalEntry.value.trim()) return;

    const entry = {
      id: Date.now(),
      moodId: selectedMood.value.id,
      journal: journalEntry.value.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    moodEntries.value = moodEntries.value.filter((e) => e.date !== entry.date);
    moodEntries.value.push(entry);

    localStorage.setItem("moodEntries", JSON.stringify(moodEntries.value));

    selectedMood.value = null;
    journalEntry.value = "";

    // ✅ Trigger global toast instead of local state
    showToast("✅ Mood entry saved successfully!");
  };

  onMounted(() => {
    const saved = localStorage.getItem("moodEntries");
    if (saved) moodEntries.value = JSON.parse(saved);
  });

  return {
    selectedMood,
    journalEntry,
    moodEntries,
    showStats,
    selectMood,
    saveMoodEntry,
  };
}
