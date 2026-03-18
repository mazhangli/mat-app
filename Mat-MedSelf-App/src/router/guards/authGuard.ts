import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

// 登录守卫：未登录用户跳转到登录页
export const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 从本地存储获取登录状态（实际项目可结合Pinia/Vuex）
  const isLogin = localStorage.getItem("token") !== null;

  // 需要登录但未登录 → 跳登录页
  if (to.meta.requiresAuth && !isLogin) {
    next({ path: "/login", query: { redirect: to.fullPath } }); // 记录跳转前路径，登录后返回
  } else {
    next(); // 正常放行
  }
};
