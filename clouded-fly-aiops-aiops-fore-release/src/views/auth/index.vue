<template>
  <auth-wrap>
    <!-- 根据当前路由渲染对应表单 -->
    <template>
      <component
        :is="currentRouteName"
        @success="submitSuccess"
        @activeSuccess="activeSuccess"
        @reset-error="resetError"
      ></component>
    </template>
    <!-- 结果页面 -->
    <template v-slot:result>
      <!-- 重置成功 -->
      <auth-result v-if="isShowResult" :config="resultConfig" />
    </template>
  </auth-wrap>
</template>
<script>
import AuthWrap from './components/wrap'
import Login from './components/login'
import AuthResult from './components/result/index'
import Register from './components/register'
import ForgotPassword from './components/forgot-password'
import PasswordReset from './components/reset-password'
import QCloudPerfect from './components/qcloud-perfect'
import UserInvite from './components/user-invite'
import PreOrder from './components/pre-order'
export default {
  name: 'AuthIndex',
  components: {
    Login,
    Register,
    AuthWrap,
    UserInvite,
    AuthResult,
    QCloudPerfect,
    PasswordReset,
    ForgotPassword,
    PreOrder
  },
  data() {
    return {
      currentRouteName: '', // 当前路由name
      isShowResult: false, // 是否显示结果页面
      resultConfig: {} // 结果页面数据
    }
  },
  watch: {
    // 监听路由切换，设置当前路由name
    '$route.name': {
      handler(val) {
        this.isShowResult = false
        this.currentRouteName = val
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 注册 or 重置 成功,email不存在则为重置
     * @param { string } email 邮箱
     */
    submitSuccess(email) {
      if (email) {
        this.resultConfig = {
          title: '恭喜，您已注册成功',
          content: `您注册维鹰云的账户为：<span style="color: #0076FF">${email}</span>，您可以使用此账户享受维鹰云的服务。账户激活邮件已发送到您的邮箱，有效期为1小时，请尽快登录邮箱激活！`
        }
      }
      this.isShowResult = true
    },
    /**
     * 激活成功
     * @param { string } email 邮箱
     */
    activeSuccess(email) {
      this.resultConfig = {
        title: '恭喜，您已激活成功',
        content: `您激活维鹰云的账户为：<span style="color: #0076FF">${email}</span>，您可以使用此账户享受维鹰云的服务。请登录账号体验！`
      }
      this.isShowResult = true
    },
    // 重置链接失效
    resetError() {
      this.resultConfig = {
        title: '',
        content: `/(ToT)/~~邮件已过期，请重新重置密码`,
        buttonText: '点击重置密码',
        routeName: 'ForgotPassword'
      }
      this.isShowResult = true
    }
  }
}
</script>
