<template>
  <div type="flex" class="report">
    <!-- 首层标题 -->
    <div class="report-title">
      <p class="report-title-word">今日事件</p>
    </div>
    <div class="report-content">
      <!-- 下面五个盒子 -->
      <div
        class="report-content-item"
        v-for="(item, index) in event"
        :style="index === 4 ? 'border-right:none' : ''"
        :key="index"
      >
        <!-- 小盒子标题和tips提示 -->
        <div class="report-content-item-title">
          <span slot="reference">{{ item.title }}</span>
          <el-tooltip effect="dark" placement="top-start" trigger="hover" :offset="50">
            <i class="cursor tips el-icon-tip"></i>
            <div slot="content">
              <div class="tooltips">
                <div>
                  {{ item.tips }}
                </div>
              </div>
            </div>
          </el-tooltip>
        </div>
        <!-- 第一个盒子下方数据和tips提示 -->
        <el-popover v-if="index === 0" placement="right-start" trigger="hover" :visible-arrow="false">
          <div class="tooltips">点击查看今日事件列表</div>
          <span class="report-content-item-detail cursor" slot="reference">
            <span id="home_span_todayevent" @click="routerChange('/event/record', 'firstTime', 'today')"
              >{{ item.detail }}
            </span>
            <span class="unit">{{ item.unit }}</span>
          </span>
        </el-popover>

        <!-- 后面四个盒子下方数据 -->
        <div v-else class="report-content-item-detail">
          <span>{{ item.detail }} </span>
          <span class="unit">{{ item.unit }}</span>
        </div>

        <img :src="item.img" />
      </div>
    </div>
  </div>
</template>
<script>
import { getTodayReport } from '@/apis/dashboard'
import home from '@/mixins/homeChange'
import time from '@/mixins/timeInterval'
export default {
  name: 'report',
  mixins: [home, time],
  data() {
    return {
      event: [
        {
          title: '事件量',
          detail: '0',
          unit: '条',
          tips: '今日00:00到当前时间接收到的所有事件总和（被压缩的事件、恢复事件、维护期事件和被合并事件不计入统计）',
          img: require('@/assets/images/home/alarm.png')
        },
        {
          title: '平均关闭时长',
          detail: '0',
          unit: '秒',
          tips: '今日人工关闭事件的时长总和/今日人工关闭的事件总量',
          img: require('@/assets/images/home/min.png')
        },
        {
          title: '平均响应时长',
          detail: '0',
          unit: '秒',
          tips: '今日人工响应事件的时长总和/今日人工响应的事件总量',
          img: require('@/assets/images/home/clock.png')
        },
        {
          title: '事件有效率',
          detail: '0',
          unit: '%',
          tips: '今日有效事件量/今日压缩后事件总量',
          img: require('@/assets/images/home/effi.png')
        },
        {
          title: '事件压缩率',
          detail: '0',
          unit: '%',
          tips: '今日被压缩掉的事件量/今日接收到的事件总量',
          img: require('@/assets/images/home/ratio.png')
        }
      ]
    }
  },
  methods: {
    // 获取今日事件
    async loadData() {
      const { success, data, desc } = await getTodayReport()
      if (success) {
        let { total, closeTimes, responseTimes, validity, compress } = data
        // 获取事件量
        this.event[0].detail = total
        // 获取平均关闭时长
        if (closeTimes > 99) {
          this.event[1].detail = (closeTimes / 60).toFixed(2)
          this.event[1].unit = '分钟'
        } else {
          this.event[1].detail = closeTimes ? closeTimes.toFixed(2) : closeTimes
        }
        // 获取平均响应时长
        if (responseTimes > 99) {
          this.event[2].detail = (responseTimes / 60).toFixed(2)
          this.event[2].unit = '分钟'
        } else {
          this.event[2].detail = responseTimes ? responseTimes.toFixed(2) : responseTimes
        }
        // 获取事件有效率
        this.event[3].detail = validity === 100 || validity === 0 ? validity : validity.toFixed(2)
        // 获取事件压缩率
        this.event[4].detail = compress === 100 || compress === 0 ? compress : compress.toFixed(2)
      } else {
        desc && this.$Message.error(desc)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.report {
  width: 100%;
  padding: 8px 10px;
  min-width: 1200px;
  height: auto;
  display: flex;
  flex-direction: column;
  &-title {
    width: 100%;
    height: 62px;
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;
    display: flex;
    &-word {
      margin: 20px;
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
    height: 114px;
    border-radius: 0 0 10px 10px;
    &-item {
      flex: 1;
      padding: 20px;
      background-repeat: no-repeat;
      border-right: 3px solid #f4f6fa;
      position: relative;
      &-title {
        color: #989da3;
        font-weight: 700;
        font-size: 14px;
      }
      &-detail {
        margin-top: 5px;
        font-size: 34px;
        font-weight: 700;
        color: #0076ff;
        .unit {
          font-size: 14px;
          font-weight: 700;
          color: #333;
        }
      }
      img {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
.cursor {
  cursor: pointer;
}
.tips {
  width: 14px;
  height: 14px;
  position: relative !important;
  left: 4px;
}
.tooltips {
  max-width: 232px;
  padding: 5px 8px 3px;
  font-size: 12px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 18px;
}
</style>
