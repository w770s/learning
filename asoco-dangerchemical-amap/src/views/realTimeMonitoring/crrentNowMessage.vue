<template>
  <div id="realTimeMonitoring">
    <choose-bar @chooseBar="selectBar"></choose-bar>
    <rightList
      class="carRightList"
      ref="rightList"
      :allDatas="mapData"
      @onItemClickListener="carItemSelect"
    />
    <rightList
      class="carRightList warning"
      ref="rightList"
      :allDatas="warnData"
      @onItemClickListener="warnItemSelect"
      @showWarnList="warnlistOut"
    />
    <warn-list :warnData="warnData" @warnCarPlace="warnCarSeat"></warn-list>
    <baidu-map class="bm-view"
               :center="centerPoint"
               :zoom="15"
               :mapStyle="mapStyle"
               :scroll-wheel-zoom="true">
      <bm-polyline :path="lineArr"
                   v-if="polyline"
                   stroke-color="#8FC71B"
                   :stroke-opacity="1"
                   :stroke-weight="5">
      </bm-polyline>
      <bm-marker :position="startPoint"
                 :icon="iconStart">
      </bm-marker>
      <bm-marker :position="endPoint"
                 :icon="iconEnd">
      </bm-marker>
      <div v-for="(item,index) in allCarSeat" :key="index">
        <bm-marker :position="{'lat':item.lat , 'lng': item.lon}"
                   :rotation="parseInt(item.direction)"
                   :icon="icon" @click="openMesBox(item)">
        </bm-marker>
      </div>
      <bm-polygon :path="fence.port" stroke-color="#0de0ff" fill-color="#0de0ff" :fillOpacity="0.2"
                  :stroke-weight="2"/>
      <bm-polygon :path="fence.park" stroke-color="#c77828" fill-color="#c77828" :fillOpacity="0.4"
                  :stroke-weight="2"/>
      <my-overlay
        :position="{lng: infoWindow.lng, lat: infoWindow.lat}"
        :content="infoWindow.contents"
        v-if="infoWindow.show"
        @iconCont="iconDisappear"
      >
      </my-overlay>
    </baidu-map>
  </div>
</template>

<script>
import {
  actualMonitor,
  carGpsCurrent
} from '@/api/map'
import rightList from './components/rightList'
import moment from 'moment'
import chooseBar from './components/chooseBar'
import myOverlay from './components/bmoverlay'
import warnList from './components/warnList'
import { fence } from '@/data/fence'
import { mapStyle } from '@/data/baiduMapStyle'
import iconCar from '@/assets/realTimeMonitoring/i-car.png'
import iconStart from '@/assets/realTimeMonitoring/i-suppiler.png'
import iconEnd from '@/assets/realTimeMonitoring/i-receiver.png'

export default {
  name: 'vehicleMonitoring',
  components: {
    warnList,
    chooseBar,
    rightList,
    myOverlay
  },
  data () {
    return {
      fence: {
        park: fence.park,
        port: fence.port
      },
      loadArray: [],
      allCarSeat: [],
      centerPoint: {
        lng: '121.1065105456',
        lat: '30.6199488101'
      },
      icon: {
        url: iconCar,
        size: { width: 52, height: 26 },
        opts: { anchor: { width: 27, height: 13 } }
      },
      iconStart: {
        url: iconStart,
        size: { width: 36, height: 49 },
        opts: { anchor: { width: 27, height: 13 } }
      },
      iconEnd: {
        url: iconEnd,
        size: { width: 36, height: 49 },
        opts: { anchor: { width: 27, height: 13 } }
      },
      lineArr: [],
      startPoint: { lng: '', lat: '' },
      endPoint: { lng: '', lat: '' },
      infoWindow: {
        show: false,
        contents: {},
        lng: '',
        lat: ''
      },
      mapData: [],
      warnData: [],
      currentPage: 1,
      warnPage: 1,
      warnNum: 0,
      chooseTitle: '全部',
      mapStyle: {
        styleJson: mapStyle
      },
      carMesOpen: false,
      polyline: false
    }
  },
  mounted () {
    this.everySameTime()
  },
  filters: {
    formatDate: function (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    // 定时刷新
    everySameTime () {
      setInterval(() => {
        if (this.polyline || this.carMesOpen) {
          return
        }
        this.changeLeftBar(this.chooseTitle)
      }, 10000)
    },
    // 重置
    resetBack () {
      this.infoWindow.show = false
      this.carMesOpen = false
      this.polyline = false
      this.lineArr = []
      this.infoWindow.contents = {}
      this.startPoint = { lng: '', lat: '' }
      this.endPoint = { lng: '', lat: '' }
      this.centerPoint = {
        lng: '121.1065105456',
        lat: '30.6199488101'
      }
    },
    iconDisappear () {
      let name = this.chooseTitle
      this.selectBar(name)
    },
    /**
       *chooseBar选择的类别
       */
    selectBar (name) {
      this.resetBack()
      this.changeLeftBar(name)
    },
    changeLeftBar (name) {
      let obj = {}
      if (name !== this.chooseTitle) {
        this.chooseTitle = name
      }
      if (name === '全部') {
        obj = {}
      }
      if (name === '重车') {
        obj = { 'isEmpty': 0 }
      }
      if (name === '空车') {
        obj = { 'isEmpty': 1 }
      }
      if (name === '未备案') {
        obj = { 'isFiling': 1 }
      }
      if (name === '易制毒' || name === '易制爆') {
        this.mapData = []
        this.allCarSeat = []
        this.$Message.error('请求数据不存在，请重新操作')
        return
      }
      this.apiGetRealTimeData(obj)
    },
    /**
       *  实时监控
       */
    apiGetRealTimeData (obj, item) {
      actualMonitor(obj).then(res => {
        this.mapData = []
        this.allCarSeat = []
        this.mapData = res.data
        this.allCarSeat = res.data
        this.$set(this.mapData, 'type', '车辆查询')
        if (this.carMesOpen) { // 车辆点击单独显示
          this.centerPoint.lat = item.lat
          this.centerPoint.lng = item.lon

          this.startPoint.lng = item.loadingDegree.split(',')[0]
          this.startPoint.lat = item.loadingDegree.split(',')[1]
          this.endPoint.lng = item.unloadingDegree.split(',')[0]
          this.endPoint.lat = item.unloadingDegree.split(',')[1]

          this.infoWindow.lng = item.lon
          this.infoWindow.lat = item.lat
          this.infoWindow.show = true
          this.infoWindow.contents = this.allCarSeat[0]
          this.$set(this.infoWindow.contents, 'type', false)
          if (item.waybillStatus !== '' && item.waybillStatus !== 'WAYBILL-STATUS-YWC') {
            let data = {
              carNum: item.carNum,
              loadTime: item.dispatchingTime
            }
            this.apiCarGpsCurrent(data)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 运单车辆轨迹
     */
    apiCarGpsCurrent (data) {
      carGpsCurrent(data).then(res => {
        this.lineArr = []
        res.data.map((item) => {
          let obj = {
            lat: item.lat,
            lng: item.lon
          }
          this.lineArr.push(obj)
        })
        this.polyline = true
      })
    },
    /**
     * 地图车辆点击出现信息窗
     */
    openMesBox (item) {
      this.carMesOpen = true
      if (item.vanCert === '浙FJ3552') {
        return
      }
      let obj = {
        carNum: item.carNum
      }
      this.apiGetRealTimeData(obj, item)
    },
    /**
     * 车辆查询车牌号查询车辆实时数据
     */
    carItemSelect (item) {
      this.openMesBox(item)
    },

    /**
       * 预警报警弹窗分页
       */
    warnlistOut () {
      this.$set(this.warnData, 'showlist', true)
    },
    /**
       * 预警报警列表弹框显示车辆位置
       */
    warnCarSeat (item) {
      this.warnItemSelect(item)
      this.$set(this.warnData, 'showlist', false)
    },
    /**
       * 预警报警车牌号查询车辆实时数据
       * 车辆查询的路线图和起点终点坐标消失
       */
    warnItemSelect (item) {
      this.lineArr = []
      this.startPoint = { lng: '', lat: '' }
      this.endPoint = { lng: '', lat: '' }
      this.allCarSeat = [item]
      this.centerPoint.lat = item.lat
      this.centerPoint.lng = item.lng
      this.infoWindow.lng = item.lng
      this.infoWindow.lat = item.lat
      // 触顶限制请求次数
      if (this.warnPage < 1) {
        this.warnPage = 1
        return
      }
      let params = { 'page': this.warnPage, 'limit': '20', 'vanCert': item.vanCert }
      warnCarPage(params).then(res => {
        let warnData = res.data.records[0]
        if (warnData) {
          this.infoWindow.contents = warnData
        } else {
          warnData = res.data.records
          this.infoWindow.contents = warnData
        }
        this.$set(warnData, 'type', '预警报警')
        this.infoWindow.show = true
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .bm-view {
    width: 100%;
    height: 100%;
  }

  #realTimeMonitoring {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .carRightList {
    position: absolute;
    z-index: 2;
    top: 100px;
    right: 0.7%;
    width: 250px;
    height: 400px;
    background: url("../../assets/realTimeMonitoring/i-background.png") no-repeat center;
    background-size: 100% 100%;
    padding: 30px 10px 20px 10px;
    box-sizing: border-box;
    font-size: 25px;
    color: white;
  }

  .warning {
    top: 550px;
  }

  .perRightList {
    top: 520px;
  }

  .early-warning {
    top: 600px;
  }

  .real-time-map {
    width: 100%;
    height: 100%;
  }

  .warningList {
    width: 300px;
    height: 350px;
    background-color: #041a2d;
    border-radius: 10px;
    border: solid 1px #1691a1;
  }

</style>
