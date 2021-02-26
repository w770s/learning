/** When your routing usingDocument is too long, you can split it into small modules**/
import Layout from '@/layout'

const bookManagement = {
  path: '/bookManagement',
  component: Layout,
  redirect: '/bookManagement/index',
  name: 'bookManagement',
  meta: {
    title: '预约管理',
    icon: 'saleBookingManage'
  },
  children: [
    {
      path: 'booHitIndex',
      component: () => import('@/views/bookManagement/bookHint/index'),
      name: 'booHitIndex',
      meta: { title: '预约提示', icon: 'bookHit' }
    },
    {
      path: 'booHitDetail',
      component: () => import('@/views/bookManagement/bookHint/detail'),
      name: 'booHitDetail',
      meta: { title: '预约提示设置', noCache: true },
      hidden: true
    },
    {
      path: 'sourceAvailable',
      component: () => import('@/views/bookManagement/sourceAvailable'),
      name: 'sourceAvailable',
      meta: { title: '可预约号源', icon: 'realase' }
    },
    {
      path: 'bookRecord',
      component: () => import('@/views/bookManagement/bookRecord'),
      name: 'bookRecord',
      meta: { title: '预约记录', icon: 'bookLog' }
    },
    {
      path: 'blackList',
      component: () => import('@/views/bookManagement/blackList'),
      name: 'blackList',
      meta: { title: '黑名单', icon: 'balckList' }
    }
  ]
}

export default bookManagement
