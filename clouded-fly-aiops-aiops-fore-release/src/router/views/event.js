import Layout from '@/components/layout/index/'
// 事件处理
export default [
  {
    path: '/event',
    component: Layout,
    redirect: '/event/realtime',
    children: [
      {
        path: 'realtime',
        name: 'realtime',
        meta: {
          title: '实时事件',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "event" */ '@/views/event/real-time')
      },
      {
        path: 'record',
        name: 'record',
        meta: {
          title: '事件档案',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "event" */ '@/views/event/record')
      },
      {
        path: 'denoise',
        name: 'denoise',
        meta: {
          title: '事件档案',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "event" */ '@/views/event/denoise')
      }
    ]
  }
]
