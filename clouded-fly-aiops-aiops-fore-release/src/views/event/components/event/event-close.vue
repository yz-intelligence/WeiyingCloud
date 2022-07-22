<template>
  <el-dialog
    title="事件关闭"
    :width="`640px`"
    :close-on-click-modal="!isGuiding"
    :close-on-press-escape="!isGuiding"
    destroy-on-close
    :visible.sync="editVisible"
    @close="close"
  >
    <el-form ref="form" :model="form" size="small" :form="form">
      <el-form-item label="有效性判断" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="(item, key) of validityOpt" :key="item" :label="+key">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="处理意见" prop="bz">
        <el-input
          v-model.trim="form.bz"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 5 }"
          placeholder="请输入处理意见"
          :maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button ref="submit" id="eventCloseSubmitBtn" size="small" type="primary" :loading="loading" @click="onSubmit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// 人工报障
import { apiCloseEvents } from '@/apis/event'
import { mapGetters } from 'vuex'
export default {
  name: 'EventClose',
  props: {
    eventIds: {
      type: String,
      required: true
    },
    visible: Boolean,
    isGuiding: Boolean
  },
  computed: {
    ...mapGetters(['validityOpt'])
  },
  data() {
    return {
      loading: false,
      editVisible: this.visible,
      form: {
        status: 0,
        bz: ''
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
          const { bz, status } = this.form
          const { success, desc } = await apiCloseEvents(this.eventIds, bz, status)
          this.loading = false
          if (success) {
            this.$Message.success('关闭成功')
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
