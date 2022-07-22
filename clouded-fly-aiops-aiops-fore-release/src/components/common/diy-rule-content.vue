<template>
  <div class="merge">
    <div class="merge-box" v-for="(item, index) in contents" :key="index">
      <!-- 左边关系 -->
      <div v-if="showOr(index)" class="merge-relation">
        <div class="merge-relation-top"></div>
        <div class="merge-relation-center">{{ relation === 'and' ? '与' : '或' }}</div>
        <div class="merge-relation-bottom"></div>
      </div>
      <div class="form-flex">
        <!-- 下拉栏一 -->
        <div class="form-flex-select">
          <el-select
            v-model="item.field"
            size="small"
            placeholder="请选择"
            @change="changeField(item, index)"
            :disabled="disabled"
          >
            <el-option v-for="(oV, oK) in fieldOpt" :value="oK" :key="oK" :label="oV"></el-option>
          </el-select>
        </div>
        <!-- 下拉栏二 -->
        <div class="form-flex-select form-flex-condition">
          <!-- 事件级别和监控源选项 -->
          <el-select
            v-if="item.field === 'LEVEL' || item.field === 'MONITOR_CODE'"
            v-model="item.condition"
            size="small"
            placeholder=""
            disabled
          >
            <el-option value="in" label="包含"></el-option>
          </el-select>
          <!-- 其他选项 -->
          <el-select v-else v-model="item.condition" size="small" placeholder="" :disabled="disabled">
            <el-option v-for="(oV, oK) in conditionOpt" :value="oK" :key="oK" :label="oV"></el-option>
          </el-select>
        </div>
        <!-- 下拉栏三 -->
        <div class="form-flex-title">
          <!-- 选事件级别时 -->
          <el-select
            style="width: 100%"
            v-if="item.field === 'LEVEL'"
            size="small"
            v-model="item.value"
            multiple
            :disabled="disabled"
          >
            <el-option v-for="(oV, oK) in levelOpt" :value="oK" :key="oK" :label="oV"></el-option>
          </el-select>
          <!-- 选监控源时 -->
          <el-select
            style="width: 100%"
            v-else-if="item.field === 'MONITOR_CODE'"
            size="small"
            v-model="item.value"
            multiple
            :disabled="disabled"
          >
            <el-option v-for="(oV, oK) in SourceOpt" :value="oV.conf" :key="oK" :label="oV.name"></el-option>
          </el-select>
          <!-- 其他 -->
          <el-input
            v-else
            type="text"
            size="small"
            :maxlength="100"
            v-model.trim="item.value"
            placeholder="内容"
            :disabled="disabled"
          />
        </div>
        <!-- 增加和减少按钮 -->
        <div v-if="contents.length !== 1" class="form-flex-button">
          <el-button
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
import { mapGetters } from 'vuex'
export default {
  name: 'DiyRuleContent',
  props: {
    value: {
      type: Array,
      default: () => {
        return [
          {
            field: 'NAME',
            condition: 'in',
            value: ''
          }
        ]
      }
    },
    SourceOpt: {
      type: Array,
      default: () => []
    },
    relation: {
      type: String,
      default: 'and'
    },
    // 是否只读
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['fieldOpt', 'conditionOpt', 'levelOpt'])
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
    // 修改规则内容选项
    changeField(item, index) {
      item.condition = 'in' // 事件级别只能等于
      this.contents[index].value = ''
      this.$emit('input', this.contents)
    },
    // 规则内容加号功能
    addRuleContent() {
      this.contents.push({
        field: 'NAME',
        condition: 'in',
        value: ''
      })
      this.$emit('input', this.contents)
      this.$parent.$emit('el.form.change')
    },
    // 规则内容减号功能
    delRuleContent(index) {
      if (this.contents.length === 1) return
      this.contents.splice(index, 1)
      this.$emit('input', this.contents)
      this.$parent.$emit('el.form.change')
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
  display: flex;
  flex-direction: column;
  background: #f9fafe;
  border: 1px solid #dddddd;
  border-radius: 2px;
  padding: 16px 48px;
  color: #333;
  max-height: 175px;
  overflow: auto;
  &-box {
    @include flex(flex-end, stretch);
    position: relative;
    height: auto;
  }
  &-relation {
    width: 56px;
    flex: 1;
    position: absolute;
    left: -50px;
    top: 27px;
    margin-bottom: 2px;
    @include flex(space-between, center, column);
    &-top {
      width: 33px;
      flex: 1 0 auto;
      height: 6px;
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
      height: 6px;
      flex: 1 0 auto;
      border-bottom: 1px solid #919eab;
      border-left: 1px solid #919eab;
      margin-left: 28px;
    }
  }
  &-button {
    width: 100%;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 4px;
    margin-top: 8px;
    color: #0076ff;
  }
}

.form {
  &-flex {
    @include flex(flex-start, flex-start);
    margin: 8px 0;
    &-select {
      width: 120px;
      margin-right: 10px;
    }
    &-title {
      flex: 1;
    }
    &-condition {
      width: 80px;
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
      margin-left: 6px;
      text-align: center;
    }
  }
}
</style>
