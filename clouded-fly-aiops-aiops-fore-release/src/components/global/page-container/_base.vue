<template>
  <div class="page-container">
    <c-breadcrumb :menu="menu" />
    <div class="page">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
  props: {
    // 手动路由名称
    menu: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped></style>
