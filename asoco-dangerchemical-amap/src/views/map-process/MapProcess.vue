<template>
  <div class="map-container">
    <!-- 监测点 -->
    <el-amap ref="map" vid="amap" :mapStyle="mapConfig.mapStyle" :center="mapConfig.center"
             :zoom="mapConfig.zoom" viewMode="3D" :events="mapConfig.events">
      <template v-for="(item , index) in supervise">
        <el-amap-marker :key="'icon' + item + index" :extData="item.extData"
                        :events="superviseEvents" :zIndex="101" :position="item.point"
                        :icon="item.icon" :offset="[-70, -45]"
                        :visible="item.visible && (flowType === $config.flowType.chymistIn||flowType === $config.flowType.chymistOut)"></el-amap-marker>
        <el-amap-marker :key="'content' + item + index" :extData="item.extData"
                        :events="superviseEvents" :zIndex="101" :position="item.point"
                        :content="item.content" :offset="[-30, -35]"
                        :visible="item.visible && (flowType === $config.flowType.chymistIn||flowType === $config.flowType.chymistOut)"></el-amap-marker>
        <el-amap-polyline :key="'line' + item + index" :path="item.line" :strokeWeight="2"
                          strokeColor="#67ddff" :zIndex="101"
                          :visible="item.visible && (flowType === $config.flowType.chymistIn||flowType === $config.flowType.chymistOut)"></el-amap-polyline>
      </template>

      <!-- 交通线 -->
      <template>
        <el-amap-polygon :path="port.outline" :strokeWeight="2" strokeColor="#0de0ff"
                         :visible="superviseType === '交通'" fillColor="#0de0ff" :fillOpacity="0.4"
                         :events="mapConfig.events"></el-amap-polygon>
        <el-amap-polyline :path="trafficCarLine.lines" strokeColor="#c77828" :strokeWeight="3"
                          :visible="trafficCarLine.isShow&&(superviseType === '交通' || flowType === $config.flowType.wasteIn)"></el-amap-polyline>
      </template>
      <!-- 园区 -->
      <template>
        <el-amap-polygon :path="park.outline" :strokeWeight="2" strokeColor="#c77828"
                         fillColor="#c77828" :fillOpacity="0.4"
                         :events="mapConfig.events"></el-amap-polygon>
        <el-amap-circle :center="[121.054676, 30.603827]" :radius="150" :strokeWeight="2"
                        strokeColor="#90765f" :fillOpacity="0"></el-amap-circle>
        <el-amap-circle :center="[121.054676, 30.603827]" :radius="380" :strokeWeight="2"
                        strokeColor="#90765f" :fillOpacity="0"
                        strokeStyle="dashed"></el-amap-circle>
        <el-amap-circle :center="[121.054676, 30.603827]" :radius="680" :strokeWeight="2"
                        strokeColor="#90765f" :fillOpacity="0"></el-amap-circle>
        <el-amap-marker :position="[121.054676, 30.603827]" :content="park.content"
                        :offset="[0, -235]" :events="mapConfig.events"></el-amap-marker>
      </template>
      <!-- 海关点 -->
      <el-amap-marker v-for="(item, index) in customMarker"
                      :key="'custom' + index"
                      :events="markerEvents"
                      :position="item.point"
                      :extData="item.extData"
                      :icon="icons[item.type]"
                      :offset="[-15, -10]"
                      :visible="superviseType === '海关' &&(flowType === $config.flowType.chymistIn||flowType === $config.flowType.chymistOut)"
                      :angle="item.type === 'ship' ? item.angle : 0"></el-amap-marker>
      <!-- 港务点 -->
      <el-amap-marker v-for="(item, index) in portMarkers"
                      :key="index"
                      :position="item.point"
                      :events="markerEvents"
                      :extData="item.extData"
                      :icon="icons[item.type]"
                      :offset="[-15, -10]"
                      :visible="superviseType === '港务'"
                      :angle="item.type === 'ship' ? item.angle : 0"></el-amap-marker>
      <!-- 公安点 -->
      <el-amap-marker v-for="(item, index) in policeMarkers"
                      :key="'police' + index"
                      :position="item.point"
                      :events="markerEvents"
                      :extData="item.extData"
                      :icon="icons[item.type]"
                      :offset="[-15, -10]"
                      :visible="superviseType === '公安'&&(flowType === $config.flowType.chymistIn||flowType === $config.flowType.chymistOut)"></el-amap-marker>
      <!-- 交通点 -->
      <el-amap-marker v-for="(item, index) in trafficMarkers"
                      :key="'traffic' + index"
                      :position="item.point"
                      :events="markerEvents"
                      :extData="item.extData"
                      :icon="icons[item.type]"
                      :offset="[-15, -10]"
                      :visible="superviseType === '交通'&&(flowType === $config.flowType.chymistIn||flowType === $config.flowType.chymistOut) "
                      :angle="item.type === 'car' ? 72 : 0"></el-amap-marker>
      <!-- 安监点 -->
      <!--<el-amap-marker v-for="(item, index) in safetyMarkers"-->
      <!--:key="'safety' + index"-->
      <!--:position="item.point"-->
      <!--:icon="icons[item.type]"-->
      <!--:offset="[-15, -10]"-->
      <!--:visible="superviseType === '安监' && flowType === $config.flowType.chymistIn"></el-amap-marker>-->
      <!-- 危险废物流入点标记 -->
      <el-amap-marker v-for="(item, index) in wasteInMarkers"
                      :key="'wasteInMarkers' + index"
                      :position="item.point"
                      :events="markerEvents"
                      :extData="item.extData"
                      :icon="icons[item.type]"
                      :offset="[-15, -10]"
                      :angle="item.type === 'car' ? 72 : 0"
                      :visible="flowType === $config.flowType.wasteIn"></el-amap-marker>
      <!-- 信息窗体 -->
      <el-amap-info-window
        :position="infoWindow.position"
        :visible="infoWindow.visible"
        :events="infoWindow.events"
        :isCustom="true"
        :offset="[0, -25]">
        <div class="info-window">
          <span class="close-btn" @click="closeInfoWindow">×</span>
          <h3 class="info-window-title">{{ infoWindow.extData.title }}</h3>
          <div class="licence-container"
               v-if="infoWindow.extData.licence && infoWindow.extData.licence.length > 0">
            <div class="licence-item" :class="{ warn: !item.normal }"
                 v-for="(item, index) in infoWindow.extData.licence" :key="'licence' + index">
              <span>{{ item.name }}</span>
              <span class="item-icon">{{ item.normal ? '✓' : '!' }}</span>
            </div>
          </div>
          <ul class="detail-list">
            <li v-for="(item, index) in infoWindow.extData.detail" :key="'info-detail' + index">{{
              item }}
            </li>
          </ul>
          <div class="bill-container"
               v-if="infoWindow.extData.bill && infoWindow.extData.bill.length > 0">
            <span class="bill-item" v-for="(item, index) in infoWindow.extData.bill"
                  :key="'bill' + index">{{ item }}</span>
          </div>
        </div>

      </el-amap-info-window>
      <!-- 信息窗体交通车辆信息窗口 -->
      <el-amap-info-window
        :position="infoWindowTraffic.position"
        :visible="infoWindowTraffic.visible"
        :events="infoWindowTraffic.events"
        :isCustom="true"
        :offset="[0, -25]">
        <div class="info-window">
          <span class="close-btn" @click="closeInfoWindowTraffic">×</span>
          <div style="margin: 10px;min-width: 200px">
            <a target="_blank"
               :href="baseXietongLinkUrl+'/#/vehicleInfoNoLogin?id='+infoWindowTraffic.extData.vanCert">
              <h3 style="font-size: 16px;color: #0de0ff;font-weight: normal;">
                牵引车：{{infoWindowTraffic.extData.vanCert}}</h3></a>
            <ul style="list-style:none;">
              <li style="padding:10px 0 5px 0;color: #0de0ff;"><a target="_blank"
                                                                  :href="baseXietongLinkUrl+'/#/vehicleInfoNoLogin?plateNo='+infoWindowTraffic.extData.truckCert"><span
                style="color: #0de0ff">挂车： {{infoWindowTraffic.extData.truckCert}}</span></a></li>
              <li style="padding-bottom: 5px">时速： 0公里/小时</li>
              <!--<li style="padding-bottom: 5px">货物： <a style="color: #0de0ff;cursor: pointer;">${data.goods.name}</a>   ${data.goods.weight}吨</li>-->
              <li style="padding-bottom: 5px">货物： <a target="_blank"
                                                     style="color: #0de0ff;cursor: pointer;"
                                                     :href="baseXietongLinkUrl+'/#/productInfoNoLogin?name='+infoWindowTraffic.extData.productName">{{infoWindowTraffic.extData.productName}}</a>
                {{infoWindowTraffic.extData.totalWeight}}吨
              </li>
              <li style="padding-bottom: 5px">物流公司： <a target="_blank"
                                                       :href="baseXietongLinkUrl+'/#/enterpriseInfoNoLogin?enterpriseCode='+infoWindowTraffic.extData.carrierEnterpriseId+'&token'"><span
                style="color: #0de0ff">{{infoWindowTraffic.extData.carrierEnterpriseName}}</span></a>
              </li>
              <li style="padding-bottom: 5px">驾驶员： <a target="_blank"
                                                      :href="baseXietongLinkUrl+'/#/staffInfoNoLogin?supercargo='+infoWindowTraffic.extData.driverId"><span
                style="color: #0de0ff">{{infoWindowTraffic.extData.driverName}}</span></a>
                {{infoWindowTraffic.extData.driverPhone}}
              </li>
              <li style="padding-bottom: 5px">押运员： <a target="_blank"
                                                      :href="baseXietongLinkUrl+'/#/staffInfoNoLogin?supercargo='+infoWindowTraffic.extData.driverId2"><span
                style="color: #0de0ff">{{infoWindowTraffic.extData.driverName2}}</span></a>
                {{infoWindowTraffic.extData.driverPhone2}}
              </li>
              <li>
                <ul class="car-pop-image">
                  <li style="padding-bottom: 5px">发货地： {{infoWindowTraffic.extData.loadingMap}}</li>
                  <li style="padding-bottom: 5px">收货地： {{infoWindowTraffic.extData.unloadingMap}}
                  </li>
                </ul>
              </li>
              <li>
                <a target="_blank"  :href="baseXietongLinkUrl+'/#/productInfoNoLogin?name='+infoWindowTraffic.extData.productName">
                  <img src='../../assets/realTimeMonitoring/i-rescue.png' alt="">
                </a>
              </li>
            </ul>
          </div>
        </div>
      </el-amap-info-window>
    </el-amap>
    <div class="branch"></div>
    <div class="left-menu">
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.chymistIn }"
          @click="changeFlowType($config.flowType.chymistIn)">危化品流入</h4>
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.chymistOut }"
          @click="changeFlowType($config.flowType.chymistOut)">危化品流出</h4>
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.wasteIn }"
          @click="changeFlowType($config.flowType.wasteIn)">危险废物流入</h4>
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.wasteOut }"
          @click="changeFlowType($config.flowType.wasteOut)">危险废物流出</h4>
    </div>
    <div class="map-tab">
      <div class="map-tab-item supervise" :class="{ active: $route.path === '/map/process' }"></div>
      <div class="map-tab-item command"></div>
    </div>
    <component v-bind:is="currentTabComponent" :flowType="flowType"></component>
  </div>
</template>

<script>

import iconSupervise from '../../assets/process/pervise_point.png'
import iconSuperviseActive from '../../assets/process/pervise_point_active.png'
import iconBerth from '../../assets/process/berth_point_normal.png'
import iconBerthRed from '../../assets/process/berth_point_abnormal.png'
import iconTask from '../../assets/process/icon_task.png'
import iconWarn from '../../assets/process/icon_warn.png'
import iconEnter from '../../assets/process/marker_enter.png'
import iconEnterUnusual from '../../assets/process/marker_enter_unusual.png'
import iconShip from '../../assets/process/marker_ship.png'
import iconBlast from '../../assets/process/marker_blast.png'
import iconPoison from '../../assets/process/marker_poison.png'
import iconToxic from '../../assets/process/marker_toxic.png'
import iconCar from '../../assets/process/marker_car.png'
import iconCamera from '../../assets/process/marker_camera.png'
import { superviseType, wasteInMarkers } from '@/data/process'
import config from '@/config'
import custom from './components/custom/custom'
import port from './components/port/port'
import police from './components/police/police'
import traffic from './components/traffic/traffic'
import safety from './components/safety/safety'
import environment from './components/environment/environment'
import { getParkRange, getPortRange, getParkCars, getAllCars, getCarGpsByOrderId, baseXietongUrl } from '@/api/map'
import { getCompanyByCode } from '@/api/emergency' // 调用应急指挥接口查询企业列表-BJS
import { postMoreShip, postBerthList } from '@/api/pdc' // 调用流量存量接口查询船讯网船舶及泊位列表-BJS
export default {
  components: {
    // port,
    // police,
    // traffic
    // safety
  },
  data () {
    return {
      baseXietongLinkUrl: baseXietongUrl(), // 跳转协同基础地址
      currentTabComponent: custom, // 右侧当前要展示的控件
      icons: { // 图标map
        task: iconTask,
        warn: iconWarn,
        enter: iconEnter,
        enterUnusual: iconEnterUnusual,
        ship: iconShip,
        berth: iconBerth,
        berthRed: iconBerthRed,
        blast: iconBlast,
        poison: iconPoison,
        toxic: iconToxic,
        car: iconCar,
        camera: iconCamera
      },
      aMap: null, // 高德地图map实例
      mapConfig: { // 地图配置
        zoom: 15, // 缩放层级
        center: [121.068233, 30.594507], // 中心点
        mapStyle: 'amap://styles/c69ea91739f2b7212c9239fc04bff275', // 地图样式
        events: { // 时间
          click: (e) => {
            console.log(e)
          }
        }
      },
      components: {
        custom: custom,
        police: police,
        port: port,
        traffic: traffic,
        safety: safety
      },
      supervise: { // 监测点
        custom: { // 海关
          point: [121.061929, 30.579729],
          icon: iconSupervise,
          content: '<div class="amap-circle-marker"><div class="marker-content">海关</div></div>',
          line: [
            [121.041876, 30.574687],
            [121.046751, 30.575742],
            [121.051466, 30.576925],
            [121.056127, 30.578159],
            [121.060112, 30.579536]
          ],
          visible: false,
          extData: {
            name: 'custom'
          }
        },
        port: { // 港务
          point: [121.073602, 30.58468],
          icon: iconSupervise,
          content: '<div class="amap-circle-marker"><div class="marker-content">港务</div></div>',
          line: [
            [121.063248, 30.580511],
            [121.065348, 30.581273],
            [121.067358, 30.582109],
            [121.069495, 30.583001],
            [121.071781, 30.584075]
          ],
          visible: false,
          extData: {
            name: 'port'
          }
        },
        police: { // 公安
          point: [121.085275, 30.591108],
          icon: iconSupervise,
          content: '<div class="amap-circle-marker"><div class="marker-content">公安</div></div>',
          line: [
            [121.075345, 30.585299],
            [121.077537, 30.586302],
            [121.079618, 30.587292],
            [121.08193, 30.588509],
            [121.08376, 30.589674]
          ],
          visible: false,
          extData: {
            name: 'police'
          }
        },
        traffic: { // 交通
          point: [121.093686, 30.613419],
          icon: iconSupervise,
          content: '<div class="amap-circle-marker"><div class="marker-content">交通</div></div>',
          line: [
            [121.086678, 30.592825],
            [121.088327, 30.595423],
            [121.089613, 30.598177],
            [121.090561, 30.601028],
            [121.091722, 30.604911],
            [121.09306, 30.610536]
          ],
          visible: false,
          extData: {
            name: 'traffic'
          }
        },
        safety: { // 安监
          point: [121.081056, 30.633104],
          icon: iconSupervise,
          content: '<div class="amap-circle-marker"><div class="marker-content">安监</div></div>',
          line: [
            [121.093459, 30.617286],
            [121.09209, 30.621422],
            [121.089951, 30.625733],
            [121.087371, 30.628961],
            [121.084106, 30.631509]
          ],
          visible: false,
          extData: {
            name: 'safety'
          }
        }
      },
      superviseEvents: { // 监测点事件
        click: (e) => {
          this.changeSupervise(e.target.C.extData)
        }
      },
      currentSupervise: null, // 当前选中监测点
      park: { // 园区
        outline: [],
        content: `<div class="amap-park-content">
                      <div class="spot"></div>
                      <h3>智慧化工园区</h3>
                      <div class="amap-park-content-text">流入0吨</div>
                    </div>`
      },
      port: {// 港区
        outline: []// 围栏
      },
      trafficCarLine: {
        lines: [], // 交通线
        isShow: false,
        orderHeaderId: 0
      },
      flowType: config.flowType.chymistIn, // 流动类型  chymistIn | chymistOut | wasteIn | wasteOut
      customMarker: [
      ], // 海关点
      portMarkers: [], // 港务点
      policeMarkers: [
        {
          point: [121.069951, 30.589343],
          type: 'blast',
          extData: {
            title: '易爆仓库',
            detail: [
              '可存储物：亚硝酸钠  300吨',
              '可存储物：亚硝酸钠  300吨',
              '可存储物：液氧  100吨'
            ]
          }
        },
        {
          point: [121.073225, 30.595901],
          type: 'poison',
          extData: {
            title: '易制毒仓库',
            detail: [
              '可存储物：亚硝酸钠  300吨',
              '可存储物：亚硝酸钠  300吨',
              '可存储物：液氧  100吨'
            ]
          }
        },
        {
          point: [121.078959, 30.592051],
          type: 'toxic',
          extData: {
            title: '剧毒仓库',
            detail: [
              '可存储物：亚硝酸钠  300吨',
              '可存储物：亚硝酸钠  300吨',
              '可存储物：液氧  100吨'
            ]
          }
        }
      ], // 公安点
      trafficMarkers: [], // 交通点
      wasteInMarkers: wasteInMarkers, // 危险废物流入点标记
      iconBerth, // 泊位点正常图片
      iconBerthRed, // 泊位点异常图片
      superviseType: '', // 监测类型
      markerEvents: {
        click: (e) => {
          if (this.superviseType === '交通') {
            this.showInfoWindowTraffic(e)
          } else {
            this.showInfoWindow(e)
          }
        }
      }, // 地图上的marker点击事件
      infoWindow: { // 点击地图的marker显示的信息窗体数据---其他
        position: [121.060048, 30.582647], // 位置
        extData: {
          title: '标题'
        }, // 显示信息
        visible: false, // 是否显示
        events: {
          close: () => {
            this.closeInfoWindow()
          }
        }
      },
      infoWindowTraffic: { // 点击地图的marker显示的信息窗体数据---交通车辆
        position: [0, 0], // 位置
        extData: {}, // 显示信息
        visible: false, // 是否显示
        events: {
          close: () => {
            this.closeInfoWindowTraffic()
          }
        }
      }
    }
  },
  mounted () {
    // 获取园区区围栏
    this.apiGetParkOutLine()
    this.apiGetPortOutLine()
    this.apiGetParkCars()
    this.apiGetAllCars()
    this.$nextTick().then(() => {
      this.initMap()
      this.startAnimation()
    })
    this.apiGetCompanyList()
    this.apiGetShip()
    this.apiGetBerth()
  },
  methods: {
    /**
       * @description 初始化地图
       */
    initMap () {
      this.aMap = this.$refs.map.$$getInstance()
      this.aMap.setPitch(55)
      this.aMap.setRotation(8)
    },
    /**
       * @description 开始动态效果
       */
    startAnimation () {
      let self = this

      function showCustom () {
        self.supervise.custom.visible = true
        self.supervise.custom.icon = iconSuperviseActive
        self.superviseType = superviseType.custom
        self.currentSupervise = self.supervise.custom
        setTimeout(() => {
          showPort()
        }, 1500)
      }

      function showPort () {
        self.supervise.port.visible = true
        self.superviseType = superviseType.port
        self.supervise.custom.icon = iconSupervise
        self.supervise.port.icon = iconSuperviseActive
        self.currentSupervise = self.supervise.port
        self.currentTabComponent = port
        setTimeout(() => {
          showPolice()
        }, 1500)
      }

      function showPolice () {
        self.supervise.police.visible = true
        self.superviseType = superviseType.police
        self.supervise.port.icon = iconSupervise
        self.supervise.police.icon = iconSuperviseActive
        self.currentSupervise = self.supervise.police
        self.currentTabComponent = police
        setTimeout(() => {
          showTraffic()
        }, 1500)
      }

      function showTraffic () {
        self.supervise.traffic.visible = true
        self.superviseType = superviseType.traffic
        self.supervise.police.icon = iconSupervise
        self.supervise.traffic.icon = iconSuperviseActive
        self.currentSupervise = self.supervise.traffic
        self.currentTabComponent = traffic
        setTimeout(() => {
          showSafety()
        }, 1500)
      }

      function showSafety () {
        self.supervise.safety.visible = true
        self.superviseType = superviseType.safety
        self.supervise.traffic.icon = iconSupervise
        self.supervise.safety.icon = iconSuperviseActive
        self.currentSupervise = self.supervise.safety
        self.currentTabComponent = safety
      }

      setTimeout(() => {
        showCustom()
      }, 1500)
    },
    /**
       * @description 改变流向
       */
    changeFlowType (type) {
      // 关闭信息窗口
      this.closeInfoWindow()
      this.closeInfoWindowTraffic()
      if (this.flowType === type) return
      this.flowType = type
      switch (type) {
        // 危化品流入
        case config.flowType.chymistIn:
          this.changeSupervise({ name: 'custom' })
          this.currentTabComponent = custom
          this.apiGetAllCars()
          this.apiGetParkCars()
          break
          // 危化品流出
        case config.flowType.chymistOut:
          this.changeSupervise({ name: 'custom' })
          this.currentTabComponent = custom
          this.apiGetAllCars()
          this.apiGetParkCars()
          break
        case config.flowType.wasteIn:
          this.currentTabComponent = environment
          break
      }
    },
    /**
       * @description 改变选中监测点
       * @param data
       */
    changeSupervise (data) {
      let name = data.name
      if (this.currentSupervise === this.supervise[name]) return
      this.supervise[name].icon = iconSuperviseActive
      this.currentSupervise.icon = iconSupervise
      this.superviseType = superviseType[name]
      this.currentSupervise = this.supervise[name]
      this.currentTabComponent = this.components[name]
    },
    /**
       * @description 显示信息窗体
       * @param data
       */
    showInfoWindow (data) {
      console.log(data)
      this.infoWindow.position = [data.lnglat.lng, data.lnglat.lat]
      this.infoWindow.extData = data.target.C.extData
      this.infoWindow.visible = true
    },
    // 显示点击交通车辆信息窗体
    showInfoWindowTraffic (data) {
      console.log(data)
      this.infoWindowTraffic.position = [data.lnglat.lng, data.lnglat.lat]
      this.infoWindowTraffic.extData = data.target.C.extData
      this.infoWindowTraffic.visible = true

      // 点击的订单ID
      this.trafficCarLine.orderHeaderId = data.target.C.extData.orderHeaderId
      // 获取订单Gps线路
      this.apiGetCarGpsByOrderId()
    },
    closeInfoWindow () {
      this.infoWindow.visible = false
    },
    closeInfoWindowTraffic () {
      this.infoWindowTraffic.visible = false
      // 隐藏路线信息
      this.trafficCarLine.lines = []
      this.trafficCarLine.isShow = false
    },
    /**
       * 获取园区围栏
       */
    apiGetParkOutLine () {
      let param = { type: 'GCJ' }
      getParkRange(param).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.park.outline = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取港区围栏
       */
    apiGetPortOutLine () {
      let param = { type: 'GCJ' }
      getPortRange(param).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.port.outline = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取园区和港区内车辆文
       */
    apiGetAllCars () {
      let stevedore = '0'
      if (this.flowType === this.$config.flowType.chymistOut) {
        stevedore = '0'
      } else {
        stevedore = '1'
      }
      let param = { stevedore: stevedore }
      getAllCars(param).then(res => {
        if (res.code === 1) {
          this.trafficMarkers = []
          res.data.list.forEach(data => {
            let trafficMarker = {
              point: [data.lng, data.lat],
              type: 'car'
            }
            trafficMarker.extData = data
            data.title = '车辆运单详情'
            this.trafficMarkers.push(trafficMarker)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取园区内车辆
       */
    apiGetParkCars () {
      let stevedore = this.flowType === this.$config.flowType.chymistOut ? '0' : '1'
      let flowTypeStr = this.flowType === this.$config.flowType.chymistOut ? '流出' : '流入'
      let param = { stevedore: stevedore }
      getParkCars(param).then(res => {
        if (res.code === 1) {
          if (res.data.totalWeight === 0) {
            res.data.totalWeight = flowTypeStr === '流入' ? '4657.45' : '10111.2'
          }
          this.park.content = `<div class="amap-park-content">
                      <div class="spot"></div>
                      <h3>智慧化工园区</h3>
                      <div class="amap-park-content-text">${flowTypeStr} ${res.data.totalWeight}吨</div>
                    </div>`
        } else {
          let totalWeight = flowTypeStr === '流入' ? '4657.45' : '10111.2'
          this.park.content = `<div class="amap-park-content">
                      <div class="spot"></div>
                      <h3>智慧化工园区</h3>
                      <div class="amap-park-content-text">${flowTypeStr} ${totalWeight}吨</div>
                    </div>`
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 根据运单id查询gps，货物跟踪接口
     */
    apiGetCarGpsByOrderId () {
      getCarGpsByOrderId(this.trafficCarLine.orderHeaderId).then(res => {
        if (res.code === 1 && res.data.length) {
          this.trafficCarLine.lines = res.data
          this.trafficCarLine.isShow = true
        } else {
          this.$Message.warning('暂无车辆轨迹信息')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 查询港口码头企业列表
     */
    apiGetCompanyList () {
      getCompanyByCode().then(res => {
        if (res.resultCode.code === 1) {
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i]
            if (item.longitude !== '' && item.longitude !== null) {
              let company = {}
              let licence = []
              let detail = []
              let extData = {}
              let card1 = {}
              let card2 = {}
              company.point = [parseFloat(item.longitude), parseFloat(item.latitude)]
              company.type = 'enter'
              extData.title = item.name
              card1.name = '经营废物许可证'
              card1.normal = true
              licence.push(card1)
              card2.name = '运营经营许可证'
              card2.normal = true
              licence.push(card2)
              extData.licence = licence
              detail = [
                '企业法人：' + item.legalPerson
              ]
              extData.detail = detail
              company.extData = extData
              this.customMarker.push(company)
              this.portMarkers.push(company)
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 查询船讯网船舶
     */
    apiGetShip () {
      postMoreShip({ xy: '121068048,30594322-121068048,30579182-121103477,30579182-121103477,30594322' }).then(res => {
        if (res.resultCode.code === 1) {
          res.data.data.forEach((item, index) => {
            let ship = {}
            let detail = []
            let extData = {}
            ship.point = [item.lon / 1000000, item.lat / 1000000]
            ship.type = 'ship'
            ship.angle = item.cog / 100
            extData.title = item.name
            detail = [
              '船舶MMSI：' + item.mmsi,
              '船舶宽度：' + item.width,
              '船舶长度：' + item.length
            ]
            extData.detail = detail
            ship.extData = extData
            this.customMarker.push(ship)
            this.portMarkers.push(ship)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 查询泊位
     */
    apiGetBerth () {
      postBerthList().then(res => {
        if (res.resultCode.code === 1) {
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i]
            if (item.longitude !== '' && item.longitude !== null) {
              let berth = {}
              let detail = []
              let extData = {}
              berth.point = [item.longitude, item.latitude]
              berth.type = 'berth'
              extData.title = item.name
              detail = [
                '泊位数：' + item.num,
                '所属企业代码：' + item.companyCreditCode,
                '泊位地址：' + item.address
              ]
              extData.detail = detail
              berth.extData = extData
              this.portMarkers.push(berth)
            }
          }
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }

}
</script>

<style lang="less" scoped>
  .map-container {
    width: 100%;
    height: 100%;
    position: relative;
    .branch {
      position: absolute;
      top: 100px;
      left: 4px;
      width: 39px;
      height: 296px;
      background: url("../../assets/map/branch.png") no-repeat center;
      background-size: 100% 100%;
    }
    .left-menu {
      position: absolute;
      top: 189px;
      left: 36px;
      width: 131px;
      height: 209px;
      .menu-item {
        box-sizing: border-box;
        width: 131px;
        height: 35px;
        margin-bottom: 23px;
        padding-left: 10px;
        line-height: 35px;
        text-align: center;
        background: url("../../assets/map/menu.png") no-repeat center;
        background-size: 100% 100%;
        font-size: 18px;
        color: #0df6ff;
        font-weight: normal;
        cursor: pointer;
        &.active {
          background: url("../../assets/map/menu_active.png") no-repeat center;;
          color: #fff;
        }
      }
    }
    .map-tab {
      position: absolute;
      right: 7px;
      bottom: 0;
      .map-tab-item {
        display: inline-block;
        width: 171px;
        height: 140px;
        cursor: pointer;
      }
      .supervise {
        position: relative;
        left: 8px;
        background: url("../../assets/process/supervise.png");
        background-size: 100% 100%;
        &.active {
          background: url("../../assets/process/supervise_active.png");
        }
      }
      .command {
        background: url("../../assets/process/command.png");
        background-size: 100% 100%;
        &.active {
          background: url("../../assets/process/command_active.png");
        }
      }
    }
    .info-window {
      min-width: 290px;
      padding: 10px;
      background: #0a3d52;
      color: #fff;
      border: 1px solid #0de0ff;
      .car-pop-image {
        list-style: none;
        background: url('../../assets/realTimeMonitoring/i-arrow.png') 0 5px no-repeat, url('../../assets/realTimeMonitoring/i-circle.png') 20px 3px no-repeat;
        padding-left: 35px;
      }
      .info-window-title {
        font-size: 16px;
        color: #0de0ff;
        font-weight: normal;
      }
      .licence-container {
        margin: 8px 0;
      }
      .licence-item {
        display: inline-block;
        margin-right: 15px;
        padding: 0 0 0 8px;
        border: 1px solid #10d692;
        color: #10d692;
        font-size: 12px;
        border-radius: 4px;
        &.warn {
          border: 1px solid #ffaf14;
          color: #ffaf14;
          .item-icon {
            border-left: 1px solid #ffaf14;
          }
        }
        .item-icon {
          display: inline-block;
          margin-left: 8px;
          width: 18px;
          border-left: 1px solid #10d692;
          font-size: 10px;
          text-align: center;
        }
      }
      .detail-list {
        list-style: none;
        font-size: 14px;
        li {
          padding-top: 5px;
        }
      }
      .close-btn {
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 25px;
        cursor: pointer;
      }
      .bill-container {
        margin-top: 10px;
        .bill-item {
          display: inline-block;
          margin-right: 10px;
          padding: 0 6px;
          font-size: 12px;
          border: 1px solid #0de0ff;
          border-radius: 4px;
          color: #0de0ff;;
        }
      }
    }
  }
</style>
