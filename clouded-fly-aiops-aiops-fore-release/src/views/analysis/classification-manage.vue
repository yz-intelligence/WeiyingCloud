<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-content">
        <div class="classification" v-loading="loading">
          <!-- 顶部搜索部分 -->
          <div class="classification-title">
            <el-input
              size="small"
              class="classification-title-input"
              id="upgrade_input_search"
              v-model.trim="searchText"
              :maxlength="100"
              placeholder="请输入关键字"
              @keyup.enter.native="doSearch()"
            >
              <el-button
                id="upgrade_button_search"
                slot="append"
                size="small"
                icon="el-icon-search"
                @click="doSearch()"
              ></el-button>
            </el-input>
            <refresh :loading="loading" @refresh="resetData()" />
            <el-button
              id="upgrade_button_add"
              class="classification-title-button"
              type="primary"
              icon="el-icon-plus"
              @click="showAdd('新增分类')"
              size="small"
            >
              新增
            </el-button>
          </div>
          <el-divider></el-divider>
          <!-- 中间表格部分 -->
          <div class="classification-content">
            <el-table
              id="upgrade_table_upgrade"
              ref="table"
              :height="tableHeight"
              :data="table.rows"
              class="classification-content-table"
              :row-style="{ height: '56px' }"
            >
              <el-table-column type="index" label="序号" width="100"> </el-table-column>
              <el-table-column prop="classifyName" label="分类"> </el-table-column>
              <el-table-column prop="classifyType" label="类型" :formatter="formatterType"> </el-table-column>
              <el-table-column prop="parentsName" label="所属根分类"> </el-table-column>
              <el-table-column prop="createTime" label="创建时间"> </el-table-column>
              <el-table-column prop="remarks" label="备注" width="180"> </el-table-column>
              <el-table-column prop="status" label="状态" width="120">
                <template slot-scope="scope">
                  <diy-switch
                    :state.sync="scope.row.status"
                    :row="scope.row"
                    :disabled="scope.row.isRoot"
                    @change="statusChange(scope.row.status, scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <table-actions
                    :scope="scope"
                    :actions="scope.row.isRoot ? actions2 : actions"
                    @click="actionClick"
                  ></table-actions>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 下方分页操作部分 -->
          <div class="classification-page">
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
        <manage-dialog
          v-if="showDialog"
          :visible.sync="showDialog"
          :title="title"
          :form="form"
          :isReadOnly="isReadOnly"
          @success="updatePage"
        ></manage-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import table from '@/mixins/table'
import Refresh from '@/components/common/refresh.vue'
import DiySwitch from '@/components/common/diy-switch.vue'
import TableActions from '@/components/common/table-actions.vue'
import ManageDialog from './components/classification-manage/manage-dialog.vue'
import { apiGetClassifications, apiUpdateState, apiDeleteClassification } from '@/apis/classification'
export default {
  name: 'ClassificationManage',
  components: {
    TableActions,
    DiySwitch,
    ManageDialog,
    Refresh
  },
  mixins: [table],
  data() {
    return {
      title: '新增',
      searchText: '',
      loading: false,
      showDialog: false,
      isReadOnly: false,
      actions: [
        { name: '详情', id: '2' },
        { name: '编辑', id: '1' },
        { name: '删除', id: '3' }
      ],
      actions2: [{ name: '详情', id: '2' }],
      //form对象组件内部维护，若为新增置为undefined，启用组件内部默认值
      form: undefined
    }
  },
  created() {
    this.getData()
  },
  methods: {
    updatePage() {
      this.getData()
    },
    formatterType({ classifyType }) {
      return classifyType === 'child' ? '子分类' : '根分类'
    },
    async getData() {
      let params = {
        name: this.searchText,
        ...this.search
      }
      this.loading = true
      const { success, desc, rows, total } = await apiGetClassifications(params)
      this.loading = false
      if (success) {
        this.table = { rows, total }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //搜索方法
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    //新增
    showAdd(text, row) {
      this.title = text
      this.isReadOnly = false
      if (text === '编辑分类') {
        this.form = { ...row }
      } else if (text === '详情') {
        this.form = { ...row }
        this.isReadOnly = true
      } else {
        this.form = undefined
      }
      this.showDialog = true
    },
    //状态切换
    async statusChange(state, { id }) {
      if (state) {
        const { success, desc } = await apiUpdateState(id, { state: Boolean(state) })
        if (success) {
          this.$Message.success('状态修改成功')
        } else {
          desc && this.$Message.error(desc)
        }
      } else {
        this.$customMessageBox(this, '提示', '确定关闭这个分类吗？与该分类关联的分类规则将一并关闭。', 'warning')
          .then(async () => {
            const { success, desc } = await apiUpdateState(id, { state: Boolean(state) })
            if (success) {
              this.$Message.success('状态修改成功')
            } else {
              desc && this.$Message.error(desc)
            }
          })
          .catch(() => {
            this.getData()
          })
      }
    },
    // 删除分类规则
    deleteClassification({ id }) {
      this.$customMessageBox(this, '提示', '确定删除这个分类吗？', 'warning')
        .then(async () => {
          const { success, desc } = await apiDeleteClassification(id)
          if (success) {
            this.getData()
            this.$Message.success('删除成功')
          } else {
            desc && this.$Message.error(desc)
          }
        })
        .catch(() => {})
    },
    //操作切换
    actionClick(id, { row }) {
      switch (id) {
        case '1':
          this.showAdd('编辑分类', row)
          break
        case '2':
          this.showAdd('详情', row)
          break
        default:
          this.deleteClassification(row)
          break
      }
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
.classification {
  display: flex;
  flex-direction: column;
  &-title {
    padding-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    &-tooltips {
      color: #8c8c8c;
    }
    &-tips {
      margin-right: 8px;
      width: 14px;
      height: 14px;
    }
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
  &-page {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
