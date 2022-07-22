<template>
  <div class="chart">
    <div class="chart-title">
      <p class="chart-title-word">最近七天事件</p>
    </div>
    <div class="chart-content">
      <div class="chart-content-box" v-for="(item, index) in charts" :key="index">
        <div class="chart-content-box-name">
          {{ item.name }}
          <span>{{ item.unit }}</span>
        </div>
        <v-echarts v-if="isShow[index]" class="chart-content-box-chart" :options="item.opt" auto-resize></v-echarts>
        <div v-else class="chart-content-box-chart">
          <div class="no-content">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import VEcharts from '@/components/echarts'
import dayjs from 'dayjs'
import time from '@/mixins/timeInterval'
import { getLatestOfLevel, getLatestOfComponentType, getLatestOfResponseTimes } from '@/apis/dashboard'
export default {
  name: 'chartNotice',
  components: { VEcharts },
  mixins: [time],
  data() {
    let textStyle = {
      color: '#083275',
      fontSize: 12
    }
    return {
      charts: [
        {
          name: '未分类事件量 ',
          unit: '(单位：条)',
          content: '图表',
          opt: {
            color: [
              '#CCCCCC',
              '#999999',
              '#666666',
              '#333',
              'rgba(0,92,169,0.10)',
              'rgba(94,118,138,0.30)',
              'rgba(94, 118, 138, 0.6)',
              '#5E768A',
              'rgba(93, 63, 63, 0.1)',
              'rgba(93, 63, 63, 0.3)',
              'rgba(93, 63, 63, 0.6)',
              '#5D3F3F'
            ],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              shadowColor: 'none',
              borderWidth: '0',
              textStyle: {
                color: '#FFFFFF',
                fontSize: '14'
              }
            },
            legend: {
              icon: 'circle',
              show: true,
              type: 'scroll',
              top: '-1%',
              right: '3%',
              width: '92%',
              data: [],
              textStyle: {
                fontSize: 12
              }
            },
            grid: {
              left: '3%',
              top: 30,
              right: '4%',
              bottom: 30,
              containLabel: true
            },
            xAxis: {
              type: 'category',
              axisTick: { show: false },
              axisLabel: textStyle,
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              },
              data: []
            },
            yAxis: {
              //name: '事件量(条)',
              nameTextStyle: textStyle,
              type: 'value',
              boundaryGap: [0, '10%'],
              minInterval: 1,
              axisLabel: textStyle,
              axisTick: { show: false },
              axisLine: { show: false },
              //分隔虚线
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            series: []
          }
        },
        {
          name: '事件量 ',
          unit: '(单位：条)',
          content: '图表',
          opt: {
            //color: ['#0078FF', '#3CB371', '#DC143C', '#FFA500'],
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var htmlStr = '<div>' + params[0].axisValue + '<br/>'
                let m = params.reverse()
                m.forEach(item => {
                  if (!item.data) {
                    item.data = '-'
                  }
                  htmlStr += item.marker + item.seriesName + ':' + item.data + '<br/>'
                })
                htmlStr += '</div>'
                return htmlStr
              },
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              shadowColor: 'none',
              borderWidth: '0',
              textStyle: {
                color: '#FFFFFF',
                fontSize: '14'
              }
            },
            legend: {
              icon: 'circle',
              show: true,
              type: 'scroll',
              top: '-1%',
              right: '3%',
              data: ['事故', '故障', '告警', '信息'],
              textStyle: {
                fontSize: 12
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              top: 30,
              bottom: 30,
              containLabel: true
            },
            xAxis: {
              type: 'category',
              axisTick: { show: false },
              axisLabel: textStyle,
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              },
              data: []
            },
            yAxis: {
              //name: '事件量(条)',
              nameTextStyle: textStyle,
              type: 'value',
              minInterval: 1,
              boundaryGap: [0, '10%'],
              axisLabel: textStyle,
              axisTick: { show: false },
              axisLine: { show: false },
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            series: [
              {
                key: 1,
                name: '信息',
                type: 'bar',
                stack: 'level',
                barCategoryGap: '60%',
                barMinHeight: 10,
                emphasis: {
                  barBorderWidth: 1,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: 'rgba(0,0,0,0.5)'
                },
                itemStyle: {
                  borderRadius: 0,
                  color: '#4687FF'
                },
                data: []
              },
              {
                key: 2,
                name: '告警',
                type: 'bar',
                stack: 'level',
                barMinHeight: 10,
                emphasis: {
                  barBorderWidth: 1,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: 'rgba(0,0,0,0.5)'
                },
                itemStyle: {
                  borderRadius: 0,
                  color: '#EFE041'
                },
                data: []
              },
              {
                key: 3,
                name: '故障',
                type: 'bar',
                stack: 'level',
                emphasis: {
                  barBorderWidth: 1,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: 'rgba(0,0,0,0.5)'
                },
                barMinHeight: 10,
                itemStyle: {
                  borderRadius: 0,
                  color: '#EFB041'
                },
                data: []
              },
              {
                key: 4,
                name: '事故',
                type: 'bar',
                stack: 'level',
                barMinHeight: 10,
                emphasis: {
                  barBorderWidth: 1,
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: 'rgba(0,0,0,0.5)'
                },
                itemStyle: {
                  borderRadius: 0,
                  color: '#FF5F62'
                },
                data: []
              }
            ]
          }
        },
        {
          name: '时长 ',
          unit: '(单位：分钟)',
          content: '图表',
          opt: {
            legend: {
              show: true,
              type: 'scroll',
              top: '-1%',
              right: '3%',
              data: ['平均响应时长', '平均关闭时长'],
              textStyle: {
                fontSize: 12
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              top: 30,
              bottom: 30,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              shadowColor: 'none',
              borderWidth: '0',
              textStyle: {
                color: '#FFFFFF',
                fontSize: '14'
              }
            },
            xAxis: {
              type: 'category',
              axisTick: { show: false },
              axisLabel: textStyle,
              axisLine: {
                lineStyle: {
                  color: '#ccc'
                }
              },
              data: []
            },
            yAxis: {
              nameTextStyle: textStyle,
              type: 'value',
              axisLabel: textStyle,
              axisTick: { show: false },
              axisLine: { show: false },
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            series: [
              {
                key: 'Response',
                name: '平均响应时长',
                type: 'line',
                data: [],
                itemStyle: {
                  color: '#0076FF'
                }
              },
              {
                key: 'Close',
                name: '平均关闭时长',
                type: 'line',
                data: [],
                itemStyle: {
                  color: '#02C07C'
                }
              }
            ]
          }
        }
      ],
      axisLabels: '',
      isShow: [true, true, true]
    }
  },
  methods: {
    // 获取图一数据
    async getFirstData() {
      let { success, data, desc } = await getLatestOfComponentType()
      if (success) {
        this.charts[0].opt.series = []
        this.charts[0].opt.legend.data = []
        let valMap = this.getValMap(data)
        if (!Object.keys(valMap).length) {
          this.$set(this.isShow, 0, false)
          return
        }
        for (let type in valMap) {
          let serie = {
            name: type,
            type: 'bar',
            stack: 'channel',
            barCategoryGap: '60%',
            data: []
          }
          this.charts[0].opt.legend.data.push(type)
          for (let label of this.axisLabels) {
            serie.data.push(valMap[type] ? valMap[type][label] : '-')
          }
          this.charts[0].opt.series.push(serie)
        }
        this.charts[0].opt.series.barMinHeight = 10
        this.$set(this.isShow, 0, true)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取图二数据
    async getSecondData() {
      const { success, data, desc } = await getLatestOfLevel()
      if (success) {
        let valMap = this.getValMap(data)
        if (!Object.keys(valMap).length) {
          this.$set(this.isShow, 1, false)
          return
        }
        this.charts[1].opt.series.forEach(serie => {
          serie.data = []
          for (let label of this.axisLabels) {
            serie.data.push(valMap[serie.key] ? valMap[serie.key][label] : '-')
          }
        })
        this.$set(this.isShow, 1, true)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取图三数据
    async getThirdData() {
      const { success, data, desc } = await getLatestOfResponseTimes()
      if (success) {
        let valMap = this.getValMap(data)
        if (!Object.keys(valMap).length) {
          this.$set(this.isShow, 2, false)
          return
        }
        this.charts[2].opt.series.forEach(serie => {
          serie.data = []
          for (let label of this.axisLabels) {
            let val = valMap[serie.key] ? valMap[serie.key][label] : '-'
            serie.data.push(!isNaN(val) ? (val / 60).toFixed(0) : '-')
          }
        })
        this.$set(this.isShow, 2, true)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    /**
     * 获取图表时间
     * MM-DD格式为x轴显示需要
     * YYYY-MM-DD为数据获取需要
     * */
    getDayLabel(fm = 'MM-DD', val = 7) {
      let labels = []
      while (val > 0) {
        val--
        labels.push(dayjs().subtract(val, 'days').format(fm))
      }
      return labels
    },
    // 对数据格式进行处理
    getValMap(data) {
      let keyMap = {}
      data.forEach(item => {
        let type = item.type || '未分类'
        !keyMap[type] && (keyMap[type] = {})
        keyMap[type][item.x] = item.y
      })
      return keyMap
    },
    loadData() {
      this.getFirstData()
      this.getSecondData()
      this.getThirdData()
    }
  },
  mounted() {
    this.axisLabels = this.getDayLabel('YYYY-MM-DD')
    for (let i = 0; i < 3; i++) {
      this.charts[i].opt.xAxis.data = this.getDayLabel()
    }
  }
}
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 456px;
  padding: 8px 10px;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  &-title {
    width: 100%;
    min-height: 64px;
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;
    display: flex;
    &-word {
      margin: auto 20px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  &-content {
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    width: 100%;
    border-radius: 0 0 10px 10px;
    padding: 0 10px 20px;
    &-box {
      flex: 1;
      border: 1px solid #e8eaec;
      justify-items: center;
      display: flex;
      flex-direction: column;
      height: 372px;
      margin: 0 8px;
      &-name {
        margin: 20px;
        font-size: 16px;
        font-weight: 700;
        color: #333;
        text-align: left;
        span {
          font-size: 9px;
          color: #5e5e5e;
          font-weight: 400;
        }
      }
      &-chart {
        width: 100%;
        height: 312px;
        display: flex;
      }
    }
  }
}
.no-content {
  margin: auto;
  font-size: 14px;
  color: #666666;
}
</style>
