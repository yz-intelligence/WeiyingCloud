// 智能事件分类
<template>
  <div class="page-container">
    <c-breadcrumb />
    <!-- 图 -->
    <div class="page page-fix">
      <div class="page-content">
        <div class="chart-header">
          <el-radio-group v-model="button" size="mini" class="chart-header-date" @change="changeDay">
            <el-radio-button :label="1">当天</el-radio-button>
            <el-radio-button :label="7">近七天</el-radio-button>
          </el-radio-group>
          <div class="chart-header-export">
            <el-tooltip effect="dark" placement="top" trigger="hover">
              <i class="chart-header-export--tip el-icon-tip"></i>
              <div slot="content">
                <div>
                  <div>支持自定义日期导出数据</div>
                </div>
              </div>
            </el-tooltip>
            <el-button type="primary" size="mini" icon="el-icon-download" @click="showExportDialog">导出</el-button>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="chart-content">
          <classification-chart :chartData="chartData" @selectedChange="selectedChange"></classification-chart>
        </div>
      </div>
    </div>
    <!-- 表 -->
    <div class="page">
      <div class="page-content">
        <ai-table :dayType="button" :classifyId="classifyId" @success="getChart"></ai-table>
      </div>
    </div>
    <!-- 下载弹窗 -->
    <ai-download v-if="showExport" :visible.sync="showExport"></ai-download>
  </div>
</template>
<script>
import AiTable from './components/classification-ai/ai-table.vue'
import AiDownload from './components/classification-ai/ai-download.vue'
import ClassificationChart from './components/classification-ai/classification-chart.vue'
import { apiGetClassificationsChart } from '@/apis/classification'
export default {
  name: 'ClassificationAI',
  data() {
    return {
      //日期选择：1=当天、7=近七天
      button: 1,
      chartData: [],
      searchText: '',
      loading: false,
      showDialog: false,
      showExport: false,
      actions: [{ name: '修改分类', id: '1' }],
      isEditShow: false,
      // 分类ID
      classifyId: 'ALL'
    }
  },
  components: {
    AiTable,
    AiDownload,
    ClassificationChart
  },
  created() {
    this.getChart()
  },
  methods: {
    showExportDialog() {
      this.showExport = true
    },
    // 日期转换更新数据
    changeDay(e) {
      this.getChart()
    },
    //获取图表
    async getChart() {
      let param = {
        dayType: this.button
      }
      const { success, desc, data } = await apiGetClassificationsChart(param)
      if (success) {
        this.chartData = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //获取当前选中x轴标签
    selectedChange(xData) {
      this.classifyId = xData.id
    }
  }
}
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0 0 24px;
}
.page-fix {
  padding-bottom: 24px;
}
.chart {
  &-header {
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-date {
      margin-right: 10px;
    }
    &-export {
      display: flex;
      align-items: center;
      &--tip {
        margin-right: 16px;
        width: 14px;
        height: 14px;
      }
    }
  }
  &-content {
    height: 390px;
    color: #fff;
    border: 1px dashed #dae1ea;
  }
}
.table {
  margin-bottom: 24px;
}
</style>
