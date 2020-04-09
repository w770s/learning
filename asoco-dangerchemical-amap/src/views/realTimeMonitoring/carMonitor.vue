<template>
  <div>
    <div id="map" :loading="loading" class="echart-map"/>
    <choose-bar @chooseBar="selectBar"></choose-bar>
    <rightList
      class="carRightList"
      ref="rightList"
      :allDatas="carData"
      :intervalTime="intervalTime"
      @onItemClickListener="carItemSelect"
    />
    <rightList
      class="carRightList warning"
      ref="rightList"
      :allDatas="warnData"
      :intervalTime="intervalTime"
      @onItemClickListener="warnItemSelect"
      @showWarnList="warnlistOut"
    />
    <warnList :warnData="warnData" @warnCarPlace="warnCarSeat" />
    <Button
      type="primary"
      style="width:100px;margin-left:10px;position: absolute;left: 50px;bottom: 100px"
      round
      icon="el-icon-refresh"
      @click="changeLeftBar(chooseTitle)"
    >{{ interval.time }}s后刷新
    </Button>
    <Button
      v-show="interval.stop"
      type="warning"
      style="width:100px;margin-left:10px;position: absolute;left: 50px;bottom: 150px"
      round
      icon="el-icon-video-play"
      @click="showCarGpsLineAnim"
    >播放轨迹
    </Button>
    <Modal footer-hide title="车辆信息" width="500px" class="model-mes" v-model="dialogwarn.isShow">
      <div class="dialog-car-info" >
        <Row>
          <Col :span="12">
            <div>
              挂车：{{ dialogwarn.warnData.truckCert }}
            </div>
          </Col>
          <Col :span="12">
            <div>
              牵引车：{{ dialogwarn.warnData.vanCert }}
            </div>
          </Col>
        </Row>
        <div>
          物流公司：{{ dialogwarn.warnData.carrierEnterpriseName}}
        </div>
        <Row>
          <Col :span="12">
            <div>
              驾驶员：{{ dialogwarn.warnData.driverName}}
            </div>
          </Col>
          <Col :span="12">
            <div>
              押运员：{{ dialogwarn.warnData.driverName2}}
            </div>
          </Col>
        </Row>
        <div>
          记录时间：{{ dialogwarn.warnData.createTime }}
        </div>
        <div>
          地点：{{ dialogwarn.warnData.warnAddress }}
        </div>
        <div>
          详情：{{ dialogwarn.warnData.warnDetail }}
        </div>
      </div>
    </Modal>
    <Modal footer-hide title="车辆信息" width="500px" class="model-mes" v-model="dialog.isShow">
      <div
        v-if="dialog.carData.waybillStatus!==''&&dialog.carData.waybillStatus!=='WAYBILL-STATUS-YWC'&&dialog.carData.waybillStatus!=='WAYBILL-STATUS-YGB'"
        class="dialog-car-info">
        <Row>
          <Col :span="12">
            <div>
              车牌号：
              <a :href="[baseUrl+'/#/nologin?plateNo='+dialog.carData.carNum+'&type=car']">
                <el-button type="text" disabled>{{ dialog.carData.carNum }}</el-button>
              </a>
            </div>
          </Col>
          <Col :span="12">
            <div>
              车辆速度：{{ dialog.carData.vec1 }}km/h
            </div>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <div>
              挂车号：
              <a :href="[baseUrl+'/#/nologin?plateNo='+dialog.carData.truckCert+'&type=car']">
                <el-button type="text" disabled>{{ dialog.carData.truckCert }}</el-button>
              </a>
            </div>
          </Col>
          <Col :span="12">
            <div>
              运输产品：{{ dialog.carData.productName }}
            </div>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <div>
              驾驶员：
              <a :href="[baseUrl+'/#/nologin?idCard='+dialog.carData.driverIdcard+'&type=person']">
                <el-button type="text">{{ dialog.carData.driverName }}</el-button>
              </a>
            </div>
          </Col>
          <Col :span="12">
            <div>
              手机号：{{ dialog.carData.driverPhone }}
            </div>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <div>
              押运员：
              <a :href="[baseUrl+'/#/nologin?idCard='+dialog.carData.driverIdcard2+'&type=person']">
                <el-button type="text">{{ dialog.carData.driverName2 }}</el-button>
              </a>
            </div>
          </Col>
          <Col :span="12">
            <div>
              手机号：{{ dialog.carData.driverPhone2 }}
            </div>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <div>
              运单状态：{{ dialog.carData.waybillStatusStr }}
            </div>

          </Col>
          <Col :span="12">
            <div>
              发动机状态：{{ dialog.carData.inOnline===1?'运行中':'熄火' }}
            </div>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <div>
              进入港区：{{ dialog.carData.inFence===0?'否':'是' }}
            </div>
          </Col>
          <Col :span="12">
            <div>
              进入园区：{{ dialog.carData.inPark===0?'否':'是' }}
            </div>
          </Col>
        </Row>
        <div>
          装货地：{{ dialog.carData.loadingMap }}
        </div>
        <div>
          卸货地：{{ dialog.carData.unloadingMap }}
        </div>
        <div>
          记录时间：{{ dialog.carData.recordTime }}
        </div>
        <Row style="margin-top:10px">
          <Col class="flex-center" :span="8">
            <Button icon="el-icon-s-order" type="info" ghost @click="linkWaybillDetail(dialog.carData.waybillNo)"> 运单详情</Button>
          </Col>
          <Col class="flex-center" :span="8">
            <Button icon="el-icon-map-location" type="success" ghost @click="apiGetCarGps"> 地图轨迹</Button>
          </Col>
          <Col class="flex-center" :span="8">
            <Button icon="el-icon-plus" type="error" ghost  @click="linkProductDetail(dialog.carData.productName)"> 应急救援</Button>
          </Col>
        </Row>
      </div>
      <div v-else class="dialog-car-info">
        <Row>
          <Col :span="12">
            <div>
              车牌号：{{ dialog.carData.carNum }}
            </div>
          </Col>
          <Col :span="12">

            <div>
              车辆速度：{{ dialog.carData.vec1 }}km/h
            </div>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <div>
              进入港区：{{ dialog.carData.inFence===0?'否':'是' }}
            </div>
          </Col>
          <Col :span="12">
            <div>
              进入园区：{{ dialog.carData.inPark===0?'否':'是' }}
            </div>
          </Col>
        </Row>
        <div>
          发动机状态：{{ dialog.carData.inOnline===1?'运行中':'熄火' }}
        </div>
        <div>
          记录时间：{{ dialog.carData.recordTime }}
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import car from '@/assets/realTimeMonitoring/i-car-top.png'
import rightList from './components/rightList'
import warnList from './components/warnList'
import chooseBar from './components/chooseBar'
import iconLoad from '@/assets/realTimeMonitoring/ic-load.png'
import iconStart from '@/assets/realTimeMonitoring/ic-start.png'
import iconUnload from '@/assets/realTimeMonitoring/ic-unload.png'

import { actualMonitor, carGpsCurrent, warnCarPage, baseXietongUrl } from '@/api/whpxietong'
import { mapStyle } from '@/data/baiduMapStyle'
import { fence } from '@/data/fenceNew'

export default {
  components: {
    chooseBar,
    rightList,
    warnList
  },
  data () {
    return {
      baseUrl: '',
      chooseTitle: '全部',
      intervalTime: 'false',
      // 预警
      warnData: [],
      // 运单中的车辆
      waybillStatus: '',
      // 围栏
      fence: fence,
      loading: false,
      // 图标
      icon: {
        iconLoad: iconLoad,
        iconStart: iconStart,
        iconUnload: iconUnload,
        car: car,
        carOff: car
      },
      // 车辆数据
      carData: [],
      // 轨迹数据
      carLine: [],
      // 起点坐标终点坐标数据
      points: [
        {
          name: '起点位置',
          value: [0, 0],
          symbol: 'image://' + iconStart,
          symbolSize: [36, 48],
          symbolOffset: [0, '-50%'],
          // 标识点击不显示dialog
          vec1: -1
        },
        {
          name: '车辆位置',
          value: [0, 0],
          symbol: 'image://' + car,
          symbolSize: [18, 48],
          symbolRotate: 0,
          // 标识点击不显示dialog
          vec1: -1
        },
        {
          name: '装货地点',
          value: [0, 0],
          symbol: 'image://' + iconLoad,
          symbolSize: [36, 48],
          symbolOffset: [0, '-50%'],
          // 标识点击不显示dialog
          vec1: -1
        },
        {
          name: '卸货地点',
          value: [0, 0],
          symbol: 'image://' + iconUnload,
          symbolSize: [36, 48],
          symbolOffset: [0, '-50%'],
          // 标识点击不显示dialog
          vec1: -1
        }
      ],
      // 地图样式
      mapStyle: mapStyle,
      // eacharts实例
      myChart: {},
      searchModel: {
        data: ''
      },
      // 对话框
      dialog: {
        isShow: false,
        carData: {}
      },
      dialogwarn: {
        isShow: false,
        warnData: {}
      },
      // 定时器
      interval: {
        instance: null,
        time: 20,
        stop: false
      }
    }
  },
  created: function () {
    if (process.env.NODE_ENV === 'development') {
      this.baseUrl = 'http://ei.asoco.ac.cn'
    }
    if (process.env.NODE_ENV === 'production') {
      this.baseUrl = 'https://ei.iasoco.com'
    }
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.interval.instance)
    this.interval.instance = null
  },
  destroyed: function () {
    // 每次离开当前界面时，清除定时器
    clearInterval(this.interval.instance)
    this.interval.instance = null
  },
  mounted () {
    this.init()
    this.initInterval()
    this.apiWarnCarPage()
  },
  methods: {
    /**
     * 跳转协同应急处理
     */
    linkProductDetail (name) {
      const newTab = window.open('', '_blank')
      newTab.location.href = baseXietongUrl() + '/#/productInfo?type=1&name=' + name
    },
    /**
     * 跳转协同运单详情
     */
    linkWaybillDetail (waybillNo) {
      const newTab = window.open('', '_blank')
      newTab.location.href = baseXietongUrl() + '/#/waybillDetail?waybillNo=' + waybillNo
    },
    /**
     * 初始化定时器
     */
    warnItemSelect (item) {
      this.dialogwarn.warnData = item
      this.dialogwarn.isShow = true
      this.changeCenterCoordinate(item.lng, item.lat, item.warnAddress, item.warnDetail)
    },
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
    apiWarnCarPage () {
      warnCarPage({ page: 1, size: 100000 }).then(res => {
        this.warnData = res.data.records
        this.$set(this.warnData, 'type', '预警报警')
      })
    },
    /**
       * 初始化定时器
       */
    initInterval () {
      const that = this
      this.interval.instance = setInterval(function () {
        that.interval.time--
        if (that.interval.time === 0) {
          that.interval.time = 20
          if (!that.interval.stop) {
            that.changeLeftBar(that.chooseTitle)
          }
        }
        that.intervalTime = that.interval.time
      }, 1000)
    },
    /**
       * 初始化地图
       */
    init () {
      this.myChart = echarts.init(document.getElementById('map'))

      var option = {
        bmap: {
          center: [121.1065105456, 30.6199488101],
          zoom: 14,
          roam: true,
          mapStyle: {
            styleJson: this.mapStyle
          }
        },
        series: [...this.getFenceOptoin()]
      }
      this.myChart.setOption(option)
      const that = this
      // echarts点击事件
      this.myChart.on('click', function (params) {
        if (params.seriesType === 'scatter') {
          if (params.data.vec1 !== -1 && params.data.name !== '预警坐标') {
            that.dialog.carData = params.data
            console.log(that.dialog.carData)
            that.dialog.isShow = true
          }
          if (params.data.name === '预警坐标') {
            that.dialogwarn.isShow = true
          }
        }
      })
    },
    /**
       * @description 切换选择
       */
    selectBar (name) {
      this.changeLeftBar(name)
    },
    /**
       * @description 车辆查询车牌号查询车辆实时数据
       */
    carItemSelect (item) {
      this.dialog.carData = item
      this.dialog.isShow = true
      this.changeCenterCoordinate(item.lon, item.lat)
    },
    // 提示框 坐标
    changeCenterCoordinate (lng, lat, address, warnDetail) {
      if (this.dialog.isShow) {
        this.showAllCar()
        let option = {
          bmap: {
            center: [lng, lat],
            zoom: 16,
            roam: true,
            mapStyle: {
              styleJson: this.mapStyle
            }
          },
          series: [...this.getFenceOptoin()]
        }
        this.myChart.setOption(option)
      }
      if (this.dialogwarn.isShow) {
        let points = [
          {
            name: '预警坐标',
            value: [lng, lat],
            symbol: 'image://' + car,
            symbolSize: [18, 48],
            symbolOffset: [0, '-50%'],
            address: address,
            warnDetail: warnDetail,
            // 标识点击不显示dialog
            vec1: 1
          }
        ]
        let option = {
          bmap: {
            center: [lng, lat],
            zoom: 16,
            roam: true,
            mapStyle: {
              styleJson: this.mapStyle
            }
          },
          series: [...this.getFenceOptoin(),
            {
              name: 'points',
              type: 'scatter',
              coordinateSystem: 'bmap',
              data: points,
              label: {
                show: true,
                position: 'top',
                backgroundColor: 'rgba(10,61,82,0.3)',
                borderWidth: 1,
                borderColor: 'rgba(204,204,204,0.3)',
                padding: 5,
                textStyle: {
                  color: 'rgba(255,255,255,1)'
                },
                formatter: function (param) {
                  return param.data.warnDetail
                }
              },
              tooltip: {
                show: true,
                trigger: 'item',
                backgroundColor: '#0a3d52',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                  color: '#ffffff'
                },
                formatter: function (param) {
                  console.log(param)
                  return '预警坐标：' + param.data.address
                }
              }
            }]
        }
        this.myChart.setOption(option)
      }
    },
    /**
       * @description 切换选择参数更改
       */
    changeLeftBar (name) {
      this.dialog.isShow = false
      this.dialogwarn.isShow = false
      let obj = {}
      if (name !== this.chooseTitle) {
        this.chooseTitle = name
      }
      if (this.chooseTitle === '全部') {
        obj = {}
      }
      if (this.chooseTitle === '重车') {
        obj = { 'isEmpty': 1 }
      }
      if (this.chooseTitle === '空车') {
        obj = { 'isEmpty': 0 }
      }
      if (this.chooseTitle === '未备案') {
        obj = { 'isFiling': 1 }
      }
      if (this.chooseTitle === '易制毒' || this.chooseTitle === '易制爆') {
        this.carData = []
        this.allCarSeat = []
        this.$Message.error('请求数据不存在，请重新操作')
        this.showAllCar()
        return
      }
      this.apiGetCarInfo(obj)
    },
    /**
       * 获取所有车辆信息
       */
    apiGetCarInfo (params) {
      this.loading = true
      const that = this
      if (this.waybillStatus !== '') {
        params.waybillStatus = this.waybillStatus
      }
      actualMonitor(params).then(res => {
        this.loading = false
        if (res.code === 1 && res.data.length > 0) {
          this.carData = res.data.map(res => {
            if (res.waybillStatus !== '') {
              res.waybillStatusStr = that.getStatusStep(res.waybillStatus).str
            }
            res.name = res.carNum
            res.symbolRotate = -res.direction
            res.value = [+res.lon, +res.lat]
            res.inOnline === 1 ? res.symbol = 'image://' + that.icon.car : res.symbol = 'image://' + that.icon.carOff
            return res
          })
          this.$set(this.carData, 'type', '车辆查询')
        } else {
          this.carData = []
          this.$message.warning('暂无接入车辆信息')
        }
        this.showAllCar()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    /**
       * 展示所有车辆
       */
    showAllCar () {
      // 开启定时刷新
      this.interval.stop = false
      this.myChart.setOption({
        tooltip: {},
        series: [
          ...this.getFenceOptoin(),
          {
            name: 'points',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.carData,
            symbolSize: [18, 48],
            hoverAnimation: true,
            zlevel: 1,
            animation: false,
            label: {
              show: true,
              position: 'top',
              backgroundColor: 'rgba(10,61,82,0.3)',
              borderWidth: 1,
              borderColor: 'rgba(204,204,204,0.3)',
              padding: 5,
              textStyle: {
                color: 'rgba(255,255,255,1)'
              },
              formatter: function (param) {
                return param.data.name +
                    '\n ' + param.data.vec1 + 'km/h'
              }
            },
            tooltip: {
              show: true,
              trigger: 'item',
              backgroundColor: '#0a3d52',
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              textStyle: {
                color: '#ffffff'
              },
              formatter: function (param) {
                const baseInfo = '车牌号：' + param.data.name +
                    '<br>车辆速度：' + param.data.vec1 + 'km/h' +
                    '<br>进入园区：' + (param.data.inPark === 0 ? '否' : '是') +
                    '<br>进入港区：' + (param.data.inFence === 0 ? '否' : '是')

                const WaybillInfo = '<br>挂车号：' + param.data.truckCert + '<br>运输产品：' + param.data.productName +
                    '<br>驾驶员：' + param.data.driverName + '&nbsp;&nbsp;&nbsp;手机：' + param.data.driverPhone +
                    '<br>押运员：' + param.data.driverName2 + '&nbsp;&nbsp;&nbsp;手机：' + param.data.driverPhone2
                if (param.data.waybillStatus !== '' && param.data.waybillStatus !== 'WAYBILL-STATUS-YWC' && param.data.waybillStatus !== 'WAYBILL-STATUS-YGB') {
                  return baseInfo + WaybillInfo + '<br>记录时间：' + param.data.recordTime
                }
                return baseInfo + '<br>记录时间：' + param.data.recordTime
              }
            }
          }]
      })
    },
    /**
       * 获取GPS数据
       */
    apiGetCarGps () {
      this.dialog.isShow = false
      this.loading = true
      const param = {
        carNum: this.dialog.carData.carNum,
        loadTime: this.dialog.carData.dispatchingTime
      }
      carGpsCurrent(param).then(res => {
        this.carLine = []
        this.loading = false
        if (res.code === 1 && res.length !== 0) {
          const lines = {
            coords: []
          }
          // 起点位置
          this.points[0].value = [res.data[0].lon, res.data[0].lat]
          // 车辆当前位置
          this.points[1].value = [res.data[res.data.length - 1].lon, res.data[res.data.length - 1].lat]
          this.points[1].symbolRotate = -res.data[res.data.length - 1].direction
          this.points[2].value = this.dialog.carData.loadingDegree.split(',')
          this.points[3].value = this.dialog.carData.unloadingDegree.split(',')
          res.data.map(da => {
            da.vanCert = this.$route.query.vanCert
            da.driverName = this.$route.query.driverName
            da.driverPhone = this.$route.query.driverPhone
            lines.coords.push([da.lon, da.lat])
          })
          this.carLine.push(lines)
          this.showCarGpsLine()
        } else {
          this.$message.warning('轨迹获取失败，请确认车辆' + this.$route.query.vanCert + '已经接入GPS')
        }
      }).catch(err => {
        this.carLine = []
        this.loading = false
        console.log(err)
      })
    },
    /**
       * 展示轨迹，起点终点坐标
       */
    showCarGpsLine () {
      // 路线为空
      if (this.carLine[0].coords.length < 1) {
        this.$message.warning('车辆轨迹获取失败')
        return
      }
      // 开启定时刷新
      this.interval.stop = true
      var option = {
        series: [
          ...this.getFenceOptoin(),
          ...this.getMarkPointOption(),
          ...this.getCarGpsLineOption()
        ]
      }
      this.myChart.setOption(option)
    },
    /**
       * 开启轨迹回放 动画
       */
    showCarGpsLineAnim () {
      // 路线为空
      if (this.carLine[0].coords.length <= 1) {
        return
      }
      this.points[3] = {
        name: '车辆位置',
        value: [],
        symbol: 'image://' + this.icon.car,
        symbolSize: [18, 48],
        symbolRotate: 0
      }
      var option = {
        series: [
          ...this.getFenceOptoin(),
          ...this.getMarkPointOption(),
          ...this.getCarGpsLineOption(),
          {
            type: 'lines',
            coordinateSystem: 'bmap',
            polyline: true,
            data: this.carLine,
            lineStyle: {
              normal: {
                width: 0
              }
            },
            effect: {
              constantSpeed: 20,
              show: true,
              trailLength: 0.1,
              symbolSize: [18, 48],
              loop: false,
              symbol: 'image://' + this.icon.car
            },
            zlevel: 1
          }
        ]
      }

      this.myChart.setOption(option)
    },

    /** *********************************************抽取配置***************************************************************************************************************************************************************************/
    /**
       * GPS路线配置
       */
    getCarGpsLineOption () {
      return [{
        type: 'lines',
        coordinateSystem: 'bmap',
        polyline: true,
        data: this.carLine,
        silent: true,
        lineStyle: {
          normal: {
            color: '#8FC71B',
            opacity: 5,
            width: 2
          }
        },
        progressiveThreshold: 500,
        progressive: 200
      }]
    },
    /**
       * 起点终点装货 点配置
       */
    getMarkPointOption () {
      return [{
        name: 'points',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: this.points,
        label: {
          show: false,
          position: 'top',
          backgroundColor: 'rgba(10,61,82,0.3)',
          borderWidth: 1,
          borderColor: 'rgba(204,204,204,0.3)',
          padding: 5,
          textStyle: {
            color: 'rgba(255,255,255,1)'
          },
          formatter: function (param) {
            return param.data.name
          }
        },
        tooltip: {
          show: false
        }
      }]
    },
    /**
       * 围栏配置
       */
    getFenceOptoin () {
      return [{
        type: 'custom',
        coordinateSystem: 'bmap',
        renderItem: this.renderPort,
        itemStyle: {
          normal: {
            opacity: 0.5
          }
        },
        animation: false,
        silent: true,
        data: [0],
        z: -10
      },
      {
        type: 'custom',
        coordinateSystem: 'bmap',
        renderItem: this.renderPark,
        itemStyle: {
          normal: {
            opacity: 0.5
          }
        },
        animation: false,
        silent: true,
        data: [0],
        z: -10
      }]
    },
    /**
       * 渲染港区围栏
       */
    renderPort (params, api) {
      var coords = this.fence.port
      var points = []
      for (var i = 0; i < coords.length; i++) {
        points.push(api.coord(coords[i]))
      }
      return {
        type: 'polygon',
        shape: {
          points: echarts.graphic.clipPointsByRect(points, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          })
        },
        style: {
          fill: 'rgba(13,224,255,0.2)',
          stroke: 'rgba(13,224,255,0.8)'
        }
      }
    },
    /**
       * 渲染园区围栏
       */
    renderPark (params, api) {
      var coords = this.fence.park
      var points = []
      for (var i = 0; i < coords.length; i++) {
        points.push(api.coord(coords[i]))
      }
      return {
        type: 'polygon',
        shape: {
          points: echarts.graphic.clipPointsByRect(points, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          })
        },
        style: {
          fill: 'rgba(199,120,40,0.4)',
          stroke: 'rgba(199,120,40,0.8)'
        }
      }
    },
    /**
       * 根据状态Code获取中文
       */
    getStatusStep (status) {
      const statusObjs = [
        { name: 'WAYBILL-STATUS-DPC', step: 1, str: '待派车' },
        { name: 'WAYBILL-STATUS-DZH', step: 2, str: '待装货' },
        { name: 'WAYBILL-STATUS-DXH', step: 3, str: '待卸货' },
        { name: 'WAYBILL-STATUS-DQS', step: 4, str: '待签收' },
        { name: 'WAYBILL-STATUS-YWC', step: 5, str: '已完成' },
        { name: 'WAYBILL-STATUS-YGB', step: 5, str: '已关闭' }
      ]
      return statusObjs.find(res => {
        return res.name === status
      })
    }

  }
}
</script>
<style scoped>
  .model-mes /deep/ .ivu-modal-content {
    background-color: #0a3d52;
    border: solid 1px #0df6ff;
    margin-bottom: 20px;
    color: #fff;
  }

  .model-mes /deep/ .ivu-modal-content .ivu-modal-close .ivu-icon-ios-close {
    color: #fff;
  }

  .model-mes /deep/ .ivu-modal-content .ivu-modal-header {
    border-bottom: 1px solid #0df6ff;
  }

  .model-mes /deep/ .ivu-modal-content .ivu-modal-header .ivu-modal-header-inner {
    color: #fff;
  }

  .dialog-car-info{
    line-height: 30px;
  }

  .echart-map {
    height: 100vh;
    width: 100%;
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

  .warning{
   top: 550px;
  }
</style>
