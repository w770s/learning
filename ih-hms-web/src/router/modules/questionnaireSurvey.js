/** When your routing usingDocument is too long, you can split it into small modules**/
import Layout from '@/layout'

const questionnaireSurvey = {
  path: '/questionnaire',
  component: Layout,
  redirect: '/questionnaireSet/questionnaireSetIndex',
  name: 'questionnaire',
  meta: {
    title: '问卷',
    icon: 'questionnaire'
  },
  children: [
    {
      path: 'questionnaireSetIndex',
      component: () => import('@/views/questionnaire/questionnaireSet/index'),
      name: 'questionnaireSetIndex',
      meta: { title: '问卷设置',  icon: 'questionnaireSet' }
    },
    {
      path: 'questionnaireSetDetail',
      component: () => import('@/views/questionnaire/questionnaireSet/detail'),
      name: 'questionnaireSetDetail',
      meta: { title: '增改问卷', noCache: true, keepAlive:false },
      hidden: true
    },
    {
      path: 'questionnaireDataIndex',
      component: () => import('@/views/questionnaire/questionnaireData/index'),
      name: 'questionnaireDataIndex',
      meta: { title: '问卷数据', icon: 'questionnaireData'  }
    },
    {
      path: 'questionnaireDataDetail',
      component: () => import('@/views/questionnaire/questionnaireData/detail'),
      name: 'questionnaireDataDetail',
      meta: { title: '问卷数据详情', noCache: true },
      hidden: true
    },
    {
      path: 'questionnaireStatisticsIndex',
      component: () => import('@/views/questionnaire/questionnaireStatistics/index'),
      name: 'questionnaireStatisticsIndex',
      meta: { title: '问卷统计', icon: 'questionnaireStatistics' }
    },
    {
      path: 'questionnaireStatisticsDetail',
      component: () => import('@/views/questionnaire/questionnaireStatistics/detail'),
      name: 'questionnaireStatisticsDetail',
      meta: { title: '问卷统计详情', noCache: true },
      hidden: true
    },
  ]
}

export default questionnaireSurvey
