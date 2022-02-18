<template>
  <div class="main">
    <scroll :data="rankList">
      <div>
        <ul class="rank-list">
          <li
            class="rank-item"
            v-for="(rank, index) in rankList"
            :key="rank.id"
          >
            <img
              :data-id="rank.id"
              :data-index="index"
              v-lazy="rank.coverImgUrl"
              alt=""
            />
            <ul class="rank-song">
              <li
                v-for="(song, index) in rank.tracks"
                :key="song.id"
                class="rank-song-item"
              >
                <span>{{ index + 1 }}.</span>
                <span v-text="song.name"></span>
              </li>
            </ul>
          </li>
        </ul>
        <loading v-if="!rankList.length" />
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../components/Scroll";
import { reqRankList, reqPlaylist } from "../../api/rank";

export default {
  name: "Rank",
  data() {
    return {
      rankList: [],
    };
  },
  components: {
    Scroll,
  },
  mounted() {
    this._reqRankList();
    this.$Lazyload.$on("loaded", ({ el }) => {
      const { id, index } = el.dataset;
      this._reqPlaylist(id, index);
    });
  },
  methods: {
    async _reqRankList() {
      const { list } = await reqRankList();
      this.rankList = list;
    },
    async _reqPlaylist(id, index) {
      const { playlist } = await reqPlaylist(id);
      this.rankList[index].tracks = playlist.tracks.slice(0, 3);
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-container {
  margin-top: 50px;
}
.rank-list {
  padding: 20px 10px;
  .rank-item {
    display: flex;
    background-color: #eee;
    margin-top: 20px;
    border-radius: 2px;
    overflow: hidden;
    &:first-child {
      margin-top: 0;
    }
    img {
      width: 100px;
      height: 100px;
    }
    .rank-song {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding: 10px 20px;
      overflow: hidden;
      .rank-song-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        span {
          &:first-child {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
