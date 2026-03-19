<template>
  <!-- 直接使用子项目的Mat404组件，自定义文案+绑定事件 -->
  <Mat404
    message="页面未找到"
    tips="请检查网络或联系工作人员处理"
    home-text="返回首页"
    refresh-text="重新加载"
    @home-click="goToHome"
    @refresh-click="refreshPage"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

// 获取路由实例
const router = useRouter();

// 绑定“返回首页”事件（主项目控制路由逻辑）
const goToHome = () => {
  router.push('/home'); // 主项目首页路由，根据实际修改
};

// 绑定“重新加载”事件
const refreshPage = () => {
  window.location.reload();
};
</script>