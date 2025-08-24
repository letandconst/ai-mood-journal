export interface JournalEntry {
  id: string;
  mood: string;
  text: string;
  timestamp: string;
  date: string;
}

const STORAGE_KEY = "mood-journal-entries";

const now = new Date();

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based
const day = String(now.getDate()).padStart(2, "0");

export const saveEntry = (mood: string, text: string): JournalEntry => {
  const now = new Date();
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    mood,
    text,
    timestamp: now.toLocaleString(),
    date: `${year}-${month}-${day}`,
  };

  const entries = getAllEntries();
  entries.unshift(entry);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entry;
};

export const getAllEntries = (): JournalEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading journal entries:", error);
    return [];
  }
};

export const getRecentEntries = (limit = 5): JournalEntry[] => {
  return getAllEntries().slice(0, limit);
};

export const getEntriesByDate = (date: string): JournalEntry[] => {
  return getAllEntries().filter((entry) => entry.date === date);
};

export const deleteEntry = (id: string): void => {
  const entries = getAllEntries().filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const updateEntry = (
  id: string,
  updates: Partial<Pick<JournalEntry, "text" | "mood">>
): JournalEntry | null => {
  const entries = getAllEntries();
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1) return null;

  entries[index] = { ...entries[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries[index];
};

export const getEntryCount = (): number => {
  return getAllEntries().length;
};

export const getMoodStats = (): Record<string, number> => {
  const entries = getAllEntries();
  const stats: Record<string, number> = {};

  entries.forEach((entry) => {
    stats[entry.mood] = (stats[entry.mood] || 0) + 1;
  });

  return stats;
};

export const exportEntries = (): string => {
  const entries = getAllEntries();
  return JSON.stringify(entries, null, 2);
};

export const importEntries = (jsonData: string): boolean => {
  try {
    const entries = JSON.parse(jsonData);
    if (Array.isArray(entries)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error importing entries:", error);
    return false;
  }
};

export const clearAllEntries = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
