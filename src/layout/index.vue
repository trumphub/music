<template>
  <div class="layout">
    <my-header
      @show="open"
      @search="$router.push('/search')"
      v-show="$route.path !== '/search'"
    />
    <router-view />
    <my-nav v-show="$route.path !== '/search'" />
    <!-- 用户中心 -->
    <user-info v-if="showUserInfo" @close="close" />
    <!-- 播放器 -->
    <player />
  </div>
</template>

<script>
import MyHeader from "../components/Header";
import MyNav from "../components/Nav";
import UserInfo from "@/components/UserInfo";
import Player from "@/components/Player/index.vue";

export default {
  name: "Layout",
  components: {
    MyHeader,
    MyNav,
    UserInfo,
    Player,
  },
  methods: {
    open() {
      this.showUserInfo = true;
    },
    close() {
      this.showUserInfo = false;
    },
  },
  data() {
    return {
      showUserInfo: false,
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.name === "PlayList" || from.name === "PlayList") {
          return;
        }
        this.close();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
