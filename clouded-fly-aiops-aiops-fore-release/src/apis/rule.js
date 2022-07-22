import { request, requestJson } from '@/utils/request'

/**
 * 获取订阅列表
 * @param data
 */
export function getSubscriptions(params) {
  return request({ url: '/subscriptions', params })
}

/**
 * 保存订阅
 * @param data
 */
export function saveSubscriptions(data) {
  return requestJson({
    method: data.id ? 'PUT' : 'POST',
    url: data.id ? '/subscriptions/' + data.id : '/subscriptions',
    data
  })
}
/**
 * 删除订阅
 * @param id
 */
export function deleteSubscriptions(id) {
  return request({
    url: '/subscriptions/' + id,
    method: 'delete'
  })
}

/**
 * 根据id查询订阅
 * @param id
 */
export function getSubscriptionDetail(id) {
  return request({ url: `/subscriptions/${id}` })
}

//切换订阅规则状态
export function apiUpdateState(id, params) {
  return request({
    method: 'PUT',
    url: '/subscriptions/updateState/' + id,
    params
  })
}
