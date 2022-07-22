<template>
  <el-dialog :width="'840px'" :title="title" :visible.sync="showDialog" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small" :disabled="isReadOnly">
      <el-form-item label="分类名称" prop="classifyName">
        <el-input v-model="form.classifyName"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="classifyType">
        <el-radio-group v-model="form.classifyType" class="form-radiobutton" @change="typeChange">
          <el-radio :label="'parents'">根分类</el-radio>
          <el-radio :label="'child'">子分类</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属根分类" v-if="form.classifyType === 'child'" prop="parentsId">
        <el-select v-model="form.parentsId" class="form-select">
          <el-option v-for="item in parents" :key="item.id" :label="item.classifyName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <diy-switch v-model="form.status" :state.sync="form.status"></diy-switch>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="form.remarks"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="!isReadOnly">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import DiySwitch from '@/components/common/diy-switch.vue'
import { apiSaveClassification, apiGetParents } from '@/apis/classification'
import { dateToUTc } from '@/utils/index'
export default {
  name: 'ManageDialog',
  components: { DiySwitch },
  props: {
    isReadOnly: {
      type: Boolean,
      default: false
    },
    visible: Boolean,
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: function () {
        return {
          id: '',
          classifyName: '',
          classifyType: 'parents',
          parentsId: '',
          status: true,
          remarks: ''
        }
      }
    }
  },
  watch: {
    visible(val) {
      this.showDialog = val
    }
  },
  created() {
    this.getParents()
  },
  data() {
    return {
      showDialog: this.visible,
      rules: {
        classifyName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ],
        classifyType: { required: true, message: '请选择 1 项', trigger: 'change' },
        parentsId: { required: true, message: '请选择 1 项', trigger: 'blur' }
      },
      parents: []
    }
  },
  methods: {
    typeChange(label) {
      if (label === 'child') {
        this.form.parentsId = ''
        this.getParents()
      } else {
        this.form.parentsId = 'Root'
      }
    },
    async getParents() {
      const { success, desc, data } = await apiGetParents()
      if (success) {
        this.parents = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //关闭对话框并清空表单
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
      // this.form.classifyType = 'parents'
    },
    //提交表单
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.form.createTime ? (this.form.createTime = dateToUTc(this.form.createTime)) : (this.form.createTime = '')
          const { success, desc } = await apiSaveClassification(this.form)
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
<style lang="scss" scoped>
.form {
  &-select {
    width: -webkit-fill-available;
  }
}
</style>
