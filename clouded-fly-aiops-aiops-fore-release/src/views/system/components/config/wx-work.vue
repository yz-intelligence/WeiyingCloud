<template>
  <div class="page" v-loading="loading">
    <config-title v-model="isEdit" title="企业微信信息设置" @change="changeEdit"></config-title>
    <div class="page-content">
      <el-form :model="form" size="small" ref="form" label-width="110px" class="config-form" id="config_form_wx">
        <el-form-item label="企业id">
          <span v-show="!isEdit" class="config-form-text">{{ form.corpid || '无' }}</span>
          <el-input
            v-show="isEdit"
            autocomplete="off"
            :maxlength="100"
            v-model.trim="form.corpid"
            placeholder="企业id"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密钥">
          <span v-show="!isEdit" class="config-form-text">{{ form.providerSecret ? '***' : '无' }}</span>
          <el-input
            v-show="isEdit"
            :maxlength="100"
            show-password
            v-model.trim="form.providerSecret"
            autocomplete="new-password"
            placeholder="密钥"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用id">
          <span v-show="!isEdit" class="config-form-text">{{ form.agentId || '无' }}</span>
          <el-input
            v-show="isEdit"
            autocomplete="off"
            :maxlength="100"
            v-model.trim="form.agentId"
            placeholder="应用id"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div v-show="isEdit" class="config-actions">
        <el-button size="small" type="primary" @click="saveForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetCompanyConfig, apiCreateWxWorkConfig, apiSaveConfig } from '@/apis/config'
import ConfigTitle from './title'
export default {
  name: 'ConfigWxWork',
  components: {
    ConfigTitle
  },
  data() {
    this.defaultForm = {
      corpid: '',
      providerSecret: '',
      agentId: ''
    }
    return {
      isEdit: false,
      loading: false,
      config: {}, // 表单设置
      form: { ...this.defaultForm }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    // 获取设置
    async getConfig() {
      this.loading = true
      const { success, rows, desc } = await apiGetCompanyConfig('WEIXIN')
      this.loading = false
      if (success) {
        this.config = rows.length ? rows[0] : {}
      } else {
        desc && this.$Message.error(desc)
      }
      const { value } = this.config
      // 没有设置时恢复初始化
      value && (this.form = JSON.parse(value))
    },
    //切换编辑状态
    changeEdit(edited) {
      if (edited) return
      const { value } = this.config
      // 没有设置时恢复初始化
      this.form = value ? JSON.parse(value) : { ...this.defaultForm }
    },
    // 保存表单
    async saveForm() {
      const { id, name } = this.config
      const param = {
        id: id || '',
        name: name || 'WEIXIN',
        type: 'WEIXIN',
        value: JSON.stringify(this.form)
      }
      const saveFn = id ? apiSaveConfig : apiCreateWxWorkConfig
      // 保存到服务器
      this.loading = true
      const { success, desc, data } = await saveFn(param)
      this.loading = false
      if (success) {
        this.$Message.success('保存成功')
        this.config = data
        this.isEdit = false
      } else {
        desc && this.$Message.error(desc)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 10px;
  padding: 0;
  &-content {
    padding: 24px 24px 6px;
  }
}
.config {
  &-form {
    width: 500px;
    &::v-deep .el-form-item__label {
      text-align: left;
      color: #8c8c8c;
    }
  }
  &-actions {
    @include flex;
    margin: 30px 0 24px;
  }
}
</style>
