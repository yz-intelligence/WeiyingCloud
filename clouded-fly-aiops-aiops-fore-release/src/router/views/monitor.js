import Layout from '@/components/layout/index/'
// 监控源管理
export default [
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/access',
    children: [
      {
        path: 'access',
        name: 'access',
        meta: {
          title: '监控源接入',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/access')
      },
      {
        path: 'accessdetail',
        name: 'accessdetail',
        meta: {
          title: '监控源详情',
          isAuth: true,
          notMenu: true
        },
        component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/accessdetail')
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        meta: {
          title: '维护期设置',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "monitor" */ '@/views/monitor/maintenance')
      }
    ]
  }
]
