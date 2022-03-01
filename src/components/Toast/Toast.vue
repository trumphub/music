<template>
  <div class="toast">
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      message: "",
      duration: 3000,
      visible: true,
    };
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.visible = false;
      clearTimeout(this.timer);
    }, this.duration);
  },
  methods: {
    close() {
      this.visible = false;
    },
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
    delete this.timer;
    this.$el.parentNode.removeChild(this.$el);
  },
  watch: {
    visible(visible) {
      if (!visible) {
        this.$destroy();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  z-index: 9999;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  padding: 2px 10px;
  color: #fff;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 2px #000;
}
</style>
