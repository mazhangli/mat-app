import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

// 缓存控制：配合meta.keepAlive，统一管理页面缓存逻辑
export const keepAliveGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 可扩展：比如某些页面跳转时强制清除缓存
  if (from.meta.keepAlive && to.name === "Home") {
    from.meta.keepAlive = false; // 回到首页时清除其他页面缓存
  }
  next();
};
