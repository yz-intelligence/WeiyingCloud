<template>
  <div class="auth">
    <header class="auth-logo">
      <img class="auth-logo-icon" src="../../../assets/images/auth/logo.svg" alt="维鹰云" />
      <span class="auth-logo-hr"></span>
      <span class="auth-logo-slogan">运维难？认准这只鹰！</span>
    </header>
    <div class="auth-content">
      <div class="auth-desc-wrap">
        <div class="auth-desc">
          <p class="auth-desc-title">智能运维SaaS首选品牌</p>
          <p class="auth-desc-text">通过AI和大数据技术助力数据中心运维，为业务连续保驾护航，让运维工作简单高效！</p>
          <div class="auth-desc-extra">
            <img src="../../../assets/images/auth/desc.png" alt="" />
            <p class="auth-desc-cp">Copyright © 2018-2022 Rights Reserved. 腾云悦智版权所有。</p>
          </div>
        </div>
      </div>
      <div class="auth-form">
        <slot></slot>
        <div class="auth-form-term">
          <a @click="showTerms = true">服务条款</a>
        </div>
      </div>
    </div>
    <term :visible.sync="showTerms" @close="showTerms = val"></term>
    <!-- 重置密码成功结果页面 -->
    <slot name="result"></slot>
  </div>
</template>

<script>
import Term from '@/components/common/term'
export default {
  components: { Term },
  name: 'AuthWrap',
  data() {
    return {
      showTerms: false
    }
  }
}
</script>

<style lang="scss" scoped>
.auth {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #1f1f1f url('~@/assets/images/auth/login-bg.jpg') center center;
  background-size: 100% auto;
  color: #fff;
  overflow: hidden;
  &-logo {
    position: absolute;
    display: flex;
    top: 30px;
    left: 34px;
    &-icon {
      width: 116px;
      height: 28px;
    }
    &-hr {
      position: relative;
      margin: 0 8px;
      top: 8px;
      width: 2px;
      height: 18px;
      background-color: #fff;
    }
    &-slogan {
      font-size: 12px;
      line-height: 34px;
    }
  }
  &-desc {
    position: absolute;
    width: 528px;
    transform: translateY(-280px);
    &-wrap {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-562px);
    }
    &-title {
      margin-bottom: 18px;
      font-size: 34px;
      font-weight: 700;
    }
    &-text {
      font-size: 16px;
    }
    &-extra {
      position: relative;
      left: -58px;
      img {
        width: 528px;
        min-height: 454px;
      }
    }
    &-cp {
      padding-left: 4%;
      text-align: center;
      color: rgba(255, 255, 255, 0.85);
    }
  }
  &-form {
    position: absolute;
    top: 50%;
    left: 76%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px #abc7e6;
    transform: translate(-50%, -50%);
    &-term {
      position: relative;
      color: #666;
      margin-bottom: 24px;
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
  }
  &::v-deep .el-form-item__error {
    line-height: 1.5;
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 1000px) {
  .auth {
    &-form {
      left: 50%;
    }
    &-desc-wrap {
      visibility: hidden;
    }
  }
}
</style>
