<template>
  <div>
    <div id="map" :loading="loading" style="position: relative" />
    <el-button
      type="primary"
      style="width:150px;margin-left:10px;position: absolute;left: 50px;bottom: 180px"
      round
      icon="el-icon-refresh"
      @click="apiGetCarInfo"
    >{{ interval.time }}s后刷新</el-button>
    <el-button
      v-show="interval.stop"
      type="warning"
      style="width:150px;margin-left:10px;position: absolute;left: 50px;bottom: 250px"
      round
      icon="el-icon-video-play"
      @click="showCarGpsLineAnim"
    >播放轨迹</el-button>
    <el-button
      type="success"
      round
      style="width:150px;margin-left:10px;position: absolute;left: 50px;top: 50px"
      @click="getCarInfoByWaybillStatus('')"
    >全部&nbsp;{{ carCount.all }}
    </el-button>
    <el-button
      type="success"
      round
      style=" width:150px;position: absolute;left: 50px;top: 100px"
      @click="getCarInfoByWaybillStatus('WAYBILL-STATUS-DZH')"
    >待装货&nbsp;{{ carCount.dzh }}
    </el-button>
    <el-button
      type="success"
      round
      style="width:150px;position: absolute;left: 50px;top: 150px"
      @click="getCarInfoByWaybillStatus('WAYBILL-STATUS-DXH')"
    >待卸货&nbsp;{{ carCount.dxh }}
    </el-button>

    <div style="position: absolute;top: 50px;right: 100px">
      <el-select v-model="searchModel.data" filterable placeholder="请选择车牌号" clearable @change="onSelectedCar">
        <el-option
          v-for="item in carData"
          :key="item.carNum"
          :label="item.carNum"
          :value="item.carNum"
        />
      </el-select>
    </div>
    <el-dialog title="车辆信息" width="500px" :visible.sync="dialog.isShow">
      <div v-if="dialog.carData.waybillStatus!==''&&dialog.carData.waybillStatus!=='WAYBILL-STATUS-YWC'&&dialog.carData.waybillStatus!=='WAYBILL-STATUS-YGB'" class="dialog-car-info">
        <el-row>
          <el-col :span="12">
            <div>
              车牌号：
              <a :href="[baseUrl+'/#/nologin?plateNo='+dialog.carData.carNum+'&type=car']">
                <el-button type="text" disabled>{{ dialog.carData.carNum }}</el-button>
              </a>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              车辆速度：<el-button type="text" disabled>{{ dialog.carData.vec1 }}km/h</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              挂车号：
              <a :href="[baseUrl+'/#/nologin?plateNo='+dialog.carData.truckCert+'&type=car']">
                <el-button type="text">{{ dialog.carData.truckCert }}</el-button>
              </a>
            </div>

          </el-col>
          <el-col :span="12">
            <div>
              运输产品：
              <router-link :to="{path:'/productInfo',query:{name:dialog.carData.productName}}">
                <el-button type="text">{{ dialog.carData.productName }}</el-button>
              </router-link>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              驾驶员：
              <a :href="[baseUrl+'/#/nologin?idCard='+dialog.carData.driverIdcard+'&type=person']">
                <el-button type="text">{{ dialog.carData.driverName }}</el-button>
              </a>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              手机号：<el-button type="text" disabled>{{ dialog.carData.driverPhone }}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              押运员：
              <a :href="[baseUrl+'/#/nologin?idCard='+dialog.carData.driverIdcard2+'&type=person']">
                <el-button type="text">{{ dialog.carData.driverName2 }}</el-button>
              </a>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              手机号：<el-button type="text" disabled>{{ dialog.carData.driverPhone2 }}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              运单状态：<el-button type="text" disabled>{{ dialog.carData.waybillStatusStr }}</el-button>
            </div>

          </el-col>
          <el-col :span="12">
            <div>
              发动机状态：<el-button type="text" disabled>{{ dialog.carData.inOnline===1?'运行中':'熄火' }}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              进入港区：<el-button type="text" disabled>{{ dialog.carData.inFence===0?'否':'是' }}</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              进入园区：<el-button type="text" disabled>{{ dialog.carData.inPark===0?'否':'是' }}</el-button>
            </div>
          </el-col>
        </el-row>
        <div style="margin-bottom: 20px;margin-top: 10px">
          装货地：{{ dialog.carData.loadingMap }}
        </div>
        <div style="margin-bottom: 20px;">
          卸货地：{{ dialog.carData.unloadingMap }}
        </div>
        <div style="margin-bottom: 20px;">
          记录时间：{{ dialog.carData.recordTime }}
        </div>
        <el-row>
          <el-col class="flex-center" :span="8"> <el-button icon="el-icon-s-order" type="success" plain @click="waybillDetail"> 运单详情</el-button></el-col>
          <el-col class="flex-center" :span="8"> <el-button icon="el-icon-map-location" type="primary" plain @click="apiGetCarGps(dialog.carData.dispatchingTime)"> 地图轨迹</el-button></el-col>
          <el-col class="flex-center" :span="8"><el-button icon="el-icon-plus" type="danger"> 应急救援</el-button></el-col>
        </el-row>
      </div>
      <div v-else class="dialog-car-info">
        <el-row>
          <el-col :span="12">
            <div>
              车牌号：<el-button type="text" disabled>{{ dialog.carData.carNum }}</el-button>
            </div>
          </el-col>
          <el-col :span="12">

            <div>
              车辆速度：<el-button type="text" disabled>{{ dialog.carData.vec1 }}km/h</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div>
              进入港区：<el-button type="text" disabled>{{ dialog.carData.inFence===0?'否':'是' }}</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              进入园区：<el-button type="text" disabled>{{ dialog.carData.inPark===0?'否':'是' }}</el-button>
            </div>
          </el-col>
        </el-row>
        <div style="margin-bottom: 20px;">
          发动机状态：<el-button type="text" disabled>{{ dialog.carData.inOnline===1?'运行中':'熄火' }}</el-button>
        </div>
        <div style="margin-bottom: 20px;">
          记录时间：{{ dialog.carData.recordTime }}
        </div>
        <el-button icon="el-icon-map-location" type="primary" plain @click="showTodayGps"> 今日轨迹</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import car from '@/assets/gps/car_on.png'
import carOff from '@/assets/gps/car_off.png'
import iconLoad from '@/assets/gps/ic-load.png'
import iconUnload from '@/assets/gps/ic-unload.png'
import iconStart from '@/assets/gps/ic-start.png'

import { getAllCar, getCarGps, getCountCar } from '@/api/gps'
import { mapStyle } from '../../assets/gps/baiduMapStyle'
import { fence } from '@/assets/gps/fence'
import moment from 'moment'

export default {
  data() {
    return {
      baseUrl: '',
      // 车子统计数量
      carCount: {
        all: 0,
        dzh: 0,
        dxh: 0
      },
      // 运单中的车辆
      waybillStatus: '',
      // 围栏
      fence: fence,
      loading: false,
      // 图标
      icon: {
        car: car,
        carOff: carOff,
        iconLoad: iconLoad,
        iconUnload: iconUnload,
        iconStart: iconStart
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
          symbolSize: 30,
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
      // 定时器
      interval: {
        instance: null,
        time: 20,
        stop: false
      }
    }
  },
  created: function() {
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
  destroyed: function() {
    // 每次离开当前界面时，清除定时器
    clearInterval(this.interval.instance)
    this.interval.instance = null
  },
  mounted() {
    this.init()
    this.apiGetCarInfo()
    this.initInterval()
    this.apiGetCountCar()
  },
  methods: {
    /**
     * 初始化定时器
     */
    initInterval() {
      const that = this
      this.interval.instance = setInterval(function() {
        that.interval.time--
        if (that.interval.time === 0) {
          that.interval.time = 20
          if (!that.interval.stop) {
            that.apiGetCarInfo()
          }
        }
      }, 1000)
    },
    /**
       * 初始化地图
       */
    init() {
      var main = document.getElementById('map')
      main.style.width = window.innerWidth + 'px'
      main.style.height = ((window.innerHeight) * 0.9) + 'px'
      this.myChart = echarts.init(document.getElementById('map'))

      var option = {
        series: [...this.getFenceOptoin()]
      }
      option.bmap = this.getMapOption([121.1065105456, 30.6199488101], 14)
      this.myChart.setOption(option)
      const that = this
      // echarts点击事件
      this.myChart.on('click', function(params) {
        if (params.seriesType === 'scatter') {
          if (params.data.vec1 !== -1) {
            that.dialog.carData = params.data
          }
          that.dialog.isShow = true
        }
      })
    },
    /**
     * @description 查看运单详情
     */
    waybillDetail() {
      this.$router.push({ path: '/waybill/detail', query: { waybillNo: this.dialog.carData.waybillNo }})
    },
    /**
     * select选中一辆车
     */
    onSelectedCar(data) {
      if (data !== null) {
        this.dialog.carData = this.carData.find(res => {
          return res.carNum === data
        })
        var option = {}
        option.bmap = this.getMapOption(this.dialog.carData.value, 16)
        this.myChart.setOption(option)
        this.dialog.isShow = true
      }
    },
    /**
     * 条件查询车辆
     */
    getCarInfoByWaybillStatus(waybillStatus) {
      this.waybillStatus = waybillStatus
      this.apiGetCarInfo()
    },
    apiGetCountCar() {
      getCountCar().then(res => {
        this.carCount = res.data
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    /**
     * 获取所有车辆信息
     */
    apiGetCarInfo() {
      this.loading = true
      const that = this
      const params = {}
      if (this.waybillStatus !== '') {
        params.waybillStatus = this.waybillStatus
      }
      getAllCar(params).then(res => {
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
    showAllCar() {
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
            symbolSize: 30,
            hoverAnimation: true,
            zlevel: 1,
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
              formatter: function(param) {
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
              formatter: function(param) {
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
    showTodayGps() {
      this.apiGetCarGps(moment().format('YYYY-MM-DD') + ' 00:00:00')
    },
    /**
       * 获取GPS数据
       */
    apiGetCarGps(loadTime) {
      this.dialog.isShow = false
      this.loading = true
      const param = {
        carNum: this.dialog.carData.carNum,
        loadTime: loadTime
      }
      getCarGps(param).then(res => {
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
    showCarGpsLine() {
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
    showCarGpsLineAnim() {
      // 路线为空
      if (this.carLine[0].coords.length <= 1) {
        return
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
              symbolSize: 30,
              loop: false,
              symbol: 'image://http://lbsyun.baidu.com/trace/admin/static/images/carrunnorth_0b97e64.png'
            },
            zlevel: 1
          }
        ]
      }

      this.myChart.setOption(option)
    },

    /** *********************************************抽取配置***************************************************************************************************************************************************************************/
    getMapOption(center, zoom) {
      return {
        center: center,
        zoom: zoom,
        roam: true,
        mapStyle: {
          styleJson: this.mapStyle
        }
      }
    },

    /**
     * GPS路线配置
     */
    getCarGpsLineOption() {
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
    getMarkPointOption() {
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
          formatter: function(param) {
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
    getFenceOptoin() {
      const that = this
      return [{
        type: 'custom',
        coordinateSystem: 'bmap',
        renderItem: function(params, api) {
          var coords = that.fence.port
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
        renderItem: function(params, api) {
          var coords = that.fence.park
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
     * 根据状态COde获取中文
     */
    getStatusStep(status) {
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
<style lang="scss" scoped>
.dialog-car-info {
  font-size: 16px;
  color: #303133;
}
</style>
