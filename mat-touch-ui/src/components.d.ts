// // components.d.ts（项目根目录）
// declare module "mat-touch-ui" {
//   import type { DefineComponent, ComponentPublicInstance } from "vue";

//   // 1. 导入组件库内部类型（确保路径与实际项目一致）
//   import type { ButtonProps, ButtonEmits, ButtonInstance } from "./src/types/components/button";

//   import type { TableProps, TableEmits, TableInstance } from "./src/types/components/table";

//   import type { MatTouchButtonProps, MatTouchButtonEmits, MatTouchButtonInstance } from "./src/types/components/MatTouchButton";

//   export const MatTouchButton: DefineComponent<MatTouchButtonProps, {}, {}, {}, {}, {}, {}, MatTouchButtonEmits, string, ComponentPublicInstance & MatTouchButtonInstance>;

//   // 3. 保留组件库安装方法（可选，若支持全局注册）
//   import type { App } from "vue";
//   export function install(app: App): void;

//   // 4. 导出所有类型（供用户导入类型使用）
//   export * from "./src/types";

//   // 5. 导出单独的组件类型（可选，简化用户导入）
//   export type { ButtonProps, ButtonEmits, TableProps, TableEmits, MatTouchButtonProps };
// }
