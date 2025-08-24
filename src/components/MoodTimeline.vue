<template>
  <div class="timeline-card">
    <h3 class="timeline-title">Mood Timeline</h3>

    <div v-if="entries.length === 0" class="empty-timeline">
      <div class="empty-icon-wrapper">
        <TrendingUpIcon class="empty-icon" />
      </div>
      <p class="empty-title">No entries to display</p>
      <p class="empty-subtitle">
        Your mood timeline will appear here as you create journal entries
      </p>
    </div>

    <div v-else class="timeline-container">
      <!-- Timeline Line -->
      <div class="timeline-line"></div>

      <div class="timeline-entries">
        <div v-for="(entry, index) in entries" :key="entry.id" class="timeline-entry">
          <!-- Timeline Dot -->
          <div class="timeline-dot" :class="`mood-${entry.mood}`">
            <component :is="getMoodIcon(entry.mood)" class="timeline-icon" />
          </div>

          <!-- Content -->
          <div class="timeline-content">
            <div class="entry-card">
              <div class="entry-header">
                <span class="entry-mood">{{ entry.mood }}</span>
                <span class="entry-separator">•</span>
                <span class="entry-date">{{ formatTimelineDate(entry.timestamp) }}</span>
                <span class="entry-separator">•</span>
                <span class="entry-time">{{ formatTime(entry.timestamp) }}</span>
              </div>
              <p class="entry-text">{{ entry.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJournal } from "../composables/useJournal";
import { SmileIcon, FrownIcon, AngryIcon, ZapIcon, XIcon, TrendingUpIcon } from "lucide-vue-next";
import { format, parseISO, isToday, isYesterday } from "date-fns";

const { entries } = useJournal();

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

const formatTimelineDate = (timestamp: string) => {
  const date = new Date(timestamp);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "MMM d, yyyy");
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return format(date, "h:mm a");
};
</script>

<style lang="scss" scoped>
.timeline-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  .timeline-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 1.5rem;
  }
}

.empty-timeline {
  text-align: center;
  padding: 3rem 0;

  .empty-icon-wrapper {
    width: 4rem;
    height: 4rem;
    background: var(--color-muted);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;

    .empty-icon {
      width: 2rem;
      height: 2rem;
      color: var(--color-muted-foreground);
    }
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

.timeline-container {
  position: relative;

  .timeline-line {
    position: absolute;
    left: 1.5rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
  }

  .timeline-entries {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .timeline-entry {
      position: relative;
      display: flex;
      gap: 1rem;

      .timeline-dot {
        position: relative;
        z-index: 10;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

        .timeline-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: white;
        }
      }

      .timeline-content {
        flex: 1;
        padding-bottom: 1.5rem;

        .entry-card {
          background: rgba(var(--color-muted-rgb), 0.3);
          border-radius: 0.5rem;
          padding: 1rem;
          transition: background-color 0.2s ease;

          &:hover {
            background: rgba(var(--color-muted-rgb), 0.5);
          }

          .entry-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;

            .entry-mood {
              font-weight: 500;
              color: var(--color-foreground);
              text-transform: capitalize;
            }

            .entry-separator {
              color: var(--color-muted-foreground);
            }

            .entry-date,
            .entry-time {
              font-size: 0.875rem;
              color: var(--color-muted-foreground);
            }
          }

          .entry-text {
            color: var(--color-foreground);
            line-height: 1.5;
          }
        }
      }
    }
  }
}
</style>
