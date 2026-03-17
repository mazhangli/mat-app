import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * 后端返回数据的通用格式
 * @template T 数据类型
 */
export interface ApiResponse<T = any> {
  code: number; // 业务状态码（如200成功，500失败）
  message: string; // 提示信息
  data: T; // 业务数据
  [key: string]: any; // 扩展字段
}

/**
 * 请求拦截器配置
 */
export interface RequestInterceptor {
  onFulfilled?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRejected?: (error: any) => any;
}

/**
 * 响应拦截器配置
 */
export interface ResponseInterceptor {
  onFulfilled?: <T = any>(response: AxiosResponse<ApiResponse<T>>) => AxiosResponse<ApiResponse<T>> | Promise<AxiosResponse<ApiResponse<T>>>;
  onRejected?: (error: AxiosError) => any;
}

/**
 * 自定义Axios请求配置（扩展原生配置，修复命名冲突）
 */
export interface RequestConfig<T = any> extends AxiosRequestConfig {
  /** 是否开启取消重复请求 */
  cancelRepeatRequest?: boolean;
  /** 是否开启请求重试 */
  retry?: boolean;
  /** 重试次数 */
  retryCount?: number;
  /** 重试间隔（毫秒） */
  retryDelay?: number;
  /** 响应结果类型（默认返回data，可选返回完整response） */
  resultType?: 'data' | 'response';
  /** 自定义业务成功状态码 */
  successCode?: number | number[];
  /** 忽略错误提示（用于不需要全局提示的接口） */
  ignoreErrorTip?: boolean;
  /** 请求数据（兼容POST/PUT等方法的data字段） */
  data?: T;
  /** 请求参数（兼容GET等方法的params字段） */
  params?: T;
  /** 重试计数（内部使用） */
  __retryCount?: number;
}

/**
 * 取消请求控制器映射（改用Record，兼容erasableSyntaxOnly）
 */
export type CancelTokenSourceMap = Record<string, AbortController>;

/**
 * 错误类型枚举（改用const enum，编译时擦除）
 */
export const enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR', // 网络错误（如断网、超时）
  BUSINESS_ERROR = 'BUSINESS_ERROR', // 业务错误（如code非200）
  STATUS_CODE_ERROR = 'STATUS_CODE_ERROR', // HTTP状态码错误（如404、500）
  REQUEST_CANCEL = 'REQUEST_CANCEL', // 请求取消
  UNKNOWN_ERROR = 'UNKNOWN_ERROR', // 未知错误
}

/**
 * 统一错误处理返回格式
 */
export interface RequestError {
  type: ErrorType;
  message: string;
  code?: number; // HTTP状态码或业务状态码
  rawError?: AxiosError; // 原生Axios错误对象
}