<template>
  <el-dialog title="导出" :visible.sync="editVisible" :width="'640px'" :close-on-press-escape="false" @close="close">
    <div>
      <span class="dialog-description">请选择导出数据时间段</span>
      <el-form :model="chartExport" :rules="rules" ref="chartExport">
        <div class="dialog-button">
          <el-form-item prop="dayType">
            <el-radio-group v-model="chartExport.dayType" size="small" class="chart-header-date">
              <el-radio-button :label="1">当天</el-radio-button>
              <el-radio-button :label="7">近七天</el-radio-button>
              <el-radio-button :label="30">一个月</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="exportMonth">
            <el-date-picker
              v-if="chartExport.dayType === 30"
              v-model="chartExport.exportMonth"
              :clearable="false"
              type="month"
              placeholder="选择月"
              size="small"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="exportChart">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs'
import { apiExportChart } from '@/apis/classification'
export default {
  name: 'AIDownload',
  props: {
    visible: Boolean
  },
  data() {
    return {
      editVisible: this.visible,
      chartExport: {
        //导出日期选择：1=当天、7=近七天、30=一个月
        dayType: 1,
        exportMonth: new Date()
      },
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date()
          curDate.setMonth(0)
          curDate.setDate(1)
          let oneYear = new Date(curDate).getTime()
          return time.getTime() > Date.now() || time.getTime() < oneYear
        }
      },
      rules: {
        dayType: { required: true, message: '请选择至少 1 个选项', trigger: 'blur' },
        exportMonth: { required: true, message: '请选择至少 1 个月份', trigger: 'blur' }
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.chartExport.resetFields()
    },
    //导出数据
    async exportChart() {
      this.$refs.chartExport.validate(async valid => {
        if (valid) {
          let param = {
            dayType: this.chartExport.dayType,
            exportMonth: dayjs(this.chartExport.exportMonth).format('YYYY-MM')
          }
          apiExportChart(param)
        }
      })
    }
  },
  watch: {
    //监控按钮状态，清空月份选择的校验规则，并定位到当前月份
    'chartExport.dayType'(val) {
      if (val !== 30) {
        this.chartExport.exportMonth = new Date()
        this.$refs.chartExport.clearValidate()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  &-description {
    font-size: 14px;
    color: #666666;
  }
  &-button {
    display: flex;
    justify-content: center;
    margin: 24px 0 0 0;
  }
}
.chart {
  &-header {
    &-date {
      margin-right: 10px;
    }
  }
  &-content {
    height: 370px;
    color: #fff;
    border: 1px dashed #dae1ea;
  }
}
</style>
