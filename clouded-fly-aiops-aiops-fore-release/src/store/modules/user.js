import { apiLogin, apiGetInfo, apiLogout } from '@/apis/login'
import { apiGetPermission } from '@/apis/user'
import router from '../../router'

const user = {
  namespaced: true,
  state: {
    info: null,
    status: '',
    name: '',
    email: '',
    avatar: '',
    permissions: []
  },

  mutations: {
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PERMISSIONS: (state, data) => {
      state.permissions = data
    }
  },

  actions: {
    // 登录
    login: async (_, params) => await apiLogin(params),
    logout: async ({ commit }) => {
      const res = await apiLogout()
      const { success } = res
      if (success) {
        commit('SET_INFO', null)
        if (router.currentRoute.name !== 'Login') {
          router.replace('/login')
        }
      }
      return res
    },
    getUserInfo: async ({ commit }) => {
      const res = await apiGetInfo()
      const { data } = res
      if (data) {
        commit('SET_INFO', data)
        // 获取用户信息成功，设置账号所有功能权限
        commit('SET_PERMISSIONS', data.permissionSet || [])
      }
      return res
    }
  }
}

export default user
