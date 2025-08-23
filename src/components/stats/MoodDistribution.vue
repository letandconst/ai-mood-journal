<template>
  <div class="stat-card">
    <h3>Mood Distribution (Last 30 Days)</h3>
    <div class="mood-chart">
      <div
        v-for="(count, moodId) in moodDistribution"
        :key="moodId"
        class="mood-bar"
        :style="{
          height: `${(count / Math.max(...Object.values(moodDistribution))) * 100}%`,
          backgroundColor: getMoodColor(moodId),
        }"
      >
        <span class="mood-count">{{ count }}</span>
        <span class="mood-emoji">{{ getMoodById(moodId)?.character }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  moodEntries: Array,
  moods: Array,
});

const moodDistribution = computed(() => {
  const distribution = {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  props.moodEntries
    .filter((entry) => new Date(entry.date) >= thirtyDaysAgo)
    .forEach((entry) => {
      distribution[entry.moodId] = (distribution[entry.moodId] || 0) + 1;
    });

  return distribution;
});

const getMoodById = (id) => props.moods.find((m) => m.id === id);
const getMoodColor = (id) => getMoodById(id)?.color || "#ccc";
</script>
