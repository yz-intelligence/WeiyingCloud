import { request } from '@/utils/request'

export function apiGetBanber() {
  return request({
    url: '/banber'
  })
}
