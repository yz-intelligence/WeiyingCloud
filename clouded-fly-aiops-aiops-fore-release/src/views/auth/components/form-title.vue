<template>
  <div class="clogin-title">
    <div class="clogin-title-text">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'FormTitle',
  props: {
    title: {
      type: String,
      default: '登录'
    }
  }
}
</script>

<style lang="scss" scoped>
.clogin-title {
  font-weight: 700;
  font-size: 22px;
  color: #000;
  text-align: center;
  &-text {
    width: 100%;
    padding: 22px;
  }
  &::after {
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-image: linear-gradient(to right, #e7e7e7 4px, #e7e7e7 4px, transparent 4px);
    background-size: 8px 100%;
    background-repeat: repeat-x;
  }
}
</style>
