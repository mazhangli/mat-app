// src/stores/network.ts
import { defineStore } from "pinia";

export const useNetworkStore = defineStore("network", {
  state: () => ({
    isOnline: navigator.onLine, // 初始网络状态
    isReconnecting: false, // 是否正在重连
  }),
  actions: {
    // 监听网络状态变化
    initNetworkListener() {
      // 断网时触发
      window.addEventListener("offline", () => {
        this.isOnline = false;
        this.isReconnecting = false;
        // 可添加全局提示（如Toast）
        console.warn("网络已断开，请检查网络连接");
      });
      // 联网时触发
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.isReconnecting = true;
        // 联网后可自动刷新关键数据
        this.retryFailedRequests();
      });
    },
    // 重连后重试失败的请求（可选）
    retryFailedRequests() {
      // 可结合axios拦截器记录失败的请求，此处简化
      this.isReconnecting = false;
    },
  },
});
