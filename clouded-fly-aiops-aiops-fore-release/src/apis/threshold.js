import { requestJson } from '@/utils/request'
// 阈值推荐相关接口

// 获取今天阈值推荐
export function apiGetTodayThresholdRecommen(params) {
  return requestJson({
    url: '/threshold/getTodayThresholdRecommend',
    params
  })
}
