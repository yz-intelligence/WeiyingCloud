import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
Vue.use(Vuex)

// 1.获取modules文件夹，自动将模块加到modules，免去手动添加操作
// 2.如果需要去掉某一个模块，直接删除modules文件夹下得js文件即可
// 3.临时下线某一个模块，添加属性ban，并设置为true
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  // 过滤临时下线的模块
  if (!value.default.ban) {
    modules[moduleName] = value.default
  }
  return modules
}, {})

export default new Vuex.Store({
  modules,
  getters
})
