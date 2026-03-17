// Vue 通用工具类型
import type { Component, VNode } from '@vue/runtime-core';

// 通用尺寸类型
export type SizeType = 'small' | 'normal' | 'large' | 'xlarge';

// Vue 节点类型
export type VueNode = VNode | string | number | boolean | null | undefined;

// 组件类型（支持组件名/组件实例）
export type ComponentType = string | Component;