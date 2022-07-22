import store from '@/store'

const checkPermission = (el, binding) => {
  const { value } = binding
  const userPermissions = store.getters && store.getters.permissions

  if (value) {
    const hasPermission = userPermissions.includes(value)
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error('need permission id!Like v-permission="test-id"')
  }
}
export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
