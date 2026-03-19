import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
const resolvePath = (dir: string) => path.resolve(__dirname, dir)

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 核心别名：src 根目录（必配）
      '@': resolvePath('src'),
      // 常用目录别名（按需扩展，提升代码可读性）
      '@views': resolvePath('src/views'),
      '@components': resolvePath('src/components'),
      '@utils': resolvePath('src/utils'),
      '@api': resolvePath('src/api'),
      '@assets': resolvePath('src/assets'),
      '@router': resolvePath('src/router'),
      '@store': resolvePath('src/store'),
      '@hooks': resolvePath('src/hooks') 
    },
  },
})
