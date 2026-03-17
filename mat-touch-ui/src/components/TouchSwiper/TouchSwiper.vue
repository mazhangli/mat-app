<template>
  <van-swipe 
    class="image-swiper" 
    :autoplay="autoplay" 
    :loop="loop" 
    :duration="duration" 
    :indicator-color="indicatorColor" 
    :indicator-active-color="indicatorActiveColor" 
    :vertical="vertical" 
    @change="handleChange" 
    v-if="swiperImages.length > 0"
  >
    <van-swipe-item v-for="(img, index) in swiperImages" :key="index" class="swiper-item">
      <div class="swiper-img-wrapper">
        <img 
          class="swiper-img" 
          :src="img" 
          :alt="`swiper-img-${index}`" 
          @error="handleImgError(index)" 
          loading="lazy" 
        />
      </div>
    </van-swipe-item>
  </van-swipe>
  <div v-else class="empty-swiper">
    <van-empty description="暂无轮播图片" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

// 定义Props
const props = withDefaults(
  defineProps<{
    /** 静态图片根目录（相对于public目录，必须以/开头和结尾） */
    imgDir: string;
    /** 自动播放间隔(ms) */
    autoplay: number;
    /** 是否循环播放 */
    loop: boolean;
    /** 切换动画时长(ms) */
    duration: number;
    /** 指示器颜色 */
    indicatorColor: string;
    /** 指示器激活颜色 */
    indicatorActiveColor: string;
    /** 是否垂直轮播 */
    vertical: boolean;
    /** 支持的图片格式（仅过滤格式，无名称限制） */
    imgFormats: string[];
    /** 图片加载失败占位图 */
    errorImg: string;
    /** 图片填充模式 */
    fitMode: 'contain' | 'cover';
    /** 连续空检测阈值（检测到N个空值就停止，默认3） */
    emptyStopThreshold: number;
    /** 图片加载超时时间(ms)，防止卡死（默认2000） */
    imgLoadTimeout: number;
  }>(),
  {
    autoplay: 3000,
    loop: true,
    duration: 500,
    indicatorColor: "rgba(255, 255, 255, 0.5)",
    indicatorActiveColor: "#ffffff",
    vertical: false,
    imgFormats: () => ["jpg", "jpeg", "png", "gif", "webp"],
    errorImg: "/images/error-img.png",
    fitMode: 'contain',
    emptyStopThreshold: 3,
    imgLoadTimeout: 2000
  },
);

// 响应式数据
const swiperImages = ref<string[]>([]);
const currentIndex = ref(0);

/**
 * 检测单张图片是否存在（使用Image对象，最可靠）
 */
const checkImageExists = (imgUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 设置超时，防止无限等待
    const timeout = setTimeout(() => {
      resolve(false);
    }, props.imgLoadTimeout);

    const img = new Image();
    // 跨域图片也能检测加载状态
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true); // 图片存在
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false); // 图片不存在
    };

    img.src = imgUrl;
  });
};

/**
 * 核心逻辑：动态检测图片，解决无限循环问题
 */
const loadSwiperImages = async () => {
  if (!props.imgDir) {
    swiperImages.value = [];
    console.log("未指定图片目录，加载空列表");
    return;
  }

  console.log(`开始检测图片目录：${props.imgDir}，支持格式：${props.imgFormats.join(", ")}`);
  const tempImages: string[] = [];
  let imgIndex = 1; // 从1开始检测
  let emptyCount = 0; // 连续空值计数

  // 循环检测：直到连续emptyStopThreshold个空值就停止
  while (emptyCount < props.emptyStopThreshold) {
    let isFound = false;

    // 遍历所有支持的格式，检测当前索引的图片是否存在
    for (const format of props.imgFormats) {
      const imgUrl = `${props.imgDir}${imgIndex}.${format}`;
      console.log(`检测图片：${imgUrl}`);
      
      // 用Image对象检测，替代不可靠的fetch
      const exists = await checkImageExists(imgUrl);
      if (exists) {
        tempImages.push(imgUrl);
        isFound = true;
        emptyCount = 0; // 重置空值计数
        break;
      }
    }

    // 未找到当前索引的图片，空值计数+1
    if (!isFound) {
      emptyCount++;
      console.log(`索引${imgIndex}未找到图片，连续空值计数：${emptyCount}`);
    }

    imgIndex++;
  }

  swiperImages.value = tempImages;
  console.log(`检测完成：共找到 ${tempImages.length} 张图片`, tempImages);
};

// 图片加载失败处理
const handleImgError = (index: number) => {
  swiperImages.value[index] = props.errorImg;
};

// 轮播切换事件
const handleChange = (index: number) => {
  currentIndex.value = index;
  emit("change", index);
};

// 自定义事件
const emit = defineEmits<{
  (e: "change", index: number): void;
}>();

// 监听目录变化重新加载
watch(() => props.imgDir, loadSwiperImages, { immediate: true });

// 挂载时加载
onMounted(loadSwiperImages);
</script>

<style scoped>
.image-swiper {
  width: 100%;
  height: 100%;
  min-height: 200px;
  min-width: 300px;
}

.swiper-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.swiper-img-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.swiper-img {
  object-fit: v-bind(fitMode);
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.empty-swiper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>