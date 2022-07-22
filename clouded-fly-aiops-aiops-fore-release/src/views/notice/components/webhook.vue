<template>
  <div class="merge">
    <div class="webhook" v-for="(item, index) in contents" :key="index">
      <div class="webhook-option">
        <!-- webhook输入框 -->
        <el-input
          size="small"
          class="webhook-option-content"
          v-model.trim="item.webhook"
          :maxlength="100"
          placeholder="请输入"
          :disabled="disabled"
        />
        <!-- 增加和减少按钮 -->
        <div v-if="contents.length !== 1" class="webhook-option-button">
          <el-button
            size="small"
            class="table-actions-item--button"
            type="text"
            @click="delWebhook(index)"
            :disabled="disabled"
            >删除</el-button
          >
        </div>
      </div>
    </div>
    <el-button
      plain
      class="merge-button"
      size="small"
      icon="el-icon-plus"
      @click="addWebhook"
      :disabled="disabled || contents.length >= 5"
      >添加</el-button
    >
  </div>
</template>
<script>
export default {
  name: 'WebHook',
  props: {
    value: {
      type: Array,
      default: () => {
        return [
          {
            webhook: ''
          }
        ]
      }
    },
    // 是否只读
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contents: this.value
    }
  },
  methods: {
    // webhook加号功能
    addWebhook() {
      this.contents.push({
        webhook: ''
      })
      this.$emit('input', this.contents)
      this.$parent.$emit('el.form.change', this.contents)
    },
    // webhook减号功能
    delWebhook(index) {
      if (this.contents.length === 1) return
      this.contents.splice(index, 1)
      this.$emit('input', this.contents)
      this.$parent.$emit('el.form.change', this.contents)
    }
  }
}
</script>
<style lang="scss" scoped>
.merge {
  display: flex;
  flex-direction: column;
  background: #f9fafe;
  border: 1px solid #dddddd;
  border-radius: 2px;
  padding: 16px;
  color: #333;
  max-height: 175px;
  overflow: auto;
  &-button {
    width: calc(100% - 28px);
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 4px;
    margin: 8px auto 0;
    color: #0076ff;
  }
}
.webhook {
  height: auto;
  padding: 8px 14px;
  width: 100%;
  &-option {
    @include flex(flex-start);
    &-button {
      margin-left: 10px;
    }
  }
}
.table-actions {
  &-item {
    &--button {
      padding: 0;
    }
  }
}
</style>
