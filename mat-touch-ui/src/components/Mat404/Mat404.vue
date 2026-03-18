<template>
  <div class="mat-404">
    <div class="content">
      <div class="icon">🩺</div>
      <div class="number">404</div>
      <div class="message">{{ message }}</div>
      <div class="tips">{{ tips }}</div>
      <div class="btn-group">
        <button class="btn home-btn" @click="handleHomeClick">
          {{ homeText }}
        </button>
        <button class="btn refresh-btn" @click="handleRefreshClick">
          {{ refreshText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    default: "页面未找到",
  },
  tips: {
    type: String,
    default: "请检查网络或返回首页",
  },
  homeText: {
    type: String,
    default: "返回首页",
  },
  refreshText: {
    type: String,
    default: "重新加载",
  },
});

// 定义事件：把按钮点击事件抛给主项目（解耦路由逻辑）
const emit = defineEmits(["home-click", "refresh-click"]);

const handleHomeClick = () => {
  emit("home-click");
};

const handleRefreshClick = () => {
  emit("refresh-click");
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", sans-serif;
}

.mat-404 {
  width: 100vw;
  height: 100vh;
  background: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
  padding: 40px 60px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 120, 212, 0.1);
}

.icon {
  font-size: 80px;
  color: #0078d7;
  margin-bottom: 10px;
}

.number {
  font-size: 120px;
  font-weight: bold;
  color: #1e3b5c;
  line-height: 1;
  margin-bottom: 20px;
}

.message {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.tips {
  font-size: 18px;
  color: #4e6b82;
  margin-bottom: 30px;
}

.btn-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.home-btn {
  background: #0078d7;
  color: white;
}

.refresh-btn {
  background: #eaeff4;
  color: #0078d7;
  border: 1px solid #cbd5e0;
}

.btn:active {
  transform: translateY(2px);
}

@media (max-width: 600px) {
  .number {
    font-size: 80px;
  }
  .message {
    font-size: 24px;
  }
  .btn {
    padding: 10px 20px;
    font-size: 16px;
  }
}
</style>
