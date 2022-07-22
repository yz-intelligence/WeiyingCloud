<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <analysis-radio-button
        :columns="columns"
        :tableData="[tableData]"
        :loading="loading"
        fileName="事件情况分析"
        @radiochange="loadTable"
      ></analysis-radio-button>
      <el-divider></el-divider>
      <div class="page-content">
        <div class="analysis-content">
          <div class="analysis-grid" v-loading="loading">
            <div class="grid">
              <div class="grid-item" v-for="(item, i) in overviewColumns" :key="i">
                <div class="grid-content">
                  <div class="title">{{ item.title }}</div>
                  <div class="num">{{ item.num }}</div>
                </div>
                <i class="icon"><img :src="item.icon" alt="" /></i>
              </div>
            </div>
          </div>
          <el-container class="analysis-chart" v-loading="loading"
            ><div>
              <v-echarts :options="option" auto-resize style="height: 100%"></v-echarts></div
          ></el-container>
        </div>
      </div>
    </div>
    <!-- 纳实简报 -->
    <div v-if="banberSrc" class="ifa">
      <iframe scrolling="auto" :src="banberSrc" frameborder="0" title="纳实简报"></iframe>
    </div>
  </div>
</template>

<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import VEcharts from '@/components/echarts'
import { apiGetBanber } from '@/apis/banber'
import { apiGetStatements } from '@/apis/statements'
import AnalysisRadioButton from './components/analysisradiobutton.vue'

export default {
  name: 'AnaylsisOverview',
  components: {
    VEcharts,
    AnalysisRadioButton
  },
  computed: {
    overviewColumns() {
      return this.columns.filter(item => item.display)
    }
  },
  watch: {
    //图表数据处理
    tableData(val = {}) {
      if (val.close === undefined) return false
      const row = val
      const arr = [...this.columns]
      arr.forEach(item => {
        item.num = row[item.key]
      })

      const yAxisData = []
      this.chartData.map(item => {
        yAxisData.push(item.title)
        item.value = row[item.key]
      })
      this.$set(
        this.option.series[0],
        'data',
        this.chartData.map(item => item.value)
      )
      this.$set(this.option.yAxis, 'data', yAxisData)
      this.columns = arr
    }
  },
  data() {
    return {
      //图表数据
      chartData: [
        {
          title: '压缩率',
          key: 'compress'
        },
        {
          title: '有效率',
          key: 'validity'
        },
        {
          title: '响应率',
          key: 'response'
        },
        {
          title: '关闭率',
          key: 'close'
        }
      ],
      columns: [
        {
          // num: 20,
          title: '事件总量',
          key: 'total',
          display: true,
          icon: require('@/assets/images/analysis/icon1.png')
        },
        {
          title: '维护期',
          key: 'maintenance',
          display: true,
          icon: require('@/assets/images/analysis/icon2.png')
        },
        {
          title: '无主事件',
          key: 'unOwner',
          display: true,
          icon: require('@/assets/images/analysis/icon3.png')
        },
        {
          title: '通知量',
          key: 'notice',
          display: true,
          icon: require('@/assets/images/analysis/icon4.png')
        },
        {
          title: '事故',
          key: 'level4',
          display: true,
          icon: require('@/assets/images/analysis/icon5.png')
        },
        {
          title: '故障',
          key: 'level3',
          display: true,
          icon: require('@/assets/images/analysis/icon7.png')
        },
        {
          title: '告警',
          key: 'level2',
          display: true,
          icon: require('@/assets/images/analysis/icon8.png')
        },

        {
          title: '信息',
          key: 'level1',
          display: true,
          icon: require('@/assets/images/analysis/icon6.png')
        },
        {
          title: '压缩率',
          key: 'compress',
          display: false,
          render: (h, params) => {
            return params.row.compress.toFixed(2) + '%'
          }
        },
        {
          title: '有效率',
          key: 'validity',
          display: false,
          render: (h, params) => {
            return params.row.validity.toFixed(2) + '%'
          }
        },
        {
          title: '响应率',
          key: 'response',
          display: false,
          render: (h, params) => {
            return params.row.response.toFixed(2) + '%'
          }
        },
        {
          title: '关闭率',
          key: 'close',
          display: false,
          render: (h, params) => {
            return params.row.close.toFixed(2) + '%'
          }
        }
      ],
      option: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          shadowColor: 'none',
          borderWidth: '0',
          textStyle: {
            color: '#FFFFFF',
            fontSize: '14'
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '23',
          containLabel: true
        },
        xAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#CCD2D8',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#4B5D6C'
          },
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#CCD2D8',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#1D1F24'
          },
          axisTick: {
            show: false
          },
          type: 'category',
          data: []
        },
        color: ['#0076FF'],
        series: [
          {
            barWidth: 20,
            name: '',
            type: 'bar',
            data: [],
            label: {
              show: true,
              formatter: '{c}%',
              position: 'right',
              color: '#1D1F25'
            }
          }
        ]
      },
      loading: false,
      tableData: [],
      banberSrc: ''
    }
  },
  methods: {
    //加载列表数据
    async loadTable(date) {
      this.loading = true
      const { success, desc, data } = await apiGetStatements('company', {
        startTime: date[0],
        endTime: date[1]
      })
      this.loading = false
      if (success) {
        this.tableData = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    async getBanber() {
      const { success, data, desc } = await apiGetBanber()
      if (success) {
        const row = JSON.parse(data)
        if (row.reportGatherList.length) {
          this.banberSrc = row.reportGatherList[0].reportGatherUrl || ''
        } else {
          this.banberSrc = ''
        }
      } else {
        desc && this.$Message.error(desc)
      }
    }
  },
  created() {
    this.getBanber()
  }
}
</script>
<style lang="scss" scoped>
.analysis-content {
  display: flex;
  .analysis-grid {
    margin-right: 16px;
    width: 55%;
  }
  .analysis-chart {
    width: 45%;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    div {
      width: 100%;
    }
  }
}
.grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  .grid-item {
    width: 25%;
    // border-right: 1px solid #E8E8E8;
    text-align: left;
    position: relative;
    padding: 24px;
    height: 146px;
    .title {
      font-size: 14px;
      font-weight: 400;
      color: #444f5a;
    }
    .num {
      font-size: 34px;
      font-weight: bold;
      color: #333;
    }
    .icon {
      display: inline-block;
      width: 43px;
      height: 46px;
      position: absolute;
      right: 0;
      bottom: 0;
      img {
        width: 100%;
      }
    }
    &::after {
      position: absolute;
      content: '';
      display: inline-block;
      height: 100%;
      width: 1px;
      background: #e8e8e8;
      right: 0;
      top: 0;
    }
    &:nth-child(4)::after,
    &:nth-child(8)::after {
      content: none;
    }
    &:nth-last-child(1)::before,
    &:nth-last-child(2)::before,
    &:nth-last-child(3)::before,
    &:nth-last-child(4)::before {
      position: absolute;
      content: '';
      display: inline-block;
      height: 1px;
      width: 100%;
      background: #e8e8e8;
      right: 0;
      top: 0;
    }
    .grid-content {
      flex-flow: column;
      align-items: center;
      justify-content: center;
    }
  }
}
.ifa {
  position: relative;
  margin: 16px 24px 24px;
  padding: 24px 24px 16px;
  background-color: #fff;
  height: 56vw;
  border-radius: 8px;
}
</style>
