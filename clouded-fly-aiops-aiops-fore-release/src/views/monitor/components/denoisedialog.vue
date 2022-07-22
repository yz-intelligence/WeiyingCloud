<template>
  <el-dialog
    :width="'840px'"
    :visible.sync="showdialog"
    title="降噪规则详情"
    :close-on-press-escape="false"
    @close="close"
  >
    <div class="dialog-content" v-loading="loading">
      <el-form label-position="right" label-width="auto" v-model="formData">
        <el-form-item label="规则名称" class="form-item">
          <span>{{ formData.ruleName }}</span>
        </el-form-item>
        <el-form-item label="适用监控源" class="form-item">
          <span v-for="(item, index) in formData.monitorSource" :key="index">
            <span v-if="index">、</span>
            <span>{{ item.name }} </span>
          </span>
        </el-form-item>
        <el-form-item label="合并条件" class="form-item-summary">
          <diy-summary :summary="formData.summary"></diy-summary>
        </el-form-item>
        <el-form-item label="状态" class="form-item">
          <span v-if="formData.state" class="form-item-span">{{ '生效中' }}</span>
          <span v-else class="form-item-span">{{ '未启用' }}</span>
        </el-form-item>
      </el-form>
      <div>
        <router-link
          class="el-link el-link--primary dialog-button"
          target="_blank"
          tag="a"
          :to="{ path: '/event/denoise' }"
        >
          管理降噪规则</router-link
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { apiSearchDenoiseById } from '@/apis/denoise'
import home from '@/mixins/homeChange'
import DiySummary from '@/components/common/diy-summary.vue'
export default {
  name: 'DenoiseDialog',
  mixins: [home],
  props: {
    visible: Boolean,
    noiseDialogId: String
  },
  components: { DiySummary },
  data() {
    return {
      loading: false,
      showdialog: this.visible,
      formData: {
        ruleName: '',
        monitorSource: [],
        summary: '',
        state: ''
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      // this.$refs.noiseform.resetFields()
    },
    //测试跳转用、需要跳转前鉴权
    // routerChange() {
    //   this.$router.push('/event/denoise')
    // },
    async getFormData(id) {
      this.loading = true
      const { success, desc, data } = await apiSearchDenoiseById(id)
      this.loading = false
      if (success) {
        this.formData = data[0]
        this.formData.monitorSource = data[1]
      } else {
        desc && this.$Message.error(desc)
      }
    }
  },
  watch: {
    visible(val) {
      this.showdialog = val
    },
    noiseDialogId(val) {
      this.getFormData(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-content {
  display: flex;
  justify-content: space-between;
}
.form {
  &-item {
    &::v-deep .el-form-item__label {
      color: #666666;
      padding-right: 20px;
    }
    span {
      color: #333;
      word-break: break-all;
      height: auto;
    }
    &-span {
      color: #0076ff !important;
    }
    &-summary {
      &::v-deep .el-form-item__content {
        line-height: 20px;
        top: 4px;
      }
    }
  }
}
.dialog-button {
  font-size: 16px;
  height: 40px;
  font-weight: 700;
  min-width: 100px;
}
</style>
