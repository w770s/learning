import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// lodash 函数库
import _ from 'lodash'
Vue.prototype._ = _
// 时间格式化
import moment from 'moment'
Vue.prototype.$moment = moment
// 有效时间
Vue.prototype.$validTime = function(t) {
  return t ? moment(t).format('YYYY-MM-DD') : ''
}
import permission from './directive/permission/index.js' // 权限判断指令
Vue.use(permission)

import '@/icons' // icon
import '@/permission' // permission control

// 引入element Table(编辑)
import VueElementExtends from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'

Vue.use(VueElementExtends)

/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
