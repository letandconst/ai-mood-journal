// composables/useToaster.ts
import { ref } from "vue";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
}

const toasts = ref<Toast[]>([]);

const addToast = (toast: Omit<Toast, "id">) => {
  const id = crypto.randomUUID();
  const newToast = { ...toast, id };
  toasts.value.push(newToast);

  setTimeout(() => removeToast(id), 5000);
  return id;
};

const removeToast = (id: string) => {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) toasts.value.splice(index, 1);
};

export function useToaster() {
  return { toasts, addToast, removeToast };
}
