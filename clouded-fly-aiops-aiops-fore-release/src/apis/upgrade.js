import { request, requestJson } from '@/utils/request'

// 获取升级规则
export function apiGetUpgrade(params) {
  return request({
    url: '/events/upgrade',
    params
  })
}
/**
 * 保存升级规则
 * @param data
 */
export function apiSaveUpgrade(data) {
  return requestJson({
    method: data.id ? 'PUT' : 'POST',
    url: data.id ? `/events/upgrade/update/${data.id}` : '/events/upgrade',
    data
  })
}
/**
 * 根据id查询升级规则详细
 * @param id
 */
export function apiGetUpgradeById(id) {
  return request({ url: `/events/upgrade/${id}` })
}

// // 获取升级规则
// export function apiUpdateState(id, data) {
//   return requestJson({
//     method: 'PUT',
//     url: '/events/upgrade/updateState/' + id,
//     data
//   })
// }
export function apiUpdateState(id, params) {
  return request({
    method: 'PUT',
    url: '/events/upgrade/updateState/' + id,
    params
  })
}
//删除升级规则
export function apiDeleteSubscriptions(id) {
  return request({
    method: 'delete',
    url: '/events/upgrade/' + id
  })
}
