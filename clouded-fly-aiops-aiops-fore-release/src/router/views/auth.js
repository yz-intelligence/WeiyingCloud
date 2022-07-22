export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth'),
    meta: {
      title: '登录页',
      keepAlive: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth'),
    meta: {
      title: '注册页',
      keepAlive: true
    }
  },
  {
    path: '/preorder',
    name: 'PreOrder',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth'),
    meta: {
      title: '预约页',
      keepAlive: true
    }
  },
  {
    path: '/qcloud/auth',
    name: 'QCloudAuth',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/qcloud'),
    meta: {
      title: '千帆免登录'
    }
  },
  {
    path: '/perfect-qcloud',
    name: 'QCloudPerfect',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth'),
    meta: {
      title: '千帆完善信息',
      keepAlive: true
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth'),
    meta: {
      title: '忘记密码',
      keepAlive: true
    }
  },
  {
    path: '/reset-password/:token',
    name: 'PasswordReset',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth'),
    meta: {
      title: '重置密码',
      keepAlive: true
    }
  },
  {
    path: '/invite-user/:token',
    name: 'UserInvite',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth'),
    meta: {
      title: '完善信息',
      keepAlive: true
    }
  },
  {
    path: '/email-verify/:verifyId',
    name: 'EmailVerify',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/email-verify'),
    meta: {
      title: '邮箱校验',
      keepAlive: true
    }
  }
]
