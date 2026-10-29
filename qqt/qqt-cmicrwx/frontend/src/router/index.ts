import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Home.vue";
import TokenView from "@/views/Token.vue";
import DesktopView from "@/views/DesktopView.vue";
import PremiumView from "@/views/Premium.vue";
import NewHomeView from "@/views/NewHome.vue";

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
      component: TokenView,
    },
    {
      path: "/wap",
      name: "wap",
      component: HomeView,
    },
    {
      path: "/desktop",
      name: "desktop",
      component: DesktopView,
    },
    {
      path: "/premium",
      name: "premium",
      component: PremiumView,
    },
    {
      path: "/new-home",
      name: "newHome",
      component: NewHomeView,
    },
    // 兜底：其他所有路径都跳转到首页（防止死循环）
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
