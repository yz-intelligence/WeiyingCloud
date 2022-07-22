<template>
  <div>
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
      </div>
      <el-divider></el-divider>
      <!-- 中间表格部分 -->
      <div class="classification-content">
        <el-table
          id="upgrade_table_upgrade"
          ref="table"
          :height="400"
          :data="table.rows"
          class="classification-content-table"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column prop="classifyName" label="分类" />
          <el-table-column prop="sourceType" label="分类方式" width="100" :formatter="changeSourceType" />
          <el-table-column prop="level" label="级别" width="80" :formatter="changeLevel" />
          <el-table-column prop="eventObj" label="事件对象" />
          <el-table-column prop="summary" min-width="200" label="事件内容" />
          <el-table-column prop="firstTime" label="首次告警" />
          <el-table-column prop="classifyTime" label="分类时间" />
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <table-actions :scope="scope" :actions="actions" @click="actionClick"></table-actions>
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
    <!-- 新增升级修改复用弹窗 -->
    <ai-edit
      v-if="isEditShow"
      :visible.sync="isEditShow"
      :sourceType="editType"
      @success="success"
      :eventId="eventId"
      :keyWords="keyWords"
      :classifyTree="classifyTree"
      :classifyRulesTree="classifyRulesTree"
      :id.sync="rowId"
    />
  </div>
</template>
<script>
import table from '@/mixins/table'
import { mapGetters } from 'vuex'
import { apiGetClassifyTree, apiGetEventClassifyPage, apiGetClassifyRulesTree } from '@/apis/classification'
import TableActions from '@/components/common/table-actions.vue'
import Refresh from '@/components/common/refresh.vue'
import AiEdit from './ai-edit.vue'
export default {
  name: 'AiTable',
  components: {
    TableActions,
    AiEdit,
    Refresh
  },
  mixins: [table],
  computed: {
    ...mapGetters(['levelOpt'])
  },
  props: {
    dayType: {
      type: Number,
      default: 1
    },
    classifyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchText: '',
      loading: false,
      showDialog: false,
      actions: [{ name: '修改分类', id: '1' }],
      isEditShow: false,
      editType: 'MANUALINPUT',
      monitorList: {
        MANUALINPUT: '规则分类',
        AIINPUT: '智能分类'
      },
      // 事件id
      eventId: '',
      // 第一行原类型数据
      keyWords: '',
      // 分类树
      classifyTree: [],
      // 分类规则树
      classifyRulesTree: [],
      // 分类id
      id: this.classifyId,
      // 所选日期
      day: this.dayType,
      rowId: ''
    }
  },
  created() {
    this.getData()
    this.getClassifyTree()
    this.getClassifyRulesTree()
  },
  methods: {
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    async getData() {
      let params = {
        ...this.search,
        keyWord: this.searchText,
        classifyId: this.id,
        dayType: this.day
      }
      this.loading = true
      const { success, rows, desc, total } = await apiGetEventClassifyPage(params)
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
    success() {
      this.getData()
      this.$emit('success')
    },
    actionClick(id, { row }) {
      this.showEdit(row)
    },
    async showEdit(row) {
      this.rowId = row.id
      this.editType = row.sourceType
      this.eventId = row.eventId
      if (row.sourceType === 'MANUALINPUT') {
        this.keyWords = row.keyWords
      } else {
        this.keyWords = row.classifyName
      }
      this.isEditShow = true
    },
    // 获取分类树
    async getClassifyTree() {
      this.loading = true
      const { success, data, desc } = await apiGetClassifyTree()
      this.loading = false
      if (success) {
        this.classifyTree = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取分类规则树
    async getClassifyRulesTree() {
      this.loading = true
      const { success, data, desc } = await apiGetClassifyRulesTree()
      this.loading = false
      if (success) {
        this.classifyRulesTree = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 修改分类方式回显值
    changeSourceType(row) {
      return this.monitorList[row.sourceType] || '--'
    },
    // 修改级别回显值
    changeLevel(row) {
      return this.levelOpt[row.level]
    },
    // 刷新功能
    resetData() {
      this.searchText = ''
      this.getData()
    }
  },
  watch: {
    dayType(e) {
      this.day = e
      this.getData()
    },
    classifyId(e) {
      this.id = e
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
      margin-right: 16px;
    }
    &-button {
      margin: 5px 0;
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
