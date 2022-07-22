import Layout from '@/components/layout/index/'

export default [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user-list',
    children: [
      {
        path: 'user-list',
        name: 'userList',
        meta: {
          id: 'UserList',
          title: '用户列表',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/user-list')
      },
      {
        path: 'user-manage',
        name: 'userManage',
        meta: {
          title: '用户及用户组管理',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/user-manage')
      },
      {
        path: 'user-invite',
        name: 'userInvite',
        meta: {
          title: '邀请用户',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/user-invite')
      },
      {
        path: 'role',
        name: 'systemRole',
        meta: {
          title: '角色管理',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/role')
      },
      {
        path: 'config',
        name: 'systemConfig',
        meta: {
          title: '系统配置',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "system" */ '@/views/system/config')
      }
    ]
  }
]
