<template>
  <el-dialog :width="'840px'" :visible.sync="editVisible" :title="title" :close-on-press-escape="false" @close="close">
    <!-- 中间表格 -->
    <el-form class="form" ref="mpForm" label-width="auto" :model="mpForm" :rules="ruleFormRules" size="small">
      <!-- 维护期名称 -->
      <el-form-item class="form-option" label="维护期名称" prop="name">
        <el-input v-model.trim="mpForm.name" :maxlength="100" placeholder="请输入" />
      </el-form-item>
      <!-- 生效时间 -->
      <el-form-item class="form-option" label="生效时间" prop="effectiveTimes">
        <el-date-picker
          class="edit-select"
          type="datetimerange"
          range-separator="至"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          v-model="mpForm.effectiveTimes"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <!-- 周期 和 日期 -->
      <div class="form-flex">
        <!-- 周期 -->
        <el-form-item label="周期" prop="periodType">
          <el-radio-group v-model="mpForm.periodType" @change="resetTime">
            <el-radio :label="0">非周期</el-radio>
            <el-radio :label="1">按天</el-radio>
            <el-radio :label="2">按周</el-radio>
            <el-radio :label="3">按月</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 日期 -->
        <el-form-item label-width="60px" label="日期" prop="periodCheck" v-if="mpForm.periodType === 2">
          <el-select v-model="mpForm.periodCheck" multiple placeholder="请选择">
            <el-option v-for="(value, key) in weekType" :value="key" :key="key" :label="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="60px" label="日期" prop="periodCheck" v-if="mpForm.periodType === 3">
          <el-select class="edit-select" v-model="mpForm.periodCheck" multiple placeholder="请选择">
            <el-option
              v-for="(value, key) in Array.from({ length: 31 })"
              :value="key + 1"
              :key="key"
              :label="value + 1"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 循环时间范围 -->
      <el-form-item v-if="mpForm.periodType !== 0" class="form-option" label="循环时间范围" prop="periodTimes">
        <el-time-picker
          class="edit-select"
          is-range
          format="HH:mm"
          value-format="HH:mm"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          v-model="mpForm.periodTimes"
          :editable="false"
        ></el-time-picker>
      </el-form-item>
      <!-- 描述 -->
      <el-form-item class="form-option" label="描述" prop="summary">
        <el-input
          class="edit-select"
          v-model.trim="mpForm.summary"
          placeholder="请输入"
          type="textarea"
          :maxlength="1000"
          :autosize="{ minRows: 3, maxRows: 5 }"
          show-word-limit
        />
      </el-form-item>
      <!-- 规则组合关系 -->
      <el-form-item class="form-option" label="规则组合关系" prop="relation">
        <el-radio-group v-model="mpForm.relation">
          <el-radio label="and">与</el-radio>
          <el-radio label="or">或</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 规则内容 -->
      <el-form-item class="form-option" label="规则内容" :prop="'contents'">
        <diy-rule-content
          class="form-option-input"
          v-model="mpForm.contents"
          :SourceOpt="SourceOpt"
          :relation="mpForm.relation"
        ></diy-rule-content>
      </el-form-item>
    </el-form>
    <!-- 下方按钮 -->
    <div class="bottom" slot="footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { apiGetAccessTools } from '@/apis/access'
import { saveMaintenances } from '@/apis/maintenances'
import DiyRuleContent from '@/components/common/diy-rule-content'
import { mapGetters } from 'vuex'
export default {
  name: 'MaintenanceEdit',
  components: {
    DiyRuleContent
  },
  props: {
    mpForm: {
      type: Object,
      default: () => {
        return {
          name: '',
          effectiveTimes: [],
          periodType: 0,
          periodCheck: [],
          periodTimes: ['00:00', '23:59'],
          summary: '',
          relation: 'and',
          contents: [
            {
              field: 'NAME',
              condition: 'in',
              value: ''
            }
          ]
        }
      }
    },
    title: {
      type: String,
      default: ''
    },
    visible: Boolean
  },
  computed: {
    ...mapGetters(['weekType', 'fieldOpt', 'levelOpt', 'conditionOpt'])
  },
  data() {
    return {
      // 监控源下拉框内容
      SourceOpt: [],
      // 做监控源的Map转换
      sourceMap: new Map(),
      loading: false,
      editVisible: this.visible,
      ruleFormRules: {
        name: [{ required: true, message: '维护期名称不能为空', trigger: 'blur' }],
        effectiveTimes: [{ required: true, message: '生效时间不能为空', trigger: 'change' }],
        periodCheck: [{ required: true, message: '日期不能为空', trigger: 'change' }],
        periodTimes: [{ required: true, message: '循环时间范围不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  },
  created() {
    this.getSource()
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$emit('success')
      this.$refs.mpForm.resetFields()
    },
    // 搜索监控源内容
    async getSource() {
      const { success, rows, desc } = await apiGetAccessTools()
      if (success) {
        this.SourceOpt = rows
        let m = new Map()
        let n = ''
        rows.forEach((item, index) => {
          n = JSON.parse(item.conf).webHook.split('/').pop()
          this.SourceOpt[index].conf = n
          m.set(n, item.name)
        })
        this.sourceMap = m
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 修改规则内容选项
    changeGroup(val) {
      this.$nextTick(() => {
        if (val === 'USER') {
          this.mpForm.ownerIds = []
        } else {
          this.mpForm.ownerIds = ''
        }
      })
    },
    // 重置循环时间
    resetTime() {
      this.mpForm.periodTimes = ['00:00', '23:59']
      this.mpForm.periodCheck = []
    },
    // 设置表单内容格式
    getForm() {
      let formValue = ''
      let { id, name, summary, contents, relation, periodType, effectiveTimes, periodTimes, periodCheck } = this.mpForm
      let saveParam = {
        id,
        name,
        summary,
        periodType,
        ruleSummary: contents
          .map(item => {
            if (item.field !== 'MONITOR_CODE') {
              return (
                this.fieldOpt[item.field] +
                ' ' +
                this.conditionOpt[item.condition] +
                ' ' +
                (!!item.value ? item.value : '空')
              )
            } else {
              if (Array.isArray(item.value)) {
                formValue = item.value.map(i => {
                  return this.sourceMap.get(i)
                })
                return '监控源 包含 ' + (item.value !== '' ? formValue : '空')
              } else {
                return '监控源 包含 ' + item.value !== '' ? this.sourceMap.get(i) : '空'
              }
            }
          })
          .join(relation === 'and' ? ' 且 ' : ' 或 '),
        rules: JSON.stringify({
          relation,
          contents
        })
      }

      if (!!effectiveTimes) {
        saveParam.effectiveBeginStr = effectiveTimes[0]
        saveParam.effectiveEndStr = effectiveTimes[1]
      }
      if (saveParam.periodType !== 0) {
        if (!!periodTimes) {
          saveParam.periodBeginStr = periodTimes[0]
          saveParam.periodEndStr = periodTimes[1]
        }
        if (saveParam.periodType !== 1) saveParam.periodCheck = periodCheck.join(',')
      }
      return saveParam
    },
    // 提交表单
    async onSubmit() {
      this.$refs.mpForm.validate(async valid => {
        if (valid) {
          let { name } = this.mpForm
          if (name.replace(/\s*/g, '').length === 0) {
            this.$Message.error('请输入非空格维护期名称')
            return
          }
          this.loading = true
          const { success, desc } = await saveMaintenances(this.getForm())
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
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  &-option {
    &-select {
      flex: 1;
      margin-right: 10px;
      width: 99%;
    }
    &-title {
      flex: 2;
      margin-right: 10px;
    }
  }
  &-flex {
    display: flex;
    align-items: flex-start;
  }
  &-select {
    width: 100px;
    margin-right: 10px;
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
.el-radio {
  margin-right: 16px;
}
.edit-select {
  width: 100%;
}
</style>
