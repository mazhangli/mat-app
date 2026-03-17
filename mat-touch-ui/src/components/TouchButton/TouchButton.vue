<template>
  <van-button class="mat-touch-button" :class="[`mat-touch-button--${clazz}`, `mat-touch-button--${computedSize}`, { 'mat-touch-button--disabled': disabled }, { 'mat-touch-button--press': isPress }]" :disabled="disabled" @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchcancel="handleTouchEnd" @click="handleClick" :style="{ touchAction: 'manipulation' }">
    <!-- 加载状态插槽 -->
    <slot name="loading" v-if="loading">
      <span class="mat-touch-button__loading">🔄</span>
    </slot>
    <!-- 默认插槽 -->
    <span class="mat-touch-button__content" v-if="!loading">
      <slot></slot>
    </span>
  </van-button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import type { MatTouchButtonProps, MatTouchButtonEmits, MatTouchButtonInstance } from "@/types/components/button";

// 1. Props 定义（Vue 3 专属 withDefaults 实现默认值 + 类型约束）
const props = withDefaults(defineProps<MatTouchButtonProps>(), {
  clazz: 'primary', // 按钮样式类型
  disabled: false,
  loading: false,
  longPressDuration: 500, // 长按触发时长（ms）
  preventRepeatClick: true, // 防重复点击
  clickInterval: 2000, // 重复点击间隔（ms）
});


// 2. 核心：响应式计算最终的 size（优先级：外部传 size > clazz 匹配 > 默认 middle）
const computedSize = computed(() => {
  // 定义 clazz -> size 的映射规则（可根据业务扩展）
  const clazzToSizeMap: Record<string, string> = {
    primary: 'normal',
    secondary: 'normal',
    danger: 'normal',
  };

  // 优先用外部传的 size，否则按 clazz 匹配，兜底 middle
  var size = props.size || clazzToSizeMap[props.clazz] || 'normal';
  console.log("Computed size:", size);
  return size;
});

// 2. Emits 定义（适配 Vue 3 defineEmits 泛型）
const emits = defineEmits<MatTouchButtonEmits>();

// 3. 响应式状态
const isPress = ref(false); // 触控按下状态
const lastClickTime = ref(0); // 上次点击时间（防重复点击）
type Timer = ReturnType<typeof setTimeout>;
let longPressTimer: Timer | null = null; // 长按定时器
// 4. 核心方法（暴露给组件实例）
const focus = (): void => {
  const el = document.querySelector<HTMLElement>('.mat-touch-button[aria-disabled="${props.disabled}"]');
  el?.focus({ preventScroll: true });
};

const blur = (): void => {
  const el = document.querySelector<HTMLElement>('.mat-touch-button[aria-disabled="${props.disabled}"]');
  el?.blur();
};

// 5. 触控事件处理
const handleTouchStart = (e: TouchEvent): void => {
  if (props.disabled || props.loading) return;
  isPress.value = true;
  // 长按定时器
  longPressTimer = setTimeout(() => {
    emits("long-press", e);
  }, props.longPressDuration);
};

const handleTouchEnd = (e: TouchEvent): void => {
  void e; // 显式标记使用参数，仅用于消除警告
  if (props.disabled || props.loading) return;
  isPress.value = false;
  // 清除长按定时器（未达到长按时长）
  if (longPressTimer) clearTimeout(longPressTimer);
};

const handleClick = (e: MouseEvent): void => {
  if (props.disabled || props.loading) return;
  // 防重复点击逻辑
  const now = Date.now();
  if (props.preventRepeatClick && now - lastClickTime.value < props.clickInterval) {
    return;
  }
  lastClickTime.value = now;
  emits("click", e);
};

// 6. 生命周期
onMounted(() => {
  // 初始化：禁用默认触控行为（如双击缩放）
  document.addEventListener(
    "touchmove",
    (e) => {
      if (isPress.value) e.preventDefault();
    },
    { passive: false },
  );
});

onUnmounted(() => {
  if (longPressTimer) clearTimeout(longPressTimer);
});

// 7. 暴露组件实例方法（供父组件 ref 调用）
defineExpose<MatTouchButtonInstance>({
  focus,
  blur,
});
// 声明组件名称（用于全局注册）
defineOptions({
  name: "MatTouchButton",
});
</script>

<style scoped>
/* .mat-touch-button {
    border: none;
    outline: none;
    border-radius: 8px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

.mat-touch-button--primary {
    background: #409eff;
    color: #fff;
}

.mat-touch-button--secondary {
    background: #e6f7ff;
    color: #409eff;
}

.mat-touch-button--danger {
    background: #f56c6c;
    color: #fff;
}

.mat-touch-button--small {
    height: 32px;
    font-size: 12px;
}

.mat-touch-button--middle {
    height: 40px;
    font-size: 14px;
}

.mat-touch-button--large {
    height: 48px;
    font-size: 16px;
}

.mat-touch-button--disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.mat-touch-button--press {
    transform: scale(0.98);
    opacity: 0.9;
}

.mat-touch-button__loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
}

.mat-touch-button__content {
    display: inline-block;
    line-height: 1;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
} */
</style>
