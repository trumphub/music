<template>
  <transition appear>
    <div class="rec-container">
      <button @click="back" v-waves>提示框</button>
    </div>
  </transition>
</template>

<script>
import ConfirmBox from "@/components/Confirm";

export default {
  name: "Recommend",
  methods: {
    back() {
      ConfirmBox({
        message: "确认返回",
        confirm: () => {
          console.log("confirm");
          this.$router.back();
        },
        cancel: () => {
          console.log("cancel");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.rec-container {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  z-index: 11;
  button {
    margin: auto;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #333;
    background-color: #fff;
  }
}
</style>
