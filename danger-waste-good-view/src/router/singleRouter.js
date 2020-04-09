/**
 * 项目名:    danger-waste-good-view
 * 包名
 * 文件名:    singleRouter
 * 创建时间:  2019-09-17 on 17:57
 * 描述:     TODO
 *
 * @author   XLA
 */

import Layout from '@/layout'

const singleRouter = [
  {
    path: '/inventoryManage',
    component: Layout,
    meta: {
      title: '库存管理',
      icon: 'dashboard',
      roles: ['WASTE_USER_ADMIN', 'WASTE_USER']
    },
    children: [
      {
        path: 'inventoryManage',
        name: 'inventoryManage',
        component: () => import('@/views/singelRouter/inventoryManage.vue'),
        meta: { title: '库存管理', icon: 'inventory-manage' }
      }
    ]
  },
  {
    path: '/electronicParameter',
    component: Layout,
    meta: {
      title: '电子台账',
      icon: 'dashboard',
      roles: ['WASTE_USER_ADMIN', 'WASTE_USER']
    },
    children: [
      {
        path: 'electronicParameter',
        name: 'electronicParameter',
        component: () => import('@/views/singelRouter/electronicParameter.vue'),
        meta: { title: '电子台账', icon: 'electronic-parameter' }
      }
    ]
  },
  {
    path: '/processTrack',
    component: Layout,
    meta: {
      title: '流程追踪',
      icon: 'process-track'
    },
    children: [
      {
        path: 'processTrack',
        name: 'processTrack',
        component: () => import('@/views/singelRouter/processTrack.vue'),
        meta: { title: '流程追踪', icon: 'process-track', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'processTrackDetail',
        name: 'processTrackDetail',
        hidden: true,
        component: () => import('@/views/singelRouter/processTrackDetail.vue'),
        meta: { title: '流程追踪详情', icon: 'tree' }
      },
      {
        path: 'authorityProcessTrack',
        name: 'authorityProcessTrack',
        component: () => import('@/views/singelRouter/authorityProcessTrack.vue'),
        meta: { title: '流程追踪', icon: 'process-track', roles: ['ADMIN', 'WASTE_JG'] }
      }
    ]
  },
  {
    path: '/patrolRecord',
    component: Layout,
    meta: {
      title: '巡查记录',
      icon: 'patrol-record',
      roles: ['WASTE_USER_ADMIN', 'WASTE_USER']
    },
    children: [
      {
        path: 'patrolRecordIndex',
        name: 'patrolRecordIndex',
        component: () => import('@/views/singelRouter/patrolRecord/index.vue'),
        meta: { title: '巡查记录', icon: 'patrol-record' }
      },
      {
        path: 'patrolRecordDetail',
        name: 'patrolRecordDetail',
        hidden: true,
        component: () => import('@/views/singelRouter/patrolRecord/detail.vue'),
        meta: { title: '巡查记录详情', icon: 'tree' }
      }
    ]
  },
  {
    path: '/warnAlarm',
    component: Layout,
    meta: {
      title: '预警报警',
      icon: 'warn-alarm'
    },
    children: [
      {
        path: 'warnAlarm',
        name: 'warnAlarm',
        component: () => import('@/views/singelRouter/warnAlarm.vue'),
        meta: {
          title: '预警报警',
          icon: 'warn-alarm',
          roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN']
        }
      }
    ]
  },
  {
    path: '/statisticalReports',
    component: Layout,
    meta: {
      title: '统计报表',
      icon: 'statistical-reports',
      roles: ['WASTE_JG', 'ADMIN']
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/singelRouter/statisticalReports/index.vue'),
        meta: { title: '统计报表', icon: 'statistical-reports' }
      },
      {
        path: 'detail',
        name: 'detail',
        hidden: true,
        component: () => import('@/views/singelRouter/statisticalReports/detail.vue'),
        meta: { title: '统计报表详情', icon: 'tree' }
      }
    ]
  },
  {
    path: '/rating',
    component: Layout,
    meta: {
      title: '评估打分',
      icon: 'rating', roles: ['ADMIN', 'WASTE_JG']
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/singelRouter/rating/index.vue'),
        meta: { title: '评估打分', icon: 'rating' }
      },
      {
        path: 'detail',
        name: 'detail',
        hidden: true,
        component: () => import('@/views/singelRouter/rating/detail.vue'),
        meta: { title: '评估打分详情', icon: 'tree' }
      }
    ]
  },
  {
    path: '/alarmBlack',
    component: Layout,
    meta: {
      title: '黑名单',
      icon: 'alarm-black', roles: ['ADMIN', 'WASTE_JG']
    },
    children: [
      {
        path: 'alarmBlack',
        name: 'alarmBlack',
        component: () => import('@/views/singelRouter/alarmBlack.vue'),
        meta: { title: '黑名单', icon: 'alarm-black' }
      },
      {
        path: 'alarmPointGather',
        name: 'alarmPointGather',
        hidden: true,
        component: () => import('@/views/singelRouter/alarmPointGather.vue'),
        meta: { title: '报警点位' }
      }
    ]
  }
]

export default singleRouter

