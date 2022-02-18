<template>
  <div class="loading-container" :class="loadingType">
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    loadingType: {
      type: String,
      default: "normal",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.loading-container {
  &.normal {
    .loading {
      justify-content: center;
    }
  }
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .loading {
    display: flex;
    span {
      width: 5px;
      height: 30px;
      background-color: $primary-color;
      margin: 0 2px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;

      &:nth-child(1),
      &:nth-child(5) {
        animation: ani 0.5s linear -0.6s infinite alternate-reverse;
      }
      &:nth-child(2),
      &:nth-child(4) {
        animation: ani 0.5s linear -0.3s infinite alternate-reverse;
      }
      &:nth-child(3) {
        animation: ani 0.5s linear 0s infinite alternate-reverse;
      }
    }
  }
}
@keyframes ani {
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(0.5);
  }
}
</style>
