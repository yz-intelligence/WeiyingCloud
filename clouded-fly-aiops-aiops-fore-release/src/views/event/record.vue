<template>
  <page-container>
    <div class="page-header">
      <!-- 操作栏 -->
      <div class="page-actions">
        <div class="page-extra">
          <el-radio-group
            id="record_radio_type"
            v-model="eventLevel"
            v-show="eventTotal > 0"
            size="mini"
            text-color="#333"
            class="page-actions--level"
          >
            <el-radio-button :label="99">
              <el-tooltip effect="dark" :disabled="eventTotal < 10000" :content="eventTotal + ''" placement="top">
                <span class="circle">{{ eventTotal > 9999 ? (eventTotal / 10000).toFixed(1) + 'W' : eventTotal }}</span>
              </el-tooltip>
              <span class="page-actions--level-text">全部</span>
            </el-radio-button>
            <template v-for="level of searchOptions.level.values">
              <el-radio-button :key="level" v-if="levelTotalOptions[level]" :label="level">
                <!-- <el-radio-button v-for="level of searchOptions.level.values" :key="level" :label="level"> -->
                <el-tooltip
                  effect="dark"
                  :disabled="levelTotalOptions[level] < 10000"
                  :content="levelTotalOptions[level] + ''"
                  placement="top"
                >
                  <span :class="`circle ${searchOptions.level.class[level]}`">
                    {{
                      levelTotalOptions[level] > 9999
                        ? (levelTotalOptions[level] / 10000).toFixed(1) + 'W'
                        : levelTotalOptions[level] + ''
                    }}
                  </span>
                </el-tooltip>
                <span class="page-actions--level-text">{{ searchOptions.level.options[level] }}</span>
              </el-radio-button>
            </template>
          </el-radio-group>
          <div id="record_icon_refresh" class="page-actions--tool hoverable" title="刷新数据" @click="getData">
            <i class="table-actions--item el-icon-refresh" :class="{ 'el-icon-loading': loading }"></i>
          </div>
          <div id="record_icon_set" class="page-actions--tool hoverable" title="列表配置" @click="openListSet">
            <i class="table-actions--item el-icon-s-tools"></i>
          </div>
          <el-row id="recordActions" type="flex">
            <div
              id="record_icon_select"
              class="page-actions--tool hoverable"
              title="条件筛选"
              @click="toggleShowSearch"
            >
              <i :class="`table-actions--item ${isShowSearch ? 'el-icon-arrow-up' : 'el-icon-search'}`"></i>
            </div>
            <div id="record_icon_download" class="page-actions--tool hoverable" title="导出表格" @click="handleExport">
              <i class="table-actions--item el-icon-download"></i>
            </div>
          </el-row>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div id="record_group_search" class="search-wrapper" v-show="isShowSearch">
        <el-row :gutter="16" type="flex">
          <el-col :span="23">
            <el-row :gutter="10">
              <template v-for="(item, key) in searchOptions">
                <el-col :key="key" :span="item.span || 4" class="search-form-item">
                  <p>{{ item.label }}</p>
                  <el-input
                    v-if="item.type === 'input'"
                    v-model="searchModels[key]"
                    :maxlength="100"
                    placeholder="请输入"
                    class="search-form-input"
                    size="small"
                    clearable
                    @keyup.enter="doSearch"
                  />

                  <el-date-picker
                    size="small"
                    v-if="item.type === 'time'"
                    v-model="searchModels[key]"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    class="search-form-input"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%"
                  />

                  <el-select
                    size="small"
                    v-if="item.type === 'select'"
                    placeholder="请选择"
                    :multiple="item.multiple"
                    :collapse-tags="item.collapseTags"
                    v-model="searchModels[key]"
                    class="search-form-input"
                    clearable
                  >
                    <template v-if="Array.isArray(item.options)">
                      <template v-for="option of item.options">
                        <el-option :key="option.value" :value="option.value" :label="option.label">{{
                          option.label
                        }}</el-option>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="(oV, oK) in item.options">
                        <el-option :key="oK" :value="oK" :label="oV">{{ oV }}</el-option>
                      </template>
                    </template>
                  </el-select>
                </el-col>
              </template>
            </el-row>
          </el-col>
          <el-col class="search-wrapper-action" :span="1">
            <el-button
              @click="doSearch"
              type="primary"
              circle
              size="small"
              icon="el-icon-search"
              title="筛选"
            ></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 用于标记表格高度 -->
    <c-reset-tag ref="tabletop" />
    <!-- 表格 -->
    <div class="page-content">
      <div class="page-table" v-loading="loading">
        <el-table
          ref="table"
          id="recordTable"
          :height="tableHeight"
          size="small"
          border
          row-key="id"
          :expand-row-keys="expandRowKeys"
          :data="tableData"
          @sort-change="sortTable"
          highlight-current-row
          @cell-click="cellClick"
          @selection-change="selectionChange"
          @header-dragend="headChange"
          :row-style="{ height: '56px' }"
        >
          <template v-if="columns.length">
            <el-table-column type="selection" width="40" :selectable="checkSelectable"></el-table-column>
            <el-table-column type="expand" width="20">
              <template slot-scope="scope">
                <event-expand :record="scope.row" :search-opt="searchOptions" />
              </template>
            </el-table-column>
            <el-table-column width="40" :resizable="false">
              <template v-if="scope.row.status === 99" slot-scope="scope">
                <!-- 0是规则1是智能 -->
                <div v-if="scope.row.noiseReductionType !== 1" class="record-ai-icon">
                  <img :src="require(`@/assets/images/event/ai-off.svg`)" />
                </div>
                <el-tooltip v-else class="item" effect="dark" :content="`该事件使用了智能降噪`" placement="top">
                  <div class="record-ai-icon">
                    <img :src="require(`@/assets/images/event/ai-on.svg`)" />
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <template v-for="item of columns">
              <!-- 状态 -->
              <el-table-column
                v-if="item.key === 'status'"
                :key="item.key"
                :prop="item.key"
                :label="item.title"
                align="center"
                :min-width="item.minWidth"
                :resizable="item.resizable"
              >
                <template slot-scope="scope">
                  <div :class="`chip chip--xs chip--outline ${searchOptions.status.class[scope.row.status]}`">
                    <span class="chip__content">{{
                      scope.row.maintenanceId ? '维护期' : searchOptions.status.options[scope.row.status]
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
                :resizable="item.resizable"
              >
                <template slot-scope="scope">
                  <div :class="`chip chip--xs ${searchOptions.level.class[scope.row.level]}`">
                    <span class="chip__content">{{ searchOptions.level.options[scope.row.level] || '未分类' }}</span>
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

            <el-table-column fixed="right" align="center" width="50" label="操作" :resizable="false">
              <template slot="header">
                <el-dropdown
                  v-if="selectedData.length > 0"
                  id="dropdown-header"
                  trigger="click"
                  @click="showEventAction"
                >
                  <div class="page-actions--button hoverable" title="批量操作">
                    <i class="el-icon-s-grid"></i>
                  </div>
                  <el-dropdown-menu class="real-time-menu-header" slot="dropdown">
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-response')"
                      @click.native="doEventResponse()"
                      >响应</el-dropdown-item
                    >
                    <el-dropdown-item v-if="$hasPermission('ActiveEventList-remark')" @click.native="doEventRemark()"
                      >备注</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-merge')"
                      v-show="selectedData.length > 1"
                      @click.native="doEventMerge()"
                      >合并</el-dropdown-item
                    >
                    <el-dropdown-item v-if="$hasPermission('ActiveEventList-close')" @click.native="doEventClose()"
                      >关闭</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <div v-else class="page-actions--button hoverable" title="批量操作" @click="noSelected">
                  <i class="el-icon-s-grid"></i>
                </div>
              </template>
              <template slot-scope="scope">
                <el-dropdown v-if="scope.row.status !== 99 && scope.row.status !== 100" trigger="click">
                  <div class="page-actions--button hoverable" title="操作当前行">
                    <i class="el-icon-more"></i>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="showDetail(scope.row)">详情</el-dropdown-item>
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-response')"
                      v-show="scope.row.status === 0"
                      @click.native="doEventResponse(scope.row.id)"
                      >响应</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-remark')"
                      @click.native="doEventRemark(scope.row.id)"
                      >备注</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-assign')"
                      @click.native="doEventTransfer(scope.row.id)"
                      >转派</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-close')"
                      @click.native="doEventClose(scope.row.id)"
                      >关闭</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <div v-else class="page-actions--button hoverable" title="操作当前行" @click="showDetail(scope.row)">
                  <i class="el-icon-more"></i>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          id="record_table_pagination"
          ref="pagination"
          class="page-table-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.page"
          :page-sizes="pageSizes"
          :page-size="search.limit"
          layout="total, prev, pager, next, sizes"
          :total="tableTotal"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 列表设置， -->
    <el-dialog
      id="record_dialog_listset"
      v-if="isShowListSet"
      :visible.sync="isShowListSet"
      title="列表配置"
      width="640px"
    >
      <div class="page-modal">
        <p class="page-modal-title">显示字段</p>
        <div class="page-modal-item">
          <vddl-list :list="defaultConfig.colsChecked" :horizontal="true" class="page-modal-vddl-list drag-wrap">
            <template v-for="(item, index) of defaultConfig.colsChecked">
              <vddl-draggable
                v-if="columnsMap[item]"
                :key="item"
                :draggable="item"
                :index="index"
                :wrapper="defaultConfig.colsChecked"
                effect-allowed="move"
              >
                <el-tag
                  :name="columnsMap[item].key"
                  closable
                  type="info"
                  effect="plain"
                  size="small"
                  @close="deleteColumnsChecked(columnsMap[item].key)"
                  >{{ columnsMap[item].title }}</el-tag
                >
              </vddl-draggable>
            </template>
          </vddl-list>
        </div>

        <el-checkbox-group v-model="defaultConfig.colsChecked">
          <el-checkbox v-for="(col, key) in columnsMap" :key="key" :label="key">{{ col.title }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer">
        <el-button size="small" @click="isShowListSet = false">取消</el-button>
        <el-button size="small" type="primary" :loading="tableConfigLoading" @click="onUpdateTableConfig"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 详情 -->
    <event-detail
      id="record_dialog_detail"
      v-if="isShowDetail"
      :visible.sync="isShowDetail"
      :searchOpt="searchOptions"
      :row="currentRecord"
      :isGuiding="isGuiding"
      @response="doEventResponse"
      @closeEvent="doEventClose"
      @remark="doEventRemark"
    />
    <!-- 备注 -->
    <event-remark
      id="record_dialog_remark"
      :isGuiding="isGuiding"
      :visible.sync="isShowRemark"
      :event-ids="selectedEventIds"
      @success="getData"
    />
    <!-- 关闭 -->
    <event-close
      id="record_dialog_close"
      :isGuiding="isGuiding"
      :visible.sync="isShowClose"
      :event-ids="selectedEventIds"
      @success="getData"
    />
    <!-- 转派 -->
    <event-transfer
      id="record_dialog_transfer"
      :isGuiding="isGuiding"
      :visible.sync="isShowTransfer"
      :event-ids="selectedEventIds"
      @success="getData"
    />
    <!-- 合并 -->
    <event-merge
      id="record_dialog_merge"
      from="history"
      :extra="fastFilter"
      :isGuiding="isGuiding"
      :visible.sync="isShowMerge"
      :eventIds="selectedEventIds"
      :search-options="searchOptions"
      @success="getData"
    />
    <!-- 新手教程-关闭 -->
    <guide-close v-if="isGuiding" @close="closeGuide" />
    <!-- 新手教程-已完成 -->
    <guide-complete :visible.sync="isShowGuideComplete" />
  </page-container>
</template>
<script>
import { cloneDeep } from 'lodash'
import {
  apiGetHistoryEvent,
  apiHistoryEventsExport,
  apiGetHistoryEventTotal,
  apiGetPersonEventConfig,
  apiCreatePersonEventConfig
} from '@/apis/event'
import GuideClose from '@/components/common/guide-close'
import GuideComplete from '@/components/common/guide-complete'
import { eventRecordGuideOptions } from '@/utils/guideOptions'
import { apiSaveConfig } from '@/apis/config'
import table from '@/mixins/table'
import event from '@/mixins/event'
import dayjs from 'dayjs'
export default {
  name: 'EventRecord',
  components: {
    GuideClose,
    GuideComplete
  },
  mixins: [table, event],
  data() {
    return {
      isGuiding: false, // 是否教程中
      isShowGuideComplete: false,
      refreshTime: 20,
      isShowRefreshTime: false, // 是否显示自动刷新
      refreshType: 'pause', // 自动刷新播放状态
      // 快速过滤
      fastFilter: {
        val: 'my',
        condition: {
          my: {
            isSubscription: true, // 我订阅的事件
            isAssign: true, // 转派
            isMy: true // 我的事件
          },
          all: {
            isSubscription: false, // 我订阅的事件
            isAssign: false, // 转派
            isMy: false // 我的事件
          }
        }
      },
      isShowCreate: false, // 人工报障
      eventConfig: {}, // 事件设置
      hasConfig: false, // 是否有设置列表设置
      warnSounds: {} // 报警声音
    }
  },
  computed: {
    columns() {
      // 根据后台配置生成字段
      const columns = []
      if (this.tableConfig) {
        const { colsChecked } = this.tableConfig
        colsChecked.forEach(key => {
          const config = this.columnsMap[key]
          config && columns.push(config)
        })
      }
      // 修复拖动固定列前一列后出现空白bug
      const lastIndex = columns.length - 1
      lastIndex !== -1 && (columns[lastIndex].resizable = false)
      return columns
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      await this.getEventConfig()
      !this.tableConfig && (this.tableConfig = cloneDeep(this.defaultConfig))
      await this.getData()
      this.checkIntro()
    },
    // 获取表格数据
    async getData() {
      this.loading = true
      const { searchParams, searchModels, search } = this
      const _level = searchParams.level || searchModels.level
      const status = searchModels.status
      //先判断首次告警时间是否为空
      const firstTime = searchModels.firstTime
        ? searchModels.firstTime
            .map(item => {
              //时间格式转换
              return dayjs(item).format('YYYY-MM-DD HH:mm:ss')
            })
            .join(' - ')
        : searchModels.firstTime
      const level = _level === 99 ? '' : _level
      const params = {
        ...search,
        ...searchParams,
        ...{ status, level, firstTime }
      }
      const { success, desc, rows, total } = await apiGetHistoryEvent(params)
      this.loading = false
      if (success) {
        this.tableData = rows.map(item => {
          return {
            _disabled: item.status === 99,
            ...item
          }
        })
        this.tableTotal = total
        this.$nextTick(() => {
          this.getLevelTotalOptions()
        })
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 检测是否开启新手教程
    checkIntro($route = this.$route) {
      if ('intro' in $route.query) {
        this.$nextTick(() => {
          this.intro = this.$intro()
            .setOptions(eventRecordGuideOptions)
            .start()
            .oncomplete(() => {
              this.isGuiding = false
              this.isShowGuideComplete = true
            })
          this.isGuiding = true
        })
      }
    },
    // 关闭教程
    closeGuide() {
      this.intro.exit(true)
      this.isGuiding = false
      this.$router.push(this.$route.path)
    },
    // 获取级别总数
    async getLevelTotalOptions() {
      const { searchParams } = this
      let param = { ...searchParams, level: undefined }
      if (param.status === '') {
        param.status = undefined
      }
      const { success, desc, data = {} } = await apiGetHistoryEventTotal(param)
      if (success) {
        const totalObj = {}
        let total = 0
        Object.keys(data).forEach(key => {
          const realKey = key.split('LEVEL')[1]
          totalObj[realKey === '' ? '-1' : realKey] = data[key]
          total += data[key]
        })
        this.levelTotalOptions = totalObj
        this.eventTotal = total
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 设置该行数据是否可选择，已关闭&&维护中数据不可选择
    checkSelectable({ status }) {
      return status !== 99 && status !== 100
    },
    // 获取事件配置
    async getEventConfig() {
      const result = await apiGetPersonEventConfig()
      const { success, desc, data = {} } = result
      if (success) {
        this.eventConfig = data
        const { value } = data
        this.hasConfig = !!value
        if (value) {
          this.tableConfig = JSON.parse(value)
        }
      } else {
        desc && this.$Message.error(desc)
      }
      return result
    },
    // 隐藏/显示筛选
    toggleShowSearch() {
      this.isShowSearch = !this.isShowSearch
    },
    // 显示详情弹窗
    showDetail(row) {
      this.currentRecord = row
      this.isShowDetail = true
    },
    showEventAction(e) {
      console.log(e)
    },
    handleExport() {
      apiHistoryEventsExport(this.searchParams)
    },
    openListSet() {
      this.defaultConfig = cloneDeep(this.tableConfig)
      this.isShowListSet = true
    },
    // 更新列表设置
    async onUpdateTableConfig() {
      const { id, name } = this.eventConfig
      const params = {
        id,
        name: name || 'AlarmList',
        type: 'Person',
        value: JSON.stringify(this.defaultConfig)
      }
      const api = {
        apiSaveConfig,
        apiCreatePersonEventConfig
      }
      this.tableConfigLoading = true
      const { success, desc, data } = await api[this.hasConfig ? 'apiSaveConfig' : 'apiCreatePersonEventConfig'](params)
      this.tableConfigLoading = false
      if (success) {
        this.$Message.success('更新成功')
        this.isShowListSet = false
        this.eventConfig = data
        if (data.value) {
          this.tableConfig = JSON.parse(data.value)
          this.hasConfig = true
        }
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
        // 清除缓存的宽度设置
        this.resetCacheColumnsWidth()
        if (!this.isGuiding) {
          window.location.reload()
        }
      } else {
        desc && this.$Message.error(desc)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.page {
  &-table-pagination {
    margin-top: 16px;
    font-size: 14px;
    @include flex(flex-end);
  }
  &-actions {
    position: relative;
    &--tool,
    &--button,
    &--time {
      font-size: 18px;
      color: $--color-primary;
      cursor: pointer;
    }
    &--tool {
      margin-left: 16px;
      &:last-of-type {
        margin-right: 16px;
      }
    }
    &--time {
      display: block;
      margin-right: 16px;
      font-size: 21px;
    }
  }
  &-extra {
    height: 50px;
    padding-top: 16px;
    @include flex(flex-end, center);
    &::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: transparent;
    }
  }
  .search-form-item {
    padding-bottom: 10px;
    p {
      padding-bottom: 6px;
    }
  }
  &-content {
    &::v-deep .el-table--border th {
      border-right: 1px solid transparent;
    }
    &::v-deep .el-table--border th:hover {
      // border-right: 1px solid #0076ff;
      border-right: 1px solid #e4e6e9;
    }
    &::v-deep .el-table--border td {
      border-right: none;
    }
    &::v-deep .vddl-list,
    &::v-deep .vddl-draggable {
      position: relative;
    }

    &::v-deep .vddl-dragging {
      opacity: 0.7;
    }
  }
}
.search-wrapper {
  padding: 16px 0;
  &-action {
    @include flex();
  }
}
.page-modal-vddl-list {
  display: flex;
  flex-wrap: wrap;
}
.page-modal-label,
.page-modal-title {
  margin-bottom: 16px;
  display: inline-block;
  width: 70px;
  font-weight: 700;
}
.drag-wrap {
  margin-bottom: 16px;
}
.page-modal {
  &::v-deep .el-checkbox {
    margin: 0 12px 12px 0;
  }
}
.page-modal-tag {
  margin-right: 4px;
}
.chip {
  cursor: default;
}
.record-ai-icon {
  width: 16px;
  height: 16px;
  display: flex;
}
</style>
