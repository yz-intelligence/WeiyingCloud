<template>
  <el-dialog
    title="事件备注"
    destroy-on-close
    :width="`640px`"
    :close-on-click-modal="!isGuiding"
    :close-on-press-escape="!isGuiding"
    :visible.sync="editVisible"
    @close="close"
  >
    <el-form ref="form" :model="form" size="small" :form="form" :rules="rules">
      <el-form-item prop="remark">
        <el-input
          v-model.trim="form.remark"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 5 }"
          placeholder="请输入填写备注"
          :maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button ref="submit" id="guideEventRemarkBtn" size="small" type="primary" :loading="loading" @click="onSubmit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// 人工报障
import { apiSaveRecords } from '@/apis/event'
export default {
  name: 'EventRemark',
  props: {
    eventIds: {
      type: String,
      required: true
    },
    visible: Boolean,
    isGuiding: Boolean
  },
  data() {
    return {
      loading: false,
      editVisible: this.visible,
      form: {
        remark: ''
      },
      rules: {
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { success, desc } = await apiSaveRecords(this.eventIds, this.form.remark)
          this.loading = false
          if (success) {
            this.$Message.success('添加备注成功')
            this.$emit('success')
            this.close()
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-form-input {
  width: 100%;
}
</style>
