<template>
  <transition appear>
    <div class="search-container">
      <!-- header -->
      <div class="back-header">
        <div class="back">
          <i class="iconfont icon-arrow-right" @click="$router.back()"></i>
        </div>
        <span>搜索页面</span>
      </div>
      <!-- input -->
      <div class="input">
        <input type="text" @input="search" />
      </div>
      <!-- result -->
      <div class="result-wrap">
        <Scroll
          :data="songs"
          :pullUpLoad="true"
          :pullingUpHandler="pullingUpHandler"
        >
          <div>
            <ul>
              <li
                v-waves
                v-for="song in songs"
                :key="song.id"
                @click="handleItemClick(songs, song)"
              >
                <span class="name">{{ song.name }}</span>
                <span class="singer">{{ song.singer }}</span>
              </li>
            </ul>
            <div class="nulData" v-if="nulData">暂无数据</div>
            <loading v-if="loading" />
          </div>
        </Scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/components/Scroll";
import debounce from "lodash/debounce";
import { reqSearch } from "@/api/search";

export default {
  name: "Search",
  data() {
    return {
      loading: false,
      keywords: "",
      pageNow: 1,
      songs: [],
      pageCount: 0,
      nulData: false,
    };
  },
  components: {
    Scroll,
  },
  methods: {
    search: debounce(function (e) {
      if (e.target.value.trim()) {
        this.keywords = e.target.value;
        this.pageNow = 1;
        this.loading = true;
        this.nulData = false;
        this.songs = [];
        this.getData();
      } else {
        this.songs = [];
        this.loading = false;
        this.nulData = false;
      }
    }, 1000),
    async getData() {
      const {
        result: { songs, songCount },
      } = await reqSearch(this.keywords, this.pageNow);
      if (songCount > 0) {
        // 有结果 默认每页 30 条
        this.pageCount = Math.ceil(songCount / 30);
        this.loading = this.pageCount !== this.pageNow;
        this.songs = [
          ...this.songs,
          ...songs.map((song) => ({
            id: song.id,
            name: song.al.name,
            singer: song.ar.map((item) => item.name).join(" / "),
            picUrl: song.al.picUrl,
            dt: song.dt,
            status: "stoped",
          })),
        ];
      } else {
        this.loading = false;
        this.nulData = true;
      }
    },
    async pullingUpHandler() {
      if (this.loading) {
        this.pageNow += 1;
        await this.getData();
      }
    },
    handleItemClick(list, song) {
      this.$store.dispatch("addToPlayList", { list, song });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.search-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .back-header {
    display: flex;
    background-color: $primary-color;
    .back {
      display: flex;
      width: 42px;
      height: 42px;
      .iconfont {
        margin: auto;
        font-size: 20px;
        color: #fff;
        transform: rotate(180deg);
        font-weight: bold;
      }
    }
    span {
      flex: 1;
      margin-right: 42px;
      text-align: center;
      line-height: 42px;
      color: #fff;
      letter-spacing: 2px;
    }
  }

  .input {
    position: relative;
    margin: 20px;
    box-sizing: border-box;
    border-bottom: 2px solid $primary-color;
    &::before {
      content: "\e67d";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10px;
      font-family: "iconfont";
      line-height: 16px;
      font-size: 16px;
    }
    input {
      border: none;
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 10px 36px;
      outline: none;
    }
  }

  .result-wrap {
    flex: 1;
    padding-bottom: 20px;
    overflow: hidden;
    li {
      display: flex;
      padding: 5px 20px;
      white-space: nowrap;
      .name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 20px;
      }
      .singer {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .nulData {
      text-align: center;
    }
  }
}
</style>
