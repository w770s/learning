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
      icon: 'setting',
      roles: ['system-manage-view']
    },
    children: [
      {
        path: 'api',
        name: 'api',
        component: () => import('@/views/system/apiLog.vue'),
        meta: { title: '请求日志', icon: 'tree', roles: ['request-log-view'] }
      },
      {
        path: 'apiDetail/:id(\\d+)',
        name: 'apiDetail',
        component: () => import('@/views/system/apiDetail.vue'),
        hidden: true,
        meta: { title: '请求详情', noCache: true, icon: 'tree' }
      },
      {
        path: 'error',
        name: 'error',
        component: () => import('@/views/system/errorLog.vue'),
        meta: { title: '错误日志', icon: 'tree', roles: ['error-log-view'] }
      },
      {
        path: 'errorDetail',
        name: 'errorDetail',
        component: () => import('@/views/system/errorDetail.vue'),
        hidden: true,
        meta: { title: '错误详情', noCache: true, icon: 'tree' }
      },
      {
        path: 'generate',
        name: 'generate',
        component: () => import('@/views/system/generate.vue'),
        meta: { title: '代码生成', icon: 'tree', roles: ['generate-code-view'] }
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('@/views/system/dictionary.vue'),
        meta: { title: '字典管理', icon: 'tree', roles: ['dictionary-view'] }
      },
      {
        path: 'park',
        name: 'park',
        component: () => import('@/views/system/park.vue'),
        meta: { title: '停车记录', noCache: true, icon: 'tree', roles: ['park-record-view'] }
      },
      {
        path: 'gateWhite',
        name: 'gateWhite',
        component: () => import('@/views/system/gateWhite.vue'),
        meta: { title: '白名单记录', noCache: true, icon: 'tree', roles: ['gate-white-record-view'] }
      },
      {
        path: 'gpsOperator',
        name: 'gpsOperator',
        component: () => import('@/views/system/gpsOperator.vue'),
        meta: { title: 'GPS运营商', noCache: true, icon: 'tree', roles: ['error-log-view'] }
      },
      {
        path: 'carList',
        name: 'carList',
        component: () => import('@/views/system/carList.vue'),
        meta: { title: '接入车辆', noCache: true, icon: 'tree', roles: ['error-log-view'] }
      }
    ]
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: Layout,
    // meta: { title: '车辆监控', noCache: true, icon: 'tree' },
    children: [
      {
        path: 'carMonitor',
        name: 'carMonitor',
        component: () => import('@/views/system/carMonitor.vue'),
        meta: { title: '车辆监控', icon: 'tree', roles: ['car-monitor-view'] }
      }]
  }
]

export default system
