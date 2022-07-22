<template>
  <el-dialog
    title="人工报障"
    :width="`840px`"
    :close-on-click-modal="!isGuiding"
    :close-on-press-escape="!isGuiding"
    :visible.sync="editVisible"
    @close="close"
  >
    <el-form ref="form" :model="form" size="small" :form="form" :rules="rules" label-width="80px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="事件级别" prop="level">
            <el-select class="comp-form-input" v-model="form.level">
              <el-option v-for="(option, key) of options" :key="option" :label="option" :value="+key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事件对象" prop="eventObj">
            <el-input
              class="comp-form-input"
              v-model.trim="form.eventObj"
              placeholder="请输入事件对象"
              :maxlength="100"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生时间" prop="occurrenceTime">
            <el-date-picker
              ref="datePicker"
              class="comp-form-input"
              v-model="form.occurrenceTime"
              :picker-options="datePickerOpt"
              @on-change="changeDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="事件标题" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入事件标题" :maxlength="100" />
      </el-form-item>
      <el-form-item label="事件描述" prop="summary">
        <el-input
          v-model.trim="form.summary"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 5 }"
          placeholder="请输入事件描述"
          :maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 人工报障
import { apiSaveEvents } from '@/apis/event'
import dayjs from 'dayjs'
export default {
  name: 'ArtificialCreate',
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    visible: Boolean,
    isGuiding: Boolean
  },
  data() {
    return {
      loading: false,
      editVisible: this.visible,
      form: {
        name: '',
        level: 2,
        eventObj: '',
        summary: '',
        occurrenceTime: new Date()
      },
      rules: {
        name: [{ required: true, message: '事件标题不能为空', trigger: 'blur' }],
        summary: [{ required: true, message: '事件描述不能为空', trigger: 'blur' }],
        eventObj: [{ required: true, message: '事件对象不能为空', trigger: 'blur' }],
        occurrenceTime: [{ required: true, type: 'date', message: '发生时间不能为空', trigger: 'change' }]
      },
      datePickerOpt: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          params.occurrenceTime = dayjs(params.occurrenceTime).format('YYYY-MM-DD HH:mm:ss')
          const { success, desc } = await apiSaveEvents(params)
          this.loading = false
          if (success) {
            this.$Message.success('人工报障成功')
            this.$emit('success')
            this.close()
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    changeDate(val) {
      if (dayjs(val, 'YYYY-MM-DD HH:mm') > +new Date()) {
        // 时间不能大于当前
        this.form.occurrenceTime = new Date()
        this.$refs.datePicker.handleInputChange({
          target: this.$refs.datePicker.$el.querySelector('input')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-form-input {
  width: 100%;
}
</style>
