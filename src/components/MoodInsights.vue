<template>
  <div class="insights-card">
    <div class="insights-header">
      <h3 class="insights-title">Insights for You</h3>
    </div>

    <div class="insights-list">
      <div
        v-for="(insight, index) in insights"
        :key="index"
        class="insight-item"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="insight-content">
          <div class="insight-icon-wrapper">
            <component :is="insight.icon" class="insight-icon" />
          </div>
          <div class="insight-text">
            <h4 class="insight-title">{{ insight.title }}</h4>
            <p class="insight-description">{{ insight.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useJournal } from "../composables/useJournal";
import { LightbulbIcon, TrendingUpIcon } from "lucide-vue-next";
import { subDays, isAfter } from "date-fns";

const { entries } = useJournal();

const insights = computed(() => {
  const insightsList = [];
  const recentEntries = entries.value.slice(0, 7); // Last 7 entries
  const weekAgo = subDays(new Date(), 7);
  const thisWeekEntries = entries.value.filter((entry) =>
    isAfter(new Date(entry.timestamp), weekAgo)
  );

  // Most common mood this week
  const moodCounts = thisWeekEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = entries.value.length
    ? entries.value.reduce((a, b) => (moodCounts[a.mood] > moodCounts[b.mood] ? a : b)).mood
    : null;

  if (mostCommonMood) {
    const suggestions = {
      happy:
        "You've been feeling positive lately! Consider what's contributing to this happiness and how you can maintain it.",
      sad: "You've been experiencing some sadness. Remember that it's okay to feel this way. Consider reaching out to someone you trust.",
      anger:
        "You've been feeling frustrated recently. Try some deep breathing exercises or physical activity to help manage these feelings.",
      fear: "You've been feeling anxious lately. Consider practicing mindfulness or talking to someone about what's worrying you.",
      disgust:
        "You've been feeling uncomfortable about some things. Reflect on what's bothering you and how you might address it.",
    };

    insightsList.push({
      type: "pattern",
      title: `Your dominant mood this week: ${mostCommonMood}`,
      description:
        suggestions[mostCommonMood as keyof typeof suggestions] ||
        "Keep tracking your moods to better understand your patterns.",
      icon: TrendingUpIcon,
    });
  }

  // Streak insight
  const hasRecentEntries = thisWeekEntries.length >= 3;
  if (hasRecentEntries) {
    insightsList.push({
      type: "streak",
      title: "Great consistency!",
      description:
        "You've been regularly checking in with yourself. This self-awareness is a powerful tool for emotional wellness.",
      icon: TrendingUpIcon,
    });
  }

  // Time-based insight
  const morningEntries = entries.value.filter((entry) => {
    const hour = new Date(entry.timestamp).getHours();
    return hour >= 6 && hour < 12;
  });

  const eveningEntries = entries.value.filter((entry) => {
    const hour = new Date(entry.timestamp).getHours();
    return hour >= 18 && hour < 24;
  });

  if (morningEntries.length > eveningEntries.length && morningEntries.length > 2) {
    insightsList.push({
      type: "timing",
      title: "Morning reflector",
      description:
        "You tend to journal in the mornings. This is a great way to set intentions for your day!",
      icon: LightbulbIcon,
    });
  } else if (eveningEntries.length > morningEntries.length && eveningEntries.length > 2) {
    insightsList.push({
      type: "timing",
      title: "Evening reflector",
      description:
        "You prefer evening journaling. This is perfect for processing your day and winding down.",
      icon: LightbulbIcon,
    });
  }

  return insightsList.slice(0, 3); // Limit to 3 insights
});
</script>

<style lang="scss" scoped>
.insights-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.6s ease-out;

  .insights-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;

    .header-icon {
      padding: 0.5rem;
      background: rgba(var(--color-accent-rgb), 0.1);
      border-radius: 50%;

      .icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-accent);
      }
    }

    .insights-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-foreground);
    }
  }

  .insights-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .insight-item {
      background: rgba(var(--color-muted-rgb), 0.3);
      border-radius: 0.5rem;
      padding: 1rem;
      transition: background-color 0.2s ease;
      animation: slideInLeft 0.3s ease-out both;

      &:hover {
        background: rgba(var(--color-muted-rgb), 0.5);
      }

      .insight-content {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;

        .insight-icon-wrapper {
          padding: 0.5rem;
          background: rgba(var(--color-primary-rgb), 0.1);
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;

          .insight-icon {
            width: 1rem;
            height: 1rem;
            color: var(--color-primary);
          }
        }

        .insight-text {
          .insight-title {
            font-weight: 500;
            color: var(--color-foreground);
            margin-bottom: 0.25rem;
          }

          .insight-description {
            font-size: 0.875rem;
            color: var(--color-muted-foreground);
            line-height: 1.5;
          }
        }
      }
    }
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

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
