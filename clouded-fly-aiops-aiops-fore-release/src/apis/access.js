import { request } from '@/utils/request'

// 查询已有监控源
export function apiGetAccessTools(params) {
  return request({
    url: '/receive/confs',
    params
  })
}

// 查询已有监控源
export function apiGetAccessToolsList(params) {
  return request({
    url: '/receive/confs/monitor-source',
    params
  })
}

// 添加或修改监控源
export function apiSaveAccess(data) {
  return request({
    method: data.id ? 'PUT' : 'POST',
    url: data.id ? '/receive/confs/' + data.id : '/receive/confs',
    data
  })
}

// 删除监控源
export function apiDeleteAccess(id) {
  return request({
    url: '/receive/confs/' + id,
    method: 'delete'
  })
}

//查询重名
export function apiCheckAccess(data) {
  return request({
    url: '/receive/confs/check-name',
    params: data
  })
}

/**
 * 新增未配置降噪规则的监控源
 */
export function apiGetConfWithNotRules(params) {
  return request({
    url: '/receive/confs/receiveConfWithNotRules',
    params
  })
}

//修改监控源状态
export function apiUpdateState(id, data) {
  return request({
    method: 'PUT',
    url: '/receive/confs/updateState/' + id,
    data
  })
}
