<template>
  <div class="page-container">
    <c-breadcrumb />
    <config-model id="config_div_model" />
    <config-notice id="config_div_notice" />
    <config-email id="config_div_email" />
    <config-wx-work id="config_div_wx" />
    <config-sms id="config_div_sms" />
    <config-auto id="config_div_auto" />
    <config-warn />
  </div>
</template>

<script>
import ConfigModel from './components/config/model'
import ConfigNotice from './components/config/notice'
import ConfigEmail from './components/config/email'
import ConfigWxWork from './components/config/wx-work'
import ConfigSms from './components/config/sms'
import ConfigAuto from './components/config/auto'
import ConfigWarn from './components/config/warn'
export default {
  name: 'SystemConfig',
  components: {
    ConfigModel,
    ConfigNotice,
    ConfigSms,
    ConfigAuto,
    ConfigWarn,
    ConfigEmail,
    ConfigWxWork
  }
}
</script>

<style lang="scss" scoped>
// z-index 解决页面loading盖住菜单bug
.page-container {
  padding-bottom: 24px;
  position: relative;
  z-index: 1;
}
</style>
