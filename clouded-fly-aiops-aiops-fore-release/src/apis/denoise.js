import { request } from '@/utils/request'

// 查询降噪规则
export function apiGetDenoise(params) {
  return request({
    url: '/denoise/rules',
    params
  })
}

// 添加降噪规则
export function apiAddDenoise(data) {
  return request({
    method: 'POST',
    url: '/denoise/rules',
    data
  })
}

// 修改降噪规则
export function apiupdateDenoise(id, data) {
  return request({
    method: 'PUT',
    url: `/denoise/rules/${id}`,
    data
  })
}

// 删除降噪规则
export function apiDeleteDenoise(id) {
  return request({
    method: 'delete',
    url: `/denoise/rules/${id}`
  })
}

// id查询降噪规则
export function apiSearchDenoiseById(id) {
  return request({
    url: `/denoise/rules/${id}`
  })
}

// 修改降噪规则状态
export function apiupdateDenoiseStatus(id, data) {
  return request({
    method: 'PUT',
    url: `/denoise/rules/updateState/${id}`,
    data
  })
}
