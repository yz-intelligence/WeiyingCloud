<template>
  <el-dialog :title="groupDialogTitle" :width="'460px'" :visible.sync="showGroupDialog" @close="closeDialog">
    <div v-if="groupDialogTitle !== '删除组'">
      <el-form :model="groupForm" :rules="groupFormRule" ref="groupForm" label-width="80px">
        <el-form-item label="组名称" prop="name">
          <el-input id="user-manage_input_groupname" size="small" v-model.trim="groupForm.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="groupDialogTitle === '删除组'">确定删除本用户组？</div>
    <div slot="footer">
      <el-button size="small" @click="closeDialog">取 消</el-button>
      <el-button size="small" type="primary" @click="saveGroup" v-if="groupDialogTitle !== '删除组'">确 定</el-button>
      <el-button size="small" type="primary" @click="removeGroup" v-if="groupDialogTitle === '删除组'">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { apiAddGroup, apiEditGroup, apiDeleteGroup } from '@/apis/user'
export default {
  name: 'UserGroupTreeDialog',
  props: {
    id: { type: String, default: '' },
    groupDialogTitle: { type: String, default: '' },
    visible: Boolean,
    groupForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    visible(val) {
      this.showGroupDialog = val
    }
  },
  data() {
    return {
      showGroupDialog: this.visible,
      groupFormRule: {
        name: [{ required: true, message: '组名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.$emit('update:visible', false)
    },
    //关闭对话框,重新加载树
    loadTree() {
      this.$emit('loadTree')
      this.$emit('update:visible', false)
    },
    //根据不同点击事件调用api
    saveGroup() {
      this.$refs.groupForm.validate(async valid => {
        if (valid) {
          this.showGroupDialog = false
          this.groupDialogTitle === '新增组'
            ? this.addGroupAPI(this.id, this.groupForm.name)
            : this.editGroupAPI(this.id, this.groupForm.name)
        }
      })
    },
    //删除事件
    removeGroup() {
      this.deleteGroupAPI(this.id)
    },
    //增加用户组api
    async addGroupAPI(id, name) {
      const { success, desc } = await apiAddGroup(id, name)
      if (success) {
        this.$Message.success('保存成功')
        this.loadTree()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //编辑用户组api
    async editGroupAPI(id, name) {
      const { success, desc } = await apiEditGroup(id, name)
      if (success) {
        this.$Message.success('保存成功')
        this.loadTree()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //删除用户组api
    async deleteGroupAPI(id) {
      const { success, desc } = await apiDeleteGroup(id)
      this.showGroupDialog = false
      if (success) {
        this.$Message.success('删除成功')
        this.loadTree()
      } else {
        desc && this.$Message.error(desc)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
