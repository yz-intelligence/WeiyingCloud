<template>
  <page-container>
    <!-- 顶部搜索 -->
    <div class="page-header">
      <div class="page-actions">
        <div class="page-actions-title">
          <p>未配置降噪规则的监控源将使用默认降噪规则</p>
        </div>
        <div class="page-actions-extra">
          <div>
            <span>
              <el-tooltip effect="dark" content="未响应的事件将在设定的时长后自动关闭" placement="top">
                <i class="point tips el-icon-tip"></i>
              </el-tooltip>
              事件自动关闭时长
            </span>
            <el-select
              size="small"
              v-model="autoCloseTime"
              placeholder="请选择"
              class="page-actions--select"
              @change="handChange"
            >
              <el-option v-for="(value, key) in closeTime" :value="key" :key="key" :label="value"> </el-option>
            </el-select>
          </div>
          <el-input
            size="small"
            class="page-actions--input"
            v-model.trim="searchText"
            :maxlength="100"
            placeholder="请输入关键字"
            @keyup.enter.native="doSearch()"
          >
            <el-button slot="append" size="small" icon="el-icon-search" @click="doSearch()"></el-button>
          </el-input>
          <refresh :loading="loading" @refresh="resetData()" />
          <el-button
            v-if="$hasPermission('DenoiseRules-create')"
            class="add"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="showAdd()"
            >新增</el-button
          >
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 下方表格 -->
    <div class="page-content">
      <div class="page-table" v-loading="loading">
        <el-table
          ref="table"
          :height="tableHeight"
          :data="table.rows"
          highlight-current-row
          :row-style="{ height: '56px' }"
        >
          <el-table-column prop="ruleName" label="规则名称" width="200"> </el-table-column>
          <el-table-column prop="receiveConfNames" label="适用监控源" width="250"> </el-table-column>
          <el-table-column prop="summary" label="合并条件" :formatter="changeSummary">
            <template slot-scope="scope">
              <diy-summary :summary="scope.row.summary"></diy-summary>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="200">
            <template slot-scope="scope">
              <diy-switch
                :state.sync="scope.row.state"
                :row="scope.row"
                @change="statusChange"
                :disabled="!$hasPermission('DenoiseRules-status') || !!scope.row.defaultRule"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <!-- 默认 -->
              <table-actions
                v-if="scope.row.defaultRule"
                :scope="scope"
                :actions="actions0"
                @click="actionClick"
              ></table-actions>
              <!-- 非默认 -->
              <table-actions v-else :scope="scope" :actions="actions" @click="actionClick"></table-actions>
            </template>
          </el-table-column>
        </el-table>
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
    </div>
    <!-- 增加修改复用弹窗 -->
    <noise-edit
      v-if="isShowEdit"
      :title="title"
      :id="openId"
      :defaultRule="defaultRule"
      :noiseform="noiseform"
      :visible.sync="isShowEdit"
      :sourceOpt="sourceOpt"
      :conditionRelation="conditionRelation"
      @close="resetCondition"
      @success="getData"
    ></noise-edit>
  </page-container>
</template>
<script>
import { mapGetters } from 'vuex'

import table from '@/mixins/table'
import TableActions from '@/components/common/table-actions.vue'
import DiySwitch from '@/components/common/diy-switch.vue'
import DiySummary from '@/components/common/diy-summary.vue'
import NoiseEdit from './components/denoise/noise-edit.vue'
import Refresh from '@/components/common/refresh.vue'

import { apiGetConfWithNotRules } from '@/apis/access'
import { apiGetDenoise, apiDeleteDenoise, apiSearchDenoiseById, apiupdateDenoiseStatus } from '@/apis/denoise'
import { apiCreateWxWorkConfig, apiGetConfig } from '@/apis/config'
import { apiGetDenoiseConditions } from '@/apis/dictionary'
export default {
  name: 'EventDenoise',
  mixins: [table],
  components: {
    TableActions,
    DiySwitch,
    DiySummary,
    NoiseEdit,
    Refresh
  },
  data() {
    return {
      searchText: '',
      autoCloseTime: '24',
      title: '',
      loading: false,
      openId: '',
      noiseform: {
        ruleName: '',
        receiveConfs: [],
        conditionRelation: [
          {
            id: 0,
            content: this.conditionRelation,
            mergeContent: [1, 2, 3]
          }
        ],
        state: 1
      },
      defaultRule: false,
      isShowEdit: false,
      actions0: [{ name: '编辑', id: '1', permission: 'DenoiseRules-update' }],
      actions: [
        { name: '编辑', id: '1', permission: 'DenoiseRules-update' },
        { name: '删除', id: '2', permission: 'DenoiseRules-remove' }
      ],
      conditionDictionaryModel: [
        {
          conditionName: '同告警级别',
          conditionExpression: {
            field: 'LEVEL',
            condition: 'eq',
            value: ''
          }
        },
        {
          conditionName: '同事件对象',
          conditionExpression: {
            field: 'EVENT_OBJ',
            condition: 'eq',
            value: ''
          }
        },
        {
          conditionName: '同监控指标',
          conditionExpression: {
            field: 'COMPONENT',
            condition: 'eq',
            value: ''
          }
        },
        {
          conditionName: '同监控源',
          conditionExpression: {
            field: 'MONITOR_CODE',
            condition: 'eq',
            value: ''
          }
        },
        {
          conditionName: '同对象类型',
          conditionExpression: {
            field: 'SOURCE_TYPE',
            condition: 'eq',
            value: ''
          }
        },
        {
          conditionName: '同告警策略',
          conditionExpression: {
            field: 'alarmStrategy',
            condition: 'eq',
            value: ''
          }
        },
        {
          conditionName: '同主机IP',
          conditionExpression: {
            field: 'IP_ADDRESS',
            condition: 'eq',
            value: ''
          }
        }
      ],
      sourceOpt: [],
      conditionRelation: [],
      conditionMap: new Map()
    }
  },
  computed: {
    ...mapGetters(['closeTime'])
  },
  methods: {
    async getData() {
      this.loading = true
      let params = {
        ...this.search,
        ruleName: this.searchText,
        receiveConfName: this.searchText,
        summary: this.searchText
      }
      const { success, rows, desc, total } = await apiGetDenoise(params)
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
    changeSummary(summary) {
      return summary.split('或')
    },
    showAdd(name = '新增降噪规则', data) {
      this.resetCondition()
      this.title = name
      if (data) {
        const { id, defaultRule } = data
        this.openId = id
        this.defaultRule = defaultRule
        this.getDenoiseById(id)
        this.getSource(id)
      } else {
        this.openId = ''
        this.defaultRule = false
        this.getSource('')
      }
      setTimeout(() => {
        this.isShowEdit = true
      }, 300)
    },
    actionClick(id, { row }) {
      switch (id) {
        // 修改
        case '1':
          this.showAdd('编辑降噪规则', row)
          break
        // 启动
        default:
          this.deleteDenoise(row)
          break
      }
    },
    async deleteDenoise(row) {
      this.$customMessageBox(this, '提示', '确定删除这条规则吗？', 'warning')
        .then(async () => {
          let { id } = row
          const { success, desc } = await apiDeleteDenoise(id)
          if (success) {
            this.$Message.success('删除成功')
            this.getData()
          } else {
            desc && this.$Message.error(desc)
          }
        })
        .catch(() => {})
    },
    // 编辑操作填充值
    async getDenoiseById(id) {
      const { success, data, desc } = await apiSearchDenoiseById(id)
      if (success) {
        const { ruleName, state, conditionRelation } = data[0]
        let receiveConfs = data[1].map(item => {
          return item.id
        })
        this.noiseform = {
          ruleName,
          state,
          conditionRelation: this.setCondition(conditionRelation),
          receiveConfs
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 设置合并条件的内容
    setCondition(conditionRelation) {
      let { contents } = JSON.parse(conditionRelation)
      const { conditionMap } = this
      let data = []
      let tran = {}
      contents.forEach((item, index) => {
        tran = {
          id: index,
          content: this.conditionRelation,
          mergeContent: []
        }
        item.contents.forEach(it => {
          tran.mergeContent.push(conditionMap.get(it.field))
        })
        data.push(tran)
      })
      return data
    },
    // 搜索监控源内容
    async getSource(ruleId) {
      let params = {
        ruleId
      }
      const { success, data, desc } = await apiGetConfWithNotRules(params)
      if (success) {
        this.sourceOpt = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取合并条件的规则
    async getConditionRelation() {
      const { success, data, desc } = await apiGetDenoiseConditions()
      let condition = []
      let map = new Map()
      if (success) {
        condition = data.map((item, index) => {
          map.set(JSON.parse(item.conditionExpression).field, index)
          return { ...item, conditionExpression: JSON.parse(item.conditionExpression) }
        })
        this.conditionMap = map
      } else {
        condition = this.conditionDictionaryModel
        condition.forEach((item, index) => {
          map.set(item.conditionExpression.field, index)
        })
      }
      this.conditionRelation = condition
    },
    // 获取设置默认时间
    async getTime() {
      const params = {
        name: 'TimeSpan',
        page: 1,
        limit: 10
      }
      const { success, rows, desc } = await apiGetConfig(params)
      if (success) {
        if (rows.length) {
          const time = JSON.parse(rows[0].value)
          this.autoCloseTime = time.value || '24'
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 修改时间
    async handChange(time) {
      const data = {
        name: 'TimeSpan',
        type: 'EventClose',
        value: { value: time, unit: 'h' }
      }
      const { success, desc } = await apiCreateWxWorkConfig(data)
      if (success) {
        this.$Message.success('时间设置成功')
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 修改状态
    async statusChange(state, row) {
      const { id } = row
      let params = {
        state
      }
      const { success, rows, desc, total } = await apiupdateDenoiseStatus(id, params)
      if (success) {
        this.$Message.success('状态修改成功')
      } else {
        desc && this.$Message.error(desc)
      }
    },
    resetCondition() {
      this.noiseform = {
        ruleName: '',
        receiveConfs: [],
        conditionRelation: [
          {
            id: 0,
            content: this.conditionRelation,
            mergeContent: [1, 2, 3]
          }
        ],
        state: 1
      }
      this.openId = ''
    },
    // 刷新功能
    resetData() {
      this.searchText = ''
      this.getData()
    }
  },
  created() {
    this.loading = true
    this.getData()
    this.getTime()
    this.getConditionRelation()
    this.resetCondition()
  }
}
</script>
<style lang="scss" scoped>
.page {
  &-actions {
    padding-top: 16px;
    @include flex(space-between, center);
    &--select {
      width: 98px;
      margin-left: 5px;
      &::v-deep .el-input__inner {
        text-align: left;
      }
    }
    &--input {
      width: 240px;
      margin: 2px 16px;
    }
    &::v-deep .el-input-group__append {
      padding: 0 19px;
      background-color: #0076ff;
      color: #fff;
    }
    &-title {
      display: flex;
      font-size: 16px;
      color: #333;
      p {
        margin: auto 0;
      }
    }
    &-extra {
      @include flex(space-around, center);
      span {
        font-size: 14px;
        color: #8c8c8c;
      }
    }
  }
  &-table-pagination {
    margin-top: 16px;
    font-size: 14px;
    @include flex(flex-end);
  }
}
.point {
  cursor: pointer;
}
.tips {
  width: 14px;
  height: 14px;
  position: relative;
}
.add {
  margin-left: 16px;
}
</style>
