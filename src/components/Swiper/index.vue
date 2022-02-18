<template>
  <div class="swiper">
    <div class="slide-wrapper" ref="swiper">
      <div class="slide-content">
        <div class="slide-page" v-for="(item, index) in list" :key="index">
          <img
            v-if="item.pic"
            @click="handleClick(item)"
            :src="item.pic"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="num in this.list.length"
        :key="num"
        :class="{ active: currentPageIndex === num - 1 }"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
BScroll.use(Slide);

export default {
  name: "Swiper",
  data() {
    return {
      currentPageIndex: 0,
    };
  },
  props: {
    list: {
      type: Array,
      require: true,
    },
  },
  methods: {
    init() {
      this.swiper = new BScroll(this.$refs.swiper, {
        scrollX: true,
        scrollY: false,
        probeType: 3,
        bounce: false,
        momentum: false,
        slide: true,
      });
      this.swiper.on("slideWillChange", (page) => {
        this.currentPageIndex = page.pageX;
      });
    },
    handleClick(item) {
      console.log(item);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.swiper.destroy();
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.swiper {
  position: relative;
  .slide-wrapper {
    overflow: hidden;
    .slide-content {
      display: flex;
      .slide-page {
        flex: none;
        width: 375px;
        height: 146px;
        background-color: #eee;
        img {
          display: block;
          width: 375px;
          height: 146px;
        }
      }
    }
  }
  .dots-wrapper {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #eee;
      margin: 0 5px;
      &.active {
        background: $primary-color;
      }
    }
  }
}
</style>
