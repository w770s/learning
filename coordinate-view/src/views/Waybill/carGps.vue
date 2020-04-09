<template>
  <div>
    <div id="map" style="position: relative" />
    <div style="position: absolute;bottom: 0px;width: 100%">
      <el-table
        v-loading="loading"
        :data="data"
        height="300"
        border
        style="width: 100%"
        @row-click="itemClick"
      >
        <el-table-column
          align="center"
          type="index"
        />
        <el-table-column
          align="center"
          prop="vanCert"
          label="车牌号"
          width="180"
        />
        <el-table-column
          align="center"
          prop="driverName"
          label="司机"
          width="180"
        />
        <el-table-column
          align="center"
          prop="driverPhone"
          label="联系方式"
        />
        <el-table-column
          align="center"
          prop="recordTime"
          label="时间"
        />
        <el-table-column
          align="center"
          prop="vec1"
          label="采集速度"
        />
        <el-table-column
          align="center"
          prop="vec2"
          label="行驶速度"
        />
        <el-table-column
          align="center"
          prop="direction"
          label="方向"
        />
        <el-table-column
          align="center"
          prop="lat"
          label="经度"
        />
        <el-table-column
          align="center"
          prop="lon"
          label="纬度"
        />
      </el-table>
    </div>
    <el-button icon="el-icon-caret-right" style="position: absolute;bottom: 330px;right: 50px" @click="startAnim">轨迹回放</el-button>
  </div>
</template>
<script>
import car from '@/assets/gps/car_on.png'
import iconReceiver from '@/assets/gps/i-receiver.png'
import iconSuppiler from '@/assets/gps/i-suppiler.png'

import iconLoad from '@/assets/gps/ic-load.png'
import iconUnload from '@/assets/gps/ic-unload.png'
import iconStart from '@/assets/gps/ic-start.png'
import { getCarGps } from '@/api/gps'
import { mapStyle } from '../../assets/gps/baiduMapStyle'
import { fence } from '@/assets/gps/fence'
export default {
  data() {
    return {
      loading: false,
      icon: {
        receiver: iconReceiver,
        suppiler: iconSuppiler,
        car: car
      },
      mapStyle: mapStyle,
      data: [],
      myChart: [],
      carLine: [],
      // 围栏
      fence: fence,
      // 起点坐标终点坐标数据
      points: [
        {
          name: '起点位置',
          value: [0, 0],
          symbol: 'image://' + iconStart,
          symbolSize: [36, 48],
          symbolOffset: [0, '-50%']
        },
        {
          name: '车辆位置',
          value: [0, 0],
          symbol: 'image://' + car,
          symbolSize: 30,
          symbolRotate: 0,
          label: {
            show: true,
            position: 'top',
            backgroundColor: 'rgba(10,61,82,0.5)',
            borderWidth: 1,
            borderColor: 'rgba(204,204,204,0.5)',
            padding: 5,
            textStyle: {
              color: 'rgba(255,255,255,1)'
            },
            formatter: function(param) {
              return param.data.carNum +
                '\n速度：' + param.data.vec1 + 'km/h' +
              '\n ' + param.data.recordTime
            }
          }
        },
        {
          name: '装货地点',
          value: [0, 0],
          symbol: 'image://' + iconLoad,
          symbolSize: [36, 48],
          symbolOffset: [0, '-50%']
        },
        {
          name: '卸货地点',
          value: [0, 0],
          symbol: 'image://' + iconUnload,
          symbolSize: [36, 48],
          symbolOffset: [0, '-50%']
        }
      ]
    }
  },
  mounted() {
    this.init()
    // this.initMap()
    this.apiGetCarGps()
  },
  methods: {
    /**
     * 初始化地图
     */
    init() {
      var main = document.getElementById('map')
      main.style.width = window.innerWidth + 'px'
      main.style.height = ((window.innerHeight) * 0.9) + 'px'
      // var footer = document.getElementById('footer')
      // footer.style.width = window.innerWidth + 'px'
      // footer.style.height = ((window.innerHeight) * 0.3) + 'px'
      this.myChart = echarts.init(document.getElementById('map'))
      var option = {
        series: [...this.getFenceOptoin()]
      }
      option.bmap = this.getMapOption([121.1065105456, 30.6199488101], 14)
      this.myChart.setOption(option)
    },
    /**
     * 获取GPS数据
     */
    apiGetCarGps() {
      this.loading = true
      this.points[1].carNum = this.$route.query.vanCert
      this.points[2].value = this.$route.query.loadingDegree.split(',')
      this.points[3].value = this.$route.query.unloadingDegree.split(',')
      const param = {
        carNum: this.$route.query.vanCert,
        loadTime: this.$route.query.loadTime,
        unLoadTime: this.$route.query.unLoadTime
      }
      // const param = {
      //   carNum: '浙FJ1702',
      //   loadTime: '2019-06-26 00:45:35'
      // }
      getCarGps(param).then(data => {
        this.loading = false
        if (data.code === 1 && data.length !== 0) {
          const lines = {
            coords: []
          }
          this.data = data.data
          this.points[0].value = [this.data[0].lon, this.data[0].lat]
          this.points[1].value = [this.data[ this.data.length - 1].lon, this.data[this.data.length - 1].lat]
          this.points[1].vec1 = this.data[ this.data.length - 1].vec1
          this.points[1].recordTime = this.data[ this.data.length - 1].recordTime
          this.points[1].symbolRotate = -this.data[ this.data.length - 1].direction
          this.data.map(da => {
            da.vanCert = this.$route.query.vanCert
            da.driverName = this.$route.query.driverName
            da.driverPhone = this.$route.query.driverPhone
            // da.loc_time = xeUtils.toDateString(da.loc_time * 1000)
            lines.coords.push([da.lon, da.lat])
          })
          this.carLine.push(lines)
          this.setData()
        } else {
          this.$message.warning('轨迹获取失败，请确认车辆' + this.$route.query.vanCert + '已经接入GPS')
        }
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    /**
     * 展示轨迹，起点终点坐标
     */
    setData() {
      var option = {
        series: [
          ...this.getFenceOptoin(),
          {
            name: 'points',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.points,
            tooltip: {
              trigger: 'item',
              backgroundColor: '#0a3d52',
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              textStyle: {
                color: '#ffffff'
              },
              formatter: function(param) {
                return param.name
              }
            }
          }
        ]
      }
      // 路线为空
      if (this.carLine[0].coords.length > 1) {
        option.series.push(
          {
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
          })
        option.bmap = this.getMapOption(this.carLine[0].coords[0], 13)
      }

      this.myChart.setOption(option)
    },
    /**
     * 开启轨迹回放
     */
    startAnim() {
      // 路线为空
      if (this.carLine[0].coords.length <= 1) {
        return
      }
      this.points[1].value = []
      // this.myChart.clear()
      // this.myChart = echarts.init(document.getElementById('map'))
      var option = {
        series: [
          ...this.getFenceOptoin(),
          {
            name: 'points',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.points,
            tooltip: {
              trigger: 'item',
              backgroundColor: '#0a3d52',
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              showContent: true,
              textStyle: {
                color: '#ffffff'
              },
              formatter: function(param) {
                return param.name
              }
            }
          },
          {
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
          },
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
    /**
     * 表格点击展示
     */
    itemClick(item) {
      // 设置点位车辆位置
      this.points[1].value = [item.lon, item.lat]
      this.points[1].vec1 = item.vec1
      this.points[1].recordTime = item.recordTime
      this.points[1].symbolRotate = -item.direction
      var option = {
        series: [
          // 点位信息
          {
            name: 'points',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.points,
            tooltip: {
              trigger: 'item',
              backgroundColor: '#0a3d52',
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              textStyle: {
                color: '#ffffff'
              },
              formatter: function(param) {
                return param.name
              }
            }
          }
        ]
      }
      // 路线为空
      if (this.carLine[0].coords.length > 1) {
        option.series.push(
          {
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
          })
      }
      this.myChart.setOption(option)
    },
    // 地图配置
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
    }
  }
}
</script>
<style scoped>

</style>
