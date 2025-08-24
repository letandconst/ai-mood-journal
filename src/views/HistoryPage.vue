<template>
  <div class="history-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <button class="back-button" @click="$router.back()">
          <ArrowLeftIcon class="back-icon" />
        </button>
        <div class="header-text">
          <h1 class="page-title">Mood History</h1>
          <p class="page-subtitle">Track your emotional wellness journey</p>
        </div>
      </div>
    </header>

    <!-- View Mode Selector -->
    <div class="view-selector-container">
      <div class="view-selector-wrapper">
        <div class="view-selector">
          <button
            class="view-button"
            :class="{ active: viewMode === 'calendar' }"
            @click="viewMode = 'calendar'"
          >
            <CalendarIcon class="view-icon" />
            Calendar
          </button>
          <button
            class="view-button"
            :class="{ active: viewMode === 'stats' }"
            @click="viewMode = 'stats'"
          >
            <BarChartIcon class="view-icon" />
            Statistics
          </button>
          <button
            class="view-button"
            :class="{ active: viewMode === 'timeline' }"
            @click="viewMode = 'timeline'"
          >
            <TrendingUpIcon class="view-icon" />
            Timeline
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <MoodCalendar v-if="viewMode === 'calendar'" />
        <MoodStats v-if="viewMode === 'stats'" />
        <MoodTimeline v-if="viewMode === 'timeline'" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeftIcon, CalendarIcon, BarChartIcon, TrendingUpIcon } from "lucide-vue-next";
import MoodCalendar from "../components/MoodCalendar.vue";
import MoodStats from "../components/MoodStats.vue";
import MoodTimeline from "../components/MoodTimeline.vue";

const router = useRouter();
const viewMode = ref<string>("calendar");

type ViewMode = "calendar" | "stats" | "timeline";
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-card) 50%,
    var(--color-muted) 100%
  );
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .back-button {
      background: transparent;
      border: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: rgba(var(--color-accent-rgb), 0.1);
      }

      .back-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-foreground);
      }
    }

    .header-text {
      .page-title {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--color-foreground);
      }

      .page-subtitle {
        font-size: 0.875rem;
        color: var(--color-muted-foreground);
      }
    }
  }
}

.view-selector-container {
  padding: 0 1.5rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem 1.5rem;
  }

  .view-selector-wrapper {
    max-width: 64rem;
    margin: 0 auto;

    .view-selector {
      background: rgba(var(--color-card-rgb), 0.5);
      backdrop-filter: blur(8px);
      border-radius: 0.75rem;
      padding: 0.5rem;
      display: flex;
      gap: 0.25rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

      .view-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
        background: transparent;
        color: var(--color-foreground);

        &:hover {
          background: rgba(var(--color-accent-rgb), 0.1);
        }

        &.active {
          background: var(--color-primary);
          color: var(--color-primary-foreground);
          box-shadow: 0 2px 4px rgba(var(--color-primary-rgb), 0.3);
        }

        .view-icon {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
}

.main-content {
  padding: 0 1.5rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem 1.5rem;
  }

  .content-wrapper {
    max-width: 64rem;
    margin: 0 auto;
  }
}
</style>
