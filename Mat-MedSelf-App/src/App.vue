<template>
  <div id="app">
    <!-- 区分缓存/非缓存路由，添加过渡动画 -->
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
    </transition>

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
// 无需额外代码，路由由router/index.ts全局管理
</script>

<style scoped>
/* 路由过渡动画 */
.router-fade-enter-from,
.router-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: all 0.3s ease;
}
</style>
