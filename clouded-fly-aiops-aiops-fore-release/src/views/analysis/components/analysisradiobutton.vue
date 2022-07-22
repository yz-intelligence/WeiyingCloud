<template>
  <div class="analysis-header">
    <el-radio-group v-model="button" size="mini">
      <el-radio-button id="anlysis_button_today" label="0">当天</el-radio-button>
      <el-radio-button id="anlysis_button_3days" label="3">近三天</el-radio-button>
      <el-radio-button id="anlysis_button_7days" label="7">近七天</el-radio-button>
      <el-radio-button id="anlysis_button_month" label="30">近一个月</el-radio-button>
      <el-radio-button id="anlysis_button_custom" label="-1">自定义</el-radio-button>
    </el-radio-group>
    <div v-if="isShowDatePicker" class="header-datepicker">
      <el-date-picker
        v-model="formData.date"
        type="daterange"
        format="yyyy-MM-dd HH:mm"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        :clearable="false"
        @change="handleOnOk"
      >
      </el-date-picker>
    </div>
    <div class="button-group">
      <div id="anlysis_div_refresh" class="hoverable refresh-icon" title="刷新数据" @click="loadTable">
        <i class="el-icon-refresh" :class="{ 'el-icon-loading': loading }"></i>
      </div>
      <!-- <i class="el-icon-refresh refresh-icon" :class="{ 'el-icon-loading': loading }" @click="loadTable"></i> -->
      <!-- 自定义csv导出组件 -->
      <csv-export :header="columns" :data="tableData" :fileName="fileName"></csv-export>
    </div>
  </div>
</template>
<script>
import CsvExport from './csvexport.vue'
import dayjs from 'dayjs'

export default {
  name: 'AnalysisRadioButton',
  components: {
    CsvExport
  },
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileName: {
      type: String,
      default: 'data.csv'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShowDatePicker() {
      return this.button === '-1'
    }
  },
  watch: {
    //单选Radiobutton
    button(val) {
      val = Number(val)
      if (val !== -1 && val !== 0) {
        this.selectDate = [
          dayjs(new Date()).subtract(val, 'days').format('YYYY-MM-DD HH:mm'),
          dayjs(new Date()).format('YYYY-MM-DD HH:mm')
        ]
        this.loadTable()
      } else if (val === 0) {
        this.selectDate = this.getTodayTime()
        this.loadTable()
      }
    }
  },
  data() {
    return {
      button: '0',
      selectDate: this.getTodayTime(),
      formData: {
        date: ''
      }
    }
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    handleOnOk() {
      const val = this.formData.date
      if ((Array.isArray(val) && val.some(item => !item)) || !val) return
      this.selectDate = val.map(item => dayjs(item).format('YYYY-MM-DD HH:mm'))
      this.loadTable()
    },
    getTodayTime() {
      const currentTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
      const todayTime = [dayjs(currentTime).startOf('day').format('YYYY-MM-DD HH:mm'), currentTime]
      return todayTime
    },
    loadTable() {
      this.$emit('radiochange', this.selectDate)
    }
  }
}
</script>
<style lang="scss" scoped>
.analysis-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0px 0px;
  .header-datepicker {
    margin-left: 5px;
  }
  .button-group {
    display: flex;
    margin-left: 30px;
    .refresh-icon {
      color: #0076ff;
      font-size: 18px;
      margin-top: 2px;
    }
  }
}
</style>
