// Vue 3 触控按钮 Props 类型（适配 <script setup> 类型推导）
export interface MatTouchButtonProps {
  /** 按钮类型 */
  clazz?: "primary" | "secondary" | "success"| "warning"| "danger"| "text"| "custom";
  /** 按钮尺寸（复用通用 SizeType） */
  size?: import("../utils").SizeType;
  /** 是否禁用 */
  disabled?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 长按触发时长（ms） */
  longPressDuration?: number;
  /** 是否防重复点击 */
  preventRepeatClick?: boolean;
  /** 重复点击间隔（ms） */
  clickInterval?: number;
}

// Vue 3 触控按钮 Emits 类型（适配 defineEmits 泛型）
export interface MatTouchButtonEmits {
  /** 点击事件 */
  (e: "click", value: MouseEvent): void;
  /** 长按事件 */
  (e: "long-press", value: TouchEvent): void;
  /** 触控开始事件 */
  (e: "touch-start", value: TouchEvent): void;
  /** 触控结束事件 */
  (e: "touch-end", value: TouchEvent): void;
}

// Vue 3 组件实例类型（供 ref 获取实例调用方法）
export interface MatTouchButtonInstance {
  /** 聚焦方法 */
  focus: () => void;
  /** 失焦方法 */
  blur: () => void;
}
