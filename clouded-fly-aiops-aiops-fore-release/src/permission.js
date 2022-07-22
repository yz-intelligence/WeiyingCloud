import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  let getMenuId = data => {
    let id
    for (let item of data) {
      if (to.path === item.url) {
        id = item.id
        break
      }
      if (item.children && item.children.length) {
        id = getMenuId(item.children)
        if (id) break
      }
    }
    return id
  }

  const { isAuth, notMenu } = to.meta

  if (!store.getters.user && to.path === '/login') {
    next()
    return false
  }
  if (to.path === '/perfect-qcloud') {
    next()
    return false
  }
  // 首先判断是否加载用户信息和菜单数据
  // 再根据路由是否需要认证或是home的子路由

  if ((!store.getters.user || !store.getters.menuTree.length) && isAuth) {
    const userInfo = await store.dispatch('user/getUserInfo')
    if (userInfo.success) {
      const menuTree = await store.dispatch('menu/getMenusTree')
      await store.dispatch('dictionary/getDictionary')
      if (getMenuId(menuTree.data) || notMenu) {
        // notMenu === true 说明此路由需要权限，但是不属于后台菜单
        // 判断是否云市场账号
        if (isNeedPerfectInfo()) {
          next('/perfect-qcloud')
          return false
        }
        next()
      } else {
        Message.error({
          showClose: true,
          message: '此账号没有权限登录系统，请联系管理员',
          duration: 3000
        })
        await store.dispatch('user/logout')
        next('/login')
        NProgress.done()
      }
    } else {
      next('/login')
      NProgress.done()
    }
  } else {
    // 已有登录态，手动进入登录页面时，跳转到首页
    if (store.getters.user && to.path === '/login') {
      next('/home/dashboard')
      NProgress.done()
      return false
    }
    // 判断是否云市场账号
    if (isNeedPerfectInfo()) {
      next('/perfect-qcloud')
      return false
    }
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
function isNeedPerfectInfo() {
  const user = store.getters.user
  return user && user.perfectInfo
}
