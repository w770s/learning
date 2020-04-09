<template>
  <div id="realTimeShipMonitoring">
    <div class="branch"></div>
    <div class="left-menu">
      <h4 class="menu-item"
          @click="changeLeftMenu('全部')">全部</h4>
      <h4 class="menu-item"
          @click="changeLeftMenu('重车')">重车</h4>
      <h4 class="menu-item"
          @click="changeLeftMenu('空车')">空车</h4>
      <h4 class="menu-item"
          @click="changeLeftMenu('易制毒')">易制毒</h4>
      <h4 class="menu-item"
          @click="changeLeftMenu('易制爆')">易制爆</h4>
      <h4 class="menu-item"
          @click="changeLeftMenu('未备案')">未备案</h4>
      <h4 class="menu-item active"
          @click="changeLeftMenu('船舶')">船舶</h4>
    </div>
    <rightShipList class="rightList"  ref="rightShipList" :stg='1' @showMoreShip="showMoreShip" @hideMoreShip="hideMoreShip" @toShip="toShip"></rightShipList>
    <!--船舶详情-->
    <shipDetail ref="shipDetail" :AISData="shipMessage" ></shipDetail>
    <berthList ref="berthList" :berthData="berthData"></berthList>
    <div id="map" class="real-time-map"></div>
  </div>
</template>

<script>
import { postBerthList, postShipMarker, postShipPortInfo, postOneShipData, postMoreShip } from '@/api/pdc'
import BMap from 'BMap'
import rightShipList from './components/rightShipList'
import iconBerth from '@/assets/realTimeMonitoring/berth.png'
import iconberthA from '@/assets/realTimeMonitoring/berthActive.png'
import shipDetail from './components/shipDetail'
import shipImg from '@/assets/mapTrack/green360.png'
import shipCXImg from '@/assets/mapTrack/blue360.png'
import shipBg from '@/assets/mapTrack/window2.png'
import guanbi from '@/assets/mapTrack/close.png'
import berthList from './components/berthList'

export default {
  name: 'vehicleMonitoring',
  components: {
    rightShipList,
    shipDetail,
    berthList
  },
  data () {
    return {
      // 图标
      icons: {
        berth: iconBerth,
        berthA: iconberthA,
        ship: shipImg,
        shipCX: shipCXImg,
        shipBg: shipBg,
        guanbi: guanbi
      },
      timer: {
        instance: {},
        isStart: true
      },
      // 船舶point
      ships: {
        shipPoints: [],
        shipMarkers: []
      },
      moreShips: {
        shipPoints: [],
        shipMarkers: []
      },
      lastInfoBox: null,
      shipMessage: {},
      shipTraceList: [],
      polyline: null,
      berthData: {},
      berthList: [],
      lastIndex: -1,
      markerData: [],
      isShowMoreShip: false,
      listData: []
    }
  },
  mounted () {
    this.initMap()
    this.initShip()
    this.apiGetRealTimeData()
    this.intervalGetRealTimeShipData()
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
    changeLeftMenu (name) {
      if (name !== '船舶') {
        this.$router.push({ name: 'realTimeMonitoring' })
      }
    },
    /**
     * 初始化船舶
     */
    initShip () {
      this.intervalGetRealTimeShipData()
      this.showBerth()
    },
    /**
     * 重置地图
     */
    resetMap () {
      this.map.clearOverlays()
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
              reportportname: '未知',
              reportid: '',
              preName: '',
              expecttime: '--',
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
            '</div></div>'
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
    // /**
    //  * 获取港区园区范围
    //  */
    // apiGetRange () {
    //   let param = {
    //     type: ''
    //   }
    //   getRange(param).then(res => {
    //     if (res.code === 0) {
    //       this.range.parkLine = []
    //       res.data[0].parkOutline.forEach(item => {
    //         this.range.parkLine.push(new BMap.Point(item[0], item[1]))
    //       })
    //       this.range.portLine = []
    //       res.data[0].portOutline.forEach(item => {
    //         this.range.portLine.push(new BMap.Point(item[0], item[1]))
    //       })
    //       this.drawRange()
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    /**
     * 获取实时数据
     */
    apiGetRealTimeData () {
      let self = this
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
      //  绘制地图
      this.map.addOverlay(marker)
      // 添加点击事件
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
        postBerthList({ berthName: data.name }).then(res => {
          if (res.resultCode.code === 1) {
            // this.listData = res.data
            this.listData = res.data[0].working
            var listData1 = res.data[0].waiting
            var listData2 = res.data[0].worked
            var content = '<div>' +
              '    <div style="font-size: 16px;color: #9db1ba;padding: 0 25px;">' +
              '      <div style="font-size: 18px;color: #0DF6FF;text-align: center;margin-top: 65px;"><span>' + data.name + '</span></div>' +
              '      <div>' +
              '        <div style="text-align: left;margin-left: 80px;" id="buttomDiv"></div>' +
              '        <div style="margin-left: 60px;margin-top: 15px;height: 300px;overflow-y: auto;">' +
              '          <table id="woking" style="display: none;width: 90%;font-size: 15px;text-align: center;">' +
              '            <tr>' +
              '              <td>船舶名称</td><td>作业类型</td><td>危化品</td><td>数量</td><td>状态</td>' +
              '            </tr>'
            for (let i = 0; i < this.listData.length; i++) {
              content += '            <tr>' +
                '              <td style="width: 20%;">' + this.listData[i].shipName + '</td>' +
                '              <td style="width: 20%;">' + this.listData[i].workType + '</td>' +
                '              <td style="width: 20%;">' + this.listData[i].dangerousGoodsNamesSum + '</td>' +
                '              <td style="width: 20%;">' + this.listData[i].workload + '吨</td>' +
                '              <td style="color: #EEA515;width: 20%">正在作业</td>' +
                '            </tr>'
            }
            content += '          </table>' +
              '          <table id="willWoke" style="width: 90%;font-size: 15px;text-align: center;">' +
              '            <tr>' +
              '              <td>船舶名称</td><td>作业类型</td><td>危化品</td><td>数量</td><td>状态</td>' +
              '            </tr>'
            for (let i = 0; i < listData1.length; i++) {
              content += '            <tr>' +
                '              <td style="width: 20%;">' + listData1[i].shipName + '</td>' +
                '              <td style="width: 20%;">' + listData1[i].workType + '</td>' +
                '              <td style="width: 20%;">' + listData1[i].dangerousGoodsNamesSum + '</td>' +
                '              <td style="width: 20%;">' + listData1[i].workload + '吨</td>' +
                '              <td style="color: #EEA515;width: 20%;">未作业</td>' +
                '            </tr>'
            }
            content += '          </table>' +
              '          <table id="woked" style="display: none;width: 90%;font-size: 15px;text-align: center;">' +
              '            <tr>' +
              '              <td>船舶名称</td><td>作业类型</td><td>危化品</td><td>数量</td><td>状态</td>' +
              '            </tr>'
            for (let i = 0; i < listData2.length; i++) {
              content += '            <tr>' +
                '              <td style="width: 20%;">' + listData2[i].shipName + '</td>' +
                '              <td style="width: 20%;">' + listData2[i].workType + '</td>' +
                '              <td style="width: 20%;">' + listData2[i].dangerousGoodsNamesSum + '</td>' +
                '              <td style="width: 20%;">' + listData2[i].workload + '吨</td>' +
                '              <td style="color: #EEA515;width: 20%;">已完成作业</td>' +
                '            </tr>'
            }
            content += '          </table>' +
              '        </div>' +
              '      </div>' +
              '    </div>' +
              '  </div>'
          }
          self.clickShipDetailsList(point, content, 850, 550, self.icons.shipBg, self.icons.guanbi, '75px 85px 0 0')
          var button = document.createElement('button')
          button.style.margin = '5px'
          button.style.padding = '0'
          button.style.border = '1px solid transparent'
          button.style.outline = 'none'
          button.style.backgroundColor = 'transparent'
          button.style.color = '#099EAC'
          button.innerText = '未作业'
          var button2 = document.createElement('button')
          button2.style.margin = '5px'
          button2.style.padding = '0'
          button2.style.border = '1px solid transparent'
          button2.style.outline = 'none'
          button2.style.backgroundColor = 'transparent'
          button2.style.color = '#066EAC'
          button2.innerText = '正在作业'
          var button1 = document.createElement('button')
          button1.style.margin = '5px'
          button1.style.padding = '0'
          button1.style.border = '1px solid transparent'
          button1.style.outline = 'none'
          button1.style.backgroundColor = 'transparent'
          button1.style.color = '#066EAC'
          button1.innerText = '已完成作业'
          button.onclick = function () {
            button.style.color = '#099EAC'
            button1.style.color = '#066EAC'
            button2.style.color = '#066EAC'
            $('#woking').hide()
            $('#willWoke').show()
            $('#woked').hide()
          }
          button2.onclick = function () {
            button.style.color = '#066EAC'
            button1.style.color = '#066EAC'
            button2.style.color = '#099EAC'
            $('#woking').show()
            $('#willWoke').hide()
            $('#woked').hide()
          }
          button1.onclick = function () {
            button.style.color = '#066EAC'
            button1.style.color = '#099EAC'
            button2.style.color = '#066EAC'
            $('#woking').hide()
            $('#willWoke').hide()
            $('#woked').show()
          }
          $('#buttomDiv').append(button)
          $('#buttomDiv').append(button2)
          $('#buttomDiv').append(button1)
        }).catch(err => {
          console.log(err)
        })
        // self.$refs.berthList.berthDatas(data)
      })
    },
    showBerth () {
      postBerthList({ berthName: '' }).then(res => {
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

<style lang="less">
  #realTimeShipMonitoring {
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
