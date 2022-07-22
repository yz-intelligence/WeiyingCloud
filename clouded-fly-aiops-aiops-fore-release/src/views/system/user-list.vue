<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-header"></div>
      <div class="page-content">
        <!-- 用户列表 -->
        <div v-loading="loading" class="usertable">
          <!-- 顶部搜索部分 -->
          <div class="title">
            <el-input
              size="small"
              class="title-input"
              v-model.trim="searchText"
              :maxlength="100"
              placeholder="请输入姓名/邮箱/手机关键字"
              @keyup.enter.native="doSearch()"
            >
              <el-button slot="append" size="small" icon="el-icon-search" @click="doSearch()"></el-button>
            </el-input>
            <refresh :loading="loading" @refresh="resetData()" />
          </div>
          <el-divider></el-divider>
          <!-- 下方表格 -->
          <el-table
            id="user-list_table_userlist"
            ref="table"
            :height="tableHeight"
            :data="table.rows"
            class="userlist"
            :row-style="{ height: '56px' }"
          >
            <el-table-column prop="nickname" label="姓名"> </el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="phone" label="手机"> </el-table-column>
            <el-table-column prop="roleSet" label="角色">
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
            <!-- <el-table-column prop="userType" label="类型">
              <template slot-scope="scope">
                <div v-if="scope.row.userType === 'COMPANY'">
                  <el-popover placement="top" trigger="hover" :content="'公司名称：' + scope.row.company">
                    <i class="el-icon-office-building usertype-icon--company" slot="reference"></i>
                  </el-popover>
                </div>
                <div v-else>
                  <i class="el-icon-user usertype-icon--other"></i>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column prop="verified" label="激活">
              <template slot-scope="scope">
                <div v-if="scope.row.verified">
                  <el-popover placement="top" trigger="hover" :content="'激活时间：' + scope.row.verifiedTime">
                    <div class="statuspoint--active" slot="reference"></div>
                  </el-popover>
                </div>
                <div v-else>
                  <div class="statuspoint--unactive"></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="180px">
              <template slot-scope="scope">
                <table-actions
                  :scope="scope"
                  :actions="scope.row.id === currentUserId ? baseActions : actions"
                  @click="actionClick"
                ></table-actions>
              </template>
            </el-table-column>
          </el-table>
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
        <!-- 弹出对话框 -->
        <el-dialog :width="'640px'" :title="actionModalTitle" :visible.sync="showActionModal">
          <el-table
            id="user-list_table_useractionlist"
            size="mini"
            :data="actionTableData"
            height="300"
            v-loading="actionLoading"
          >
            <el-table-column prop="type" label="行为"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="createTime" label="时间" width="160px"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              class="page-table-pagination simple-pager"
              @size-change="actionPageSizeChange"
              @current-change="actionPageChange"
              :current-page="actionCurrentPage"
              :page-size="actionPageSize"
              simple
              layout="total, prev, pager, next, sizes"
              :total="actionTableTotal"
            >
            </el-pagination>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserList, getUserAction, apiDeleteUser } from '@/apis/user'
import table from '@/mixins/table'
import TableActions from '@/components/common/table-actions.vue'
import Refresh from '@/components/common/refresh.vue'
export default {
  name: 'UserList',
  mixins: [table],
  components: {
    Refresh,
    TableActions
  },
  data() {
    return {
      // 用户列表
      loading: false,
      // 行为记录弹窗
      showActionModal: false,
      currentId: '',
      actionModalTitle: '行为记录',
      actionLoading: false,
      actionTableData: [],
      actionTableTotal: 0,
      actionCurrentPage: 1,
      actionPageSize: 10,
      // 搜索内容
      searchText: '',
      isShowUserEdit: false,
      baseActions: [{ name: '日志审计', id: '1' }],
      actions: [
        { name: '日志审计', id: '1' },
        { name: '删除用户', id: '3' }
      ]
    }
  },
  created() {
    this.getData()
  },
  computed: {
    currentUserId() {
      return this.$store.getters.user?.id
    }
  },
  methods: {
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    //加载用户列表
    async getData() {
      this.loading = true
      const param = {
        ...this.search,
        keyword: this.searchText
      }
      const { success, desc, rows, total } = await getUserList(param)
      this.loading = false
      if (success) {
        this.table = {
          rows,
          total
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 日志审计
    logAudit({ id, nickname }) {
      this.actionModalTitle = nickname + ' 的行为记录'
      this.currentId = id
      this.showActionModal = true
      this.actionTableData = []
      this.loadActionTable()
    },
    // 点击行操作
    actionClick(id, { row }) {
      switch (id) {
        case '1':
          this.logAudit(row)
          break
        case '3':
          this.handleDeleteUser(row.id)
          break
        default:
      }
    },
    //加载用户行为列表
    loadActionTable() {
      this.actionLoading = true
      getUserAction({
        userId: this.currentId,
        page: this.actionCurrentPage,
        limit: this.actionPageSize
      }).then(res => {
        this.actionLoading = false
        if (res && res.success) {
          this.actionTableTotal = res.data.total
          this.actionTableData = res.data.rows
        }
      })
    },
    //用户行为列表页面切换
    actionPageChange(currentPage) {
      this.actionCurrentPage = currentPage
      this.loadActionTable()
    },
    //用户行为列表页面大小切换
    actionPageSizeChange(pageSize) {
      this.actionPageSize = pageSize
      this.loadActionTable()
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
    handleDeleteUser(id) {
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
    },
    handleAddUser() {},
    // 刷新功能
    resetData() {
      this.searchText = ''
      this.getData()
    }
  }
}
</script>
<style scoped lang="scss">
.usertable {
  padding-top: 24px;
}
.page-table-pagination {
  margin-top: 16px;
  font-size: 14px;
  @include flex(flex-end);
}
//设置font-size调整icon大小
.usertype-icon--company {
  font-size: 18px;
  &:hover {
    cursor: pointer;
  }
}
.usertype-icon--other {
  font-size: 18px;
  &:hover {
    cursor: pointer;
  }
}
.statuspoint--active {
  width: 12px;
  height: 12px;
  background-color: #28a745;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
}
.statuspoint--unactive {
  width: 12px;
  height: 12px;
  background-color: gray;
  border-radius: 50%;
}
.title {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  &-input {
    margin-right: 16px;
    width: 240px;
  }
  &::v-deep .el-input-group__append {
    padding: 0 19px;
    background-color: #0076ff;
    color: #fff;
  }
}
</style>
