<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-content">
        <div class="rule">
          <!-- 顶部搜索部分 -->
          <div class="rule-title">
            <!-- 时间选择器 -->
            <div class="rule-title-time">
              <span class="rule-title-time--label">结束时间</span>
              <el-date-picker
                v-model="time"
                class="rule-title-time--input"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="至"
                size="small"
                :editable="false"
              />
            </div>
            <!-- 中间四个多选框 -->
            <el-checkbox-group v-model="checkType" class="rule-title-checkbox">
              <el-checkbox id="maintenance_checkbox_process" label="1">正在进行</el-checkbox>
              <el-checkbox id="maintenance_checkbox_processing" label="0">即将进行</el-checkbox>
              <el-checkbox id="maintenance_checkbox_pause" label="2">已暂停</el-checkbox>
              <el-checkbox id="maintenance_checkbox_end" label="3">已结束</el-checkbox>
            </el-checkbox-group>
            <!-- 最右边各种图标按钮 -->
            <div class="rule-title-button">
              <refresh :loading="loading" @refresh="resetData()" />
              <div
                id="maintenance_div_search"
                class="rule-title-button-icon hoverable"
                title="搜索"
                @click="doSearch()"
              >
                <i class="el-icon-search eIcon"></i>
              </div>
              <el-button
                v-if="$hasPermission('Maintain-create')"
                id="maintenance_button_add"
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showAdd()"
              >
                新增</el-button
              >
            </div>
          </div>
          <el-divider></el-divider>
          <!-- 中间表格部分 -->
          <div class="rule-content" v-loading="loading">
            <el-table
              id="maintenance_table_mainten"
              ref="table"
              :height="tableHeight"
              :data="table.rows"
              row-key="id"
              highlight-current-row
              :expand-row-keys="expandRowKeys"
              @cell-click="cellClick"
              class="rule-content-table"
              :row-style="{ height: '56px' }"
            >
              <el-table-column type="expand" width="30">
                <template slot-scope="props">
                  <mp-item :row="props.row"></mp-item>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="维护期名称"> </el-table-column>
              <el-table-column prop="ruleSummary" label="规则描述" :formatter="changeSummary"> </el-table-column>
              <el-table-column prop="effectiveEnd" label="结束时间" width="200"> </el-table-column>
              <el-table-column prop="status" align="center" label="状态" width="120">
                <template slot-scope="scope">
                  <el-tag class="border" :type="statusStyle[scope.row.status]" size="small" disable-transitions>
                    {{ sourceStatus[scope.row.status] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column width="200" label="操作">
                <template slot-scope="scope">
                  <table-actions
                    :scope="scope"
                    :actions="getTableActions(scope.row.status)"
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
    <!-- 新增修改复用弹窗 -->
    <maintenance-edit v-if="isShow" :mpForm="ruleform" :visible.sync="isShow" :title="formTitle" @success="getData" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import table from '@/mixins/table'
import Refresh from '@/components/common/refresh.vue'
import TableActions from '@/components/common/table-actions.vue'
import MaintenanceEdit from './components/maintenance/edit.vue'
import MpItem from './components/maintenance/mp-item.vue'
import { getMaintenances, pauseMaintenances, delMaintenances } from '@/apis/maintenances'
export default {
  name: 'MonitorMaintenance',
  components: {
    TableActions,
    MaintenanceEdit,
    MpItem,
    Refresh
  },
  mixins: [table],
  computed: {
    ...mapGetters(['levelOpt', 'sourceStatus'])
  },
  data() {
    return {
      expandRowKeys: [], // 展开行的id
      cellClickCacheId: '',
      loading: false,
      time: [],
      checkType: [],
      formTitle: '',
      isShow: false,
      error: [false, false, false],
      ruleform: {
        name: '',
        effectiveTimes: [],
        periodType: '0',
        periodCheck: '',
        periodTimes: ['00:00', '23:59'],
        summary: '',
        relation: 'and',
        contents: [
          {
            field: 'NAME',
            condition: 'in',
            value: ''
          }
        ]
      },
      actions0: [
        { name: '编辑', id: '1' },
        { name: '克隆', id: '2' },
        { name: '删除', id: '3' }
      ],
      actions1: [
        { name: '暂停', id: '4' },
        { name: '克隆', id: '2' }
      ],
      actions2: [
        { name: '编辑', id: '1' },
        { name: '启动', id: '5' },
        { name: '克隆', id: '2' },
        { name: '删除', id: '3' }
      ],
      actions3: [
        { name: '克隆', id: '2' },
        { name: '删除', id: '3' }
      ],
      statusStyle: {
        0: '-',
        1: 'success',
        2: 'danger',
        3: 'info'
      }
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let params = {
        ...this.search
      }
      if (!!this.checkType) {
        params.status = this.checkType.toString()
      }
      if (!!this.time) {
        params.startTime = this.time[0]
        params.endTime = this.time[1]
      }
      const { success, rows, desc, total } = await getMaintenances(params)
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
    getTableActions(status) {
      let editAction = { name: '编辑', id: '1', permission: 'Maintain-update' }
      let startAction = { name: '启动', id: '5', permission: 'Maintain-paused' }
      let pauseAction = { name: '暂停', id: '4', permission: 'Maintain-paused' }
      let cloneAction = { name: '克隆', id: '2', permission: 'Maintain-clone' }
      let deleteAction = { name: '删除', id: '3', permission: 'Maintain-remove' }
      const actionMap = {
        0: [editAction, cloneAction, deleteAction],
        1: [pauseAction, cloneAction],
        2: [editAction, startAction, cloneAction, deleteAction],
        3: [cloneAction, deleteAction]
      }
      return actionMap[status] || []
    },
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    cellClick(row, column, event) {
      if (event.cellIndex != 0 && column.label !== '操作') {
        const { id } = row
        const { expandRowKeys, cellClickCacheId } = this
        this.expandRowKeys = expandRowKeys.length > 0 ? (cellClickCacheId === id ? [] : [id]) : [id]
        this.cellClickCacheId = this.expandRowKeys.length === 0 ? '' : id
      }
    },
    resetData() {
      this.time = []
      this.checkType = []
      this.getData()
    },
    actionClick(id, { row }) {
      switch (id) {
        // 编辑
        case '1':
          this.showAdd('修改维护期', row)
          break
        //克隆
        case '2':
          this.showAdd('克隆维护期', row)
          break
        // 删除
        case '3':
          this.delete(row)
          break
        // 暂停
        case '4':
          this.pause(row)
          break
        // 启动
        default:
          this.restart(row)
          break
      }
    },
    // 初始化ruleForm表
    resetRuleForm() {
      this.ruleform = {
        name: '',
        effectiveTimes: [],
        periodType: 0,
        periodCheck: '',
        periodTimes: ['00:00', '23:59'],
        summary: '',
        relation: 'and',
        contents: [
          {
            field: 'NAME',
            condition: 'in',
            value: ''
          }
        ]
      }
    },
    // 填充弹窗内容
    setForm(row) {
      let rule = JSON.parse(row.rules)
      let ruleform = {
        ...row,
        relation: rule.relation,
        contents: rule.contents
      }
      if (!!row.effectiveBegin) {
        ruleform.effectiveTimes = [row.effectiveBegin, row.effectiveEnd]
      } else {
        ruleform.effectiveTimes = []
      }
      if (row.periodType !== 0) {
        let beginDate = new Date()
        let endDate = new Date()
        beginDate.setHours(Math.floor(row.periodBegin / 60))
        beginDate.setMinutes(row.periodBegin % 60)
        endDate.setHours(Math.floor(row.periodEnd / 60))
        endDate.setMinutes(row.periodEnd % 60)
        ruleform.periodTimes = [dayjs(beginDate).format('HH:mm'), dayjs(endDate).format('HH:mm')]

        if (row.periodType !== 1) {
          ruleform.periodCheck = row.periodCheck.split(',')
        }
      }

      if (this.formTitle === '克隆维护期') {
        ruleform.id = ''
        ruleform.name = ruleform.name + ' - 副本'
      }
      this.ruleform = ruleform
    },
    async showAdd(title = '新增维护期', row) {
      this.formTitle = title
      this.resetRuleForm()
      this.error = [true, true, true]
      if (row) {
        this.error = [false, false, false]
        this.setForm(row)
      }
      this.isShow = true
    },
    closeAdd() {
      this.isShow = false
    },
    // 暂停维护期
    async pause(row) {
      const { success, data, desc } = await pauseMaintenances(row.id)
      if (success) {
        this.$Message.success('暂停成功')
        this.getData()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    async restart(row) {
      const { success, data, desc } = await pauseMaintenances(row.id)
      if (success) {
        this.$Message.success('启动成功')
        this.getData()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 删除维护期
    delete(row) {
      this.$customMessageBox(this, '提示', '确定删除这个维护期吗？', 'warning')
        .then(async () => {
          const { success, desc } = await delMaintenances(row.id)
          if (success) {
            this.$Message.success('删除成功')
            this.getData()
          } else {
            desc && this.$Message.error(desc)
          }
        })
        .catch(() => {})
    },
    changeSummary(row, column) {
      let arr = row.ruleSummary.split(' ')
      let index = arr.indexOf('事件级别')
      if (index != -1) {
        let newArr = arr[index + 2].split(',').map(item => this.levelOpt[item])
        arr[index + 2] = newArr.join(',')
        return arr.join(' ')
      } else {
        return row.ruleSummary
      }
    }
  },
  created() {
    this.loading = true
    this.getData()
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
    &-time {
      margin: 0 20px;
      &--label {
        font-size: 14px;
        margin: 0 8px;
      }
      &--input {
        width: 370px;
      }
    }
    &-checkbox {
      color: black !important;
    }
    &-button {
      display: flex;
      flex-direction: row;
      &-icon {
        margin: auto 5px;
        color: #0076ff;
        font-size: 18px;
        width: 28px;
        height: 24px;
        border-radius: 14px;
        display: flex;
        .eIcon {
          margin: auto;
        }
      }
    }
  }
  &-content {
    &-form {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      flex-wrap: wrap;
      height: 219px;
      font-size: 14px;
      &-item {
        display: flex;
        width: 45%;
        padding: 2px 20px 2px 0;
        span {
          word-break: break-all;
        }
      }
      &::v-deep .el-form-item {
        margin: 0;
      }
    }
  }
  &-page {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
.border {
  border-radius: 16px;
}
.el-checkbox {
  margin-right: 16px;
}
</style>
