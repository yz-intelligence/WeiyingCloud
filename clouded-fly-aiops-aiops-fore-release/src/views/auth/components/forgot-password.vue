<template>
  <div class="form-wrap">
    <form-title title="重置密码" />
    <el-form ref="form" class="form-main" :model="form" :rules="rules">
      <el-form-item prop="email" class="input">
        <el-input v-model.trim="form.email" placeholder="邮箱" :maxlength="100">
          <i slot="prefix" class="el-input__icon el-icon-message"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="verifyCode" class="input">
        <verify-code action="register/verifyCode" v-model.trim="form.verifyCode" />
      </el-form-item>
      <el-button class="form-button form-button--long" type="primary" :loading="loading" @click="onSubmit"
        >发送重置邮件</el-button
      >
      <div class="form-flex">
        <a class="form-link" @click="changeForm('Login')">返回登录</a>
      </div>
    </el-form>
  </div>
</template>
<script>
import { apiSendForgetPassword } from '@/apis/login'
import auth from '@/mixins/auth'
import VerifyCode from './verify-code.vue'
export default {
  name: 'ForgotPassword',
  components: {
    VerifyCode
  },
  mixins: [auth],
  data() {
    return {
      verifyCode: '',
      form: {
        email: '',
        verifyCode: ''
      },
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //提交表单
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { email, verifyCode = '' } = this.form
          const params = {
            email,
            verifyCode: verifyCode.toUpperCase()
          }
          const { success, desc } = await apiSendForgetPassword(params)
          this.loading = false
          if (success) {
            // 重置发送成功，通知auth页面显示结果
            this.$emit('success')
          } else {
            desc === '验证码错误' && this.$refs.verifyCode.changeVerifyCode()
            desc && this.$Message.error(desc)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import './auth.scss';
.form-button {
  margin: 4px 0 16px 0;
}
.input {
  margin-bottom: 44px;
}
</style>
