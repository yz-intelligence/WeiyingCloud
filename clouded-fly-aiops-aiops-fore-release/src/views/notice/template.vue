<template>
  <div class="page-container">
    <c-breadcrumb />
    <!-- 内容部分 -->
    <div class="page">
      <div class="page-content">
        <div class="rule" v-loading="loading">
          <!-- 顶部搜索部分 -->
          <div class="rule-title">
            <el-input
              size="small"
              class="rule-title-input"
              id="rule_input_search"
              v-model.trim="searchText"
              :maxlength="100"
              placeholder="请输入关键字"
              @keyup.enter.native="doSearch()"
            >
              <el-button
                id="rule_button_search"
                slot="append"
                size="small"
                icon="el-icon-search"
                @click="doSearch()"
              ></el-button>
            </el-input>
            <refresh :loading="loading" @refresh="resetData()" />
            <el-button
              v-if="$hasPermission('NoticeTemplate-create')"
              id="rule_button_add"
              class="rule-title-button"
              type="primary"
              icon="el-icon-plus"
              @click="showEdit()"
              size="small"
            >
              新增
            </el-button>
          </div>
          <el-divider></el-divider>
          <!-- 中间表格部分 -->
          <div class="rule-content">
            <el-table
              id="rule_table_rule"
              ref="table"
              :height="tableHeight"
              :data="table.rows"
              class="rule-content-table"
            >
              <el-table-column prop="name" label="模板名称"> </el-table-column>
              <el-table-column prop="createTime" label="创建时间"> </el-table-column>
              <el-table-column prop="modifyTime" label="最后编辑时间"> </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <table-actions
                    :scope="scope"
                    :actions="filterActions(scope.row.id)"
                    @click="actionClick"
                  ></table-actions>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 下方分页操作部分 -->
          <div class="rule-page">
            <el-pagination
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
        </div>
      </div>
    </div>
    <!-- 新增订阅修改复用弹窗 -->
    <temp-edit
      v-if="isShowEdit"
      :record="selectRecord"
      :fields="noticeFields"
      :is-preview="isOnlyPreview"
      :defalutTemp="defalutTemp"
      :visible.sync="isShowEdit"
      @success="getData"
    />
  </div>
</template>

<script>
import table from '@/mixins/table'
import {
  apiGetNoticeTemplatePage,
  apiDeleteNoticeTemplates,
  apiGetDefaultNoticeTemplate,
  apiGetNoticeCustomizeField
} from '@/apis/notice'
import TableActions from '@/components/common/table-actions.vue'
import TempEdit from './components/temp-edit.vue'
import Refresh from '@/components/common/refresh.vue'
export default {
  components: {
    TempEdit,
    TableActions,
    Refresh
  },
  mixins: [table],
  name: 'NoticeTemplate',
  data() {
    return {
      searchText: '',
      //订阅规则对话框显示
      isShowEdit: false,
      //新增升级规则对话框显示
      isUpGradeShow: false,
      //切换升级规则对话框只读或可编辑：（true--只读）
      isWatch: false,
      loading: false,
      actions: [
        { name: '编辑', id: '1', permission: 'NoticeTemplate-update' },
        { name: '删除', id: '2', permission: 'NoticeTemplate-remove' }
      ],
      isOnlyPreview: false,
      noticeFields: null, // 自定义字段
      selectRecord: null,
      defalutTemp: null
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { searchText: name } = this
      let params = {
        ...this.search,
        name
      }
      this.loading = true
      const { success, rows, desc, total } = await apiGetNoticeTemplatePage(params)
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
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    showEdit(record, isPreview = false) {
      if (!record && !this.defalutTemp) {
        this.getDefaultTempData()
      }
      if (!this.noticeFields) {
        this.getNoticeFields()
      }
      this.isOnlyPreview = isPreview
      this.selectRecord = record
      this.isShowEdit = true
    },
    actionClick(id, { row }) {
      this.isOnlyPreview = false
      switch (id) {
        case '1':
          // 编辑
          this.showEdit(row)
          break
        case '2':
          // 删除
          this.delectRecord(row)
          break
        case '3':
          // 查看
          this.showEdit(row, true)
          break
        default:
          break
      }
    },
    // 删除订阅规则
    delectRecord({ id, list = [] }) {
      let msgTitle = '提示'
      let msgContent = '确定删除这个模板吗？'
      let needBr = false
      if (list?.length) {
        msgTitle = '删除信息'
        needBr = true
        const relation = list.length > 3 ? list.filter((_, index) => index < 3) + ',...' : list
        msgContent = `确定删除这个模板吗？该模板关联了以下订阅策略：<br/>${relation}`
      }
      this.$customMessageBox(this, msgTitle, msgContent, 'warning', {}, needBr)
        .then(() => {
          this.deleteTemplate(id)
        })
        .catch(() => {})
    },
    async deleteTemplate(id) {
      const { success, desc } = await apiDeleteNoticeTemplates(id)
      if (success) {
        this.getData()
        this.$Message.success('删除成功')
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取默认模板
    async getDefaultTempData() {
      this.loading = true
      const { success, desc, data } = await apiGetDefaultNoticeTemplate()
      this.loading = false
      if (success) {
        this.defalutTemp = data
      } else {
        desc && this.$message.error(desc)
      }
    },
    // 获取自定义字段
    async getNoticeFields() {
      const { success, desc, data } = await apiGetNoticeCustomizeField()
      if (success) {
        this.noticeFields = data
      } else {
        desc && this.$message.error(desc)
      }
    },
    //默认模板只显示查看
    filterActions(id) {
      const previewAction = [{ name: '详情', id: '3' }]
      return id === '-1' ? previewAction : [...previewAction, ...this.actions]
    },
    // 刷新功能
    resetData() {
      this.searchText = ''
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.rule {
  display: flex;
  flex-direction: column;
  &-title {
    padding-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    &-input {
      width: 240px;
      margin: 0 16px;
    }
    &-button {
      margin: 5px 0 5px 16px;
    }
    &::v-deep .el-input-group__append {
      padding: 0 19px;
      background-color: #0076ff;
      color: #fff;
    }
  }
  &-table {
    &-button {
      margin-left: -10px;
    }
  }
  &-page {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e8eaec;
}
.blue {
  background-color: #0076ff !important;
  color: #fff !important;
  border-radius: 0 3px 3px 0;
}
.point {
  cursor: pointer;
}
.table-button-subdetail {
  margin: 0;
  // word-break: break-all;
  // max-width: 150px;
  color: #0076ff;
  cursor: pointer;
}
.table-rules {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
