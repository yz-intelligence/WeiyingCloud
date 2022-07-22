/**
 * 重写element message方法
 * 设置默认显示关闭按钮
 */
import { Message } from 'element-ui'
const customMessage = {}
const messageTypes = ['success', 'info', 'warning', 'error']
messageTypes.forEach(type => {
  customMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.showClose = true
    options.type = type
    return Message(options)
  }
})
const install = function (Vue) {
  Vue.prototype.$Message = customMessage
}
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default {
  install,
  message: customMessage
}
