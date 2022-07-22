import { request } from '@/utils/request'

// 获取导航栏
export function apiGetMenusTree() {
  return request({
    url: '/menus/trees?pid=EventBank&layers=-1&version=1.23'
  })
}

export function apiSaveMenu(data) {
  return request({
    url: data.id ? '/menus/' + data.id : '/menus',
    method: data.id ? 'PUT' : 'POST',
    data
  })
}

export function apiDeleteMenu(id) {
  return request({
    url: `/menus/${id}`,
    method: 'delete',
    params: { email }
  })
}

/**
 * 获取功能权限列表
 * @param menuId
 */
export function apiGetAction(params) {
  return request({
    url: '/permissions',
    params
  })
}

/**
 * 获取菜单下的操作
 * @param menuId
 */
export function apiGetActionBySourceId(menuId) {
  return request({
    url: '/permissions',
    params: {
      sourceType: 'Menu',
      sourceId: menuId
    }
  })
}

/**
 * 保存许可
 * @param menuId
 * @param action
 * @returns {*|AxiosPromise}
 */
export function apiSaveAction(menuId, action) {
  return request({
    url: '/permissions',
    params: { sourceType: 'Menu', sourceId: menuId, action: action }
  })
}
