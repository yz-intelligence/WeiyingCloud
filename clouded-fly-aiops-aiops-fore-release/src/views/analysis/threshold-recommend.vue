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
              <el-input
                class="rule-title-content-input"
                v-if="item.type === 'input'"
                v-model.trim="searchText.keyWord"
                :maxlength="100"
                placeholder="请输入"
                clearable
                size="small"
              />
              <el-select
                class="rule-title-content-input"
                v-if="item.type === 'select'"
                v-model="searchText.monitorCode"
                clearable
                size="small"
              >
                <el-option v-for="(oV, oK) in sourceOpt" :value="oV.id" :key="oK" :label="oV.name"></el-option>
              </el-select>
              <!-- 时间 -->
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
              ref="table"
              :height="tableHeight"
              :data="table.rows"
              class="rule-content-table"
              row-key="id"
              @sort-change="sortChange"
            >
              <el-table-column prop="eventObj" label="事件对象" width="110"> </el-table-column>
              <el-table-column prop="type" label="事件类型" width="110"> </el-table-column>
              <el-table-column prop="component" label="监控指标"> </el-table-column>
              <el-table-column prop="monitorName" label="监控源" width="120"> </el-table-column>
              <el-table-column prop="thresholdRecommend" label="阈值推荐"> </el-table-column>
              <el-table-column prop="expectedResults" sortable label="预期效果"> </el-table-column>
              <el-table-column prop="modifyTime" sortable label="更新时间" width="170"> </el-table-column>
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
import { apiGetConfWithNotRules } from '@/apis/access'
import { apiGetTodayThresholdRecommen } from '@/apis/threshold'
import Refresh from '@/components/common/refresh.vue'
export default {
  mixins: [table],
  components: {
    Refresh
  },
  data() {
    return {
      loading: false,
      searchOpt: {
        keyWord: {
          type: 'input',
          label: '事件对象/监控指标'
        },
        monitorCode: {
          type: 'select',
          label: '监控源',
          options: {}
        },
        time: {
          type: 'time',
          span: 9,
          label: '更新时间'
        }
      },
      searchText: {
        keyWord: '',
        monitorCode: '',
        sortType: '',
        sortField: ''
      },
      sourceOpt: [],
      timeText: null
    }
  },
  methods: {
    async getData() {
      this.loading = true
      let params = {
        ...this.search,
        ...this.searchText
      }
      if (this.timeText) {
        params.updateStartTime = this.timeText[0]
        params.updateEndTime = this.timeText[1]
      }
      const { success, rows, desc, total } = await apiGetTodayThresholdRecommen(params)
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
    async getSource() {
      const { success, data, desc } = await apiGetConfWithNotRules()
      if (success) {
        this.sourceOpt = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    sortChange({ prop, order }) {
      const sortTypes = {
        ascending: 'ASC',
        descending: 'DESC'
      }
      this.searchText.sortType = order ? sortTypes[order] : ''
      this.searchText.sortField = order ? prop : ''
      this.doSearch()
    },
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    // 刷新功能
    resetData() {
      this.searchText = {
        keyWord: '',
        monitorCode: '',
        sortType: '',
        sortField: ''
      }
      this.timeText = null
      this.getData()
    }
  },
  created() {
    this.loading = true
    this.getSource()
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
        min-width: 40px;
        margin: auto 10px auto 15px;
      }
      &-input {
        width: 160px;
      }
      &-time {
        width: 350px;
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
::v-deep {
  .el-date-editor .el-range-separator {
    padding: 0;
  }
}
</style>
