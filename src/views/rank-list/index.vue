<template>
  <list
    :backgroundImage="backgroundImage"
    :title="title"
    :list="list"
    :loading="loading"
  >
    <template v-slot="{ song, $index }">
      <div class="left">{{ $index + 1 }}</div>
      <div class="right">
        <span>{{ song.name }}</span>
        <span>{{ song.singer }}</span>
      </div>
    </template>
  </list>
</template>

<script>
import list from "@/mixins/list";

export default {
  name: "RankList",
  mixins: [list],
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

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
</style>
