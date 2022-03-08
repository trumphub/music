<template>
  <div class="screen">
    <!-- logo -->
    <div class="top">
      <img src="https://y.qq.com/mediastyle/mod/mobile/img/logo.svg" alt="" />
      <span>网易云音乐</span>
    </div>
    <!-- operation -->
    <div class="bottom">
      <button class="login" @click="login" v-waves>登录</button>
      <button class="register" @click="register" v-waves>注册</button>
      <span @click="$router.replace('/')">游客试用</span>
    </div>
    <div class="mask" @click.self="hideBox" v-show="!!currentComponent"></div>
    <transition name="fade">
      <component :is="currentComponent" />
    </transition>
  </div>
</template>

<script>
import LoginBox from "@/components/LoginBox";
import RegisterBox from "@/components/RegisterBox";

export default {
  name: "Login",
  components: {
    LoginBox,
    RegisterBox,
  },
  data() {
    return {
      currentComponent: "",
    };
  },
  methods: {
    login() {
      this.currentComponent = "LoginBox";
    },
    register() {
      this.currentComponent = "RegisterBox";
    },
    hideBox() {
      this.currentComponent = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.screen {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: calc(100vh / 8) 0;
  background-color: #fff;
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 100px;
      height: 100px;
    }
    span {
      margin-top: 20px;
      letter-spacing: 5px;
      font-size: 20px;
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    button {
      width: 250px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid $primary-color;
      border-radius: 20px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .login {
      background-color: $primary-color;
      color: #fff;
    }
    .register {
      margin-top: 10px;
      background-color: #fff;
      color: $primary-color;
    }
    span {
      letter-spacing: 2px;
      text-align: center;
      margin-top: 5px;
      font-size: 12px;
      text-decoration: underline;
      color: #666;
    }
  }

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
