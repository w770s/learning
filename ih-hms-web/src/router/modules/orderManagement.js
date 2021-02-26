/** When your routing usingDocument is too long, you can split it into small modules**/

import Layout from '@/layout'

const orderManagementRouter = {
  path: '/orderManagement',
  component: Layout,
  redirect: '/orderManagement/registerManagement',
  name: 'orderManagement',
  meta: {
    title: '订单管理',
    icon: 'orderManagement'
  },
  children: [
    {
      path: 'registerManagement',
      component: () => import('@/views/orderManagement/registerManagement/index'),
      name: 'registerManagement',
      meta: { title: '预约挂号管理',icon: 'registerManagement'}
    },
    {
      path: 'registerDetails',
      component: () => import('@/views/orderManagement/registerManagement/details'),
      name: 'registerDetails',
      meta: { title: '挂号详情', noCache: true},
      hidden: true
    },
    {
      path: 'consultationManagement',
      component: () => import('@/views/orderManagement/consultationManagement/index'),
      name: 'consultationManagement',
      meta: { title: '问诊订单管理',icon: 'consultationManagement'}
    },
    {
      path: 'consultationDetails',
      component: () => import('@/views/orderManagement/consultationManagement/details'),
      name: 'consultationDetails',
      meta: { title: '订单详情',noCache: true},
      hidden: true
    },
    {
      path: 'prescriptionManagement',
      component: () => import('@/views/orderManagement/prescriptionManagement/index'),
      name: 'prescriptionManagement',
      meta: { title: '处方管理',icon: 'prescriptionManagement'}
    },
    {
      path: 'prescriptionDetails',
      component: () => import('@/views/orderManagement/prescriptionManagement/details'),
      name: 'prescriptionDetails',
      meta: { title: '处方详情',noCache: true},
      hidden: true
    },
    {
      path: 'inspectionManagement',
      component: () => import('@/views/orderManagement/inspectionManagement/index'),
      name: 'inspectionManagement',
      meta: { title: '检查检验订单管理',icon: 'inspectionManagement'}
    },
    {
      path: 'inspectionDetails',
      component: () => import('@/views/orderManagement/inspectionManagement/details'),
      name: 'inspectionDetails',
      meta: { title: '检查检验订单详情',noCache: true},
      hidden: true
    },
    {
      path: 'outpatientOrder',
      component: () => import('@/views/orderManagement/outpatientOrder/index'),
      name: 'outpatientOrder',
      meta: { title: '门诊缴费订单',icon: 'outpatientOrder'}
    },
    {
      path: 'outpatientDetails',
      component: () => import('@/views/orderManagement/outpatientOrder/details'),
      name: 'outpatientDetails',
      meta: { title: '缴费订单详情',noCache: true},
      hidden: true
    },
    {
      path: 'hospitalOrder',
      component: () => import('@/views/orderManagement/hospitalOrder/index'),
      name: 'hospitalOrder',
      meta: { title: '住院押金缴费订单',icon: 'hospitalOrder'}
    },
    {
      path: 'hospitalDetails',
      component: () => import('@/views/orderManagement/hospitalOrder/details'),
      name: 'consultationDetails',
      meta: { title: '住院订单详情',noCache: true},
      hidden: true
    },
    {
      path: 'dataStatistics',
      component: () => import('@/views/orderManagement/dataStatistics/index'),
      name: 'dataStatistics',
      meta: { title: '数据统计',icon: 'dataStatistics'}
    }
  ]
}

export default orderManagementRouter
