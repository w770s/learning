import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import elecReport from '@/views/realTimeMonitoring/elec-report.vue'
import workReport from '@/views/realTimeMonitoring/work-report.vue'
import goodsReport from '@/views/realTimeMonitoring/goods-report.vue'
import MapCintainer from '@/components/MapContainer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/elec-report/:id',
      name: 'elec-report',
      component: elecReport
    },
    {
      path: '/work-report/:id',
      name: 'work-report',
      component: workReport
    },
    {
      path: '/goods-report/:id',
      name: 'goods-report',
      component: goodsReport
    },
    {
      path: '/map',
      name: 'map',
      redirect: '/map/situation',
      component: MapCintainer,
      children: [
        {
          path: 'situation',
          name: 'situation',
          component: () => import('@/views/MapSituation.vue')
        },
        {
          path: 'process',
          name: 'process',
          component: () => import('@/views/map-process/MapProcess.vue')
        },
        {
          path: 'track',
          name: 'track',
          component: () => import('@/views/map-track/MapTrack.vue')
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: () => import('@/views/DataAnalysis/DataAnalysis.vue')
        },
        {
          path: 'dataAnalysisWarning',
          name: 'dataAnalysisWarning',
          component: () => import('@/views/DataAnalysis/analysisWarning/dataAnalysisWarning.vue')
        },
        {
          path: 'realTimeMonitoring',
          name: 'realTimeMonitoring',
          component: () => import('@/views/realTimeMonitoring/carMonitor.vue')
        },
        {
          path: 'realTimeShipMonitoring',
          name: 'realTimeShipMonitoring',
          component: () => import('@/views/realTimeMonitoring/realTimeMonitoringShip.vue')
        },
        {
          path: 'wharfMonitor',
          name: 'wharfMonitor',
          component: () => import('@/views/wharf-monitor/wharfMonitor.vue')
        }
      ]
    }
  ]
})
