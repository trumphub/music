<template>
  <div class="confirm-wrap">
    <transition name="scale" appear>
      <div class="confirm" v-show="show">
        <div class="msg">
          <span>{{ message }}</span>
        </div>
        <div class="oper">
          <button v-waves @click="_cancel">取消</button>
          <button v-waves @click="_confirm">确认</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Confirm",
  data() {
    return {
      message: undefined,
      cancel: undefined,
      confirm: undefined,
      show: true,
    };
  },
  methods: {
    _cancel() {
      this.show = false;
      this.timerID = setTimeout(() => {
        this.cancel();
        this.$destroy();
      }, 300);
    },
    _confirm() {
      this.show = false;
      this.timerID = setTimeout(() => {
        this.confirm();
        this.$destroy();
      }, 300);
    },
  },
  beforeDestroy() {
    this.timerID && clearTimeout(this.timerID);
    this.$el.parentNode.removeChild(this.$el);
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.confirm-wrap {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  .confirm {
    margin: auto;
    width: 200px;
    border-radius: 3px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    .msg {
      box-sizing: border-box;
      text-align: center;
      line-height: 50px;
      border-bottom: 1px solid $primary-color;
    }
    .oper {
      display: flex;
      button {
        flex: 1;
        height: 30px;
        border: none;
        text-align: center;
        line-height: 30px;
        color: #fff;
        background-color: $primary-color;
        &:first-child {
          color: $primary-color;
          background-color: #fff;
        }
      }
    }
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s;
}

.scale-enter,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
