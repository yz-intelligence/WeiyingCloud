import { request } from '@/utils/request'

export function apiLogin(data) {
  data.password = window.btoa(data.password)
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function apiLogout() {
  return request({
    url: '/login',
    method: 'delete'
  })
}

/**
 * 完善千帆信息
 * @param {Object}} data 信息
 */
export function apiPerfectInfo(data) {
  return request({
    url: '/login/perfectInfo',
    method: 'post',
    data
  })
}

export function apiDoRegister(data) {
  data.password = window.btoa(data.password)
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function apiCheckEmail(email) {
  return request({
    url: '/register/exist',
    params: { email }
  })
}

export function apiVerifyEmail(verifyId) {
  return request({
    url: `/register/verify-email/${verifyId}`
  })
}

/**
 * 获取用户信息
 */
export function apiGetInfo(loading = '数据加载中...') {
  return request({
    url: '/login/info',
    loading
  })
}

/**
 * 邀请用户
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiInvitedUsers(data) {
  return request({
    url: '/register/invite-user',
    method: 'post',
    data
  })
}

/**
 * 激活邀请用户（完善用户信息）
 * @param token
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiActiveInvitedUser(token, data) {
  const _data = { ...data }
  _data.password = window.btoa(data.password)
  return request({
    url: `/register/invite-user/${token}`,
    method: 'post',
    data: _data
  })
}

/**
 * 忘记密码发送邮件
 * @param email
 * @returns {AxiosPromise}
 */
export function apiSendForgetPassword(data) {
  return request({
    url: '/register/forget-password',
    method: 'post',
    data
  })
}

/**
 * 重置密码
 * @param token
 * @param password
 * @returns {AxiosPromise}
 */
export function apiResetPassword(token, password) {
  return request({
    url: `/register/reset-password/${token}`,
    method: 'post',
    data: {
      password: window.btoa(password)
    }
  })
}

export function apiSubmitBooking(data) {
  return request({
    url: '/portal/portalBooking',
    method: 'post',
    data
  })
}
