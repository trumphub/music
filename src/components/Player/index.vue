<template>
  <div v-show="!!playList.length">
    <!-- 全屏模式 -->
    <div class="full-player" v-show="currentPlayingSong && playerMode === 0">
      <!-- 背景 -->
      <div class="background">
        <img :src="currentPlayingSong.picUrl" alt="" />
      </div>
      <!-- 头部 -->
      <div class="top">
        <div class="left" @click="playerMode = 1">
          <i class="iconfont icon-arrow-right"></i>
        </div>
        <div class="center">
          <span>{{ currentPlayingSong.name }}</span>
        </div>
        <div class="right">
          <i class="iconfont icon-elipsis"></i>
        </div>
      </div>
      <!-- 歌手名 -->
      <div class="singer-name">{{ currentPlayingSong.singer }}</div>
      <!-- 中间区域 -->
      <div
        class="middle"
        @touchstart="middleTouchStart"
        @touchmove="middleTouchMove"
        @touchend="middleTouchEnd"
      >
        <div class="middle-l" ref="middle-l">
          <!-- 封面 -->
          <div class="cd">
            <img
              :class="{ playing: songStatus === 'playing' }"
              :src="currentPlayingSong.picUrl"
              alt=""
            />
          </div>
          <!-- 歌词 -->
          <div class="lyric">
            <span>{{ cureentlyric.content }}</span>
          </div>
        </div>
        <div class="middle-r" ref="middle-r">
          <Scroll :data="lyric" ref="scroll">
            <div ref="contents">
              <p
                ref="p"
                v-for="(item, index) in lyric"
                :key="index"
                :class="{ current: cureentlyric.index === index }"
              >
                {{ item.content }}
              </p>
            </div>
          </Scroll>
        </div>
      </div>
      <!-- 底部 -->
      <div class="footer">
        <div class="progress-wrapper">
          <div class="cureentTime">{{ currentTime | formatTime }}</div>
          <div class="progress" ref="progress" @click="progressClick">
            <div :style="{ width }" class="current-progress"></div>
            <div
              @touchstart.prevent="btnTouchStart"
              @touchmove="btnTouchMove"
              @touchend="btnTouchEnd"
              :style="{ transform: `translateX(${width})` }"
              class="progress-btn"
            ></div>
          </div>
          <div class="allTime">{{ currentPlayingSong.dt | formatTime }}</div>
        </div>
        <div class="operators">
          <div v-waves class="mode" @click="updatePlayMode">
            <i v-show="mode === 0" class="iconfont icon-danquxunhuan"></i>
            <i v-show="mode === 1" class="iconfont icon-xunhuanbofang"></i>
          </div>
          <div v-waves class="pre" @click="prev">
            <i class="iconfont icon-shangyishou_huaban"></i>
          </div>
          <div v-waves class="status" @click="_updateSongStatus">
            <i
              v-show="songStatus === 'playing'"
              class="iconfont icon-24gf-pauseCircle"
            ></i>
            <i
              v-show="songStatus === 'paused'"
              class="iconfont icon-24gf-playCircle"
            ></i>
          </div>
          <div v-waves class="next" @click="next">
            <i class="iconfont icon-xiayishou_huaban"></i>
          </div>
          <div v-waves class="favo">
            <i class="iconfont icon-fabulous"></i>
          </div>
        </div>
      </div>
    </div>

    <div
      v-waves
      @click="playerMode = 0"
      class="mini-player"
      v-show="currentPlayingSong && playerMode === 1"
    >
      <div class="left">
        <img
          :class="{ playing: songStatus === 'playing' }"
          :src="currentPlayingSong.picUrl"
          alt=""
        />
        <div class="left-con">
          <span>{{ currentPlayingSong.name }}</span>
          <span>{{ cureentlyric.content }}</span>
        </div>
      </div>
      <div class="right">
        <div class="status" @click.stop="_updateSongStatus">
          <i
            v-show="songStatus === 'playing'"
            class="iconfont icon-24gf-pauseCircle"
          ></i>
          <i
            v-show="songStatus === 'paused'"
            class="iconfont icon-24gf-playCircle"
          ></i>
        </div>
        <div class="all-list" @click.stop="showAllList">
          <i class="iconfont icon-elipsis"></i>
        </div>
      </div>
    </div>
    <audio
      ref="audio"
      @timeupdate="timeupdate"
      @ended="ended"
      @playing="ready"
    ></audio>
    <loading loadingType="fullscreen" v-if="loading" />
  </div>
</template>

<script>
import Scroll from "@/components/Scroll";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Player",
  data() {
    return {
      touch: {},
      btnTouch: {},
      // 当前时间
      currentTime: 0,
      // 当前进度条
      width: 0,
      mode: 0, //0 单曲循环 1 循环播放
      loading: false,
      cureentlyric: { content: "", index: -1 },
      playerMode: 0, // 0 全屏 1 迷你
    };
  },
  computed: {
    ...mapState(["playList"]),
    ...mapGetters(["currentPlayingSong"]),
    lyric() {
      if (!this.currentPlayingSong.lyric) {
        return [];
      }
      return this.currentPlayingSong.lyric
        .split("\n")
        .filter((item) => item)
        .map((item) => {
          try {
            let [time, content] = item.split("]");
            time = time.slice(1);
            time = time.split(":");
            time =
              Number(time[0]) * 60 * 1000 +
              Number(time[1].split(".")[0]) * 1000 +
              Number(time[1].split(".")[1]);
            return {
              time,
              content,
            };
          } catch (error) {
            return {
              content: item,
            };
          }
        })
        .filter((item) => item.content);
    },
    songStatus() {
      return this.currentPlayingSong.status;
    },
  },
  components: {
    Scroll,
  },
  methods: {
    showAllList() {},
    getCureentlyric(currentTime) {
      let cureentlyric = {};
      if (this.lyric.length === 0) {
        cureentlyric = { content: "", index: -1 };
      }
      for (let i = 1; i < this.lyric.length; i++) {
        const pre = this.lyric[i - 1];
        const nex = this.lyric[i];
        if (currentTime >= pre.time && currentTime < nex.time) {
          cureentlyric = { content: pre.content, index: i - 1 };
        }
        if (pre.time === undefined) {
          cureentlyric = { content: "该歌词暂不支持滚动", index: -1 };
          break;
        }
      }
      if (this.lyric.length !== 0 && !cureentlyric.content) {
        cureentlyric = {
          content: this.lyric[this.lyric.length - 1].content,
          index: this.lyric.length - 1,
        };
      }
      return cureentlyric;
    },
    middleTouchStart(e) {
      // 记录起始坐标
      const touch = e.touches[0];
      this.touch.startX = touch.clientX;
      this.touch.startY = touch.clientY;
      this.touch.startTime = Date.now();
      this.touch.clientRect = this.$refs["middle-r"].getBoundingClientRect();
      this.$refs["middle-l"].style.transition = "none";
      this.$refs["middle-r"].style.transition = "none";
    },
    middleTouchMove(e) {
      // 记录结束坐标
      const { clientX, clientY } = e.touches[0];
      const deltaX = clientX - this.touch.startX;
      const deltaY = clientY - this.touch.startY;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 修改位置
        let lastLeft = this.touch.clientRect.left + deltaX;
        if (lastLeft < 0) {
          lastLeft = 0;
        } else if (lastLeft > this.touch.clientRect.width) {
          lastLeft = this.touch.clientRect.width;
        }
        this.$refs["middle-r"].style.left = lastLeft + "px";
        // 修改透明度
        const clientRect = this.$refs["middle-r"].getBoundingClientRect();
        this.$refs["middle-l"].style.opacity =
          clientRect.left / clientRect.width;
      }
    },
    middleTouchEnd() {
      // 获取最新 left 值
      let { left, width } = this.$refs["middle-r"].getBoundingClientRect();
      if (left === 0 || left === width) {
        return;
      }
      const t = Date.now() - this.touch.startTime;
      const s = left - this.touch.clientRect.left;
      const v = s / t;
      if (Math.abs(v) > 1 / 2) {
        if (v < 0) {
          this.$refs["middle-r"].style.left = 0 + "px";
          this.$refs["middle-l"].style.opacity = 0;
        } else {
          this.$refs["middle-r"].style.left = width + "px";
          this.$refs["middle-l"].style.opacity = 1;
        }
      } else {
        if (width - left >= width / 2) {
          this.$refs["middle-r"].style.left = 0 + "px";
          this.$refs["middle-l"].style.opacity = 0;
        } else {
          this.$refs["middle-r"].style.left = width + "px";
          this.$refs["middle-l"].style.opacity = 1;
        }
      }
      this.$refs["middle-r"].style.transition = "left .3s";
      this.$refs["middle-l"].style.transition = "opacity .3s";
      this.touch = {};
    },
    progressClick(e) {
      const { left, width } = this.$refs.progress.getBoundingClientRect();
      let offsetW = e.clientX - left;
      if (offsetW < 0) {
        offsetW = 0;
      }
      if (offsetW > width) {
        offsetW = width;
      }
      this.currentTime = (offsetW / width) * this.currentPlayingSong.dt;
      this.$refs.audio.currentTime = this.currentTime / 1000;
    },
    btnTouchStart(e) {
      const touch = e.touches[0];
      this.btnTouch.startX = touch.clientX;
      this.btnTouch.startWidth = parseFloat(this.width);
    },
    btnTouchMove(e) {
      const touch = e.touches[0];
      const offsetX = touch.clientX - this.btnTouch.startX;
      let offsetW = this.btnTouch.startWidth + offsetX;
      if (offsetW < 0) {
        offsetW = 0;
      }
      let width = this.$refs.progress.getBoundingClientRect().width;
      if (offsetW > width) {
        offsetW = width;
      }
      this.currentTime = (offsetW / width) * this.currentPlayingSong.dt;
      this.$refs.audio.currentTime = this.currentTime / 1000;
    },
    btnTouchEnd() {
      this.btnTouch = {};
    },
    timeupdate(e) {
      this.currentTime = e.target.currentTime * 1000;
    },
    ended() {
      if (this.mode === 0) {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      } else {
        this.next();
      }
    },
    _updateSongStatus() {
      this.$store.dispatch("updateSongStatus").then((status) => {
        if (status === "playing") {
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
        }
      });
    },
    updatePlayMode() {
      this.mode = this.mode === 0 ? 1 : 0;
      this.$toast(this.mode === 0 ? "单曲循环" : "循环播放");
    },
    next() {
      this.loading = true;
      this.$refs.audio.pause();
      this.$store.dispatch("nextSong", "next");
    },
    prev() {
      this.loading = true;
      this.$refs.audio.pause();
      this.$store.dispatch("nextSong", "prev");
    },
    ready() {
      this.loading = false;
    },
    lyricToCenter(index) {
      // 歌词 top
      const top1 = this.$refs.p[index].getBoundingClientRect().top;
      const { top, height } = this.$refs.scroll.$el.getBoundingClientRect();
      let offsetY = height / 2 + top - top1;
      offsetY += this.$refs.scroll.scroll.y;
      if (offsetY > 0) {
        offsetY = 0;
      }
      const maxSY = this.$refs.contents.getBoundingClientRect().height - height;
      if (maxSY <= 0) {
        return;
      }
      if (offsetY < -maxSY) {
        offsetY = -maxSY;
      }
      this.$refs.scroll.scrollTo(0, offsetY, 1000);
    },
  },
  watch: {
    "currentPlayingSong.url"(url) {
      this.$refs.audio.src = url;
      this.$refs.audio.play();
    },
    currentTime(currentTime) {
      this.cureentlyric = this.getCureentlyric(currentTime);
      this.$nextTick(() => {
        const width = this.$refs.progress.getBoundingClientRect().width;
        this.width = (currentTime / this.currentPlayingSong.dt) * width + "px";
      });
    },
    "cureentlyric.index"(index) {
      this.lyricToCenter(index);
    },
  },
  filters: {
    formatTime: function (time) {
      const date = new Date(time);
      const min = date.getMinutes();
      const sec = date.getSeconds();
      return `${min}:${sec.toString().length === 1 ? "0" + sec : sec}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.mini-player {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.3);
  height: 60px;

  .left {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      animation: rotate 20s linear infinite;
      animation-play-state: paused;
      &.playing {
        animation-play-state: running;
      }
    }
    .left-con {
      display: flex;
      height: 40px;
      width: 200px;
      flex-direction: column;
      justify-content: space-around;
      padding-left: 10px;
      font-size: 12px;
      line-height: 12px;
      overflow: hidden;
      white-space: nowrap;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        &:last-child {
          color: #999;
        }
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .status {
      margin-right: 10px;
      .iconfont {
        font-size: 30px;
        line-height: 30px;
      }
    }
    .all-list {
      .iconfont {
        font-size: 30px;
        line-height: 30px;
      }
    }
  }
}

.full-player {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #333;
  .background {
    position: absolute;
    z-index: -1;
    width: 200%;
    height: 200%;
    left: -50%;
    top: -50%;
    overflow: hidden;
    filter: blur(50px);
    opacity: 0.6;
    img {
      position: absolute;
      height: 100%;
      left: calc(100vw / 2);
      transform: translateX(-50%);
    }
  }

  .top {
    display: flex;
    align-items: center;
    color: #fff;
    height: 42px;
    flex: none;
    .left,
    .right {
      flex-shrink: 0;
      height: 42px;
      width: 42px;
      text-align: center;
      line-height: 42px;
      transform: rotate(180deg);
      .iconfont {
        font-size: 20px;
      }
    }
    .center {
      flex: 1;
      text-align: center;
      font-size: 16px;
      overflow: hidden;
      span {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .singer-name {
    text-align: center;
    color: #fff;
    font-size: 12px;
    margin-bottom: 45px;
  }

  .middle {
    position: relative;
    flex: 1;
    overflow: hidden;
    .middle-l {
      opacity: 1;
      .cd {
        margin: auto;
        width: 225px;
        height: 225px;
        img {
          display: block;
          width: 100%;
          border-radius: 50%;
          animation: rotate 20s linear infinite;
          animation-play-state: paused;
          &.playing {
            animation-play-state: running;
          }
        }
      }
      .lyric {
        text-align: center;
        color: #fff;
        font-size: 14px;
        margin-top: 45px;
      }
    }
    .middle-r {
      position: absolute;
      top: 0;
      left: 100vw;
      width: 100%;
      height: 100%;
      text-align: center;
      color: hsla(0, 0%, 100%, 0.6);
      font-size: 12px;
      line-height: 24px;
      p {
        &.current {
          color: #fff;
        }
      }
    }
  }

  .footer {
    flex: none;
    height: 140px;
    .progress-wrapper {
      margin: 15px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 300px;
      .cureentTime,
      .allTime {
        flex: none;
        width: 30px;
        height: 30px;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        color: #fff;
      }
      .progress {
        position: relative;
        flex: 1;
        height: 4px;
        background-color: hsla(0, 0%, 100%, 0.6);
        margin: 0 10px;
        .current-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 4px;
          background-color: $primary-color;
        }
        .progress-btn {
          position: absolute;
          top: -6px;
          left: -6px;
          z-index: 1;
          width: 10px;
          height: 10px;
          background-color: $primary-color;
          border: 3px solid #fff;
          border-radius: 50%;
        }
      }
    }
    .operators {
      display: flex;
      margin: auto;
      width: 280px;
      justify-content: space-between;
      div {
        display: flex;
        width: 40px;
        height: 40px;
        .iconfont {
          margin: auto;
          font-size: 40px;
          line-height: 40px;
          color: hsla(0, 0%, 100%, 0.6);
        }
        &.mode,
        &.favo {
          .iconfont {
            font-size: 20px;
            line-height: 20px;
          }
        }
        &.pre,
        &.next {
          .iconfont {
            font-size: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
audio {
  display: none;
}
</style>
