<template>
  <div>
    <el-form label-width="auto" label-position="right" inline class="form">
      <el-form-item label="事件ID" class="form-item">
        <span>{{ row.eventId || '-' }}</span>
      </el-form-item>
      <el-form-item label="事件级别" class="form-item">
        <span>{{ changeEventLevel(row) || '-' }}</span>
      </el-form-item>
      <el-form-item label="通知方式" class="form-item">
        <span>{{ changeType(row) || '-' }}</span>
      </el-form-item>
      <el-form-item label="通知内容" class="form-item">
        <span>{{ row.summary || '-' }}</span>
      </el-form-item>
      <el-form-item label="事件标题" class="form-item">
        <span>{{ row.eventName || '-' }}</span>
      </el-form-item>
      <el-form-item label="最近发生时间" class="form-item">
        <span>{{ row.eventTime || '-' }}</span>
      </el-form-item>
      <el-form-item label="接收人" class="form-item">
        <span>{{ row.recipient || '-' }}</span>
      </el-form-item>

      <el-form-item label="通知发送时间" class="form-item">
        <span>{{ row.sendTime || '-' }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'RuleItem',
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    changeType: {
      type: Function,
      default: () => {
        return function () {}
      }
    },
    changeEventLevel: {
      type: Function,
      default: () => {
        return function () {}
      }
    },
    changeContent: {
      type: Function,
      default: () => {
        return function () {}
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  width: 100%;
  padding: 20px 50px;
  background-color: #fff;
  flex-wrap: wrap;
  height: auto;
  font-size: 14px;
  &-item {
    display: flex;
    width: 50%;
    &::v-deep .el-form-item__label {
      color: #8c8c8c;
    }
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
