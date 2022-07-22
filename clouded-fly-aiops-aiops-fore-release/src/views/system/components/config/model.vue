<template>
  <div class="page" v-loading="loading">
    <config-title v-model="isEdit" title="模型置信度配置" @change="changeEdit"></config-title>
    <div class="page-content">
      <el-form :model="form" size="small" ref="form" label-width="110px" class="config-form" id="config_form_model">
        <el-form-item label="模型置信度">
          <span v-show="!isEdit" class="config-form-text">{{ `${form.value}%` }}</span>
          <el-input-number
            v-show="isEdit"
            v-model="form.value"
            class="config-form-input"
            controls-position="right"
            :min="0"
            :max="100"
          ></el-input-number>
          <span v-show="isEdit" class="config-form-company">%</span>
        </el-form-item>
      </el-form>
      <div class="config-tips">
        <div class="config-tips-title">
          注：模型置信度值越高，准确率越高，降噪告警数量越少。反之准确率越低，降噪告警数量越多。
        </div>
        <div class="config-tips-chunk">
          <div class="tips-item" v-for="(item, index) in proportionList" :key="index">
            <div class="tips-item-text">{{ item.tips }}</div>
            <div class="tips-item-proportion" :style="`background-image: url(${item.image})`">
              <p class="proportion-text">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-show="isEdit" class="config-actions">
        <el-button type="primary" size="small" @click="saveForm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiGetCompanyConfig, apiSaveConfig } from '@/apis/config'
import ConfigTitle from './title'
export default {
  name: 'ConfigModel',
  components: {
    ConfigTitle
  },
  data() {
    const proportionList = [
      {
        image: require('@/assets/images/common/proportion1.png'),
        text: '置信度高 85%',
        tips: '置信度高\n准确率高\n降噪告警少'
      },
      {
        image: require('@/assets/images/common/proportion2.png'),
        text: '置信度中 50%',
        tips: '置信度中\n准确率中\n降噪告警中'
      },
      {
        image: require('@/assets/images/common/proportion3.png'),
        text: '置信度低 30%',
        tips: '置信度低\n准确率低\n降噪告警重'
      }
    ]
    return {
      isEdit: false,
      loading: false,
      config: {}, // 表单设置
      proportionList,
      form: {
        value: ''
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    // 获取设置
    async getConfig() {
      this.loading = true
      const { success, rows, desc } = await apiGetCompanyConfig('ModelConfidence')
      this.loading = false
      if (success) {
        this.config = rows.length ? rows[0] : {}
      } else {
        desc && this.$Message.error(desc)
      }
      const { value } = this.config
      this.form.value = isNaN(value) ? 0 : value
    },
    //切换编辑状态
    changeEdit(edited) {
      if (edited) return false
      const { value } = this.config
      this.form.value = isNaN(value) ? 0 : value
    },
    // 保存表单
    async saveForm() {
      const { name, id } = this.config
      const param = {
        id: id || '',
        name: name || 'ModelConfidence',
        type: 'ModelConfidence',
        value: this.form.value
      }

      // 保存到服务器
      this.loading = true
      const { success, desc, data } = await apiSaveConfig(param)
      this.loading = false
      if (success) {
        this.$Message.success('保存成功，配置将在一分钟后生效')
        this.config = data
        this.isEdit = false
      } else {
        desc && this.$Message.error(desc)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 10px;
  padding: 0;
  &-content {
    padding: 24px 24px 6px;
  }
}
.config {
  &-form {
    width: 500px;
    &::v-deep .el-form-item__label {
      text-align: left;
      color: #8c8c8c;
    }
    &-input {
      width: 100px;
    }
    &-company {
      font-size: 12px;
      line-height: 22px;
      margin-left: 10px;
    }
  }
  &-tips {
    max-width: 964px;
    height: 279px;
    padding: 20px;
    margin-bottom: 10px;
    border: 1px solid #eeeeee;
    &-title {
      width: 100%;
      height: 40px;
      font-size: 12px;
      line-height: 18px;
      color: $--color-text-regular;
      border-bottom: 1px solid #eeeeee;
    }
    &-chunk {
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding-top: 20px;
      .tips-item {
        display: flex;
        justify-content: flex-start;
        height: 100%;
        &-text {
          width: 70px;
          height: 50px;
          font-size: 12px;
          letter-spacing: 0.51px;
          margin-top: 132px;
          white-space: pre;
        }
        &-proportion {
          width: 173px;
          height: 180px;
          background-size: 100%;
          .proportion-text {
            font-size: 12px;
            color: $--color-primary;
            padding-left: 10px;
            margin-top: 70px;
          }
        }
      }
      .tips-item:nth-child(1) {
        .proportion-text {
          margin-top: 8px;
        }
      }
      .tips-item:nth-child(3) {
        .proportion-text {
          margin-top: 132px;
        }
      }
    }
  }
  &-actions {
    @include flex;
    margin: 30px 0 24px;
  }
}
</style>
