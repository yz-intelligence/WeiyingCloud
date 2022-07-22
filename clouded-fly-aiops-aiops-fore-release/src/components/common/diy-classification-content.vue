<template>
  <div class="merge">
    <div class="merge-box" v-for="(item, index) in contents" :key="index">
      <!-- 左边关系 -->
      <div v-if="showOr(index)" class="merge-relation">
        <div class="merge-relation-top"></div>
        <div class="merge-relation-center">与</div>
        <div class="merge-relation-bottom"></div>
      </div>
      <div class="form-flex">
        <div class="form-flex-title">
          <el-input
            type="text"
            size="small"
            :maxlength="100"
            v-model.trim="item.value"
            placeholder="内容"
            style="width: 538px"
            :disabled="disabled"
          />
        </div>
        <!-- 增加和减少按钮 -->
        <div class="form-flex-button">
          <el-button
            v-if="contents.length !== 1"
            size="small"
            class="table-actions-item--button"
            type="text"
            @click="delRuleContent(index)"
            :disabled="disabled"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>
    <el-button plain class="merge-button" size="small" icon="el-icon-plus" @click="addRuleContent" :disabled="disabled">
      新增
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'DiyClassificationContent',
  props: {
    value: {
      type: Array,
      default: () => {
        return [
          {
            value: ''
          }
        ]
      }
    },
    // 是否只读
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contents: this.value
    }
  },
  methods: {
    showOr(index) {
      const { length } = this.contents
      if (length - 1 === index) {
        return false
      }
      return true
    },
    // 规则内容加号功能
    addRuleContent() {
      this.contents.push({
        value: ''
      })
      this.$emit('input', this.contents)
    },
    // 规则内容减号功能
    delRuleContent(index) {
      if (this.contents.length === 1) return
      this.contents.splice(index, 1)
      this.$emit('input', this.contents)
    }
  },
  watch: {
    value(val) {
      this.contents = val
    }
  }
}
</script>
<style lang="scss" scoped>
.merge {
  background: #f9fafe;
  border: 1px solid #dddddd;
  border-radius: 2px;
  padding: 16px;
  padding-right: 28px;
  color: #333;
  width: 664px;
  max-height: 175px;
  overflow: auto;
  &-box {
    @include flex(flex-end, stretch);
    height: auto;
  }
  &-relation {
    width: 56px;
    position: relative;
    top: 26px;
    margin-bottom: 2px;
    @include flex(space-between, center, column);
    &-top {
      width: 33px;
      flex: 1;
      border-top: 1px solid #919eab;
      border-left: 1px solid #919eab;
      margin-left: 28px;
    }
    &-center {
      width: 32px;
      height: 32px;
      background: #ffffff;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      color: #0076ff;
      text-align: center;
    }
    &-bottom {
      width: 33px;
      flex: 1;
      border-bottom: 1px solid #919eab;
      border-left: 1px solid #919eab;
      margin-left: 28px;
    }
  }
  &-button {
    width: 538px;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 4px;
    margin-top: 8px;
    color: #0076ff;
    float: right;
    margin-right: 35px;
  }
}

.form {
  &-flex {
    @include flex(top, flex-start);
    width: 572px;
    margin: 8px 0;
    &-title {
      margin-right: 12px;
    }
  }
  &::v-deep .el-radio-group {
    margin: auto 0;
  }
  &::v-deep .el-select__tags-text {
    display: inline-block;
    max-width: 135px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.table-actions {
  &-item {
    &--button {
      padding: 0;
    }
  }
}
</style>
