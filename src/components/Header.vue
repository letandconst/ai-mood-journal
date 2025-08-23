<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title"><span class="emoji">🧠</span> MoodScape</h1>
      <div class="header-controls">
        <button @click="toggleTheme" class="theme-toggle">
          {{ currentTheme === "light" ? "🌙" : "☀️" }}
        </button>
        <button @click="$emit('toggleStats')" class="stats-toggle">📊 Stats</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from "../composables/useTheme";

const { currentTheme, toggleTheme } = useTheme();
</script>

<style lang="scss">
// Header
.app-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .emoji {
      font-size: 2rem;
    }
  }

  .header-controls {
    display: flex;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      background: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
      transition: var(--transition);
      font-size: 0.9rem;

      &:hover {
        background: var(--bg-tertiary);
        transform: translateY(-1px);
      }
    }
  }
}
</style>
