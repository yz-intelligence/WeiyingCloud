<template>
  <div class="page" v-loading="loading">
    <config-title v-model="isEdit" title="无主接收人设置" @change="changeEdit"></config-title>
    <div class="page-content">
      <div class="config-text">
        <span v-show="!isEdit" class="config-form-text">{{ userNames.length ? userNames.join('，') : '无' }}</span>
      </div>
      <div v-show="isEdit" class="config-actions">
        <el-select
          class="config-select"
          v-model="userIds"
          multiple
          size="small"
          filterable
          remote
          :disabled="!isEdit"
          :remote-method="getUsers"
          :loading="loadingUsers"
          placement="top"
          id="config_select_auto"
        >
          <el-option v-for="item in users" :key="item.ID" :label="item.NICKNAME" :value="item.ID" />
        </el-select>
        <el-button size="small" class="config-sms-save" type="primary" @click="saveForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetCompanyConfig, apiSaveConfig } from '@/apis/config'
import { apiSelectUser } from '@/apis/user'
import ConfigTitle from './title'
export default {
  name: 'ConfigAuto',
  components: {
    ConfigTitle
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      loadingUsers: false, // 用户加载
      config: {}, // 表单配置
      users: [],
      userIds: []
    }
  },
  created() {
    this.getConfig()
  },
  computed: {
    userNames() {
      return this.users.filter(item => this.userIds.includes(item.ID)).map(item => item.NICKNAME)
    }
  },
  methods: {
    // 获取配置
    async getConfig() {
      this.loading = true
      const { success, rows, desc } = await apiGetCompanyConfig('UnOwner')
      this.loading = false
      if (success) {
        this.config = rows.length ? rows[0] : {}
        const { value } = this.config
        this.userIds = value ? value.split(',') : []
      } else {
        desc && this.$Message.error(desc)
      }

      const users = await this.getUsers()
      let ids = users.map(item => item.ID)
      let searchUserIds = this.userIds.filter(id => {
        // 如果现有的用户列表里没有则去查询
        return !ids.includes(id)
      })
      if (searchUserIds.length) {
        const selectUsers = await apiSelectUser({ ids: searchUserIds.join(',') })
        if (selectUsers.success) {
          this.users = [...this.users, ...selectUsers.data]
        }
      }
    },
    //切换编辑状态
    changeEdit(edited) {
      if (edited) return
      const { value } = this.config
      this.userIds = value ? value.split(',') : []
    },
    // 保存表单
    async saveForm() {
      const { id, name } = this.config
      const param = {
        id: id || '',
        name: name || 'UnOwner',
        type: 'UnOwner',
        value: this.userIds.join(',')
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
    },
    async getUsers(search, ids) {
      this.loadingUsers = true
      const param = {
        search,
        ids
      }
      const { success, data, desc } = await apiSelectUser(param)
      this.loadingUsers = false
      if (success) {
        this.users = data
      } else {
        desc && this.$Message.error(desc)
      }
      return data || []
    }
  }
}
</script>

<style lang="scss" scoped>
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
  }
  &-sms-save {
    margin-left: 16px;
  }
  &-select {
    width: 100%;
  }
}
</style>
