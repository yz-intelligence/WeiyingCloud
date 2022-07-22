<template>
  <el-dialog :title="title" :width="`460px`" :visible.sync="editVisible" @close="close">
    <el-form ref="form" :model="form" size="small" :form="form" :rules="rules">
      <el-form-item label="角色名称" prop="name" label-width="90px">
        <el-input
          v-model.trim="form.name"
          placeholder="请输入角色名称"
          :maxlength="100"
          clearable=""
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { apiEditRole } from '@/apis/user'
export default {
  name: 'RoleEdit',
  props: {
    title: {
      type: String,
      default: '新增角色'
    },
    // 当前编辑数据
    record: {
      type: Object,
      default: () => {}
    },
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      editVisible: this.visible,
      form: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    },
    record: {
      handler(val) {
        this.form.name = val ? val.name : ''
      },
      immediate: true
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
          const params = {
            id: this.record.id,
            ...this.form
          }
          const { success, desc } = await apiEditRole(params)
          this.loading = false
          if (success) {
            this.$Message.success('保存成功')
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

<style lang="scss" scoped></style>
