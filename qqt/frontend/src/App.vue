<template>
  <div class="app-container">
    <header class="app-header">
      <div class="brand">
        <h4>全球通权益助手</h4>
      </div>
      <nav v-if="showTab" class="nav-tabs">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="nav-tab"
          :class="{ active: isActive(tab.path) }"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const currentPath = computed(() => route.path);

const tabs = [
  { path: "/wap", label: "移动版" },
  { path: "/desktop", label: "桌面版" },
];

function isActive(path: string) {
  return (
    currentPath.value === path ||
    (path === "/" && (currentPath.value === "" || currentPath.value === undefined))
  );
}
const showTab = computed(() => !currentPath.value.startsWith("/token"));
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f3f3, #faf4e2);
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.brand h4 {
  margin: 0;
  color: #5b3f12;
}


.nav-tabs {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(155, 119, 46, 0.15);
}

.nav-tab {
  font-size: 12px;
  padding: 5px 10px;
  text-decoration: none;
  color: #9b772e;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-tab.active {
  background: linear-gradient(90deg, #ffe6a0 0%, #f8c75f 100%);
  color: #704f00;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
