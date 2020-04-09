/**
 * 项目名:    danger-waste-good-view
 * 包名
 * 文件名:    informationFile
 * 创建时间:  2019-09-16 on 16:53
 * 描述:     TODO
 *
 * @author   XLA
 */

import Layout from '@/layout'

const informationFile = [
  {
    path: '/informationFile',
    component: Layout,
    meta: {
      title: '信息档案',
      icon: 'info-doc'
    },
    children: [
      {
        path: 'baseDetail',
        name: 'baseDetail',
        component: () => import('@/views/informationFile/baseInfo/index.vue'),
        meta: { title: '基本信息', icon: 'base-info', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'managePlan',
        name: 'managePlan',
        component: () => import('@/views/informationFile/managePlan/index.vue'),
        meta: { title: '管理计划', icon: 'manager-plan', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'newManagePlan',
        name: 'newManagePlan',
        hidden: true,
        component: () => import('@/views/informationFile/managePlan/newManagePlan.vue'),
        meta: { title: '管理计划', icon: 'tree', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'authorityArchivesIndex',
        name: 'authorityArchivesIndex',
        component: () => import('@/views/informationFile/authorityArchives/index.vue'),
        meta: { title: '信息档案', icon: 'info-doc', roles: ['ADMIN', 'WASTE_JG'] }
      },
      {
        path: 'detailCombination',
        name: 'detailCombination',
        hidden: true,
        component: () => import('@/views/informationFile/authorityArchives/detailCombination.vue'),
        meta: { title: '信息档案列表', icon: 'tree', roles: ['ADMIN', 'WASTE_JG'] }
      },
      {
        path: 'thirdpartyManage',
        name: 'thirdpartyManage',
        component: () => import('@/views/informationFile/thirdpartyManage/index.vue'),
        meta: { title: '第三方管理', icon: 'info-third', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'thirdpartyManageDetail',
        name: 'thirdpartyManageDetail',
        hidden: true,
        component: () => import('@/views/informationFile/thirdpartyManage/detail.vue'),
        meta: { title: '第三方管理', icon: 'tree', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'environmentAppraise',
        name: 'environmentAppraise',
        component: () => import('@/views/informationFile/environmentAppraise/index.vue'),
        meta: { title: '环评信息', icon: 'info-env', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'environmentAppraiseDetail',
        name: 'environmentAppraiseDetail',
        hidden: true,
        component: () => import('@/views/informationFile/environmentAppraise/detail.vue'),
        meta: { title: '环评信息', icon: 'info-env', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'trashManage',
        name: 'trashManage',
        component: () => import('@/views/informationFile/trashManage/index.vue'),
        meta: { title: '产废管理', icon: 'info-waste-manage', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'newTrashManage',
        name: 'newTrashManage',
        hidden: true,
        component: () => import('@/views/informationFile/trashManage/newTrashManage.vue'),
        meta: { title: '产废管理', icon: 'tree', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'storageSites',
        name: 'storageSites',
        component: () => import('@/views/informationFile/storageSites/index.vue'),
        meta: { title: '贮存点信息', icon: 'info-storage', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'newStorageSites',
        name: 'newStorageSites',
        hidden: true,
        component: () => import('@/views/informationFile/storageSites/newStorageSites.vue'),
        meta: { title: '贮存点信息', icon: 'tree', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'carManage',
        name: 'carManage',
        component: () => import('@/views/informationFile/carManage/index.vue'),
        meta: { title: '车辆管理', icon: 'info-car', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'carManageDetail',
        name: 'carManageDetail',
        hidden: true,
        component: () => import('@/views/informationFile/carManage/detail.vue'),
        meta: { title: '车辆管理', icon: 'tree', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'staffManage',
        name: 'staffManage',
        component: () => import('@/views/informationFile/staffManage/index.vue'),
        meta: { title: '人员管理', icon: 'info-people', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'staffManageDetail',
        name: 'staffManageDetail',
        hidden: true,
        component: () => import('@/views/informationFile/staffManage/detail.vue'),
        meta: { title: '人员管理', icon: 'tree', roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN'] }
      },
      {
        path: 'disposalManage',
        name: 'disposalManage',
        component: () => import('@/views/informationFile/disposalManage/index.vue'),
        meta: { title: '委托处置管理', icon: 'product_manage', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      },
      {
        path: 'disposalManageDetail',
        name: 'disposalManageDetail',
        hidden: true,
        component: () => import('@/views/informationFile/disposalManage/detail.vue'),
        meta: { title: '委托处置管理', icon: 'product_manage', roles: ['WASTE_USER_ADMIN', 'WASTE_USER'] }
      }
    ]
  }
]

export default informationFile
