import Layout from '@/components/layout/index/'
// 事件分析
export default [
  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/overview',
    children: [
      {
        path: 'overview',
        name: 'overview',
        meta: {
          title: '事件情况分析',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "analysis" */ '@/views/analysis/overview')
      },
      {
        path: 'response',
        name: 'response',
        meta: {
          title: '用户处理情况分析',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "analysis" */ '@/views/analysis/response')
      },
      {
        path: 'classification-manage',
        name: 'classification-manage',
        meta: {
          title: '分类管理',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "analysis" */ '@/views/analysis/classification-manage')
      },
      {
        path: 'classification-rules',
        name: 'classification-rules',
        meta: {
          title: '分类规则',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "analysis" */ '@/views/analysis/classification-rules')
      },
      {
        path: 'classification-ai',
        name: 'classification-ai',
        meta: {
          title: '分类规则',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "analysis" */ '@/views/analysis/classification-ai')
      },
      {
        path: 'threshold-recommend',
        name: 'ThresholdRecommend',
        meta: {
          title: '阈值推荐',
          isAuth: true
        },
        component: () => import(/* webpackChunkName: "analysis" */ '@/views/analysis/threshold-recommend')
      }
    ]
  }
]
