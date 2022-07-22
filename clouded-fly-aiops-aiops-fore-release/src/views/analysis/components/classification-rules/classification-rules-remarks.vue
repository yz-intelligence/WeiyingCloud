<template>
  <el-dialog :width="'640px'" :visible.sync="editVisible" :title="title" :close-on-press-escape="false" @close="close">
    <el-form class="form" label-width="auto" size="small">
      <!-- 备注 -->
      <el-form-item label="备注" class="form-option">
        <el-input
          class="textarea"
          type="textarea"
          size="small"
          :rows="4"
          :maxlength="100"
          v-model.trim="remarks"
          @input="handleInput"
          placeholder="请输入备注"
          :disabled="isWatch"
        />
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
import { apiUpdateClassifyStatus } from '@/apis/classification'
export default {
  name: 'ClassificationRulesRemarks',
  props: {
    visible: Boolean,
    value: {
      type: String,
      default: ''
    },
    // 状态信息
    stateObj: {
      type: Object,
      default: () => {
        return {
          id: '',
          state: false
        }
      }
    },
    title: {
      type: String,
      default: '备注'
    },
    // 是否只读
    isWatch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      editVisible: this.visible,
      remarks: this.value
    }
  },
  methods: {
    handleInput(val) {
      this.$emit('input', val)
    },
    close() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 提交设置规则
    async onSubmit() {
      const { id, state } = this.stateObj
      const { success, desc } = await apiUpdateClassifyStatus(id, { state: Boolean(state), remarks: this.remarks })
      if (success) {
        this.$Message.success('状态修改成功')
        this.close()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 设置表单提交格式
    setForm() {
      const { ClassificationRules } = this
      const params = {
        ...ClassificationRules,
        keyWords: JSON.stringify(ClassificationRules.keyWords)
      }
      console.log(params)
      return params
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    },
    value(val) {
      this.remarks = val
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  &-submit {
    margin: 0 10px;
  }
}
.form {
  padding: 32px 0;
  padding-left: 20px;
}
.textarea {
  width: 508px;
}
::v-deep .el-dialog__footer {
  padding: 12px 32px;
}
</style>
