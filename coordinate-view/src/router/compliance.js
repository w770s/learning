/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    compliance
 * 创建时间:  2019-05-09 on 17:17
 * 描述:     TODO 合规相关
 *
 * @author   ZJB
 */

import Layout from '@/layout'

const compliance = [
  {
    path: '/compliance',
    component: Layout,
    redirect: '/compliance/productData',
    meta: {
      title: '化学品数据',
      icon: 'dashboard',
      roles: ['chemical-database-view']
    },
    children: [
      {
        path: 'productData',
        name: 'productData',
        component: () => import('@/views/compliance/productData.vue'),
        meta: { title: '化学品数据库', icon: 'product_data', roles: ['chemical-database-view'] }
      },
      {
        path: 'productInfo',
        name: 'productInfo',
        hidden: true,
        component: () => import('@/views/compliance/productInfo.vue'),
        meta: { title: '化学品详情', icon: 'tree' }
      }
    ]
  },
  {
    path: '/whpRecord',
    component: Layout,
    redirect: '/whpRecord/whpRecord',
    meta: {
      title: '危化品登记',
      icon: 'record',
      roles: ['whf-record-view']
    },
    children: [
      {
        path: 'whpRecord',
        name: 'whpRecord',
        component: () => import('@/views/compliance/whpRecord/whpRecord.vue'),
        meta: { title: '危化品登记', icon: 'record', roles: ['whf-record-view'] }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    meta: {
      title: '产品管理',
      icon: 'product_manage',
      roles: ['product-manage-view']
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/compliance/productManager.vue'),
        meta: { title: '我的产品', icon: 'product_manage', roles: ['mine-product-view'] }
      }
    ]
  }
]

export default compliance
