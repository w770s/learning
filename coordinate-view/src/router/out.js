/**
 * 项目名:    coordinate-view
 * 包名
 * 文件名:    out
 * 创建时间:  2019-05-09 on 17:23
 * 描述:     TODO 免登录路由
 *
 * @author   ZJB
 */

const out = [
  {
    path: '/reservation',
    component: () => import('@/views/out/Reservation'),
    hidden: true
  },
  {
    path: '/productDataNoLogin',
    component: () => import('@/views/compliance/productDataNoLogin'),
    hidden: true
  },
  {
    path: '/productInfo',
    component: () => import('@/views/compliance/productInfoNoLogin'),
    hidden: true
  },
  {
    path: '/waybillDetail',
    component: () => import('@/views/Waybill/waybillDetailOut.vue'),
    hidden: true
  },
  {
    path: '/error',
    component: () => import('@/views/system/errorDetail'),
    hidden: true
  }
]

export default out
