<template>
  <v-echarts ref="test" class="chart" auto-resize :options="option"></v-echarts>
</template>
<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import '@/utils/echartsSlideZoomViewCustom'
import VEcharts from '@/components/echarts'
export default {
  name: 'ClassificationChart',
  components: { VEcharts },
  props: {
    chartData: Array
  },
  watch: {
    chartData(val) {
      this.option.xAxis[0].data = []
      this.option.series[0].data = []
      this.option.series[1].data = []
      this.option.series[2].data = []
      let max = 0
      val.forEach(item => {
        if (item.id === 'ALL') {
          max = Math.max(item.nowData, item.oldData)
        }
        this.option.xAxis[0].data.push(item.classifyName)
        this.option.series[0].data.push({ value: item.nowData, id: item.id })
        this.option.series[1].data.push({ value: item.oldData, id: item.id })
        this.option.series[2].data.push({ value: item.growthRate, id: item.id })
      })

      const dataZoomEnd = (10 / val.length) * 100
      this.option.dataZoom[0].end = dataZoomEnd
      this.option.dataZoom[1].show = val.length > 10

      if (max) {
        const newMax = max.toString()
        const length = newMax.length
        let first = Number(newMax[0]) + 1
        if (length > 1) {
          for (let i = 1; i < length; i++) {
            first = first + '0'
          }
        } else {
          first = 10
        }
        this.option.yAxis[0].max = Number(first)
        this.option.yAxis[0].interval = Number(first) / 5
      }
    }
  },
  data() {
    return {
      option: {
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
        grid: {
          left: '24px',
          right: '24px',
          bottom: 11,
          // top: 24,
          containLabel: true
        },
        legend: {
          top: 17,
          icon: 'circle',
          data: ['本期告警数量', '上期告警数量', '增长率']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              margin: 27,
              interval: 0,
              width: 55,
              overflow: 'truncate',
              ellipsis: 'truncate'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            min: 0,
            max: 50,
            interval: 10
          },
          {
            type: 'value',
            name: '%',
            min: -100,
            max: 100,
            interval: 20
          }
        ],
        series: [
          {
            color: '#0076ff',
            name: '本期告警数量',
            type: 'bar',
            barWidth: 12,
            // 柱条的最大宽度
            barMaxWidth: 12,
            // barMinHeight: 15,
            data: []
          },
          {
            color: '#EFE041',
            name: '上期告警数量',
            type: 'bar',
            barWidth: 12,
            // 柱条的最大宽度
            barMaxWidth: 12,
            // barMinHeight: 15,
            data: []
          },
          {
            color: '#FA6400',
            name: '增长率',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            // 数据窗口范围的起始百分比
            start: 0,
            // 数据窗口范围的结束百分比
            end: 10,
            moveOnMouseWheel: true,
            zoomOnMouseWheel: false,
            // 是否锁定选择区域（或叫做数据窗口）的大小，如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放
            zoomLock: false
          },
          // 手柄的icon相关配置
          {
            show: false,
            handleSize: '93%',
            // 是否锁定选择区域（或叫做数据窗口）的大小，如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放
            zoomLock: true,
            filterMode: 'empty',
            bottom: 34,
            height: '10px',
            borderColor: '#FFFFFF',
            brushSelect: false,
            fillerColor: '#D8D8D8',
            showDetail: false,
            borderRadius: 3,
            cursor: 'default',
            handleIcon: 'path://',
            showDataShadow: false
          }
        ]
      }
    }
  },
  mounted() {
    const Vnode = this.$refs.test.chart
    Vnode.getZr().on(
      'click',
      function (params) {
        const pointInPixel = [params.offsetX, params.offsetY]
        //判断是否是网格内的可点击元素，剔除掉边缘和图例等元素
        if (Vnode.containPixel('grid', pointInPixel)) {
          // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引值，借助于索引值的获取到其它的信息
          let pointInGrid = Vnode.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
          // x轴数据的索引值
          let xIndex = pointInGrid[0]
          // 使用getOption() 获取图表的option
          let op = Vnode.getOption()
          // 获取当前点击位置要的点击列信息
          var xData = op.series[0].data[xIndex]
          // window.updateSelectTag(xData)
          this.updateSelectTag(xData)
        }
      },
      this
    )
    Vnode.getZr().on('mouseover', function (params) {
      Vnode.getZr().dom.style.cursor = 'default'
      Vnode.getZr().setCursorStyle('default')
    })
  },
  methods: {
    updateSelectTag(xData) {
      this.$emit('selectedChange', xData)
    }
  }
}
</script>
<style lang="scss" scoped>
.chart {
  height: 100%;
  cursor: pointer !important;
}
</style>
