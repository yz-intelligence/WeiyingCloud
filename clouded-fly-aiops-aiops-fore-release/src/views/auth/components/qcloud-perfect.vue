<template>
  <div class="form-wrap">
    <form-title title="完善信息" />
    <el-form ref="form" class="form-main" :model="form" :rules="rules">
      <el-form-item prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="名称" :maxlength="100"> </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model.trim="form.email" autocomplete="off" placeholder="邮箱" :maxlength="100"> </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model.trim="form.phone" autocomplete="off" placeholder="手机" :maxlength="11"> </el-input>
      </el-form-item>
      <el-button class="form-button form-button--long" type="primary" :loading="loading" @click="onSubmit"
        >确定</el-button
      >
    </el-form>
  </div>
</template>
<script>
import { apiPerfectInfo } from '@/apis/login'
import auth from '@/mixins/auth'
import { validateEmpty } from '@/utils/formValidate'
export default {
  name: 'QCloudPerfect',
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
    return {
      loading: false,
      form: {
        name: '',
        email: '',
        phone: ''
      },
      rules: {
        name: [{ validator: validateEmpty('名称不能为空'), trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        email: [
          {
            required: true,
            type: 'email',
            message: '邮箱格式错误',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //激活
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          params.name = params.name.trim()
          const { success, desc } = await apiPerfectInfo(params)
          this.loading = false
          if (success) {
            this.$Message.success('完善信息成功,即将跳转至首页。')
            await this.$store.dispatch('user/getUserInfo')
            this.$router.push('/home')
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
.form-button {
  margin: 20px 0;
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
