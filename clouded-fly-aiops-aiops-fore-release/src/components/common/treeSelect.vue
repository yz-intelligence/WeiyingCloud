<template>
  <el-select
    :value="valueTitle"
    :clearable="clearable"
    @clear="clearHandle"
    :placeholder="placeholder"
    :disabled="disabled"
  >
    <el-option :value="valueTitle" :label="valueTitle">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'el-tree-select',
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          children: 'children', // 子级字段名
          label: 'name', // 显示名称
          value: 'id' // ID字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 初始值 */
    value: {
      type: String,
      default: () => {
        return ''
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '请选择'
      }
    },
    // 是否只读
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只有叶子结点可选
    isLeaf: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valueId: this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  mounted() {
    this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label] // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
        this.defaultExpandedKey = [this.valueId] // 设置默认展开
      }
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => (ele.style.width = 0))
      })
    },
    // 切换选项
    handleNodeClick(node) {
      // 如果只是叶子结点可选
      if (this.isLeaf) {
        if (node.classifyType === 'child') {
          // 同样的又点了一次则清空
          if (this.valueId === node[this.props.value]) {
            this.$emit('input', '')
            return
          }
          // 否则则选中或切换值
          this.valueTitle = node[this.props.label]
          this.valueId = node[this.props.value]
          this.$emit('input', this.valueId)
          this.defaultExpandedKey = []
        }
      }
      // 全都可选
      else {
        // 同样的又点了一次则清空
        if (this.valueId === node[this.props.value]) {
          this.$emit('input', '')
          return
        }
        // 否则则选中或切换值
        this.valueTitle = node[this.props.label]
        this.valueId = node[this.props.value]
        this.$emit('input', this.valueId)
        this.defaultExpandedKey = []
      }
    },
    // 清除选中
    clearHandle() {
      this.clearSelected()
      this.$emit('input', '')
      this.defaultExpandedKey = []
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach(element => element.classList.remove('is-current'))
    }
  },
  watch: {
    value() {
      this.valueId = this.value
      if (!this.value) {
        this.valueTitle = ''
      }
      this.initHandle()
    }
  }
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #666;
  font-weight: normal;
}
</style>
