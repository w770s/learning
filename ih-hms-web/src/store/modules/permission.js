import { asyncRoutes, constantRoutes } from '@/router'
import AsyncImport from "../../router/AsyncImport.js";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 把后台返回菜单组装成routes要求的格式
 * @param {*} routes
 */

export function generaMenu(routes, data) {
  data.forEach(item => {
    const menu = {
      path: item.path,
      name: item.path,
      children: [],
      // component: item.url === '#' ? Layout : () => import(`@${item.component}`),
      component: AsyncImport(item.component),
      hidden: (item.hidden===0||!item.check) ? true : false,
      // hidden: item.check ? true : false,
      meta:filterMeta(item.meta)
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}
export function filterMeta(meta) {
  if(meta.noCache){
    meta.noCache = false
  }
  return meta
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const CryptoJS = require('crypto-js');

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      let loadMenuData = []
      let accessedRoutes
      // let getRoutes = secret.Decrypt(localStorage.getItem('route'))

      // start
      let routeData = localStorage.getItem('route')
      let bytes  = CryptoJS.AES.decrypt(routeData, 'secret key AiHui');
      let getRoutes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // end


      // let getRoutes = JSON.parse(localStorage.getItem('route'))
      
      // start
      Object.assign(loadMenuData, getRoutes)
      // end
      let tempAsyncRoutes = Object.assign([], asyncRoutes)
      generaMenu(tempAsyncRoutes, loadMenuData)
      accessedRoutes = tempAsyncRoutes || []
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

// const actions = { // 正常权限角色
//   generateRoutes({ commit }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes = asyncRoutes || []
//       // if (roles.includes('admin')) {
//       //   accessedRoutes = asyncRoutes || []
//       // } else {
//       //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//       // }
//       commit('SET_ROUTES', accessedRoutes)
//       debugger
//       resolve(accessedRoutes)
//     })
//   }
// }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
