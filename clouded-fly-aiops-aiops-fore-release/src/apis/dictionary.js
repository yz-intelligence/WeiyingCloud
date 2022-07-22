import { request } from '@/utils/request'

export function apiGetDictionary() {
  return request({
    url: '/test/dic',
    method: 'get'
  })
}

// 获取降噪合并条件
export function apiGetDenoiseConditions() {
  return request({
    url: '/denoise/rules/denoiseConditions'
  })
}
