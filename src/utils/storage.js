const STORAGE_KEY = "mood-journal";

export function saveEntry(entry) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
