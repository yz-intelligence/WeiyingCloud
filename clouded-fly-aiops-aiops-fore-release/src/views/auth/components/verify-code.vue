<template>
  <div class="form-verify form-flex">
    <el-input :value="value" placeholder="请输入验证码" :maxlength="4" @input="handleInput" clearable> </el-input>
    <img class="form-verify-icon" :src="codePath" title="刷新验证码" @click="changeVerifyCode" />
  </div>
</template>

<script>
export default {
  name: 'VeryfyCode',
  props: {
    value: {
      type: String,
      default: ''
    },
    action: {
      // 验证码链接
      type: String,
      default: ''
    }
  },
  data() {
    return {
      codePath: ''
    }
  },
  mounted() {
    this.changeVerifyCode()
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },
    changeVerifyCode() {
      this.codePath = `${location.origin}${process.env.VUE_APP_API_BASE}${this.action}?t=${Date.now()}`
    }
  }
}
</script>

<style lang="scss" scoped>
.form-verify-icon {
  margin-left: 20px;
  width: 120px;
  height: 40px;
}
</style>
