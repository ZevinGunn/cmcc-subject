import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 根路径重定向到默认页面（比如移动端首页）
    {
      path: "/",
      redirect: "/wap",
    },
    {
      path: "/token",
      name: "token",
      component: () => import("@/views/Token.vue"),
    },
    {
      path: "/wap",
      name: "wap",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/desktop",
      name: "desktop",
      component: () => import("@/views/DesktopView.vue"),
    },
    // 兜底：其他所有路径都跳转到首页（防止死循环）
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
