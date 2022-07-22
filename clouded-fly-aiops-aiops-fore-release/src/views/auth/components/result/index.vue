<template>
  <div class="auth-result">
    <div class="banner">
      <img class="banner-icon" draggable="false" src="../../../../assets/images/home/banner.png" alt="" />
    </div>
    <div v-if="options" class="auth-message">
      <i v-if="options.icon" :class="`auth-message-icon ${options.icon}`" :style="{ color: options.iconColor }"></i>
      <p v-if="options.title" class="auth-message-title">{{ options.title }}</p>
      <p v-if="options.content" class="auth-message-content" v-html="options.content"></p>
      <el-button v-if="options.buttonText" class="auth-message-button" type="primary" @click="doLink">{{
        options.buttonText
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthResult',
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    options() {
      const defaultOptions = {
        icon: 'el-icon-success', // icon为空时不显示icon
        title: '重置邮件已发送',
        content:
          '我们已将密码重置邮件发送至您的邮箱，请在<span style="color: #0076FF">10分钟</span>内重置密码。如果您在几分钟内仍未收到邮件，请检查您的垃圾邮件，或者重新发送。', // 支持html
        buttonText: '立即登录', // 空时不显示button
        routeName: 'Login'
      }
      return { ...defaultOptions, ...(this.config || {}) }
    }
  },
  methods: {
    // 路由跳转
    doLink() {
      this.$router.push({ name: this.options.routeName })
    }
  }
}
</script>

<style lang="scss" scoped>
.auth {
  &-result {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background-color: $layout-color;
    .banner {
      position: relative;
      padding-top: 20vw;
      overflow: hidden;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        z-index: 2;
      }
    }
  }

  &-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 13%;
    &-title {
      margin-top: 20px;
      font-size: 36px;
      font-weight: 700;
      color: #333;
    }
    &-content {
      margin-top: 20px;
      font-size: 26px;
      color: rgb(68, 79, 90, 0.7);
    }
    &-icon {
      margin-top: 40px;
      font-size: 100px;
      color: $--color-success;
    }
    &-button {
      margin-top: 20px;
    }
  }
}
</style>
