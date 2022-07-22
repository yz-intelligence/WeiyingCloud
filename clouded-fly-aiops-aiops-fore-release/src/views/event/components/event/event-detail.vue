<template>
  <div class="event-detail">
    <el-dialog
      width="1040px"
      ref="dialog"
      center
      :close-on-click-modal="!isGuiding"
      :close-on-press-escape="!isGuiding"
      :visible.sync="editVisible"
      @close="close"
    >
      <template slot="title"></template>
      <el-tabs class="event-tabs" v-model="currentTab">
        <el-tab-pane label="事件详情" name="detail" class="pt-3">
          <el-card :padding="0" class="" style="flex: 1" :bordered="true">
            <el-row :gutter="0" type="flex">
              <el-col :span="18" ref="content" class="detail-main">
                <el-row ref="detail" class="expand-content detail-content">
                  <div class="expand-content-item">
                    <span class="expand-content-label">事件ID</span>
                    <span class="expand-content-value">{{ _row.id }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">有效性</span>
                    <span class="expand-content-value">{{ validityOpt[_row.validity] }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">事件标题</span>
                    <span class="expand-content-value">{{ _row.name }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">首次告警</span>
                    <span class="expand-content-value">{{ _row.firstTime }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">事件内容</span>
                    <span class="expand-content-value">{{ _row.summary }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">最近告警</span>
                    <span class="expand-content-value">{{ _row.lastTime }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">事件对象</span>
                    <span class="expand-content-value">{{ _row.eventObj }}</span>
                  </div>

                  <div class="expand-content-item">
                    <span class="expand-content-label">告警次数</span>
                    <span class="expand-content-value">{{ formatCounts(_row) }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">事件级别</span>
                    <span class="expand-content-value">{{ _searchOpt.level.options[_row.level] }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">入库时间</span>
                    <span class="expand-content-value">{{ _row.createTime }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">事件状态</span>
                    <span class="expand-content-value">{{
                      _row.maintenanceId && _row.maintenanceId !== '--'
                        ? '维护期'
                        : _searchOpt.status.options[_row.status]
                    }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">监控源类型</span>
                    <span class="expand-content-value">{{ _row.agent || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">告警信息</span>
                    <span class="expand-content-value">{{ _row.alertInfo || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">恢复时间</span>
                    <span class="expand-content-value">{{ _row.recoverTime || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">监控项目</span>
                    <span class="expand-content-value">{{ _row.monitoringItems || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">对象类型</span>
                    <span class="expand-content-value">{{ _row.componentType || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <!-- 接口未更新 -->
                    <span class="expand-content-label">监控源</span>
                    <span class="expand-content-value">{{ _row.monitorCode || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">关闭时间</span>
                    <span class="expand-content-value">{{ _row.closeTime || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">监控指标</span>
                    <span class="expand-content-value">{{ _row.component || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">告警策略</span>
                    <span class="expand-content-value">{{ _row.kpiId || '--' }}</span>
                  </div>

                  <div class="expand-content-item">
                    <span class="expand-content-label">主机IP</span>
                    <span class="expand-content-value">{{ _row.ipAddress || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <span class="expand-content-label">所属人员</span>
                    <span class="expand-content-value">{{ _row.ownerName || '--' }}</span>
                  </div>
                  <div class="expand-content-item">
                    <!-- 接口未更新 -->
                    <span class="expand-content-label">区域</span>
                    <span class="expand-content-value">{{ row | zoneFormat }}</span>
                  </div>
                </el-row>
                <el-row
                  ref="tags"
                  v-if="!hideTags"
                  v-loading="tagsLoading"
                  class="p-3"
                  style="border-top: 1px solid #eee"
                >
                  <el-col :span="24" class="detail-tags">
                    <el-tag
                      v-for="(item, i) in tags"
                      :key="item.id"
                      :name="item.name"
                      class="detail-tags-item"
                      type="info"
                      effect="plain"
                      closable
                      @close="deleteTags(item.id, i)"
                      >{{ item.name }}</el-tag
                    >
                    <el-popover
                      popper-class="popover-light"
                      ref="tagPoptip"
                      id="tagPoptip"
                      v-model="showTagPoptip"
                      placement="top"
                      @hide="tagInp = ''"
                    >
                      <div v-if="isGuiding" class="guide-mask"></div>
                      <div id="popContent">
                        <el-input
                          ref="tagInp"
                          v-model.trim="tagInp"
                          placeholder="请输入标签"
                          :maxlength="10"
                          size="small"
                          @keyup.enter="addTag"
                        />
                        <div class="detail-pop-buttons">
                          <el-button size="mini" plain @click="showTagPoptip = false">取消</el-button>
                          <el-button
                            ref="saveTagBtn"
                            id="eventDetailSaveTagBtn"
                            :loading="tagBeingSaved"
                            type="primary"
                            size="mini"
                            plain
                            @click="addTag"
                            >确定</el-button
                          >
                        </div>
                      </div>
                      <el-button
                        ref="OpenTagBtn"
                        slot="reference"
                        size="small"
                        type="primary"
                        plain
                        @click="doShowTagAdd"
                        >新增标签</el-button
                      >
                    </el-popover>
                  </el-col>
                </el-row>
              </el-col>
              <el-col ref="record" v-loading="recordsLoading" :span="6" class="detail-aside">
                <el-timeline>
                  <el-timeline-item v-for="(item, i) in records" :key="i">
                    <div class="d-flex">
                      <p style="flex: 1" class="content" :title="item.msg">
                        {{ item.msg }}
                      </p>
                    </div>
                    <p class="time">{{ item.bz }}</p>
                    <p class="time text-muted">{{ formatTime(item.createTime) }}</p>
                  </el-timeline-item>

                  <el-timeline-item v-show="loaded">
                    <p class="content">事件发生</p>
                    <p class="time text-muted">{{ row.lastTime }}</p>
                  </el-timeline-item>
                </el-timeline>
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>
        <el-tab-pane v-if="isShowRecord" :label="row.type === 'Merger' ? '合并记录' : '降噪记录'" name="list">
          <el-table height="350" size="small" :data="tableData" v-loading="tableLoading">
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
                  <div :class="`chip chip--xs chip--outline ${_searchOpt.status.class[scope.row.status]}`">
                    <span class="chip__content">{{
                      scope.row.maintenanceId ? '维护期' : _searchOpt.status.options[scope.row.status]
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
                  <div :class="`chip chip--xs ${_searchOpt.level.class[scope.row.level]}`">
                    <span class="chip__content">{{ _searchOpt.level.options[scope.row.level] || '未分类' }}</span>
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
        </el-tab-pane>
      </el-tabs>
      <div v-if="currentTab === 'detail'" slot="footer" class="text-center">
        <div class="footer-warp">
          <div class="footer-buttons">
            <el-button
              v-if="$hasPermission('ActiveEventList-response') && !hideResponse && row.status === 0"
              @click="response"
              size="small"
              type="primary"
              >响应</el-button
            >
            <el-button
              v-if="$hasPermission('ActiveEventList-remark') && !hideRemark"
              @click="addRemark"
              size="small"
              type="primary"
              >新增备注</el-button
            >
            <el-button
              v-if="$hasPermission('ActiveEventList-close') && row.status !== 99"
              v-show="!hideClose"
              @click="closeEvent"
              size="small"
              type="primary"
              >事件关闭</el-button
            >
            <el-button @click="handleShowSourceReport" :loading="isLoadingSourceReport" size="small" plain
              >原始事件<i
                class="el-icon--right"
                :class="isShowSourceReport ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i
            ></el-button>
          </div>
          <div v-show="isShowSourceReport" class="footer-extra">
            <div>{{ sourceReportData || '--' }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <event-detail
      v-if="showCompessDetail"
      :searchOpt="_searchOpt"
      :visible.sync="showCompessDetail"
      :row="detailCompessRow"
      v-bind="detailCompessPops"
      :hideClose="hideCompessClose"
    ></event-detail>
  </div>
</template>

<script>
import EventDetail from '@/views/event/components/event/event-detail.vue'
import {
  apiGetRecords,
  apiGetTags,
  apiSaveTags,
  apiDeleteTags,
  apiGetOriginals,
  apiGetSourceReport,
  apiGetMergersEvents,
  apiNoiseReductionMistake,
  apiGetHistoryEventsMergers
} from '@/apis/event'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import TableActions from '@/components/common/table-actions.vue'
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
  name: 'EventDetail',
  components: {
    EventDetail,
    TableActions
  },
  props: {
    tab: {
      type: String,
      default: ''
    },
    searchOpt: Object,
    visible: Boolean,
    isGuiding: Boolean, // 是否处于新手教程
    closable: {
      type: Boolean,
      default: true
    },
    row: Object,
    beforeStyle: Object,
    afterStyle: Object,
    hideTags: {
      type: Boolean,
      default: false
    },
    hideResponse: {
      type: Boolean,
      default: false
    },
    hideMerger: {
      type: Boolean,
      default: false
    },
    hideRemark: {
      type: Boolean,
      default: false
    },
    hideClose: {
      type: Boolean,
      default: false
    }
  },
  // props: ['value', 'row', hideTags: {}],
  data() {
    return {
      currentTab: this.tab || 'detail',
      editVisible: this.visible,
      baseActions: [{ name: '详情', id: '2' }],
      noiseActions: [{ name: '降噪错误', id: '1' }],
      loaded: false,
      recordsLoading: false,
      count: [0, 1, 2],
      records: [],
      tags: [],
      showTagPoptip: false,
      tagsLoading: false, // 正在加载标签
      tagInp: '',
      tagBeingSaved: false, // 正在保存标签
      popBeforeStyle: {},
      popAfterStyle: {},
      isShowSourceReport: false,
      isLoadingSourceReport: false,
      sourceReportData: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tableTotal: 0,
      tableLoading: false,
      showDetail: false,
      showCompessDetail: false,
      detailCompessRow: {},
      detailCompessPops: {
        hideTags: true,
        hideResponse: true,
        hideMerger: true,
        hideRemark: true,
        hideClose: true
      },
      hideCompessClose: false,
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
      ]
    }
  },
  filters: {
    zoneFormat: formatZone
  },
  computed: {
    _searchOpt() {
      return this.$parent.searchOptions ? this.$parent.searchOptions : this.searchOpt
    },
    _row() {
      const obj = {}
      const row = this.row
      Object.keys(row).forEach(key => {
        obj[key] = row[key] === null || row[key] === '' ? '--' : row[key]
      })
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
  watch: {
    row: {
      handler(val) {
        this.loadTable()
      },
      immediate: true
    },
    visible: {
      handler(val) {
        this.editVisible = val
        if (val) {
          this.loadRecords()
          this.loadTags()
        } else {
          this.$parent.hasShowDetail = false
        }
      },
      immediate: true
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.loaded = false
    },
    // 0是规则1是智能，-1未分类
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
    doShowTagAdd() {
      this.$emit('show-tag-add')
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
    async loadTable() {
      const {
        row: { id, type },
        currentPage: page,
        pageSize: limit
      } = this
      const loadApis = {
        Compress: apiGetOriginals,
        Merger: apiGetMergersEvents
      }
      const loadApi = loadApis[type] || apiGetHistoryEventsMergers
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
    formatTime(obj) {
      if (typeof obj === 'object' && obj.time) {
        return dayjs(obj.time).format('YYYY-MM-DD HH:mm:ss')
      } else if (typeof obj === 'string') {
        return obj
      }
    },
    async loadRecords() {
      this.recordsLoading = true
      this.records = []
      const params = {
        page: 1,
        limit: 100,
        eventId: this.row.id
      }
      const { success, desc, rows } = await apiGetRecords(params)
      this.loaded = true
      this.recordsLoading = false
      if (success) {
        this.records = rows
      } else {
        desc && this.$Message.error(desc)
      }
    },
    async loadTags() {
      this.tagsLoading = true
      const { success, desc, data } = await apiGetTags(this.row.id)
      this.tagsLoading = false
      if (success) {
        this.tags = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    addRemark() {
      this.$emit('remark', this.row.id)
      setTimeout(() => {
        this.close()
      }, 50)
    },
    async addTag() {
      if (this.tagInp) {
        if (this.tags.find(item => item.name === this.tagInp)) {
          this.showTagPoptip = false
          return
        }
        this.tagBeingSaved = true
        const { success, desc, data } = await apiSaveTags(this.row.id, this.tagInp)
        if (success) {
          this.tags.push(data[0])
          this.$Message.success('保存成功')
          this.$emit('tag-add-success')
          this.tagBeingSaved = false
          this.showTagPoptip = false
        } else {
          desc && this.$Message.error(desc)
        }
      }
    },
    async deleteTags(id, idx) {
      this.tags.splice(idx, 1)
      const { success, desc, rows } = await apiDeleteTags(id)
      if (success) {
        this.$Message.success('删除成功')
      } else {
        desc && this.$Message.error(desc)
      }
    },
    response() {
      const { status, id } = this.row
      status === 0 && this.$emit('response', id)
      setTimeout(() => {
        this.close()
      }, 50)
    },
    closeEvent() {
      this.$emit('closeEvent', this.row.id)
      setTimeout(() => {
        this.close()
      }, 50)
    },
    async handleShowSourceReport() {
      if (this.sourceReportData) {
        this.isShowSourceReport = !this.isShowSourceReport
        return false
      }
      this.isLoadingSourceReport = true
      const { success, desc, data } = await apiGetSourceReport(this.row.id)
      this.isLoadingSourceReport = false
      if (success) {
        this.sourceReportData = data || '无'
        this.isShowSourceReport = true
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
.expand-content {
  margin-bottom: 0;
}
.detail-tags {
  padding: 16px;
}
.detail-pop-buttons {
  padding-top: 12px;
  @include flex();
}
.detail-tags-item {
  margin: 0 8px 8px 0;
}
.page-table-pagination {
  @include flex(flex-end);
}
.guide-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba($color: #000000, $alpha: 0.3);
}
.detail {
  &-main {
    border-right: 1px dashed #eee;
  }
  &-aside {
    overflow: auto;
    max-height: 406px;
    padding: 1rem 1rem 0;
  }
}
.footer-extra {
  margin-top: 14px;
  padding: 16px;
  background: #f9fafe;
  word-break: break-all;
  white-space: pre-line;
  text-align: left;
  border: 1px solid #dddddd;
}
</style>
