<template>
  <div class="stat-card">
    <h3>Recent Trends</h3>
    <div class="trend-line">
      <div
        v-for="(entry, index) in recentEntries"
        :key="index"
        class="trend-point"
        :style="{ backgroundColor: getMoodColor(entry.moodId) }"
        :title="`${entry.date}: ${getMoodById(entry.moodId)?.name}`"
      ></div>
    </div>
    <div class="trend-insights">
      <p><strong>Streak:</strong> {{ currentStreak }} days</p>
      <p>
        <strong>Most Common:</strong>
        {{ mostCommonMood?.character }} {{ mostCommonMood?.name }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  moodEntries: Array,
  moods: Array,
});

const recentEntries = computed(() =>
  [...props.moodEntries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 14)
);

const currentStreak = computed(() => {
  if (props.moodEntries.length === 0) return 0;

  const sortedEntries = [...props.moodEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (entryDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
});

const moodDistribution = computed(() => {
  const distribution = {};
  props.moodEntries.forEach((entry) => {
    distribution[entry.moodId] = (distribution[entry.moodId] || 0) + 1;
  });
  return distribution;
});

const mostCommonMood = computed(() => {
  if (Object.keys(moodDistribution.value).length === 0) return null;

  const mostCommonId = Object.keys(moodDistribution.value).reduce((a, b) =>
    moodDistribution.value[a] > moodDistribution.value[b] ? a : b
  );

  return getMoodById(mostCommonId);
});

const getMoodById = (id) => props.moods.find((m) => m.id === id);
const getMoodColor = (id) => getMoodById(id)?.color || "#ccc";
</script>
