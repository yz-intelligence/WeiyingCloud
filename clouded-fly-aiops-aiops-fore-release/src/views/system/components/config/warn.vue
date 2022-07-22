<template>
  <div class="page" v-loading="loading">
    <config-title v-model="isEdit" title="告警铃声" :show-action="false"></config-title>
    <div class="page-content" id="config_div_warn">
      <warn-item
        v-for="(item, index) of level"
        :key="item"
        :index="index"
        :level="item"
        :item="sounds[`level${index}`]"
        :default-item="defaultSounds[`level${index}`]"
        @play="playSound"
        @pause="stopSound"
        @reflesh="reflesh"
        @success="updateSound"
      />
    </div>
  </div>
</template>

<script>
import WarnItem from './warn-item.vue'
import { apiGetCompanyConfig, apiSaveConfig } from '@/apis/config'
import ConfigTitle from './title'
export default {
  name: 'ConfigWarn',
  components: {
    WarnItem,
    ConfigTitle
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      config: {}, // 表单配置
      level: ['恢复', '信息', '告警', '故障', '事故'],
      defaultSounds: {
        level0: {
          name: 'l5.wav',
          url: `${process.env.VUE_APP_ROUTER_BASE}static/sound/l5.wav`
        },
        level1: {
          name: 'l4.wav',
          url: `${process.env.VUE_APP_ROUTER_BASE}static/sound/l4.wav`
        },
        level2: {
          name: 'l3.wav',
          url: `${process.env.VUE_APP_ROUTER_BASE}static/sound/l3.mp3`
        },
        level3: {
          name: 'l2.wav',
          url: `${process.env.VUE_APP_ROUTER_BASE}static/sound/l2.mp3`
        },
        level4: {
          name: 'l1.wav',
          url: `${process.env.VUE_APP_ROUTER_BASE}static/sound/l1.mp3`
        }
      },
      sounds: {}
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    // 获取配置
    async getConfig() {
      this.loading = true
      const { success, rows, desc } = await apiGetCompanyConfig('AlarmSound')
      this.loading = false
      if (success) {
        this.config = rows.length ? rows[0] : {}
        const { value } = this.config
        if (value) {
          const soundConfig = JSON.parse(value)
          this.sounds = Object.keys(this.defaultSounds).reduce((obj, key) => {
            return {
              ...obj,
              [key]: soundConfig[key] || this.defaultSounds[key]
            }
          }, {})
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 保存表单
    async saveForm(msg = '设置成功') {
      const { id, name } = this.config
      const param = {
        id: id || '',
        name: name || 'AlarmSound',
        type: 'AlarmSound',
        value: JSON.stringify(this.sounds)
      }
      // 保存到服务器
      this.loading = true
      const { success, desc, data } = await apiSaveConfig(param)
      this.loading = false
      if (success) {
        this.$Message.success(msg)
        this.config = data
        const { value } = this.config
        value && (this.sounds = JSON.parse(value))
      } else {
        desc && this.$Message.error(desc)
      }
    },
    /**
     * 更新铃声
     * @param { stirng } level 级别
     * @param { Obj } val 音频配置
     */
    updateSound(level, val, msg) {
      this.sounds[level] = val
      this.saveForm(msg)
    },
    /**
     * 重置铃声
     * @param { stirng } key 级别key
     */
    reflesh(key) {
      this.updateSound(key, this.defaultSounds[key], '重置成功')
    },
    playSound(key) {
      this.$set(this.sounds, key, { ...this.sounds[key], isPlay: true })
      this.sounds = { ...this.sounds }
    },
    stopSound(key) {
      this.sounds[key].isPlay = false
      this.sounds = { ...this.sounds }
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
  }
  &-actions {
    @include flex;
    margin: 30px 0 24px;
  }
}
</style>
