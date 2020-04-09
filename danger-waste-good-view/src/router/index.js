import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 系统模块
import system from './system'

// 信息档案
import informationFile from './informationFile'

// 申报登记
import declareRegister from './declareRegister'

// 单路由
import singleRouter from './singleRouter'

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
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

/**
 *动态路由
 */
const error = [{ path: '*', redirect: '/404', hidden: true }]
export const asyncRoutes = [
  ...informationFile,
  ...declareRegister,
  ...singleRouter,
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
