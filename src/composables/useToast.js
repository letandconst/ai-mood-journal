import { ref } from "vue";

const toasts = ref([]);

export function useToast() {
  const showToast = (message, duration = 3000) => {
    const id = Date.now();
    toasts.value.push({ id, message });

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, duration);
  };

  return { toasts, showToast };
}
