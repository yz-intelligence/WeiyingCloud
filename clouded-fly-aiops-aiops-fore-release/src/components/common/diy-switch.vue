<template>
  <el-switch
    class="switch"
    :value="newState"
    :width="44"
    :disabled="disabled"
    active-color="#0076ff"
    inactive-color="#CCCCCC"
    :active-value="values[0]"
    :inactive-value="values[1]"
    active-text="开"
    inactive-text="关"
    @change="change"
  >
  </el-switch>
</template>
<script>
export default {
  name: 'DiySwitch',
  props: {
    state: {
      type: [Number, Boolean],
      default: 1,
      require: true
    },
    values: {
      type: Array,
      default: () => [1, 0] //active 1, inactive 0
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    change(e) {
      this.$emit('update:state', e)
      this.$emit('change', e, this.row)
    }
  },
  computed: {
    newState() {
      return this.values[0] === 1 ? Number(this.state) : this.state
    }
  }
}
</script>
<style lang="scss" scoped>
.switch {
  // height: 25px;
  // line-height: 16px;
  &::v-deep .el-switch__label {
    position: absolute;
    color: #fff !important;
    z-index: 1;
    display: none;
  }
  &::v-deep .is-active {
    display: block;
  }
  &::v-deep .el-switch__label--left span {
    margin-left: 25px;
    font-size: 12px;
  }
  &::v-deep .el-switch__label--right span {
    margin-left: -2px;
    font-size: 12px;
  }
}
.el-switch.is-disabled {
  opacity: 0.25;
}
</style>
