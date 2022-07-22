<template>
  <div class="count">
    <!-- 上方标签 -->
    <div class="count-title">
      <span class="count-title-word">事件统计</span>
      <!-- 上方筛选分块 -->
      <div class="count-title-tabs">
        <div
          class="count-title-tabs-box pointer"
          :id="'home_div_count' + index"
          v-for="(item, index) in tabs"
          :key="index"
          @click="search(item.id)"
        >
          <div :style="color[item.id] ? 'background-color: ' + item.color : 'background-color: #cccccc'"></div>
          <span :style="color[item.id] ? '' : 'color: #cccccc'">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <!-- 下方饼图 -->
    <div class="count-content">
      <div class="count-content-box" v-for="(item, index) in count" :key="index" @click="changePath(item.path, index)">
        <!-- 饼图 -->
        <v-echarts
          class="count-content-box-pie"
          :style="index === 2 ? 'border:none' : ''"
          :options="item.opt"
          auto-resize
          @click="PathRoute"
        ></v-echarts>
        <!-- 中间总数 -->
        <div :id="'home_div_countchart' + index" class="count-content-box-count" @click="PathRoute()">
          {{ item.count }}
          <span> {{ item.unit }}</span>
        </div>
        <!-- 下方描述 -->
        <div :id="'home_div_countchartname' + index" class="count-content-box-name" @click="PathRoute()">
          {{ item.name }}
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
import { getALLReport } from '@/apis/dashboard'
import home from '@/mixins/homeChange'
import time from '@/mixins/timeInterval'
export default {
  name: 'count',
  components: { VEcharts },
  mixins: [home, time],
  data() {
    this.tabs = [
      {
        name: '事故',
        color: '#FF5F62',
        id: 3
      },
      {
        name: '故障',
        color: '#EFB041',
        id: 2
      },
      {
        name: '告警',
        color: '#EFE041',
        id: 1
      },
      {
        name: '信息',
        color: '#4687FF',
        id: 0
      }
    ]
    return {
      count: [
        {
          name: '未响应',
          count: 0,
          unit: '条',
          path: '/event/realtime',
          opt: {
            color: ['#4687FF', '#EFE041', '#EFB041', '#FF5F62', '#F6F7FB'],
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              shadowColor: 'none',
              borderWidth: '0',
              textStyle: {
                color: '#FFFFFF',
                fontSize: '14'
              }
            },
            series: [
              {
                type: 'pie',
                radius: ['60%', '80%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: []
              }
            ]
          }
        },
        {
          name: '处理中',
          count: 0,
          unit: '条',
          path: '/event/realtime',
          opt: {
            color: ['#4687FF', '#EFE041', '#EFB041', '#FF5F62', '#F6F7FB'],
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              shadowColor: 'none',
              borderWidth: '0',
              textStyle: {
                color: '#FFFFFF',
                fontSize: '14'
              }
            },
            series: [
              {
                // name: '',
                type: 'pie',
                radius: ['60%', '80%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: []
              }
            ]
          }
        },
        {
          name: '已关闭',
          count: 0,
          unit: '条',
          path: '/event/record',
          opt: {
            color: ['#4687FF', '#EFE041', '#EFB041', '#FF5F62', '#F6F7FB'],
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              shadowColor: 'none',
              borderWidth: '0',
              textStyle: {
                color: '#FFFFFF',
                fontSize: '14'
              }
            },
            series: [
              {
                type: 'pie',
                radius: ['60%', '80%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: []
              }
            ]
          }
        }
      ],
      path: '/event/realtime',
      status: 0,
      notCountValue: [],
      countValue: [],
      closeValue: [],
      color: [true, true, true, true]
    }
  },
  methods: {
    // 获取未响应数据
    async getNotCount() {
      const { success, data, desc } = await getALLReport({ status: 0 })
      if (success) {
        let { TOTAL, LEVEL1, LEVEL2, LEVEL3, LEVEL4 } = data
        if (TOTAL) {
          this.count[0].opt.series[0].data = [
            { value: LEVEL1 ? LEVEL1 : '', name: '信息' },
            { value: LEVEL2 ? LEVEL2 : '', name: '告警' },
            { value: LEVEL3 ? LEVEL3 : '', name: '故障' },
            { value: LEVEL4 ? LEVEL4 : '', name: '事故' }
          ]
          this.count[0].opt.tooltip.show = true
        } else {
          this.count[0].opt.series[0].data = [
            { value: '', name: '信息' },
            { value: '', name: '告警' },
            { value: '', name: '故障' },
            { value: '', name: '事故' },
            { value: 1, name: '默认提示' }
          ]
          this.count[0].opt.tooltip.show = false
        }
        this.count[0].count = TOTAL
        this.notCountValue = [
          { value: LEVEL1 },
          { value: LEVEL2 },
          { value: LEVEL3 },
          { value: LEVEL4 },
          { value: TOTAL }
        ]

        this.count[0].opt.series[0].minAngle = 15
        this.color = [true, true, true, true]
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取处理中数据
    async getCounting() {
      const { success, data, desc } = await getALLReport({ status: 1 })
      if (success) {
        let { TOTAL, LEVEL1, LEVEL2, LEVEL3, LEVEL4 } = data
        if (TOTAL) {
          this.count[1].opt.series[0].data = [
            { value: LEVEL1 ? LEVEL1 : '', name: '信息' },
            { value: LEVEL2 ? LEVEL2 : '', name: '告警' },
            { value: LEVEL3 ? LEVEL3 : '', name: '故障' },
            { value: LEVEL4 ? LEVEL4 : '', name: '事故' }
          ]
          this.count[1].opt.tooltip.show = true
        } else {
          this.count[1].opt.series[0].data = [
            { value: '', name: '信息' },
            { value: '', name: '告警' },
            { value: '', name: '故障' },
            { value: '', name: '事故' },
            { value: 1, name: '默认提示' }
          ]
          this.count[1].opt.tooltip.show = false
        }
        this.count[1].count = TOTAL
        this.countValue = [{ value: LEVEL1 }, { value: LEVEL2 }, { value: LEVEL3 }, { value: LEVEL4 }, { value: TOTAL }]
        this.count[1].opt.series[0].minAngle = 15
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取已关闭数据
    async getClose() {
      const { success, data, desc } = await getALLReport({ status: 99 })
      if (success) {
        let { TOTAL, LEVEL1, LEVEL2, LEVEL3, LEVEL4 } = data[0]
        if (TOTAL) {
          this.count[2].opt.series[0].data = [
            { value: LEVEL1 ? LEVEL1 : '', name: '信息' },
            { value: LEVEL2 ? LEVEL2 : '', name: '告警' },
            { value: LEVEL3 ? LEVEL3 : '', name: '故障' },
            { value: LEVEL4 ? LEVEL4 : '', name: '事故' }
          ]
          this.count[2].opt.tooltip.show = true
        } else {
          this.count[2].opt.series[0].data = [
            { value: LEVEL1 ? LEVEL1 : '', name: '信息' },
            { value: LEVEL2 ? LEVEL2 : '', name: '告警' },
            { value: LEVEL3 ? LEVEL3 : '', name: '故障' },
            { value: LEVEL4 ? LEVEL4 : '', name: '事故' },
            { value: 1, name: '默认提示' }
          ]
          this.count[2].opt.tooltip.show = false
        }
        this.count[2].count = TOTAL > 999 ? '999+' : TOTAL
        this.closeValue = [{ value: LEVEL1 }, { value: LEVEL2 }, { value: LEVEL3 }, { value: LEVEL4 }, { value: TOTAL }]

        this.count[2].opt.series[0].minAngle = 15
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 饼图筛选功能
    search(id) {
      // 点掉
      if (this.color[id]) {
        this.count.forEach((item, index) => {
          if (item.count === '999+') {
            let count = this.closeValue[4].value - item.opt.series[0].data[id].value
            item.count = count > 999 ? '999+' : count
          } else {
            let val = item.opt.series[0].data[id].value === '-' ? 0 : item.opt.series[0].data[id].value
            item.count = item.count - val
          }
          this.isDefaultShow(index, !item.count)
          item.opt.series[0].data[id].value = ''
        })
      }
      // 点回来
      else {
        let count0 = 0
        if (this.notCountValue[id].value) {
          this.count[0].opt.series[0].data[id].value = this.notCountValue[id].value
          count0 = this.count[0].count + this.notCountValue[id].value
        } else {
          this.count[0].opt.series[0].data[id].value = '-'
          count0 = this.count[0].count
        }
        this.count[0].count = count0
        this.isDefaultShow(0, !count0)

        let count1 = 0
        if (this.countValue[id].value) {
          this.count[1].opt.series[0].data[id].value = this.countValue[id].value
          count1 = this.count[1].count + this.countValue[id].value
        } else {
          this.count[1].opt.series[0].data[id].value = '-'
          count1 = this.count[1].count
        }
        this.count[1].count = count1
        this.isDefaultShow(1, !count1)

        let count2 = 0
        if (this.closeValue[id].value) {
          this.count[2].opt.series[0].data[id].value = this.closeValue[id].value
          if (this.count[2].count === '999+') {
            this.$set(this.color, id, !this.color[id])
            this.isDefaultShow(2, !this.count[2].count)
            return
          }
          count2 = this.count[2].count + this.closeValue[id].value
        } else {
          this.count[2].opt.series[0].data[id].value = '-'
          count2 = this.count[2].count
        }
        this.count[2].count = count2 > 999 ? '999+' : count2
        this.isDefaultShow(2, !count2)
      }
      this.$set(this.color, id, !this.color[id])
    },
    isDefaultShow(id, isShow = false) {
      // 为0展示
      if (isShow) {
        this.count[id].opt.series[0].data[4] = { value: 1, name: '默认提示' }
        this.count[id].opt.tooltip.show = false
      }
      // 不为0展示
      else {
        this.count[id].opt.series[0].data[4] = { value: '', name: '默认提示' }
        this.count[id].opt.tooltip.show = true
      }
    },
    /**
    点击路由跳转事件
    @ 没法传参，必须无参数，真他妈烦人
    */
    PathRoute(params) {
      setTimeout(() => {
        if (params) {
          switch (params.name) {
            case '信息':
              this.routerChange(this.path, 'status', this.status, 'LEVEL', '1')
              break
            case '告警':
              this.routerChange(this.path, 'status', this.status, 'LEVEL', '2')
              break
            case '故障':
              this.routerChange(this.path, 'status', this.status, 'LEVEL', '3')
              break
            default:
              this.routerChange(this.path, 'status', this.status, 'LEVEL', '4')
              break
          }
        } else {
          this.routerChange(this.path, 'status', this.status, 'LEVEL', '')
        }
      }, 200)
    },
    // 冒泡机制改变路由地址
    changePath(path, status) {
      this.path = path
      if (status == 2) {
        this.status = 99
      } else {
        this.status = status
      }
    },
    loadData() {
      this.getNotCount()
      this.getCounting()
      this.getClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.count {
  width: 100%;
  padding: 8px 10px;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  height: 346px;
  &-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 62px;
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;
    &-word {
      margin: 20px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    &-tabs {
      display: flex;
      flex-direction: row;
      margin: auto 20px;
      &-box {
        @extend .count-title-tabs;
        align-items: center;
        font-size: 12px;
        margin: 0 5px;
        div {
          margin-right: 5px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
        }
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    width: 100%;
    height: 284px;
    border-radius: 0 0 10px 10px;
    &-box {
      flex: 1;
      text-align: center;
      justify-items: center;
      display: flex;
      flex-direction: column;
      position: relative;
      height: 252px;
      &-pie {
        border-right: 3px solid rgb(244, 246, 250);
        width: 100%;
        height: 216px;
      }
      &-count {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -100%);
        margin: auto;
        font-size: 32px;
        color: #0076ff;
        cursor: pointer;
        span {
          font-size: 18px;
        }
      }
      &-name {
        margin: auto;
        font-size: 14px;
        // font-weight: 700;
        color: #444f5a;
        cursor: pointer;
      }
    }
  }
}
</style>
