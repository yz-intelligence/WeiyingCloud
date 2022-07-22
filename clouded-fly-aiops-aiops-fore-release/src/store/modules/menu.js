import { apiGetMenusTree } from '@/apis/menu'

const menu = {
  namespaced: true,
  state: {
    menuTree: [], // 菜单
    menuArr: [], // 展开后菜单数组，用于面包屑
    isFix: true // 导航栏是否fix定位
  },
  mutations: {
    SET_MENU_TREE: (state, data) => {
      state.menuTree = data
    },
    SET_MENU_ARR: (state, data) => {
      state.menuArr = data
    },
    // 设置导航栏是否固定，服务于新手指南
    SET_IS_FIX: (state, data) => {
      state.isFix = data
    }
  },
  actions: {
    // 获取菜单树
    getMenusTree: async ({ commit }) => {
      const res = await apiGetMenusTree()
      const { success, data } = res
      if (success) {
        commit('SET_MENU_TREE', data)
        const menuArr = expandTree(data)
        commit('SET_MENU_ARR', menuArr)
      }
      return { ...res, data }
    }
  }
}
function expandTree(treeArr = []) {
  if (!treeArr.length) return false
  const stack = [...treeArr]
  const result = []
  while (stack.length) {
    const current = stack.pop()
    result.push(current)
    if (current.children.length) {
      current.children.forEach(item => {
        stack.push({ parent: current, ...item })
      })
    }
  }
  return result
}
export default menu
