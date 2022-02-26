<template>
  <div class="layout">
    <my-header />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <my-nav />
  </div>
</template>

<script>
import MyHeader from "../components/Header";
import MyNav from "../components/Nav";

export default {
  name: "Layout",
  components: {
    MyHeader,
    MyNav,
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
