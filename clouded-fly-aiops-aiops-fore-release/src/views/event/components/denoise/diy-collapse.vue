<template>
  <div class="merge">
    <el-collapse v-model="activeName" accordion>
      <div class="merge-box" v-for="(item, index) in condition" :key="item.id">
        <!-- 左边关系 -->
        <div v-if="showOr(index)" class="merge-relation">
          <div class="merge-relation-top"></div>
          <div class="merge-relation-center">或</div>
          <div class="merge-relation-bottom"></div>
        </div>
        <el-collapse-item class="merge-collapse" :name="item.id">
          <!-- 顶部内容 -->
          <template slot="title">
            <div class="merge-title">
              <p :class="changeTitle(item.mergeContent) ? '' : 'gray'">
                {{ changeTitle(item.mergeContent) || '请选择合并条件' }}
              </p>
              <div class="table-actions">
                <!-- 编辑 -->
                <div class="table-actions-item">
                  <el-button class="table-actions-item--button" type="text" size="medium">
                    {{ item.id === activeName ? '收起' : '编辑' }}
                  </el-button>
                  <span class="table-actions-hr" />
                </div>
                <!-- 删除 -->
                <div class="table-actions-item">
                  <el-button
                    class="table-actions-item--button"
                    type="text"
                    @click.stop="deleteCondition(index)"
                    size="medium"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </template>
          <!-- 展开内容 -->
          <div class="merge-content">
            <el-checkbox-group v-model="item.mergeContent" size="small">
              <el-checkbox v-for="(oV, oK) in item.content" :key="oK" :label="oK">
                {{ oV.conditionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-collapse-item>
      </div>
      <el-button
        plain
        class="merge-button"
        size="small"
        icon="el-icon-plus"
        @click="addCondition"
        :disabled="condition.length >= 10"
        >新增</el-button
      >
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: 'DiyCollapse',
  props: {
    condition: {
      type: Array,
      default: () => {
        return [
          {
            id: 0,
            content: this.conditionRelation,
            mergeContent: []
          }
        ]
      }
    },
    // 多选框字典
    conditionRelation: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      activeName: 0
    }
  },
  methods: {
    // 删除
    deleteCondition(index) {
      this.condition.splice(index, 1)
      this.$parent.$emit('el.form.change')
    },
    // 添加
    addCondition() {
      const { length } = this.condition
      let id
      if (length) {
        id = this.condition[length - 1].id
      } else {
        id = -1
      }
      let data = {
        id: id + 1,
        content: this.conditionRelation,
        mergeContent: []
      }
      this.condition.push(data)
      this.activeName = id + 1
      this.$parent.$emit('el.form.change')
    },
    // 设置标题
    changeTitle(item) {
      if (item.length) {
        let data = item.map(i => {
          return this.conditionRelation[i].conditionName
        })
        return data.join('+')
      } else {
        return false
      }
    },
    showOr(index) {
      const { length } = this.condition
      if (length - 1 === index) {
        return false
      }
      return true
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
  color: #333;
  max-height: 250px;
  overflow: auto;
  &-collapse {
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 2px;
    width: 600px;
    margin-bottom: 24px;
    &::v-deep .el-collapse-item__arrow {
      display: none !important;
    }
  }
  &::v-deep .el-collapse {
    border: none;
  }
  &::v-deep .el-collapse-item__header {
    min-height: 32px;
    height: auto;
    border: none;
  }
  &-title {
    @include flex(space-between);
    width: 100%;
    min-height: 32px;
    height: auto;
    margin: 0 16px;
    font-size: 14px !important;
    border-radius: 2px;
    p {
      line-height: 2;
    }
  }
  &-content {
    padding: 12px 16px 0;
    border-top: 1px solid #dddddd;
    &::v-deep .el-checkbox {
      color: #333;
    }
  }
  &-button {
    width: 600px;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 4px;
    margin-left: 56px;
    color: #0076ff;
  }
  &-box {
    @include flex(flex-end, stretch);
    height: auto;
  }
  &-relation {
    width: 56px;
    min-height: 56px;
    flex: 1;
    position: relative;
    top: 18px;
    margin-bottom: 2px;
    @include flex(space-between, center, column);
    &-top {
      width: 33px;
      flex: 1;
      border-top: 1px solid #919eab;
      border-left: 1px solid #919eab;
      margin-left: 20px;
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
      margin-left: 20px;
    }
  }
}

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
    height: 20px;
    transform: scaleX(0.5);
    background-color: #dcdee3;
  }
}

.gray {
  color: #c8cbd2;
}
</style>
