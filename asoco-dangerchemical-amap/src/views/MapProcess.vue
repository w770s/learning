<template>
  <div class="map-container">
    <div id="amap"></div>
    <div class="branch"></div>
    <div class="left-menu">
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.chymistIn }">危化品流入</h4>
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.chymistOut }">危化品流出</h4>
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.wasteIn }">危险废物流入</h4>
      <h4 class="menu-item" :class="{ active: flowType === $config.flowType.wasteOut }">危险废物流出</h4>
    </div>
    <Button @click="getPath" style="position: absolute; top: 250px;">获取路径</Button>
    <div content="map-tab">
      <div class="map-tab-item"></div>
      <div class="map-tab-item"></div>
    </div>
  </div>
</template>

<script>
import { berthMarkers, superviseMarkers, parkOutline, lines } from '@/data/process'
import AMap from 'AMap'
import config from '@/config'
export default {
  data () {
    return {
      aMap: null, // 高德地图
      bezierCurve: null,
      customLine: null, // 海关线
      portLine: null, // 港务线
      policeLine: null, // 公安线
      trafficLine: null, // 交通线
      safetyLine: null, // 安监线
      flowType: config.flowType.chymistIn, // 流动类型  chymistIn | chymistOut | wasteIn | wasteOut
      customMarker: [], // 海关标记点
      portMarker: [], // 港务点标记
      policeMarker: [], // 公安点标记
      trafficMarker: [], // 交通点标记
      safetyMarkers: [], // 安监点标记
      berthMarkers: [], // 泊位点标记
      park: null, // 园区轮廓
      parkContent: null // 园区显示内容
    }
  },
  mounted () {
    this.initMap()
    this.initOverlay()
  },
  methods: {
    /**
     * @description 初始化地图
     */
    initMap () {
      if (!this.aMap) {
        this.aMap = new AMap.Map('amap', {
          zoom: 15,
          center: [121.068233, 30.594507],
          mapStyle: 'amap://styles/c69ea91739f2b7212c9239fc04bff275',
          viewMode: '3D',
          pitch: 55,
          rotation: 8
        })
      }
    },
    /**
     * @description 初始化图层
     */
    initOverlay () {
      // let bezierCurveEditor = new AMap.BezierCurveEditor(this.aMap, this.bezierCurve)
      // bezierCurveEditor.open()
      // 添加海关监测点
      // this.customMarker = this.generateCircleMarker(superviseMarkers.custom.point, superviseMarkers.custom.point.name)
      this.addSuperviseMarker('customMarker', superviseMarkers.custom)
      // 添加港务监测点
      this.addSuperviseMarker('portMarker', superviseMarkers.port)
      // 添加公安监测点
      this.addSuperviseMarker('policeMarker', superviseMarkers.police)
      // 添加交通监测点
      this.addSuperviseMarker('trafficMarker', superviseMarkers.traffic)
      // 添加安监监测点
      this.addSuperviseMarker('safetyMarkers', superviseMarkers.safety)
      // this.trafficMarker.on('click', () => {
      //   this.openInfoWindow('traffic')
      // })
      // 初始化泊位点
      if (this.berthMarkers.length === 0) {
        let markers = []
        berthMarkers.forEach(item => {
          markers.push(this.generateBerthMarker(item.point, item.abnormal))
        })
        this.berthMarkers = new AMap.OverlayGroup(markers)
      }
      this.aMap.add(this.berthMarkers)
      // 初始化园区
      this.initPark()
      // 初始化线条
      this.initLine()
    },
    /**
     * @description 初始化园区图层
     */
    initPark () {
      if (!this.park) {
        this.park = new AMap.Polygon({
          path: parkOutline,
          strokeWeight: 2,
          strokeColor: '#c77828',
          fillColor: '#c77828',
          fillOpacity: '0.4'
        })
      }
      this.aMap.add(this.park)
      let inCircle = new AMap.Circle({
        center: [121.054676, 30.603827],
        radius: 150,
        strokeWeight: 2,
        strokeColor: '#90765f',
        fillOpacity: 0
      })
      let middleCircle = new AMap.Circle({
        center: [121.054676, 30.603827],
        radius: 380,
        strokeWeight: 2,
        strokeColor: '#90765f',
        strokeStyle: 'dashed',
        fillOpacity: 0
      })
      let outCircle = new AMap.Circle({
        center: [121.054676, 30.603827],
        radius: 680,
        strokeWeight: 2,
        strokeColor: '#90765f',
        fillOpacity: 0
      })
      this.aMap.add(inCircle)
      this.aMap.add(middleCircle)
      this.aMap.add(outCircle)
      if (!this.parkContent) {
        this.parkContent = new AMap.Marker({
          position: new AMap.LngLat(121.054676, 30.603827),
          offset: new AMap.Pixel(0, -235),
          content: `<div class="amap-park-content">
                      <div class="spot"></div>
                      <h3>智慧化工园区</h3>
                      <div class="amap-park-content-text">流入 23768 吨</div>
                    </div>`
        })
      }
      this.aMap.add(this.parkContent)
    },
    initLine () {
      this.safetyMarkers.on('click', function (e) {
        console.log(e)
      })
      this.setLine('customLine', lines.custom)
      this.setLine('portLine', lines.port)
      this.setLine('policeLine', lines.police)
      this.setLine('trafficLine', lines.traffic)
      this.setLine('safetyLine', lines.safety)
      // if (!this.bezierCurve) {
      //   this.bezierCurve = new AMap.BezierCurve({
      //     path: [
      //       [121.093459, 30.617286],
      //       [121.084106, 30.631509]
      //     ],
      //     strokeWeight: 2,
      //     strokeColor: '#67ddff',
      //     isOutline: false
      //   })
      // }
      // this.aMap.add(this.bezierCurve)
      // let bezierCurveEditor = new AMap.BezierCurveEditor(this.aMap, this.bezierCurve)
      // bezierCurveEditor.open()
    },
    /**
     * @description 构造大圆点
     * @param point
     * @param name
     * @returns {AMap.Marker[]}
     */
    generateCircleMarker (point, name) {
      return new AMap.OverlayGroup([
        new AMap.Marker({
          position: new AMap.LngLat(point[0], point[1]),
          icon: require('../assets/process/pervise_point.png'),
          offset: new AMap.Pixel(-70, -45)
        }),
        new AMap.Marker({
          position: new AMap.LngLat(point[0], point[1]),
          offset: new AMap.Pixel(-30, -35),
          content: `<div class="amap-circle-marker"><div class="marker-content">${name}</div></div>`
        })
      ])
    },
    /**
     * @description 构造泊位点
     * @param point
     * @param abnormal
     * @returns {AMap.Marker}
     */
    generateBerthMarker (point, abnormal) {
      let icon = require('../assets/process/berth_point_normal.png')
      if (abnormal) {
        icon = require('../assets/process/berth_point_abnormal.png')
      }
      return new AMap.Marker({
        position: new AMap.LngLat(point[0], point[1]),
        icon: icon,
        offset: new AMap.Pixel(-15, -10)
      })
    },
    /**
     * @description 添加监测点
     * @param marker
     * @param data
     */
    addSuperviseMarker (marker, data) {
      if (this[marker].length === 0) {
        this[marker] = this.generateCircleMarker(data.point, data.name)
        this.aMap.add(this[marker])
      }
    },
    setLine (lineName, path) {
      if (!this[lineName]) {
        this[lineName] = new AMap.Polyline({
          path: path,
          strokeWeight: 2,
          strokeColor: '#67ddff',
          isOutline: false
        })
      }
      this.aMap.add(this[lineName])
    },
    openInfoWindow (name) {
      alert(name)
    },
    getPath () {
      console.log(this.bezierCurve.getPath())
    }
  }
}
</script>

<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  #amap {
    width: 100%;
    height: 100%;
  }
  .branch {
    position: absolute;
    top: 100px;
    left: 4px;
    width: 39px;
    height: 296px;
    background: url("../assets/map/branch.png") no-repeat center;
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
      background: url("../assets/map/menu.png") no-repeat center;
      background-size: 100% 100%;
      font-size: 18px;
      color: #0df6ff;
      font-weight: normal;
      cursor: pointer;
      &.active {
        background: url("../assets/map/menu_active.png") no-repeat center;;
        color: #fff;
      }
    }
  }
  .map-tab {
    position: absolute;
    right: 0;
    bottom: 10px;
    .map-tab-item {
      display: inline-block;
      width: 171px;
      height: 140px;
      cursor: pointer;
    }
  }
}
</style>
