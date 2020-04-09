/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    alarm
 * 创建时间:  2019-05-09 on 17:23
 * 描述:     TODO 系统相关
 *
 * @author   ZJB
 */

import Layout from '@/layout'

const system = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/api',
    meta: {
      title: '系统管理',
      icon: 'setting'
    },
    children: [
      {
        path: 'versionUpdate',
        name: 'versionUpdate',
        component: () => import('@/views/system/versionUpdate.vue'),
        meta: { title: '版本更新', icon: 'trash-transport', roles: ['WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'usersManage',
        name: 'usersManage',
        component: () => import('@/views/systemManage/userManage.vue'),
        meta: { title: '用户管理', icon: 'users-manage', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG'] }
      },
      {
        path: 'patrolTime',
        name: 'patrolTime',
        component: () => import('@/views/systemManage/patrolTime.vue'),
        meta: { title: '巡查时间', icon: 'patrol', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'addUser',
        name: 'addUser',
        hidden: true,
        component: () => import('@/views/systemManage/addUser.vue'),
        meta: { title: '用户管理新增', icon: 'tree', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG'] }
      },
      {
        path: 'dangerWaste',
        name: 'dangerWaste',
        hidden: false,
        component: () => import('@/views/systemManage/dangerWaste.vue'),
        meta: { title: '危废名录', icon: 'danger-waste', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'solidWaste',
        name: 'solidWaste',
        hidden: false,
        component: () => import('@/views/systemManage/solidWaste.vue'),
        meta: { title: '一般固废名录', icon: 'danger-waste', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'warning',
        name: 'warning',
        component: () => import('@/views/system/warning.vue'),
        meta: { title: '预警管理', icon: 'warn-setting', roles: ['ADMIN', 'WASTE_JG'] }
      },
      {
        path: 'api',
        name: 'api',
        component: () => import('@/views/system/apiLog.vue'),
        meta: { title: '请求日志', icon: 'logs', roles: ['ADMIN'] }
      },
      {
        path: 'apiDetail/:id(\\d+)',
        name: 'apiDetail',
        component: () => import('@/views/system/apiDetail.vue'),
        hidden: true,
        meta: { title: '请求详情', noCache: true, icon: 'tree', roles: ['ADMIN'] }
      },
      {
        path: 'error',
        name: 'error',
        component: () => import('@/views/system/errorLog.vue'),
        meta: { title: '错误日志', icon: 'logs', roles: ['ADMIN'] }
      },
      {
        path: 'errorDetail',
        name: 'errorDetail',
        component: () => import('@/views/system/errorDetail.vue'),
        hidden: true,
        meta: { title: '错误详情', noCache: true, icon: 'tree', roles: ['ADMIN'] }
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('@/views/system/dictionary.vue'),
        meta: { title: '字典管理', icon: 'dictionary', roles: ['ADMIN'] }
      }
    ]
  }
]

export default system
