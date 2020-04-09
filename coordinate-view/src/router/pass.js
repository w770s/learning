/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    pass
 * 创建时间:  2019-05-09 on 16:50
 * 描述:     TODO 通行证
 *
 * @author   ZJB
 */
import Layout from '@/layout'

const pass = [
  {
    path: '/pass',
    component: Layout,
    redirect: '/pass/list',
    meta: {
      title: '通行证',
      icon: 'dashboard',
      roles: ['pass-list-view']
    },
    children: [
      {
        path: 'list',
        name: 'passList',
        component: () => import('@/views/pass/passList.vue'),
        meta: { title: '通行证列表', icon: 'tree', roles: ['pass-list-view'] }
      },
      {
        path: 'add',
        name: 'passAdd',
        hidden: true,
        component: () => import('@/views/pass/passAdd.vue'),
        meta: { title: '新增通行证', icon: 'tree' }
      },
      {
        path: 'detail/:id(\\d+)',
        name: 'passDetail',
        hidden: true,
        component: () => import('@/views/pass/passDetail.vue'),
        meta: { title: '通行证详情', icon: 'tree' }
      },
      {
        path: 'update/:id(\\d+)',
        name: 'passUpdate',
        hidden: true,
        component: () => import('@/views/pass/passModified.vue'),
        meta: { title: '通行证修改', icon: 'tree' }
      }
    ]
  }
]

export default pass
