<template>
  <div class="home">
    <!-- 背景图 -->
    <div class="header">
      <div>
        <img src="../../assets/images/home/banner.png" />
      </div>
    </div>
    <!-- 四张卡 -->
    <Card class="card" />
    <!-- 今日事件 -->
    <Report class="card" />
    <!-- 事件统计 -->
    <Count class="card" />
    <!-- 最近七天事件 -->
    <ChartNotice />
    <!-- 新手指导 -->
    <Guide :visible.sync="isShowGuide" @start="startGuide" @close="setFishConfig"></Guide>
    <guide-close v-if="isGuiding" @close="closeGuide" />
  </div>
</template>

<script>
import Guide from '@/components/common/guide'
import GuideClose from '@/components/common/guide-close'
import Card from './components/card'
import Count from './components/count'
import Report from './components/report'
import ChartNotice from './components/chartNotice'
import { homeGuideOptions } from '@/utils/guideOptions'
import { apiGetFishConfig, apiSaveFishConfig } from '@/apis/config'
export default {
  name: 'PageHome',
  components: {
    Card,
    Count,
    Guide,
    Report,
    GuideClose,
    ChartNotice
  },
  data() {
    return {
      isFish: false, // 新人
      isShowGuide: false,
      isGuiding: false
    }
  },
  mounted() {
    // 非教程下，请求接口判断是否新手
    !this.checkIntro() && this.getFishConfig()
  },
  beforeRouteUpdate(to, from, next) {
    this.checkIntro(to)
    next()
  },
  methods: {
    // 获取用户是否第一次进入，第一次显示新手教程
    async getFishConfig() {
      const { success, desc, data } = await apiGetFishConfig()
      if (success) {
        if (!Array.isArray(data) || !data[0] || !data[0].used) {
          this.isShowGuide = true
          this.isFish = true
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 第一次进入教程后，去除新人标志
    setFishConfig() {
      if (this.isFish) {
        apiSaveFishConfig({ used: true })
      }
    },
    // 检测是否开启新手教程
    checkIntro($route = this.$route) {
      if ('intro' in $route.query) {
        this.isShowGuide = true
      }
      return this.isShowGuide
    },
    // 关闭教程
    closeGuide() {
      this.isGuiding = false
      this.intro && this.intro.exit(true)
      this.$store.commit('menu/SET_IS_FIX', true)
    },
    // 开始教程
    startGuide() {
      const hasSystem = this.$store.getters.menuTree.some(item => item.id === 'SystemManager')
      this.intro = this.$intro()
        .setOptions(homeGuideOptions(hasSystem))
        .start()
        .oncomplete(() => {
          this.closeGuide()
          this.$router.push('/monitor/access?intro')
        })
      this.isGuiding = true
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  background-color: #f4f6fa;
  padding: 24px 14px;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    min-width: 1200px;
    padding: 0 10px;
    margin-bottom: 8px;
    div {
      background-color: #121825;
      width: 100%;
    }
    img {
      width: 100%;
      height: auto;
      min-height: 270px;
    }
  }
}
</style>
