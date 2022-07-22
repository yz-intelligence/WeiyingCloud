export default {
  data() {
    return {
      time: ''
    }
  },
  mounted() {
    // 一分钟更新一次数据
    this.loadData()
    this.time = setInterval(this.loadData, 60000)
  },
  beforeDestroy() {
    clearInterval(this.time)
  }
}
