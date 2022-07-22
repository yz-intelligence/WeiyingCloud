<template>
  <AuthResult :config="config" />
</template>

<script>
import { apiVerifyEmail } from '@/apis/login'
import AuthResult from './components/result/index.vue'
export default {
  components: {
    AuthResult
  },
  data() {
    return {
      config: {
        icon: 'el-icon-loading',
        iconColor: '#0076FF',
        title: '邮箱验证中,请稍等...',
        content: '',
        buttonText: ''
      }
    }
  },
  async created() {
    const { verifyId } = this.$route.params
    const { success, desc } = await apiVerifyEmail(verifyId)
    if (success) {
      this.config = {
        icon: 'el-icon-success',
        iconColor: '',
        title: desc,
        content: '',
        buttonText: '立即登录',
        routeName: 'Login'
      }
    } else {
      desc &&
        (this.config = {
          icon: 'el-icon-error',
          iconColor: '#E85254',
          title: '验证邮件已过期，请重新注册',
          content: '',
          buttonText: '重新注册',
          routeName: 'Register'
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
