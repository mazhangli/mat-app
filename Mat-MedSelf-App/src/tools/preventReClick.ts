import type { Directive, DirectiveBinding } from 'vue';

// 存储元素与事件处理函数的映射，避免内存泄漏
const clickHandlerMap = new WeakMap<HTMLButtonElement, () => void>();

/**
 * 防重复点击指令（优化版）
 * @usage v-preventReClick="2000" // 固定2000ms防抖
 * @usage v-preventReClick="async () => { await api.submit(); }" // 异步操作完成后恢复
 */
const preventReClick: Directive = {
  beforeMount(el: HTMLButtonElement, binding: DirectiveBinding<number | (() => Promise<void> | void)>) {
    // 定义防抖核心逻辑
    const handleClick = async () => {
      // 按钮已禁用则直接返回
      if (el.disabled) return;

      const value = binding.value;
      // 标记按钮为禁用状态（原生disabled，自带视觉反馈）
      el.disabled = true;

      try {
        // 场景1：传入的是异步函数（如接口请求），等待函数执行完成后恢复
        if (typeof value === 'function') {
          const result = value();
          if (result instanceof Promise) {
            await result;
          }
        } 
        // 场景2：传入的是数字（延迟时间），或未传值（默认2000ms）
        else {
          const delay = typeof value === 'number' && value > 0 ? value : 2000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } finally {
        // 无论成功/失败，都恢复按钮可用状态
        el.disabled = false;
      }
    };

    // 绑定点击事件
    el.addEventListener('click', handleClick);
    // 存储处理函数，用于卸载时移除
    clickHandlerMap.set(el, handleClick);
  },

  // 组件卸载时移除事件监听，防止内存泄漏
  unmounted(el: HTMLButtonElement) {
    const handler = clickHandlerMap.get(el);
    if (handler) {
      el.removeEventListener('click', handler);
      clickHandlerMap.delete(el);
    }
  },
};

export default preventReClick;