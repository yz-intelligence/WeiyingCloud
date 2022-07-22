<template>
  <div class="form-wrap">
    <form-title title="更改密码" />
    <el-form ref="form" class="form-main" :model="form" :rules="rules">
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="form.password"
          autocomplete="new-password"
          placeholder="密码"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="passwordCheck">
        <el-input
          type="password"
          v-model="form.passwordCheck"
          autocomplete="new-password"
          placeholder="确认密码"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-button class="form-button form-button--long" type="primary" :loading="loading" @click="onSubmit"
        >更改密码</el-button
      >
    </el-form>
  </div>
</template>
<script>
import { apiResetPassword } from '@/apis/login'
import { passwordValidate } from '@/utils/formValidate'
import auth from '@/mixins/auth'
export default {
  name: 'ForgotPassword',
  mixins: [auth],
  data() {
    const validatePass = (key = 'passwordCheck', ref) => {
      return (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
          return false
        }
        if (!passwordValidate(value)) {
          callback(new Error('密码必须含有大、小写字母、数字、特殊符号中的任意三种'))
          return false
        }
        if (this.form[key] !== '') {
          // 对第二个密码框单独验证
          this.$refs.form.validateField(key)
        }
        callback()
      }
    }
    const validatePassCheck = (key = 'password') => {
      return (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form[key]) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
    return {
      form: {
        password: '',
        passwordCheck: ''
      },
      rules: {
        password: [
          {
            type: 'string',
            min: 8,
            max: 18,
            message: '密码长度必须为8-18位',
            trigger: 'blur'
          },
          { validator: validatePass(), trigger: 'blur' }
        ],
        passwordCheck: { validator: validatePassCheck(), trigger: 'blur' }
      }
    }
  },
  methods: {
    //登录
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { token } = this.$route.params
          this.loading = true
          const { success, desc } = await apiResetPassword(token, this.form.password)
          this.loading = false
          if (success) {
            this.$Message.success('密码重置成功，请重新登录！')
            setTimeout(() => {
              this.$router.replace('/login')
            }, 500)
          } else {
            if (desc === '链接超时') {
              this.$emit('reset-error')
              return false
            }
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
  margin: 20px 0;
}
</style>
