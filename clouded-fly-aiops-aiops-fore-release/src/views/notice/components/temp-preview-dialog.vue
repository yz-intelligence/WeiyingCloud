<template>
  <el-dialog :title="record.title" :width="record.width" append-to-body :visible.sync="editVisible" @closed="close">
    <component v-if="form" :isRepeat="record.isRepeat" :form="form" :is="record.comp"></component>
  </el-dialog>
</template>

<script>
import TempPreviewEmail from './temp-preview-email'
import TempPreviewRobot from './temp-preview-robot'
import TempPreviewWorkWx from './temp-preview-workwx'
export default {
  name: 'TempPreviewDialog',
  components: {
    TempPreviewEmail,
    TempPreviewRobot,
    TempPreviewWorkWx
  },
  props: {
    type: {
      // 模板类型
      type: String,
      default: 'email'
    },
    form: {
      type: Object,
      default: () => null
    },
    visible: Boolean
  },
  data() {
    return {
      loading: false,
      compsMap: [
        {
          type: 'email',
          title: '邮件首次通知预览',
          width: '840px',
          comp: TempPreviewEmail,
          isRepeat: false
        },
        {
          type: 'email-repeat',
          title: '邮件重复通知预览',
          width: '840px',
          comp: TempPreviewEmail,
          isRepeat: true
        },
        {
          type: 'robot',
          title: '企微机器人首次通知预览',
          width: '640px',
          comp: TempPreviewRobot,
          isRepeat: false
        },
        {
          type: 'robot-repeat',
          title: '企微机器人重复通知预览',
          width: '640px',
          comp: TempPreviewRobot,
          isRepeat: true
        },
        {
          type: 'workWx',
          title: '企业微信首次通知预览',
          width: '640px',
          comp: TempPreviewWorkWx,
          isRepeat: false
        },
        {
          type: 'workWx-repeat',
          title: '企业微信重复通知预览',
          width: '640px',
          comp: TempPreviewWorkWx,
          isRepeat: true
        }
      ],
      editVisible: this.visible
    }
  },
  computed: {
    record() {
      return this.compsMap.find(item => item.type === this.type) || this.compsMap[0]
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  },
  methods: {
    close() {
      console.log('dd')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-form-input {
  width: 100%;
}
</style>
