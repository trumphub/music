<template>
  <div class="main">
    <scroll>
      <div>
        <swiper v-if="bannerList.length" :list="bannerList" />
      </div>
    </scroll>
    <loading v-if="loading" />
  </div>
</template>

<script>
import Scroll from "../../components/Scroll";
import Swiper from "../../components/Swiper";
import { reqBannerList } from "../../api/home";

export default {
  name: "Home",
  components: {
    Scroll,
    Swiper,
  },
  data() {
    return {
      bannerList: [],
      loading: true,
    };
  },
  created() {
    this._reqBannerList();
  },
  methods: {
    async _reqBannerList() {
      const { banners } = await reqBannerList();
      this.bannerList = banners;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
