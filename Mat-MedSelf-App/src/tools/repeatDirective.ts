import type { Directive, DirectiveBinding } from 'vue';

// 创建一个 WeakMap 来存储元素和处理函数的映射
const handlerMap = new WeakMap<HTMLButtonElement, () => void>();

const repeatDirective: Directive = {
  beforeMount(el: HTMLButtonElement, binding: DirectiveBinding<() => Promise<void> | void>) {
    let isProcessing = false;
    const fixedDelay = Number(binding.arg) || 0;
    const clickHandler = binding.value;

    const handleClick = async () => {
      if (isProcessing) return;
      try {
        isProcessing = true;
        el.classList.add('repeat-click-loading');
        const result = clickHandler();
        if (result instanceof Promise) {
          await result;
        } else if (fixedDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, fixedDelay));
        }
      } finally {
        el.classList.remove('repeat-click-loading');
        isProcessing = false;
      }
    };

    el.addEventListener('click', handleClick);
    // 将处理函数存入 WeakMap
    handlerMap.set(el, handleClick);
  },
  unmounted(el: HTMLButtonElement) {
    // 从 WeakMap 中取出处理函数并移除监听
    const handler = handlerMap.get(el);
    if (handler) {
      el.removeEventListener('click', handler);
      handlerMap.delete(el);
    }
  },
};

export default repeatDirective;