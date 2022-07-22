<template>
  <div class="card">
    <div
      :id="'home_div_card' + index"
      class="card-box"
      :style="'background-image: url(' + item.img + ');'"
      @click="routerChange(item.router)"
      v-for="(item, index) in card"
      :key="index"
    >
      <P class="card-box-number">0{{ index + 1 }}</P>
      <p class="card-box-title">{{ item.title }}</p>
      <p class="card-box-discription">{{ item.discrip }}</p>
    </div>
  </div>
</template>
<script>
import home from '@/mixins/homeChange'
export default {
  name: 'card',
  mixins: [home],
  data() {
    this.card = [
      {
        img: require('@/assets/images/home/01.png'),
        title: '监控源管理',
        discrip: '无缝对接各种云平台及主流监控工具，解决事件信息分散的烦恼',
        router: '/monitor/access'
      },
      {
        img: require('@/assets/images/home/02.png'),
        title: '事件订阅',
        discrip: 'AI算法智能降噪后在此统一处理，告别事件风暴，提升处理效率',
        router: '/notice/rules'
      },
      {
        img: require('@/assets/images/home/03.png'),
        title: '事件处理',
        discrip: 'AI算法智能降噪后在事件中心统一处理，告别事件风暴',
        router: '/event/realtime'
      },
      {
        img: require('@/assets/images/home/04.png'),
        title: '事件分析',
        discrip: '事件智能分析，了解事件产生的趋势、分布和处理情况；清晰直观的事件仪表盘',
        router: '/analysis/overview'
      }
    ]
    return {}
  }
}
</script>
<style lang="scss" scoped>
.card {
  min-height: 200px;
  min-width: 1200px;
  display: flex;
  flex-wrap: nowrap;
  padding: 8px 0;
  &-box {
    flex: 1;
    min-height: 194px;
    background-color: white;
    background-repeat: no-repeat;
    background-size: contain;
    margin: 0 10px;
    padding: 20px 30px 0 20px;
    border-radius: 8px;
    &-number {
      font-size: 25px;
      color: #d3d3d3;
    }
    &-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 10px 0 20px 0;
    }
    &-discription {
      font-size: 14px;
      color: #999999;
      min-height: 30px;
    }
    &:hover {
      border-radius: 8px;
      box-shadow: 3px 3px 8px 2px #e1e5f2;
      transition: all 0.4s ease-in-out;
      cursor: pointer;
    }
  }
}
</style>
