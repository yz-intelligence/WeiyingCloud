<template>
  <div class="warn-item">
    <div class="warn-sound">
      <span class="warn-sound-label">{{ level }}</span>
      <template v-if="item">
        <span class="warn-sound-value">
          <i class="el-icon-bell"></i>
          {{ item.name }}
        </span>
        <el-button
          v-if="item.isPlay"
          size="small"
          type="primary"
          icon="el-icon-video-pause"
          @click="soundToggle('pause')"
          title="停止播放"
        ></el-button>
        <el-button
          v-else
          size="small"
          type="primary"
          icon="el-icon-video-play"
          @click="soundToggle('play')"
          title="播放"
        ></el-button>
        <audio ref="audio" preload="auto" :src="item.url" crossOrigin="anonymous" @ended="ended"></audio>
      </template>
      <span v-else class="warn-sound-value">无</span>
    </div>
    <el-row type="flex" class="warn-actions">
      <el-upload
        name="files"
        :show-file-list="false"
        :action="uploadUrl"
        accept=".mp3,.wav,.ogg"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
      >
        <el-button size="small" :loading="loading" icon="el-icon-upload2" type="primary">上传</el-button>
      </el-upload>
      <el-button
        class="warn-actions-reflesh"
        :disabled="canReflesh"
        size="small"
        plain
        icon="el-icon-refresh"
        @click="reflesh"
        >重置</el-button
      >
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'WarnItem',
  props: {
    level: {
      // 级别
      type: String,
      default: '警告'
    },
    index: {
      // 当前index
      type: Number,
      default: 0
    },
    item: {
      // 声音对象
      type: Object,
      default: () => null
    },
    defaultItem: {
      // 声音对象
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_API_BASE + 'files/upload',
      loading: false
    }
  },
  computed: {
    canReflesh() {
      return this.item && this.item.url === this.defaultItem.url
    },
    levelKey() {
      return `level${this.index}`
    }
  },
  watch: {
    item: {
      handler(obj, oldObj) {
        if (oldObj) {
          this.$nextTick(() => {
            const type = obj.isPlay ? 'play' : 'pause'
            this.control(type)
          })
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 声音播放||暂停--组件内操作
     * @param { number } type pause 暂停，play播放
     */
    control(type = 'pause') {
      const audio = this.$refs.audio
      if (!audio || isNaN(audio.duration)) {
        this.$emit('pause', this.levelKey)
        return false
      }
      audio.currentTime = 0
      audio[type]()
    },
    ended() {
      this.soundToggle('pause')
    },
    /**
     * 声音播放||暂停
     * @param { number } type pause 暂停，play播放
     */
    soundToggle(type = 'pause') {
      this.$emit(type, this.levelKey)
    },
    // 重置
    reflesh() {
      this.$emit('reflesh', this.levelKey)
    },
    handleError(err, file) {
      this.loading = false
      this.$Message.error(`文件${file.name}上传失败。`)
    },
    handleSuccess(res, file) {
      this.loading = false
      if (res.success) {
        this.$emit('success', this.levelKey, {
          name: file.name,
          url: '/files/upload' + res.data[0]
        })
      } else {
        this.$Message.error('上传失败')
      }
    },
    handleBeforeUpload({ size, type, name }) {
      const TYPES = ['audio/ogg', 'audio/wav', 'audio/mpeg']
      const MAX_SIZE = 2048 * 1024 //2m
      if (!TYPES.includes(type)) {
        this.$Message.error(`文件${name}格式不正确，请上传.ogg，.wav，.mp3格式音频文件`)
        return false
      }
      if (size > MAX_SIZE) {
        this.$Message.error(`文件${name}过大，不能超过 2M。`)
        return false
      }
      this.loading = true
    }
  }
}
</script>

<style lang="scss" scoped>
.warn {
  &-item {
    @include flex(space-between);
    margin-bottom: 24px;
  }
  &-sound {
    &-label {
      margin-right: 20px;
      color: #8c8c8c;
    }
    &-value {
      margin-right: 20px;
    }
  }
  &-actions {
    &-reflesh {
      margin-left: 8px;
    }
  }
}
.warn-sound {
  .el-button--small {
    padding: 4px 10px;
  }
  .el-button {
    &::v-deep i {
      font-size: 22px;
    }
  }
}
</style>
