<template>
  <div class="nav">
    <router-link class="left" to="/home">
      <i class="iconfont icon-home"></i>
      <span>首页</span>
    </router-link>
    <router-link class="center" to="/rank">
      <i class="iconfont icon-chart-bar"></i>
      <span>排行</span>
    </router-link>
    <router-link class="right" to="/singer">
      <i class="iconfont icon-favorite"></i>
      <span>歌手</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Nav",
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.nav {
  display: flex;
  height: 46px;
  border-top: 1px solid #eee;
  .left,
  .center,
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    span {
      font-size: 12px;
    }
    .iconfont {
      font-size: 16px;
    }
    &.router-link-active {
      color: $primary-color;
    }
  }
}
</style>
