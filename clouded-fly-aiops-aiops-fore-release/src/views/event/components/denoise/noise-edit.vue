<template>
  <el-dialog :width="'840px'" :visible.sync="editVisible" :title="title" :close-on-press-escape="false" @close="close">
    <!-- 中间表单 -->
    <el-form ref="noiseform" label-width="100px" :model="noiseform" :rules="noiseFormRules" size="small">
      <!-- 规则名称 -->
      <el-form-item label="规则名称" prop="ruleName">
        <el-input
          v-model.trim="noiseform.ruleName"
          :maxlength="100"
          placeholder="应用降噪规则"
          :disabled="defaultRule ? true : false"
        />
      </el-form-item>
      <!-- 适用监控源 -->
      <el-form-item label="适用监控源" prop="receiveConfs" class="select">
        <el-select
          style="width: 100%"
          v-model="noiseform.receiveConfs"
          multiple
          placeholder="可选项仅包括未配置降噪规则的监控源"
          :disabled="defaultRule ? true : false"
        >
          <el-option v-for="(oV, oK) in sourceOpt" :value="oV.id" :key="oK" :label="oV.name"></el-option>
        </el-select>
      </el-form-item>
      <!-- 合并条件 -->
      <el-form-item label="合并条件" prop="conditionRelation">
        <diy-collapse
          ref="conditionRelation"
          :condition="noiseform.conditionRelation"
          :conditionRelation="conditionRelation"
        ></diy-collapse>
      </el-form-item>
      <el-form-item label="状态">
        <diy-switch :state="noiseform.state" @change="handChange" :disabled="defaultRule ? true : false" />
      </el-form-item>
    </el-form>
    <!-- 下方按钮 -->
    <div class="bottom" slot="footer">
      <el-button size="small" @click="close()">取 消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="submit()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import DiyCollapse from './diy-collapse.vue'
import DiySwitch from '@/components/common/diy-switch.vue'
import { apiAddDenoise, apiupdateDenoise } from '@/apis/denoise'
export default {
  name: 'NoiseEdit',
  components: {
    DiyCollapse,
    DiySwitch
  },
  props: {
    // 表单数据
    noiseform: {
      type: Object,
      default: () => {
        return {
          ruleName: '',
          receiveConfs: [],
          conditionRelation: '',
          state: 1
        }
      }
    },
    title: {
      type: String,
      default: '新增降噪规则'
    },
    id: {
      type: String,
      default: ''
    },
    defaultRule: {
      type: Boolean,
      default: false
    },
    sourceOpt: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: Boolean,
    conditionRelation: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    const validataMerge = (rule, value, callback) => {
      // 深拷贝
      const { conditionRelation } = { ...this.noiseform }
      const result = this.checkRepeat(conditionRelation)
      if (result[0]) {
        callback()
      } else {
        callback(new Error(result[1]))
      }
    }
    return {
      editVisible: this.visible,
      noiseFormRules: {
        ruleName: [
          { required: true, message: '规则名称不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '名称超过50位',
            trigger: 'blur'
          }
        ],
        receiveConfs: [{ required: true, message: '适用监控源不能为空', trigger: 'change' }],
        conditionRelation: [{ required: true, validator: validataMerge, trigger: 'change' }]
      },
      loading: false
    }
  },
  methods: {
    handChange(e) {
      this.noiseform.state = e
    },
    submit() {
      this.$refs.noiseform.validate(async valid => {
        if (valid) {
          // 浅拷贝
          let noiseform = {
            ...this.noiseform
          }
          let condition = noiseform.conditionRelation
          let receiveConfs = noiseform.receiveConfs
          let contents = []
          condition.forEach((item, index) => {
            if (item.mergeContent.length) {
              contents.push({
                relation: 'and',
                contents: []
              })
              item.mergeContent.forEach(i => {
                contents[index].contents.push(this.conditionRelation[i].conditionExpression)
              })
            }
          })
          noiseform.conditionRelation = {
            relation: 'or',
            contents: contents
          }
          noiseform.receiveConfs = receiveConfs.join(',')
          this.loading = true
          // 编辑
          if (this.id) {
            const { success, desc } = await apiupdateDenoise(this.id, noiseform)
            this.loading = false
            if (success) {
              this.$Message.success(this.title + '成功' + '，规则将在一分钟后生效')
              this.$emit('success')
              this.close()
            } else {
              desc && this.$Message.error(desc)
            }
          }
          // 新增
          else {
            const { success, desc } = await apiAddDenoise(noiseform)
            this.loading = false
            if (success) {
              this.$Message.success(this.title + '成功' + '，规则将在一分钟后生效')
              this.$emit('success')
              this.close()
            } else {
              desc && this.$Message.error(desc)
            }
          }
        }
      })
    },
    close() {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.$refs.noiseform.resetFields()
    },
    // 判断合并条件是否符合规则
    checkRepeat(data) {
      const datalength = data.length
      // 一条规则没有
      if (!datalength) {
        return [false, '合并条件不能为空']
      }
      // 只选了一条，看是不是没勾
      if (datalength === 1) {
        return data[0].mergeContent.length ? [true, ''] : [false, '合并条件不能为空']
      }
      // 重复也算无效
      let changeBox = new Map()
      for (let i = 0; i < datalength; i++) {
        for (let item of data[i].mergeContent) {
          let indexContent = changeBox.get(item)
          if (indexContent) {
            for (let content of indexContent) {
              const tran = [...data[i].mergeContent, ...data[content].mergeContent]
              // 去重
              const transet = Array.from(new Set(tran))
              // 选最长的
              const newdatalength =
                data[i].mergeContent.length > data[content].mergeContent.length
                  ? data[i].mergeContent.length
                  : data[content].mergeContent.length
              if (transet.length === newdatalength) {
                return [false, '存在无效合并条件']
              }
            }
            indexContent.push(i)
            changeBox.set(item, [i])
          } else {
            changeBox.set(item, [i])
          }
        }
        // for (let j = i + 1; j < datalength; j++) {
        //   const tran = [...data[i].mergeContent, ...data[j].mergeContent]
        //   // 去重
        //   const transet = Array.from(new Set(tran))
        //   const newdatalength =
        //     data[i].mergeContent.length > data[j].mergeContent.length
        //       ? data[i].mergeContent.length
        //       : data[j].mergeContent.length
        //   if (transet.length === newdatalength) {
        //     return [false, '存在无效合并条件']
        //   }
        // }
      }
      return [true, '']
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
.select {
  &::v-deep .el-select__tags-text {
    display: inline-block;
    max-width: 135px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
