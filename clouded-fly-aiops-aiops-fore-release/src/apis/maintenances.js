import { request } from '@/utils/request'

/**
 * 获取维护期列表
 * @param data
 */
export function getMaintenances(params) {
  return request({
    url: '/maintenances',
    params
  })
}

/**
 * 保存维护期
 * @param data
 */
export function saveMaintenances(data) {
  return request({
    method: data.id ? 'PUT' : 'POST',
    url: data.id ? '/maintenances/' + data.id : '/maintenances',
    data
  })
}

/**
 * 删除维护期
 * @param id
 */
export function delMaintenances(id) {
  return request({
    url: '/maintenances/' + id,
    method: 'delete'
  })
}

/**
 * 暂停维护期
 * @param id
 * @returns {AxiosPromise}
 */
export function pauseMaintenances(id) {
  return request({
    url: `/maintenances/${id}/pause`,
    method: 'put'
  })
}
