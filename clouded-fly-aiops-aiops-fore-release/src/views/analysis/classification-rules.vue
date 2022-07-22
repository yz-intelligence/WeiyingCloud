<template>
  <div class="page-container">
    <c-breadcrumb />
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
              placeholder="请输入关键字/分类"
              clearable
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
              id="rule_button_add"
              class="rule-title-button blue"
              icon="el-icon-plus"
              @click="showManageAdd()"
              size="small"
            >
              新增分类
            </el-button>
            <el-button
              id="rule_button_add"
              class="rule-title-button"
              type="primary"
              icon="el-icon-plus"
              @click="showAdd()"
              size="small"
            >
              新增规则
            </el-button>
          </div>
          <el-divider></el-divider>
          <!-- 中间表格部分 -->
          <div>
            <el-table ref="table" :height="tableHeight" :data="table.rows" :row-style="{ height: '56px' }">
              <el-table-column label="序号" type="index" width="100"> </el-table-column>
              <el-table-column prop="classification" label="分类"> </el-table-column>
              <el-table-column prop="keyWords" label="关键字" :formatter="changeKeyWords"> </el-table-column>
              <el-table-column prop="sourceType" label="来源" :formatter="changeSourceType"> </el-table-column>
              <el-table-column prop="remarks" label="备注"> </el-table-column>
              <el-table-column prop="monitorType" label="监控源类型"> </el-table-column>
              <el-table-column prop="status" label="状态">
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
    <!-- 新增分类规则弹窗 -->
    <classification-rules-edit
      v-if="isRuleShow"
      :visible.sync="isRuleShow"
      :isWatch="isWatch"
      @success="getData"
      :title="formTitle"
      :accessType="accessType"
      :classifyTree="classificationGroups"
      :ClassificationRules="ClassificationRules"
    />
    <!-- 新增分类弹窗 -->
    <manage-dialog :visible.sync="isClassifyShow" title="新增分类" @success="getClassifyTree" />
    <!-- 备注弹窗 -->
    <classification-rules-remarks
      :visible.sync="isRemarksShow"
      v-model="remarks"
      :stateObj="stateObj"
      @cancel="resetStatus"
    />
  </div>
</template>
<script>
import table from '@/mixins/table'
import Refresh from '@/components/common/refresh.vue'
import DiySwitch from '@/components/common/diy-switch.vue'
import TableActions from '@/components/common/table-actions.vue'
import ManageDialog from './components/classification-manage/manage-dialog.vue'
import ClassificationRulesEdit from './components/classification-rules/classification-rules-edit.vue'
import ClassificationRulesRemarks from './components/classification-rules/classification-rules-remarks.vue'
import {
  apiGetClassifyPage,
  apiGetClassifyTree,
  apiDeleteClassifyRules,
  apiGetClassifyPageById
} from '@/apis/classification'
import { apiGetAccessToolsList } from '@/apis/access'
import { isJSONString } from '@/utils'
export default {
  mixins: [table],
  components: {
    ClassificationRulesEdit,
    TableActions,
    DiySwitch,
    ManageDialog,
    ClassificationRulesRemarks,
    Refresh
  },
  name: 'classification-rules',
  data() {
    return {
      searchText: '',
      //编辑弹窗显示
      isRuleShow: false,
      isClassifyShow: false,
      isRemarksShow: false,
      isWatch: false,
      loading: false,
      actions: [
        { name: '详情', id: '1' },
        { name: '编辑', id: '2' },
        { name: '删除', id: '3' }
      ],
      actions2: [{ name: '详情', id: '1' }],
      monitorList: {
        MANUALINPUT: '人工输入',
        AIINPUT: '智能分析'
      },
      formTitle: '新增',
      accessType: {},
      ClassificationRules: {},
      classificationGroups: [],
      remarks: '',
      // 存储状态信息
      stateObj: {
        id: '',
        state: false
      }
    }
  },
  created() {
    this.getData()
    this.getAccessList()
    this.getClassifyTree()
    this.resetForm()
  },
  methods: {
    async getData() {
      let params = {
        ...this.search,
        keyWord: this.searchText
      }
      this.loading = true
      const { success, rows, desc, total } = await apiGetClassifyPage(params)
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
    //搜索方法
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    // 获取监控源类型表
    async getAccessList() {
      this.loading = true
      const { success, desc, data } = await apiGetAccessToolsList()
      this.loading = false
      if (success) {
        const access = {}
        data.forEach(item => {
          access[item.type] = item.title
        })
        this.accessType = access
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取分类树
    async getClassifyTree() {
      this.loading = true
      const { success, data, desc } = await apiGetClassifyTree()
      this.loading = false
      if (success) {
        this.classificationGroups = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 修改分类方式回显值
    changeSourceType(row) {
      return this.monitorList[row.sourceType] || '--'
    },
    // 修改关键字回显
    changeKeyWords({ keyWords }) {
      let renderText = keyWords
      const keyWordObj = isJSONString(keyWords)
      if (keyWordObj) {
        const { content } = JSON.parse(keyWords)
        // 分类规则暂时写死与，以后如果添加或需求再放出这行代码
        // const joinSign = relation === 'or' ? ' 或 ' : ' 与 '
        renderText = content.map(item => item.value).join(' 与 ')
      }
      return renderText
    },
    actionClick(id, { row }) {
      switch (id) {
        case '1':
          this.isWatch = true
          this.showAdd('分类规则详细', row)
          break
        case '2':
          this.isWatch = false
          this.showAdd('编辑分类规则', row)
          break
        default:
          this.deleteClassifyRule(row)
          break
      }
    },
    // 展示新增分类规则弹窗
    async showAdd(title = '新增分类规则', row) {
      this.formTitle = title
      // 修改
      if (row) {
        this.getFormById(row)
      }
      // 新增
      else {
        this.isWatch = false
        this.resetForm()
        this.isRuleShow = true
      }
    },
    // 展示新增分类弹窗
    async showManageAdd(row) {
      this.isClassifyShow = true
    },
    // id查询分类规则详细
    async getFormById(row) {
      const { success, data, desc } = await apiGetClassifyPageById(row.id)
      if (success) {
        let keyWords = JSON.parse(data.keyWords)
        let form = {
          ...data,
          keyWords
        }
        this.ClassificationRules = form
        this.isRuleShow = true
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 删除分类规则
    deleteClassifyRule({ id }) {
      this.$customMessageBox(this, '提示', '确定删除这条规则吗？', 'warning')
        .then(async () => {
          const { success, desc } = await apiDeleteClassifyRules(id)
          if (success) {
            this.getData()
            this.$Message.success('删除成功')
          } else {
            desc && this.$Message.error(desc)
          }
        })
        .catch(() => {})
    },
    // 修改分类规则状态
    statusChange(state, { id }) {
      this.remarks = ''
      this.stateObj = {
        id,
        state
      }
      this.isRemarksShow = true
    },
    resetStatus() {
      this.getData()
    },
    resetForm() {
      this.ClassificationRules = {
        id: '',
        classifyId: '',
        keyWords: {
          relation: 'or',
          content: [
            {
              value: ''
            }
          ]
        },
        sourceType: 'MANUALINPUT',
        monitorType: ''
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
      margin: 5px 0;
      margin-right: 10px;
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
.blue {
  margin-left: 16px;
  border: 1px solid #0176ff;
  color: #0176ff;
}
</style>
