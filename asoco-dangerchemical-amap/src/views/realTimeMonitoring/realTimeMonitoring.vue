<template>
  <div id="realTimeMonitoring">
    <div class="branch"></div>
    <div class="left-menu">
      <h4 class="menu-item" :class="{ active: menuType === $config.realTimeMonitoring.all }"
          @click="changeLeftMenu('全部')">全部</h4>
      <h4 class="menu-item" :class="{ active: menuType === $config.realTimeMonitoring.loadingCar }"
          @click="changeLeftMenu('重车')">重车</h4>
      <h4 class="menu-item"
          :class="{ active: menuType === $config.realTimeMonitoring.unloadingCar }"
          @click="changeLeftMenu('空车')">空车</h4>
      <h4 class="menu-item"
          :class="{ active: menuType === $config.realTimeMonitoring.easyToPoison }"
          @click="changeLeftMenu('易制毒')">易制毒</h4>
      <h4 class="menu-item"
          :class="{ active: menuType === $config.realTimeMonitoring.detonatingEasily }"
          @click="changeLeftMenu('易制爆')">易制爆</h4>
      <h4 class="menu-item" :class="{ active: menuType === $config.realTimeMonitoring.noRecord }"
          @click="changeLeftMenu('未备案')">未备案</h4>
      <h4 class="menu-item" :class="{ active: menuType === $config.realTimeMonitoring.ship }"
          @click="changeLeftMenu('船舶')">船舶</h4>
    </div>
    <rightList v-show="isCar" class="rightList" ref="rightList" :titleType="'('+menuType+')'" :allDatas="mapData"
               v-on:onItemClickListener="rightItemClick"></rightList>
    <!--bjs-->
    <rightShipList v-show="!isCar" class="rightList"  ref="rightShipList" :titleType="'('+menuType+')'" :stg='1' @showMoreShip="showMoreShip" @hideMoreShip="hideMoreShip" @toShip="toShip"></rightShipList>
    <!--船舶详情-->
    <shipDetail ref="shipDetail" :AISData="shipMessage" ></shipDetail>
    <berthList ref="berthList" :berthData="berthData"></berthList>
    <!--bjs end-->
    <div id="map" class="real-time-map"></div>
  </div>
</template>

<script>
import rightList from './components/rightList'
import { getData, getRange, getCarGpsByOrderId, baseXietongUrl, postBerthList, postShipMarker, postShipPortInfo, postOneShipData, postMoreShip } from '@/api/map'
import BMap from 'BMap'
import iconCar from '@/assets/realTimeMonitoring/i-car.png'
import iconCarNo from '@/assets/realTimeMonitoring/i-car-n.png'
import iconCarSelect from '@/assets/realTimeMonitoring/i-carSelect.png'
import iconStart from '@/assets/realTimeMonitoring/i-suppiler.png'
import iconEnd from '@/assets/realTimeMonitoring/i-receiver.png'
import iconWarning from '@/assets/realTimeMonitoring/i-rescue.png'
import iconWarningSen from '@/assets/realTimeMonitoring/i-rescue_2.png'
import iconClose from '@/assets/realTimeMonitoring/i-close.png'
import iconCircle from '@/assets/realTimeMonitoring/i-circle.png'
import iconArrow from '@/assets/realTimeMonitoring/i-arrow.png'
import rightShipList from './components/rightShipList' // bjs
import iconBerth from '@/assets/realTimeMonitoring/berth.png' // bjs
import iconberthA from '@/assets/realTimeMonitoring/berthActive.png' // bjs
import shipDetail from './components/shipDetail' // bjs
import shipImg from '@/assets/mapTrack/green360.png'// bjs
import shipCXImg from '@/assets/mapTrack/blue360.png'// bjs
import shipBg from '@/assets/mapTrack/window2.png'// bjs
import guanbi from '@/assets/mapTrack/close.png'// bjs
import berthList from './components/berthList'// bjs

export default {
  name: 'vehicleMonitoring',
  components: {
    rightList,
    rightShipList, // bjs
    shipDetail, // bjs
    berthList // bjs
  },
  data () {
    return {
      // 实时数据
      mapData: [],
      mapOldData: [],
      allLushu: [],
      // 围栏
      range: {
        parkLine: [],
        portLine: []
      },
      // 车辆point
      cars: {
        carPoints: [],
        carMarkers: []
      },
      // 一辆车线路
      carLine: [],
      // 跳转协同url
      baseXietongUrl: baseXietongUrl(),
      menuType: '全部',
      // 图标
      icons: {
        carNo: iconCarNo,
        car: iconCar,
        carSelect: iconCarSelect,
        start: iconStart,
        end: iconEnd,
        warning: iconWarning,
        warningSen: iconWarningSen,
        close: iconClose,
        berth: iconBerth, // bjs
        berthA: iconberthA, // bjs
        ship: shipImg, // bjs
        shipCX: shipCXImg, // bjs
        shipBg: shipBg, // bjs
        guanbi: guanbi // bjs
      },
      // 弹窗的数据
      carInfoData: {},
      // 信息弹窗
      carInfoBox: {
        firstClick: true
      },
      timer: {
        instance: {},
        isStart: true
      },
      isCar: true, // bjs
      // 船舶point
      ships: { // bjs
        shipPoints: [],
        shipMarkers: []
      },
      moreShips: { // bjs
        shipPoints: [],
        shipMarkers: []
      },
      lastInfoBox: null, // bjs
      shipMessage: {}, // bjs
      shipTraceList: [], // bjs
      polyline: null, // bjs
      berthData: {}, // bjs
      berthList: [], // bjs
      lastIndex: -1, // bjs
      markerData: [], // bjs
      isShowMoreShip: false // bjs
    }
  },
  mounted () {
    this.initMap()
    this.apiGetRange()
    this.apiGetRealTimeData()
    this.intervalGetRealTimeData()
  },
  // destroyed () {
  //   clearInterval(this.timer)
  // },
  methods: {
    initMap () {
      this.map = new BMap.Map('map') // 创建地图实例
      var point = new BMap.Point(121.1065105456, 30.6199488101) // 创建点坐标
      this.map.centerAndZoom(point, 15) // 初始化地图，设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      this.map.addControl(new BMap.OverviewMapControl())
      this.map.setMapStyle({ style: 'midnight' })// 地图风格
    },
    /**
       * 切换左侧tab
       */
    changeLeftMenu (menuType) {
      this.isCar = true // bjs
      this.$refs.berthList.showBerthNo() // bjs
      // 定时器
      if (typeof (this.timer.instance) !== 'undefined') {
        clearInterval(this.timer.instance)
      }
      this.menuType = menuType
      if (menuType === '船舶') { // bjs修改
        for (var i = 0; i < this.cars.carMarkers.length; i++) {
          this.map.removeOverlay(this.cars.carMarkers[i])
        }
        this.cars = {
          carPoints: [],
          carMarkers: []
        }
        this.isCar = false
        this.intervalGetRealTimeShipData()
        this.showBerth() // bjs
      } else {
        for (var k = 0; k < this.ships.shipMarkers.length; k++) {
          this.map.removeOverlay(this.ships.shipMarkers[k])
        }
        for (var j = 0; j < this.berthList.length; j++) {
          this.map.removeOverlay(this.berthList[j])
        }
        for (var l = 0; l < this.moreShips.shipMarkers.length; l++) {
          this.map.removeOverlay(this.moreShips.shipMarkers[l])
        }
        this.ships = {
          shipPoints: [],
          shipMarkers: []
        }
        this.intervalGetRealTimeData()
        this.$refs.rightList.reset()
      }
      this.apiGetRealTimeData()
    },
    /**
       * 重置地图
       */
    resetMap () {
      this.map.clearOverlays()
    },
    /**
       * 绘制围栏
       */
    drawRange () {
      // 绘制园区围栏
      var park = new BMap.Polygon(this.range.parkLine, {
        strokeWeight: 2,
        strokeColor: '#c77828',
        fillColor: '#c77828',
        fillOpacity: '0.4'
      })
      park.disableMassClear()// 禁止清除该覆盖物
      this.map.addOverlay(park)
      // 绘制港区围栏
      var port = new BMap.Polygon(this.range.portLine, {
        strokeWeight: 2,
        strokeColor: '#0de0ff',
        fillColor: '#0de0ff',
        fillOpacity: '0.1'
      })
      port.disableMassClear()// 禁止清除该覆盖物
      this.map.addOverlay(port)
    },
    /**
       *右侧列表车辆点击
       */
    rightItemClick (data) {
      // 定时器
      if (typeof (this.timer.instance) !== 'undefined') {
        clearInterval(this.timer.instance)
      }
      this.resetMap()
      this.drawOneCar(data)
      this.apiGetCarGpsByOrderId(data)
      this.showCarInfoBox(data)
    },
    /**
       * 车辆动画
       *
       */
    carAnimation (data) {
      // 老数据中找出相同车牌号
      let oldDatas = this.mapOldData.filter(old => {
        return old.vanCert === data.vanCert
      })
      if (oldDatas.length > 0) {
        let oldData = oldDatas[0]
        if (oldData.lat === data.lat && oldData.lng === data.lng) {
          this.drawOneCar(data)
          return
        }

        let self = this
        let lushu

        // 实例化一个驾车导航用来生成路线
        var drv = new BMap.DrivingRoute('嘉兴', {
          onSearchComplete: function (res) {
            if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
              var plan = res.getPlan(0)
              var arrPois = []
              for (var j = 0; j < plan.getNumRoutes(); j++) {
                var route = plan.getRoute(j)
                arrPois = arrPois.concat(route.getPath())
              }
              let carIcon = new BMap.Icon(self.icons.car, new BMap.Size(48, 18), { anchor: new BMap.Size(24, 9) })
              let carIconNo = new BMap.Icon(self.icons.carNo, new BMap.Size(48, 18), { anchor: new BMap.Size(24, 9) })
              lushu = new BMapLib.LuShu(self.map, arrPois, {
                defaultContent: '', // "从天安门到百度大厦"
                autoView: false, // 是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                icon: data.orderHeaderId === 0 ? carIconNo : carIcon,
                speed: 500,
                enableRotation: true, // 是否设置marker随着道路的走向进行旋转
                landmarkPois: []
              })

              lushu.start()
              let marker = lushu.getMarker()
              marker.addEventListener('click', function (e) {
                self.rightItemClick(data)
              })
            }
          }
        })
        var end = new BMap.Point(data.lng, data.lat)
        var start = new BMap.Point(oldData.lng, oldData.lat)
        drv.search(start, end)
      } else {
        this.drawOneCar(data)
      }
    },
    /**
     * bjs绘制船舶和点击事件 弹出信息窗口
     */
    shipAnimation: function (data) {
      let self = this
      // 图标
      let shipIcon = new BMap.Icon(self.icons.ship, new BMap.Size(40, 40), { anchor: new BMap.Size(24, 9) })
      var lnglat = self.wgs84togcj02tobd09(data.location.lon, data.location.lat)
      let point = new BMap.Point(lnglat[0], lnglat[1])
      this.ships.shipPoints.push(point)
      let marker = new BMap.Marker(point, {
        icon: shipIcon,
        rotation: parseInt(data.direct)
      })
      marker.setAnimation(BMAP_ANIMATION_DROP)
      marker.shipName = data.VNO
      this.ships.shipMarkers.push(marker)
      // 绘制地图
      this.map.addOverlay(marker)
      // // 添加点击事件
      marker.addEventListener('click', function (e) {
        self.showShipDetails(data)
      })
    },
    /**
     * bjs绘制更多船舶船讯网船舶
     */
    showMoreShipMarker: function (data) {
      let self = this
      // 图标
      let shipCXIcon = new BMap.Icon(self.icons.shipCX, new BMap.Size(40, 40), { anchor: new BMap.Size(24, 9) })
      var lnglat = self.wgs84togcj02tobd09(data.lon / 1000000, data.lat / 1000000)
      let point = new BMap.Point(lnglat[0], lnglat[1])
      this.ships.shipPoints.push(point)
      let marker = new BMap.Marker(point, {
        icon: shipCXIcon,
        rotation: parseInt(data.cog / 100)
      })
      marker.shipName = data.name
      this.moreShips.shipMarkers.push(marker)
      // 绘制地图
      this.map.addOverlay(marker)
      // // 添加点击事件
      marker.addEventListener('click', function (e) {
        self.showMoreShipDetails(data)
      })
    },
    /**
     * bjs
     * WGS84转GCj02
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    wgs84togcj02tobd09 (lng, lat) {
      const xPI = 3.14159265358979324 * 3000.0 / 180.0
      const PI = 3.1415926535897932384626
      const a = 6378245.0
      const ee = 0.00669342162296594323
      // WGS84转GCj02
      let dlat = this.transformlat(lng - 105.0, lat - 35.0)
      let dlng = this.transformlng(lng - 105.0, lat - 35.0)
      let radlat = lat / 180.0 * PI
      let magic = Math.sin(radlat)
      magic = 1 - ee * magic * magic
      let sqrtmagic = Math.sqrt(magic)
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
      let mglat = lat + dlat
      let mglng = lng + dlng
      // 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
      let z = Math.sqrt(mglng * mglng + mglat * mglat) + 0.00002 * Math.sin(mglat * xPI)
      let theta = Math.atan2(mglat, mglng) + 0.000003 * Math.cos(mglng * xPI)
      let bdlng = z * Math.cos(theta) + 0.0065
      let bdlat = z * Math.sin(theta) + 0.006
      return [bdlng, bdlat]
      // return {lng: bdlng, lat: bdlat}
    },
    transformlat (lng, lat) {
      const PI = 3.1415926535897932384626
      let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
      ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
      return ret
    },
    transformlng (lng, lat) {
      const PI = 3.1415926535897932384626
      let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
      ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
      return ret
    },
    showShipDetails (data) {
      var self = this
      if (typeof (self.timer.instance) !== 'undefined') {
        clearInterval(self.timer.instance)
      }
      var shipMarkersOld = self.ships.shipMarkers
      for (var i = 0; i < self.ships.shipMarkers.length; i++) {
        if (data.VNO !== self.ships.shipMarkers[i].shipName) {
          self.map.removeOverlay(self.ships.shipMarkers[i])
        }
      }
      var lnglat = self.wgs84togcj02tobd09(data.location.lon, data.location.lat)
      let point = new BMap.Point(lnglat[0], lnglat[1])
      postShipPortInfo({ shipName: data.VNO }).then(res => {
        if (res.resultCode.code === 1) {
          var port = res.data.port
          var work = res.data.work
          if (port === null) {
            port = {
              preCode: '',
              reportportname: '宁波港',
              reportid: '',
              preName: '',
              expecttime: '2019-03-03 09:47:00',
              reportportcode: '',
              nextName: '',
              reporttime: '',
              arrivalOrLeave: '到达',
              nextCode: ''
            }
          }
          if (work === null) {
            work = {
              work_location_name: '',
              estimated_start_time: '',
              workType: '装货',
              workload: '0',
              id: '',
              dangerous_goods_names_sum: ''
            }
          }
          var workLocatioName = '--'
          var workLoad = '--'
          var reportTime = '--'
          var estimatedStartTime = '--'
          var preName = '--'
          var reportportname = '--'
          var nextName = '--'
          if (self.isNull(port.preName)) {
            preName = port.preName
          }
          if (self.isNull(port.reportportname)) {
            reportportname = port.reportportname
          }
          if (self.isNull(port.nextName)) {
            nextName = port.nextName
          }
          if (self.isNull(work.work_location_name)) {
            workLocatioName = work.work_location_name
          }
          if (self.isNull(work.workload)) {
            workLoad = work.workload + '吨'
          }
          if (self.isNull(port.reporttime)) {
            reportTime = port.reporttime + ' <span style="color: #0BCFD9;">【详情】</span>'
          }
          if (self.isNull(work.estimated_start_time)) {
            estimatedStartTime = work.estimated_start_time + ' <span style="color: #0BCFD9;">【详情】</span>'
          }
          var content = '<div style="width: 75%; height: 65%;margin: 60px;">' +
            '<div style="color: #0BCFD9;width: 100%; text-align: center;font-size: 20px;padding: 20px;">' + data.VNO + '</div>' +
            '<div style="color: #0BCFD9;font-size: 20px;text-align: center">' +
            '<span style="display: inline-block;width: 35%;">' + (port.arrivalOrLeave === '到达' ? preName : reportportname) + '</span>' +
            '<span style="position: absolute;color: #8C6B1F;font-size: 12px;margin: -10px 30px;">' + port.arrivalOrLeave + '</span>' +
            '<span style="position: absolute;color: #8C6B1F;font-size: 12px;margin: 30px -20px;">' + port.expecttime + '</span>' +
            '<span class="line-point"></span>' +
            '<span style="display: inline-block;width: 35%;">' + (port.arrivalOrLeave !== '到达' ? nextName : reportportname) + '</span></div>' +
            '<div style="border-top: solid 1px #5C6B76;margin: 20px 12px 8px;color: #5C6B76;">' +
            '<div class="mark">' + work.workType + '</div>' +
            '<div style="color: #0BCFD9;margin: 5px;">作业信息</div>' +
            '<div style="margin: 5px;">危化品: ' + (work.dangerous_goods_names_sum + '(' + work.workType + ')') + '</div>' +
            '<div style="margin: 5px;">货物重量: ' + workLoad + '</div>' +
            '<div style="margin: 5px;">作业泊位: ' + workLocatioName + '</div></div>' +
            '<div style="border-top: solid 1px #5C6B76;margin: 15px;color: #5C6B76;">' +
            '<div style="margin: 5px;">作业申报时间: ' + reportTime + '</div>' +
            '<div style="margin: 5px;">电子报告时间: ' + estimatedStartTime + '</div></div>' +
            '<div id="shipTrace" style="color: #099EAC;margin: 8px;right: 10px;font-size: 16px;text-align: center;">' +
          /* '<button style="margin: 10px;padding: 0 10px;border: 1px solid #099EAC;outline: none;background-color: rgba(9,158,172,0.25);color: #099EAC">' +
            '船舶详情</button>' +
            '<button style="margin: 10px;padding: 0 10px;border: 1px solid #099EAC;outline: none;background-color: rgba(9,158,172,0.25);color: #099EAC">' +
            '航次轨迹</button> */ '</div></div>'
          self.clickShipDetailsList(point, content, 500, 550, self.icons.shipBg, self.icons.guanbi, '75px 65px 0 0')
          self.lastInfoBox.addEventListener('close', function (e) {
            if (self.polyline != null) {
              self.map.removeOverlay(self.polyline)
            }
            self.ships.shipMarkers = shipMarkersOld
            self.ships.shipMarkers.forEach(item => {
              self.map.addOverlay(item)
            })
            // self.apiGetRealTimeData()
            self.intervalGetRealTimeShipData()
          })
          setTimeout(() => {
            self.map.panTo(point)
          })
          var button1 = document.createElement('button')
          button1.style.margin = '10px'
          button1.style.padding = '0 10px'
          button1.style.border = '1px solid #099EAC'
          button1.style.outline = 'none'
          button1.style.backgroundColor = 'rgba(9,158,172,0.25)'
          button1.style.color = '#099EAC'
          button1.innerText = '船舶详情'
          button1.onclick = function () {
            self.$refs.shipDetail.findShipMessage(data.VNO)
            self.shipMessage = data
          }
          var button = document.createElement('button')
          button.style.margin = '10px'
          button.style.padding = '0 10px'
          button.style.border = '1px solid #099EAC'
          button.style.outline = 'none'
          button.style.backgroundColor = 'rgba(9,158,172,0.25)'
          button.style.color = '#099EAC'
          button.innerText = '航次轨迹'
          button.onclick = function () {
            var date = new Date()
            var gt = date.getTime() - 24 * 60 * 60 * 1000
            var lt = date.getTime()
            postOneShipData({ sampleTime: 'gt::' + gt + '::lt::' + lt, pageSize: 1000, pageNum: 1, shipName: data.VNO }).then(res => {
              var resultData = JSON.parse(res.data)
              if (resultData.code === 0) {
                self.shipTraceList = resultData.data.rows
                var points = []
                for (let i = 0; i < self.shipTraceList.length; i = i + 100) {
                  if (self.shipTraceList[i].location !== null && self.shipTraceList[i].location !== '') {
                    var lnglat = self.wgs84togcj02tobd09(self.shipTraceList[i].location.lon, self.shipTraceList[i].location.lat)
                    let point = new BMap.Point(lnglat[0], lnglat[1])
                    points.push(point)
                  }
                }
                if (self.polyline != null) {
                  self.map.removeOverlay(self.polyline)
                }
                self.polyline = new BMap.Polyline(points, { strokeColor: '#F8AC16', strokeWeight: 3, strokeOpacity: 0.5 })
                self.map.addOverlay(self.polyline)
              }
            }).catch(err => {
              console.log(err)
            })
          }
          $('#shipTrace').append(button1)
          $('#shipTrace').append(button)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 显示更多船舶详情
    showMoreShipDetails (data) {
      var self = this
      if (typeof (self.timer.instance) !== 'undefined') {
        clearInterval(self.timer.instance)
      }
      var lnglat = self.wgs84togcj02tobd09(data.lon / 1000000, data.lat / 1000000)
      let point = new BMap.Point(lnglat[0], lnglat[1])
      var content = '<div style="width: 75%; height: 65%;margin: 60px;">' +
        '<div style="color: #0BCFD9;width: 100%; text-align: center;font-size: 20px;padding: 10px;">' + data.name + '</div>' +
        '<div style="color: #0BCFD9;margin: 5px;font-size: 18px;">船舶详情</div>' +
        '<div style="margin: 5px;color: #0BCFD9;">船舶ID: ' + data.ShipID + '</div>' +
        '<div style="margin: 5px;color: #0BCFD9;">MMSI: ' + data.mmsi + '</div>' +
        '<div style="margin: 5px;color: #0BCFD9;">船长: ' + data.length + '米</div>' +
        '<div style="margin: 5px;color: #0BCFD9;">船宽: ' + data.width + '米</div></div>' +
        '<div id="shipTrace" style="color: #099EAC;margin: 8px;right: 10px;font-size: 16px;text-align: center;">' +
        '</div></div>'
      self.clickShipDetailsList(point, content, 500, 550, self.icons.shipBg, self.icons.guanbi, '75px 65px 0 0')
      self.lastInfoBox.addEventListener('close', function (e) {
        // self.apiGetRealTimeData()
        self.intervalGetRealTimeShipData()
      })
      setTimeout(() => {
        self.map.panTo(point)
      })
    },
    clickShipDetailsList (point, content, infoWindowWidth, infoWindowHeight, background, closeIconUrl, closeIconMargin) {
      var self = this
      if (self.lastInfoBox !== null) {
        self.lastInfoBox.close()
      }
      self.lastInfoBox = new BMapLib.InfoBox(self.map, content, {
        offset: new BMap.Size(-15, -60),
        boxStyle: {
          background: 'url("' + background + '") no-repeat center top',
          backgroundSize: '100% 95%',
          width: infoWindowWidth + 'px',
          height: infoWindowHeight + 'px'
        },
        closeIconUrl: closeIconUrl,
        closeIconWidth: '15px',
        closeIconMargin: closeIconMargin,
        enableAutoPan: true,
        align: 1
      })
      self.lastInfoBox.open(point)
    },
    /**
       * 绘制车辆添加点击事件 弹出信息窗口
       */
    drawOneCar (data) {
      let self = this
      // 图标
      let carIcon = new BMap.Icon(self.icons.car, new BMap.Size(48, 18), { anchor: new BMap.Size(24, 9) })
      let carIconNo = new BMap.Icon(self.icons.carNo, new BMap.Size(48, 18), { anchor: new BMap.Size(24, 9) })
      let point = new BMap.Point(data.lng, data.lat)
      this.cars.carPoints.push(point)
      let marker = new BMap.Marker(point, {
        icon: data.orderHeaderId === 0 ? carIconNo : carIcon,
        rotation: data.directions - 90
      })
      marker.setAnimation(BMAP_ANIMATION_DROP)
      this.cars.carMarkers.push(marker)
      // 绘制地图
      this.map.addOverlay(marker)
      // // 添加点击事件
      marker.addEventListener('click', function (e) {
        self.rightItemClick(data)
      })
    },
    /**
       * 展示车辆infobox
       */
    showCarInfoBox (data) {
      let point = new BMap.Point(data.lng, data.lat)
      let self = this
      var opts = {
        boxStyle: {
          background: '#0a3d52',
          color: 'white',
          width: 'auto',
          height: 'auto'
        },
        closeIconUrl: self.icons.close,
        closeIconMargin: '10px',
        closeIconZIndex: 1,
        closeIconWidth: '15px'
      }
      var content = `<div style="margin: 10px;min-width: 200px">
          <a target="_blank" href="${self.baseXietongUrl}/#/vehicleInfoNoLogin?plateNo=${data.vanCert}"><h3 style="font-size: 16px;color: #0de0ff;font-weight: normal;">牵引车：${data.vanCert}</h3></a>
          <ul style="list-style:none;">
            <li style="padding:10px 0 5px 0;color: #0de0ff;" ><a target="_blank" href="${self.baseXietongUrl}/#/vehicleInfoNoLogin?plateNo=${data.truckCert}"><span style="color: #0de0ff">挂车： ${data.truckCert}</span></a></li>
            <li style="padding-bottom: 5px">时速： ${data.speed}公里/小时</li>
            <li style="padding-bottom: 5px">货物： <a target="_blank" style="color: #0de0ff;cursor: pointer;" href="${self.baseXietongUrl}/#/productInfoNoLogin?name=${data.productName}">${data.productName}</a>   ${data.totalWeight}吨</li>
            <li style="padding-bottom: 5px">物流公司： <a target="_blank" href="${self.baseXietongUrl}/#/enterpriseInfoNoLogin?enterpriseCode=${data.carrierEnterpriseId}&${self.token}"><span style="color: #0de0ff">${data.carrierEnterpriseName}</span></a></li>
            <li style="padding-bottom: 5px">驾驶员： <a target="_blank" href="${self.baseXietongUrl}/#/staffInfoNoLogin?driver=${data.driverId}"><span style="color: #0de0ff">${data.driverName}</span></a>   ${data.driverPhone}</li>
            <li style="padding-bottom: 5px">押运员： <a target="_blank" href="${self.baseXietongUrl}/#/staffInfoNoLogin?supercargo=${data.driverId2}"><span style="color: #0de0ff">${data.driverName2}</span></a>   ${data.driverPhone2}</li>
            <li>
                <ul style="list-style: none;background: url('${iconArrow}') 0 5px no-repeat,url('${iconCircle}') 20px 3px  no-repeat;padding-left: 35px;">
                    <li style="padding-bottom: 5px">发货地： ${data.loadingMap}</li>
                    <li style="padding-bottom: 5px">收货地： ${data.unloadingMap}</li>
                </ul>
            </li>
            <li><a target="_blank" href="${self.baseXietongUrl}/#/productInfoNoLogin?name=${data.productName}"><img src='${iconWarning}' alt=""></a></li>
          </ul>
        </div>`
      if (!self.carInfoBox.firstClick) {
        self.carInfoBox.close()
      }
      self.carInfoBox = new BMapLib.InfoBox(self.map, content, opts)// 创建信息窗口对象
      self.carInfoBox.open(point) // 开启信息窗口
      // 添加点击事件
      self.carInfoBox.addEventListener('close', function (e) {
        // 定时器
        if (typeof (self.timer.instance) !== 'undefined') {
          clearInterval(self.timer.instance)
        }
        self.intervalGetRealTimeData()
      })
      setTimeout(() => {
        self.map.panTo(point)
      })
    },
    /**
       * 定时器请求页面数据
       */
    intervalGetRealTimeData () {
      let self = this
      this.timer.instance = setInterval(() => {
        self.apiGetRealTimeData()
      }, 10000)
    },
    intervalGetRealTimeShipData () {
      let self = this
      this.timer.instance = setInterval(() => {
        self.apiGetRealTimeData()
      }, 120000)
    },
    /**
       * 获取港区园区范围
       */
    apiGetRange () {
      let param = {
        type: ''
      }
      getRange(param).then(res => {
        if (res.code === 0) {
          this.range.parkLine = []
          res.data[0].parkOutline.forEach(item => {
            this.range.parkLine.push(new BMap.Point(item[0], item[1]))
          })
          this.range.portLine = []
          res.data[0].portOutline.forEach(item => {
            this.range.portLine.push(new BMap.Point(item[0], item[1]))
          })
          this.drawRange()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取实时数据
       */
    apiGetRealTimeData () {
      let self = this
      let params = {}
      switch (this.menuType) {
        case '全部':
          break
        case '重车':
          params.isEmpty = 1
          break
        case '空车':
          params.isEmpty = 0
          break
        case '易制毒':
          params.isMakePoison = 1
          break
        case '易制爆':
          params.isMakeBlast = 1
          break
        case '未备案':
          params.isRecord = 0
          break
      }
      if (this.menuType === '船舶') {
        var date = new Date()
        var gt = date.getTime() - 30000
        var lt = date.getTime()
        postShipMarker({ sampleTime: 'gt::' + gt + '::lt::' + lt, pageSize: 50, pageNum: 1 }).then(res => {
          var resultData = JSON.parse(res.data)
          if (resultData.code === 0) {
            self.mapData = resultData.data.rows
            self.mapData.forEach(item => {
              for (var i = 0; i < self.ships.shipMarkers.length; i++) {
                if (self.ships.shipMarkers[i].shipName === item.VNO) {
                  self.map.removeOverlay(self.ships.shipMarkers[i])
                }
              }
              self.shipAnimation(item)
            })
          }
        }).catch(err => {
          console.log(err)
        })
        if (this.isShowMoreShip === true) {
          for (var l = 0; l < this.moreShips.shipMarkers.length; l++) {
            this.map.removeOverlay(this.moreShips.shipMarkers[l])
          }
          postMoreShip({ xy: '120859200,30803400-120859200,30331200-121773400,30331200-121773400,30803400' }).then(res => {
            if (res.resultCode.code === 1) {
              res.data.data.forEach((item, index) => {
                self.showMoreShipMarker(item)
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        getData(params).then(res => {
          this.resetMap()
          if (res.code === 1) {
            self.mapData = res.data || []
            self.mapData.forEach(item => {
              self.carAnimation(item)
            })
            self.mapOldData = self.mapData
          } else {
            self.mapData = []
            self.$Message.warning('暂无数据')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    /**
       * 根据运单id查询gps，货物跟踪接口
       */
    apiGetCarGpsByOrderId (data) {
      let self = this
      // 图标
      let start = new BMap.Icon(this.icons.start, new BMap.Size(36, 48), { anchor: new BMap.Size(18, 24) })
      let end = new BMap.Icon(this.icons.end, new BMap.Size(36, 48), { anchor: new BMap.Size(18, 24) })
      // data.loadingDegree = '121.1535198632, 29.6078272674'
      // data.unloadingDegree = '121.0535198632, 30.6078272674'
      if (data.loadingDegree !== '' && data.unloadingDegree !== '') {
        let loadGps = data.loadingDegree.split(',')
        let unLoadGps = data.unloadingDegree.split(',')
        let loadPoint = new BMap.Point(loadGps[0], loadGps[1])
        let unLoadPoint = new BMap.Point(unLoadGps[0], unLoadGps[1])
        let carCurrentPoint = new BMap.Point(data.lng, data.lat)

        let startMarker = new BMap.Marker(loadPoint, { icon: start })
        let endMarker = new BMap.Marker(unLoadPoint, { icon: end })
        // 绘制地图
        this.map.addOverlay(startMarker)
        this.map.addOverlay(endMarker)

        var driving = new BMap.DrivingRoute(this.map, {
          onSearchComplete: function (res) {
            if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
              var plan = res.getPlan(0)
              var arrPois = []
              for (var j = 0; j < plan.getNumRoutes(); j++) {
                var route = plan.getRoute(j)
                arrPois = arrPois.concat(route.getPath())
              }
              var polyLine = new BMap.Polyline(arrPois, {
                strokeColor: '#88bc22',
                strokeWeight: 5
              }) // 创建折线
              self.map.addOverlay(polyLine)
            }
          }
        })
        driving.search(loadPoint, unLoadPoint, { waypoints: [carCurrentPoint] })
      }

      // getCarGpsByOrderId(data.orderHeaderId).then(res => {
      //   if (res.code === 1 && res.data.length) {
      //     res.data.map(item => {
      //       self.carLine.push(new BMap.Point(item[0], item[1]))
      //     })
      //     var polyLine = new BMap.Polyline(this.carLine, {
      //       strokeColor: '#88bc22',
      //       strokeWeight: 5
      //     }) // 创建折线
      //     self.map.addOverlay(polyLine)
      //   } else {
      //     self.$Message.warning('暂无车辆轨迹信息')
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    /**
     * 绘制泊位添加点击事件 弹出信息窗口  bjs
     */
    drawOneBerth (data) {
      let self = this
      let berthIcon = ''
      if (data.markerActive === '1') {
        berthIcon = new BMap.Icon(self.icons.berthA, new BMap.Size(28, 28), { anchor: new BMap.Size(24, 9) })
      } else {
        berthIcon = new BMap.Icon(self.icons.berth, new BMap.Size(28, 28), { anchor: new BMap.Size(24, 9) })
      }
      // 图标
      let point = new BMap.Point(data.longitude, data.latitude)
      let marker = new BMap.Marker(point, {
        icon: berthIcon
      })
      this.berthList.push(marker)
      // marker.setAnimation(BMAP_ANIMATION_DROP)
      // 绘制地图
      this.map.addOverlay(marker)
      // // 添加点击事件
      marker.addEventListener('click', function (e) {
        // console.log(data.index)
        // console.log(self.lastIndex)
        if (self.lastIndex !== -1) {
          self.markerData[self.lastIndex].markerActive = '0'
          self.drawOneBerth(self.markerData[self.lastIndex])
        }
        self.lastIndex = data.index
        data.markerActive = '1'
        self.drawOneBerth(data)
        self.$refs.berthList.berthDatas(data)
      })
    },
    showBerth () {
      postBerthList({ token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          res.data.forEach((item, index) => {
            item.markerActive = 0
            item.index = index
            this.drawOneBerth(item)
            this.markerData.push(item)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showMoreShip () {
      var self = this
      this.isShowMoreShip = true
      postMoreShip({ xy: '120859200,30803400-120859200,30331200-121773400,30331200-121773400,30803400' }).then(res => {
        if (res.resultCode.code === 1) {
          res.data.data.forEach((item, index) => {
            self.showMoreShipMarker(item)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hideMoreShip () {
      this.isShowMoreShip = false
      for (var i = 0; i < this.moreShips.shipMarkers.length; i++) {
        this.map.removeOverlay(this.moreShips.shipMarkers[i])
      }
    },
    isNull (data) {
      if (data == null || data === 'null' || data === '' || data === undefined || data === 'undefined') {
        return false
      } else {
        return true
      }
    },
    toShip (data) {
      var self = this
      var flag = true
      for (var i = 0; i < self.ships.shipMarkers.length; i++) {
        if (self.ships.shipMarkers[i].shipName === data.VNO) {
          flag = false
        }
      }
      if (flag) {
        self.shipAnimation(data)
      }
      self.showShipDetails(data)
    }
  }
}
</script>

<style lang="less" scoped>
  #realTimeMonitoring {
    width: 100%;
    height: 100%;
    position: relative;
    .branch {
      position: absolute;
      top: 100px;
      left: 10px;
      width: 30px;
      height: 440px;
      background: url("../../assets/realTimeMonitoring/i-branch7.png") no-repeat center;
      background-size: 100% 100%;
      z-index: 2;
    }

    .left-menu {
      position: absolute;
      top: 177px;
      left: 40px;
      width: 131px;
      height: 400px;
      z-index: 2;

      .menu-item {
        box-sizing: border-box;
        width: 131px;
        height: 35px;
        margin-bottom: 23px;
        padding-left: 10px;
        line-height: 35px;
        text-align: center;
        background: url("../../assets/realTimeMonitoring/i-rectangleBlue.png") no-repeat center;
        background-size: 100% 100%;
        font-size: 18px;
        color: #0df6ff;
        font-weight: normal;
        cursor: pointer;

        &.active {
          background: url("../../assets/realTimeMonitoring/i-rectangleYellow.png") no-repeat center;;
          color: #fff;
        }
      }
    }

    .rightList {
      position: absolute;
      z-index: 2;
      right: 0.7%;
      bottom: 0.9%;
      width: 17%;
      height: 90%;
      background: url("../../assets/realTimeMonitoring/i-background.png") no-repeat center;
      background-size: 100% 100%;
      padding: 30px 20px 40px 40px;
      margin: 0 auto;
      box-sizing: border-box;
      font-size: 25px;
      color: white;
    }

    .real-time-map {
      width: 100%;
      height: 100%;
    }
    .line-point {
      display: inline-block;
      width: 91px;
      height: 11px;
      background: url("../../assets/wharfMonitor/line.png") no-repeat;
    }
    .mark {
      float: right;
      width: 36px;
      height: 45px;
      background: url("../../assets/wharfMonitor/mark.png") no-repeat;
      color: #0DF6FF;
      line-height: 40px;
      text-align: center;
    }
  }
</style>
