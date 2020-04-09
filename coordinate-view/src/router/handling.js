/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    handling
 * 创建时间:  2019-05-15 on 15:37
 * 描述:     TODO
 *
 * @author   XLA
 */
import Layout from '@/layout'

const handling = [
  {
    path: '/handling',
    component: Layout,
    redirect: '/handling/list',
    meta: {
      title: '生产企业',
      icon: 'tree',
      roles: ['handing-manage-view']
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/handling/list.vue'),
        meta: { title: '装卸管理', icon: 'setting', roles: ['handing-manage-view'] }
      },
      {
        path: 'submit/:id(\\d+)',
        name: 'submit',
        hidden: true,
        component: () => import('@/views/handling/submit.vue'),
        meta: { title: '维护' }
      }
    ]
  }
]

export default handling
