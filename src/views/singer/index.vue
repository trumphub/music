<template>
  <div class="main">
    <scroll
      ref="listview"
      :data="list"
      :scrolling="true"
      :probeType="3"
      @scroll="scroll"
    >
      <!-- 列表展示 -->
      <ul>
        <li ref="listGroup" v-for="(item, index) in list" :key="index">
          <h2>{{ item.key }}</h2>
          <ul class="list">
            <li v-for="child in item.items" :key="child.id">
              <img v-lazy="child.avatar" alt="" />
              <span>{{ child.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- 右侧指示 -->
      <div class="keyList-wrapper" v-if="keyList.length > 0">
        <ul
          ref="keyContainer"
          @touchstart.stop="scrollToElement"
          @touchmove.stop="scrollToElement"
          class="keyList"
        >
          <li
            :class="{ current: currentIndex === index }"
            v-for="(key, index) in keyList"
            :key="key"
          >
            {{ key }}
          </li>
        </ul>
      </div>
      <!-- 标题固定 -->
      <div class="title-fixed" ref="fixed">
        <span>{{ title }}</span>
      </div>
      <loading v-if="!list.length" />
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/Scroll";
import { reqSingers } from "@/api/singer";
import Pinyin from "pinyin";

export default {
  name: "Singer",
  data() {
    return {
      list: [],
      currentIndex: 0,
      keyList: [],
      listHeight: [0],
      scrollY: 0,
    };
  },
  watch: {
    scrollY(y) {
      for (let i = 1; i < this.listHeight.length; i++) {
        const start = -this.listHeight[i - 1];
        const end = -this.listHeight[i];
        const _start = end + this.fixedHeight;
        if (y > end && y <= start) {
          this.currentIndex = i - 1;
        }
        if (y > 0) {
          this.$refs.fixed.style.display = "none";
        } else {
          this.$refs.fixed.style.display = "block";
        }
        if (y <= _start && y >= end) {
          this.$refs.fixed.style.transform = `translate3d(0,${y - _start}px,0)`;
        }
      }
    },
    currentIndex() {
      this.$refs.fixed.style.transform = `translate3d(0,0,0)`;
    },
  },
  computed: {
    title() {
      return this.keyList[this.currentIndex];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const { artists } = await reqSingers();
      this.list = this.normalizeSinger(artists);
      this.keyList = this.list.map((item) => item.key);
      this.$nextTick(() => {
        this.calculateHeight();
        const keyContainer = this.$refs.keyContainer;
        this._top = keyContainer.getBoundingClientRect().top;
        this._height = keyContainer.getElementsByTagName("li")[0].offsetHeight;
        this.fixedHeight = this.$refs.fixed.offsetHeight;
      });
    },
    normalizeSinger(list) {
      const res = [];
      const obj = {};
      const avatar =
        "https://p4.music.126.net/HsTQ9vYrCFVTs5jc-RBTww==/109951166271655834.jpg";
      for (let i = 0; i < list.length; i++) {
        const { id, name } = list[i];
        let key = Pinyin(name, {
          style: Pinyin.STYLE_FIRST_LETTER,
        })[0][0].toUpperCase();
        if (key.length > 1) {
          key = key[0];
        }
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          res.find((item) => item.key === key).items.push({ id, name, avatar });
        } else {
          obj[key] = true;
          res.push({
            key,
            items: [{ id, name, avatar }],
          });
        }
      }
      res.sort((a, b) => a.key.charCodeAt(0) - b.key.charCodeAt(0));
      res.unshift({
        key: "热门",
        items: list.slice(0, 10).map((item) => ({
          id: item.id,
          name: item.name,
          avatar,
        })),
      });
      return res;
    },
    scroll({ y }) {
      this.scrollY = y;
    },
    calculateHeight() {
      let height = 0;
      for (let i = 0; i < this.$refs.listGroup.length; i++) {
        height += this.$refs.listGroup[i].offsetHeight;
        this.listHeight.push(height);
      }
    },
    scrollToElement(event) {
      const clientY = event.targetTouches[0].clientY;
      let idx = (clientY - this._top) / this._height;
      idx = Math.floor(idx);
      if (idx < 0) {
        idx = 0;
      }
      if (idx > this.keyList.length - 1) {
        idx = this.keyList.length - 1;
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[idx], 1000);
    },
  },
  components: {
    Scroll,
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.loading-container {
  margin-top: 50px;
}

h2 {
  height: 25px;
  text-align: center;
  line-height: 25px;
  background-color: #e4e4e4;
  font-size: 12px;
  color: #fff;
}

.list {
  padding: 0 5px;
  li {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #e4e4e4;
    img {
      width: 50px;
      height: 50px;
      border-radius: 5px;
    }
    span {
      padding-left: 20px;
      color: #424242;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}

.keyList-wrapper {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 5px;
  background: #e4e4e4;
  padding: 20px 5px;
  border-radius: 20px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  .keyList {
    li {
      color: #fff;
      font-size: 12px;
      text-align: center;
      &.current {
        color: $primary-color;
      }
    }
  }
}

.title-fixed {
  position: absolute;
  top: 44px;
  left: 0;
  width: 100%;
  background-color: #e4e4e4;
  font-size: 12px;
  color: #fff;
  text-align: center;
  line-height: 25px;
}
</style>
