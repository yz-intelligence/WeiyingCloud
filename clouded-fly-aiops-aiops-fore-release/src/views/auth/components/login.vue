<template>
  <div class="form-wrap">
    <form-title />
    <el-form ref="form" class="form-main" :model="form" :rules="rules">
      <el-form-item prop="loginName" class="input">
        <el-input id="login_input_account" v-model="form.loginName" placeholder="账号/邮箱" :maxlength="100">
          <i slot="prefix" class="el-input__icon el-icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="input">
        <el-input
          id="login_input_password"
          type="password"
          v-model="form.password"
          placeholder="密码"
          :maxlength="100"
          @keyup.enter.native="onSubmit"
        >
          <i slot="prefix" class="el-input__icon el-icon-lock"></i>
        </el-input>
      </el-form-item>
      <el-form-item v-if="isNeedVerify" prop="verifyCode">
        <verify-code ref="verifyCode" action="login/verifyCode" v-model="form.verifyCode" />
      </el-form-item>
      <!-- <div class="form-flex">
        <a id="login_a_forgetpassword" class="form-link" @click="changeForm('ForgotPassword')">忘记密码</a>
      </div> -->
      <el-button
        id="login_button_login"
        class="form-button form-button--long"
        type="primary"
        :loading="loading"
        @click="onSubmit"
        >登录</el-button
      >
      <div class="form-flex">
        <div>
          <a id="login_a_register" class="form-link" @click="changeForm('Register')">立即注册</a>
        </div>
        <a id="login_a_forgetpassword" class="form-link" @click="changeForm('ForgotPassword')">忘记密码</a>
      </div>
    </el-form>
  </div>
</template>
<script>
import auth from '@/mixins/auth'
import VerifyCode from './verify-code.vue'
import { emailValidate } from '@/utils/formValidate'
export default {
  name: 'AuthLogin',
  components: {
    VerifyCode
  },
  mixins: [auth],
  data() {
    const validateAcount = (rule, value, callback) => {
      // 判断账号是否符号邮箱或者千帆生成账号
      const qcloudReg = /^(qcloud)(\d{14})$/
      if (emailValidate(value) || qcloudReg.test(value)) {
        callback()
      } else {
        callback(new Error('账号不符合规则'))
      }
    }
    return {
      isNeedVerify: false, // 是否需要验证码
      form: {
        loginName: '',
        password: '',
        verifyCode: undefined
      },
      rules: {
        loginName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: validateAcount, message: '账号不符合规则', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        verifyCode: [{ required: true, message: '本次登录需要验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //登录
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { success, desc, data } = await this.$store.dispatch('user/login', { ...this.form })
          this.loading = false
          if (success) {
            this.$router.push({
              path: '/home'
            })
          } else {
            // 登录失败超过5次，需要输入验证码
            this.isNeedVerify && this.$refs.verifyCode.changeVerifyCode()
            data && data.verifyCode && (this.isNeedVerify = true)
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
