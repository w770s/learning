/** When your routing usingDocument is too long, you can split it into small modules**/

import Layout from '@/layout'

const medicalManagementRouter = {
  path: '/medicalManagement',
  component: Layout,
  redirect: '/medicalManagement/dataMaintain',
  name: 'medicalManagement',
  meta: {
    title: '医护管理',
    icon: 'medicalManage'
  },
  children: [
    {
      path: 'dataMaintain',
      component: () => import('@/views/medicalManagement/dataMaintain/index'),
      name: 'dataMaintain',
      meta: { title: '基本资料维护',icon: 'fileMaintence'}
    },
    {
      path: 'doctorDetails',
      component: () => import('@/views/medicalManagement/dataMaintain/doctorDetails'),
      name: 'doctorDetails',
      meta: { title: '医生详情', noCache: true},
      hidden: true
    },
    {
      path: 'setConsult',
      component: () => import('@/views/medicalManagement/setConsult/index'),
      name: 'setConsult',
      meta: { title: '咨询设置',icon: 'consultingSet'}
    },
    {
      path: 'addConsult',
      component: () => import('@/views/medicalManagement/setConsult/addConsult'),
      name: 'addConsult',
      meta: { title: '增改咨询',noCache: true},
      hidden: true
    },
    {
      path: 'consultScheduling',
      component: () => import('@/views/medicalManagement/consultScheduling/index'),
      name: 'consultScheduling',
      meta: { title: '线上咨询排班', icon: 'rankWork'}
    },
    {
      path: 'consultRecordIndex',
      component: () => import('@/views/medicalManagement/consultRecord/index'),
      name: 'consultRecordIndex',
      meta: { title: '咨询记录', icon: 'consultingList'}
    },
    {
      path: 'consultRecordDetail',
      component: () => import('@/views/medicalManagement/consultRecord/consultDetail'),
      name: 'consultRecordDetail',
      meta: { title: '咨询详情',noCache: true},
      hidden: true
    },
  ]
}

export default medicalManagementRouter
