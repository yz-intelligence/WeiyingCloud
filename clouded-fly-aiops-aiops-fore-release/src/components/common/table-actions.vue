<template>
  <div class="table-actions">
    <template v-for="(item, index) of _actions">
      <div class="table-actions-item" :key="item.id">
        <el-button class="table-actions-item--button" type="text" @click="actionClick(item)">{{ item.name }}</el-button>
        <span v-if="index !== actionTotal - 1" class="table-actions-hr" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TableActions',
  props: {
    actions: {
      type: Array,
      default: () => [{ name: '详情', id: '1', disabled: false }]
    },
    scope: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    permissions() {
      return this.$store.getters.permissions
    },
    // disabled得不显示
    _actions() {
      const actions = this.actions.filter(action => {
        // 不设置permission参数，或者设置permission参数且拥有权限，则显示
        const hasPermission = !action.permission || this.permissions.includes(action.permission)
        return !action.disabled && hasPermission
      })
      return actions
    },
    actionTotal() {
      return this._actions.length || 0
    }
  },
  methods: {
    actionClick(item) {
      // 第一个参数为操作命令id
      // 第二个参数为当前行数据
      // 第三个参数为操作命令数据
      this.$emit('click', item.id, this.scope, item)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-actions {
  @include flex(flex-start);
  &-item {
    @include flex(flex-start);
    &--button {
      padding: 0;
    }
  }
  &-hr {
    margin: 0 7px;
    width: 2px;
    height: 16px;
    transform: scaleX(0.5);
    background-color: #dcdee3;
  }
}
</style>
