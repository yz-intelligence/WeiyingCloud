<template>
  <div>
    <div class="guide-mask-before" />
    <div :style="afterStyle" class="guide-mask-after" />
  </div>
</template>

<script>
export default {
  name: 'GuideMask',
  data() {
    return {
      afterStyle: {}
    }
  },
  created() {
    this.$nextTick(() => {
      this.setAfterStyle()
    })
  },
  methods: {
    setAfterStyle() {
      let helper = document.body.querySelector('.introjs-helperLayer')
      if (helper) {
        const { width, height, top, left } = helper.style
        this.afterStyle = {
          width,
          height,
          top,
          left,
          opacity: 1,
          position: 'fixed',
          zIndex: 9999998,
          backgroundColor: '#fff',
          border: '2px solid rgba(117, 117, 117, 1)',
          borderRadius: 4,
          boxShadow: '0 5px 8px -3px rgba(0,0,0,.6)',
          transition: 'all 0.3S ease-out'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-mask {
  &-before {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.6;
    z-index: 999999;
    background: -webkit-radial-gradient(center, ellipse farthest-corner, rgba(0, 0, 0, 0.4) 0, rgba(0, 0, 0, 0.9) 100%);
    transition: all 0.3s ease-out;
  }
}
</style>
