<template>
  <li class="item-wrapper">
    <div class="item">
      <div class="pic-wrapper">
        <img v-lazy="item.picUrl" alt="" />
      </div>
      <div class="play-count">
        <i class="iconfont icon-fabulous"></i>
        <span>{{ Math.floor(item.playCount / 10000) }}万</span>
      </div>
      <span class="title ellipsis-2" v-text="item.name"></span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.item-wrapper {
  width: calc((100vw - 10px) / 3);

  .item {
    margin: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 116px;
    height: 174px;
    flex: none;
    overflow: hidden;
    .play-count {
      position: absolute;
      width: 100%;
      height: 26px;
      background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .iconfont {
        font-size: 18px;
        line-height: 26px;
        margin-right: 2px;
        color: #f1f1f1;
      }
      span {
        margin-right: 5px;
        color: #f1f1f1;
      }
    }
    .pic-wrapper {
      width: 116px;
      overflow: hidden;
      border-radius: 2px;
      img {
        display: block;
        width: 100%;
      }
    }
    .title {
      font-size: 12px;
      margin: 5px 2px;
    }
  }
}
</style>
