/** When your routing usingDocument is too long, you can split it into small modules**/
import Layout from '@/layout'

const reconciliationManagement = {
  path: '/reconciliation',
  component: Layout,
  redirect: '/incomeStatistics/incomeStatisticsIndex',
  name: 'reconciliation',
  meta: {
    title: '对账管理',
    icon: 'reconciliation'
  },
  children: [
    {
      path: 'incomeStatisticsIndex',
      component: () => import('@/views/reconciliation/incomeStatistics/index'),
      name: 'incomeStatisticsIndex',
      meta: { title: '财务收入统计',  icon: 'incomeStatisticsIndex' }
    },
    {
      path: 'reconciliationPlatformIndex',
      component: () => import('@/views/reconciliation/reconciliationPlatform/index'),
      name: 'reconciliationPlatformIndex',
      meta: { title: '对账平台', icon: 'reconciliationPlatformIndex'  }
    }
  ]
}

export default reconciliationManagement
