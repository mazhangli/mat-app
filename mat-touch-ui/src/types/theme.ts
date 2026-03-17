/**
 * 主题配置类型
 */
export interface MatThemeConfig {
  /** 主色调 */
  primaryColor: string;
  /** 主色调 hover 态 */
  primaryHover: string;
  /** 主色调 active 态 */
  primaryActive: string;
  /** 主色调 disabled 态 */
  primaryDisabled: string;
  /** 渐变背景色 */
  primaryGradient: string;
  /** 反向文本色（渐变按钮用） */
  primaryReverseText: string;
}

/**
 * 加载主题配置的函数类型
 */
export type LoadThemeConfig = () => MatThemeConfig;

/**
 * 应用主题配置的函数类型
 */
export type ApplyThemeConfig = (config: Partial<MatThemeConfig>) => void;