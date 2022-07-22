<template>
  <div class="input-search">
    <el-input :size="size" v-bind="$attrs" v-on="$listeners" @keyup.enter.native="onSearch" @clear="clear"> </el-input>
    <el-button
      class="input-search-button"
      :size="size"
      type="primary"
      icon="el-icon-search"
      @click="onSearch"
    ></el-button>
  </div>
</template>

<script>
export default {
  name: 'WyInputSearch',
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: 'small'
    }
  },
  methods: {
    onSearch() {
      this.$emit('search')
    },
    clear() {
      this.$emit('clear')
    }
  }
}
</script>

<style lang="scss" scoped>
.input-search {
  @include flex();
  &::v-deep .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
