import Layout from '@/components/layout/index/'
// 事件订阅
export default [
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/rules',
    children: [
      {
        path: 'rules',
        name: 'rules',
        meta: {
          title: '事件订阅策略',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "notice" */ '@/views/notice/rules')
      },
      {
        path: 'template',
        name: 'noticeTemplate',
        meta: {
          title: '消息模板',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "notice" */ '@/views/notice/template')
      },
      {
        path: 'history',
        name: 'history',
        meta: {
          title: '事件通知记录',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "notice" */ '@/views/notice/history')
      },
      {
        path: 'upgrade',
        name: 'upgrade',
        meta: {
          title: '事件升级规则',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "notice" */ '@/views/notice/upgrade')
      }
    ]
  }
]
