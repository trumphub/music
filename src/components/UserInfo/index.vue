<template>
  <transition name="move" appear>
    <div class="user-info">
      <!-- 背景图 -->
      <div class="bg" :style="{ backgroundImage }"></div>
      <!-- 顶栏 -->
      <div class="header" ref="userinfo-header" :style="{ opacity }"></div>
      <!-- 返回按钮 -->
      <div class="back" @click="$emit('close')">
        <i class="iconfont icon-arrow-right"></i>
      </div>
      <Scroll
        :data="playlist"
        :scrolling="true"
        @scroll="scroll"
        :probeType="3"
      >
        <div class="center">
          <div class="profile" v-if="info">
            <img v-lazy="info.avatarUrl" alt="" />
            <span>{{ info.nickname }}</span>
          </div>
          <div class="play-list" v-if="!!playlist.length">
            <h2>我的歌单{{ playlist.length }}个</h2>
            <ul>
              <li v-for="item in playlist" :key="item.id">
                <img v-lazy="item.coverImgUrl" alt="" />
                <div>
                  <span v-text="item.name"></span>
                  <span>{{ item.trackCount }}首</span>
                </div>
              </li>
            </ul>
          </div>
          <loading v-if="loading && info" />
          <div class="btn" @click="logout" v-if="info">
            <span>注销</span>
          </div>
          <div class="btn" @click="toLogin" v-else>
            <span>登录</span>
          </div>
        </div>
      </Scroll>
      <loading loadingType="fullscreen" v-if="logoutStatus" />
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import Scroll from "@/components/Scroll";
import { reqUserPlayList } from "@/api/user";

export default {
  name: "UserInfo",
  data() {
    return {
      opacity: 0,
      playlist: [],
      loading: true,
      logoutStatus: false,
    };
  },
  computed: {
    ...mapState(["info", "token"]),
    backgroundImage() {
      return this.info
        ? `url(${this.info.backgroundUrl})`
        : `url(${require("@/assets/loading.png")})`;
    },
  },
  mounted() {
    this.height = this.$refs["userinfo-header"].offsetHeight * 5;
    this.token && this._getUserPlayList(this.token);
  },
  components: {
    Scroll,
  },
  methods: {
    scroll({ y }) {
      if (y >= 0) {
        this.opacity = 0;
      } else if (y < -this.height) {
        this.opacity = 1;
      } else {
        this.opacity = -y / this.height;
      }
    },
    toLogin() {
      this.$emit("close");
      this.$router.push({
        path: "/login",
      });
    },
    _getUserPlayList(uid) {
      reqUserPlayList(uid)
        .then(({ playlist }) => {
          this.loading = false;
          this.playlist = playlist.map(
            ({ name, id, coverImgUrl, trackCount }) => ({
              name,
              id,
              coverImgUrl,
              trackCount,
            })
          );
        })
        .catch(() => {
          this.loading = false;
        });
    },
    logout() {
      this.logoutStatus = true;
      this.$store.dispatch("logout").then(() => {
        this.logoutStatus = false;
        this.$emit("close");
        this.$router.push({ path: "/" });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.user-info {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #eee;

  .bg {
    position: absolute;
    width: 100%;
    height: 225px;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .back {
    position: absolute;
    top: 0;
    left: 0;
    width: 42px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    transform: rotate(180deg);
    z-index: 2;
    .iconfont {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }
  }

  .header {
    position: absolute;
    width: 100%;
    height: 42px;
    top: 0;
    left: 0;
    background: $primary-color;
    z-index: 1;
  }

  .center {
    padding: 20px;
    padding-top: 225px;
    transform: translateZ(1px);
    .profile {
      position: relative;
      margin-top: -20px;
      background-color: #fff;
      border-radius: 15px;
      line-height: 94px;
      text-align: center;
      img {
        position: absolute;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        top: -40px;
      }
    }

    .play-list {
      background-color: #fff;
      margin-top: 20px;
      padding: 20px;
      border-radius: 15px;
      h2 {
        color: #989898;
        font-size: 12px;
      }
      li {
        display: flex;
        margin-top: 20px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 5px;
        }
        div {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          line-height: 12px;
          padding-left: 20px;
          font-size: 12px;
          overflow: hidden;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .btn {
      margin-top: 20px;
      height: 40px;
      background-color: #fff;
      text-align: center;
      line-height: 40px;
      color: $primary-color;
      border-radius: 25px;
    }
  }
}
.loading-container {
  margin-top: 20px;
}
</style>
