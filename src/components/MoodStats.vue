<template>
  <div class="mood-stats">
    <!-- Overview Cards -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-icon-wrapper primary">
            <CalendarIcon class="stat-icon" />
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ totalEntries }}</p>
            <p class="stat-label">Total Entries</p>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-icon-wrapper secondary">
            <TrendingUpIcon class="stat-icon" />
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ currentStreak }}</p>
            <p class="stat-label">Day Streak</p>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-icon-wrapper accent">
            <CalendarIcon class="stat-icon" />
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ recentEntries.length }}</p>
            <p class="stat-label">This Week</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mood Distribution -->
    <div class="distribution-card">
      <h3 class="distribution-title">Mood Distribution</h3>

      <div v-if="totalEntries === 0" class="no-data">
        <p class="no-data-title">No mood data yet</p>
        <p class="no-data-subtitle">Start journaling to see your mood patterns</p>
      </div>

      <div v-else class="mood-bars">
        <div
          v-for="[moodKey, config] in Object.entries(moodConfig)"
          :key="moodKey"
          class="mood-bar-item"
        >
          <div class="mood-bar-header">
            <div class="mood-info">
              <div class="mood-icon-wrapper" :class="config.bgClass">
                <component :is="config.icon" class="mood-icon" :class="config.colorClass" />
              </div>
              <span class="mood-name">{{ config.label }}</span>
            </div>
            <div class="mood-stats-text">
              <span class="mood-count">{{ getMoodCount(moodKey) }}</span>
              <span class="mood-percentage">({{ getMoodPercentage(moodKey) }}%)</span>
            </div>
          </div>
          <div class="mood-progress-bar">
            <div
              class="mood-progress-fill"
              :class="config.progressClass"
              :style="{ width: `${getMoodPercentage(moodKey)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Most Common Mood -->
    <div v-if="mostCommonMood" class="common-mood-card">
      <h3 class="common-mood-title">Most Common Mood</h3>
      <div class="common-mood-content">
        <div class="common-mood-icon-wrapper" :class="moodConfig[mostCommonMood].bgClass">
          <component
            :is="moodConfig[mostCommonMood].icon"
            class="common-mood-icon"
            :class="moodConfig[mostCommonMood].colorClass"
          />
        </div>
        <div class="common-mood-info">
          <p class="common-mood-label">{{ moodConfig[mostCommonMood].label }}</p>
          <p class="common-mood-stats">
            {{ getMoodCount(mostCommonMood) }} out of {{ totalEntries }} entries
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useJournal } from "../composables/useJournal";
import {
  SmileIcon,
  FrownIcon,
  AngryIcon,
  ZapIcon,
  XIcon,
  TrendingUpIcon,
  CalendarIcon,
} from "lucide-vue-next";
import { format, subDays, isAfter } from "date-fns";

const { entries, getMoodStats } = useJournal();
const moodStats = computed(() => getMoodStats().value);
const totalEntries = computed(() => entries.value.length);

const moodConfig = {
  happy: {
    icon: SmileIcon,
    colorClass: "mood-happy-text",
    bgClass: "mood-happy-bg",
    progressClass: "mood-happy-progress",
    label: "Happy",
  },
  sad: {
    icon: FrownIcon,
    colorClass: "mood-sad-text",
    bgClass: "mood-sad-bg",
    progressClass: "mood-sad-progress",
    label: "Sad",
  },
  anger: {
    icon: AngryIcon,
    colorClass: "mood-anger-text",
    bgClass: "mood-anger-bg",
    progressClass: "mood-anger-progress",
    label: "Angry",
  },
  fear: {
    icon: ZapIcon,
    colorClass: "mood-fear-text",
    bgClass: "mood-fear-bg",
    progressClass: "mood-fear-progress",
    label: "Fearful",
  },
  disgust: {
    icon: XIcon,
    colorClass: "mood-disgust-text",
    bgClass: "mood-disgust-bg",
    progressClass: "mood-disgust-progress",
    label: "Disgusted",
  },
};

// Calculate recent entries (last 7 days)
const recentEntries = computed(() => {
  const sevenDaysAgo = subDays(new Date(), 7);
  return entries.value.filter((entry) => isAfter(new Date(entry.timestamp), sevenDaysAgo));
});

// Calculate streak (consecutive days with entries)
const currentStreak = computed(() => {
  if (entries.value.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < 30; i++) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const hasEntry = entries.value.some((entry) => entry.date === dateStr);

    if (hasEntry) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
});

// Get most common mood
const mostCommonMood = computed<keyof typeof moodConfig | null>(() => {
  const stats = moodStats.value;
  const entries = Object.entries(stats);
  if (entries.length === 0) return null;

  return entries.reduce((a, b) =>
    stats[a[0]] > stats[b[0]] ? a : b
  )?.[0] as keyof typeof moodConfig;
});

const getMoodCount = (moodKey: string) => {
  return moodStats.value[moodKey] || 0;
};

const getMoodPercentage = (moodKey: string) => {
  const count = getMoodCount(moodKey);
  const percentage = totalEntries.value > 0 ? (count / totalEntries.value) * 100 : 0;
  return percentage.toFixed(1);
};
</script>

<style lang="scss" scoped>
.mood-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-card {
    background: rgba(var(--color-card-rgb), 0.5);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

    .stat-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .stat-icon-wrapper {
        padding: 0.75rem;
        border-radius: 50%;

        &.primary {
          background: rgba(var(--color-primary-rgb), 0.1);
        }

        &.secondary {
          background: rgba(var(--color-secondary-rgb), 0.1);
        }

        &.accent {
          background: rgba(var(--color-accent-rgb), 0.1);
        }

        .stat-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: var(--color-primary);
        }
      }

      .stat-info {
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-foreground);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-muted-foreground);
        }
      }
    }
  }
}

.distribution-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  .distribution-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 1.5rem;
  }

  .no-data {
    text-align: center;
    padding: 2rem 0;

    .no-data-title {
      color: var(--color-muted-foreground);
      margin-bottom: 0.25rem;
    }

    .no-data-subtitle {
      font-size: 0.875rem;
      color: var(--color-muted-foreground);
    }
  }

  .mood-bars {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .mood-bar-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .mood-bar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .mood-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .mood-icon-wrapper {
            padding: 0.5rem;
            border-radius: 50%;
            display: flex;

            .mood-icon {
              width: 1rem;
              height: 1rem;
            }
          }

          .mood-name {
            font-weight: 500;
            color: var(--color-foreground);
          }
        }

        .mood-stats-text {
          text-align: right;

          .mood-count {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-foreground);
          }

          .mood-percentage {
            font-size: 0.75rem;
            color: var(--color-muted-foreground);
            margin-left: 0.25rem;
          }
        }
      }

      .mood-progress-bar {
        width: 100%;
        background: var(--color-muted);
        border-radius: 9999px;
        height: 0.5rem;

        .mood-progress-fill {
          height: 0.5rem;
          border-radius: 9999px;
          transition: width 0.5s ease;
        }
      }
    }
  }
}

.common-mood-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  .common-mood-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 1rem;
  }

  .common-mood-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    .common-mood-icon-wrapper {
      padding: 1rem;
      border-radius: 50%;

      .common-mood-icon {
        width: 2rem;
        height: 2rem;
      }
    }

    .common-mood-info {
      .common-mood-label {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-foreground);
        text-transform: capitalize;
      }

      .common-mood-stats {
        font-size: 0.875rem;
        color: var(--color-muted-foreground);
      }
    }
  }
}

// Mood-specific styles
.mood-happy-text {
  color: rgb(245, 158, 11);
}
.mood-happy-bg {
  background: rgba(245, 158, 11, 0.1);
}
.mood-happy-progress {
  background: rgb(245, 158, 11);
}

.mood-sad-text {
  color: rgb(59, 130, 246);
}
.mood-sad-bg {
  background: rgba(59, 130, 246, 0.1);
}
.mood-sad-progress {
  background: rgb(59, 130, 246);
}

.mood-anger-text {
  color: rgb(239, 68, 68);
}
.mood-anger-bg {
  background: rgba(239, 68, 68, 0.1);
}
.mood-anger-progress {
  background: rgb(239, 68, 68);
}

.mood-fear-text {
  color: rgb(168, 85, 247);
}
.mood-fear-bg {
  background: rgba(168, 85, 247, 0.1);
}
.mood-fear-progress {
  background: rgb(168, 85, 247);
}

.mood-disgust-text {
  color: rgb(34, 197, 94);
}
.mood-disgust-bg {
  background: rgba(34, 197, 94, 0.1);
}
.mood-disgust-progress {
  background: rgb(34, 197, 94);
}
</style>
