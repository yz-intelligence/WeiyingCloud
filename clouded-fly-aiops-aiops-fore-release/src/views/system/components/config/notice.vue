<template>
  <div class="page" v-loading="loading">
    <config-title v-model="isEdit" title="延迟发送通知配置" @change="changeEdit"></config-title>
    <div class="page-content">
      <el-form :model="form" size="small" ref="form" label-width="110px" class="config-form" id="config_form_notice">
        <el-form-item label="延迟推送">
          <div class="notice-status">
            <span v-show="!isEdit" class="config-form-text">{{ form.state === true ? '开启' : '关闭' }}</span>
            <el-switch v-show="isEdit" v-model="form.state"></el-switch>
            <el-tooltip effect="dark" placement="top-start" trigger="hover" :offset="50">
              <i class="cursor tips el-icon-tip"></i>
              <div slot="content">
                <div class="tooltips">
                  <div>告警在设置时间内恢复，不发送通知信息</div>
                </div>
              </div>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item label="延迟推送时间">
          <span v-show="!isEdit" class="config-form-text">{{ delayTime || '无' }}</span>
          <el-select v-show="isEdit" class="config-form-input" v-model="form.number" placeholder="请选择">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-show="isEdit" class="config-actions">
        <el-button type="primary" size="small" @click="saveForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetCompanyConfig, apiSaveConfig } from '@/apis/config'
import ConfigTitle from './title'
const options = [
  { label: '1秒', value: 1 },
  { label: '2秒', value: 2 },
  { label: '3秒', value: 3 },
  { label: '5秒', value: 5 },
  { label: '10秒', value: 10 },
  { label: '30秒', value: 30 },
  { label: '60秒', value: 60 },
  { label: '3分钟', value: 180 },
  { label: '5分钟', value: 300 }
]
export default {
  name: 'ConfigNotice',
  components: {
    ConfigTitle
  },
  data() {
    this.defaultForm = {
      number: 60,
      state: true
    }
    return {
      isEdit: false,
      loading: false,
      isTested: false, // 是否发送测试
      config: {}, // 表单设置
      options,
      form: { ...this.defaultForm }
    }
  },
  created() {
    this.getConfig()
  },
  computed: {
    delayTime() {
      const option = options.find(item => item.value === this.form.number)
      return option?.label
    }
  },
  methods: {
    // 获取设置
    async getConfig() {
      this.loading = true
      const { success, rows, desc } = await apiGetCompanyConfig('DelayedSending')
      this.loading = false
      if (success) {
        this.config = rows.length ? rows[0] : {}
      } else {
        desc && this.$Message.error(desc)
      }
      const { value } = this.config
      // 没有设置时恢复初始化
      this.form = value ? JSON.parse(value) : { ...this.defaultForm }
    },
    //切换编辑状态
    changeEdit(edited) {
      if (edited) return false
      const { value } = this.config
      // 没有设置时恢复初始化
      this.form = value ? JSON.parse(value) : { ...this.defaultForm }
    },

    // 保存表单
    async saveForm() {
      const { name, id } = this.config
      const param = {
        id: id || '',
        name: name || 'DelayedSending',
        type: 'DelayedSending',
        value: JSON.stringify(this.form)
      }
      // 保存到服务器
      this.loading = true
      const { success, desc, data } = await apiSaveConfig(param)
      this.loading = false
      if (success) {
        this.$Message.success('保存成功，配置将在一分钟后生效')
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
  .cursor {
    cursor: pointer;
  }
  .tips {
    width: 14px;
    height: 14px;
    position: relative !important;
    left: 4px;
    color: #8c8c8c;
  }
  .tooltips {
    max-width: 232px;
    padding: 5px 10px 3px;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 18px;
  }
}
.config {
  &-form {
    width: 500px;
    &::v-deep .el-form-item__label {
      text-align: left;
      color: #8c8c8c;
    }
    &-input {
      width: 140px;
    }
  }
  &-actions {
    @include flex;
    margin: 30px 0 24px;
  }
}
.notice-status {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
