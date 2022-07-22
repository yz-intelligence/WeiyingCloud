import { request, requestJson } from '@/utils/request'

/**
 * 获取用户列表
 * @param data
 */
export function getUserList(params) {
  return request({
    url: '/users',
    params
  })
}

/**
 * 获取用户行为
 * @param data
 */
export function getUserAction(params) {
  return request({
    url: '/users/actions',
    params
  })
}

/**
 * 保存用户行为
 * @param data
 * @returns {*|AxiosPromise}
 */
export function saveUserAction(data) {
  return request({
    url: '/users/actions',
    method: 'post',
    data
  })
}

/**
 * 获取用户许可
 * @param sourceId
 * @param sourceType
 */
export function apiGetUserPermissions(sourceId, sourceType) {
  return request({
    url: '/users/permissions',
    params: {
      sourceId: sourceId,
      sourceType: sourceType
    }
  })
}

/**
 * 获取用户组列表
 * @param data
 */
export function apiGetGroups(params) {
  return request({
    url: '/groups',
    params
  })
}

/**
 * 获取用户组树
 * @param data
 */
export function apiGetGroupTree(pid) {
  return request({
    url: '/groups/trees',
    params: {
      pid: pid
    }
  })
}

/**
 * 修改用户信息
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiUpdateUser(data) {
  return request({
    url: '/users/' + data.id,
    method: 'put',
    data
  })
}

// apiGetRoles
/**
 * 查询角色列表
 * @param data
 */
export function apiGetRoles(params) {
  return request({
    url: '/roles',
    params
  })
}

/**
 * 添加用户到用户组或将用户移出用户组
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiEditUser2Group(data) {
  return requestJson({
    url: '/users/moveGroups',
    loading: '移出中...',
    method: 'post',
    data
  })
}

// apiGetUserRoles
/**
 * 获取用户的角色
 * @param id
 */
export function apiGetUserRoles(id, params) {
  return request({
    url: '/users/' + id + '/roles',
    params
  })
}

//apiSaveUserRoles
/**
 * 保存用户角色
 * @param id
 * @param roleIds
 * @returns {*|AxiosPromise}
 */
export function apiSaveUserRoles(id, roleIds) {
  return request({
    url: '/users/' + id + '/roles',
    method: 'post',
    data: { roleIds }
  })
}

/**
 * 删除用户
 * @param id
 */
export function apiDeleteUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}

/**
 * 新增组
 * @param pId
 * @param name
 * @returns {*|AxiosPromise}
 */
export function apiAddGroup(pid, name) {
  return request({
    url: '/groups',
    method: 'post',
    data: {
      pid,
      name
    }
  })
}

/**
 * 修改组
 * @param pId
 * @param name
 * @returns {*|AxiosPromise}
 */
export function apiEditGroup(id, name) {
  return request({
    url: '/groups/' + id,
    method: 'put',
    data: { name }
  })
}

/**
 * 删除组
 * @param id
 * @param name
 */
export function apiDeleteGroup(id) {
  return request({
    url: '/groups/' + id,
    method: 'delete'
  })
}

export function apiGetRolesTotal(params) {
  return request({
    url: '/users/roles/total',
    params
  })
}

/**
 * 新增角色
 * @param data
 */
export function apiCreateRole(data) {
  return requestJson({
    url: '/roles',
    method: 'POST',
    data
  })
}
/**
 * 保存角色
 * @param data
 */
export function apiEditRole(data) {
  return request({
    url: '/roles/' + data.id,
    method: 'PUT',
    data
  })
}

/**
 * 删除角色
 * @param id
 */
export function apiDeleteRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete'
  })
}

/**
 * 角色绑定菜单权限
 * @param roleId
 * @param menuId
 * @returns {*|AxiosPromise}
 */
export function apiAddMenuToRole(roleId, menuId) {
  return request({
    url: '/roles/' + roleId + '/permissions',
    method: 'post',
    params: {
      permissionIds: menuId
    }
  })
}

/**
 * 角色解绑操作权限
 * @param roleId
 * @param menuId
 */
export function apiDelMenuOfRole(roleId, menuId) {
  return request({
    url: '/roles/' + roleId + '/permissions',
    method: 'delete',
    params: {
      permissionIds: menuId
    }
  })
}

/**
 * 角色绑定功能权限
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiAddActionToRole(data) {
  return requestJson({
    url: '/roles/roleAuthorize',
    method: 'POST',
    data
  })
}
/**
 * 角色解除功能权限
 * @param data
 * @returns {*|AxiosPromise}
 */
export function apiDelActionOfRole(data) {
  return requestJson({
    url: '/roles/roleAuthorize',
    method: 'DELETE',
    data
  })
}

/**
 * 获取角色的已选中的菜单权限
 * @param roleId
 */
export function apiGetMenuPermissions(roleId, menuId, type) {
  return request({
    url: '/roles/' + roleId + '/permissions',
    params: {
      sourceId: menuId,
      sourceType: type
    }
  })
}

/**
 * 用户角色解绑
 * @param roleId
 * @param userId
 */
export function apiDelUserOfRole(roleId, userIds) {
  return request({
    url: '/roles/' + roleId + '/users',
    method: 'delete',
    params: { userIds }
  })
}

/**
 * 用户角色绑定
 * @param roleId
 * @param userId
 */
export function apiAddUserToRole(roleId, userIds) {
  return request({
    url: '/roles/' + roleId + '/users',
    method: 'post',
    data: { userIds }
  })
}

/**
 * 用户下拉选择搜索
 * @param data
 */
export function apiSelectUser(params) {
  return request({
    url: '/users/select-options',
    params
  })
}

/**
 * 修改密码
 * @param data
 * @returns {AxiosPromise}
 */
export function apiModifyPassword(data) {
  return request({
    url: '/users/password',
    method: 'put',
    params: {
      password: window.btoa(data.password),
      newPassword: window.btoa(data.newPassword)
    }
  })
}

/**
 * 关联用户组操作
 */
export function apiUpdateRoleUsers(data) {
  return requestJson({
    url: '/users/modifyRoleUsers',
    method: 'post',
    data
  })
}

/**
 * 发送验证码操作
 */
export function apiSendMailVerifyCode(data) {
  return requestJson({
    url: '/users/sendMailVerifyCode',
    method: 'post',
    data
  })
}

/**
 * 验证邮箱身份操作
 */
export function apiVerifyCode(data) {
  return requestJson({
    url: '/users/verifyIdentidy',
    method: 'post',
    data
  })
}

/**
 * 验证新邮箱操作
 */
export function apiReviseEmail(data) {
  return requestJson({
    url: '/users/reviseEmail',
    method: 'post',
    data
  })
}

/**
 * 获取用户/角色功能权限
 */
export function apiGetPermission(params) {
  return request({
    url: '/permissions/getPermissionByCondition',
    method: 'get',
    params
  })
}

/**
 * 获取功能权限列表
 */
export function apiGetPermissionList(params) {
  return request({
    url: '/permissions/getPermissionByMenuId',
    method: 'get',
    params
  })
}
