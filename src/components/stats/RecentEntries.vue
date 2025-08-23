<template>
  <div class="recent-entries">
    <h3>Recent Journal Entries</h3>
    <div class="entries-list">
      <div v-for="entry in recentEntries.slice(0, 5)" :key="entry.id" class="entry-card">
        <div class="entry-header">
          <span class="entry-mood">{{ getMoodById(entry.moodId)?.character }}</span>
          <span class="entry-date">{{ formatDate(entry.date) }}</span>
        </div>
        <p class="entry-text">{{ entry.journal }}</p>
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

const recentEntries = computed(() =>
  [...props.moodEntries].sort((a, b) => new Date(b.date) - new Date(a.date))
);

const getMoodById = (id) => props.moods.find((m) => m.id === id);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};
</script>
