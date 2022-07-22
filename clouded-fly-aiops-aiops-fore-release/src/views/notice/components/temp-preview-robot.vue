<!-- eslint-disable -->
<template>
  <div class="preview-robot">
    <p class="preview-robot-title">{{ isRepeat ? data.repeatTitle : data.title }}</p>
    <blockquote>
      <div class="preview-robot-content">{{ isRepeat ? data.repeatContent : data.content }}</div>
      <a class="preview-robot-link">查看详情</a>
    </blockquote>
  </div>
</template>

<script>
import { matchAndReplaceStrByDict } from './temp-dictionary'
export default {
  name: 'TempPreviewRobot',
  props: {
    form: {
      type: Object,
      require: true
    },
    isRepeat: Boolean
  },
  computed: {
    data() {
      return this.form2Data(this.form)
    }
  },
  methods: {
    form2Data(form) {
      const { robotTitle, robotRepeatTitle, robotContent, robotRepeatContent } = form
      const title = matchAndReplaceStrByDict(robotTitle)
      const repeatTitle = matchAndReplaceStrByDict(robotRepeatTitle)
      const content = matchAndReplaceStrByDict(robotContent)
      const repeatContent = matchAndReplaceStrByDict(robotRepeatContent)
      return {
        title,
        content,
        repeatContent,
        repeatTitle
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-robot {
  border: 1px solid #e5e5e5;
  padding: 24px;
  &-title {
    color: #000;
    font-weight: 700;
  }
  &-content {
    line-height: 1.8;
    white-space: pre-wrap;
  }
  &-link {
    margin-top: 6px;
    display: block;
    color: rgba(0, 118, 255, 1);
    font-size: 16px;
    text-decoration: none;
  }
}
blockquote {
  margin: 24px 0 0 0;
  padding: 5px 5px 3px 10px;
  border-left: 2px solid #c5c5c5;
}
</style>
