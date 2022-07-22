<template>
  <div class="refresh-icon hoverable" title="刷新" @click="resetData()">
    <i class="el-icon-refresh eIcon" :class="{ 'el-icon-loading': loading }"></i>
  </div>
</template>
<script>
export default {
  name: 'refresh',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    resetData() {
      this.$emit('refresh')
    }
  }
}
</script>
<style lang="scss" scoped>
.refresh-icon {
  margin: auto 0;
  color: #0076ff;
  font-size: 18px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  .eIcon {
    margin: auto;
  }
}
</style>
