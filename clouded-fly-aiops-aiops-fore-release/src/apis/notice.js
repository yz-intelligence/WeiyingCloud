import { request, requestJson } from '@/utils/request'

/**
 * 查询通知记录
 * @param data
 */
export function getNotices(params) {
  return request({
    url: '/notices',
    params
  })
}

// 获取当前公司下所有的消息模板
export function apiGetNoticeTemplateList() {
  return request({
    url: '/noticeTemplate/getNoticeTemplateList'
  })
}

// 分页查询消息模板
export function apiGetNoticeTemplatePage(params) {
  return request({
    url: '/noticeTemplate/getNoticeTemplatePage',
    params
  })
}
/**
 * 删除模板
 * @param id
 */
export function apiDeleteNoticeTemplates(id) {
  return request({
    url: '/noticeTemplate/' + id,
    method: 'delete'
  })
}

/**
 * 根据id查询模板详情
 * @param id
 */
export function apiGetNoticeTemplateDetail(id) {
  return request({ url: `/noticeTemplate/${id}` })
}
/**
 * 获取自定义字段
 * @param id
 */
export function apiGetNoticeCustomizeField() {
  return request({ url: '/noticeTemplateDictionary/getCustomizeField' })
}
/**
 * 获取默认消息模板
 * @param id
 */
export function apiGetDefaultNoticeTemplate() {
  return request({ url: '/noticeTemplateDictionary/getDefaultNoticeTemplate' })
}
/**
 * 修改订阅
 * @param data
 */
export function apiEditNoticeTemplate(data) {
  return requestJson({
    method: data.id ? 'PUT' : 'POST',
    url: '/noticeTemplate',
    data
  })
}
