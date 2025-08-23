<template>
  <section class="journal-section">
    <h3>{{ selectedMood.prompt }}</h3>
    <textarea
      v-model="localEntry"
      class="journal-textarea"
      :placeholder="selectedMood.placeholder"
      rows="4"
    ></textarea>
    <div class="journal-actions">
      <button @click="$emit('save')" class="save-btn" :disabled="!localEntry.trim()">
        Save Entry
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  selectedMood: Object,
  journalEntry: String,
});
const emit = defineEmits(["save", "update:journalEntry"]);

const localEntry = ref(props.journalEntry);

watch(localEntry, (val) => {
  emit("update:journalEntry", val);
});
</script>
