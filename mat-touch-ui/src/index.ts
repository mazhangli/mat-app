// src/index.ts
import type { App } from "@vue/runtime-core";
import { setRem } from "./utils/rem"; // 引入 rem 配置
import * as VantComponents from "./components/Vant";
import * as ElementComponents from "./components/Element";
// 导入主题配置相关
import { loadThemeConfig, applyThemeConfig } from "./utils/theme";

// // 初始化 rem 适配
// setRem(1920);
// 导入字体样式
import "@/styles/fonts.scss";
import "@/styles/index.scss";
// 导入组件
import MatTouchButton from "./components/TouchButton/TouchButton.vue";
import MatTouchSwiper from "./components/TouchSwiper/TouchSwiper.vue";
import Mat404 from "./components/Mat404/Mat404.vue";

// 所有组件列表
const components = {
  MatTouchButton,
  MatTouchSwiper,
  Mat404,
  ...VantComponents,
  ...ElementComponents,
};
// 安装函数
// 安装函数
const install = (app: App) => {
  // 遍历注册所有组件（用键名作为组件名）
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
};
const MatTouchUI = {
  install,
  MatTouchButton,
  MatTouchSwiper,
  Mat404,
  loadThemeConfig,
  applyThemeConfig,
  setRem,
};
export default MatTouchUI;
// 单独导出工具函数
export { MatTouchButton, MatTouchSwiper, Mat404, loadThemeConfig, applyThemeConfig, setRem };

export * from "./types";
