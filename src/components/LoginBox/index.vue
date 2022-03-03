<template>
  <div class="login-box">
    <form @submit.prevent="login" method="post">
      <div class="phone">
        <label for="phone">手机号</label>
        <input type="text" v-model="phone" id="phone" placeholder="手机号" />
      </div>
      <div class="password">
        <label for="passowrd">密码</label>
        <input
          type="password"
          v-model="password"
          id="password"
          placeholder="密码"
        />
      </div>
      <button type="submit">{{ tip }}</button>
    </form>
  </div>
</template>

<script>
import { validatePhone, validatePassword } from "@/util/regexp";

export default {
  name: "LoginBox",
  data() {
    return {
      phone: "",
      password: "",
      tip: "登录",
    };
  },
  methods: {
    login() {
      let { phone, password } = this;
      if (!validatePhone(phone)) {
        this.$toast("手机号格式错误");
        return;
      }
      if (!validatePassword(password)) {
        this.$toast("密码格式错误");
        return;
      }
      this.tip = "登录中";
      this.$store
        .dispatch("login", { phone, password })
        .then(
          () => {
            this.$toast("登录成功");
            this.$router.push("/");
          },
          () => {
            this.$toast("登录失败");
          }
        )
        .finally(() => {
          this.tip = "登录";
          this.phone = "";
          this.password = "";
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.login-box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.3);
  form {
    display: flex;
    flex-direction: column;
    padding: 25px;
    div {
      position: relative;
      display: flex;
      flex-direction: column;
      input {
        box-sizing: border-box;
        padding: 0;
        border: none;
        width: 100%;
        outline: none;
        font-size: 14px;
        line-height: 14px;
        padding: 5px 30px;
        background-color: transparent;
        border-bottom: 2px solid $primary-color;
        color: #999;
      }
      &::before {
        content: "\e670";
        position: absolute;
        bottom: 6px;
        left: 7px;
        font-family: "iconfont";
        line-height: 16px;
        font-size: 16px;
      }
      &.password {
        margin-top: 25px;
      }
    }
    button {
      margin-top: 25px;
      align-self: center;
      width: 250px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid $primary-color;
      border-radius: 20px;
      font-size: 14px;
      background-color: $primary-color;
      color: #fff;
      box-sizing: border-box;
    }
  }
}
</style>
