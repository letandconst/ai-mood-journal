import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Journal from "@/views/Journal.vue";
import Insights from "@/views/Insights.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/journal", name: "Journal", component: Journal, props: true },
  { path: "/insights", name: "Insights", component: Insights },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
