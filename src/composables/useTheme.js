// composables/useTheme.js
import { ref, onMounted, watch } from "vue";

const currentTheme = ref("light");

export function useTheme() {
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
    localStorage.setItem("theme", currentTheme.value);
  };

  onMounted(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      currentTheme.value = saved;
    }
    document.documentElement.setAttribute("data-theme", currentTheme.value);
  });

  watch(currentTheme, (val) => {
    document.documentElement.setAttribute("data-theme", val);
  });

  return {
    currentTheme,
    toggleTheme,
  };
}
