/**
 * 项目名:    danger-waste-good-view
 * 包名
 * 文件名:    declareRegister
 * 创建时间:  2019-09-17 on 17:20
 * 描述:     TODO
 *
 * @author   XLA
 */

import Layout from '@/layout'

const declareRegister = [
  {
    path: '/declareRegister',
    component: Layout,
    meta: {
      title: '申报登记',
      icon: 'record',
      roles: ['WASTE_USER_ADMIN', 'WASTE_USER', 'WASTE_JG', 'ADMIN']
    },
    children: [
      {
        path: 'trashProduce',
        name: 'trashProduce',
        component: () => import('@/views/declareRegister/trashProduce.vue'),
        meta: { title: '废物产生', icon: 'produce' }
      },
      {
        path: 'selfDispose',
        name: 'selfDispose',
        component: () => import('@/views/declareRegister/selfDispose.vue'),
        meta: { title: '自行处置利用', icon: 'self-dispose' }
      },
      {
        path: 'trashTransport',
        name: 'trashTransport',
        component: () => import('@/views/declareRegister/trashTransport.vue'),
        meta: { title: '废物转移', icon: 'trash-transport' }
      },
      {
        path: 'pipeline',
        name: 'pipeline',
        component: () => import('@/views/declareRegister/pipeline.vue'),
        meta: { title: '管道转移', icon: 'pipeline' }
      },
      {
        path: 'rawProduce',
        name: 'rawProduce',
        component: () => import('@/views/declareRegister/rawProduce.vue'),
        meta: { title: '原料产品', icon: 'raw-produce' }
      },
      {
        path: 'wasteStorageTank',
        name: 'wasteStorageTank',
        component: () => import('@/views/declareRegister/wasteStorageTank.vue'),
        meta: { title: '储罐危废', icon: 'savings' }
      }
    ]
  }
]

export default declareRegister
