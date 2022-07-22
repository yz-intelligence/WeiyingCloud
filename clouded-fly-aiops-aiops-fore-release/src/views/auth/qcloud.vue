<template>
  <div class="qcloud">
    <!-- <div v-show="!isLogin" class="qcloud-item" key="checking">
      <img class="qcloud-icon" src="@/assets/images/auth/verify-check.svg" alt="" />
      <p class="qcloud-loading">免登录验证中...</p>
    </div>
    <div v-show="isLogin" class="qcloud-item" key="checked">
      <img class="qcloud-icon" src="@/assets/images/auth/verify-done.svg" alt="" />
      <p class="qcloud-loading">验证成功，即将跳转...</p>
    </div> -->
    <div class="qcloud-item" key="checked">
      <img class="qcloud-icon" :src="data[status].icon" alt="" />
      <p class="qcloud-loading">{{ data[status].message }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'QCloudAuth',
  data() {
    return {
      isLogin: false,
      baseUrl: process.env.VUE_APP_API_BASE,
      data: {
        check: { icon: require('@/assets/images/auth/verify-check.svg'), message: '免登录验证中...' },
        done: { icon: require('@/assets/images/auth/verify-done.svg'), message: '验证成功，即将跳转...' },
        fail: { icon: require('@/assets/images/auth/verify-fail.svg'), message: '登录验证失败' }
      },
      status: 'check'
    }
  },
  created() {
    this.checkInfo()
  },
  methods: {
    checkInfo() {
      const query = this.$route.query
      // 有code执行千帆自动登录
      if (query.code) {
        //后台格式要求form-data格式，处理请求头和数据格式
        const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        const data = qs.stringify({ ...query })
        axios
          .post(`${this.baseUrl}/login/tencentCloudOAuth`, data, config)
          .then(async res => {
            const { success, desc, data } = res.data
            if (success) {
              // this.isLogin = true
              this.status = 'done'
              if (data.perfectInfo) {
                setTimeout(() => {
                  this.$router.push('/perfect-qcloud')
                }, 200)
              } else {
                setTimeout(() => {
                  this.$router.push('/home')
                }, 200)
              }
            } else {
              this.status = 'fail'
              this.$Message.error(desc)
            }
          })
          .catch(() => {
            this.$Message.error('验证失败，请联系管理员！')
          })
        return false
      }
      // 没有则调用用户信息接口判断是否登录和完善信息
      axios
        .get(`${this.baseUrl}/login/info`)
        .then(res => {
          const { data, desc } = res.data
          // 未登录跳转到千帆oauth
          if (desc === '未登录') {
            location.href = `https://www.cloud.tencent.com/open/authorize?scope=login&app_id=100020794881&redirect_url=${location.href}&state=1234`
            return false
          }
          const { perfectInfo } = data
          this.isLogin = true
          setTimeout(() => {
            this.$router.push(perfectInfo ? '/perfect-qcloud' : '/home')
          }, 200)
        })
        .catch(() => {
          this.$Message.error('信息失败，请联系管理员！')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.qcloud {
  position: relative;
  width: 100vw;
  height: 100vh;
  &-item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &-icon {
    width: 200px;
    height: 200px;
  }

  &-loading {
    margin-top: 16px;
    font-size: 24px;
    text-align: center;
  }
}
</style>
