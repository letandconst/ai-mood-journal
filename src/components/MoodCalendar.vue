<template>
  <div class="mood-calendar">
    <!-- Calendar Header -->
    <div class="calendar-card">
      <div class="calendar-header">
        <h2 class="calendar-title">{{ formatMonth(currentDate) }}</h2>
        <div class="navigation-buttons">
          <button class="nav-button" @click="previousMonth">
            <ChevronLeftIcon class="nav-icon" />
          </button>
          <button class="nav-button" @click="nextMonth">
            <ChevronRightIcon class="nav-icon" />
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <!-- Day Headers -->
        <div v-for="day in dayHeaders" :key="day" class="day-header">
          {{ day }}
        </div>

        <!-- Calendar Days -->
        <button
          v-for="day in calendarDays"
          :key="day.toISOString()"
          class="calendar-day"
          :class="{
            'has-entries': hasEntriesForDate(day),
            selected: selectedDate && isSameDay(day, selectedDate),
            today: isSameDay(day, today),
          }"
          @click="selectDate(day)"
        >
          <div class="day-content">
            <div
              v-if="getDominantMoodForDate(day)"
              class="mood-background"
              :class="`mood-${getDominantMoodForDate(day)}`"
            ></div>
            <span class="day-number">{{ format(day, "d") }}</span>
            <div v-if="hasEntriesForDate(day)" class="entry-indicator"></div>
          </div>
        </button>
      </div>
    </div>

    <!-- Selected Date Details -->
    <div v-if="selectedDate" class="selected-date-card">
      <h3 class="selected-date-title">{{ formatSelectedDate(selectedDate) }}</h3>

      <div v-if="selectedDateEntries.length > 0" class="entries-list">
        <div v-for="entry in selectedDateEntries" :key="entry.id" class="entry-item">
          <div class="entry-header">
            <div class="mood-indicator" :class="`mood-${entry.mood}`"></div>
            <span class="mood-label">{{ entry.mood }}</span>
            <span class="entry-time">{{ formatTime(entry.timestamp) }}</span>
          </div>
          <p class="entry-text">{{ entry.text }}</p>
        </div>
      </div>

      <div v-else class="no-entries">
        <p class="no-entries-title">No entries for this date</p>
        <p class="no-entries-subtitle">Tap a mood on the main page to start journaling</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";
import { useJournal } from "../composables/useJournal";
import { useCalendar } from "../composables/useCalendar";
import { format, isSameDay } from "date-fns";

const { entries } = useJournal();
const currentDate = ref(new Date());
const today = new Date();
const calendarDays = computed(() => useCalendar(currentDate.value, 0));

const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const selectedDate = ref<Date | null>(null);

const selectedDateEntries = computed(() => {
  if (!selectedDate.value) return [];
  return getEntriesForDate(selectedDate.value);
});

const getEntriesForDate = (date: Date) => {
  const dateStr = format(date, "yyyy-MM-dd");
  return entries.value.filter((entry) => entry.date === dateStr);
};

const hasEntriesForDate = (date: Date) => {
  return getEntriesForDate(date).length > 0;
};

const getDominantMoodForDate = (date: Date) => {
  const dayEntries = getEntriesForDate(date);
  if (dayEntries.length === 0) return null;
  return dayEntries[0].mood;
};

const formatMonth = (date: Date) => {
  return format(date, "MMMM yyyy");
};

const formatSelectedDate = (date: Date) => {
  return format(date, "EEEE, MMMM d, yyyy");
};

const formatTime = (timestamp: string) => {
  return format(new Date(timestamp), "h:mm a");
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const selectDate = (date: Date) => {
  selectedDate.value = date;
};
</script>

<style lang="scss" scoped>
.mood-calendar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.calendar-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;

    .calendar-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-foreground);
    }

    .navigation-buttons {
      display: flex;
      gap: 0.5rem;

      .nav-button {
        background: transparent;
        border: 1px solid var(--color-border);
        padding: 0.5rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--color-accent);
        }

        .nav-icon {
          width: 1rem;
          height: 1rem;
          color: var(--color-foreground);
        }
      }
    }
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;

    .day-header {
      padding: 0.5rem;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-muted-foreground);
    }

    .calendar-day {
      height: 3rem;
      padding: 0.25rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;

      &:hover {
        transform: scale(1.05);
      }

      &.has-entries:hover {
        transform: scale(1.05);
      }

      &.selected {
        box-shadow: 0 0 0 2px var(--color-primary);
      }

      &.today {
        box-shadow: 0 0 0 1px rgba(var(--color-primary-rgb), 0.5);
      }

      .day-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: 0.5rem;

        .mood-background {
          position: absolute;
          inset: 0;
          border-radius: 0.5rem;
          opacity: 0.8;

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

        .day-number {
          font-size: 0.875rem;
          font-weight: 500;
          position: relative;
          z-index: 10;
          color: var(--color-foreground);

          .mood-background + & {
            color: white;
          }
        }

        .entry-indicator {
          position: absolute;
          bottom: 0.25rem;
          right: 0.25rem;
          width: 0.5rem;
          height: 0.5rem;
          background: white;
          border-radius: 50%;
          opacity: 0.8;
        }
      }
    }
  }
}

.selected-date-card {
  background: rgba(var(--color-card-rgb), 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.3s ease-out;

  .selected-date-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin-bottom: 1rem;
  }

  .entries-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .entry-item {
      background: rgba(var(--color-muted-rgb), 0.3);
      border-radius: 0.5rem;
      padding: 1rem;

      .entry-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;

        .mood-indicator {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;

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

        .mood-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-foreground);
          text-transform: capitalize;
        }

        .entry-time {
          font-size: 0.75rem;
          color: var(--color-muted-foreground);
        }
      }

      .entry-text {
        font-size: 0.875rem;
        color: var(--color-foreground);
        line-height: 1.5;
      }
    }
  }

  .no-entries {
    text-align: center;
    padding: 2rem 0;

    .no-entries-title {
      color: var(--color-muted-foreground);
      margin-bottom: 0.25rem;
    }

    .no-entries-subtitle {
      font-size: 0.875rem;
      color: var(--color-muted-foreground);
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
</style>
