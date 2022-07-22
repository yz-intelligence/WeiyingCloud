<template>
  <div class="customer">
    <!-- 占用ID隐藏客服进入页面 -->
    <div id="_QD_INVITE_IFRAME_ID_PREFIX_3009045941"></div>
    <div
      id="shijianpingtai"
      ref="customer"
      class="customer-box"
      @mousedown="handleDown"
      @mouseup="handleUp"
      @mouseout="handleOut"
    >
      <img ref="img" src="../../assets/images/common/service.png" alt="" class="customer-pic" draggable="false" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Customer',
  data() {
    return {
      move: false
    }
  },
  created() {
    this.loadCustomer()
  },
  methods: {
    loadCustomer() {
      let cus = document.createElement('script')
      cus.id = 'qd30090459410d9d74cf990e5830f47872c66fb4682c'
      cus.src = 'https://wp.qiye.qq.com/qidian/3009045941/0d9d74cf990e5830f47872c66fb4682c'
      cus.charset = 'utf-8'
      cus.async = true
      cus.defer = true
      document.getElementsByTagName('body')[0].appendChild(cus)
      cus.onload = function () {
        console.log('客服加载成功')
      }
      cus.onerror = function () {
        console.log('客服加载失败')
      }
    },
    handleDown(event) {
      const box = this.$refs.customer
      let innerY = event.clientY - box.offsetTop
      this.move = false
      box.onmousemove = event => {
        this.handleMove(event, innerY)
      }
    },
    handleUp() {
      const box = this.$refs.customer
      const img = this.$refs.img
      box.onmousemove = null
      if (this.move) {
        img.onclick = event => {
          this.testClick(event)
        }
      } else {
        img.onclick = null
      }
    },
    handleMove(event, innerY) {
      this.move = true
      const box = this.$refs.customer
      box.style.left = event.clientX
      box.style.top = event.clientY - innerY + 'px'
      if (parseInt(box.style.top) < 60) {
        box.style.top = 60 + 'px'
      }
      if (parseInt(box.style.top) > 700) {
        box.style.top = 700 + 'px'
      }
    },
    handleOut() {
      this.handleUp()
    },
    testClick(e) {
      e.stopPropagation()
    }
  }
}
</script>
<style lang="scss" scoped>
.customer {
  position: absolute;
  &-box {
    position: fixed;
    height: 50px;
    width: 50px;
    top: 85%;
    right: 0;
    cursor: pointer;
    background-color: #0076ff;
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-pic {
    width: 36px;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
