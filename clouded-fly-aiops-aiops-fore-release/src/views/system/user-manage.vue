<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page-usergroup">
      <el-container>
        <el-aside class="userGroup-aside">
          <user-group-tree @changeGroup="changeGroup"></user-group-tree>
        </el-aside>
        <el-main class="userGroup-main">
          <!-- 搜索框&关联用户 -->
          <div class="main-header">
            <wy-inputSearch
              id="user-manage_input_searchuser-main"
              v-model="searchInp"
              placeholder="请输入姓名/邮箱/手机关键字"
              @search="loadTableSearch"
              clearable
            ></wy-inputSearch>
            <refresh class="refresh" :loading="loadingUserTable" @refresh="resetData()" />
            <el-button
              id="user-manage_button_associated"
              type="primary"
              size="small"
              @click="addUser"
              :disabled="addUserDisabled"
            >
              <i class="el-icon-plus"></i>
              关联用户
            </el-button>
          </div>
          <el-divider></el-divider>
          <el-dialog
            title="用户组关联新用户"
            :visible.sync="showUserDialog"
            width="80%"
            custom-class="uselist-userdialog"
            @close="handleDialogClose"
          >
            <div class="userDialog-header">
              <el-button id="user-manage_button_joingroup" type="primary" @click="addUserToGroup" size="small"
                >加入本组</el-button
              >
              <wy-inputSearch
                id="user-manage_input_searchuser-associated"
                class="userDialog-header-search"
                v-model="searchUserInp"
                placeholder="请输入姓名关键字"
                @search="searchInAddUser"
                clearable
              ></wy-inputSearch>
              <!-- <el-input placeholder="请输入搜索关键字" size="small" v-model="searchUserInp">
                <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
              </el-input> -->
            </div>
            <el-table
              id="user-manage_table_associatedusertable"
              :data="table.rows"
              ref="table"
              v-loading="loadingUserTable"
              height="380px"
              class="usertable"
              size="small"
            >
              <el-table-column type="selection"> </el-table-column>
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
              <el-table-column prop="roleSet" label="角色" :formatter="mergeRoles">
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
              <el-table-column prop="verifiedTime" label="注册时间" width="150px"></el-table-column>
            </el-table>
            <div class="userDialog-pagination">
              <el-pagination
                ref="pagination"
                class="page-table-pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="search.page"
                :page-sizes="pageSizes"
                :page-size="search.limit"
                layout="total, prev, pager, next, sizes"
                :total="table.total"
              >
              </el-pagination>
            </div>
          </el-dialog>
          <!-- 组内用户列表 -->
          <user-group-user-table ref="userTableChild" class="main-usertable"></user-group-user-table>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getUserList, apiEditUser2Group } from '@/apis/user'
import Role from '@/mixins/role'
import table from '@/mixins/table'
import UserGroupTree from './components/usergroup/usergrouptree'
import UserGroupUserTable from './components/usergroup/usergroupusertable'
import WyInputSearch from '../../components/common/wy-input-search.vue'
import Refresh from '@/components/common/refresh.vue'
export default {
  components: { UserGroupTree, UserGroupUserTable, WyInputSearch, Refresh },
  name: 'UserGroupManage',
  mixins: [Role, table],
  data() {
    const user = this.$store.getters.user
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
      user: user,
      //用户列表
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
        nickname: {
          required: true,
          message: '昵称不能为空',
          trigger: 'blur'
        },
        phone: [{ validator: validatePhone, trigger: 'blur' }]
      },
      //用户列表--关联用户对话框
      addUserDisabled: true,
      showUserDialog: false,
      searchUserInp: '',
      loadingUserTable: false
    }
  },
  methods: {
    //用户组树节点--触发列表加载
    changeGroup(id, status) {
      this.targetGroupId = id
      // //未选择节点和选择节点为未分组时 禁用关联用户按钮 （未分组id：‘-’）
      this.addUserDisabled = status
      this.loadTable(id)
    },
    loadTableSearch() {
      this.loadTable(this.targetGroupId, this.searchInp)
    },
    loadTable(id, search) {
      this.$refs.userTableChild.loadTableAction(id, search)
    },
    // ////整合角色名称统一展示
    mergeRoles({ roles }) {
      let rolesSet = ''
      for (let item of roles) {
        rolesSet = rolesSet + item.name + '、'
      }
      return rolesSet
    },
    //关联用户
    addUser() {
      this.showUserDialog = true
      this.searchUserInp = ''
      this.getData()
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
    searchInAddUser() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    async getData() {
      this.loadingUserTable = true
      const { success, desc, rows, total } = await getUserList({
        // groupId: '!' + this.targetGroupId,
        groupId: '!' + this.targetGroupId,
        page: this.search.page,
        limit: this.search.page.limit,
        nickname: this.searchUserInp
      })
      this.loadingUserTable = false
      if (success) {
        this.table = {
          rows,
          total
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //覆盖mixin表格高度调整
    resetTableHeight() {},
    handleDialogClose() {
      this.search.page = 1
      this.search.limit = 10
    },
    async addUserToGroup() {
      let rows = this.$refs.table.selection
      if (rows.length) {
        if (this.targetGroupId) {
          this.showUserDialog = false
          const param = {
            groupId: this.targetGroupId,
            oldGroupId: '',
            opsType: true, // false移出，true加入
            userIds: rows.map(item => item.id)
          }
          const { success, desc } = await apiEditUser2Group(param)
          if (success) {
            this.loadTable(this.targetGroupId)
            this.$Message.success('添加成功')
          } else {
            desc && this.$Message.error(desc)
          }
          this.handleDialogClose()
        } else {
          this.$Message.warning('请选择用户组')
        }
      } else {
        this.$Message.warning('请选择用户')
      }
    },
    // 刷新功能
    resetData() {
      this.searchInp = ''
      this.loadTable(this.targetGroupId)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-usergroup {
  padding: 16px 24px 24px 24px;
}
.usertable {
  overflow: auto;
}
.main-usertable {
  margin: 16px;
}
.userDialog-pagination {
  float: right;
  padding-top: 10px;
}
.userGroup-aside {
  padding: 0 16px;
  width: 240px;
  height: calc(100vh - 146px);
  border-radius: 8px;
  background-color: #ffffff;
}
.userGroup-main {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0px;
  margin-left: 12px;
}
.main-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px 0px 0px;
  .el-button {
    margin-left: 16px;
  }
}
.userDialog-header {
  padding-bottom: 10px;
  display: flex;
  position: relative;
  &-search {
    position: absolute;
    right: 0;
    width: 210px;
  }
}
::v-deep .uselist-userdialog {
  height: 560px;
  .el-table {
    height: 380px;
  }
}
.refresh {
  margin-left: 16px;
}
</style>
