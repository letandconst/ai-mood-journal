<template>
  <section class="stats-section">
    <h2>Your Emotional Journey</h2>

    <div class="stats-grid">
      <MoodDistribution :moodEntries="moodEntries" :moods="moods" />

      <RecentTrends :moodEntries="moodEntries" :moods="moods" />
    </div>

    <RecentEntries :moodEntries="moodEntries" :moods="moods" />
  </section>
</template>

<script setup>
import MoodDistribution from "./MoodDistribution.vue";
import RecentTrends from "./RecentTrends.vue";
import RecentEntries from "./RecentEntries.vue";

defineProps({
  moodEntries: Array,
  moods: Array,
});
</script>
