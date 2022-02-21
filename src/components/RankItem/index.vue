<template>
  <li class="rank-item">
    <img v-lazy="rank.coverImgUrl" alt="" />
    <ul class="rank-song" v-if="rank.tracks">
      <li
        v-for="(song, index) in rank.tracks"
        :key="song.id"
        class="rank-song-item"
      >
        <span>{{ index + 1 }}.</span>
        <span v-text="song.name"></span>
      </li>
    </ul>
    <div v-else class="rank-song loading">
      <loading />
    </div>
  </li>
</template>

<script>
export default {
  name: "RankItem",
  props: {
    rank: {
      type: Object,
      require: true,
    },
    index: {
      type: Number,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
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
    &.loading {
      justify-content: center;
      align-items: center;
    }
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
</style>
