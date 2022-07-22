<template>
  <el-dialog :width="'840px'" :visible.sync="editVisible" :title="title" :close-on-press-escape="false" @close="close">
    <el-form
      id="upgrade_form_upgrade"
      class="form"
      ref="ClassificationForm"
      :model="ClassificationRules"
      label-width="auto"
      :rules="ClassificationFormRules"
      size="small"
    >
      <!-- 分类 -->
      <el-form-item class="form-option" label="分类" prop="classifyId">
        <el-tree-select
          placeholder="搜索组"
          class="box-item-option"
          :options="classifyTree"
          :props="propSet"
          :isLeaf="false"
          v-model="ClassificationRules.classifyId"
          :disabled="isWatch"
        ></el-tree-select>
      </el-form-item>
      <!-- 关键词 -->
      <el-form-item class="form-option" label="关键词" prop="keyWords">
        <diy-classification-content
          v-model="ClassificationRules.keyWords.content"
          :disabled="isWatch"
        ></diy-classification-content>
      </el-form-item>
      <!-- 监控源类型 -->
      <el-form-item class="form-option" label="监控源类型">
        <el-select
          class="form-select"
          v-model="ClassificationRules.monitorType"
          placeholder="请选择"
          :disabled="isWatch"
        >
          <el-option v-for="(oV, oK) of accessType" :value="oK" :key="oK" :label="oV"></el-option>
        </el-select>
      </el-form-item>
      <!-- 分类来源 -->
      <el-form-item class="form-option" label="分类来源">
        <div>{{ monitorList[ClassificationRules.sourceType] }}</div>
      </el-form-item>
    </el-form>
    <!-- 下方按钮 -->
    <div v-if="!isWatch" class="bottom" slot="footer">
      <el-button id="upgrade_button_cancel" size="small" @click="close">取 消</el-button>
      <el-button id="upgrade_button_submit" size="small" type="primary" :loading="loading" @click="onSubmit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import elTreeSelect from '@/components/common/treeSelect'
import DiyClassificationContent from '@/components/common/diy-classification-content.vue'
import { apiSaveClassify } from '@/apis/classification'
export default {
  name: 'ClassificationRulesEdit',
  components: {
    elTreeSelect,
    DiyClassificationContent
  },
  props: {
    ClassificationRules: {
      type: Object,
      default: () => {
        return {
          id: '',
          classifyId: '',
          keyWords: {
            relation: 'or',
            content: [
              {
                value: ''
              }
            ]
          },
          sourceType: 'MANUALINPUT',
          monitorType: ''
        }
      }
    },
    visible: Boolean,
    title: {
      type: String,
      default: '增加分类规则'
    },
    accessType: {
      type: Object
    },
    // 分类类型树状表
    classifyTree: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否只读
    isWatch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validataKeyWord = (rule, value, callback) => {
      const { content } = this.ClassificationRules.keyWords
      // 判断是否全删了
      if (!content.length) {
        callback(new Error())
      }
      let isNull = true
      content.forEach(item => {
        if (item.value) {
          isNull = false
        }
      })
      // 一个都没填
      if (isNull) {
        callback(new Error())
      }
      callback()
    }
    return {
      ClassificationFormRules: {
        classifyId: [{ required: true, message: '分类不能为空', trigger: 'change' }],
        keyWords: [{ required: true, message: '关键字不能为空', validator: validataKeyWord, trigger: 'change' }]
      },
      loading: false,
      editVisible: this.visible,
      ruleloading: false,
      upgradeLevel: '',
      monitorList: {
        MANUALINPUT: '人工输入',
        AIINPUT: '智能分析'
      },
      // 配置树结构的key和value
      propSet: {
        children: 'children', // 子级字段名
        label: 'classifyName', // 显示名称
        value: 'id' // ID字段名
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.ClassificationForm.resetFields()
    },
    // 提交设置规则
    async onSubmit() {
      this.$refs.ClassificationForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const { success, desc } = await apiSaveClassify(this.setForm())
          this.loading = false
          if (success) {
            this.$Message.success(this.title + '成功')
            this.$emit('success')
            this.close()
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    // 设置表单提交格式
    setForm() {
      const { ClassificationRules } = this
      const params = {
        ...ClassificationRules,
        keyWords: JSON.stringify(ClassificationRules.keyWords)
      }
      return params
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  padding-left: 28px;
  &-option {
    &-select {
      flex: 1;
      margin-right: 14px;
      width: 98%;
    }
  }
  &-flex {
    display: flex;
    justify-content: flex-start;
  }
  &-select {
    width: 140px;
    margin-right: 12px;
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
.bottom {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  &-submit {
    margin: 0 10px;
  }
}
.el-radio,
.el-checkbox {
  margin-right: 16px;
}
.box {
  width: 98%;
  background: #f9fafe;
  border: 1px solid #dddddd;
  border-radius: 2px;
  padding: 16px 24px;
  &-radio {
    padding-left: 2px;
  }
  &-item {
    margin: 8px 0;
    &-label {
      margin: 0 16px 0 32px;
    }
    &-minlabel {
      width: 84px;
      text-align: right;
    }
    &-option {
      flex: 1;
      margin-right: 25px;
      width: 664px;
    }
  }
  &-select {
    width: 529px;
    margin-left: 12px;
  }
  &-number {
    width: 96px;
    margin: 0 12px;
    &::v-deep .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
    .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
      border-color: #dcdfe6;
    }
    &::v-deep .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
    .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
      border-color: #dcdfe6;
    }
  }
  &-minselect {
    width: 140px;
    margin: 0 12px;
  }
  &-group {
    width: 235px;
    margin: 0 12px;
  }
  &::v-deep .merge {
    width: 100%;
  }
}
.point {
  cursor: pointer;
}
.tips {
  width: 14px;
  height: 14px;
  position: relative;
  top: 1px;
}
</style>
