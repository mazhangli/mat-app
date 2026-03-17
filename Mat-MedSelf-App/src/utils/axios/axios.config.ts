/**
 * Axios基础配置
 * 区分开发/生产环境，配置不同的基础URL、超时时间等
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 基础配置
export const axiosConfig = {
  // 请求基础路径
  baseURL: BASE_URL,
  // 请求超时时间（毫秒）
  timeout: 10000,
  // 默认请求头
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // 是否开启取消重复请求（默认开启）
  cancelRepeatRequest: true,
  // 是否开启请求重试（默认关闭）
  retry: false,
  // 重试次数（默认3次）
  retryCount: 3,
  // 重试间隔（默认1000ms）
  retryDelay: 1000,
  // 默认业务成功状态码
  successCode: 200,
  // 默认响应结果类型（只返回data）
  resultType: 'data' as const,
};

// 状态码对应的提示信息
export const statusCodeMessage: Record<number, string> = {
  400: '请求参数错误',
  401: '登录状态失效，请重新登录',
  403: '没有权限访问该资源',
  404: '请求资源不存在',
  405: '请求方法不允许',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务器暂时不可用',
  504: '网关超时',
};

// 网络错误提示信息
export const networkErrorMsg = '网络异常，请检查网络连接后重试';