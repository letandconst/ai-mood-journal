<template>
  <div class="recent-entries-card">
    <h3 class="card-title">Recent Entries</h3>

    <!-- Loading State -->
    <div v-if="isLoading" class="entries-list">
      <div v-for="i in 3" :key="i" class="entry-skeleton">
        <div class="skeleton-dot"></div>
        <div class="skeleton-content">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line long"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="recentEntries.length === 0" class="empty-state">
      <CalendarIcon class="empty-icon" />
      <p class="empty-title">No entries yet</p>
      <p class="empty-subtitle">
        Start by selecting a mood above to create your first journal entry
      </p>
    </div>

    <!-- Entries List -->
    <div v-else class="entries-list">
      <div v-for="entry in recentEntries" :key="entry.id" class="entry-item">
        <div class="mood-indicator" :class="`mood-${entry.mood}`"></div>
        <div class="entry-content">
          <div class="entry-meta">
            <component :is="getMoodIcon(entry.mood)" class="mood-icon" />
            <p class="entry-timestamp">{{ entry.mood }} • {{ formatTimeAgo(entry.timestamp) }}</p>
          </div>
          <p class="entry-text">{{ entry.text }}</p>
        </div>
      </div>
    </div>

    <button class="view-all-button" @click="$router.push('/history')">View All Entries</button>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, SmileIcon, FrownIcon, AngryIcon, ZapIcon, XIcon } from "lucide-vue-next";
import { useJournal } from "../composables/useJournal";
import { formatDistanceToNow } from "date-fns";
import { computed } from "vue";

const { getRecentEntries, isLoading } = useJournal();
const recentEntries = getRecentEntries(5);

const moodIcons = {
  happy: SmileIcon,
  sad: FrownIcon,
  anger: AngryIcon,
  fear: ZapIcon,
  disgust: XIcon,
};

const getMoodIcon = (mood: string) => {
  return moodIcons[mood as keyof typeof moodIcons] || SmileIcon;
};

const formatTimeAgo = (timestamp: string | Date) => {
  if (!timestamp) return "Invalid date";

  const date = typeof timestamp === "string" ? new Date(timestamp.trim()) : timestamp;

  if (isNaN(date.getTime())) return "Invalid date";

  return formatDistanceToNow(date, { addSuffix: true });
};
</script>

<style lang="scss" scoped>
.recent-entries-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.6s ease-out;

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 1rem;
  }
}
.entries-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.entry-skeleton {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(var(--color-muted-rgb), 0.3);

  .skeleton-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: var(--color-muted);
    animation: pulse 2s infinite;
  }

  .skeleton-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .skeleton-line {
      height: 0.75rem;
      background: var(--color-muted);
      border-radius: 0.25rem;
      animation: pulse 2s infinite;

      &.short {
        width: 4rem;
      }

      &.long {
        width: 75%;
      }
    }
  }
}
.empty-state {
  text-align: center;
  padding: 2rem 0;

  .empty-icon {
    width: 3rem;
    height: 3rem;
    color: var(--color-muted-foreground);
    opacity: 0.5;
    margin: 0 auto 1rem;
  }

  .empty-title {
    color: var(--color-muted-foreground);
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .empty-subtitle {
    font-size: 0.875rem;
    color: var(--color-muted-foreground);
  }
}
.entry-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(var(--color-muted-rgb), 0.3);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(var(--color-muted-rgb), 0.5);

    .entry-text {
      display: -webkit-box;
      -webkit-line-clamp: unset;
    }
  }

  .mood-indicator {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    margin-top: 0.5rem;
    flex-shrink: 0;

    &.mood-happy {
      background: rgb(251, 191, 36);
    }
    &.mood-sad {
      background: rgb(96, 165, 250);
    }
    &.mood-anger {
      background: rgb(248, 113, 113);
    }
    &.mood-fear {
      background: rgb(196, 181, 253);
    }
    &.mood-disgust {
      background: rgb(134, 239, 172);
    }
  }

  .entry-content {
    flex: 1;
    min-width: 0;

    .entry-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;

      .mood-icon {
        width: 1rem;
        height: 1rem;
        color: var(--color-muted-foreground);
      }

      .entry-timestamp {
        font-size: 0.75rem;
        color: var(--color-muted-foreground);
        text-transform: capitalize;
      }
    }

    .entry-text {
      color: var(--color-foreground);
      font-size: 0.875rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: all 0.2s ease;
    }
  }
}
.view-all-button {
  width: 100%;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-foreground);
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background: var(--color-accent);
    border-color: var(--color-primary);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
