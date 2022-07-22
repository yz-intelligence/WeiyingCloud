import { request } from '@/utils/request'

/**
 * 查询报表
 * @param type company/user
 * @param date 年月日
 */
export function apiGetStatements(type, arg) {
  let params = {}
  if (arg instanceof String) {
    params = {
      date: arg
    }
  } else if (arg instanceof Object && arg !== null) {
    params = arg
  }
  return request({
    url: '/statements/events/' + type,
    params
  })
}
