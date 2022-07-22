import Layout from '@/components/layout/index/'

export default [
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
      keepAlive: true,
      isAuth: false
    }
  },
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
      keepAlive: true,
      isAuth: false
    }
  },
  {
    path: '/500',
    component: () => import(/* webpackChunkName: "page" */ '@/components/error-page/500'),
    name: '500',
    meta: {
      keepAlive: true,
      isAuth: false
    }
  },
  // 首页
  {
    path: '/',
    name: 'home',
    redirect: '/home/dashboard'
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          id: 'Dashboard',
          title: '控制台',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "page" */ '@/views/home/index')
      }
    ]
  },
  {
    path: '*',
    redirect: '/404'
  }
]
