<!-- eslint-disable -->
<template>
  <div class="preview">
    <div class="preview-title preview-content">{{ isRepeat ? data.repeatTitle : data.title }}</div>
    <div class="preview-content">{{ isRepeat ? data.repeatContent : data.content }}</div>
    <div class="preview-action">
      <span>详情</span>
      <img src="../../../assets/images/common/arrow-right.svg" alt="" />
    </div>
  </div>
</template>

<script>
import { matchAndReplaceStrByDict } from './temp-dictionary'
export default {
  name: 'TempPreviewWorkWx',
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
      const { workWXTitle, workWXRepeatTitle, workWXContent, workWXRepeatContent } = form
      const title = matchAndReplaceStrByDict(workWXTitle)
      const repeatTitle = matchAndReplaceStrByDict(workWXRepeatTitle)
      const content = matchAndReplaceStrByDict(workWXContent)
      const repeatContent = matchAndReplaceStrByDict(workWXRepeatContent)
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
.preview {
  border: 1px solid #e5e5e5;
  padding: 24px 24px 0;
  color: #333;
  &-title {
    font-size: 16px;
  }
  &-content {
    font-size: 14px;
    line-height: 1.8;
    white-space: pre-wrap;
    margin-bottom: 24px;
  }
  &-action {
    img {
      width: 18px;
    }
    padding: 10px 0;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
