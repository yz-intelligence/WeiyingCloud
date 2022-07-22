<!-- 邀请用户 -->
<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-main">
        <el-form :model="form" :rules="rules" size="small" ref="form" label-width="auto" class="page-main-form">
          <el-form-item label="新用户邮箱" prop="emails">
            <el-input
              type="textarea"
              class="page-main-input"
              v-model.trim="form.emails"
              show-word-limit
              size="small"
              autocomplete="off"
              :maxlength="1000"
              :autosize="{ minRows: 5, maxRows: 6 }"
              placeholder="多个邮箱请用英文逗号隔开。如test@126.com,test@163.com"
              id="invite_input_email"
            />
          </el-form-item>
          <el-form-item label="用户组" prop="groupId">
            <el-tree-select
              placeholder="请选择用户组"
              class="page-main-input"
              :props="defaultProps"
              :options="groups"
              v-model="form.groupId"
            ></el-tree-select>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleIds">
            <el-select
              v-model="form.roleIds"
              size="small"
              multiple
              placeholder="请选择用户角色"
              class="page-main-input"
              id="invite_select_user"
              filterable
            >
              <el-option v-for="item of roles" :key="item.id" :value="item.id" :label="item.name">{{
                item.name
              }}</el-option>
            </el-select>
          </el-form-item>
          <div class="invite-action">
            <el-button type="primary" size="small" :loading="loading" @click="onSubmit()" id="invite_button_invite"
              >邀请</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetRoles, apiGetGroupTree } from '@/apis/user'
import { apiInvitedUsers } from '@/apis/login'
import elTreeSelect from '@/components/common/treeSelect'
export default {
  components: { elTreeSelect },
  data() {
    const user = this.$store.getters.user
    const validateEmail = (rule, value, callback) => {
      for (let item of value.split(',')) {
        /* eslint-disable no-useless-escape */
        if (
          item &&
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            item
          )
        ) {
          callback(new Error('错误的邮箱格式：' + item))
          break
        }
      }
      callback()
    }
    return {
      loading: false,
      roles: [], // 用户角色
      groups: [], // 用户组
      form: {
        emails: '',
        groupId: '',
        roleIds: []
      },
      groupName: '',
      rules: {
        emails: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      user
    }
  },
  created() {
    this.getRoles()
    this.getGroups()
  },
  methods: {
    // 获取角色
    async getRoles() {
      const { success, desc, rows } = await apiGetRoles()
      if (success) {
        this.roles = rows
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取用户组
    async getGroups() {
      const { success, data, desc } = await apiGetGroupTree(this.user.companyId)
      if (success) {
        this.groups = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 提交邀请
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let data = { ...this.form }
          this.loading = true
          data.roleIds = data.roleIds.join(',')
          const { success, desc } = await apiInvitedUsers(data)
          this.loading = false
          if (success) {
            this.$Message.success('邀请成功')
            this.$refs.form.resetFields()
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
.page-main-input {
  width: 269px;
  &::v-deep .el-select__tags-text {
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.invite-action {
  margin-top: 34px;
  width: 360px;
  text-align: right;
}
.page-main {
  &-form {
    &::v-deep .el-textarea__inner {
      background-color: #fafbfc;
    }
    &::v-deep .el-textarea .el-input__count {
      background: transparent;
    }
  }
  &::v-deep .el-form-item--small.el-form-item {
    margin-bottom: 32px;
  }
}
</style>
