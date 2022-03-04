<template>
  <transition appear>
    <div class="list-container">
      <!-- 背景图 -->
      <div class="bg" ref="bg" :style="{ backgroundImage }"></div>
      <!-- 顶栏 -->
      <div class="header-bg" ref="header-bg" :style="{ opacity }"></div>
      <!-- 返回按钮 -->
      <div class="header">
        <i class="iconfont icon-arrow-right" @click="$router.back()"></i>
        <h2>
          <span ref="title">{{ title }}</span>
        </h2>
      </div>
      <!-- 列表 -->
      <div class="list-wrapper">
        <Scroll
          overflow="visible"
          :data="list"
          :scrolling="true"
          @scroll="scroll"
          :probeType="3"
        >
          <ul class="list">
            <li v-for="(song, index) in list" :key="index">
              <slot :song="song" :$index="index" />
            </li>
          </ul>
        </Scroll>
      </div>
      <loading loadingType="fullscreen" v-if="loading" />
    </div>
  </transition>
</template>

<script>
import Scroll from "@/components/Scroll";

export default {
  name: "List",
  props: {
    backgroundImage: {
      type: String,
      default: `url(${require("@/assets/loading.png")})`,
    },
    title: {
      type: String,
      require: true,
    },
    list: {
      type: Array,
      require: true,
    },
    loading: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      opacity: 0,
    };
  },
  mounted() {
    this.height = this.$refs["header-bg"].offsetHeight * 5;
    this.$refs.title.addEventListener("transitionend", this.reset);
    this.$nextTick(() => {
      this.move();
    });
  },
  beforeDestroy() {
    this.$refs.title.removeEventListener("transitionend", this.reset);
  },
  methods: {
    scroll({ y }) {
      if (y >= 0) {
        this.opacity = 0;
        this.$refs.bg.style.transform = `scale(${1 + y / 200})`;
      } else if (y < -this.height) {
        this.opacity = 1;
      } else {
        this.opacity = -y / this.height;
      }
    },
    move() {
      this.$refs.title.style.transform = "translateX(-100%)";
      this.$refs.title.style.transition = "transform 10s linear";
    },
    reset() {
      this.$refs.title.style.transform = "translateX(100%)";
      this.$refs.title.style.transition = "none";
      setTimeout(this.move);
    },
  },
  components: {
    Scroll,
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";

.list-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  z-index: 11;

  .bg {
    height: 250px;
    background-size: cover;
    background-position: center;
    transform-origin: center top;
    transform: scale(1);
  }

  .header-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 42px;
    background-color: $primary-color;
    z-index: 1;
  }

  .header {
    z-index: 2;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 42px;
    i {
      flex-shrink: 0;
      width: 42px;
      height: 42px;
      text-align: center;
      line-height: 42px;
      font-size: 20px;
      transform: rotate(180deg);
      font-weight: bold;
      color: #fff;
    }
    h2 {
      margin-right: 42px;
      flex: 1;
      text-align: center;
      line-height: 42px;
      font-size: 14px;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      span {
        display: block;
      }
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    top: 250px;
    width: 100%;
    height: calc(100vh - 250px);
    .list {
      background-color: #fff;
      padding: 10px 30px;
      li {
        display: flex;
        border-top: 1px solid #eee;
        padding: 10px 0;
        &:first-child {
          border-top: none;
        }
      }
    }
  }
}
</style>
