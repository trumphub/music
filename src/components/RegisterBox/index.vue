<template>
  <div class="register-box">
    <form @submit.prevent="_register" method="post">
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
      <div class="nick-name">
        <label for="nick-name">昵称</label>
        <input
          type="text"
          v-model="nickname"
          id="nick-name"
          placeholder="昵称"
        />
      </div>
      <div class="captcha">
        <label for="captcha">验证码</label>
        <input
          type="text"
          v-model="captcha"
          id="captcha"
          placeholder="验证码"
        />
        <span @click="_sendCode">{{ btnText }}</span>
      </div>
      <button type="submit" v-waves>{{ submitText }}</button>
    </form>
  </div>
</template>

<script>
import {
  sendCode,
  checkPhoneExistence,
  checkNickName,
  verifyCode,
  register,
} from "@/api/user";
import {
  validatePhone,
  validatePassword,
  validateNickName,
  validateCode,
} from "@/util/regexp";

export default {
  name: "RegisterBox",
  data() {
    return {
      phone: "",
      password: "",
      nickname: "",
      captcha: "",
      btnText: "发送验证码",
      isClick: true,
      isRegister: true,
      submitText: "注册",
    };
  },
  beforeDestroy() {
    this.timerId && clearInterval(this.timerId);
  },
  methods: {
    async _register() {
      if (!this.isRegister) {
        return;
      }
      this.isRegister = false;
      const { phone, password, nickname, captcha } = this;
      if (!validatePhone(phone)) {
        this.$toast("手机号格式错误");
        this.isRegister = true;
        return;
      }
      if (!validatePassword(password)) {
        this.$toast("密码格式错误");
        this.isRegister = true;
        return;
      }
      if (!validateNickName(nickname)) {
        this.$toast("昵称格式错误");
        this.isRegister = true;
        return;
      }
      if (!validateCode(captcha)) {
        this.$toast("验证码格式错误");
        this.isRegister = true;
        return;
      }
      this.submitText = "注册中";
      const { exist } = await checkPhoneExistence(phone);
      if (exist === 1) {
        this.$toast("手机号已注册");
        this.isRegister = true;
        this.submitText = "注册";
        return;
      }
      const { duplicated } = await checkNickName(nickname);
      if (duplicated) {
        this.$toast("昵称重复");
        this.isRegister = true;
        this.submitText = "注册";
        return;
      }
      try {
        await verifyCode(phone, captcha);
        register({ phone, password, nickname, captcha })
          .then(() => {
            this.$toast("注册成功");
            this.isRegister = true;
            this.submitText = "注册";
          })
          .catch(() => {
            this.$toast("注册失败");
            this.isRegister = true;
            this.submitText = "注册";
          });
      } catch (error) {
        this.$toast("验证码错误");
        this.isRegister = true;
        this.submitText = "注册";
      }
    },
    async _sendCode() {
      if (!this.isClick) {
        return;
      }
      this.isClick = false;
      if (!validatePhone(this.phone)) {
        this.isClick = true;
        this.$toast("手机号格式错误");
        return;
      }
      const { exist } = await checkPhoneExistence(this.phone);
      if (exist === 1) {
        this.isClick = true;
        this.$toast("手机号已注册");
        return;
      }
      try {
        const { data } = await sendCode(this.phone);
        if (data) {
          // ok
          let count = 5;
          this.btnText = `${count} 秒`;
          this.$toast("短信发送成功");
          this.timerId = setInterval(() => {
            count--;
            if (count === 0) {
              this.isClick = true;
              this.btnText = `发送验证码`;
              clearInterval(this.timerId);
            } else {
              this.btnText = `${count} 秒`;
            }
          }, 1000);
        } else {
          this.$toast("短信发送失败");
          this.isClick = true;
        }
      } catch (error) {
        console.log(error);
        this.$toast("短信发送失败");
        this.isClick = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.register-box {
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
      &.password,
      &.nick-name,
      &.captcha {
        margin-top: 25px;
        span {
          position: absolute;
          width: 100px;
          line-height: 16px;
          text-align: center;
          font-size: 14px;
          bottom: 6px;
          right: 0;
          color: $primary-color;
        }
        #captcha {
          padding-right: 120px;
        }
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
