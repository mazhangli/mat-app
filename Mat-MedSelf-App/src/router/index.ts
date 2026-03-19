import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { authGuard } from './guards/authGuard';
import { keepAliveGuard } from './guards/keepAliveGuard';

// 导入业务模块路由
// import authRoutes from './modules/auth';
// import homeRoutes from './modules/home';
// import consultationRoutes from './modules/consultation';
// import profileRoutes from './modules/profile';

// 全局公共路由（无需权限）
const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home', // 默认跳首页
  },
  {
    path: '/NotFound',
    name: 'NotFound',
    component: () => import("@/views/PageNotFound.vue"),
    meta: { title: '页面不存在' },
  },
  {
    path: '/:pathMatch(.*)*', // 兜底路由
    redirect: '/NotFound',
  },
];

// 合并所有路由
const routes: RouteRecordRaw[] = [
  ...publicRoutes,
//   ...authRoutes,
//   ...homeRoutes,
//   ...consultationRoutes,
//   ...profileRoutes,
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }), // 路由切换回到顶部
});

// 注册路由守卫
router.beforeEach(authGuard); // 登录权限守卫
router.beforeEach(keepAliveGuard); // 缓存控制守卫

export default router;