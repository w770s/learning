<template>
  <div class="map-container">
    <div id="map" ref="map"></div>
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
      <div class="map-tab-item country" :class="{ active: mapLevel === $config.mapLevel.country }"
           @click="changeMapLevel($config.mapLevel.country)"></div>
      <div class="map-tab-item province" :class="{ active: mapLevel === $config.mapLevel.province }"
           @click="changeMapLevel($config.mapLevel.province)"></div>
      <div class="map-tab-item city" :class="{ active: mapLevel === $config.mapLevel.city }"
           @click="changeMapLevel($config.mapLevel.city)"></div>
    </div>
    <div class="bottom-data">
      <Row style="width: 100%;height: 100%">
        <i-col style="height: 100%" span="10">
          <div class="bottom-inOutChart" id="inOutTrendChart"></div>
        </i-col>
        <i-col style="height: 100%" span="7">
          <div class="bottom-loadChemicalChart" id="loadChemicalChart"></div>
        </i-col>
        <i-col style="height: 100%" span="7">
          <div class="bottom-unLoadChemicalChart" id="unLoadChemicalChart"></div>
        </i-col>
      </Row>
    </div>
    <div class="right-data">
      <div class="header-data">
        <div class="rightHeader">
          <span class="time">{{$moment().format('YYYY年MM月DD日')}}</span>
          <img src="../assets/map/ic_export_report.png" width="100" height="28"
               style="margin-left: 30px" alt="" @click="downLoadExcel()"/>
        </div>
        <br/>
        <Row class="data-title">
          <i-col span="12"><img src="../assets/map/ic-building.png" alt="">&nbsp;企业总数</i-col>
          <i-col span="12"><img src="../assets/map/ic-person.png" alt="">&nbsp;人员总数</i-col>
        </Row>
        <Row class="data-content">
          <i-col span="12">{{basicData.enterpriseNum}}</i-col>
          <i-col span="12">{{basicData.employeeNum}}</i-col>
        </Row>
        <Row class="data-title">
          <i-col span="12"><img src="../assets/map/ic-car.png" alt="">&nbsp;车辆总数</i-col>
          <i-col span="12"><img src="../assets/map/ic-rectangle.png" alt="">&nbsp;罐体总数</i-col>
        </Row>
        <Row class="data-content">
          <i-col span="12">{{basicData.trailerNum}}</i-col>
          <i-col span="12">{{basicData.tankerNum}}</i-col>
        </Row>
        <Row class="data-title">
          <i-col span="12"><img src="../assets/map/ic-order.png" alt="">&nbsp;运单量</i-col>
          <i-col span="12"><img src="../assets/map/ic-cargoheap.png" alt="">&nbsp;装卸货总量</i-col>
        </Row>
        <Row class="data-content">
          <i-col span="12">{{basicData.waybillNum}}</i-col>
          <i-col span="12">{{basicData.freightNum}}</i-col>
        </Row>
      </div>
      <!--<h4>进出园区车辆情况/日</h4>-->
      <div class="bottom-charts">
        <div class="right-inOutVehicleChart" id="inOutVehicleChart"></div>
        <div class="right-inOutVehicleChart" id="loadUnloadGoodsChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import inMap from 'inMap'
// import BMap from 'BMap'
import { china } from '@/data/countryOverlay'
import { zhejiang } from '@/data/provinceOverlay'
import { jiaxing } from '@/data/cityOverlay'
import { currency } from '@/filters'
import config from '@/config'
import { cargoDayRank, hazardousChemicalMap, cargoOfDay, firmStatistics, trendInTrendOut, baseXietongUrl } from '@/api/whpxietong'
import { getWasteFlowOut, getWasteFlowIn,
  getWasteFlowOutProvince, getWasteFlowInProvince, getWasteFlowInCity, getWasteFlowOutCity } from '@/api/map'
export default {
  data () {
    return {
      inMap: null, // imMap 对象
      bMap: null, // 百度地图对象
      mapLevel: config.mapLevel.country, // 地图层级
      flowType: config.flowType.chymistIn, // 流动类型  chymistIn | chymistOut | wasteIn | wasteOut
      polygonOverlay: null, // 轮廓图层
      moveLineOverlay: null, // 飞线图层
      flowData: { // 流向数据
        country: {
          chymistIn: '', // 国内视图危化品流入
          chymistOut: '', // 国内视图危化品流出
          wasteIn: '', // 国内视图危险废物流入
          wasteOut: '' // 国内视图危险废物流出
        },
        province: {
          chymistIn: '', // 省内视图危化品流入
          chymistOut: '', // 省内视图危化品流出
          wasteIn: '', // 省内视图危险废物流入
          wasteOut: '' // 省内视图危险废物流出
        },
        city: {
          chymistIn: '', // 市内视图危化品流入
          chymistOut: '', // 市内视图危化品流出
          wasteIn: '', // 市内视图危险废物流入
          wasteOut: '' // 市内视图危险废物流出
        }
      },
      basicData: {
        enterpriseNum: '0',
        employeeNum: '0',
        trailerNum: '0',
        tankerNum: '0',
        waybillNum: '0',
        freightNum: '0'
      }, // 基本数据
      inflowTendency: [0, 0, 0, 0, 0, 0, 0], // 流入趋势
      outflowTendency: [0, 0, 0, 0, 0, 0, 0], // 流出趋势
      inOutTendencyDate: [], // 流入流出趋势的时间
      inOutVehicleNumber: [200, 230, 260], // 进出园区的车辆数目
      inOutVehicle: ['进入园区', '驶出园区', '区内车辆'], // 进出园区的车辆
      inOutVehicleTableList: [
        { value: 0, name: '进入园区' },
        { value: 0, name: '驶出园区' },
        { value: 0, name: '区内车辆' }
      ],
      loadUnloadGoodsTableList: [
        { value: 0, name: '装货量' },
        { value: 0, name: '卸货量' }
      ],
      loadingWeightTableList: [],
      unloadingWeightTableList: [],
      chartLoadUnLoadGoods: {},
      chartInOUtVehicle: {},
      chartUnLoadChemical: {},
      chartLoadChemical: {},
      chartInOutTrend: {}
    }
  },
  filters: {
    currency
  },
  mounted () {
    this.initMap()

    this.getMoveLineCountryData()
    this.getMoveLineProvinceData()
    this.getMoveLineCityData()

    this.initInOutTrendChart()
    this.initLoadChemicalChart()
    this.initUnLoadChemicalChart()

    this.initInOutVehicleChart()
    this.initLoadGoodsChart()

    this.apiFirmTotal()
    this.apigetData()
    this.apiCargoDayNumber()
    this.apiTrendInTrendOut()
  },
  methods: {
    /**
       * 刷新图表
       */
    refreshChart () {
      let self = this
      this.chartInOutTrend.setOption({
        series: [
          {
            name: '流入数量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: self.inflowTendency,
            smooth: true
          },
          {
            name: '流出数量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: self.outflowTendency,
            smooth: true
          }
        ]
      })
      // 装货化学品排名
      if (self.loadingWeightTableList.length > 0) {
        this.chartLoadChemical.setOption({
          series: [
            {
              data: self.loadingWeightTableList
            }
          ]
        })
      }
      // 卸货化学品排名
      if (self.unloadingWeightTableList.length > 0) {
        this.chartUnLoadChemical.setOption({
          series: [
            {
              data: self.unloadingWeightTableList
            }
          ]
        })
      }
      // 进出园区车辆情况
      this.chartInOUtVehicle.setOption({
        series: [
          {
            data: self.inOutVehicleTableList
          }
        ]
      })
      // 装卸货数据量
      this.chartLoadUnLoadGoods.setOption({
        series: [
          {
            data: self.loadUnloadGoodsTableList
          }
        ]
      })
    },
    /**
       * 获取企业所有数据
       */
    apiFirmTotal () {
      firmStatistics().then(res => {
        this.basicData = Object.assign(this.basicData, res.data)
        this.refreshChart()
      })
    },
    /**
     * 装卸货化学品排名/日
     */
    apiCargoDayNumber () {
      cargoOfDay({}).then(res => {
        // 装卸货
        if (typeof res.data !== 'undefined') {
          this.loadUnloadGoodsTableList[0].value = res.data.loadingWeight
          this.loadUnloadGoodsTableList[1].value = res.data.unloadingWeight
        }
        this.refreshChart()
      })
    },
    /**
     * 查询七日流入流出趋势
     */
    apiTrendInTrendOut () {
      trendInTrendOut({}).then(res => {
        this.inflowTendency = [0, 0, 0, 0, 0, 0, 0]
        this.outflowTendency = [0, 0, 0, 0, 0, 0, 0]
        this.inOutTendencyDate = []
        for (let i = 6; i >= 0; i--) {
          this.inOutTendencyDate.push(this.$moment().subtract(i, 'days').format('YYYY-MM-DD'))
        }
        res.data.inFlow.map((item) => {
          if (this.inOutTendencyDate.indexOf(item.flowTime) !== -1) {
            this.inflowTendency[this.inOutTendencyDate.indexOf(item.flowTime)] = item.totalWeight
          }
        })
        res.data.outFlow.map((item, index) => {
          if (this.inOutTendencyDate.some(item2 => item.flowTime === item2)) {
            this.outflowTendency[this.inOutTendencyDate.indexOf(item.flowTime)] = item.totalWeight
          }
        })
        this.refreshChart()
      })
    },
    /**
     * 装卸货数量/日
     */
    apigetData () {
      let self = this
      cargoDayRank({}).then(res => {
        let chemicalOrder = res.data
        // 装货化学品排名
        self.loadingWeightTableList = []
        if (typeof chemicalOrder.loadingChemical !== 'undefined') {
          chemicalOrder.loadingChemical.map((item, index) => {
            self.loadingWeightTableList.push({
              value: item.totalWeight,
              name: item.productName
            })
          })
        }

        // 卸货化学品排名
        self.unloadingWeightList = []
        if (typeof chemicalOrder.unloadingChemical !== 'undefined') {
          chemicalOrder.unloadingChemical.map((item, index) => {
            self.unloadingWeightTableList.push({
              value: item.totalWeight,
              name: item.productName
            })
          })
        }

        // 刷新所有图表
        self.refreshChart()
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取国内的流入流出
       */
    getMoveLineCountryData () {
      let params = {
        scope: 0,
        stevedoreType: 1
      }
      hazardousChemicalMap(params).then(res => {
        this.flowData.country.chymistIn = res.data
        this.addCountryOverlay({
          line: {
            normal: {
              borderColor: 'rgb(175, 197 168)'
            }
          },
          lineAnimation: {
            fillColor: 'rgba(250, 246, 160, 1)'
          }
        })
      }).catch(err => {
        console.log(err)
      })
      let param = {
        scope: 0,
        stevedoreType: 0
      }
      hazardousChemicalMap(param).then(res => {
        this.flowData.country.chymistOut = res.data
      }).catch(err => {
        console.log(err)
      })

      // 危废国内流入流出
      getWasteFlowIn().then(res => {
        this.flowData.country.wasteIn = res.data
      }).catch(err => {
        console.log(err)
      })

      getWasteFlowOut().then(res => {
        this.flowData.country.wasteOut = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取省内的流入流出
       */
    getMoveLineProvinceData () {
      let params = {
        scope: 1,
        stevedoreType: 1
      }
      hazardousChemicalMap(params).then(res => {
        this.flowData.province.chymistIn = res.data
      }).catch(err => {
        console.log(err)
      })
      let param = {
        scope: 1,
        stevedoreType: 0
      }
      hazardousChemicalMap(param).then(res => {
        this.flowData.province.chymistOut = res.data
      }).catch(err => {
        console.log(err)
      })

      // 危废省内流入流出
      getWasteFlowInProvince().then(res => {
        this.flowData.province.wasteIn = res.data
      }).catch(err => {
        console.log(err)
      })

      getWasteFlowOutProvince().then(res => {
        this.flowData.province.wasteOut = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
       * 获取市内的流入流出
       */
    getMoveLineCityData () {
      let params = {
        scope: 2,
        stevedoreType: 1
      }
      hazardousChemicalMap(params).then(res => {
        this.flowData.city.chymistIn = res.data
      }).catch(err => {
        console.log(err)
      })
      let param = {
        scope: 2,
        stevedoreType: 0
      }
      hazardousChemicalMap(param).then(res => {
        this.flowData.city.chymistOut = res.data
      }).catch(err => {
        console.log(err)
      })

      // 危废市内流入流出
      getWasteFlowInCity().then(res => {
        this.flowData.city.wasteIn = res.data
      }).catch(err => {
        console.log(err)
      })

      getWasteFlowOutCity().then(res => {
        this.flowData.city.wasteOut = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 导出日报
     */
    downLoadExcel () {
      const newTab = window.open('', '_parent')
      newTab.location.href = baseXietongUrl() + '/api/zd-xt/flow/downloadExcel'
    },
    /***
       * @description 初始化inMap 地图
       */
    initMap () {
      if (!this.inMap) {
        this.inMap = new inMap.Map({
          id: 'map',
          skin: 'Blueness',
          center: [120.883029, 30.659309],
          zoom: {
            value: 5,
            show: false,
            max: 18,
            min: 5
          }
        })
        this.bMap = this.inMap.getMap()
      }
    },
    /***
       * @description 传入date获取 PolygonOverlay 围栏
       */
    getPolygonOverlay (data) {
      return new inMap.PolygonOverlay({
        style: {
          normal: {
            borderWidth: 1.5,
            backgroundColor: 'rgba(252,196,95,0.71)',
            label: {
              show: true, // 是否显示
              font: '13px bold ',
              color: 'rgba(224, 238, 251, .3)'
            }
          },
          splitList: [ // 设置区间颜色
            {
              start: 0,
              end: 1,
              backgroundColor: 'rgba(6, 57, 31, 0.80)',
              borderColor: 'rgba(14, 93, 119, 1)'
            },
            {
              start: 1,
              end: 2,
              backgroundColor: 'rgba(9, 65, 64, 0.80)',
              borderColor: 'rgba(23, 173, 165, 1)'
            },
            {
              start: 2,
              end: 3,
              backgroundColor: 'rgba(0, 48, 71, 0.80)',
              borderColor: 'rgba(24, 138, 142, 1)'
            },
            {
              start: 3,
              end: 4,
              backgroundColor: 'rgba(71, 57, 17, 0.80)',
              borderColor: 'rgba(228, 138, 59, 1)'
            },
            {
              start: 4,
              end: 5,
              backgroundColor: 'rgba(17, 43, 78, 0.80)',
              borderColor: 'rgba(55, 140, 249, 1)'
            },
            {
              start: 5,
              end: 6,
              backgroundColor: 'rgba(42, 23, 76, 0.80)',
              borderColor: 'rgba(88, 112, 211, 1)'
            },
            {
              start: 6,
              end: 7,
              backgroundColor: 'rgba(24, 23, 76, 0.80)',
              borderColor: 'rgba(70, 76, 223, 1)'
            }
          ]
        },
        data: data
      })
    },
    /***
       * @description 传入date获取 MoveLineOverlay
       */
    getMoveLineOverlay (data, style) {
      return new inMap.MoveLineOverlay({
        style: {
          point: {
            tooltip: {
              show: true,
              formatter: function (params) {
                if (params.name === '浙江省，嘉兴市') {
                  return ('<div class="area">浙江省，嘉兴市</div>')
                } else {
                  return (`<div>
                        <!--<div class="date">截至2018.11.01</div>-->
                        <div class="area">${params.name} -- 嘉兴市</div>
                        <div class="number">${params.count} <span class="unit">吨</span></div>
                      </div> `)
                }
              },
              customClass: 'tooltip-box'
            },
            style: {
              normal: {
                backgroundColor: 'rgba(41, 192, 255, 1)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 1)',
                size: 6,
                label: {
                  show: true,
                  color: 'rgba(255, 255, 255, 1)'
                }
              }
            }
          },
          line: {
            style: {
              normal: {
                borderColor: !style.line.normal.borderColor ? 'rgba(92, 211, 244, 1)' : style.line.normal.borderColor,
                borderWidth: 1,
                lineOrCurive: 'curve'
              }
            }
          },
          lineAnimation: {
            style: {
              size: 2,
              fillColor: !style.lineAnimation.fillColor ? 'rgba(155, 247, 255, 1)' : style.lineAnimation.fillColor,
              shadowColor: '#fff',
              shadowBlur: 10,
              lineOrCurve: 'curve'
            }
          }
        },
        data: data
      })
    },
    /**
       * @description 添加中国国图层
       */
    addCountryOverlay (style) {
      this.polygonOverlay = this.getPolygonOverlay(china)
      this.inMap.add(this.polygonOverlay)
      switch (this.flowType) {
        case config.flowType.chymistIn:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.country.chymistIn, style)
          break
        case config.flowType.chymistOut:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.country.chymistOut, style)
          break
        case config.flowType.wasteIn:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.country.wasteIn, style)
          break
        case config.flowType.wasteOut:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.country.wasteOut, style)
      }
      console.log(this.moveLineOverlay)
      this.inMap.add(this.moveLineOverlay)
    },
    /**
       * @description 删除中国国图层
       */
    removeOverlay () {
      this.inMap.remove(this.polygonOverlay)
      this.inMap.remove(this.moveLineOverlay)
    },
    /**
       * @description 添加省内图层
       */
    addProvinceOverlay (style) {
      this.polygonOverlay = this.getPolygonOverlay(zhejiang)
      this.inMap.add(this.polygonOverlay)
      switch (this.flowType) {
        case config.flowType.chymistIn:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.province.chymistIn, style)
          break
        case config.flowType.chymistOut:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.province.chymistOut, style)
          break
        case config.flowType.wasteIn:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.province.wasteIn, style)
          break
        case config.flowType.wasteOut:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.province.wasteOut, style)
      }
      this.inMap.add(this.moveLineOverlay)
    },
    /**
       * @description 添加市内图层
       */
    addCityOverlay (style) {
      this.polygonOverlay = this.getPolygonOverlay(jiaxing)
      this.inMap.add(this.polygonOverlay)
      switch (this.flowType) {
        case config.flowType.chymistIn:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.city.chymistIn, style)
          console.log(this.moveLineOverlay)
          break
        case config.flowType.chymistOut:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.city.chymistOut, style)
          break
        case config.flowType.wasteIn:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.city.wasteIn, style)
          break
        case config.flowType.wasteOut:
          this.moveLineOverlay = this.getMoveLineOverlay(this.flowData.city.wasteOut, style)
      }
      this.inMap.add(this.moveLineOverlay)
    },
    /**
       * @description 改变地图层级
       * @param mapLevel
       */
    changeMapLevel (mapLevel) {
      if (this.mapLevel === mapLevel) return
      this.mapLevel = mapLevel
      this.removeOverlay()
      switch (mapLevel) {
        case config.mapLevel.country:
          this.setCenterAndZoom([105.40556, 35.392019], 6)
          this.addCountryOverlay({
            line: {
              normal: {
                borderColor: 'rgb(175, 197 168)'
              }
            },
            lineAnimation: {
              fillColor: 'rgba(250, 246, 160, 1)'
            }
          })
          break
        case config.mapLevel.province:
          this.setCenterAndZoom([120.442924, 29.203751], 9)
          this.addProvinceOverlay({
            line: {
              normal: {
                borderColor: 'rgb(175, 197 168)'
              }
            },
            lineAnimation: {
              fillColor: 'rgba(250, 246, 160, 1)'
            }
          })
          let height = this.$refs.map.offsetHeight
          console.log(height)
          break
        case config.mapLevel.city:
          this.setCenterAndZoom([120.883029, 30.659309], 11)
          this.addCityOverlay({
            line: {
              normal: {
                borderColor: 'rgb(175, 197 168)'
              }
            },
            lineAnimation: {
              fillColor: 'rgba(250, 246, 160, 1)'
            }
          })
          break
      }
    },
    /**
       * @description 改变流向类别
       * @param type
       */
    changeFlowType (type) {
      if (this.flowType === type) return
      this.flowType = type
      var flow = ''
      var map = ''
      var style = {}
      this.setCenterAndZoom([105.40556, 35.392019], 6)
      switch (type) {
        case config.flowType.chymistIn:
          flow = 'chymistIn'
          style = {
            line: {
              normal: {
                borderColor: 'rgb(175, 197 168)'
              }
            },
            lineAnimation: {
              fillColor: 'rgba(250, 246, 160, 1)'
            }
          }
          break
        case config.flowType.chymistOut:
          flow = 'chymistOut'
          style = {
            line: {
              normal: {
                borderColor: 'rgba(92, 211, 244, 1)'
              }
            },
            lineAnimation: {
              fillColor: 'rgba(155, 247, 255, 1)'
            }
          }
          break
        case config.flowType.wasteIn:
          flow = 'wasteIn'
          style = {
            line: {
              normal: {
                borderColor: 'rgb(175, 197 168)'
              }
            },
            lineAnimation: {
              fillColor: 'rgba(250, 246, 160, 1)'
            }
          }
          break
        case config.flowType.wasteOut:
          flow = 'wasteOut'
          style = {
            line: {
              normal: {
                borderColor: 'rgba(92, 211, 244, 1)'
              }
            },
            lineAnimation: {
              fillColor: 'rgba(155, 247, 255, 1)'
            }
          }
          break
      }
      this.mapLevel = config.mapLevel.country
      if (this.mapLevel === config.mapLevel.country) {
        map = 'country'
      } else if (this.mapLevel === config.mapLevel.province) {
        map = 'province'
      } else if (this.mapLevel === config.mapLevel.city) {
        map = 'city'
      }
      this.inMap.remove(this.moveLineOverlay)
      this.moveLineOverlay = this.getMoveLineOverlay(this.flowData[map][flow], style)
      this.inMap.remove(this.polygonOverlay)
      this.polygonOverlay = this.getPolygonOverlay(china)
      this.inMap.add(this.polygonOverlay)
      this.inMap.add(this.moveLineOverlay)
    },
    /**
       * 设置地图中心点和层级
       * @param center
       * @param zoom
       */
    setCenterAndZoom (center, zoom) {
      this.bMap.setCenter(center)
      // this.bMap.setZoom(zoom)

      // this.bMap.panTo(new BMap.Point(center[0], center[1]))
    },
    /**
       * 初始化流入流出曲线图
       */
    initInOutTrendChart () {
      let self = this

      this.chartInOutTrend = echarts.init(document.getElementById('inOutTrendChart'), 'dark')
      this.chartInOutTrend.setOption({
        color: ['#4890ec', '#1ec2a9'],
        backgroundColor: '',
        title: {
          text: '流入流出趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#000000'
            }
          }
        },
        legend: {
          backgroundColor: 'transparent'
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: self.inOutTendencyDate,
            axisLabel: {
              interval: 0
              // rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '流入数量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: self.inflowTendency,
            smooth: true
          },
          {
            name: '流出数量',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: self.outflowTendency,
            smooth: true
          }
        ]
      })
    },
    /**
       * 初始化装货化学品排名
       */
    initLoadChemicalChart () {
      this.chartLoadChemical = echarts.init(document.getElementById('loadChemicalChart'), 'dark')
      this.chartLoadChemical.setOption({
        color: ['#666bec', '#f4af2a', '#4890ec', '#44c0f5', '#24cf94'],
        backgroundColor: '',
        title: {
          text: '装货化学品排名/日',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '装货',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['50%', '55%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'outside'
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [{ name: '暂无数据', value: 1 }]
          }
        ]
      })
    },
    /**
       * 初始化卸货数量
       */
    initUnLoadChemicalChart () {
      this.chartUnLoadChemical = echarts.init(document.getElementById('unLoadChemicalChart'), 'dark')
      this.chartUnLoadChemical.setOption({
        backgroundColor: '',
        color: ['#666bec', '#f4af2a', '#4890ec', '#44c0f5', '#24cf94'],
        title: {
          text: '卸货化学品排名/日',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '卸货',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['50%', '55%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'outside'
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            // data: self.unloadingWeightTableList
            data: [{ name: '暂无数据', value: 1 }]
          }
        ]
      })
    },
    /**
       * 初始化进出园区车辆情况
       */
    initInOutVehicleChart () {
      this.chartInOUtVehicle = echarts.init(document.getElementById('inOutVehicleChart'), 'dark')
      this.chartInOUtVehicle.setOption({
        backgroundColor: '',
        title: {
          text: '进出园区车辆情况/日',
          x: 'left',
          'top': '10%',
          'textStyle': {
            'font-weight': 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#575cf3', '#31c2ff', '#368af4'],
        legend: {
          x: 'right',
          y: '40%',
          icon: 'circle',
          left: '60%',
          orient: 'vertical',
          data: ['进入园区', '驶出园区', '区内车辆'],
          formatter: function (name) {
            // for (var i = 0; i < self.inOutVehicleTableList.length; i++) {
            //   if (self.inOutVehicle[i] === name) {
            //     return name + '     ' + self.inOutVehicleNumber[i] + '辆'
            //   }
            // }
            return '暂无数据'
          }
        },
        calculable: true,
        series: [
          {
            name: '进出园区车辆情况',
            type: 'pie',
            radius: ['30', '70'],
            center: ['30%', '55%'],
            roseType: 'radius',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: [
              { value: 1, name: '进入园区' }
            ]
            // data: self.inOutVehicleTableList
          }
        ]
      })
    },
    /**
       * 初始化装卸货数量
       */
    initLoadGoodsChart () {
      this.chartLoadUnLoadGoods = echarts.init(document.getElementById('loadUnloadGoodsChart'), 'dark')
      let self = this
      this.chartLoadUnLoadGoods.setOption({
        backgroundColor: '',
        title: {
          text: '装卸货数量/日',
          x: 'left',
          'top': '10%',
          'textStyle': {
            'font-weight': 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#575cf3', '#31c2ff', '#368af4'],
        legend: {
          x: 'right',
          y: '40%',
          icon: 'circle',
          left: '60%',
          orient: 'vertical',
          data: ['装货量', '卸货量'],
          formatter: function (name) {
            for (var i = 0; i < self.loadUnloadGoodsTableList.length; i++) {
              if (self.loadUnloadGoodsTableList[i].name === name) {
                return name + '     ' + self.loadUnloadGoodsTableList[i].value + '吨'
              }
            }
          }
        },
        calculable: true,
        series: [
          {
            name: '装卸货数量',
            type: 'pie',
            radius: ['30', '70'],
            center: ['30%', '55%'],
            roseType: 'radius',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            // data: self.loadUnloadGoodsTableList
            data: [
              { value: 1, name: '暂无数据' }
            ]
          }
        ]
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
    #map {
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
    .map-menu {
      position: absolute;
      right: 60px;
      bottom: 15px;
    }
    .map-tab {
      position: absolute;
      bottom: 26.9%;
      left: 67%;
      display: flex;
      flex-direction: column;
      .map-tab-item {
        display: inline-block;
        width: 171px;
        height: 140px;
        cursor: pointer;
      }
      .country {
        background: url("../assets/map/country.png");
        background-size: 100%;
        &.active {
          background: url("../assets/map/country_active.png");
        }
      }
      .province {
        background: url("../assets/map/province.png");
        background-size: 100% 100%;
        &.active {
          background: url("../assets/map/province_active.png");
        }
      }
      .city {
        background: url("../assets/map/city.png");
        background-size: 100% 100%;
        &.active {
          background: url("../assets/map/city_active.png");
        }
      }
    }
    .bottom-data {
      position: absolute;
      left: 0.5%;
      bottom: 0.9%;
      width: 75.5%;
      height: 26%;
      background: url("../assets/map/ic_bg_bottom.png") no-repeat center;
      background-size: 100% 100%;
      padding: 20px;
      .bottom-inOutChart {
        height: 100%;
        width: 100%;
      }
      .bottom-loadChemicalChart {
        height: 100%;
        width: 100%;
      }
      .bottom-unLoadChemicalChart {
        height: 100%;
        width: 100%;
      }
    }
    .right-data {
      position: absolute;
      right: 0.7%;
      bottom: 0.9%;
      width: 23%;
      height: 90%;
      background: url("../assets/map/ic_bg_right.png") no-repeat center;
      background-size: 100% 100%;
      padding: 40px;
      margin: 0 auto;
      box-sizing: border-box;
      font-size: 25px;
      color: white;
      .header-data {
        width: 100%;
        height: 40%;
        .rightHeader {
          margin-top: 10px;
          display: flex;
          align-items: Center;
        }
        .data-title {
          font-size: 19px;
          margin-top: 20px;
        }
        .data-content {
          font-size: 34px;
          color: #0dd4f2
        }
      }
      .bottom-charts {
        width: 100%;
        height: 60%;
        .right-inOutVehicleChart {
          width: 100%;
          height: 50%;
          z-index: 100;
        }
      }
    }
  }
</style>
