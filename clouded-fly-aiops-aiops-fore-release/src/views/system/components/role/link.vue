<template>
  <div class="role-link">
    <el-dialog :title="'关联用户 - ' + title" :width="`1050px`" :visible.sync="editVisible" @close="close">
      <div class="link-table" v-loading="linkLoading">
        <diy-transfer
          :select.sync="link"
          :unselect.sync="all"
          :unselectList.sync="unselectList"
          :selectList.sync="selectList"
          @search="doSearch"
        >
          <!-- 左边穿梭框表格 -->
          <template slot="left">
            <div class="trans">
              <div class="trans-title">用户列表</div>
              <div class="trans-content">
                <!-- 搜索 -->
                <wy-input-search
                  class="trans-input"
                  v-model.trim="searchAllText"
                  placeholder="搜索用户邮箱/姓名"
                  @search="doSearch(true)"
                  @clear="clear(true)"
                  clearable
                ></wy-input-search>
                <!-- 表格 -->
                <el-table
                  class="trans-table"
                  v-loading="loadingAll"
                  :data="allShow"
                  @selection-change="handleUnselect"
                  row-key="scope"
                  size="mini"
                >
                  <el-table-column type="selection" align="center"> </el-table-column>
                  <el-table-column prop="email" label="邮箱" />
                  <el-table-column prop="nickname" label="姓名" />
                  <el-table-column prop="groupName" label="用户组">
                    <template slot-scope="scope">
                      {{ scope.row.groupName || '未分组' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="roleSet" label="角色">
                    <template slot-scope="scope">
                      {{ rolesTranslate(scope.row.roles) }}
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                  class="pagination"
                  :page-size="50"
                  :current-page="currentLeft"
                  :total="totalLeft"
                  layout="total, prev, pager, next"
                  @current-change="handleCurrentChangeLeft"
                  :hide-on-single-page="true"
                >
                </el-pagination>
              </div>
            </div>
          </template>
          <!-- 右边穿梭框表格 -->
          <template slot="right">
            <div class="trans">
              <div class="trans-title">已选择</div>
              <div class="trans-content">
                <!-- 搜索 -->
                <wy-input-search
                  class="trans-input"
                  v-model.trim="searchSelectText"
                  placeholder="搜索用户邮箱/姓名"
                  @search="doSearch(false)"
                  @clear="clear(false)"
                  clearable
                ></wy-input-search>
                <!-- 表格 -->
                <el-table
                  class="trans-table"
                  v-loading="loadingLink"
                  :data="linkShow"
                  @selection-change="handleSelect"
                  row-key="id"
                  size="mini"
                >
                  <el-table-column type="selection" align="center"> </el-table-column>
                  <el-table-column prop="email" label="邮箱" />
                  <el-table-column prop="nickname" label="姓名" />
                  <el-table-column prop="groupName" label="用户组">
                    <template slot-scope="scope">
                      {{ scope.row.groupName || '未分组' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="roleSet" label="角色">
                    <template slot-scope="scope">
                      {{ rolesTranslate(scope.row.roles) }}
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                  class="pagination"
                  :page-size="50"
                  :current-page="currentRight"
                  :total="totalRight"
                  layout="total, prev, pager, next"
                  @current-change="handleCurrentChangeRight"
                  :hide-on-single-page="true"
                >
                </el-pagination>
              </div>
            </div>
          </template>
        </diy-transfer>
      </div>

      <!-- 下方按钮 -->
      <div class="bottom" slot="footer">
        <el-button size="small" @click="close()">取 消</el-button>
        <el-button size="small" type="primary" :loading="clickLoading" @click="editUsers">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 关联组件
import WyInputSearch from '@/components/common/wy-input-search.vue'
import DiyTransfer from '@/components/common/diy-transfer'
import { getUserList, apiUpdateRoleUsers } from '@/apis/user'
export default {
  name: 'RoleLink',
  components: {
    WyInputSearch,
    DiyTransfer
  },
  props: {
    roleId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    visible: Boolean
  },
  data() {
    return {
      isLink: false, // true 为关联，false为移除
      // 全部用户表loading
      loadingAll: false,
      // 关联用户表loading
      loadingLink: false,
      linkLoading: false,
      // 禁止狂点确定操作
      clickLoading: false,
      // 全部用户
      all: [],
      // 已关联用户
      link: [],
      // 未关联用户中选择内容
      unselectList: [],
      // 已关联用户中选择内容
      selectList: [],
      search: {
        page: 1,
        limit: 999,
        nickname: ''
      },
      editVisible: this.visible,
      searchAllText: '',
      searchSelectText: '',
      oldlink: [],
      currentLeft: 1,
      currentRight: 1,
      limitLeft: 10,
      limitRight: 10,
      totalLeft: 0,
      totalRight: 0,
      // 全部显示部分
      allShow: [],
      // 已选择显示部分
      linkShow: []
    }
  },
  computed: {
    _roleId() {
      return `${this.isLink ? '!' : ''}${this.roleId}`
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    },
    allShow(val) {
      if (this.searchAllText === '') {
        this.totalLeft = this.all.length
        return
      }
      this.totalLeft = val.length
    },
    linkShow(val) {
      if (this.searchSelectText === '') {
        this.totalRight = this.link.length
        return
      }
      this.totalRight = val.length
    },
    all(val) {
      if (this.searchAllText === '') {
        this.allShow = val.slice((this.currentLeft - 1) * 50, this.currentLeft * 50)
        return
      }
      this.doSearch(true)
    },
    link(val) {
      if (this.searchSelectText === '') {
        this.linkShow = val.slice((this.currentRight - 1) * 50, this.currentRight * 50)
        return
      }
      this.doSearch(false)
    }
  },
  created() {
    this.getData()
    setTimeout(() => {
      // sb赋值，直接复制了link的内存栈，会导致oldlink跟着link一起变化，必须要创建独立内存栈
      this.oldlink = [...this.link]
    }, 500)
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$emit('update')
    },
    // 获取表格数据
    getData() {
      this.getTable(true)
      this.getTable(false)
    },
    async getTable(isLink) {
      this.isLink = isLink
      const { _roleId } = this
      isLink ? (this.loadingAll = true) : (this.loadingLink = true)
      const param = {
        ...this.search,
        nickname: isLink ? this.searchAllText : this.searchSelectText,
        roleId: _roleId
      }
      const { success, desc, rows, total } = await getUserList(param)
      isLink ? (this.loadingAll = false) : (this.loadingLink = false)
      if (success) {
        isLink ? (this.all = rows) : (this.link = rows)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 选择行或者取消行----左边列表
    handleUnselect(val) {
      this.unselectList = val
    },
    // 选择行或者取消行----右边列表
    handleSelect(val) {
      this.selectList = val
    },
    editUsers() {
      const { oldlink, link, roleId } = this
      const oldid = oldlink.map(user => user.id)
      const newid = link.map(user => user.id)
      if (oldid.join('') !== newid.join('')) {
        this.UpdateUser(roleId, newid)
      } else {
        this.$Message.warning('请选择修改 1 个用户')
      }
    },
    // 关联
    async UpdateUser(roleId, userIds) {
      this.clickLoading = true
      const data = {
        roleId,
        userIds
      }
      const { success, desc } = await apiUpdateRoleUsers(data)
      this.clickLoading = false
      if (success) {
        this.$Message.success(`关联成功`)
        this.close()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 角色对象转换成角色字符串
    rolesTranslate(roles = []) {
      if (!Array.isArray(roles)) return ''
      return roles.reduce((str, role) => [...str, role.name], []).join(',')
    },
    // 修改左边当前页
    handleCurrentChangeLeft(e) {
      this.currentLeft = e
      this.doSearch(true)
    },
    // 修改右边当前页
    handleCurrentChangeRight(e) {
      this.currentRight = e
      this.doSearch(false)
    },
    doSearch(e) {
      // 全部
      if (e) {
        const { all, searchAllText } = this
        const newall = all.filter(item => item.nickname.includes(searchAllText) || item.email.includes(searchAllText))
        this.allShow = newall.slice((this.currentLeft - 1) * 50, this.currentLeft * 50)
      }
      // 已选择
      else {
        const { link, searchSelectText } = this
        const newlink = link.filter(
          item => item.nickname.includes(searchSelectText) || item.email.includes(searchSelectText)
        )
        this.linkShow = newlink.slice((this.currentRight - 1) * 50, this.currentRight * 50)
      }
    },
    // 清空自动搜索
    clear(e) {
      this.doSearch(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  &-table {
    margin: 8px 0 -8px;
  }
  &-header {
    @include flex(flex-start);
    padding-bottom: 16px;
    &-search {
      margin-left: auto;
    }
  }
}
.trans {
  display: flex;
  flex-direction: column;
  // width: 460px;
  // height: 436px;
  &-title {
    color: #333333;
    font-size: 16px;
    font-weight: 400;
  }
  &-content {
    margin-top: 8px;
    width: 474px;
    height: 416px;
    background: #ffffff;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    padding: 24px 16px 13px;
    display: flex;
    flex-direction: column;
  }
  &-input {
    margin-bottom: 21px;
    width: 442px;
    &::v-deep .el-input {
      width: 410px;
    }
  }
  &-table {
    height: auto;
    overflow: auto;
  }

  &::v-deep .el-input-group__append {
    padding: 0 19px;
    background-color: #0076ff;
    color: #fff;
  }
}
.pagination {
  @include flex(flex-end);
  margin-top: 12px;
  text-align: right;
}
</style>
