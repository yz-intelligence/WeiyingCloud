<template>
  <div class="page" v-loading="loading">
    <config-title v-model="isEdit" title="短信接收API地址设置" @change="changeEdit"></config-title>
    <div class="page-content">
      <blockquote v-show="isEdit" class="mt-0 mb-2">
        接口类型：POST&nbsp;&nbsp;接口参数：token(String | 发送成功返回该token)、numbers(String |
        手机号码，多个逗号隔开)、message(String |
        信息内容)&nbsp;&nbsp;接口返回：发送成功返回token，发送失败返回结果(Stirng)
      </blockquote>
      <div class="config-text">
        <span v-show="!isEdit" class="config-form-text">{{ url || '无' }}</span>
      </div>
      <div v-show="isEdit" class="config-actions">
        <el-input
          size="small"
          autocomplete="off"
          :maxlength="100"
          v-model="url"
          placeholder="API地址"
          clearable
          id="config_input_sms"
        ></el-input>
        <el-button size="small" class="config-sms-save" type="primary" @click="saveForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetCompanyConfig, apiSaveConfig } from '@/apis/config'
import ConfigTitle from './title'
export default {
  name: 'ConfigSms',
  components: {
    ConfigTitle
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      config: {}, // 表单配置
      url: ''
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    // 获取配置
    async getConfig() {
      this.loading = true
      const { success, rows, desc } = await apiGetCompanyConfig('SmsApi')
      this.loading = false
      if (success) {
        this.config = rows.length ? rows[0] : {}
        const { value } = this.config
        value && (this.url = value)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //切换编辑状态
    changeEdit(edited) {
      if (edited) return
      const { value } = this.config
      this.url = value || ''
    },
    // 保存表单
    async saveForm() {
      const { id, name } = this.config
      const param = {
        id: id || '',
        name: name || 'SmsApi',
        type: 'SmsApi',
        value: this.url
      }
      // 保存到服务器
      this.loading = true
      const { success, desc, data } = await apiSaveConfig(param)
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
blockquote {
  margin: 0;
  padding: 5px 5px 3px 10px;
  border-left: 4px solid #ddd;
}
.page {
  min-height: 10px;
  padding: 0;
  &-content {
    padding: 24px;
  }
}
.config {
  &-actions {
    @include flex;
    margin-top: 30px;
  }
  &-sms-save {
    margin-left: 16px;
  }
}
</style>
