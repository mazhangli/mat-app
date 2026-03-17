import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig, isAxiosError } from "axios";
import { axiosConfig, statusCodeMessage, networkErrorMsg } from "./axios.config";
import { type ApiResponse, type RequestConfig, type CancelTokenSourceMap, type RequestError, ErrorType, type RequestInterceptor, type ResponseInterceptor } from "./axios.types";

class Request {
  // Axios实例
  private instance: AxiosInstance;
  // 取消请求控制器映射
  private cancelTokenSourceMap: CancelTokenSourceMap = {};
  // 默认配置
  private defaultConfig: RequestConfig = axiosConfig;

  constructor(config: RequestConfig = {}) {
    // 合并默认配置和自定义配置
    this.defaultConfig = { ...this.defaultConfig, ...config };

    // 剥离自定义字段，仅保留Axios原生配置
    const {
      resultType,
      cancelRepeatRequest,
      retry,
      retryCount,
      retryDelay,
      successCode,
      ignoreErrorTip,
      __retryCount,
      ...axiosNativeConfig // 原生Axios配置
    } = this.defaultConfig;

    // 创建Axios实例（仅传原生配置，解决类型冲突）
    this.instance = axios.create(axiosNativeConfig);
    // 初始化拦截器
    this.setupInterceptors();
  }

  /**
   * 生成请求唯一标识（用于取消重复请求）
   * @param config 请求配置
   */
  private generateRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return [method?.toUpperCase() || "GET", url || "", JSON.stringify(params || {}), JSON.stringify(data || {})].join("&");
  }

  /**
   * 取消重复请求
   * @param config 请求配置
   */
  private cancelRepeatRequest(config: InternalAxiosRequestConfig): void {
    const requestKey = this.generateRequestKey(config);
    // 如果存在相同请求，先取消之前的请求
    if (this.cancelTokenSourceMap[requestKey]) {
      this.cancelTokenSourceMap[requestKey].abort("重复请求已取消");
      delete this.cancelTokenSourceMap[requestKey];
    }
    // 创建新的取消控制器
    const controller = new AbortController();
    config.signal = controller.signal;
    this.cancelTokenSourceMap[requestKey] = controller;
  }

  /**
   * 移除取消请求控制器
   * @param config 请求配置
   */
  private removeCancelTokenSource(config: InternalAxiosRequestConfig): void {
    const requestKey = this.generateRequestKey(config);
    if (this.cancelTokenSourceMap[requestKey]) {
      delete this.cancelTokenSourceMap[requestKey];
    }
  }

  /**
   * 请求重试逻辑（修复类型冲突）
   * @param error 错误对象
   */
  private async retryRequest(error: AxiosError): Promise<any> {
    const customConfig = error.config as RequestConfig;
    // 未开启重试、无重试次数、超过最大重试次数则不重试
    if (!customConfig?.retry || !customConfig.retryCount || customConfig.retryCount <= 0) {
      return Promise.reject(error);
    }

    // 记录已重试次数（初始为0）
    customConfig.__retryCount = customConfig.__retryCount || 0;
    // 超过最大重试次数则拒绝
    if (customConfig.__retryCount >= customConfig.retryCount) {
      return Promise.reject(error);
    }

    // 增加重试次数
    customConfig.__retryCount += 1;

    // 剥离自定义字段，仅保留Axios原生配置
    const {
      resultType,
      cancelRepeatRequest,
      retry,
      retryCount,
      retryDelay,
      successCode,
      ignoreErrorTip,
      __retryCount,
      ...axiosRequestConfig // 原生请求配置
    } = customConfig;

    // 延迟重试
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(customConfig.retryDelay || this.defaultConfig.retryDelay!);

    // 重新发起请求（仅传原生配置）
    return this.instance(axiosRequestConfig);
  }

  /**
   * 统一错误处理
   * @param error Axios错误对象
   */
  private handleError(error: AxiosError): RequestError {
    // 1. 先声明并获取 customConfig，确保后续所有逻辑都能访问
    const customConfig = error.config as RequestConfig;

    let requestError: RequestError = {
      type: ErrorType.UNKNOWN_ERROR,
      message: "未知错误",
      rawError: error,
    };

    // 取消请求错误
    if (error.name === "AbortError") {
      requestError = {
        type: ErrorType.REQUEST_CANCEL,
        message: error.message || "请求已取消",
        rawError: error,
      };
    }
    // 网络错误（无响应）
    else if (!error.response) {
      requestError = {
        type: ErrorType.NETWORK_ERROR,
        message: networkErrorMsg,
        rawError: error,
      };
    }
    // 有响应但状态码非2xx
    else {
      const { status } = error.response;
      // HTTP状态码错误
      if (status < 200 || status >= 300) {
        requestError = {
          type: ErrorType.STATUS_CODE_ERROR,
          message: statusCodeMessage[status] || `请求失败（${status}）`,
          code: status,
          rawError: error,
        };
      }

      // 业务状态码错误（解析响应数据）
      const responseData = error.response.data as ApiResponse;
      if (responseData?.code) {
        // 2. 现在可以安全地访问 customConfig 了
        const successCode = customConfig.successCode || this.defaultConfig.successCode;
        const isSuccess = Array.isArray(successCode) ? successCode.includes(responseData.code) : responseData.code === successCode;

        if (!isSuccess) {
          requestError = {
            type: ErrorType.BUSINESS_ERROR,
            message: responseData.message || "业务处理失败",
            code: responseData.code,
            rawError: error,
          };
        }
      }
    }

    // 非忽略错误提示的场景，添加全局提示
    const ignoreErrorTip = customConfig?.ignoreErrorTip;
    if (!ignoreErrorTip && requestError.type !== ErrorType.REQUEST_CANCEL) {
      // 可替换为项目的UI组件提示（如ElMessage）
      // import { ElMessage } from 'element-plus';
      // ElMessage.error(requestError.message);
      console.error("Request Error:", requestError.message);
    }

    return requestError;
  }

  /**
   * 初始化拦截器（修复this指向：使用箭头函数）
   */
  private setupInterceptors(): void {
    // 请求拦截器
    const requestInterceptor: RequestInterceptor = {
      onFulfilled: (config: InternalAxiosRequestConfig) => {
        const customConfig = config as RequestConfig;

        // 取消重复请求（this指向正确）
        if (customConfig.cancelRepeatRequest !== false) {
          this.cancelRepeatRequest(config);
        }

        // 添加请求头（如token）
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      onRejected: (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
      },
    };

    // 响应拦截器
    const responseInterceptor: ResponseInterceptor = {
      onFulfilled: (response) => {
        const customConfig = response.config as RequestConfig;
        this.removeCancelTokenSource(customConfig);

        // 根据配置返回不同格式的数据
        if (customConfig.resultType === "response") {
          return response; // 返回完整 AxiosResponse
        }

        // 业务状态码校验
        const successCode = customConfig.successCode || this.defaultConfig.successCode;
        const isSuccess = Array.isArray(successCode) ? successCode.includes(response.data.code) : response.data.code === successCode;

        if (isSuccess) {
          return response.data; // 返回 ApiResponse
        } else {
          // 业务错误，抛出自定义错误
          const error = new AxiosError(response.data.message || "业务处理失败", String(response.data.code), customConfig, response.request, response);
          return Promise.reject(error);
        }
      },
      onRejected: async (error) => {
        // ... 错误处理逻辑保持不变 ...
      },
    };

    // 注册拦截器
    this.instance.interceptors.request.use(requestInterceptor.onFulfilled, requestInterceptor.onRejected);
    this.instance.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);
  }

  /**
   * 通用请求方法
   * @param config 请求配置
   */
  public request<T = any>(config: RequestConfig): Promise<T> {
    // 合并默认配置和请求配置
    const mergeConfig = { ...this.defaultConfig, ...config };

    // 剥离自定义字段，仅保留Axios原生配置
    const { resultType, cancelRepeatRequest, retry, retryCount, retryDelay, successCode, ignoreErrorTip, __retryCount, ...axiosRequestConfig } = mergeConfig;

    return this.instance.request<T>(axiosRequestConfig);
  }

  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 自定义配置
   */
  public get<T = any>(url: string, params?: Record<string, any>, config: Omit<RequestConfig, "method" | "url" | "params"> = {}): Promise<T> {
    return this.request<T>({
      ...config,
      method: "GET",
      url,
      params,
    });
  }

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 自定义配置
   */
  public post<T = any>(url: string, data?: Record<string, any>, config: Omit<RequestConfig, "method" | "url" | "data"> = {}): Promise<T> {
    return this.request<T>({
      ...config,
      method: "POST",
      url,
      data,
    });
  }

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 自定义配置
   */
  public put<T = any>(url: string, data?: Record<string, any>, config: Omit<RequestConfig, "method" | "url" | "data"> = {}): Promise<T> {
    return this.request<T>({
      ...config,
      method: "PUT",
      url,
      data,
    });
  }

  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 自定义配置
   */
  public delete<T = any>(url: string, params?: Record<string, any>, config: Omit<RequestConfig, "method" | "url" | "params"> = {}): Promise<T> {
    return this.request<T>({
      ...config,
      method: "DELETE",
      url,
      params,
    });
  }

  /**
   * 取消所有请求
   */
  public cancelAllRequests(): void {
    Object.keys(this.cancelTokenSourceMap).forEach((key) => {
      this.cancelTokenSourceMap[key].abort("所有请求已取消");
      delete this.cancelTokenSourceMap[key];
    });
  }

  /**
   * 获取Axios实例（用于特殊场景扩展）
   */
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建默认请求实例
const request = new Request();

// 导出实例和类（支持创建多实例）
export default request;
export { Request };
