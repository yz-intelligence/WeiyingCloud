import { request } from '@/utils/request'

/**
 * 查询配置
 * @param params
 */
export function apiGetConfig(params) {
  return request({
    url: '/configs',
    params
  })
}

/**
 * 查询配置
 * @param data
 */
export function apiGetFishConfig(params) {
  return request({
    url: '/users/get/record',
    params
  })
}

/**
 * 查询配置
 * @param data
 */
export function apiSaveFishConfig(data) {
  return request({
    url: '/users/save/record',
    method: 'post',
    data
  })
}

/**
 * 查询企业下某个类型的配置
 * @param type
 */
export function apiGetCompanyConfig(type, name) {
  const params = { type, name }
  return request({
    url: '/configs/group',
    params
  })
}

/**
 * 查询个人配置
 * @param name
 */
export function apiGetPersonConfig(name) {
  const params = { type: 'Person', name }
  return request({
    url: '/configs/group',
    params
  })
}

/**
 * 保存配置
 * @param data
 */
export function apiSaveConfig(data) {
  const { id } = data
  return request({
    url: `/configs${id ? '/' + id : ''}`,
    method: id ? 'PUT' : 'POST',
    data
  })
}

/**
 * 测试邮箱发送
 * @param data
 */
export function apiTestEmailServer(params) {
  return request({
    url: '/configs/test-email-server',
    params
  })
}

/**
 * 删除配置
 * @param id
 * @returns {AxiosPromise}
 */
export function apiDeleteConfig(id) {
  return request({
    url: `configs/${id}`,
    method: 'delete'
  })
}

/**
 * 新增企业微信配置
 * @param name
 */
export function apiCreateWxWorkConfig(data = {}) {
  return request({
    method: 'POST',
    url: '/configs',
    data
  })
}
