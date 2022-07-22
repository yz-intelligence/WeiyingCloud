<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-header">
        <analysis-radio-button
          :columns="columns"
          :tableData="table.row"
          :loading="loading"
          fileName="用户事件情况分析"
          @radiochange="loadTable"
        ></analysis-radio-button>
      </div>
      <el-divider></el-divider>
      <div class="page-content">
        <!-- 用户列表 -->
        <div v-loading="loading">
          <el-table id="anlysis_table_useranlysis" ref="table" :height="tableHeight" :data="table.row">
            <el-table-column prop="userName" label="用户"> </el-table-column>
            <el-table-column prop="response" label="响应事件量"> </el-table-column>
            <el-table-column prop="responseTimes" label="平均响应时长(分钟)"> </el-table-column>
            <el-table-column prop="responseTimely" label="及时响应率"> </el-table-column>
            <el-table-column prop="close" label="关闭事件量"></el-table-column>
            <el-table-column prop="closeTimes" label="平均关闭时长(分钟)"></el-table-column>
            <el-table-column prop="closeTimely" label="及时关闭率"></el-table-column>
          </el-table>
          <el-pagination
            ref="pagination"
            class="page-table-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="search.page"
            :page-sizes="pageSizes"
            :page-size="search.limit"
            layout="total, prev, pager, next, sizes"
            :total="table.total"
          >
          </el-pagination>
        </div>
        <!-- 弹出对话框 -->
      </div>
    </div>
  </div>
</template>

<script>
import table from '@/mixins/table'
import { apiGetStatements } from '@/apis/statements'
import AnalysisRadioButton from './components/analysisradiobutton.vue'
export default {
  name: 'AnalysisResponse',
  mixins: [table],
  components: {
    AnalysisRadioButton
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: '用户',
          key: 'userName'
        },
        {
          title: '响应事件量',
          align: 'right',
          key: 'response'
        },
        {
          title: '平均响应时长(分钟)',
          align: 'right',
          key: 'responseTimes'
        },
        {
          title: '及时响应率',
          align: 'right',
          key: 'responseTimely'
        },
        {
          title: '关闭事件量',
          align: 'right',
          key: 'close'
        },
        {
          title: '平均关闭时长(分钟)',
          align: 'right',
          key: 'closeTimes'
        },
        {
          title: '及时关闭率',
          align: 'right',
          key: 'closeTimely'
        }
      ]
    }
  },
  methods: {
    loadTable(date) {
      this.date = date
      this.getData()
    },
    //加载用户分析情况列表
    //加载列表数据
    async getData() {
      this.loading = true
      const { success, desc, data } = await apiGetStatements('user', {
        startTime: this.date[0],
        endTime: this.date[1],
        ...this.search
      })
      this.loading = false
      if (success) {
        this.table = {
          row: data.map(item => {
            const { responseTimes, response, close, responseTimely, closeTimes, closeTimely } = item
            return {
              ...item,
              responseTimes: (response ? responseTimes / response / 60 : 0).toFixed(2),
              responseTimely: (response ? (responseTimely / response) * 100 : 0).toFixed(2) + '%',
              closeTimes: (close ? closeTimes / close / 60 : 0).toFixed(2),
              closeTimely: (close ? (closeTimely / close) * 100 : 0).toFixed(2) + '%'
            }
          }),
          total: data.length
        }
      } else {
        desc && this.$Message.error(desc)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-table-pagination {
  margin-top: 16px;
  font-size: 14px;
  @include flex(flex-end);
}
.page-header {
  &::v-deep .analysis-header {
    padding: 16px 0 0 0;
  }
}
</style>
