import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 免账号密码登陆
  const token = to.query.token
  if (typeof token !== 'undefined' && to.path === '/login') {
    // 退出登录
    await store.dispatch('user/logout')
    // 清空访问view
    await store.dispatch('tagsView/delAllVisitedViews')
  }

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.hasPermission
      if (hasRoles) {
        next()
        const hasBaseInfo = await store.dispatch('user/getBaseInfo')
        if (!hasBaseInfo.baseInfo) {
          Message.warning('请先完善基本信息')
          next({ path: '/informationFile/baseDetail' })
          NProgress.done()
          return
        }
        if (!hasBaseInfo.planInfo) {
          Message.warning('请先完善管理计划')
          next({ path: '/informationFile/managePlan' })
          NProgress.done()
          return
        }
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['cyfadmin'] or ,['developer','wtfadmin']
          const { roleCode } = await store.dispatch('user/getInfo')
          const roleCodes = []
          roleCodes.push(roleCode)
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roleCodes)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          await store.dispatch('user/hasPermission')
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
