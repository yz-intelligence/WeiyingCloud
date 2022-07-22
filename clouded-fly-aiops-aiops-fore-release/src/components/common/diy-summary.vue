<template>
  <div class="box">
    <div class="summary" v-for="(item, index) of changeSummary(summary)" :key="index">
      <span v-if="index">或</span>
      <div>{{ item }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DiySummary',
  props: {
    summary: {
      type: String,
      default: ''
    }
  },
  methods: {
    changeSummary(summary) {
      return summary.split('或')
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  flex-wrap: wrap;
}
.summary {
  margin: 3px 0;
  div {
    display: inline-block;
    background: rgba(0, 118, 255, 0.08);
    border: 1px solid rgba(0, 118, 255, 0.2);
    border-radius: 2px;
    font-size: 14px;
    color: #0076ff;
    padding: 3px 6px;
    margin: 0 2px;
  }
}
</style>
