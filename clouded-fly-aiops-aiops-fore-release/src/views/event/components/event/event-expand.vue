<template>
  <div class="expand">
    <el-tabs class="event-tabs" v-model="currentTab">
      <el-tab-pane label="事件详情" name="detail">
        <el-row class="expand-content" type="flex" v-if="record != undefined">
          <div class="expand-content-item">
            <span class="expand-content-label">事件ID</span>
            <span class="expand-content-value">{{ row.id }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">有效性</span>
            <span class="expand-content-value">{{ validityOpt[row.validity] }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">事件标题</span>
            <span class="expand-content-value">{{ row.name }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">首次告警</span>
            <span class="expand-content-value">{{ row.firstTime }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">事件内容</span>
            <span class="expand-content-value">{{ row.summary }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">最近告警</span>
            <span class="expand-content-value">{{ row.lastTime }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">事件对象</span>
            <span class="expand-content-value">{{ row.eventObj }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">告警次数</span>
            <span class="expand-content-value">{{ formatCounts(row) }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">事件级别</span>
            <span class="expand-content-value">{{ searchOpt.level.options[row.level] || '未分类' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">入库时间</span>
            <span class="expand-content-value">{{ row.createTime }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">监控源类型</span>
            <span class="expand-content-value">{{ row.agent || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <!-- 接口未更新 -->
            <span class="expand-content-label">监控源</span>
            <span class="expand-content-value">{{ row.monitorCode || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">告警信息</span>
            <span class="expand-content-value">{{ row.alertInfo || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">恢复时间</span>
            <span class="expand-content-value">{{ row.recoverTime || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">监控项目</span>
            <span class="expand-content-value">{{ row.monitoringItems || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">对象类型</span>
            <span class="expand-content-value">{{ row.componentType || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">关闭时间</span>
            <span class="expand-content-value">{{ row.closeTime || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">监控指标</span>
            <span class="expand-content-value">{{ row.component || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">告警策略</span>
            <span class="expand-content-value">{{ row.kpiId || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">主机IP</span>
            <span class="expand-content-value">{{ row.ipAddress || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <span class="expand-content-label">所属人员</span>
            <span class="expand-content-value">{{ row.ownerName || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <!-- 接口未更新 -->
            <span class="expand-content-label">区域</span>
            <span class="expand-content-value">{{ row | zoneFormat }}</span>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="isShowRecord" :label="row.type === 'Merger' ? '合并记录' : '降噪记录'" name="list">
        <el-row class="expand-table" v-loading="tableLoading">
          <el-table :height="theight" size="small" :data="tableData">
            <template v-for="item of getCols()">
              <!-- 状态 -->
              <el-table-column
                v-if="item.key === 'status'"
                :key="item.key"
                :prop="item.key"
                :label="item.title"
                align="center"
                :min-width="item.minWidth"
              >
                <template slot-scope="scope">
                  <div :class="`chip chip--xs chip--outline ${searchOpt.status.class[scope.row.status]}`">
                    <span class="chip__content">{{
                      scope.row.maintenanceId ? '维护期' : searchOpt.status.options[scope.row.status]
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 级别 -->
              <el-table-column
                v-else-if="item.key === 'level'"
                :key="item.key"
                :prop="item.key"
                :label="item.title"
                align="center"
                :min-width="item.minWidth"
              >
                <template slot-scope="scope">
                  <div :class="`chip chip--xs ${searchOpt.level.class[scope.row.level]}`">
                    <span class="chip__content">{{ searchOpt.level.options[scope.row.level] || '未分类' }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 其他 -->
              <el-table-column
                v-else
                :key="item.key"
                :prop="item.key"
                :label="item.title"
                :align="item.align"
                :sortable="item.sortable"
                :min-width="item.minWidth"
                :formatter="item.formatter"
                :resizable="item.resizable"
                show-overflow-tooltip
              />
            </template>
            <el-table-column fixed="right" align="left" width="150" label="操作">
              <template slot-scope="scope">
                <table-actions :scope="scope" :actions="getActions(scope)" @click="actionClick"></table-actions>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin: 10px; overflow: hidden">
            <div class="text-center">
              <el-pagination
                class="page-table-pagination simple-pager"
                @size-change="pageSizeChange"
                @current-change="pageChange"
                :current-page="currentPage"
                :page-size="pageSize"
                simple
                layout="total, prev, pager, next, sizes"
                :total="tableTotal"
              >
              </el-pagination>
            </div>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <EventDetail
      v-if="showCompessDetail"
      :visible.sync="showCompessDetail"
      :searchOpt="searchOpt"
      :row="detailCompessRow"
      :hideClose="hideCompessClose"
      v-bind="detailCompessPops"
    ></EventDetail>
  </div>
</template>
<script>
import {
  apiGetOriginals,
  apiGetMergersEvents,
  apiGetHistoryEventsMergers,
  apiNoiseReductionMistake
} from '@/apis/event'
import EventDetail from './event-detail'
import TableActions from '@/components/common/table-actions.vue'
import { mapGetters } from 'vuex'
//格式化区域字段
const formatZone = ({ props }) => {
  let result = '--'
  if (props === '--') {
    return props
  }
  try {
    result = JSON.parse(props)?.ZONE
  } catch (error) {
    console.log('zone-error', error)
  }
  return result
}
export default {
  name: 'EventExpand',
  components: { EventDetail, TableActions },
  props: {
    tab: {
      type: String,
      default: ''
    },
    theight: {
      type: String,
      default: '220'
    },
    record: Object,
    searchOpt: Object,
    history: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentTab: this.tab || 'detail',
      baseActions: [{ name: '详情', id: '2' }],
      noiseActions: [{ name: '降噪错误', id: '1' }],
      columns: [
        {
          title: '级别',
          key: 'level',
          sortable: 'custom',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '主机',
          key: 'eventObj'
        },
        {
          title: '事件标题',
          key: 'name'
        },
        {
          title: '事件内容',
          key: 'summary'
        },
        {
          title: '区域',
          key: 'props',
          formatter: formatZone
        },
        {
          title: '次数',
          key: 'counts',
          align: 'center',
          width: 75
        },
        {
          title: '首次告警',
          key: 'firstTime',
          width: 135
        }
      ],
      denoiseColumns: [
        {
          title: '事件标题',
          key: 'name'
        },
        {
          title: '事件对象',
          key: 'eventObj'
        },
        {
          title: '事件内容',
          key: 'summary'
        },
        {
          title: '级别',
          key: 'level',
          sortable: 'custom',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '降噪类型',
          key: 'noiseReductionType',
          formatter: this.formatNoiseType
        },
        { title: '最近告警', key: 'lastTime', minWidth: 135 }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tableTotal: 0,
      tableLoading: false,
      showCompessDetail: false,
      detailCompessRow: {},
      detailCompessPops: {
        hideTags: true,
        hideResponse: true,
        hideMerger: true,
        hideRemark: true,
        hideClose: true
      },
      hideCompessClose: true
    }
  },
  filters: {
    zoneFormat: formatZone
  },
  computed: {
    row() {
      const obj = {}
      const row = this.record
      Object.keys(row).forEach(key => {
        obj[key] = row[key] === null || row[key] === '' ? '--' : row[key]
      })
      // console.log(obj)
      return obj
    },
    // 是否显示降噪记录
    isShowRecord() {
      const {
        tableData,
        row: { type, id }
      } = this
      // 压缩
      const isShowCompress =
        type === 'Compress' && (tableData.length > 1 || (tableData.length === 1 && tableData[0].id !== id))
      // 合并
      const isShowMerger = type === 'Merger'
      return isShowCompress || isShowMerger
    },
    ...mapGetters(['validityOpt'])
  },
  created() {
    if (this.$parent.$el?.offsetParent.className !== 'el-table__fixed-body-wrapper') {
      this.loadTable()
    }
  },
  methods: {
    formatNoiseType({ noiseReductionType }) {
      const noiseTypes = {
        0: '规则降噪',
        1: '模型降噪'
      }
      return noiseTypes[noiseReductionType] || '--'
    },
    formatCounts({ counts = '--', level }) {
      return level === 0 && counts === 0 ? '--' : counts
    },
    /**
     * 获取操作按钮
     * @param {Object} scope 当前行数据
     * @returns {Array} 操作按钮数组
     */
    getActions({ row }) {
      const { id, noiseReductionType } = row
      const isShowNoise = id !== this.row.id && noiseReductionType === 1
      return isShowNoise ? [...this.baseActions, ...this.noiseActions] : this.baseActions
    },
    actionClick(id, { row }) {
      switch (id) {
        case '1':
          this.$customMessageBox(this, '提示', '请确定是否标记为降噪错误？', 'warning', {
            confirmButtonText: '降噪错误'
          })
            .then(async () => {
              const { success, desc } = await apiNoiseReductionMistake(row.id)
              if (success) {
                this.$Message.success('标注成功')
                this.pageSizeChange(this.pageSize)
              } else {
                desc && this.$Message.error(desc)
              }
            })
            .catch(() => {})
          break
        case '2':
          this.doShowDetail(row)
          break
        default:
      }
    },
    setTab(tab) {
      this.currentTab = tab
    },
    doShowDetail(row) {
      this.detailCompessRow = row
      this.row.type === 'Merger' && (this.hideCompessClose = row.status === 99) // 如果是合并记录判断事件是否关闭来决定要不要显示详情中的事件关闭按钮
      this.showCompessDetail = true
    },
    pageChange(currentPage) {
      this.currentPage = currentPage
      this.loadTable()
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.loadTable()
    },
    async loadTable() {
      const {
        row: { id, type, status },
        currentPage: page,
        pageSize: limit
      } = this
      const loadApis = {
        Compress: apiGetOriginals,
        Merger: apiGetMergersEvents
      }
      let loadApi = loadApis[type] || apiGetHistoryEventsMergers
      // 当压缩事件变为处于已关闭状态，切换回History接口
      if (type === 'Merger' && status === 99) {
        loadApi = apiGetHistoryEventsMergers
      }
      this.tableLoading = true
      const { success, desc, rows, total } = await loadApi(id, { page, limit })
      this.tableLoading = false
      if (success) {
        this.tableTotal = total
        this.tableData = rows
      } else {
        desc && this.$Message.error(desc)
      }
    },
    getCols() {
      let columns = this.columns
      switch (this.row.type) {
        // 降噪
        case 'Compress':
          this.detailCompessPops.hideTags = true
          this.detailCompessPops.hideClose = true
          return this.denoiseColumns
        // 合并
        case 'Merger':
          break
        default:
      }
      this.detailCompessPops.hideTags = false
      this.detailCompessPops.hideClose = false

      return columns
    }
  }
}
</script>

<style lang="scss" scoped>
@import './detail.scss';
.detail-content {
  padding: 16px;
}

.event-detail {
  &::v-deep .el-dialog__header {
    padding: 0;
  }
  &::v-deep .el-card__body {
    padding: 0;
  }
  &::v-deep .el-dialog__headerbtn {
    z-index: 10;
  }
}
.detail-tags {
  padding: 16px;
}
.detail-pop-buttons {
  padding-top: 12px;
  @include flex();
}
.detail-tags-item {
  margin-right: 8px;
}
.page-table-pagination {
  @include flex(flex-end);
}
.expand {
  &-content,
  &-table {
    min-height: 230px;
  }
}
.blue {
  color: #0076ff;
}
</style>
