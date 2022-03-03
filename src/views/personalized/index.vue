<template>
  <transition appear>
    <div class="list-container">
      <!-- 背景图 -->
      <div class="bg" ref="bg" :style="{ backgroundImage }"></div>
      <!-- 顶栏 -->
      <div class="header-bg" ref="header-bg" :style="{ opacity }"></div>
      <!-- 返回按钮 -->
      <div class="header">
        <i class="iconfont icon-arrow-right" @click="$router.back()"></i>
        <h2>{{ title }}</h2>
      </div>
      <!-- 列表 -->
      <div class="list-wrapper">
        <Scroll
          overflow="visible"
          :data="list"
          :scrolling="true"
          @scroll="scroll"
          :probeType="3"
        >
          <ul class="list">
            <li v-for="(song, index) in list" :key="index">
              <div class="left">{{ index + 1 }}</div>
              <div class="right">
                <span>{{ song.name }}</span>
                <span>{{ song.singer }}</span>
              </div>
            </li>
          </ul>
        </Scroll>
      </div>
      <loading loadingType="fullscreen" v-if="loading" />
    </div>
  </transition>
</template>

<script>
import { reqPlaylist, reqPlaylistDetail } from "@/api/home";
import Scroll from "@/components/Scroll";

export default {
  name: "Personalized",
  props: ["id"],
  data() {
    return {
      opacity: 0,
      title: "",
      coverImgUrl: "",
      list: [],
      loading: true,
    };
  },
  computed: {
    backgroundImage() {
      return this.coverImgUrl
        ? `url(${this.coverImgUrl})`
        : `url(${require("@/assets/loading.png")})`;
    },
  },
  mounted() {
    this.height = this.$refs["header-bg"].offsetHeight * 5;
    this.init();
  },
  methods: {
    async init() {
      try {
        const {
          playlist: { coverImgUrl, name },
        } = await reqPlaylistDetail(this.id);
        const { songs } = await reqPlaylist(this.id);
        this.coverImgUrl = coverImgUrl;
        this.title = name;
        this.list = songs.map((song) => ({
          id: song.al.id,
          name: song.al.name,
          singer: song.ar.map((item) => item.name).join(" / "),
        }));
        this.loading = false;
      } catch (error) {
        this.$toast("加载失败");
        this.loading = false;
      }
    },
    scroll({ y }) {
      if (y >= 0) {
        this.opacity = 0;
        this.$refs.bg.style.transform = `scale(${1 + y / 200})`;
      } else if (y < -this.height) {
        this.opacity = 1;
      } else {
        this.opacity = -y / this.height;
      }
    },
  },
  components: {
    Scroll,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.list-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  z-index: 10;

  .bg {
    height: 250px;
    background-size: cover;
    background-position: center;
    transform-origin: center top;
    transform: scale(1);
  }

  .header-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 42px;
    background-color: $primary-color;
    z-index: 1;
  }

  .header {
    z-index: 2;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 42px;
    i {
      width: 42px;
      height: 42px;
      text-align: center;
      line-height: 42px;
      font-size: 20px;
      transform: rotate(180deg);
      font-weight: bold;
      color: #fff;
    }
    h2 {
      margin-right: 42px;
      flex: 1;
      text-align: center;
      line-height: 42px;
      font-size: 14px;
      color: #fff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    top: 250px;
    width: 100%;
    height: calc(100vh - 250px);
    .list {
      background-color: #fff;
      padding: 10px 30px;
      li {
        display: flex;
        border-top: 1px solid #eee;
        padding: 10px 0;
        &:first-child {
          border-top: none;
        }
        .left {
          width: 45px;
          height: 45px;
          text-align: center;
          line-height: 45px;
          font-weight: bold;
          font-size: 20px;
          color: $primary-color;
        }
        .right {
          display: flex;
          overflow: hidden;
          flex-direction: column;
          flex: 1;
          font-size: 12px;
          line-height: 12px;
          justify-content: space-around;
          padding-left: 20px;
          span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
