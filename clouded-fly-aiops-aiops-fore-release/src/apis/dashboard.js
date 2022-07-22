import { request } from '@/utils/request'

/**
 * 获取当天报表信息
 * @returns {AxiosPromise}
 */
export function getTodayReport(params) {
  return request({
    url: '/statements/events/company/totalDay',
    params
  })
}

/**
 * 获取所有报表信息
 * @returns {AxiosPromise}
 */
export function getALLReport(params) {
  return request({
    url: '/statements/events/company/totalAll',
    params
  })
}

/**
 * 获取最近几天级别对应的事件量
 * @returns {AxiosPromise}
 */
export function getLatestOfLevel() {
  return request({
    url: '/statements/events/company/latest/level'
  })
}

/**
 * 获取最近几天componentType对应的事件量
 * @returns {AxiosPromise}
 */
export function getLatestOfComponentType() {
  return request({
    url: '/statements/events/company/latest/componentType'
  })
}

/**
 * 获取最近几天responseTimes对应的事件量
 * @returns {AxiosPromise}
 */
export function getLatestOfResponseTimes() {
  return request({
    url: '/statements/events/company/latest/responseTimes'
  })
}
