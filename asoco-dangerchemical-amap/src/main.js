import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import config from '@/config'
import iView from 'iview'
import VueAMap from 'vue-amap'
import BaiduMap from 'vue-baidu-map'
import 'iview/dist/styles/iview.css'
import moment from 'moment'
import 'jquery'
import { baseXietongWsUrl } from '@/api/map'
import VideoPlayer from 'vue-video-player'
import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, baseXietongWsUrl() + '/v2/supervise', {
  connectManually: true, // 手动模式
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000)
})
Vue.use(VideoPlayer)
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'b8c6feadfefbd2f799542662a2d0f777',
  plugin: ['AMap.BezierCurveEditor', 'AMap.PolyEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.11'
})

Vue.use(BaiduMap, {
  ak: 'C80MZohBPAcpIlWrpMW2T4OrZXlrQtqy'
})
// 时间格式化
Vue.prototype.$moment = moment
Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.$config = config

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
