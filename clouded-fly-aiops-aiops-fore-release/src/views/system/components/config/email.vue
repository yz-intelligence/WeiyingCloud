<template>
  <div class="page" v-loading="loading">
    <config-title v-model="isEdit" title="邮箱发送设置" @change="changeEdit"></config-title>
    <div class="page-content">
      <el-form :model="form" size="small" ref="form" label-width="110px" class="config-form" id="config_form_email">
        <el-form-item label="smtp服务器">
          <span v-show="!isEdit" class="config-form-text">{{ form.hostName || '无' }}</span>
          <el-input
            v-show="isEdit"
            autocomplete="off"
            :maxlength="100"
            v-model.trim="form.hostName"
            placeholder="smtp服务器"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="smtp端口">
          <span v-show="!isEdit" class="config-form-text">{{ form.port || '无' }}</span>
          <el-input
            v-show="isEdit"
            type="number"
            autocomplete="off"
            :maxlength="100"
            v-model.trim="form.port"
            placeholder="smtp端口"
            :controls="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="smtp账号">
          <span v-show="!isEdit" class="config-form-text">{{ form.userName || '无' }}</span>
          <el-input
            v-show="isEdit"
            autocomplete="off"
            :maxlength="100"
            v-model.trim="form.userName"
            placeholder="smtp账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="smtp密码">
          <span v-show="!isEdit" class="config-form-text">{{ form.password ? '***' : '无' }}</span>
          <el-input
            v-show="isEdit"
            :maxlength="100"
            show-password
            v-model.trim="form.password"
            autocomplete="new-password"
            placeholder="smtp密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="SSL加密">
          <span v-show="!isEdit" class="config-form-text">{{ form.ssl === true ? '是' : '否' }}</span>
          <el-switch v-show="isEdit" v-model="form.ssl"></el-switch>
        </el-form-item>
      </el-form>
      <div v-show="isEdit" class="config-actions">
        <el-tooltip content="收件人是您本人" placement="top">
          <el-button type="primary" size="small" plain icon="el-icon-s-promotion" @click="testEmailServer"
            >测试发送</el-button
          >
        </el-tooltip>
        <el-button v-show="config.value" size="small" @click="resetEmail">恢复默认</el-button>
        <el-button type="primary" size="small" icon="el-icon-s-promotion" @click="saveForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetCompanyConfig, apiTestEmailServer, apiDeleteConfig, apiSaveConfig } from '@/apis/config'
import ConfigTitle from './title'
export default {
  name: 'ConfigEmail',
  components: {
    ConfigTitle
  },
  data() {
    this.defaultForm = {
      usable: false,
      hostName: '',
      port: null,
      userName: '',
      password: '',
      ssl: false
    }
    return {
      isEdit: false,
      loading: false,
      isTested: false, // 是否发送测试
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
      const { success, rows, desc } = await apiGetCompanyConfig('EmailServer')
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
      if (edited) {
        this.isTested = false
        return false
      }
      const { value } = this.config
      // 没有设置时恢复初始化
      this.form = value ? JSON.parse(value) : { ...this.defaultForm }
    },
    // 测试邮件发送
    async testEmailServer() {
      const { success, desc } = await apiTestEmailServer(this.form)
      if (success) {
        this.isTested = true
        this.$Message.success(desc)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 保存表单
    saveForm() {
      const { name, id } = this.config
      const param = {
        id: id || '',
        name: name || 'EmailServer',
        type: 'EmailServer',
        value: JSON.stringify(this.form)
      }

      // 保存到服务器
      const saveFn = async () => {
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
      // 未测试保存提示是否测试
      if (!this.isTested) {
        // this.$confirm('邮件设置未经过测试是否保存？', '提示', {
        //   confirmButtonText: '立即测试',
        //   cancelButtonText: '继续保存',
        //   distinguishCancelAndClose: true,
        //   type: 'warning',
        //   callback: action => {
        //     switch (action) {
        //       case 'confirm':
        //         this.testEmailServer()
        //         break
        //       case 'cancel':
        //         saveFn()
        //         break
        //       default:
        //         this.changeEdit()
        //         this.isEdit = false
        //     }
        //   }
        // })
        this.$customMessageBox(this, '提示', '邮件设置未经过测试是否保存？', 'warning', {
          confirmButtonText: '立即测试',
          cancelButtonText: '继续保存',
          distinguishCancelAndClose: true,
          callback: action => {
            switch (action) {
              case 'confirm':
                this.testEmailServer()
                break
              case 'cancel':
                saveFn()
                break
              default:
                this.changeEdit()
                this.isEdit = false
            }
          }
        })
      } else {
        saveFn()
      }
    },
    // 重置邮箱发送设置
    async resetEmail() {
      const { id } = this.config
      if (!id) return false
      const { success, desc } = await apiDeleteConfig(id)
      if (success) {
        this.$Message.success('恢复默认成功')
        this.isEdit = false
        this.emailConfig = {}
        this.getConfig()
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
