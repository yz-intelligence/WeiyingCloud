import { request, requestJson } from '@/utils/request'
import { downloadFile } from '@/utils'

//分类管理表格查询
export function apiGetClassifications(params) {
  return request({
    url: '/events/classifyType/getClassifyTypePage',
    params
  })
}
// 获取智能分类分页
export function apiGetEventClassifyPage(params) {
  return request({
    url: '/events/classify/getEventClassifyPage',
    params
  })
}

// 获取智能分类图表
export function apiGetClassificationsChart(params) {
  return request({
    url: '/events/classify/getChartValue',
    params
  })
}

//导出数据接口
export function apiExportChart(params) {
  // return requestJson({
  //   method: 'get',
  //   url: `/events/classify/exportClassify`,
  //   params,
  //   responseType: 'blob'
  // })
  const newParams = Object.keys(params).map(key => `${key}=${params[key]}`)
  const url = process.env.VUE_APP_API_BASE + '/events/classify/exportClassify?' + newParams.join('&')
  downloadFile(url)
}

//新增分类 or 编辑分类
export function apiSaveClassification(data) {
  return requestJson({
    method: data.id ? 'PUT' : 'POST',
    url: data.id ? `/events/classifyType/update/${data.id}` : '/events/classifyType',
    data
  })
}
// 获取分类规则分页
export function apiGetClassifyPage(params) {
  return request({
    url: '/events/classifyRules/getClassifyRulesPage',
    params
  })
}

// id查询分类规则
export function apiGetClassifyPageById(id) {
  return request({
    url: `/events/classifyRules/${id}`
  })
}

/**
 * 保存分类规则
 * @param data
 */
export function apiSaveClassify(data) {
  return requestJson({
    method: data.id ? 'PUT' : 'POST',
    url: data.id ? `/events/classifyRules/update/${data.id}` : '/events/classifyRules',
    data
  })
}

//分类管理表格查询
export function apiGetParents() {
  return request({
    url: '/events/classifyType/getParents'
  })
}

//分类管理状态切换
export function apiUpdateState(id, params) {
  return request({
    method: 'PUT',
    url: '/events/classifyType/updateState/' + id,
    params
  })
}
// 删除分类规则
export function apiDeleteClassifyRules(id) {
  return request({
    url: `/events/classifyRules/${id}`,
    method: 'delete'
  })
}
// 删除分类规则
export function apiDeleteClassification(id) {
  return request({
    url: `/events/classifyType/${id}`,
    method: 'delete'
  })
}

// 修改分类规则状态
export function apiUpdateClassifyStatus(id, data) {
  return request({
    method: 'PUT',
    url: `/events/classifyRules/updateState/${id}`,
    data
  })
}

// 获取分类树
export function apiGetClassifyTree() {
  return request({
    url: '/events/classifyType/tree'
  })
}

// 获取分类树
export function apiGetClassifyRulesTree() {
  return request({
    url: '/events/classifyRules/tree'
  })
}

// 修改智能分类
export function apiUpdateClassify(data) {
  return requestJson({
    method: 'PUT',
    url: '/events/classify/update',
    data
  })
}
