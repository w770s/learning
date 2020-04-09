/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    coordinate
 * 创建时间:  2019-05-09 on 16:50
 * 描述:     TODO
 *
 * @author   ZJB
 */
import Layout from '@/layout'

const coordinate = [
  {
    path: '/statisticAnalysis',
    component: Layout,
    redirect: '/statisticAnalysis/wtfStatistic',
    children: [
      {
        path: 'wtfStatistic',
        name: 'wtfStatistic',
        component: () => import('@/views/statisticAnalysis/wtfStatistic/index.vue'),
        meta: { title: '统计分析', icon: 'waybill_info', roles: ['wtf-tjfx'] }
      },
      {
        path: 'cyfStatistic',
        name: 'cyfStatistic',
        component: () => import('@/views/statisticAnalysis/cyfStatistic/index.vue'),
        meta: { title: '统计分析', icon: 'waybill_info', roles: ['cyf-tjfx'] }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      roles: ['order-view'],
      icon: 'order_manage'
    },
    children: [
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/order/add.vue'),
        meta: { title: '新增订单', icon: 'add', roles: ['order-add-view'] }
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单列表', icon: 'list', roles: ['order-list-view'] }
      }, {
        path: 'detail/:id(\\d+)',
        name: 'detail',
        hidden: true,
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', icon: 'tree' }
      },
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '全部订单', icon: 'tree', roles: ['order-all-view'] }
      },
      {
        path: 'allAndWait',
        name: 'allAndWait',
        component: () => import('@/views/order/allAndWait.vue'),
        meta: { title: '订单管理', icon: 'tree', roles: ['order-cyf-list'] }
      },
      {
        path: 'allAndWaitDetail/:id(\\d+)',
        name: 'allAndWaitDetail',
        hidden: true,
        component: () => import('@/views/order/allAndWaitDetail.vue'),
        meta: { title: '承运方订单详情', icon: 'tree' }
      }
    ]
  },
  {
    path: '/waybill',
    component: Layout,
    redirect: '/waybill/index',
    meta: {
      title: '运单管理',
      icon: 'waybill_manage',
      roles: ['waybill-view']
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/Waybill/waybillList.vue'),
        meta: { title: '我的运单', icon: 'waybill_info', roles: ['waybill-mine-view'] }
      },
      {
        path: 'transmit',
        name: 'transmit',
        component: () => import('@/views/Waybill/transmitBill.vue'),
        meta: { title: '转单', icon: 'waybill_linked', roles: ['order-cyf-list'] }
      },
      {
        path: 'relevant',
        name: 'relevant',
        component: () => import('@/views/Waybill/waybillListRelevant.vue'),
        meta: { title: '关联运单', icon: 'waybill_linked', roles: ['waybill-linked-view'] }
      },
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/Waybill/waybillList.vue'),
        meta: { title: '全部运单', icon: 'tree', roles: ['waybill-all-view'] }
      },
      {
        path: 'detail',
        name: 'waybillDetail',
        hidden: true,
        component: () => import('@/views/Waybill/waybillDetail.vue'),
        meta: { title: '运单详情', icon: 'waybill_info' }
      },
      {
        path: 'gps',
        name: 'waybillGps',
        hidden: true,
        component: () => import('@/views/Waybill/carGps.vue'),
        meta: { title: '货物追踪', icon: 'waybill_info' }
      }
    ]
  },
  {
    path: '/settleAccounts',
    component: Layout,
    meta: {
      title: '结算管理',
      icon: 'settle_account',
      roles: ['settlement-view']
    },
    children: [
      {
        path: 'reconciliation',
        name: 'reconciliation',
        component: () => import('@/views/settleAccount/reconciliation.vue'),
        meta: { title: '对账管理', icon: 'reconciliation', roles: ['reconciliation-manage-view'] }
      },
      {
        path: 'invoice',
        name: 'invoice',
        component: () => import('@/views/settleAccount/invoice.vue'),
        meta: { title: '发票管理', icon: 'invoice', roles: ['invoice-manage-view'] }
      }, {
        path: 'payment',
        name: 'payment',
        component: () => import('@/views/settleAccount/accountsPayable.vue'),
        meta: { title: '账款管理', icon: 'payment', roles: ['payment-manage-view'] }
      }
    ]
  }
]

export default coordinate
