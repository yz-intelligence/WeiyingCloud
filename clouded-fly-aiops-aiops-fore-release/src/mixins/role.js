export default {
  data() {
    return {
      defaultRoles: ['CompanyAdmin', 'CompanyEmployee', 'Person'] // 系统默认角色：企业管理员，企业员工，个人
    }
  },
  methods: {
    /**
     * 判断是否是管理员
     * @param roles
     * @private
     */
    isAdmin(roles) {
      // return roles.includes('CompanyAdmin')
      return true
    }
  }
}
