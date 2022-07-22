<template>
  <div class="expand">
    <el-tabs class="event-tabs" v-model="currentTab">
      <el-tab-pane label="主事件详情" name="detail">
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
            <span class="expand-content-label">恢复时间</span>
            <span class="expand-content-value">{{ row.recoverTime || '--' }}</span>
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
            <span class="expand-content-value">{{ row.ownerName || row.userName || '--' }}</span>
          </div>
          <div class="expand-content-item">
            <!-- 接口未更新 -->
            <span class="expand-content-label">区域</span>
            <span class="expand-content-value">{{ JSON.parse(row.props).ZONE || '--' }}</span>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="从事件" name="list">
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
                :formatter="item.formatter"
                :resizable="item.resizable"
                show-overflow-tooltip
              />
            </template>
            <el-table-column fixed="right" align="left" width="60" label="操作">
              <template slot-scope="scope">
                <span class="blue" @click="doShowDetail(scope)">详情</span>
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
import { apiGetSlave } from '@/apis/event'
import EventDetail from './event-detail'
import { mapGetters } from 'vuex'
export default {
  name: 'MasterExpand',
  props: {
    theight: {
      type: String,
      default: '170'
    },
    // 具体内容
    record: Object,
    // 状态和级别的颜色表
    searchOpt: Object
  },
  components: { EventDetail },
  data() {
    return {
      currentTab: 'detail',
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
          formatter: this.formatZone
        },
        {
          title: '首次告警',
          key: 'firstTime',
          width: 135
        },
        {
          title: '置信度',
          key: 'confidence',
          width: 75
        }
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
  computed: {
    row() {
      const obj = {}
      const row = this.record
      Object.keys(row).forEach(key => {
        obj[key] = row[key] === null || row[key] === '' ? '--' : row[key]
      })
      return obj
    },
    ...mapGetters(['validityOpt'])
  },
  created() {
    if (this.$parent.$el?.offsetParent?.className !== 'el-table__fixed-body-wrapper') {
      this.loadTable()
    }
  },
  methods: {
    formatCounts({ counts = '--', level }) {
      return level === 0 && counts === 0 ? '--' : counts
    },
    //格式化区域字段
    formatZone({ props }) {
      return props ? JSON.parse(props).ZONE || '--' : '--'
    },
    doShowDetail({ row }) {
      this.detailCompessRow = row
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
        row: { id },
        currentPage: page,
        pageSize: limit
      } = this
      this.tableLoading = true
      const { success, desc, rows, total } = await apiGetSlave({ id, page, limit })
      this.tableLoading = false
      if (success) {
        this.tableTotal = total
        this.tableData = rows
      } else {
        desc && this.$Message.error(desc)
      }
    },
    getCols() {
      if (this.row.type === 'Compress') {
        this.detailCompessPops.hideTags = true
        this.detailCompessPops.hideClose = true

        return this.columns.filter(item => {
          return item.key !== 'counts'
        })
      }

      this.detailCompessPops.hideTags = false
      this.detailCompessPops.hideClose = false

      return this.columns
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
