<template>
  <div class="form-wrap">
    <form-title title="注册维鹰云账号" />
    <el-form ref="form" class="form-main" :model="form" :rules="rules">
      <!-- 2021/11/10 隐藏tab，默认企业 -->
      <!-- <div class="form-tabs">
        <el-tabs id="register_tab_switch" v-model="form.userType" stretch @tab-click="changeRegType">
          <el-tab-pane label="个人" name="PERSON"></el-tab-pane>
          <el-tab-pane label="企业" name="COMPANY"></el-tab-pane>
        </el-tabs>
      </div> -->
      <el-form-item prop="nickname" v-if="form.userType !== 'COMPANY'">
        <el-input
          id="register_input_nickname"
          v-model="form.nickname"
          placeholder="姓名"
          autocomplete="off"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="company" v-if="form.userType === 'COMPANY'">
        <el-input
          id="register_input_company"
          v-model="form.company"
          placeholder="企业名称"
          autocomplete="off"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <!-- 2021/11/10配合隐藏个人，改成邮箱 -->
        <!-- <el-input
          id="register_input_email"
          v-model.trim="form.email"
          :placeholder="form.userType === 'COMPANY' ? '企业邮箱' : '邮箱'"
          :maxlength="100"
          autocomplete="off"
        > -->
        <el-input
          id="register_input_email"
          v-model.trim="form.email"
          placeholder="邮箱"
          :maxlength="100"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          id="register_input_phone"
          v-model.trim="form.phone"
          autocomplete="off"
          placeholder="手机号码"
          :maxlength="11"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          id="register_input_password"
          type="password"
          v-model.trim="form.password"
          autocomplete="new-password"
          placeholder="密码"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="passwordCheck">
        <el-input
          id="register_input_passwordCheck"
          type="password"
          v-model.trim="form.passwordCheck"
          autocomplete="new-password"
          placeholder="确认密码"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>

      <div class="form-flex">
        <el-button id="register_button_register" class="form-button" type="primary" :loading="loading" @click="onSubmit"
          >注册</el-button
        >
        <a id="register_a_login" class="form-link" @click="changeForm()">使用已有账号登录</a>
      </div>
    </el-form>
  </div>
</template>
<script>
import { apiDoRegister, apiCheckEmail } from '@/apis/login'
import { passwordValidate, validateEmpty } from '@/utils/formValidate'
import auth from '@/mixins/auth'
export default {
  name: 'AuthRegister',
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
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!/^1[345789]\d{9}$/.test(value)) {
        callback(new Error('手机号码格式不正确!'))
      } else {
        callback()
      }
    }

    const validateEmail = async (rule, value, callback) => {
      const { success, desc } = await apiCheckEmail(value)
      if (success) {
        callback()
      } else {
        const errmsg = desc || '邮箱校验失败'
        callback(new Error(errmsg))
      }
    }
    return {
      form: {
        email: '',
        password: '',
        passwordCheck: '',
        nickname: '',
        phone: '',
        userType: 'COMPANY', // 用户类型 个人PERSON|企业COMPANY
        company: '' // 公司名称
      },
      rules: {
        company: [{ validator: validateEmpty('企业名称不能为空'), trigger: 'blur' }],
        nickname: [{ validator: validateEmpty('姓名不能为空'), trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
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
    //注册
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { userType, company } = this.form

          // 取passwordCheck外所有参数
          const { passwordCheck, ...params } = { ...this.form }
          // 企业注册时，设置默认用户名
          params.nickname = userType === 'COMPANY' ? company.trim() + '管理员' : params.nickname.trim()
          const { success, desc } = await apiDoRegister(params)
          this.loading = false
          if (success) {
            // 注册成功，通知auth页面显示结果
            this.$emit('success', this.form.email)
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    changeRegType({ name }) {
      this.form.userType = name
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './auth.scss';
.form-main {
  // 2021/11/10配合隐藏tab，修改padding
  // padding: 11px 44px 40px;
  padding: 24px 44px 32px;
  &::v-deep .el-tabs__item {
    font-size: 16px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: $--color-primary;
    }
  }
  &::v-deep .el-tabs__item {
    font-size: 16px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.65);
    &:hover,
    &.is-active {
      color: $--color-primary;
    }
  }
}
.form-flex {
  padding-bottom: 8px;
}
.form-button {
  width: 176px;
}
</style>
