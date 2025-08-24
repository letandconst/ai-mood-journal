import { ref, computed, watch } from "vue";

const theme = ref<"light" | "dark">("light");

const initTheme = () => {
  const stored = localStorage.getItem("mood-journal-theme");
  if (stored && (stored === "light" || stored === "dark")) {
    theme.value = stored;
  } else {
    theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  updateDocumentClass();
};

const updateDocumentClass = () => {
  document.documentElement.className = theme.value;
};

const toggle = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};

const setTheme = (newTheme: "light" | "dark") => {
  theme.value = newTheme;
};

watch(theme, (newTheme) => {
  localStorage.setItem("mood-journal-theme", newTheme);
  updateDocumentClass();
});

const isDark = computed(() => theme.value === "dark");
const isLight = computed(() => theme.value === "light");

if (typeof window !== "undefined") {
  initTheme();
}

export function useTheme() {
  return {
    theme,
    isDark,
    isLight,
    toggle,
    setTheme,
  };
}
