<template>
  <div v-show="!!playList.length">
    <!-- 全屏 -->
    <div class="full-player" v-if="currentPlayingSong">
      <!-- 背景 -->
      <div class="background">
        <img :src="currentPlayingSong.picUrl" alt="" />
      </div>
      <!-- 头部 -->
      <div class="top">
        <div class="left">
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
              :class="{ playing: currentPlayingSong.status === 'playing' }"
              :src="currentPlayingSong.picUrl"
              alt=""
            />
          </div>
          <!-- 歌词 -->
          <div class="lyric">
            <span>{{ cureentlyric }}</span>
          </div>
        </div>
        <div class="middle-r" ref="middle-r">
          <Scroll :data="lyric">
            <div>
              <p v-for="(item, index) in lyric" :key="index">
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
          <div class="progress" ref="progress">
            <div :style="{ width }" class="current-progress"></div>
            <div
              :style="{ transform: `translateX(${width})` }"
              class="progress-btn"
            ></div>
          </div>
          <div class="allTime">{{ currentPlayingSong.dt | formatTime }}</div>
        </div>
        <div class="operators">
          <div class="mode">
            <i class="iconfont icon-danquxunhuan"></i>
            <!-- <i class="iconfont icon-bofang-suijibofang"></i> -->
            <!-- <i class="iconfont icon-xunhuanbofang"></i> -->
          </div>
          <div class="pre">
            <i class="iconfont icon-shangyishou_huaban"></i>
          </div>
          <div class="status">
            <i class="iconfont icon-24gf-playCircle"></i>
            <!-- <i class="iconfont icon-24gf-pauseCircle"></i> -->
          </div>
          <div class="next">
            <i class="iconfont icon-xiayishou_huaban"></i>
          </div>
          <div class="favo">
            <i class="iconfont icon-fabulous"></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audio" @timeupdate="timeupdate"></audio>
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
      currentTime: 0,
      width: 0,
    };
  },
  computed: {
    ...mapState(["playList"]),
    ...mapGetters(["currentPlayingSong"]),
    lyric() {
      if (!this.currentPlayingSong) {
        return [];
      }
      return this.currentPlayingSong.lyric
        .split("\n")
        .filter((item) => item)
        .map((item) => {
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
        });
    },
    cureentlyric() {
      let cureentlyric;
      if (this.lyric.length === 0) {
        cureentlyric = "";
      }
      for (let i = 1; i < this.lyric.length; i++) {
        const pre = this.lyric[i - 1];
        const nex = this.lyric[i];
        if (this.currentTime >= pre.time && this.currentTime < nex.time) {
          cureentlyric = pre.content;
        }
      }
      return cureentlyric;
    },
  },
  components: {
    Scroll,
  },
  methods: {
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
    timeupdate(e) {
      this.currentTime = e.target.currentTime * 1000;
    },
  },
  watch: {
    currentPlayingSong: {
      deep: true,
      handler(currentPlayingSong) {
        this.$refs.audio.src = currentPlayingSong.url;
        this.$refs.audio.play();
      },
    },
    currentTime(currentTime) {
      this.$nextTick(() => {
        const width = this.$refs.progress.getBoundingClientRect().width;
        this.width = (currentTime / this.currentPlayingSong.dt) * width + "px";
      });
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
