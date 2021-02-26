/** When your routing usingDocument is too long, you can split it into small modules**/
import Layout from '@/layout'

const userManagement = {
  path: '/userManagement',
  component: Layout,
  redirect: '/userPage/userManagementIndex',
  name: 'userManagement',
  meta: {
    title: '用户管理',
    icon: 'userManagement'
  },
  children: [
    {
      path: 'userManagementIndex',
      component: () => import('@/views/userManagement/userPage/index'),
      name: 'userManagementIndex',
      meta: { title: '用户管理',  icon: 'userManagementIndex' }
    }
  ]
}

export default userManagement
