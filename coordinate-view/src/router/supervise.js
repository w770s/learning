/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    supervise
 * 创建时间:  2019-05-15 on 15:25
 * 描述:     TODO
 *
 * @author   XLA
 */

import Layout from '@/layout'

const supervise = [
  {
    path: '/supervise',
    component: Layout,
    redirect: '/supervise/index',
    meta: {
      title: '监管部门',
      icon: 'setting',
      roles: ['supervision-view']
    },
    children: [
      // {
      //   path: 'index',
      //   name: 'index',
      //   component: () => import('@/views/supervise/index.vue'),
      //   meta: { title: '监管平台', icon: 'tree' }
      // },
      // {
      //   path: 'detail',
      //   name: 'detail',
      //   component: () => import('@/views/supervise/detail.vue'),
      //   meta: { title: '监管详情', icon: 'tree' }
      //   // hidden: true
      // },
      {
        path: 'enterpriseAdd',
        name: 'enterpriseAdd',
        component: () => import('@/views/supervise/enterpriseAdd.vue'),
        meta: { title: '企业新增', icon: 'tree', roles: ['enterprise-add-view'] }
      }
    ]
  }
]

export default supervise
