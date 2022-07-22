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
      <p class="guide-content">恭喜您已经完成所有教程。</p>
      <el-row>
        <el-button size="small" class="guide-button" type="success" @click="$router.push('/home')">返回首页</el-button>
        <el-button size="small" class="guide-button" type="success" @click="$router.push('/home?intro')"
          >重新开始</el-button
        >
      </el-row>
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
      this.$emit('close')
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
    padding-top: 10px;
    color: #02c58d;
  }
  &-content {
    font-size: 24px;
    margin: 16px 0;
  }
}
.guide {
  &::v-deep .el-dialog__header {
    padding: 0;
    padding-bottom: 0;
  }
}
</style>
