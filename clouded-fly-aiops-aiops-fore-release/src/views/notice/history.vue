<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-content">
        <div class="rule">
          <!-- 顶部搜索部分 -->
          <div class="rule-title">
            <div class="rule-title-content" v-for="(item, index) in searchOpt" :key="index">
              <span>{{ item.label }}</span>
              <!-- 事件对象和事件标题 -->
              <el-input
                id="history_input_eventObj"
                class="rule-title-content-input"
                v-if="item.type === 'input' && item.label === '事件对象'"
                v-model.trim="searchtext.eventObj"
                :maxlength="100"
                placeholder="输入对象"
                clearable
                size="small"
              />
              <el-input
                id="history_input_eventName"
                class="rule-title-content-input"
                v-if="item.type === 'input' && item.label === '事件标题'"
                v-model.trim="searchtext.eventName"
                :maxlength="100"
                placeholder="输入标题"
                clearable
                size="small"
              />
              <!-- 事件级别 -->
              <el-select
                id="history_select_eventLevel"
                class="rule-title-content-input"
                v-if="item.type === 'select'"
                v-model="searchtext.eventLevel"
                clearable
                size="small"
              >
                <el-option v-for="(oV, oK) in item.options" :key="oK" :value="oK" :label="oV"></el-option>
              </el-select>
              <!-- 最近发生时间 -->
              <el-date-picker
                id="history_picker_time"
                class="rule-title-content-time"
                v-if="item.type === 'time'"
                v-model="timeText"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="至"
                size="small"
                :editable="false"
              />
            </div>
            <refresh class="refresh" :loading="loading" @refresh="resetData()" />
            <el-button
              id="history_button_search"
              @click="doSearch()"
              class="rule-title-content-button"
              type="primary"
              circle
              icon="el-icon-search"
              size="small"
            />
          </div>
          <el-divider></el-divider>
          <!-- 中间表格部分 -->
          <div class="rule-content" v-loading="loading">
            <el-table
              id="history_table_history"
              ref="table"
              :height="tableHeight"
              :data="table.rows"
              class="rule-content-table"
              row-key="id"
              :expand-row-keys="expandRowKeys"
              highlight-current-row
              :row-style="{ height: '56px' }"
              @cell-click="cellClick"
            >
              <el-table-column type="expand" width="30">
                <template slot-scope="props">
                  <rule-item
                    :row="props.row"
                    :changeType="changeType"
                    :changeEventLevel="changeEventLevel"
                    :changeContent="changeContent"
                  ></rule-item>
                </template>
              </el-table-column>

              <el-table-column prop="eventObj" label="事件对象" width="110"> </el-table-column>
              <el-table-column prop="eventLevel" label="事件级别" width="95" :formatter="changeEventLevel">
              </el-table-column>
              <el-table-column prop="summary" label="通知内容"> </el-table-column>
              <el-table-column prop="recipient" label="接收人" width="120"> </el-table-column>
              <el-table-column prop="type" label="发送方式" width="120" :formatter="changeType"> </el-table-column>
              <el-table-column prop="eventTime" label="最近发生时间" width="170"> </el-table-column>
              <el-table-column prop="sendTime" label="通知发送时间" width="170"> </el-table-column>
              <el-table-column prop="status" label="通知状态" width="100">
                <template slot-scope="scope">
                  <el-tag class="border" size="small" :type="statusStyle[scope.row.status]" disable-transitions>
                    {{ statusOpt[scope.row.status] }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 下方分页操作部分 -->
          <div class="rule-page">
            <el-pagination
              id="history_table_pagination"
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
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getNotices } from '@/apis/notice'
import RuleItem from './components/rule-item.vue'
import Refresh from '@/components/common/refresh.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'NoticeHistory',
  mixins: [table],
  components: {
    RuleItem,
    Refresh
  },
  computed: {
    ...mapGetters(['levelOpt', 'sendType', 'statusOpt'])
  },
  data() {
    return {
      expandRowKeys: [], // 展开行的id
      cellClickCacheId: '',
      loading: false,
      searchOpt: {
        eventObj: {
          type: 'input',
          label: '事件对象'
        },
        eventName: {
          type: 'input',
          label: '事件标题'
        },
        eventLevel: {
          type: 'select',
          label: '事件级别',
          options: {}
        },
        time: {
          type: 'time',
          span: 9,
          label: '最近发生时间'
        }
      },
      searchtext: {
        eventLevel: '',
        eventObj: '',
        eventName: ''
      },
      timeText: null,
      statusStyle: {
        0: 'info',
        1: '-',
        2: 'danger',
        3: 'success'
      }
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let params = {
        ...this.search,
        ...this.searchtext
      }
      if (this.timeText) {
        params.eventTimeStart = this.timeText[0]
        params.eventTimeEnd = this.timeText[1]
      }
      const { success, rows, desc, total } = await getNotices(params)
      this.loading = false
      if (success) {
        this.table = {
          rows,
          total
        }
      } else {
        desc && this.message.error(desc)
      }
    },
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    cellClick(row, column, event) {
      if (event.cellIndex != 0) {
        const { id } = row
        const { expandRowKeys, cellClickCacheId } = this
        this.expandRowKeys = expandRowKeys.length > 0 ? (cellClickCacheId === id ? [] : [id]) : [id]
        this.cellClickCacheId = this.expandRowKeys.length === 0 ? '' : id
      }
    },
    changeContent(row, column) {
      // let trans = JSON.parse(row.content)
      // console.log(trans)
      return row.summary
      // if (trans.content) {
      //   return trans.content.replace(/<br\/>/g, ' ')
      // } else {
      //   return trans.message
      // }
    },
    changeEventLevel(row, column) {
      return this.searchOpt.eventLevel.options[row.eventLevel]
    },
    changeType(row, column) {
      return this.sendType[row.type] || '--'
    },
    // 刷新功能
    resetData() {
      this.searchText = {
        eventLevel: '',
        eventObj: '',
        eventName: ''
      }
      this.getData()
    }
  },
  created() {
    this.loading = true
    this.searchOpt.eventLevel.options = this.levelOpt
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.rule {
  display: flex;
  flex-direction: column;
  &-title {
    min-width: 1100px;
    padding-top: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    &-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      margin: 0 12px;
      @media screen and (max-width: 1300px) {
        margin: auto 0 10px 45px;
      }
      span {
        min-width: 60px;
        margin: auto 10px auto 15px;
      }
      &-input {
        width: 100px;
      }
      &-time {
        width: 370px;
      }
      &-button {
        margin-left: 12px;
        @media screen and (max-width: 1300px) {
          margin-bottom: 5px;
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
@media screen and (max-width: 1300px) {
  .refresh {
    margin: 15px 45px;
  }
}
</style>
