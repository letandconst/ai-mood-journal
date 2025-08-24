<template>
  <div id="app">
    <router-view />
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { provide } from "vue";
import { useTheme } from "./composables/useTheme";
import Toaster from "./components/ui/Toaster.vue";

export type ThemeInjection = ReturnType<typeof useTheme>;

const theme = useTheme();
provide<ThemeInjection>("theme", theme);
</script>

<style lang="scss">
@use "./assets/styles/main" as *;
</style>
