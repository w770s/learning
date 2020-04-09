import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// 协同 运单，订单，结算
import coordinate from './coordinate'
// 通行证
import pass from './pass'
// 通行证
import compliance from './compliance'
// 预警报警
import alarm from './alarm'
// 系统模块
import system from './system'

import supervise from './supervise'

import handling from './handling'

// 免登陆路由
import out from './out'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['cyfadmin','wtfadmin']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 基础路由
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  ...out
]

/**
 *动态路由
 */
const error = [{ path: '*', redirect: '/404', hidden: true }]
export const asyncRoutes = [
  ...coordinate,
  ...supervise,
  ...handling,
  ...pass,
  ...compliance,
  ...alarm,
  ...system,
  ...error
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
