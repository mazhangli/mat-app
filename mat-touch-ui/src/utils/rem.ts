/**
 * 根据屏幕宽度动态设置 rem 基准值
 * @param designWidth 设计稿宽度（例如 1920）
 * @param minWidth 最小适配宽度（避免屏幕过窄时布局错乱）
 * @param maxWidth 最大适配宽度（避免屏幕过宽时布局过大）
 */
export function setRem(designWidth: number = 1080, minWidth: number = 1080, maxWidth: number = 3840) {
  const update = () => {
    // 获取屏幕宽度，优先取html的clientWidth，兼容不同浏览器
    let clientWidth = document.documentElement.clientWidth || window.innerWidth;

    // 限制屏幕宽度的边界值，避免极端情况
    clientWidth = Math.max(minWidth, Math.min(maxWidth, clientWidth));

    console.log(`更新 rem 基准值: 设计稿宽度: ${designWidth}px, 屏幕宽度: ${clientWidth}px`);

    // 核心计算：屏幕宽度 / 设计稿宽度 = 缩放比例，乘以100是为了简化rem换算
    const rootValue = (clientWidth / designWidth) * 35;
    console.log(`设置 rem 基准值: ${rootValue}px`);

    // 设置根元素的fontSize（rem的基准值）
    document.documentElement.style.fontSize = `${rootValue}px`;
  };

  // 初始化执行一次
  update();

  // 监听窗口大小变化（防抖处理，避免频繁触发）
  const debouncedUpdate = debounce(update, 100);
  window.addEventListener("resize", debouncedUpdate);

  // 返回卸载方法，用于组件卸载时清除监听
  return () => {
    window.removeEventListener("resize", debouncedUpdate);
  };
}

// 防抖函数（辅助函数，避免resize频繁触发）
function debounce(fn: Function, delay: number) {
  // 修正类型声明：兼容浏览器(number)和Node.js(Timeout)环境
  let timer: number | NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    // 清除之前的定时器
    if (timer) clearTimeout(timer);
    // 重新设置定时器，此时赋值不会有类型错误
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export default setRem;
