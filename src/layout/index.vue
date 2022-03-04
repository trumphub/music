<template>
  <div class="layout">
    <my-header @show="open" />
    <router-view />
    <my-nav />
    <!-- 用户中心 -->
    <user-info v-if="showUserInfo" @close="close" />
  </div>
</template>

<script>
import MyHeader from "../components/Header";
import MyNav from "../components/Nav";
import UserInfo from "@/components/UserInfo";

export default {
  name: "Layout",
  components: {
    MyHeader,
    MyNav,
    UserInfo,
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
