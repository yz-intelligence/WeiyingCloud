<template>
  <div class="layout">
    <div class="layout-header">
      <t-header />
    </div>
    <div class="layout-content">
      <keep-alive>
        <router-view class="layout-view" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view class="layout-view" v-if="!$route.meta.keepAlive" />
    </div>
    <customer></customer>
  </div>
</template>
<script>
import THeader from './header/index'
import Customer from '../../components/common/customer.vue'
export default {
  name: 'LayoutIndex',
  components: {
    THeader,
    Customer
  }
}
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 56px);
  background-color: $layout-color;
  &-header {
    height: 56px;
    margin: 0;
  }
  &-content {
    height: calc(100% - 56px);
    overflow-y: auto;
    margin: 0;
  }
}
</style>
