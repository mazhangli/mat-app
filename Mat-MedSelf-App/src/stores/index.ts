import { createPinia } from 'pinia';
import type { App } from 'vue';

// 创建Pinia实例（2.1.x推荐显式创建）
const pinia = createPinia();

// 全局注册Pinia（适配Vue3）
export function setupPinia(app: App) {
  app.use(pinia);
}

export default pinia;