<template>
  <div class="settings-card">
    <div class="card-header">
      <div class="header-icon">
        <DatabaseIcon class="icon" />
      </div>
      <h2 class="card-title">Data Management</h2>
    </div>

    <div class="data-actions">
      <button class="data-button export" @click="handleExport">
        <DownloadIcon class="button-icon" />
        Export Data
      </button>

      <button class="data-button import" @click="triggerImport">
        <UploadIcon class="button-icon" />
        Import Data
      </button>

      <button class="data-button danger" @click="showClearConfirm = true">
        <TrashIcon class="button-icon" />
        Clear All Data
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleImport"
    />

    <!-- Clear Confirmation Dialog -->
    <div v-if="showClearConfirm" class="confirm-overlay">
      <div class="confirm-dialog">
        <h3 class="confirm-title">Clear All Data?</h3>
        <p class="confirm-message">
          This will permanently delete all your journal entries. This action cannot be undone.
        </p>
        <div class="confirm-actions">
          <button class="confirm-cancel" @click="showClearConfirm = false">Cancel</button>
          <button class="confirm-delete" @click="handleClearData">Delete All</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DatabaseIcon, DownloadIcon, UploadIcon, TrashIcon } from "lucide-vue-next";
import { useJournal } from "../composables/useJournal";

const { exportEntries, importEntries, clearAllEntries } = useJournal();
const fileInput = ref<HTMLInputElement | null>(null);
const showClearConfirm = ref(false);

const handleExport = () => {
  try {
    const data = exportEntries();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mood-journal-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

const triggerImport = () => {
  fileInput.value?.click();
};

const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = e.target?.result as string;
      const success = importEntries(data);
      if (success) {
        console.log("Import successful");
      } else {
        console.error("Import failed: Invalid data format");
      }
    } catch (error) {
      console.error("Import failed:", error);
    }
  };
  reader.readAsText(file);
};

const handleClearData = () => {
  clearAllEntries();
  showClearConfirm.value = false;
};
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

  .data-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .data-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      border: 1px solid var(--color-border);
      background: transparent;
      color: var(--color-foreground);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;

      &:hover {
        background: var(--color-accent);
      }

      &.danger {
        border-color: var(--color-destructive);
        color: var(--color-destructive);

        &:hover {
          background: rgba(var(--color-destructive-rgb), 0.1);
        }
      }

      .button-icon {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;

  .confirm-dialog {
    background: var(--color-card);
    border-radius: 0.75rem;
    padding: 1.5rem;
    max-width: 24rem;
    width: 100%;

    .confirm-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-foreground);
      margin-bottom: 0.5rem;
    }

    .confirm-message {
      color: var(--color-muted-foreground);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .confirm-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;

      .confirm-cancel {
        background: none;
        border: 1px solid var(--color-border);
        color: var(--color-foreground);
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--color-accent);
        }
      }

      .confirm-delete {
        background: var(--color-destructive);
        color: var(--color-destructive-foreground);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--color-destructive);
          transform: translateY(-1px);
        }
      }
    }
  }
}
</style>
