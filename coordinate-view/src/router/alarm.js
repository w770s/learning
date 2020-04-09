/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    alarm
 * 创建时间:  2019-05-09 on 17:23
 * 描述:     TODO 预警相关
 *
 * @author   ZJB
 */

import Layout from '@/layout'

const alarm = [
  {
    path: '/alarm',
    component: Layout,
    redirect: '/alarm/list',
    meta: {
      title: '预警报警',
      icon: 'dashboard',
      roles: ['warning-manage-view']
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/alarm/alarm.vue'),
        meta: { title: '预警报警', icon: 'tree', roles: ['warning-manage-view'] }
      },
      {
        path: 'manager',
        name: 'manager',
        component: () => import('@/views/alarm/manage.vue'),
        meta: { title: '预警管理', icon: 'tree', roles: ['warning-manage-cyfadmin-view'] }
      }
    ]
  }
]

export default alarm
