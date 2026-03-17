// import type { Component, App } from "@vue/runtime-core";
// import TouchButton from "./TouchButton/Index.vue";
// import type { MatButtonProps } from "./TouchButton/Index.vue";

// export { TouchButton, type MatButtonProps };

// const components: Component[] = [TouchButton as unknown as Component];

// const install = (app: App): void => {
//   components.forEach((component) => {
//     const componentName = (component as any).name;
//     if (!componentName) {
//       console.warn("[MatTouchUI] 组件未定义 name 属性，无法全局注册：", component);
//       return;
//     }
//     app.component(componentName, component);
//   });
// };

// // 确保组件名与组件对应
// export default {
//   version: "0.1.0",
//   install,
//   MatButtonProps,
// };
