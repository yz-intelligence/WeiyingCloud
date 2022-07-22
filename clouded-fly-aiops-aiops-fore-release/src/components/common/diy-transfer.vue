<template>
  <div class="transfer">
    <!-- 左边部分 -->
    <slot name="left" :data="all">
      <el-table :height="250" :data="all">
        <el-table-column type="selection" width="45" align="center"> </el-table-column>
        <el-table-column prop="email" width="220" label="邮箱" />
        <el-table-column prop="nickname" label="姓名" />
      </el-table>
    </slot>
    <!-- 穿梭框中间按钮 -->
    <slot>
      <div class="transfer-center">
        <!-- 向右 -->
        <el-button
          :disabled="!Boolean(unselectList.length)"
          type="primary"
          class="button"
          icon="el-icon-arrow-right"
          size="mini"
          @click="toRight"
        ></el-button>
        <!-- 向左 -->
        <el-button
          :disabled="!Boolean(selectList.length)"
          type="primary"
          class="button"
          icon="el-icon-arrow-left"
          size="mini"
          @click="toLeft"
        ></el-button>
      </div>
    </slot>
    <!-- 右边部分 -->
    <slot name="right" :data="link">
      <el-table :height="250" :data="link">
        <el-table-column type="selection" width="45" align="center"> </el-table-column>
        <el-table-column prop="email" width="220" label="邮箱" />
        <el-table-column prop="nickname" label="姓名" />
      </el-table>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'DiyTransfer',
  props: {
    // 未关联部分
    unselect: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 关联部分
    select: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 未关联部分打钩区域
    unselectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 关联部分打钩区域
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      link: this.select,
      all: this.unselect
    }
  },
  methods: {
    // 移除
    toLeft() {
      let { all, link, selectList } = this
      const newlink = this.ArrayDelete(link, selectList)
      const newunselect = [...selectList, ...all]
      this.$emit('update:unselect', newunselect)
      this.$emit('update:select', newlink)
      this.$emit('update:selectList', [])
    },
    // 关联
    toRight() {
      let { all, link, unselectList } = this
      const newall = this.ArrayDelete(all, unselectList)
      const newselect = [...unselectList, ...link]
      this.$emit('update:select', newselect)
      this.$emit('update:unselect', newall)
      this.$emit('update:unselectList', [])
    },
    // 删除勾选部分
    ArrayDelete(oldArray, deleteArray) {
      let newArray = oldArray
      let length = oldArray.length - deleteArray.length
      for (let a in deleteArray) {
        for (let b in oldArray) {
          if (deleteArray[a] === oldArray[b]) {
            newArray.splice(b, 1)
          }
          if (length === newArray.length) {
            return newArray
          }
        }
      }
      return newArray
    }
  },
  watch: {
    select: {
      handler(e) {
        this.link = e
      }
    },
    unselect: {
      handler(e) {
        this.all = e
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.transfer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: auto;
  &-center {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: auto 0;
    .button {
      margin: 6px 11px;
      width: 32px;
    }
  }
}
</style>
