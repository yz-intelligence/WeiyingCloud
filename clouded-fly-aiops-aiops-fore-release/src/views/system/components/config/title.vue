<template>
  <div class="config-title">
    <span class="config-title-title">{{ title }}</span>
    <span
      v-show="showAction"
      class="config-title-action"
      @click="change"
      :title="edited ? '丢弃本次修改' : '修改配置'"
      >{{ edited ? '取消' : '编辑' }}</span
    >
  </div>
</template>

<script>
export default {
  name: 'ConfigTitle',
  model: {
    prop: 'edited',
    event: 'change'
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    edited: Boolean, // 编辑状态
    showAction: {
      // 显示按钮
      type: Boolean,
      default: true
    }
  },
  methods: {
    change() {
      this.$emit('change', !this.edited)
    }
  }
}
</script>

<style lang="scss" scoped>
.config-title {
  @include flex(space-between, center);
  margin-left: 20px;
  padding: 20px 0 14px;
  border-bottom: 1px solid #eee;
  &-title {
    font-weight: 700;
  }
  &-action {
    margin-right: 24px;
    min-width: 56px;
    text-align: right;
    cursor: pointer;
    user-select: none;
    color: $--color-primary;
  }
}
</style>
