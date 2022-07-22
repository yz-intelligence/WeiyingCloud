import { request } from '@/utils/request'
import _ from 'axios'
/**
 * 获取事件列表
 * @param data
 */
export function apiGetEvents(params) {
  return request({
    url: '/events',
    params
  })
}
/**
 * 获取事件列表各级别汇总
 * @param data
 */
export function apiGetLevelTotal(params) {
  return request({
    url: '/events/level/total',
    params
  })
}

/**
 * 获取事件详情
 * @param id
 */
export function apiGetDetail(id) {
  return request({
    url: '/events/' + id
  })
}
/**
 * 获取事件详情-原始报文
 * @param id
 * @returns {*|AxiosPromise}
 */
export function apiGetSourceReport(id) {
  return request({
    url: `/events/sourceData/${id}`,
    method: 'get'
  })
}
/**
 * 事件关闭
 * @param id
 * @returns {*|AxiosPromise}
 */
export function apiCloseEvents(id, bz, status) {
  const data = { bz, status }
  return request({
    url: `/events/close/${id}`,
    method: 'post',
    data
  })
}

/**
 * 事件响应
 * @param id
 * @returns {*|AxiosPromise}
 */
export function apiResponseEvents(id) {
  return request({
    url: `/events/response/${id}`,
    loading: '努力响应中...',
    method: 'post'
  })
}

/**
 * 人工报障
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiSaveEvents(data) {
  return request({
    url: '/events',
    method: 'post',
    data
  })
}

/**
 * 查询被合并
 * @returns {*|AxiosPromise}
 */
export function apiGetMergersBy(ids) {
  return request({
    url: `/mergers/${ids}/mergers`
  })
}

/**
 * 查询合并事件
 */
export function getMergers(name) {
  return request({
    url: '/mergers',
    params: { name }
  })
}

/**
 * 合并事件
 * @param ids
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiDoMerger(data) {
  return request({
    url: '/mergers',
    method: 'post',
    data
  })
}

/**
 * 查询个人表格配置
 * @returns {*|AxiosPromise}
 */
export function apiGetPersonEventConfig() {
  return request({
    url: '/configs/user-conf'
  })
}

/**
 * 新建个人表格配置
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiCreatePersonEventConfig(data) {
  return request({
    url: '/configs',
    method: 'post',
    data
  })
}

/**
 * 获取合并事件列表
 * @param id
 */
export function apiGetMergersEvents(id, params) {
  return request({
    url: `/mergers/${id}/events`,
    params
  })
}

/**
 * 历史事件列表
 * @param data
 */
export function apiGetHistoryEvent(params) {
  return request({
    url: '/events/history',
    params
  })
}

/**
 * 历史事件列表统计
 * @param data
 */
export function apiGetHistoryEventTotal(params) {
  return request({
    url: '/events/history/level/total',
    params
  })
}

/**
 * 历史事件降噪记录标注（移出）
 * @param data
 */
export function apiNoiseReductionMistake(id) {
  return request({
    url: `/events/history/noiseReductionMistake/${id}`,
    method: 'PUT'
  })
}

/**
 * 获取历史事件合并事件列表
 * @param id
 */
export function apiGetHistoryEventsMergers(id, params) {
  return request({
    url: `/events/history/${id}/events`,
    // url: `/events/originals/${id}`,
    params
  })
}

/**
 * 历史事件导出
 * @param data
 */
export function apiHistoryEventsExport(data) {
  let params = Object.keys(data).map(key => `${key}=${data[key]}`)
  window.open(`${process.env.VUE_APP_API_BASE}events/history/exports?${params.join('&')}`)
}

/**
 * 降噪记录
 * @param id
 */
export function apiGetOriginals(id, params) {
  return request({
    url: `/events/originals/${id}`,
    params
  })
}

/**
 * 查询事件操作记录
 * @param id
 */
export function apiGetRecords(params) {
  return request({
    url: '/records',
    params
  })
}

/**
 * 添加事件备注
 * @param id
 */
export function apiSaveRecords(eventIds, bz) {
  const data = {
    eventIds,
    bz
  }
  return request({
    url: '/records',
    method: 'post',
    data
  })
}

/**
 * 获取事件标签
 * @param id
 */
export function apiGetTags(eventId) {
  return request({
    url: '/events/tags',
    params: { eventId }
  })
}

/**
 * 保存事件标签
 * @param id
 */
export function apiSaveTags(eventIds, name) {
  return request({
    url: '/events/tags',
    method: 'post',
    data: { eventIds, name }
  })
}

/**
 * 删除事件标签
 * @param id
 */
export function apiDeleteTags(ids) {
  return request({
    url: '/events/tags/' + ids,
    method: 'delete'
  })
}

/**
 * 事件转派
 * @param eventId
 * @param userId
 * @param bz
 * @returns {*|AxiosPromise}
 */
export function apiAssigns(eventId, userIds, bz) {
  return request({
    url: `/events/${eventId}/assigns`,
    method: 'post',
    data: { userIds, bz }
  })
}

/**
 * 生成测试事件
 * @returns {AxiosPromise}
 */
export function apiGenTestEvent() {
  return request({
    url: '/events/test'
  })
}

/**
 * 查询事件故障匹配率
 * @param ids
 */
export function apiGetFailuresRate(ids) {
  return request({
    url: '/failures/rate',
    params: { ids }
  })
}

/**
 * 查询事件的故障匹配列表
 * @param id
 * @returns {AxiosPromise}
 */
export function apiGetFailures(id) {
  return request({
    url: '/failures/by-eid',
    params: { id }
  })
}

/**
 * 查询故障详情
 * @param id
 */
export function apiGetFailuresDetail(id) {
  return request({
    url: `/failures/${id}/detail`
  })
}

/**
 * 根据多个事件id查事件
 * @param ids
 * @returns {Promise<any>}
 */
export function apiGetEventsById(ids) {
  return new Promise((resolve, reject) => {
    _.all(ids.map(id => apiGetEvents({ id }))).then(
      _.spread(function () {
        resolve([...arguments].map(item => item.data.rows[0]))
      })
    )
  })
}

/**
 * 查询今日主事件
 * @param id
 */
export function apiGetMaster(params) {
  return request({
    url: `/events/masterSlave/events`,
    params
  })
}

/**
 * 查询主事件下从事件
 * @param id
 */
export function apiGetSlave(params) {
  return request({
    url: `/events/masterSlave/originals`,
    params
  })
}

/**
 * 获取主从事件列表各级别汇总
 * @param data
 */
export function apiGetMasterLevelTotal(params) {
  return request({
    url: '/events/masterSlave/total',
    params
  })
}
