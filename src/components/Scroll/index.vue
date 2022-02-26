<template>
  <div class="wrapper" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
BScroll.use(Pullup);

export default {
  name: "Scroll",
  props: {
    click: {
      type: Boolean,
      default: true,
    },
    probeType: {
      type: Number,
      default: 1,
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
    scrollY: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: null,
    },
    scrollEnd: {
      type: Function,
      default: null,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
    pullingUpHandler: {
      type: Function,
      default: null,
    },
    scrolling: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    init() {
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        pullUpLoad: this.pullUpLoad,
      });
      if (this.scrollEnd) {
        this.scroll.on("scrollEnd", this.scrollEnd);
      }
      if (this.pullUpLoad) {
        this.scroll.on("pullingUp", async () => {
          await this.pullingUpHandler();
          this.scroll.finishPullUp();
        });
      }
      if (this.scrolling) {
        this.scroll.on("scroll", (pos) => {
          this.$emit("scroll", pos);
        });
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement(...arguments);
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.refresh();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  overflow: hidden;
}
</style>
