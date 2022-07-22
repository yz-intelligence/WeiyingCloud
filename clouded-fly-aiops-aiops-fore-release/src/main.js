import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from '@/filters' //全局过滤器
import globalComponent from './utils/globalComponent' // 全局组件
import ElementUI from 'element-ui'
import '@/permission' // 权限
import permissionDirective from '@/directive/permission/index'
// 新手指导样式
import VueIntro from 'vue-introjs'
import 'intro.js/introjs.css'
import './assets/styles/index.scss' // 全局样式
import 'element-ui/lib/theme-chalk/icon.css'
import './assets/styles/iconfont/iconfont.css'

// 自定义弹窗样式
import customMessageBox from '@/plugins/messagebox'
import hasPermission from '@/plugins/hasPermission'
//自定义消息框，this.$Message调用
import customMessage from '@/plugins/customMessage'

// import 'intro.js/themes/introjs-modern.css'
Vue.use(VueIntro)
Vue.config.productionTip = false
// 全局-过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(globalComponent)
Vue.use(ElementUI)
Vue.use(customMessage)
Vue.use(customMessageBox)
Vue.use(hasPermission)
Vue.use(permissionDirective)
// 判断是否为生产环境

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
