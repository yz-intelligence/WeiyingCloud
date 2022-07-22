<template>
  <div @click="changeSummry(row.ruleSummary)">
    <el-form label-position="right" label-width="auto" inline class="form" size="small">
      <el-form-item label="维护期名称" class="form-item">
        <span>{{ row.name }}</span>
      </el-form-item>
      <el-form-item label="规则描述" class="form-item">
        <span>{{ changeSummry(row.ruleSummary) || '-' }}</span>
      </el-form-item>
      <el-form-item label="描述" class="form-item">
        <span>{{ row.summary || '-' }}</span>
      </el-form-item>
      <el-form-item label="周期" class="form-item">
        <span>{{ changePeriodType(row.periodType) }}</span>
      </el-form-item>
      <el-form-item v-if="row.periodType === 2 || row.periodType === 3" label="日期" class="form-item">
        <span>{{ changePeriodCheck(row.periodType, row.periodCheck) }}</span>
      </el-form-item>
      <el-form-item v-if="row.periodType !== 0" label="循环开始时间" class="form-item">
        <span>{{ changeTime(row.periodBegin) }}</span>
      </el-form-item>
      <el-form-item v-if="row.periodType !== 0" label="循环结束时间" class="form-item">
        <span>{{ changeTime(row.periodEnd) }}</span>
      </el-form-item>
      <el-form-item label="开始时间" class="form-item">
        <span>{{ row.effectiveBegin }}</span>
      </el-form-item>
      <el-form-item label="结束时间" class="form-item">
        <span>{{ row.effectiveEnd }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  name: 'mp-item',
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['levelOpt', 'periodType', 'weekType'])
  },
  data() {
    return {}
  },
  methods: {
    changePeriodType(type) {
      return this.periodType[type]
    },
    changeTime(time) {
      let data = new Date()
      data.setHours(Math.floor(time / 60))
      data.setMinutes(time % 60)
      return dayjs(data).format('HH:mm')
    },
    changePeriodCheck(periodType, periodCheck) {
      if (periodType === 2) {
        let arr = periodCheck.split(',').map(item => {
          return this.weekType[item]
        })
        return arr.join(',')
      } else {
        let arr = periodCheck.split(',').map(item => {
          return item + '号'
        })
        return arr.join(',')
      }
    },
    changeSummry(ruleSummary) {
      let arr = ruleSummary.split(' ')
      let n = arr.indexOf('事件级别')
      if (n !== -1) {
        let tran = arr[n + 2].split(',')
        let newArr = tran.map(item => this.levelOpt[item])
        arr[n + 2] = newArr.join(',')
        return arr.join(' ')
      } else {
        return ruleSummary
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  // flex-direction: column;
  width: 100%;
  padding: 20px 50px;
  background-color: #fff;
  flex-wrap: wrap;
  height: auto;
  font-size: 14px;
  &-item {
    display: flex;
    width: 50%;
    min-width: 500px;
    span {
      word-break: break-all;
      height: auto;
    }
  }
  &::v-deep .el-form-item__label {
    color: #8c8c8c;
  }
  &-box {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-width: 500px;
    span {
      word-break: break-all;
      height: auto;
    }
  }
  &::v-deep .el-form-item {
    margin: 0;
  }
  &::v-deep .el-form-item__label {
    word-break: keep-all;
  }
}
</style>
