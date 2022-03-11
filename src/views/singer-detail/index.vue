<template>
  <transition appear>
    <div class="singer-container">
      <!-- 背景图 -->
      <div class="bg" ref="bg" :style="{ backgroundImage: img1v1Url }"></div>
      <!-- 顶栏 -->
      <div class="header-bg" ref="header-bg" :style="{ opacity }"></div>
      <!-- 返回按钮 -->
      <div class="header">
        <i class="iconfont icon-arrow-right" @click="$router.back()"></i>
        <h2>{{ name }}</h2>
      </div>
      <!-- tab栏 -->
      <div class="tab" ref="tab">
        <div
          v-for="tab in tabs"
          :key="tab.idx"
          @click="changeTab(tab.idx)"
          class="left"
          :class="{ active: tab.idx === currentTab }"
          v-waves
        >
          {{ tab.title }}
        </div>
      </div>
      <!-- 列表 -->
      <div class="list-wrapper">
        <Scroll
          ref="scroll"
          overflow="visible"
          :data="[hotSongs, briefDesc]"
          :scrolling="true"
          @scroll="scroll"
          :probeType="3"
        >
          <div class="list">
            <!-- 歌曲列表 -->
            <ul class="songs" v-show="currentTab === 0">
              <li
                v-for="song in hotSongs"
                :key="song.id"
                v-waves
                @click="handleItemClick(hotSongs, song)"
              >
                <div class="left">
                  <img
                    v-lazy="
                      'https://p4.music.126.net/HsTQ9vYrCFVTs5jc-RBTww==/109951166271655834.jpg'
                    "
                    alt=""
                  />
                </div>
                <div class="center">
                  <span>{{ song.name }}</span>
                  <span>{{ song.al.name }}</span>
                </div>
                <div class="right">
                  <span>{{ song.dt | formatTime }}</span>
                </div>
              </li>
            </ul>
            <!-- 详情信息 -->
            <div class="singer-detail" v-show="currentTab === 1">
              {{ briefDesc }}
            </div>
          </div>
        </Scroll>
      </div>
      <loading loadingType="fullscreen" v-if="loading" />
    </div>
  </transition>
</template>

<script>
import Scroll from "@/components/Scroll";
import { reqSingerDetail } from "@/api/singer";

export default {
  name: "SingerDetail",
  props: ["id"],
  data() {
    return {
      hotSongs: [],
      name: "",
      opacity: 0,
      img1v1Url: "",
      briefDesc: "",
      tabs: [
        {
          title: "歌曲",
          idx: 0,
        },
        {
          title: "详情",
          idx: 1,
        },
      ],
      currentTab: 0,
      loading: true,
    };
  },
  methods: {
    async init() {
      try {
        const {
          artist: { img1v1Url, name, briefDesc },
          hotSongs,
        } = await reqSingerDetail(this.id);
        this.img1v1Url = `url(${img1v1Url})`;
        this.name = name;
        this.hotSongs = hotSongs
          .filter((item) => item.fee === 8)
          .map((song) => ({
            id: song.id,
            name: song.name,
            singer: song.ar.map((item) => item.name).join(" / "),
            dt: song.dt,
            picUrl: song.al.picUrl,
            status: "stoped",
            al: { name: song.al.name },
          }));
        this.briefDesc = briefDesc;
        this.loading = false;
      } catch (error) {
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
        this.$refs.bg.style.transform = `translateY(${y}px)`;
      }
      if (y < this.tabClientRect.height - this.tabClientRect.top) {
        this.$refs.tab.style.top = this.tabClientRect.height + "px";
      } else {
        this.$refs.tab.style.top = this.tabClientRect.top + y + "px";
      }
    },
    changeTab(tab) {
      if (this.currentTab === tab) {
        return;
      }
      this.currentTab = tab;
      this.$refs.scroll.scrollTo(0, 0);
    },
    handleItemClick(list, song) {
      list = list.map(({ id, name, singer, dt, picUrl, status }) => ({
        id,
        name,
        singer,
        dt,
        picUrl,
        status,
      }));
      this.$store.dispatch("addToPlayList", { list, song });
    },
  },
  mounted() {
    this.height = this.$refs["header-bg"].offsetHeight * 5;
    this.tabClientRect = this.$refs.tab.getBoundingClientRect();
    this.init();
  },
  components: {
    Scroll,
  },
  filters: {
    formatTime: function (time) {
      const date = new Date(time);
      const min = date.getMinutes();
      const sec = date.getSeconds();
      return `${min} : ${sec.toString().length === 1 ? "0" + sec : sec}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.singer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  z-index: 11;
  .bg {
    height: 250px;
    background-color: #ccc;
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
      flex-shrink: 0;
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
      white-space: nowrap;
      overflow: hidden;
      span {
        display: block;
      }
    }
  }

  .tab {
    position: fixed;
    z-index: 1;
    top: 250px;
    left: 0;
    display: flex;
    width: 100%;
    height: 42px;
    background-color: #fff;
    .left,
    .right {
      flex: 1;
      text-align: center;
      line-height: 42px;
      font-size: 14px;
      &.active {
        color: $primary-color;
        border-bottom: 3px solid $primary-color;
      }
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    top: 292px;
    width: 100%;
    height: calc(100vh - 292px);
    .list {
      background-color: #fff;
      .songs {
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
            img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 2px;
            }
          }
          .center {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            padding-right: 20px;
            justify-content: space-around;
            span:first-child {
              font-size: 14px;
              line-height: 14px;
            }
            span:last-child {
              font-size: 12px;
              line-height: 12px;
              color: #989898;
            }
            overflow: hidden;
            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .right {
            width: 45px;
            height: 45px;
            text-align: center;
            line-height: 45px;
            font-size: 14px;
          }
        }
      }
      .singer-detail {
        font-size: 14px;
        padding: 20px 30px;
        text-indent: 2em;
        line-height: 28px;
      }
    }
  }
}
</style>
