<template>
  <div class="main">
    <scroll :data="rankList" :scrollEnd="scrollEnd">
      <div>
        <ul class="rank-list" ref="rankList">
          <rank-item
            :rank="rank"
            :index="index"
            ref="item"
            v-for="(rank, index) in rankList"
            :key="rank.id"
            @click.native="toRankList(rank.id)"
          />
        </ul>
        <loading v-if="!rankList.length" />
      </div>
    </scroll>
    <router-view />
  </div>
</template>

<script>
import Scroll from "../../components/Scroll";
import RankItem from "../../components/RankItem";
import { reqRankList, reqPlaylist } from "../../api/rank";

export default {
  name: "Rank",
  data() {
    return {
      rankList: [],
      rankEls: [],
    };
  },
  components: {
    Scroll,
    RankItem,
  },
  mounted() {
    this._reqRankList();
  },
  methods: {
    async _reqRankList() {
      const { list } = await reqRankList();
      list.forEach((item, index) => {
        this.rankEls.push({
          id: item.id,
          index,
        });
      });
      this.rankList = list;
      this.$nextTick(() => {
        this.scrollEnd();
      });
    },
    async _reqPlaylist(id, index) {
      const { playlist } = await reqPlaylist(id);
      this.rankList[index].tracks = playlist.tracks.slice(0, 3);
    },
    scrollEnd() {
      for (let i = 0; i < this.rankEls.length; i++) {
        const { id, index } = this.rankEls[i];
        const el = this.$refs.item[index].$el;
        const top = el.getBoundingClientRect().top;
        // 可视区域
        if (top < document.documentElement.clientHeight && top > 0) {
          this._reqPlaylist(id, index);
          this.rankEls.splice(i, 1);
          i--;
        }
      }
    },
    toRankList(id) {
      this.$router.push({ name: "RankList", params: { id } });
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
}
</style>
