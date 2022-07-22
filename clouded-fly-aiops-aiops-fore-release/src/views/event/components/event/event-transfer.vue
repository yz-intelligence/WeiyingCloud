<template>
  <el-dialog
    title="事件转派"
    destroy-on-close
    :width="`640px`"
    :close-on-click-modal="!isGuiding"
    :close-on-press-escape="!isGuiding"
    :visible.sync="editVisible"
    @close="close"
  >
    <el-form
      id="eventTransferMain"
      ref="form"
      :model="form"
      size="small"
      :form="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="转派用户" prop="selectedUser">
        <el-select class="comp-form-input" v-model="form.selectedUser" multiple filterable>
          <el-option v-for="item in users" :key="item.ID" :value="item.ID" :label="item.NICKNAME">{{
            item.NICKNAME
          }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="意见/建议" prop="bz">
        <el-input
          v-model.trim="form.bz"
          type="textarea"
          :maxlength="1000"
          show-word-limit
          placeholder="请输入"
          :autosize="{ minRows: 4, maxRows: 5 }"
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
// 事件转派
import { apiAssigns } from '@/apis/event'
import { apiSelectUser } from '@/apis/user'
import { mapGetters } from 'vuex'
export default {
  name: 'EventTransfer',
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
        selectedUser: [],
        bz: ''
      },
      searchText: '',
      users: [],
      rules: {
        selectedUser: [{ type: 'array', required: true, message: '请选择至少 1 个转派用户', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    visible: {
      handler(val) {
        this.editVisible = val
        if (val) {
          this.getUsers()
        }
      },
      immediate: true
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    async getUsers() {
      const params = {
        search: this.searchText
      }
      const { success, desc, data } = await apiSelectUser(params)
      if (success) {
        this.users = data.filter(item => {
          return this.user.id !== item.ID
        })
      } else {
        desc && this.$Message.error(desc)
      }
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { selectedUser, bz } = this.form
          const { success, desc } = await apiAssigns(this.eventIds, selectedUser.join(','), bz)
          this.loading = false
          if (success) {
            this.$Message.success('转派成功')
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
