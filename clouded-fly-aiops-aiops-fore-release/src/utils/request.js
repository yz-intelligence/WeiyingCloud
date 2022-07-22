import qs from 'qs'
import axios from 'axios'
import store from '../store/index'
import { Loading, Message } from 'element-ui'
let loadingInstance = '' // 全局加载
let passSameError = '' // 500ms内相同错误提示只显示一次,该参数为错误信息
let passSameErrorTimer = null
// 默认配置30s
axios.defaults.timeout = 30000
axios.defaults.headers['Content-Type'] = 'application/json'
// 普通请求用例
axios.defaults.withCredentials = true
const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
  maxRedirects: 0,
  headers: {
    common: { 'X-Requested-With': 'XMLHttpRequest' },
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  // 将数据转成form-data
  transformRequest: [
    function (data) {
      if (!data) {
        return data
      }
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
          data[key] = JSON.stringify(data[key])
        }
      })
      return qs.stringify(data)
    }
  ]
})

// form-data类型请求用例
const requestJson = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
  headers: {
    common: { 'X-Requested-With': 'XMLHttpRequest' },
    'Content-Type': 'application/json'
  }
})

/**
 * 拦截器成功回调
 * 所有接口返回0才正常返回resolve
 * 非0都reject出去
 * @param res
 * @returns {*}
 */
function resolve(res) {
  const { data, config } = res
  const { success, desc } = data
  if (config && config.loading) {
    loadingInstance && loadingInstance.close()
  }
  if (!success && desc === '未登录') {
    Message.info({
      showClose: true,
      message: '登录状态已失效，请重新登录',
      duration: 3000
    })
    store.dispatch('user/logout')
  }
  return data
}

// 失败，一般是网络错误
function reject(error) {
  const { config, response, code, message } = error

  // 如果设置loading,则加载loading实例
  if (config && config.loading) {
    loadingInstance && loadingInstance.close()
  }

  let errmsg = ''
  // 超时信息处理
  if (code === 'ECONNABORTED') {
    errmsg = '请求超时，请重新再试'
  }

  // 网络错误处理
  if (message.indexOf('Network Error') !== -1) {
    errmsg = '网络错误，请检查网络'
  }

  // 接口返回错误处理
  if (response) {
    const errorMap = {
      401: '登录状态已失效，请重新登录',
      404: '请求接口404，请联系管理员',
      502: '客官稍安勿躁，我们的攻城狮正在紧急维护，请稍后重试',
      504: '网络请求超时，请检查您的网络或稍后重试'
    }
    !errmsg && (errmsg = errorMap[response.status] || '客官稍安勿躁，我们的攻城狮正在紧急维护，请稍后重试')
    if (response.status === 401) {
      store.dispatch('user/logout')
    }
  }
  if (errmsg) {
    //500ms内相同错误只显示一次
    if (passSameError !== errmsg) {
      clearTimeout(passSameErrorTimer)
      passSameError = errmsg
      passSameErrorTimer = setTimeout(() => {
        passSameError = ''
      }, 500)
      const messageType = response?.status === 401 ? 'info' : 'error'
      Message[messageType]({
        showClose: true,
        message: errmsg,
        duration: 3000
      })
    }
  }

  console.log('=====> error', error)
  console.log('=====> error.response', error.response)
  // 将所有返回放到then里，所有调用尽量使用await
  /**
   * 调用例子：
   *  const { success, desc, data } = await apipost()
   * if(success) {
   *    代码逻辑
   * } else {
   *    desc && this.$Message.error(desc)
   * }
   */

  return Promise.resolve({
    success: false,
    desc: null,
    data: null
  })
}

request.interceptors.request.use(function (config) {
  const { loading } = config
  if (loading) {
    loadingInstance = Loading.service({
      fullscreen: true,
      background: 'rgba(255, 255, 255, 0.6)',
      text: config.loading || '努力加载中...'
    })
  }
  return config
})

requestJson.interceptors.request.use(function (config) {
  const { loading } = config
  if (loading) {
    loadingInstance = Loading.service({
      fullscreen: true,
      background: 'rgba(255, 255, 255, 0.6)',
      text: config.loading || '努力加载中...'
    })
  }
  return config
})

request.interceptors.response.use(resolve, reject)
requestJson.interceptors.response.use(resolve, reject)
export { request, requestJson }
