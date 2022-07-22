<template>
  <el-dialog
    width="600px"
    class="guide"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="editVisible"
    @close="close"
  >
    <div class="guide-wrap">
      <i class="el-icon-s-flag guide-icon"></i>
      <p class="guide-title">新手教程</p>
      <p class="guide-content">欢迎使用维鹰云，我们为您准备了一些教程，有助您快速了解维鹰云的基本使用方法。</p>
      <el-button size="small" class="guide-button" type="primary" @click="onStart">立即开始</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 首页新手指导入口
export default {
  name: 'Guide',
  props: {
    visible: Boolean
  },
  data() {
    return {
      editVisible: this.visible
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      // 退出新手指导
      const isIntro = 'intro' in this.$route.query
      isIntro && this.$router.replace('/home')
      this.$emit('close')
    },
    onStart() {
      this.$emit('start')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.guide {
  &-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;
    color: #0076ff;
  }
  &-icon {
    font-size: 50px;
  }
  &-title {
    font-size: 24px;
  }
  &-content {
    margin: 16px 0;
    color: #001800;
  }
}
.guide {
  &::v-deep .el-dialog__header {
    padding: 0;
    padding-bottom: 0;
  }
}
</style>
