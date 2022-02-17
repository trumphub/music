<template>
  <div class="wrapper" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";

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
  },
  methods: {
    init() {
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
      });
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  overflow: hidden;
}
</style>
