<template>
  <div class="form-wrap">
    <form-title title="完善个人信息" />
    <el-form ref="form" class="form-main" :model="form" :rules="rules">
      <el-form-item class="form-item">
        <div class="invite-form--email">
          <span>您的登录账号为：</span>
          <span>{{ decodeURI($route.query.email) }}</span>
        </div>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="form.nickname" autocomplete="off" placeholder="姓名" :maxlength="100"> </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="form.phone" autocomplete="off" placeholder="手机" :maxlength="11"> </el-input>
      </el-form-item>
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

      <div class="form-flex">
        <el-button class="form-button form-button--long" type="primary" :loading="loading" @click="onSubmit"
          >确定</el-button
        >
        <a class="form-link" @click="$router.push('/login')">使用已有账号登录</a>
      </div>
    </el-form>
  </div>
</template>
<script>
import { apiActiveInvitedUser } from '@/apis/login'
import { passwordValidate, validateEmpty } from '@/utils/formValidate'
import auth from '@/mixins/auth'
export default {
  name: 'UserInvite',
  mixins: [auth],
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!/^1[345789]\d{9}$/.test(value)) {
        callback(new Error('手机号码格式不正确!'))
      } else {
        callback()
      }
    }
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
      loading: false,
      form: {
        password: '',
        passwordCheck: '',
        nickname: '',
        phone: ''
      },
      rules: {
        nickname: [{ validator: validateEmpty('姓名不能为空'), trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
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
    //激活
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { token } = this.$route.params
          const email = this.$route.query.email
          this.loading = true
          // 取passwordCheck外所有参数
          const { passwordCheck, ...params } = { ...this.form }
          params.nickname = params.nickname.trim()
          const { success, desc } = await apiActiveInvitedUser(token, params)
          this.loading = false
          if (success) {
            this.$Message.success('激活成功，请登录！')
            this.$emit('activeSuccess', email)
          } else {
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
.form {
  &-main {
    padding: 10px 44px 24px;
  }
  &-item {
    margin-bottom: 14px;
  }
  &-button {
    width: 176px;
  }
  &-flex {
    padding-bottom: 8px;
  }
}
.invite-form--email {
  color: #333;
  :last-child {
    color: #e74b43;
  }
}
.login-bottom--nosign {
  display: flex;
  justify-content: flex-end;
  color: #0076ff;
  &:hover {
    cursor: pointer;
  }
}
</style>
