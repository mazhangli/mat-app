import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { resolve } from "path";
import dts from "vite-plugin-dts";
// Vant 按需引入插件
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver, VantResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    vue(),
    // 生成TS类型声明文件
    dts({
      exclude: ["node_modules/**"],
      entryRoot: "src",
      cleanVueFileName: true,
      copyDtsFiles: true,
      include: ["src/**/*.ts", "src/**/*.vue", "src/types/**/*.d.ts"],
    }),
    // 内部按需解析Vant/ElementPlus组件
    Components({
      resolvers: [
        // ElementPlus按需引入（支持自定义主题）
        ElementPlusResolver({ importStyle: "sass" }),
        VantResolver({ importStyle: true }),
        // Vant按需引入
        // (componentName) => {
        //   if (componentName.startsWith("Van")) {
        //     return {
        //       name: componentName.slice(3),
        //       from: "vant",
        //       sideEffects: `vant/lib/${componentName.slice(3).toLowerCase()}/style/index.js`,
        //     };
        //   }
        // },
      ],
      dts: false, // 关闭该插件的类型生成，统一用vite-plugin-dts
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@mat-touch-ui": path.resolve(__dirname, "src/components"),
    },
  },
  build: {
    target: "es2018",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MatTouchUI", // UMD全局变量名
      fileName: (format) => `mat-touch-ui.${format}.js`,
      formats: ["es", "cjs"], // 输出ES模块和UMD模块
    },
    rollupOptions: {
      // 外部化依赖，避免打包Vue/Vant/ElementPlus
      external: ["vue"],
      output: {
        // UMD模式下的全局变量映射
        globals: {
          vue: "Vue",
          vant: "Vant",
          "element-plus": "ElementPlus",
        },
        // 样式文件单独输出
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            // 匹配字体文件后缀
            if (/\.woff2?$|\.ttf|\.eot|\.svg|\.otf$/.test(assetInfo.name)) {
              return "assets/fonts/[name]-[hash][extname]"; // 输出到 dist/assets/fonts/
            }
            // 样式文件输出到根目录
            if (/\.css$|\.scss$/.test(assetInfo.name)) {
              return "mat-touch-ui.[ext]";
            }
          }
          // 其他静态资源默认输出路径
          return "assets/[name]-[hash][extname]";
        },
        // 样式文件单独输出
        //assetFileNames: "mat-touch-ui.[ext]",
        exports: "named",
      },
      plugins: [
        {
          name: "vant-style-handler",
          resolveId(id) {
            // 匹配 Vant 的样式文件，确保被解析
            if (id.includes("vant/lib/") && id.endsWith(".css")) {
              return { id, external: false };
            }
          },
        },
      ],
    },
    // 确保静态资源（包括字体）被正确检测
    assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.eot", "**/*.svg", "**/*.otf"],
  },
  server: {
    port: 3001, // 开发服务器端口
    hmr: {
      overlay: false, // 关闭热更新错误浮层
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`,
        //additionalData: `@use "@/styles/vant-override.scss" as *;`,
      },
    },
  },
  optimizeDeps: {
    // 预构建核心依赖，提升开发速度
    include: ["vue", "vant", "element-plus"],
  },
});
