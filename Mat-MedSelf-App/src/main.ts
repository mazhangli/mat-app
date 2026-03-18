import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { setupPinia } from "./stores";
import MatTouchUI, { loadThemeConfig, applyThemeConfig, setRem } from "mat-touch-ui";
import "mat-touch-ui/dist/mat-touch-ui.css";
import repeatDirective from "./tools/repeatDirective";
import preventReClick from "./tools/preventReClick";
// 加载并应用父工程的自定义配置
async function initTheme() {
  // 加载 public 目录下的 theme.config.json
  const customConfig = await loadThemeConfig("/theme.config.json");
  console.log("Loaded custom theme config:", customConfig);
  // 应用配置（覆盖组件库默认主题）
  applyThemeConfig(customConfig);
}

// 初始化应用
async function initApp() {
  setRem(1920); //设置 Rem
  await initTheme();
  const app = createApp(App);
  setupPinia(app);
  app.use(router);
  app.use(MatTouchUI);
  app.directive("repeat-click", repeatDirective); //防止長時間觸摸
  app.directive("preventReClick", preventReClick); //防止連擊
  app.mount("#app");
}

initApp();
