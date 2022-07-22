import Vue from 'vue'
import VueRouter from 'vue-router'
import base from './views/base' // 首页，错误页面
import auth from './views/auth' // 登录注册
import system from './views/system' // 系统管理
import analysis from './views/analysis' // 事件分析
import event from './views/event' // 事件通知
import monitor from './views/monitor' // 监控源管理
import notice from './views/notice' // 事件订阅
import user from './views/user' // 个人中心

Vue.use(VueRouter)
// hack点击重复路由时报错，报错时不会触发routerEach
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [...auth, ...base, ...system, ...analysis, ...event, ...monitor, ...notice, ...user]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
