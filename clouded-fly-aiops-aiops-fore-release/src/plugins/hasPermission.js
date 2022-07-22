import store from '@/store'

/**
 * 是否拥有此权限
 * @param {string} id 功能权限id
 * @returns boolean
 * @like $hasPermission('test')
 */
const hasPermission = id => {
  let permission = false
  const userPermissions = store.getters && store.getters.permissions
  if (id) {
    const hasPermission = userPermissions.includes(id)
    if (hasPermission) {
      permission = true
    }
  }
  return permission
}
const install = Vue => {
  Vue.prototype.$hasPermission = hasPermission
}
export default {
  install,
  hasPermission
}
