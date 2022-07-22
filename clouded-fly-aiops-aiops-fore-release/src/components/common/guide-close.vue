<template>
  <div class="guide-wrap" @click="close" title="点击退出新手教程">
    <div class="guide-close">
      <img class="guide-close-icon" src="../../assets/images/common/close.svg" alt="X" />
    </div>
  </div>
</template>

<script>
// 新手教程按钮
export default {
  name: 'GuideClose',
  methods: {
    close() {
      // this.$confirm('退出后可在菜单内再次进入', '确定退出新手教程吗？', {
      //   confirmButtonText: '确定退出',
      //   cancelButtonText: '返回教程',
      //   customClass: 'guide-exit',
      //   type: 'warning'
      // })
      this.$customMessageBox(this, '确定退出新手教程吗？', '退出后可在菜单内再次进入', 'warning', {
        confirmButtonText: '确定退出',
        cancelButtonText: '返回教程',
        customClass: 'guide-exit'
      })
        .then(() => {
          this.$emit('close')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.guide {
  &-wrap {
    position: fixed;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    overflow: hidden;
    z-index: 9999999999;
  }
  &-close {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    cursor: pointer;
    background-color: #ff3545;
    border-radius: 50%;
    &-icon {
      position: absolute;
      left: 15px;
      bottom: 15px;
      width: 30px;
      height: 30px;
    }
  }
  &-exit {
    z-index: 11111111111111111111111111111;
  }
}
</style>
