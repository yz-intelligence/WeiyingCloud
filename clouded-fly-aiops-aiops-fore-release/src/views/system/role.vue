<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-header">
        <div class="page-action">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="createRole" id="role_button_invite"
            >新增角色</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <div class="page-content">
        <div class="page-table" v-loading="loading">
          <el-table
            ref="table"
            :height="tableHeight"
            :data="table.rows"
            class="userlist"
            id="role_table_manage"
            :row-style="{ height: '56px' }"
          >
            <el-table-column prop="name" label="角色">
              <template slot-scope="scope">
                <span>{{ scope.row.name + ' ' }}</span>
                <i
                  v-if="!isHideEdit(scope.row)"
                  class="el-icon-edit-outline blue point"
                  @click="actionClick('2', scope)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column prop="counts" label="关联用户">
              <template slot-scope="scope">
                <el-button type="text" @click="linkClick(scope.row)">{{
                  handleUserNames(scope.row.userNames) || '--'
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column width="220" label="操作">
              <template slot-scope="scope">
                <table-actions :scope="scope" :actions="getActions(scope.row)" @click="actionClick"></table-actions>
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
            id="role_div_pagination"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增/编辑角色 -->
    <role-edit
      :visible.sync="isEditRole"
      :record="currentRecord"
      :title="editTitle"
      @success="getData"
      id="role_form_user"
    />
    <!-- 关联/取消关联 -->
    <role-link
      v-if="currentRecord.id && isEditLink"
      :visible.sync="isEditLink"
      :role-id="currentRecord.id"
      :title="linkTitle"
      @update="getData"
      id="role_form_link"
    />
    <!-- 菜单配置 -->
    <role-menu-config
      v-if="currentRecord.id && isEditMenu"
      :visible.sync="isEditMenu"
      :record="currentRecord"
      id="role_form_menu"
    />
    <!-- 新增角色 -->
    <role-menu-create
      v-if="isShowRoleCreate"
      :visible.sync="isShowRoleCreate"
      :roleActions.sync="roleActions"
      @success="getData"
      id="role_form_create"
    />
  </div>
</template>
<script>
import table from '@/mixins/table'
import { apiGetRolesTotal, apiDeleteRole } from '@/apis/user'
import TableActions from '@/components/common/table-actions.vue'
import RoleEdit from './components/role/edit.vue'
import RoleLink from './components/role/link.vue'
import RoleMenuConfig from './components/role/menu-config.vue'
import RoleMenuCreate from './components/role/create.vue'
export default {
  name: 'SystemRole',
  components: {
    RoleEdit,
    RoleLink,
    TableActions,
    RoleMenuCreate,
    RoleMenuConfig
  },
  mixins: [table],
  data() {
    return {
      editTitle: '新增角色',
      isEditRole: false,
      isEditLink: false,
      isEditMenu: false,
      isShowRoleCreate: false,
      currentRecord: {},
      roleActions: [], // 用户功能权限列表缓存
      actions: [
        { name: '配置权限', id: '1' },
        { name: '关联用户', id: '4' },
        { name: '删除', id: '3' }
      ],
      linkTitle: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取表格数据
    async getData() {
      this.loading = true
      const { success, desc, rows, total } = await apiGetRolesTotal(this.search)
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
    // 处理操作，去掉超级管理员和默认角色的编辑和删除
    getActions({ id, name }) {
      let actions = [...this.actions]
      if (id === 'CompanyAdmin' || name === '默认角色') {
        actions = actions.filter(item => item.name !== '删除')
      }
      return actions
    },
    isHideEdit({ id, name }) {
      return id === 'CompanyAdmin' || name === '默认角色'
    },
    /**
     * 按钮组点击
     * @param { string } id 对应this.actions
     * @param { object } row 当前操作行
     */
    actionClick(id, { row }) {
      switch (id) {
        case '1':
          this.currentRecord = {}
          this.$nextTick(() => {
            this.currentRecord = row
            this.isEditMenu = true
          })
          break
        case '2':
          this.editTitle = '编辑角色名称'
          this.currentRecord = row
          this.isEditRole = true
          break
        case '3':
          this.deleteRole(row)
          break
        default:
          this.linkClick(row)
      }
    },
    /**
     * 关联用户
     * @param {object} row 当前行数据
     */
    linkClick(row) {
      this.currentRecord = { ...row }
      this.linkTitle = row.name
      this.isEditLink = true
    },
    /**
     * 删除角色
     * @param { string } id 角色id
     */
    deleteRole({ id }) {
      this.$customMessageBox(this, '提示', '确定删除这个角色吗？', 'warning')
        .then(async () => {
          const { success, desc } = await apiDeleteRole(id)
          if (success) {
            this.getData()
            this.$Message.success('删除成功')
          } else {
            desc && this.$Message.error(desc)
          }
        })
        .catch(() => {})
    },
    // 新增角色
    createRole() {
      this.isShowRoleCreate = true
    },
    //用户行为列表页面切换
    handleCurrentChange(currentPage) {
      this.search.page = currentPage
      this.getData()
    },
    //用户行为列表页面大小切换
    handleSizeChange(pageSize) {
      this.search.limit = pageSize
      this.getData()
    },
    handleUserNames(user) {
      const reg = new RegExp('([\u4E00-\u9FA5A-Za-z0-9_]+[\u3001]){3}')
      return reg.test(user) ? user.match(reg)[0] + '...' : user
    }
  }
}
</script>
<style scoped lang="scss">
.page-action {
  padding: 16px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.page-table-pagination {
  margin-top: 16px;
  font-size: 14px;
  @include flex(flex-end);
}
.blue {
  color: #0076ff;
}
.point {
  cursor: pointer;
}
</style>
