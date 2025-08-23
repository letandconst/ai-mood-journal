<template>
  <section class="mood-selector">
    <h2>How are you feeling today?</h2>
    <div class="mood-grid">
      <div
        v-for="mood in moods"
        :key="mood.id"
        class="mood-card"
        :class="{ active: selectedMood?.id === mood.id }"
        @click="$emit('select', mood)"
      >
        <div class="mood-character">{{ mood.character }}</div>
        <div class="mood-name">{{ mood.name }}</div>
        <div class="mood-description">{{ mood.description }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  moods: Array,
  selectedMood: Object,
});
defineEmits(["select"]);
</script>
