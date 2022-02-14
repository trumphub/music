<template>
  <transition appear name="fade">
    <div class="header">
      <div class="left">
        <i class="iconfont icon-menu"></i>
      </div>
      <div class="center">
        <span>网易云音乐</span>
      </div>
      <div class="right">
        <i class="iconfont icon-search"></i>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.header {
  display: flex;
  height: 44px;
  padding: 0 10px;
  color: #fff;
  background-color: $primary-color;
  .left,
  .right {
    display: flex;
    width: 44px;
    height: 44px;
    .iconfont {
      margin: auto;
      font-size: 20px;
    }
  }
  .center {
    display: flex;
    flex: 1;
    font-size: 16px;
    span {
      margin: auto;
    }
  }
}
</style>
