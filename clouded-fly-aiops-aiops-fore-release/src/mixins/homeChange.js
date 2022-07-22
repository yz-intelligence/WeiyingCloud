import { menuTree2Array } from '../utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      menuPaths: []
    }
  },
  computed: {
    ...mapGetters(['user', 'menuTree'])
  },
  methods: {
    /**
    路由跳转的方法，
    主要为了防止直接url跳转
    * @params:
      path:路由地址
      val:参数
    */
    routerChange(path, ...val) {
      if (this.menuPaths.length === 0) {
        // 如果跳转路径不在菜单中，禁止跳转，并弹窗提示
        this.menuPaths = menuTree2Array(this.menuTree).map(item => item.url)
      }
      if (!this.menuPaths.includes(path)) {
        this.$Message.error('您无访问权限，请联系系统管理员')
        return false
      }
      if (val.length) {
        this.$router.push({ path, query: { key: val[0], value: val[1], showSearch: 1, level: val[3] } })
        return
      }
      this.$router.push({ path })
    }
  }
}
