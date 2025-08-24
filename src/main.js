import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

// Import views
import HomePage from "./views/HomePage.vue";
import HistoryPage from "./views/HistoryPage.vue";
import SettingsPage from "./views/SettingsPage.vue";

// Router configuration
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/history",
      name: "History",
      component: HistoryPage,
    },
    {
      path: "/settings",
      name: "Settings",
      component: SettingsPage,
    },
  ],
});

createApp(App).use(router).mount("#app");
