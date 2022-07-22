<template>
  <div class="form-wrap">
    <form-title title="预约产品演示" />
    <el-form ref="form" class="form-main" :model="form" :rules="rules">
      <el-form-item prop="company">
        <el-input
          id="preorder_input_company"
          v-model.trim="form.company"
          autocomplete="off"
          placeholder="请输入公司名称"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          id="preorder_input_name"
          v-model.trim="form.name"
          autocomplete="off"
          placeholder="请输入联系人姓名"
          :maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          id="preorder_input_phone"
          v-model="form.phone"
          autocomplete="off"
          placeholder="请填写联系人电话"
          :maxlength="11"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="interestTopics">
        <el-select
          v-model="form.interestTopics"
          placeholder="请选择感兴趣的主题"
          class="preorder-form-input"
          popper-class="preorder-form-select"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-button
        id="preorder_input_submit"
        class="form-button form-button--long"
        type="primary"
        :loading="loading"
        @click="onSubmit"
        >提交预约</el-button
      >
    </el-form>
  </div>
</template>
<script>
import { apiSubmitBooking } from '@/apis/login'
import { validateEmpty } from '@/utils/formValidate'
import auth from '@/mixins/auth'
export default {
  name: 'PreOrder',
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
        phone: '',
        company: '',
        interestTopics: null
      },
      options: [
        {
          value: 1,
          label: '维鹰云CMDB'
        },
        {
          value: 2,
          label: '维鹰云应用行为分析'
        }
      ],
      rules: {
        company: [{ validator: validateEmpty('公司名称不能为空'), trigger: 'blur' }],
        name: [{ validator: validateEmpty('姓名不能为空'), trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        interestTopics: [{ required: true, message: '请选择感兴趣的主题', trigger: 'change' }]
      }
    }
  },
  methods: {
    //提交
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { ...params } = { ...this.form }
          params.name = params.name.trim()
          params.company = params.company.trim()
          const { success, desc } = await apiSubmitBooking(params)
          this.loading = false
          if (success) {
            this.$Message.success('预约成功')
            this.$refs.form.resetFields()
            // this.$emit('activeSuccess', email)
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
.preorder-form-input {
  width: 100%;
}
.preorder-form-select {
  .el-select-dropdown__item {
    color: #666666;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    color: #ffffff;
    background-color: #0076ff;
  }
}
</style>
