<template>
  <div v-loading="tableLoading">
    <el-table
      id="user-manage_table_userlist"
      ref="table"
      :data="table.rows"
      :height="tableHeight"
      class="usertable"
      size="small"
    >
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="nickname" label="姓名"> </el-table-column>
      <el-table-column prop="groupName" label="用户组">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.groups && scope.row.groups.length > 3"
            placement="top"
            trigger="hover"
            :content="groups2str(scope.row.groups, 'groupName') || '未分组'"
          >
            <span slot="reference">{{ groups2str(scope.row.groups, 'groupName', 3) || '未分组' }}</span>
          </el-popover>
          <span v-else>{{ groups2str(scope.row.groups, 'groupName') || '未分组' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="角色">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.roles && scope.row.roles.length > 3"
            placement="top"
            trigger="hover"
            :content="groups2str(scope.row.roles, 'name') || '--'"
          >
            <span slot="reference">{{ groups2str(scope.row.roles, 'name', 3) || '--' }}</span>
          </el-popover>
          <span v-else>{{ groups2str(scope.row.roles, 'name') || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机"></el-table-column>
      <el-table-column prop="qiyeWeixin" label="企业微信"></el-table-column>
      <el-table-column prop="verifiedTime" label="注册时间" width="170px"></el-table-column>
      <el-table-column prop="operate" label="操作" width="250px">
        <template slot-scope="scope">
          <div class="action">
            <el-button id="user-manage_button_edit" size="small" @click="showEditDialog(scope.row)" type="text"
              >编辑</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button id="user-manage_button_auth" size="small" @click="showEditRuleDialog(scope.row)" type="text"
              >授权</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              id="user-manage_button_delete"
              size="small"
              @click="handleDeletComfirm(0, scope.row.id)"
              type="text"
              >移出本组</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              id="user-manage_button_delete"
              size="small"
              @click="handleDeletComfirm(1, scope.row.id)"
              type="text"
              >删除用户</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        class="page-table-pagination"
        :page-sizes="pageSizes"
        :page-size="search.limit"
        :current-page="search.page"
        layout="total, prev, pager, next, sizes"
        :total="table.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 用户信息编辑对话框 -->
    <el-dialog title="修改用户信息" :width="'640px'" :visible.sync="showUserInfoDialog">
      <el-form :model="userInfo" :rules="userInfoRule" ref="userInfoForm" label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input id="user-manage_input_nickname" size="small" v-model.trim="userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input id="user-manage_input_phone" size="small" v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="企业微信" prop="qiyeWeixin">
          <el-input id="user-manage_input_qiyeWeixin" size="small" v-model="userInfo.qiyeWeixin"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="handleCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="handleComfirm" :loading="userUpdateLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户授权对话框 -->
    <el-dialog title="用户授权" :width="'640px'" :visible.sync="showRuleDialog">
      <el-checkbox :indeterminate="indeterminate" :value="ckAllRules" @click.prevent.native="handleCheckAll">
        全选
      </el-checkbox>
      <el-divider></el-divider>
      <el-checkbox-group v-model="ckRules">
        <el-checkbox v-for="item in rules" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer" v-loading="rulesLoading">
        <el-button size="small" @click="handleRulesCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="saveUserRules">授 权</el-button>
      </div>
      <el-alert v-if="!rulesLoading && rules.length === 0" title="没有角色可分配" type="warning"> </el-alert>
    </el-dialog>
    <!-- 用户删除确认对话框 -->
    <!-- <el-dialog title="用户授权" :width="'460px'" :visible.sync="showConfirmDialog">
      <el-checkbox v-model="removeOfGroup"> 移除本组 </el-checkbox>
      <el-checkbox v-model="removeOfApp"> 彻底删除 </el-checkbox>
      <div slot="footer">
        <el-button size="small" @click="handleDeleteCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="handleDeletComfirm">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import {
  getUserList,
  apiUpdateUser,
  apiGetRoles,
  apiGetUserRoles,
  apiSaveUserRoles,
  apiDeleteUser,
  apiEditUser2Group
} from '@/apis/user'
import Role from '@/mixins/role'
import table from '@/mixins/table'
import { debounce } from 'lodash'
import { validateEmpty } from '@/utils/formValidate'
export default {
  name: 'UserGroupUserTable',
  mixins: [Role, table],
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
      tableHeight: 400,
      targetGroupId: '',
      //用户列表
      tableLoading: false,
      searchInp: '',
      // 用户列表--编辑用户信息对话框
      showUserInfoDialog: false,
      userInfo: {
        id: '',
        nickname: '',
        phone: '',
        qiyeWeixin: ''
      },
      userInfoRule: {
        nickname: [{ validator: validateEmpty('昵称不能为空'), trigger: 'blur', required: true }],
        phone: [{ validator: validatePhone, trigger: 'blur', required: true }],
        qiyeWeixin: [{ message: '企业微信不能为空', trigger: 'blur', required: true }]
      },
      userUpdateLoading: false,
      // 用户列表--用户授权对话框
      targetUserId: '',
      showRuleDialog: false,
      rulesLoading: false,
      rules: [],
      ckRules: [],
      //用户删除确认对话框
      showConfirmDialog: false,
      removeOfGroup: false, // 从本组删除
      removeOfApp: false // 彻底从系统删除
    }
  },
  mounted() {
    this.resetTableHeight()
    window.addEventListener('resize', this.resetTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resetTableHeight)
  },
  computed: {
    ckAllRules() {
      if (this.rules.length && this.rules.length === this.ckRules.length) {
        return true
      } else {
        return false
      }
    },
    indeterminate() {
      if (this.rules.length && this.ckRules.length && this.rules.length !== this.ckRules.length) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    loadTableAction(id, searchInp) {
      this.targetGroupId = id
      this.searchInp = searchInp
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
      // this.loadTable()
    },
    ////整合角色名称统一展示
    mergeRoles({ roles }) {
      let rolesSet = ''
      for (let item of roles) {
        rolesSet = rolesSet + item.name + '、'
      }
      return rolesSet
    },
    //用户组列表加载
    async getData() {
      this.tableLoading = true
      const { success, rows, total, desc } = await getUserList({
        groupId: this.targetGroupId,
        page: this.search.page,
        limit: this.search.limit,
        keyword: this.searchInp
      })
      this.tableLoading = false
      if (success) {
        this.table = {
          rows,
          total
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 重新设置表格高度
    resetTableHeight: debounce(function () {
      {
        this.$nextTick(() => {
          // 获取表格dom距离视口顶部的距离
          const tableTop = this.$refs.table.$el.getBoundingClientRect().top
          // 获取页面视口高度
          const pageHeight = document.documentElement.clientHeight || document.body.clientHeight
          // 表格高度 = 页面视口高度 - 表格距离顶部高度 - 分页器高度 - 底部margin
          this.tableHeight = tableTop ? pageHeight - tableTop - 59 - 25 : 400
        })
      }
    }, 200),

    //用户组列表--控制编辑用户信息对话框-----------------------------------------
    showEditDialog(row) {
      this.showUserInfoDialog = true
      for (const key in this.userInfo) {
        this.userInfo[key] = row[key]
      }
    },
    // 角色对象&&用户组转换成角色字符串
    groups2str(roles = [], filed = 'name', showNumber = roles.length) {
      if (!Array.isArray(roles)) return ''
      const result = roles.reduce((str, role) => [...str, role[filed]], [])
      if (roles.length > showNumber) {
        result.length = showNumber
        if (showNumber === 3) {
          result.push('...')
        }
      }
      return result.join(',')
    },
    handleCancle() {
      this.showUserInfoDialog = false
      this.$refs.userInfoForm.resetFields()
    },
    handleComfirm() {
      this.$refs.userInfoForm.validate(async valid => {
        if (valid) {
          const param = { ...this.userInfo }
          param.nickname = param.nickname.trim()
          this.userUpdateLoading = true
          const { success, desc } = await apiUpdateUser(param)
          if (success) {
            this.getData()
            this.$Message.success('修改成功')
            this.userUpdateLoading = false
            this.showUserInfoDialog = false
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    //用户组列表--控制用户授权对话框-----------------------------------------
    showEditRuleDialog({ id }) {
      this.loadRules()
      this.targetUserId = id
      this.showRuleDialog = true
    },
    async loadRules() {
      this.rulesLoading = true
      this.ckRules = []
      this.rules = []
      const { success, rows } = await apiGetRoles({ page: 1, limit: 100 })
      if (success) {
        this.rules = rows
      }
      this.loadUserRoles(this.targetUserId)
    },
    //用户组列表--获取用户的角色，排除不可见的基本角色
    async loadUserRoles(id) {
      const { success, rows } = await apiGetUserRoles(id, { pageSize: 100 })
      this.rulesLoading = false
      if (success) {
        this.ckRules = rows.filter(item => !this.defaultRoles.includes(item.id)).map(item => item.id)
      }
    },
    handleCheckAll() {
      if (!this.ckAllRules) {
        this.ckRules = this.rules.map(item => item.id)
      } else {
        this.ckRules = []
      }
    },
    handleRulesCancle() {
      this.showRuleDialog = false
    },
    async saveUserRules() {
      const { success, desc } = await apiSaveUserRoles(this.targetUserId, this.ckRules.join(','))
      if (success) {
        this.$Message.success('授权成功')
        this.getData()
      } else {
        desc && this.$Message.error(desc)
      }
      this.showRuleDialog = false
    },
    //从用户组中移除用户
    showDeleteDialog(id) {
      this.targetUserId = id
      this.removeOfGroup = true
      this.removeOfApp = false
      this.showConfirmDialog = true
    },
    handleDeleteCancle() {
      this.removeOfGroup = false
      this.removeOfApp = false
      this.showConfirmDialog = false
    },
    /**
     *删除功能
     isDelect:1=>删除用户
     isDelect:0=>移出本组
     */
    handleDeletComfirm(isDelet, id) {
      if (isDelet) {
        this.$customMessageBox(
          this,
          '删除用户',
          '请注意！“删除用户”操作将删除账户，删除后将不能使用该账号登录平台',
          'warning'
        )
          .then(async () => {
            const { success, desc } = await apiDeleteUser(id)
            if (success) {
              this.$Message.success('删除成功')
              this.getData()
            } else {
              desc && this.$Message.error(desc)
            }
          })
          .catch(() => {})
      } else {
        //移除用户到未分类中
        this.$customMessageBox(this, '移出本组', '移出本组后该用户将分到未分类', 'warning')
          .then(async () => {
            console.log('dd')
            const param = {
              groupId: '',
              oldGroupId: this.targetGroupId,
              opsType: false, // false移出，true加入
              userIds: [id]
            }
            const { success, desc } = await apiEditUser2Group(param)
            if (success) {
              this.$Message.success('移出成功')
              this.getData()
            } else {
              desc && this.$Message.error(desc)
            }
          })
          .catch(() => {})
      }
      this.showConfirmDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.usertable {
  overflow: auto;
}
.pagination {
  float: right;
  padding-top: 15px;
}
.action {
  & ::v-deep .el-button--small {
    padding: 0;
  }
}
</style>
