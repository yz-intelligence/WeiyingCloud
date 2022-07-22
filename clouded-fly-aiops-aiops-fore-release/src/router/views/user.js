import Layout from '@/components/layout/index/'

export default [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/mine',
    children: [
      {
        path: 'mine',
        name: 'mine',
        meta: {
          title: '个人信息',
          isAuth: true,
          notMenu: true
        },
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/mine')
      }
    ]
  }
]
