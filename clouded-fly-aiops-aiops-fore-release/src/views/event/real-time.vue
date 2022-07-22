<template>
  <page-container>
    <div class="page-header">
      <div class="page-actions">
        <el-tabs v-model="fastFilter.val" @tab-click="tabChange">
          <el-tab-pane id="realtime_tab_my" name="my" label="我的"></el-tab-pane>
          <el-tab-pane id="realtime_tab_all" name="all" label="全部"></el-tab-pane>
          <el-tab-pane id="realtime_tab_master" name="master" label="今日主从事件"></el-tab-pane>
        </el-tabs>
        <!-- 右侧图标部分 -->
        <div class="page-extra">
          <!-- 刷新时间&暂停/播放 -->
          <a
            id="realtime_a_refresh"
            v-show="tableConfig && tableConfig.autoRefresh"
            class="page-actions--time hoverable"
            @click="toggleRefresh"
            @mouseover="toggleRefreshShow()"
            @mouseout="toggleRefreshShow()"
            :title="refreshType === 'play' ? '恢复自动刷新' : '停止自动刷新'"
          >
            <span v-show="!isShowRefreshTime">{{ refreshTime }}S</span>
            <i v-show="isShowRefreshTime" :class="`time-icon el-icon-video-${refreshType}`"></i>
          </a>
          <el-radio-group
            id="realtime_radio_type"
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
                        : levelTotalOptions[level]
                    }}
                  </span>
                </el-tooltip>
                <span class="page-actions--level-text">{{ searchOptions.level.options[level] }}</span>
              </el-radio-button>
            </template>
          </el-radio-group>
          <div id="realtime_icon_refresh" class="page-actions--tool hoverable" title="刷新数据" @click="getData">
            <i class="table-actions--item el-icon-refresh" :class="{ 'el-icon-loading': loading }"></i>
          </div>
          <div
            id="realtime_icon_set"
            ref="listSetOpenBtn"
            class="page-actions--tool hoverable"
            title="列表配置"
            @click="openListSet"
          >
            <i class="table-actions--item el-icon-s-tools"></i>
          </div>
          <div
            id="realtime_icon_select"
            class="page-actions--tool hoverable"
            title="条件筛选"
            @click="toggleShowSearch"
          >
            <i :class="`table-actions--item ${isShowSearch ? 'el-icon-arrow-up' : 'el-icon-search'}`"></i>
          </div>
          <el-button
            v-if="$hasPermission('ActiveEventList-report')"
            id="realtime_button_plus"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="isShowCreate = true"
            >人工报障</el-button
          >
        </div>
      </div>
      <!-- 用于标记表格高度 -->
      <c-reset-tag ref="tabletop" />
      <!-- 搜索部分 -->
      <div id="realtime_group_search" class="search-wrapper" v-show="isShowSearch">
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
                    v-if="item.type === 'time' && fastFilter.val !== 'master'"
                    v-model="searchModels[key]"
                    class="search-form-input"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%"
                  />

                  <el-time-picker
                    v-if="item.type === 'time' && fastFilter.val === 'master'"
                    size="small"
                    class="search-form-input"
                    style="width: 100%"
                    is-range
                    v-model="searchModels[key]"
                    format="HH:mm"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                  />

                  <el-select
                    size="small"
                    v-if="item.type === 'select'"
                    class="search-form-input"
                    placeholder="请选择"
                    v-model="searchModels[key]"
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
    <!-- 下方表格 -->
    <div class="page-content">
      <div class="page-table" v-loading="loading">
        <!-- 我的和全部表格 -->
        <el-table
          v-if="fastFilter.val !== 'master'"
          key="my"
          id="realtime_table_realtime"
          ref="table"
          :height="tableHeight"
          size="small"
          row-key="id"
          :expand-row-keys="expandRowKeys"
          border
          :row-class-name="rowClassName"
          :data="tableData"
          @sort-change="sortTable"
          highlight-current-row
          @cell-click="cellClick"
          @expand-change="guideExpand"
          @selection-change="selectionChange"
          @header-dragend="headChange"
          :row-style="{ height: '56px' }"
        >
          <template v-if="columns.length">
            <el-table-column type="selection" width="40"> </el-table-column>
            <el-table-column type="expand" width="20">
              <template slot-scope="scope">
                <event-expand ref="eventExpand" :record="scope.row" :search-opt="searchOptions" />
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
            <!-- 批量操作 -->
            <el-table-column
              :fixed="isGuiding ? null : 'right'"
              align="center"
              width="50"
              label="操作"
              :resizable="false"
            >
              <template slot="header" slot-scope="{ $index }">
                <el-dropdown
                  v-show="selectedData.length > 0"
                  :key="$index"
                  ref="guideMultipleDropdown"
                  id="dropdown-header"
                  trigger="click"
                >
                  <div
                    id="guide-multiple-dropdown"
                    class="page-actions--button hoverable"
                    title="批量操作"
                    @click="showEventAction"
                  >
                    <i class="el-icon-s-grid"></i>
                  </div>
                  <el-dropdown-menu :class="{ 'guide-menu': isGuiding }" class="real-time-menu-header" slot="dropdown">
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
                      id="guide-multiple-dropdown-merge"
                      v-show="selectedData.length > 1"
                      @click.native="doEventMerge()"
                      >合并</el-dropdown-item
                    >
                    <el-dropdown-item v-if="$hasPermission('ActiveEventList-close')" @click.native="doEventClose()"
                      >关闭</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <div
                  v-show="selectedData.length === 0"
                  class="page-actions--button hoverable"
                  title="批量操作"
                  @click="noSelected"
                >
                  <i class="el-icon-s-grid"></i>
                </div>
              </template>
              <template slot-scope="scope">
                <el-dropdown :ref="`currentDropDown_${scope.row.id}`" :hide-on-click="isHideOnClick" trigger="click">
                  <div
                    :id="`action-current_${scope.row.id}`"
                    class="page-actions--button hoverable"
                    title="操作当前行"
                    @click="guideDropDownClick(scope.row.id)"
                  >
                    <i class="el-icon-more"></i>
                  </div>
                  <el-dropdown-menu :class="`${isGuiding && 'guide-menu'} guide-menu-${scope.row.id}`" slot="dropdown">
                    <el-dropdown-item
                      :class="`guide-menu-item-detail-${scope.row.id}`"
                      @click.native="showDetail(scope.row)"
                      >详情</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-response')"
                      :class="`guide-menu-item-response-${scope.row.id}`"
                      v-show="scope.row.status === 0"
                      @click.native="doEventResponse(scope.row.id)"
                      >响应</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-remark')"
                      :class="`guide-menu-item-remark-${scope.row.id}`"
                      @click.native="doEventRemark(scope.row.id)"
                      >备注</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-assign')"
                      :class="`guide-menu-item-transfer-${scope.row.id}`"
                      @click.native="doEventTransfer(scope.row.id)"
                      >转派</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="$hasPermission('ActiveEventList-close')"
                      :class="`guide-menu-item-close-${scope.row.id}`"
                      @click.native="doEventClose(scope.row.id)"
                      >关闭</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <!-- 主从事件表格 -->
        <el-table
          v-else
          ref="table"
          :height="tableHeight"
          size="small"
          row-key="id"
          :expand-row-keys="expandRowKeys"
          border
          :row-class-name="rowClassName"
          :data="tableData"
          @sort-change="sortTable"
          highlight-current-row
          @cell-click="cellClick"
          @expand-change="guideExpand"
          @header-dragend="headChange"
          :row-style="{ height: '56px' }"
        >
          <template v-if="columns.length">
            <el-table-column type="expand" width="20">
              <template slot-scope="scope">
                <master-expand ref="eventExpand" :record="scope.row" :search-opt="searchOptions" />
              </template>
            </el-table-column>
            <template v-for="item of masterColumns">
              <!-- 级别 -->
              <el-table-column
                v-if="item.key === 'level'"
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
          </template>
        </el-table>
        <el-pagination
          id="realtime_table_pagination"
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

    <!-- 列表设置 -->
    <el-dialog
      :visible.sync="isShowListSet"
      :close-on-click-modal="!isGuiding"
      :close-on-press-escape="!isGuiding"
      ref="listSetDialog"
      title="列表配置"
      width="640px"
    >
      <div id="realtime_dialog_listset" class="page-modal">
        <div ref="listSetField">
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
        <el-divider />
        <div ref="listSetSounds">
          <div class="page-modal-item">
            <span class="page-modal-label">声音</span>
            <el-switch v-model="defaultConfig.playSound" size="small"></el-switch>
          </div>
          <div class="page-modal-item">
            <span class="page-modal-label">声音级别</span>
            <el-tag
              class="page-modal-tag"
              v-for="lv in searchOptions.level.values"
              :effect="defaultConfig.playLevel[lv] ? 'dark' : 'plain'"
              :key="lv"
              :name="lv"
              size="large"
              @click.native="changePlayLevel(lv)"
            >
              {{ searchOptions.level.options[lv] }}
            </el-tag>
          </div>
        </div>

        <div ref="listSetOfRefresh">
          <div class="page-modal-item">
            <span class="page-modal-label">自动刷新</span>
            <el-switch v-model="defaultConfig.autoRefresh" size="small"></el-switch>
          </div>
          <div class="page-modal-item">
            <span class="page-modal-label">刷新频率</span>
            <span>{{ defaultConfig.refreshInterval }}S</span>
          </div>
          <div class="page-modal-item">
            <el-slider v-model="defaultConfig.refreshInterval" :min="30" :max="180"></el-slider>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button size="small" @click="isShowListSet = false">取消</el-button>
        <el-button
          ref="listSetSubmitBtn"
          size="small"
          type="primary"
          :loading="tableConfigLoading"
          @click="onUpdateTableConfig"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 人工报障 -->
    <artificial-create
      id="realtime_dialog_artificial"
      v-if="isShowCreate"
      :isGuiding="isGuiding"
      :options="searchOptions.level.options"
      :visible.sync="isShowCreate"
      @success="getData"
    />
    <!-- 报警声音自动播放 -->
    <template v-for="(value, key) of searchOptions.level.options">
      <audio v-if="warnSounds[`level${key}`]" :key="key" :ref="`audio-level${key}`" preload="auto">
        <source :src="warnSounds[`level${key}`].url" type="audio/mpeg" />
      </audio>
    </template>
    <!-- 详情 -->
    <event-detail
      id="realtime_dialog_detail"
      ref="eventDetail"
      v-if="isShowDetail"
      :visible.sync="isShowDetail"
      :searchOpt="searchOptions"
      :row="currentRecord"
      :isGuiding="isGuiding"
      @response="doEventResponse"
      @closeEvent="doEventClose"
      @remark="doEventRemark"
      @show-tag-add="guideShowTag"
      @tag-add-success="guideTagAddSuccess"
    />
    <!-- 备注 -->
    <event-remark
      id="realtime_dialog_remark"
      ref="eventRemark"
      :isGuiding="isGuiding"
      :visible.sync="isShowRemark"
      :event-ids="selectedEventIds"
      @success="remarkSuccess"
    />
    <!-- 关闭 -->
    <event-close
      id="realtime_dialog_close"
      ref="eventClose"
      :isGuiding="isGuiding"
      :visible.sync="isShowClose"
      :event-ids="selectedEventIds"
      @success="closeSuccess"
    />
    <!-- 转派 -->
    <event-transfer
      id="realtime_dialog_transfer"
      ref="eventTranfer"
      :isGuiding="isGuiding"
      :visible.sync="isShowTransfer"
      :event-ids="selectedEventIds"
      @success="getData"
    />
    <!-- 合并 -->
    <event-merge
      id="realtime_dialog_merge"
      from="list"
      ref="eventMerge"
      :extra="fastFilter"
      :isGuiding="isGuiding"
      :visible.sync="isShowMerge"
      :eventIds="selectedEventIds"
      :search-options="searchOptions"
      @success="mergeSuccess"
    />
    <guide-close v-if="isGuiding" @close="closeGuide" />
  </page-container>
</template>
<script>
import { cloneDeep } from 'lodash'
import {
  apiGetEvents,
  apiGetLevelTotal,
  apiGetPersonEventConfig,
  apiCreatePersonEventConfig,
  apiGetMaster,
  apiGetMasterLevelTotal
} from '@/apis/event'
import { apiResponseEvents } from '@/apis/event'
import { apiGetCompanyConfig, apiSaveConfig } from '@/apis/config'
import table from '@/mixins/table'
import event from '@/mixins/event'
import ArtificialCreate from './components/event/artificial-create.vue'
import MasterExpand from './components/event/master-expand.vue'
import GuideClose from '@/components/common/guide-close'
import { realTimeGuideOptions1, realTimeGuideOptions2 } from '@/utils/guideOptions'
export default {
  name: 'RealTime',
  mixins: [table, event],
  components: {
    GuideClose,
    ArtificialCreate,
    MasterExpand
  },
  data() {
    return {
      selectedData: [], // 已选择数据
      guideEvent: {}, // 教程事件
      guideEventIds: [],
      isHideOnClick: true,
      guideEventCtrl: {
        // 教程数据
        eventIds: [],
        index: '',
        id: ''
      },
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
    isGuiding() {
      return this.$route.query['intro'] === 'event'
    },
    columns() {
      let columns = []
      if (this.tableConfig) {
        const { colsChecked } = this.tableConfig
        colsChecked.forEach(key => {
          const config = this.columnsMap[key]
          config && columns.push(config)
        })
      }
      if (this.isGuiding) {
        columns = columns.filter((_, index) => index < 5)
      }
      // 修复拖动固定列前一列后出现空白bug
      const lastIndex = columns.length - 1
      lastIndex !== -1 && (columns[lastIndex].resizable = false)
      return columns
    },
    // 主从事件列
    masterColumns() {
      let columns = []
      if (this.tableConfig) {
        const { colsChecked } = this.tableConfig
        colsChecked.forEach(key => {
          const config = this.columnsMap[key]
          config && columns.push(config)
        })
      }
      if (this.isGuiding) {
        columns = columns.filter((_, index) => index < 5)
      }
      columns = columns.filter(item => !['status', 'duration', 'counts', 'lastTime'].includes(item.key))
      return columns
    }
  },
  async created() {
    this.loading = true
    await this.getEventWarnSounds()
    await this.getEventConfig()
    !this.tableConfig && (this.tableConfig = cloneDeep(this.defaultConfig))
    const isGetTableDataSuccess = await this.getData()
    isGetTableDataSuccess && this.checkIntro()
  },
  beforeDestroy() {
    clearInterval(this.refleshIntervalId)
  },
  methods: {
    // tab切换方法
    tabChange() {
      this.tableData = []
      this.getData()
    },
    // 获取表格数据
    async getData() {
      this.loading = true
      const { searchParams, searchModels, search, fastFilter } = this
      const _level = searchParams.level || searchModels.level
      const status = searchModels.status
      const level = _level === 99 ? '' : _level
      const params = {
        ...search,
        ...fastFilter.condition[fastFilter.val],
        ...searchParams,
        ...{ status, level }
      }
      // true为主从事件，false为实时事件
      const apiGetData = this.fastFilter.val === 'master' ? apiGetMaster : apiGetEvents
      const apiGetTotal = this.fastFilter.val === 'master' ? this.getMasterLevelTotalOptions : this.getLevelTotalOptions
      const { success, desc, rows, total } = await apiGetData(params)
      this.loading = false
      if (success) {
        this.tableData = rows
        this.tableTotal = total
        this.checkPlay()
        this.guideEventIds = rows.map(item => item.id)
        this.$nextTick(() => {
          if (this.tableConfig.autoRefresh) {
            clearInterval(this.refleshIntervalId)
            this.initRefresh() // 表格自动刷新
          }
          apiGetTotal()
        })
        return 1
      } else {
        desc && this.$Message.error(desc)
        return 0
      }
    },
    // 获取级别总数
    async getLevelTotalOptions() {
      const { condition, val } = this.fastFilter
      const { searchParams } = this
      const param = { ...searchParams, level: undefined, ...condition[val] }
      const { success, desc, data = {} } = await apiGetLevelTotal(param)
      if (success) {
        this.levelTotalOptions = data
        this.eventTotal = Object.values(data).reduce((total, item) => total + item, 0)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取主从级别总数
    async getMasterLevelTotalOptions() {
      const { condition, val } = this.fastFilter
      const { searchParams } = this
      const param = { ...searchParams, level: undefined, ...condition[val] }
      const { success, desc, data = {} } = await apiGetMasterLevelTotal(param)
      if (success) {
        this.levelTotalOptions = data
        this.eventTotal = Object.values(data).reduce((total, item) => total + item, 0)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取事件自动报警声音
    async getEventWarnSounds() {
      const { success, desc, rows } = await apiGetCompanyConfig('AlarmSound')
      if (success) {
        rows.length && rows[0].value && (this.warnSounds = JSON.parse(rows[0].value))
      } else {
        desc && this.$Message.error(desc)
      }
      return rows
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
    toggleShowSearch() {
      this.isShowSearch = !this.isShowSearch
    },
    showDetail(row) {
      this.currentRecord = row
      this.isShowDetail = true
      if (this.isGuiding) {
        this.$nextTick(() => {
          const { detail, record, OpenTagBtn, saveTagBtn } = this.$refs.eventDetail.$refs
          this.updateIntroItems(this.intro._currentStep + 1, detail.$el)
          this.updateIntroItems(this.intro._currentStep + 2, record.$el)
          this.updateIntroItems(this.intro._currentStep + 3, OpenTagBtn.$el)
          // this.updateIntroItems(this.intro._currentStep + 4, saveTagBtn.$el)
          setTimeout(() => {
            this.intro.nextStep()
          }, 300)
        })
      }
    },
    toggleRefreshShow() {
      if (this.refreshType === 'play') return
      this.isShowRefreshTime = !this.isShowRefreshTime
    },
    toggleRefresh() {
      if (this.refreshType === 'pause') {
        this.refreshType = 'play'
        clearInterval(this.refleshIntervalId)
      } else {
        this.refreshType = 'pause'
        this.initRefresh()
      }
      this.isShowRefreshTime = true
    },
    initRefresh() {
      // 定时刷新
      const { refreshInterval } = this.tableConfig
      this.refreshTime = refreshInterval
      this.refleshIntervalId = setInterval(() => {
        this.refreshTime -= 1
        if (this.refreshTime === 0) {
          this.getData(1)
          this.refreshTime = refreshInterval
        }
      }, 1000)
    },
    // 判断是否播放铃声
    checkPlay() {
      this.stopSound()
      if (this.tableData && this.tableConfig && this.tableConfig.playSound) {
        let arr = this.tableData.filter(item => item.status === 0).sort((a, b) => b.level - a.level)
        for (let item of arr) {
          if (this.tableConfig.playLevel[item.level] && this.warnSounds[`level${item.level}`]) {
            // 清空谷歌禁止默认播放声音的报错
            this.$refs[`audio-level${item.level}`][0].play().catch(e => {})
            break
          }
        }
      }
    },
    // 停止播放
    stopSound() {
      Object.keys(this.warnSounds).forEach(level => {
        let audio = this.$refs[`audio-${level}`][0]
        if (!audio) return false
        audio.pause()
        audio.currentTime = 0
      })
    },
    changePlayLevel(lv) {
      this.$set(this.defaultConfig.playLevel, lv, !this.defaultConfig.playLevel[lv])
    },
    showEventAction(e) {
      if (this.isGuiding) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.intro.nextStep()
          }, 250)
        })
      }
    },
    openListSet() {
      this.defaultConfig = cloneDeep(this.tableConfig)
      this.isShowListSet = true
      if (this.isGuiding) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.intro.nextStep()
          }, 300)
        })
      }
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
      let oldConfig = cloneDeep(this.tableConfig)
      const api = {
        apiSaveConfig,
        apiCreatePersonEventConfig
      }
      this.tableConfigLoading = true
      const { success, desc, data } = await api[this.hasConfig ? 'apiSaveConfig' : 'apiCreatePersonEventConfig'](params)
      this.tableConfigLoading = false
      if (success) {
        this.$Message.success('更新成功')
        if (this.isGuiding) {
          this.intro.exit(true)
          this.startEventGuide()
        }
        this.isShowListSet = false
        this.eventConfig = data
        if (data.value) {
          this.tableConfig = JSON.parse(data.value)
          this.hasConfig = true
        }
        // 判断自动刷新是否更改
        const { autoRefresh, refreshInterval, playSound, playLevel } = oldConfig
        clearInterval(this.refleshIntervalId)
        if (autoRefresh !== this.tableConfig.autoRefresh) {
          this.tableConfig.autoRefresh && this.initRefresh()
        } else if (refreshInterval !== this.tableConfig.refreshInterval) {
          this.initRefresh()
        }

        // 判断声音配置是否更改
        if (playSound !== this.tableConfig.playSound) {
          if (!this.tableConfig.playSound) {
            this.stopSound()
          } else {
            this.checkPlay()
          }
        }
        for (let lv in playLevel) {
          if (this.tableConfig.playLevel[lv] !== playLevel[lv]) {
            this.checkPlay()
            break
          }
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
    },
    // 行类名生产
    rowClassName({ row }) {
      return `event_${row.id}`
    },
    // 响应事件
    async doEventResponse(id) {
      const ids = id || this.selectedData.map(item => item.id).join(',')
      const { success, desc } = await apiResponseEvents(ids)
      if (success) {
        this.$Message.success('响应成功')
        await this.getData()
        // 在教程中
        if (this.isGuiding) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.isHideOnClick = true
              this.intro.nextStep()
              this.intro.refresh()
            }, 500)
          })
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    doEventRemark(id) {
      this.selectedEventIds = id || this.selectedData.map(item => item.id).join(',')
      this.isShowRemark = true
      if (this.isGuiding) {
        this.updateIntroItems(this.intro._currentStep + 1, this.$refs.eventRemark.$refs.submit.$el)
        this.$nextTick(() => {
          this.$refs.eventRemark.form.remark = '这是一条测试事件。'
          setTimeout(() => {
            this.intro.nextStep()
          }, 250)
        })
      }
    },
    async remarkSuccess() {
      await this.getData()
      if (this.isGuiding) {
        setTimeout(() => {
          this.intro.nextStep()
          const mulDom = this.$refs.guideMultipleDropdown
          mulDom && (mulDom.hide = function () {})
          if (this.helper) {
            document.body.appendChild(this.helper)
            document.body.appendChild(this.overlay)
          }
        }, 300)
      }
    },
    // 合并事件
    doEventMerge() {
      this.selectedEventIds = this.selectedData.map(item => item.id).join(',')
      this.isShowMerge = true
      if (this.isGuiding) {
        this.updateIntroItems(this.intro._currentStep + 1, this.$refs.eventMerge.$refs.submit.$el)
        this.$nextTick(() => {
          this.$refs.eventMerge.form = {
            name: '测试合并事件',
            status: 1,
            level: 2,
            summary: '这是一条测试合并事件',
            eventObj: 'Test-Merge'
          }
          setTimeout(() => {
            this.intro.nextStep()
          }, 1000)
        })
      }
    },
    async mergeSuccess(id) {
      await this.getData()
      if (this.isGuiding) {
        this.guideEventCtrl.id = id
        this.guideEventCtrl.mergeId = id
        this.$nextTick(() => {
          const dom = document.body.querySelector(`.event_${id} .el-table__expand-column .cell`)
          if (!id || !dom) this.intro.exit(true)
          this.updateIntroItems(this.intro._currentStep + 1, dom)
          this.$nextTick(() => {
            setTimeout(() => {
              this.intro.nextStep()
              if (this.helper) {
                document.body.appendChild(this.helper)
                document.body.appendChild(this.overlay)
              }
            }, 300)
          })
        })
      }
    },
    // 关闭事件
    doEventClose(id) {
      this.selectedEventIds = id || this.selectedData.map(item => item.id).join(',')
      this.isShowClose = true
      if (this.isGuiding) {
        this.$nextTick(() => {
          this.$refs.eventClose.form.bz = '关闭测试合并事件。'
          this.updateIntroItems(this.intro._currentStep + 1)
          setTimeout(() => {
            this.intro.nextStep()
          }, 300)
        })
      }
    },
    // 转派事件
    doEventTransfer(id) {
      this.selectedEventIds = id || this.selectedData.map(item => item.id).join(',')
      this.isShowTransfer = true
      if (this.isGuiding) {
        this.$nextTick(() => {
          this.updateIntroItems(this.intro._currentStep + 1)
          setTimeout(() => {
            this.intro.nextStep()
          }, 300)
        })
      }
    },
    async closeSuccess() {
      if (this.isGuiding) {
        this.intro.nextStep()
        if (this.helper) {
          document.body.appendChild(this.helper)
          document.body.appendChild(this.overlay)
        }
      }
      this.getData()
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(selection) {
      this.selectedData = [...selection]
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
      if (this.isGuiding && this.intro && selection.length) {
        this.updateIntroItems(this.intro._currentStep + 1)
        setTimeout(() => {
          this.intro.nextStep()
        }, 300)
      }
    },
    guideDropDownClick(id) {
      if (this.isGuiding) {
        const currentRowDom = this.$refs[`currentDropDown_${id}`]
        this.isHideOnClick = false
        // currentRowDom.hide = function () {}
        this.guideOverrideHide(currentRowDom)
        this.$nextTick(() => {
          setTimeout(() => {
            this.intro.nextStep()
          }, 300)
        })
      }
    },
    // 检测是否需要开启教程
    checkIntro($route = this.$route) {
      if ('intro' in $route.query) {
        this.checkGuideEvent()
        this.$nextTick(() => {
          setTimeout(() => {
            this.intro = this.$intro()
              .setOptions(realTimeGuideOptions1(this.$refs))
              .start()
              .onbeforechange(el => {
                // 将占位el替换为真实dom节点
                if (el.className === 'introjsFloatingElement') {
                  this.updateIntroItems(2, this.$refs.listSetField)
                  this.updateIntroItems(3, this.$refs.listSetSounds)
                  this.updateIntroItems(4, this.$refs.listSetOfRefresh)
                }
                if (el === this.$refs.listSetOfRefresh) {
                  this.defaultConfig.autoRefresh = false
                }
              })
              .onafterchange(el => {
                if (el === this.$refs.listSetSubmitBtn.$el) {
                  this.hackGuideInDialog(this.$refs.listSetDialog.$el)
                }
              })
              .onbeforeexit(() => {
                this.isHideOnClick = true
              })
            // this.isGuiding = true
            this.checkTestEvent()
          }, 500)
        })
      }
    },
    hackGuideInDialog(el) {
      let helper = document.body.querySelector('.introjs-helperLayer')
      let overlay = document.body.querySelector('.introjs-overlay')
      this.helper = helper
      this.overlay = overlay
      helper.parentElement.removeChild(helper)
      overlay.parentElement.removeChild(overlay)
      el.appendChild(helper)
      el.appendChild(overlay)
    },
    // 设置用于教程的事件
    setEventIntro() {
      let index
      const record = this.tableData.find((item, _index) => {
        const isDone = this.guideEventCtrl.eventIds.includes(item.id)
        if (isDone) {
          index = _index
        }
        return isDone
      })
      return {
        id: record.id,
        index
      }
    },
    // 检测事件教程是否有事件
    checkGuideEvent() {
      let str = localStorage.getItem('testEvent')
      if (str) {
        let json = JSON.parse(str)
        for (let item of json.data) {
          this.guideEvent[item.id] = item
          this.guideEventCtrl[`level${item.level}Id`] = item.id
          this.guideEventCtrl.eventIds.push(item.id)
        }
      }
    },
    checkTestEvent() {
      let nonExist = []
      Object.keys(this.guideEvent).forEach(key => {
        if (this.guideEventIds.includes(key) && this.guideEvent[key].isCompress) {
          nonExist.push(key)
        }
      })
      if (nonExist.length === 0) {
        this.$nextTick(() => {
          // this.$confirm('测试事件丢失，请先暂停维护期所有设置60秒后再重新开始。', '提示', {
          //   confirmButtonText: '前往暂停',
          //   cancelButtonText: '退出教程',
          //   customClass: 'test-lose',
          //   type: 'warning'
          // })
          this.$customMessageBox(this, '提示', '测试事件丢失，请先暂停维护期所有设置60秒后再重新开始。', 'warning', {
            confirmButtonText: '前往暂停',
            cancelButtonText: '退出教程',
            customClass: 'test-lose'
          })
            .then(() => {
              this.$router.push('/monitor/maintenance')
            })
            .catch(() => {
              this.intro && this.intro.exit(true)
            })
        })
      }
    },
    guideShowTag() {
      if (this.isGuiding) {
        this.$nextTick(() => {
          const nextComp = this.$refs.eventDetail.$refs.tagPoptip
          const that = this
          // nextComp.handleDocumentClick = function (e) {
          //   console.log('this', this)
          //   if (that.isGuiding) return
          //   let reference = this.reference || this.$refs.reference
          //   const popper = this.popper || this.$refs.popper

          //   if (!reference && this.$refs.wrapper.children) {
          //     reference = this.referenceElm = this.$refs.wrapper.children[0]
          //   }
          //   if (
          //     !this.$el ||
          //     !reference ||
          //     this.$el.contains(e.target) ||
          //     reference.contains(e.target) ||
          //     !popper ||
          //     popper.contains(e.target)
          //   )
          //     return
          //   this.showPopper = false
          // }
          this.updateIntroItems(this.intro._currentStep + 1)
          setTimeout(() => {
            this.$refs.eventDetail.tagInp = 'test'
            this.intro.nextStep()
          }, 300)
        })
      }
    },
    // 重写新手教程下的隐藏函数
    guideOverrideHide(dom) {
      if (!dom) return
      dom.hide = () => {
        if (dom.triggerElm.disabled) return
        if (this.isGuiding) return
        dom.removeTabindex()
        if (dom.tabindex >= 0) {
          dom.resetTabindex(dom.triggerElm)
        }
        clearTimeout(dom.timeout)
        dom.timeout = setTimeout(
          () => {
            dom.visible = false
          },
          dom.trigger === 'click' ? 0 : dom.hideTimeout
        )
      }
    },
    guideTagAddSuccess() {
      if (this.isGuiding) {
        this.isShowDetail = false
        this.intro.nextStep()
        if (this.helper) {
          document.body.appendChild(this.helper)
          document.body.appendChild(this.overlay)
        }
      }
    },

    guideExpand({ id }) {
      if (this.isGuiding) {
        this.$nextTick(() => {
          const currentSid = this.intro._introItems[this.intro._currentStep].stepId
          if (currentSid === 7) {
            this.updateIntroItems(this.intro._currentStep + 1)
          }
          if (currentSid === 20) {
            this.$refs.eventExpand.currentTab = 'list'
            const ExpandedDom = document.body.querySelector(`.event_${id} + tr .expand`)
            this.updateIntroItems(this.intro._currentStep + 1, ExpandedDom)
          }
          if (currentSid <= 20) {
            setTimeout(() => {
              this.intro.nextStep()
            }, 300)
          }
        })
      }
    },
    // 开始事件教程
    startEventGuide() {
      this.$nextTick(() => {
        const { id, index } = this.setEventIntro('isCompress', true)
        this.guideEventCtrl.id = id
        this.guideEventCtrl.compressId = id
        this.guideEventCtrl.index = index
        let compressId = this.guideEventCtrl.id
        setTimeout(() => {
          this.intro = this.$intro()
            .setOptions(realTimeGuideOptions2(this, compressId))
            .start()
            .onbeforechange(el => {
              const currentSid = this.intro._introItems[this.intro._currentStep].stepId
              // 将占位el替换为真实dom节点
              // 单行操作hack
              if (el && el.id === `action-current_${compressId}`) {
                // 关闭展开行
                this.expandRowKeys = []
                this.$nextTick(() => {
                  // 修复错位
                  setTimeout(() => {
                    this.intro.refresh()
                  }, 10)
                })
                return
              }
              if (currentSid === 29) {
                this.isShowTransfer = false
              }
            })
            .onafterchange(el => {
              if (el && el.id === 'guideEventRemarkBtn') {
                this.hackGuideInDialog(this.$refs.eventRemark.$el)
              }
              if (el && el.id === 'guideEventMergeBtn') {
                this.hackGuideInDialog(this.$refs.eventMerge.$el)
              }
              const currentSid = this.intro._introItems[this.intro._currentStep].stepId
              const { id } = this.guideEventCtrl
              if (currentSid === 21) {
                const nextDom = this.$refs[`currentDropDown_${id}`]
                nextDom.visible = true
                nextDom.hide = function () {}
                this.isHideOnClick = false
                this.$nextTick(() => {
                  const dom = document.body.querySelector(`.guide-menu-item-detail-${id}`)
                  this.updateIntroItems(this.intro._currentStep + 1, dom)
                })
              }
              if (currentSid === 23) {
                this.hackGuideInDialog(this.$refs.eventDetail.$refs.dialog.$el)
              }
              if (currentSid === 26) {
                this.$nextTick(() => {
                  const dom = document.body.querySelector(`.guide-menu-item-transfer-${id}`)
                  this.updateIntroItems(this.intro._currentStep + 1, dom)
                  // 重置28步
                  this.updateIntroItems(this.intro._currentStep + 2)
                })
              }
              if (currentSid === 28) {
                // 重置29步
                const dom29 = document.body.querySelector(`.guide-menu-item-close-${id}`)
                this.updateIntroItems(this.intro._currentStep + 1, dom29)
              }
              if (currentSid === 30) {
                this.hackGuideInDialog(this.$refs.eventClose.$el)
              }
            })
            .oncomplete(() => {
              this.$router.push('/event/record?intro')
            })
            .onbeforeexit(() => {
              this.isHideOnClick = true
            })
          // this.isGuiding = true
        }, 500)
      })
    },
    /**
     * 因为弹窗的dom需要渲染后才可以获取，
     * intro无法一开始无法或者，
     * 需要更新新手指导步骤的element
     * @param {Number} index 下标
     * @param {Node} el dom节点
     * @param {String} pos 教程显示位置
     */
    updateIntroItems(index, el, pos = 'bottom') {
      this.intro._introItems[index].element = el || document.querySelector(this.intro._options.steps[index].element)
      this.intro._introItems[index].position = pos
    },
    // 关闭教程
    closeGuide() {
      this.intro.exit(true)
      // this.isGuiding = false
      this.$router.push(this.$route.path)
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
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
    position: absolute;
    top: 0;
    right: 0;
    height: 56px;
    @include flex(flex-start, center);
    &::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: transparent;
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
.search-form-item {
  padding-bottom: 10px;
  p {
    padding-bottom: 6px;
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
.guide-menu {
  z-index: auto !important;
}
.chip {
  cursor: default;
}
</style>
