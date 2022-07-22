<template>
  <el-dialog
    :width="'640px'"
    :visible.sync="editVisible"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-form class="form" ref="form" :model="form" label-width="auto" size="small" :rules="FormRules">
      <!-- 规则分类 -->
      <div class="box" v-if="sourceType === 'MANUALINPUT'">
        <!-- 关键字 -->
        <el-form-item label="关键字">
          {{ keyWords || '内存利用率' }}
        </el-form-item>
        <!-- 分类规则 -->
        <el-form-item label="分类规则" prop="classifyRulesId">
          <el-cascader
            placeholder="请选择"
            class="box-option"
            :options="classifyRulesTree"
            v-model="form.classifyRulesId"
            filterable
            :disabled="isWatch"
            :props="propCascader"
            popper-class="cascader"
          ></el-cascader>
        </el-form-item>
        <!-- 批量修改 -->
        <el-form-item label="批量修改" prop="batch">
          <el-radio-group v-model="form.batch">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- 智能分类和未分类 -->
      <div v-else>
        <!-- 现有分类 -->
        <el-form-item label="现有分类">
          {{ keyWords || '服务器内存' }}
        </el-form-item>
        <!-- 修改后分类 -->
        <el-form-item label="修改后分类" prop="classifyId">
          <el-tree-select
            placeholder="搜索组"
            class="form-option"
            :options="classifyTree"
            :props="propTree"
            :isLeaf="false"
            v-model="form.classifyId"
            :disabled="isWatch"
          ></el-tree-select>
        </el-form-item>
      </div>
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
import { apiUpdateClassify } from '@/apis/classification'
export default {
  name: 'AiEdit',
  components: {
    elTreeSelect
  },
  props: {
    sourceType: {
      type: String,
      default: 'MANUALINPUT'
    },
    visible: Boolean,
    title: {
      type: String,
      default: '修改分类'
    },
    keyWords: {
      type: String,
      default: ''
    },
    eventId: {
      type: String,
      default: ''
    },
    // 分类类型树状表
    classifyTree: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 分类类型树状表
    classifyRulesTree: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否只读
    isWatch: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      FormRules: {
        classifyId: [{ required: true, message: '分类不能为空', trigger: 'change' }],
        classifyRulesId: [{ required: true, message: '分类规则不能为空', trigger: 'change' }]
      },
      loading: false,
      editVisible: this.visible,
      select: '',
      inp: '',
      form: {
        eventId: this.eventId,
        classifyId: '',
        classifyRulesId: '',
        batch: false
      },
      // 树选择器key和value配置
      propTree: {
        children: 'children', // 子级字段名
        label: 'classifyName', // 显示名称
        value: 'id' // ID字段名
      },
      // 级联选择器key和value配置
      propCascader: {
        children: 'children', // 子级字段名
        label: 'classification', // 显示名称
        value: 'id' // ID字段名
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$emit('update:id', '')
      this.$refs.form.resetFields()
    },
    // 提交设置规则
    async onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { success, desc } = await apiUpdateClassify(this.setForm(this.form))
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
    setForm(data) {
      const { classifyRulesId } = data
      const newData = { ...data, id: this.id, classifyRulesId: classifyRulesId ? classifyRulesId[1] : '' }
      return newData
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
  margin-left: 18px;
  &-option {
    width: 470px;
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
.box {
  margin-left: 30px;
  &-option {
    width: 464px;
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
::v-deep .el-dialog__footer {
  padding: 12px 32px;
}
</style>
<style lang="scss">
.cascader {
  .el-cascader-menu {
    max-width: 230px;
  }
}
</style>
