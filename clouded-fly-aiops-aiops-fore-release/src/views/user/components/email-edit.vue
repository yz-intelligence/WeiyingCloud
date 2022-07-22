<template>
  <el-dialog
    :width="'640px'"
    title="修改邮箱"
    :visible.sync="editVisible"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-steps :active="active" finish-status="success" class="email">
      <el-step class="step" title="验证身份"></el-step>
      <el-step class="step" title="绑定邮箱"></el-step>
      <el-step title="绑定完成"></el-step>
    </el-steps>
    <!-- 验证身份 -->
    <el-form ref="form" :rules="formRule" :model="form" class="email-content" v-if="active === 0">
      <el-form-item>
        <el-input placeholder="请输入内容" v-model="form.email" disabled>
          <template slot="prepend">绑定邮箱</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="email-content-code">
          <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
          <el-input v-show="showTimeout" class="input" :placeholder="`${time}s`" :disabled="true"></el-input>
          <el-button v-show="!showTimeout" class="button" :loading="codeLoading" @click="getCode">获取验证码</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="email-next">
          <el-button type="primary" class="email-next-button" :loading="nextLoading" @click="next">下一步</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 绑定邮箱 -->
    <el-form ref="form" key="step2" :rules="formRule" :model="form" class="email-content" v-if="active === 1">
      <el-form-item prop="email">
        <el-input placeholder="请输入内容" v-model.trim="form.email"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="email-content-code">
          <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
          <el-input v-show="showTimeout" class="input" :placeholder="`${time}s`" :disabled="true"></el-input>
          <el-button v-show="!showTimeout" class="button" :loading="codeLoading" @click="checkEmailUsed"
            >获取验证码</el-button
          >
        </div>
      </el-form-item>
      <el-form-item>
        <div class="email-next">
          <el-button type="primary" class="email-next-button" @click="next">下一步</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 绑定成功 -->
    <el-form class="email-content" style="height: 164px; margin-top: 38px" v-if="active === 2">
      <el-form-item>
        <h1>绑定新邮箱成功</h1>
      </el-form-item>
      <el-form-item>
        <div class="email-next">
          <el-button type="primary" class="email-next-button" @click="close">关闭页面</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { apiCheckEmail } from '@/apis/login'
import { apiSendMailVerifyCode, apiVerifyCode, apiReviseEmail } from '@/apis/user'
import { mapGetters } from 'vuex'
export default {
  name: 'EmailEdit',
  props: {
    visible: Boolean,
    email: {
      type: String,
      default: 'sb@yongchao.com'
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  data() {
    const validatorEmail = async (rule, value, callback) => {
      const { success, desc } = await apiCheckEmail(value)
      if (success) {
        callback()
      } else {
        callback(new Error('邮箱已被占用'))
      }
    }
    const validatorCode = (rule, value, callback) => {
      if (this.codeError) {
        callback(new Error(this.errorMessage || '验证码错误，请重新获取验证码'))
        return
      }
      callback()
    }
    const timeOut = null
    return {
      editVisible: this.visible,
      active: 0,
      form: {
        email: this.email,
        code: ''
      },
      formRule: {
        email: [
          { message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
          { validator: validatorEmail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { validator: validatorCode, trigger: 'blur' }
        ]
      },
      // 验证码错误
      codeError: false,
      errorMessage: '',
      // 获取验证码loading
      codeLoading: false,
      // 下一步loding
      nextLoading: false,
      // 倒计时时间
      time: 60,
      // 显示倒计时
      showTimeout: false
    }
  },
  beforeDestroy() {
    clearInterval(this.timeOut)
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    // 下一步
    next() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const checkFn = this.active ? this.checkoutNewEmail : this.checkoutOldEmail
          if (!(await checkFn())) {
            this.$refs.form.validateField('code')
            this.codeError = false
            return
          }
          if (this.active++ > 2) this.active = 3
          this.reset()
        }
      })
    },
    // 初始化所有data
    reset() {
      this.form = {
        email: '',
        code: ''
      }
      this.codeError = false
      clearInterval(this.timeOut)
      this.time = 60
      this.showTimeout = false
    },
    // 判断邮箱是否被占用
    checkEmailUsed() {
      // 判断邮箱是否被占用
      this.$refs.form.validateField('email', mes => {
        // mes为空说明没报错
        if (!mes) {
          this.getCode()
        }
      })
    },
    // 获取验证码
    async getCode() {
      // 获取验证码
      this.codeLoading = true
      const data = {
        email: this.form.email,
        userId: this.user.id
      }
      const { success, desc } = await apiSendMailVerifyCode(data)
      if (success) {
        this.$Message.success('发送成功')
        this.showTimeout = true
        this.timeOut = setInterval(() => {
          if (!this.time--) {
            this.time = 60
            this.showTimeout = false
            clearInterval(this.timeOut)
          }
        }, 1000)
      } else {
        desc && this.$Message.error(desc)
      }
      this.codeLoading = false
    },
    // 验证原邮箱
    async checkoutOldEmail() {
      this.nextLoading = true
      const { success, desc } = await apiVerifyCode(this.form)
      this.nextLoading = false
      this.codeError = !success
      this.errorMessage = desc
      return success
    },
    // 验证新邮箱
    async checkoutNewEmail() {
      this.nextLoading = true
      const { success, desc } = await apiReviseEmail(this.form)
      this.nextLoading = false
      this.errorMessage = desc
      if (success) {
        this.codeError = false
        return true
      } else {
        if (desc === '修改失败,邮箱已被占用') {
          return false
        }
        this.codeError = true
        return false
      }
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  }
}
</script>
<style lang="scss" scoped>
.email {
  &::v-deep .el-step__main {
    position: relative;
    bottom: 31px;
    left: 32px;
  }
  &::v-deep .el-step__line {
    left: 110px;
    width: 50%;
  }
  &::v-deep .el-step__head.is-process {
    color: #0076ff;
    border-color: #0076ff;
  }
  &::v-deep .el-step__title.is-process {
    color: #0076ff;
  }
  .step {
    flex-basis: 42% !important;
  }
  &-content {
    width: 50%;
    margin: 10px auto;
    height: 192px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 9px;
    &-code {
      display: flex;
    }
    .button {
      margin-left: 12px;
    }
    .input {
      width: 80px;
      margin-left: 12px;
      &::v-deep .el-input__inner {
        text-align: center;
      }
    }
    h1 {
      text-align: center;
      font-size: 24px;
    }
  }
  &-next {
    display: flex;
    width: 100%;
    &-button {
      width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
