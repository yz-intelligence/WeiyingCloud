<template>
  <div id="anlysis_div_download" class="hoverable download-icon" title="下载当前表格数据" @click="handleClick">
    <i class="el-icon-download"></i>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'CsvExport',
  props: {
    header: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileName: {
      type: String,
      default: 'data.csv'
    }
  },
  methods: {
    handleClick() {
      if (!this.data || this.data.length <= 0) {
        this.$Message.warning('当前数据为空')
        return
      }
      var csvContent = 'data:text/csv;charset=utf-8,\ufeff'
      csvContent += this.headerLabel + '\n'
      this.data.forEach((item, index) => {
        let dataString = ''
        for (let i = 0; i < this.headerProp.length; i++) {
          dataString += item[this.headerProp[i]] + ','
        }
        csvContent += index < this.data.length ? dataString.replace(/,$/, '\n') : dataString.replace(/,$/, '')
      })
      //新建a标签元素，通过URI导出CSV
      let tempA = document.createElement('a')
      tempA.setAttribute('href', encodeURI(csvContent))
      tempA.setAttribute('download', this.fileName + '.csv')
      tempA.click()
      tempA = null
    }
  },
  computed: {
    // 要求head是数组，数组中的每个元素是对象，并且每个对象都有title属性
    headerLabel() {
      let result
      result = this.header.map(item => {
        return item.title
      })
      result = result.join(',')
      return result
    },
    headerProp() {
      let result
      result = this.header.map(item => {
        return item.key
      })
      return result
    }
  }
}
</script>
<style scoped>
a {
  text-decoration: none;
  color: #000;
}
.download-icon {
  margin: 2px 0 0 8px;
  font-size: 18px;
  color: #0076ff;
}
</style>
