<template>
  <div class="main">
    <scroll :data="personalized">
      <div>
        <swiper :list="bannerList" />
        <scroll :scrollX="true" :scrollY="false" :click="false">
          <div class="tab">
            <router-link
              v-for="item in iconList"
              :key="item.id"
              to="/rank"
              class="tab-item"
            >
              <div
                class="img-wrapper"
                :class="{ 'show-image': !!item.iconUrl }"
              >
                <img v-if="!!item.iconUrl" :src="item.iconUrl" alt="" />
              </div>
              <span v-text="item.name"></span>
            </router-link>
          </div>
        </scroll>
        <div class="personalized-list">
          <h1>推荐歌单</h1>
          <ul class="list">
            <li class="item" v-for="item in personalized" :key="item.id">
              <div class="pic-wrapper">
                <img v-lazy="item.picUrl" alt="" />
              </div>
              <div class="play-count">
                <i class="iconfont icon-fabulous"></i>
                <span>{{ Math.floor(item.playCount / 10000) }}万</span>
              </div>
              <span class="title ellipsis-2" v-text="item.name"></span>
            </li>
          </ul>
          <loading v-if="!personalized.length" />
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../components/Scroll";
import Swiper from "../../components/Swiper";
import { reqBannerList, reqIconList, reqPersonalized } from "../../api/home";

export default {
  name: "Home",
  components: {
    Scroll,
    Swiper,
  },
  data() {
    const bannerList = [];
    for (let i = 0; i < 11; i++) {
      bannerList.push({ pic: "" });
    }
    const iconList = [];
    for (let i = 0; i < 9; i++) {
      iconList.push({
        id: i,
        iconUrl: "",
        name: "",
      });
    }
    return {
      bannerList,
      iconList,
      personalized: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    async _reqBannerList() {
      const { banners } = await reqBannerList();
      this.bannerList = banners;
    },
    async _reqIconList() {
      const { data } = await reqIconList();
      this.iconList = data;
    },
    async _reqPersonalized() {
      const { result } = await reqPersonalized();
      this.personalized = result;
    },
    async init() {
      await this._reqBannerList();
      await this._reqIconList();
      await this._reqPersonalized();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.tab {
  display: flex;
  width: fit-content;
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 80px;
    flex: none;
    .img-wrapper {
      width: 40px;
      height: 40px;
      overflow: hidden;
      border-radius: 50%;
      background-color: #eee;
      &.show-image {
        background-color: $primary-color;
      }
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    span {
      font-size: 12px;
      padding-top: 5px;
    }
  }
}

.personalized-list {
  h1 {
    line-height: 65px;
    text-align: center;
    color: $primary-color;
    font-weight: bold;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 5px;
    .item {
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
}
</style>
