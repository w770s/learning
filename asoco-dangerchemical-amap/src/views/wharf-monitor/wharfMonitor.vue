<template>
  <div id="wharfMonitor">
    <!--地图容器-->
    <baidu-map class="map-view" :mapStyle="mapConfig.mapStyle" :center="mapConfig.center" :zoom="mapConfig.zoom" :scroll-wheel-zoom="true" >
      <!--<bm-marker v-for="(item, index) in videoMarkerList"
                 :key="'video' + index"
                 :position="item.point"
                 :icon="icons.video"  @click="showVideoDetail(index)"></bm-marker>-->
      <bm-marker v-for="(item, index) in shipMarkerList"
                 :key="'ship' + index"
                 :position="item.point"
                 :icon="icons.ship"
                 :rotation="item.rotation" @click="showShipDetail(index)"></bm-marker>
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="(item, index) in companyMarkerList"
                   :key="'company' + index"
                   :position="item.point"
                   :icon="icons.company"
                   @click="openCompanyDetails(item.companyObj, this)">
          <!--<bm-label :content="item.shortName" :labelStyle="{color: '#0df6ff', fontSize : '14px', border:'solid 0px',backgroundColor: 'rgba(82,57,10,0)'}" :offset="{width: -10, height: 15}"/>-->
        </bm-marker>
      </bml-marker-clusterer>
      <!--重大危险源-->
      <template v-for="(item, index) in dangerousMarkerList" >
        <bm-polygon v-show="isShowDan" :key="'dangerous' + index" :path="JSON.parse(item.lonLat)" :stroke-color="item.alarmFlag !== 1?'green': '#E25456'" :fillColor="item.alarmFlag !== 1?'#90EE90': 'pink'" @click="openInfoDetails(item.point,index, 1)">
        </bm-polygon>
        <bm-label v-show="isShowDan" :key="'dangerousTitle' + index" :content="item.sourceDangerName" :labelStyle="{color: '#90EE90', backgroundColor:'transparent', fontSize: '12px', font: '微软雅黑', border: '0px'}" :position="item.point" :title="item.sourceDangerName"></bm-label>
      </template>
      <!--管道-->
      <template v-for="(item, index) in pipelineMarkerList" >
        <bm-polyline :key="'pipeline' + index" :path="JSON.parse(item.lonlat)" stroke-color="#E25456" :stroke-opacity="0.5" :stroke-weight="10" @click="openInfoDetails(item.point,index, 2)"></bm-polyline>
      </template>
      <!--储罐、堆场点位-->
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="(item, index) in infoMarkerList"
                   :key="item.type + index"
                   :position="item.point"
                   :icon="item.type === 'tank' ? icons.tank : icons.yard"
                   @click="openInfoDetails(item.point, index)"></bm-marker>
      </bml-marker-clusterer>
      <!--传感器点位-->
      <bml-marker-clusterer :averageCenter="true" >
        <bm-marker v-for="(item, index) in sensorMarkerList"
                   :key="'item.type' + index"
                   :position="item.point"
                   :icon="setIcon(item.type, item.isCallPolice)"
                   @click="openSensorDetails(item.point, index, item.type)"></bm-marker>
      </bml-marker-clusterer>
      <!--传感器详情-->
      <bm-overlay v-show="sensorShowFlag"
                  pane="floatPane"
                  ref="sensorOverlay"
                  :class="{sensor: true}"
                  @draw="drawSensorDetail">
        <div class="company-bg mapModel info-window">
          <div class="title">
            <div>{{sensorDetail.name}}</div>
            <div @click="closeSensorDetail" style="float: right;margin-right: 10px;color: white;font-size: 25px;cursor: pointer;">×</div>
          </div>
          <div class="body">
            <table>
              <tr><td class="ship-td">终端类型:</td><td>{{getTypeOrUnit(sensorDetail.equipmentType, 0)}}传感器</td></tr>
              <tr><td class="ship-td">终端编号:</td><td>{{isNull(sensorDetail.num)}}</td></tr>
              <tr><td class="ship-td">所属企业:</td><td>{{isNull(sensorDetail.company)}}</td></tr>
              <tr><td class="ship-td">安装位置:</td><td>{{isNull(sensorDetail.address)}}</td></tr>
              <tr><td class="ship-td">联系电话:</td><td>{{isNull(sensorDetail.maintenancePerson)}}<span class="msg"></span></td></tr>
              <tr><td class="ship-td">联系人:</td><td>{{isNull(sensorDetail.maintenancePhone)}}</td></tr>
            </table>
            <div class="rightDiv">
              <div>实时数据</div>
              <div>{{isNull(sensorDetail.manufacturer)}} {{getTypeOrUnit(sensorDetail.equipmentType, 1)}}</div>
              <div v-if="sensorDetail.manufacturer>sensorDetail.secondThreshold" style="color: #FF0000;border: solid 1px #FF0000;background-color: #03291E;padding: 2px 5px;">{{getTypeOrUnit(sensorDetail.equipmentType, 0)}}超二级警戒</div>
              <div v-else-if="sensorDetail.manufacturer>sensorDetail.firstThreshold && sensorDetail.manufacturer<sensorDetail.secondThreshold" style="color: #FFAF14;border: solid 1px #FFAF14;background-color: #03291E;padding: 2px 5px;">{{getTypeOrUnit(sensorDetail.equipmentType, 0)}}超警戒</div>
              <div v-else style="width: 80px;color: #00FF7F;border: solid 1px #00FF7F;background-color: #03291E;padding: 2px 5px;">{{getTypeOrUnit(sensorDetail.equipmentType, 0)}}正常</div>
            </div>
          </div>
          <!--<div style="width: 90%">-->
            <!--<div class="btn">-->
              <!--<span>终端详情</span><span>报警信息</span><span>历史数据</span>-->
            <!--</div>-->
          <!--</div>-->
        </div>
      </bm-overlay>
     <!--船舶详情-->
      <bm-overlay v-show="shipShowFlag"
                  pane="floatPane"
                  ref="shipOverlay"
                  :class="{companyDetails: true}"
                  @draw="drawShipDetail">
        <div style="margin-top: 50px;margin-left:  100px;width: 80%;height: 65%;color: white;font-size: 20px;">
          <table>
            <tr><td colspan="2" class="company-table-title" style="font-size: 25px;">{{shipDetail.name}}
              <div @click="closeDetail" style="float: right;margin-right: 30px;color: white;font-size: 25px;cursor: pointer;">X</div>
            </td></tr>
            <tr><td class="ship-td">信息接收时间:</td><td>{{formatDateTime(shipDetail.receive_time)}}</td></tr>
            <tr><td class="ship-td">船名:</td><td>{{shipDetail.name}}</td></tr>
            <tr><td class="ship-td">航向:</td><td>{{isNull(shipDetail.direct)}}</td></tr>
            <tr><td class="ship-td">速度:</td><td>{{isNull(shipDetail.speed)}}</td></tr>
          </table>
        </div>
      </bm-overlay>
      <!--视频详情-->
      <bm-overlay v-if="videoShowFlag"
                  pane="floatPane"
                  ref="videoOverlay"
                  :class="{companyDetails: true}"
                  @draw="drawVideoDetail">
        <div class="drawVideo" style="width: 500px; height: 318px; margin: 0 auto;padding-top: 50px;">
          <div @click="videoShowFlag = false" style="float: right;margin-right: 20px;color: white;font-size: 25px;cursor: pointer;">X</div>
          <video-player class="video-player vjs-custom-skin" style="width: 100%;height: 100%;margin-top: 35px"
                        :playsinline="true"
                        :options="playerOptions">
          </video-player>
        </div>
      </bm-overlay>
      <!--企业详情-->
      <bm-overlay v-show="companyShowFlag"
        pane="floatPane"
        ref="companyOverlay"
        :class="{sensor: true}"
        @draw="draw">
        <div class="company-bg info-window">
          <table>
            <tr><td colspan="2" class="company-table-title">{{companyObj.name}}
              <div @click="closeCompany" style="float: right;margin-right: 30px;color: white;font-size: 25px;cursor: pointer;">×</div>
            </td></tr>
            <tr><td style="width: 30%;">持证情况:</td>
              <td>
                <div class="company-certificate-failure">
                  <span>证书名称</span>
                  <span style="padding: 5px 10px;">!</span>
                </div>
                <div class="company-certificate-effective">
                  <span>港口经营许可证</span>
                  <span>✔</span>
                </div>
              </td>
            </tr>
            <tr><td style="width: 30%;">企业地址:</td><td>{{companyObj.address}}</td></tr>
            <tr><td style="width: 30%;">危化品总存量:</td><td @click="openStockModal(1)" class="company-table-td">{{(companyObj.totalStock !== '' && companyObj.totalStock !== null)?companyObj.totalStock: '0'}}吨</td></tr>
            <tr><td style="width: 30%;">今日流进:</td><td @click="openStockModal(2)" class="company-table-td">{{(companyObj.totalDayInCount !== '' && companyObj.totalDayInCount !== null)?companyObj.totalDayInCount: '0'}}吨</td></tr>
            <tr><td style="width: 30%;">今日流出:</td><td @click="openStockModal(3)" class="company-table-td">{{(companyObj.totalDayOutCount !== '' && companyObj.totalDayOutCount !== null)?companyObj.totalDayOutCount: '0'}}吨</td></tr>
            <!--<tr><td colspan="2"><div style="width: 90%;"><button class="company-table-button">详情</button></div></td></tr>-->
          </table>
        </div>
      </bm-overlay>

      <!--储罐、堆场详情-->
      <bm-overlay v-show="infoWindow.show"
                  pane="floatPane"
                  ref="infoOverlay"
                  :class="{sensor: true}"
                  @draw="drawInfoDetail">
        <div class="info-window">
          <span class="close-btn" @click="closeInfoWindow">×</span>
          <h3 class="info-window-title">{{ infoWindow.extData.title }}</h3>
          <ul class="detail-list">
            <li v-for="(item, index) in infoWindow.extData.detail" :key="'info-detail' + index">
              {{item }}
            </li>
          </ul>
          <!--<div class="model">
            <div class="model-content">
              <div class="content" style="margin-top: 15px">
                <table border="1" cellspacing="0">
                  <tr>
                    <td>船舶名称</td><td>作业类型</td><td>危化品</td><td>数量</td><td>状态</td>
                  </tr>
                  <tr>
                    <td colspan="5">正在作业</td>
                  </tr>
                  <tr v-if="tankOrYardList.woking.length === 0">
                    <td colspan="5">暂无信息</td>
                  </tr>
                  <tr v-else v-for="(item, index) in tankOrYardList.woking" :key="index">
                    <td style="width: 20%;">{{item.ship_name}}</td>
                    <td style="width: 20%;">{{item.work_type | dataType}}</td>
                    <td style="width: 20%;">{{item.dangerous_goods_names_sum | isNull}}</td>
                    <td style="width: 20%;">{{item.workload | isNull}}吨</td>
                    <td style="color: #EEA515;width: 20%;">正在作业</td>
                  </tr>
                  <tr>
                    <td colspan="5">等待作业</td>
                  </tr>
                  <tr v-if="tankOrYardList.willWork.length === 0">
                    <td colspan="5">暂无信息</td>
                  </tr>
                  <tr v-else v-for="(item, index) in tankOrYardList.willWork" :key="index">
                    <td style="width: 20%;">{{item.ship_name}}</td>
                    <td style="width: 20%;">{{item.work_type | dataType}}</td>
                    <td style="width: 20%;">{{item.dangerous_goods_names_sum | isNull}}</td>
                    <td style="width: 20%;">{{item.workload | isNull}}吨</td>
                    <td style="color: #EEA515;width: 20%;">等待作业</td>
                  </tr>
                  <tr>
                    <td colspan="5">已完成作业</td>
                  </tr>
                  <tr v-if="tankOrYardList.woked.length === 0">
                    <td colspan="5">暂无信息</td>
                  </tr>
                  <tr v-else v-for="(item, index) in tankOrYardList.woked" :key="index">
                    <td style="width: 20%;">{{item.ship_name}}</td>
                    <td style="width: 20%;">{{item.work_type | dataType}}</td>
                    <td style="width: 20%;">{{item.dangerous_goods_names_sum | isNull}}</td>
                    <td style="width: 20%;">{{item.workload | isNull}}吨</td>
                    <td style="color: #EEA515;width: 20%;">已完成作业</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>-->
        </div>
      </bm-overlay>
    </baidu-map>

    <div class="branch">
      <img src="../../assets/mapTrack/fenzhi3.png" alt="" width="28">
    </div>
    <div class="left-menu">
      <h4 class="menu-item wharf" :class="{ active: wharfMenu === $config.wharfMenu.companySearch }" @click="changeWharfMenu($config.wharfMenu.companySearch)">企业</h4>
      <h4 class="menu-item wharf" :class="{ active: wharfMenu === $config.wharfMenu.video }" @click="changeWharfMenu($config.wharfMenu.video)">视频监控</h4>
      <h4 class="menu-item wharf" :class="{ active: wharfMenu === $config.wharfMenu.deal }" @click="changeWharfMenu($config.wharfMenu.deal)">处理单</h4>
    </div>
    <component ref="companySearch" v-bind:is="currentTabComponent"
       @openCompanyDetails="openCompanyDetails"
       @openDetail="openDetail"
       @addCarousel="addCarousel"
       @addDeal="addDeal"
       :stockModalFlag="stockModalFlag"></component>
    <!--<component v-bind:is="components.queue"></component>-->
    <detail  ref='detail'></detail>
    <addCarousel  ref='addCarousel' @turnImg="turnImg"></addCarousel>
    <addDeal ref='addDeal' @addDeal="addDeal"></addDeal>
    <rightAlarmQueue ref="rightAlarmQueue" @openRightAlarmDetail="openRightAlarmDetail" @hideLayer="hideLayer" @getMajorHazards="getMajorHazards"></rightAlarmQueue>
    <rightAlarmDetail ref='rightAlarmDetail'></rightAlarmDetail>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
import config from '@/config/wharf'
import companySearch from './components/companySearch'
import video from './components/video/carouselList'
import deal from './components/deal/deal'
import detail from './components/deal/dealDetail'
import addDeal from './components/deal/addDeal'
import addCarousel from './components/video/addCarousel'
import rightAlarmQueue from './components/rightAlarmQueue'
import shipImg from '@/assets/mapTrack/green360.png'
import videoImg from '@/assets/wharfMonitor/video_point.png'
import gasCallPolice from '@/assets/wharfMonitor/gas_call_police.gif'
import pressureCallPolice from '@/assets/wharfMonitor/pressure_call_police.gif'
import temperatureCallPolice from '@/assets/wharfMonitor/temperature_call_police.gif'
import companyPoint from '@/assets/mapTrack/ic_company.png'
import temPoint from '@/assets/wharfMonitor/temperature_point.png'
import gasPoint from '@/assets/wharfMonitor/gas_point.png'
import tankPoint from '@/assets/wharfMonitor/tank_point.png'
import yardPoint from '@/assets/wharfMonitor/yard_point.png'
import pressurePoint from '@/assets/wharfMonitor/pressure_point.png'
import videoChooseImg from '@/assets/wharfMonitor/video_point_choose.png'
import companyChoosePoint from '@/assets/mapTrack/ic_company_choose.png'
import temChoosePoint from '@/assets/wharfMonitor/temperature_point_choose.png'
import gasChoosePoint from '@/assets/wharfMonitor/gas_point_choose.png'
import tankChoosePoint from '@/assets/wharfMonitor/tank_point_choose.png'
import yardChoosePoint from '@/assets/wharfMonitor/yard_point_choose.png'
import pressureChoosePoint from '@/assets/wharfMonitor/pressure_point_choose.png'
import rightAlarmDetail from './components/rightAlarmDetail'
import { postSensorMarker, postDangerousList } from '@/api/wharf'
import { getCameraList, getCompanyByCode } from '@/api/emergency'
import { postShipMarker, postTankMarker, postYardMarker, postPipelineMarker } from '@/api/pdc'
import { BmlMarkerClusterer } from 'vue-baidu-map'
export default {
  name: 'wharfMonitor',
  components: {
    detail: detail,
    addCarousel: addCarousel,
    rightAlarmQueue: rightAlarmQueue,
    addDeal: addDeal,
    rightAlarmDetail: rightAlarmDetail,
    BmlMarkerClusterer
  },
  data () {
    return {
      currentTabComponent: null, // 菜单切换
      components: {
        companySearch: companySearch,
        video: video,
        deal: deal
      },
      wharfMenu: '',
      mapConfig: { // 地图配置
        zoom: 15, // 缩放层级
        center: { lng: 121.071573, lat: 30.588971 }, // 地图中心点{lng: 0, lat: 0}
        events: { // 时间
          click: (e) => {
            console.log(e)
          }
        },
        mapStyle: {
          styleJson: [
            {
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#0E5978'
              }
            },
            {
              'featureType': 'highway',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'highway',
              'elementType': 'geometry.stroke',
              'stylers': {
                'color': '#147a92'
              }
            },
            {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'arterial',
              'elementType': 'geometry.stroke',
              'stylers': {
                'color': '#0b3d51'
              }
            },
            {
              'featureType': 'local',
              'elementType': 'geometry',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                'color': '#052237'
              }
            },
            {
              'featureType': 'railway',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'railway',
              'elementType': 'geometry.stroke',
              'stylers': {
                'color': '#08304b'
              }
            },
            {
              'featureType': 'subway',
              'elementType': 'geometry',
              'stylers': {
                'lightness': -70
              }
            },
            {
              'featureType': 'building',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'all',
              'elementType': 'labels.text.fill',
              'stylers': {
                'color': '#857f7f'
              }
            },
            {
              'featureType': 'all',
              'elementType': 'labels.text.stroke',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'building',
              'elementType': 'geometry',
              'stylers': {
                'color': '#022338'
              }
            },
            {
              'featureType': 'green',
              'elementType': 'geometry',
              'stylers': {
                'color': '#062032'
              }
            },
            {
              'featureType': 'boundary',
              'elementType': 'all',
              'stylers': {
                'color': '#1e1c1c'
              }
            },
            {
              'featureType': 'manmade',
              'elementType': 'geometry',
              'stylers': {
                'color': '#022338'
              }
            },
            {
              'featureType': 'poi',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            },
            {
              'featureType': 'all',
              'elementType': 'labels.icon',
              'stylers': {
                'visibility': 'off'
              }
            },
            {
              'featureType': 'all',
              'elementType': 'labels.text.fill',
              'stylers': {
                'color': '#2da0c6',
                'visibility': 'on'
              }
            }
          ]
        },
        companyActive: false
      },
      searchParam: {
        name: ''
      },
      searchDangerousParam: {
        page: 1,
        size: 10,
        status: ''
      },
      companyShowFlag: false,
      sensorShowFlag: false,
      videoShowFlag: false,
      dangerousShowFlag: false,
      pipelineShowFlag: false,
      videoName: '',
      playerOptions: {
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL',
          src: 'http://111.3.68.229:6713/mag/hls/1025b0b4f2ee4b2c855ae9b78841b845/0/live.m3u8' // 你的m3u8地址（必填）
        }],
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      stockModalFlag: 0,
      companyObj: {},
      icons: { // map
        video: {
          url: videoImg,
          size: { width: 28, height: 28 }
        },
        ship: {
          url: shipImg,
          size: { width: 40, height: 40 }
        },
        company: {
          url: companyPoint,
          size: { width: 28, height: 28 }
        },
        temperature: {
          url: temPoint,
          size: { width: 28, height: 28 }
        },
        gas: {
          url: gasPoint,
          size: { width: 28, height: 28 }
        },
        pressure: {
          url: pressurePoint,
          size: { width: 28, height: 28 }
        },
        tank: {
          url: tankPoint,
          size: { width: 28, height: 28 }
        },
        yard: {
          url: yardPoint,
          size: { width: 28, height: 28 }
        },
        video_choose: {
          url: videoChooseImg,
          size: { width: 28, height: 28 }
        },
        company_choose: {
          url: companyChoosePoint,
          size: { width: 28, height: 28 }
        },
        temperature_choose: {
          url: temChoosePoint,
          size: { width: 28, height: 28 }
        },
        gas_choose: {
          url: gasChoosePoint,
          size: { width: 28, height: 28 }
        },
        pressure_choose: {
          url: pressureChoosePoint,
          size: { width: 28, height: 28 }
        },
        tank_choose: {
          url: tankChoosePoint,
          size: { width: 28, height: 28 }
        },
        yard_choose: {
          url: yardChoosePoint,
          size: { width: 28, height: 28 }
        },
        gasCallPolice: {
          url: gasCallPolice,
          size: { width: 28, height: 28 }
        },
        pressureCallPolice: {
          url: pressureCallPolice,
          size: { width: 28, height: 28 }
        },
        temperatureCallPolice: {
          url: temperatureCallPolice,
          size: { width: 28, height: 28 }
        }
      },
      videoMarkerList: [],
      videoList: [],
      shipMap: new Map(),
      shipMarkerList: [],
      shipShowFlag: false,
      shipDetail: {
        point: { lng: 0, lat: 0 }
      },
      sensorPointDetail: {
        point: { lng: 0, lat: 0 }
      },
      infoPointDetail: {
        point: { lng: 0, lat: 0 }
      },
      videoDetail: {
        point: { lng: 0, lat: 0 }
      },
      dangerousPointDetail: {
        point: { lng: 0, lat: 0 }
      },
      shipList: [],
      sensorMarkerList: [],
      isShowVideo: true, // 是否可见视频
      isShowTem: true, // 是否可见温度
      isShowGas: true, // 是否可见气体
      isShowPre: true, // 是否可见压力
      isShowDan: true, // 是否可见危险源
      smallTime: 0,
      bigTime: 0,
      companyMarkerList: [],
      sensorDetail: {
        name: 'D6温度传感',
        sensorType: '温度传感器',
        num: '4422S33',
        address: 'aaaaa',
        company: '东恒石化',
        equipmentType: 2
      },
      dangerousList: [],
      dangerousMarkerList: [],
      dangerousMarkerList1: [],
      pipelineList: [],
      pipelineMarkerList: [],
      infoMarkerList: [],
      polygonPath: [
        { lng: 121.059672, lat: 30.596479 },
        { lng: 121.069804, lat: 30.599028 },
        { lng: 121.073541, lat: 30.594613 },
        { lng: 121.064127, lat: 30.590883 }
      ],
      infoWindow: { // 点击地图的marker显示的信息窗体数据---其他
        position: { lng: 121.059672, lat: 30.596479 }, // 位置
        extData: {
          title: '标题'
        }, // 显示信息
        show: false // 是否显示
      },
      timer: '',
      tankOrYardList: {
        willWork: [{
          ship_name: 'haha',
          work_type: '2',
          dangerous_goods_names_sum: '硫酸',
          workload: '100'
        }],
        woking: [{
          ship_name: 'hehe',
          work_type: '2',
          dangerous_goods_names_sum: '盐酸',
          workload: '1000'
        }],
        woked: [{
          ship_name: 'heihei',
          work_type: '2',
          dangerous_goods_names_sum: '硝酸',
          workload: '10000'
        }]
      }
    }
  },
  mounted () {
    this.showShip()
    this.showVideo()
    this.getCompanyList()
    // this.getDangerousList()
    this.getPipelineList()
    this.getTankList()
    this.getYardList()
    this.getSensorList()
    this.timer = setInterval(this.changeNum, 1000)
  },
  created () {
    this.timerStart()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    timerStart () {
      return setInterval(() => {
        this.showShip()
      }, 10 * 1000)
    },
    setIcon (type, isCallPolice) {
      switch (type) {
        case 'video':
          return this.icons.video
        case 'pressure':
          console.log('isCallPolice', isCallPolice)
          if (isCallPolice) {
            return this.icons.pressureCallPolice
          } else {
            return this.icons.pressure
          }
        case 'temperature':
          if (isCallPolice) {
            return this.icons.temperatureCallPolice
          } else {
            return this.icons.temperature
          }
        case 'gas':
          if (isCallPolice) {
            return this.icons.gasCallPolice
          } else {
            return this.icons.gas
          }
      }
    },
    changeWharfMenu: function (wharfMenu) {
      if (this.wharfMenu === wharfMenu) {
        this.currentTabComponent = null
        this.wharfMenu = ''
        return
      }
      this.wharfMenu = wharfMenu
      switch (wharfMenu) {
        case config.wharfMenu.companySearch:
          this.currentTabComponent = companySearch
          break
        case config.wharfMenu.video:
          this.currentTabComponent = video
          break
        case config.wharfMenu.deal:
          this.currentTabComponent = deal
          break
      }
    },
    // 获取企业列表
    getCompanyList: function () {
      var self = this
      self.companyMarkerList = []
      getCompanyByCode(self.searchParam).then(res => {
        if (res.resultCode.code === 1) {
          var companyList = res.data
          for (var i = 0; i < companyList.length; i++) {
            if (companyList[i].longitude !== null && companyList[i].longitude !== '') {
              var company = {}
              company.point = { 'lng': companyList[i].longitude, 'lat': companyList[i].latitude }
              company.type = 'company'
              company.shortName = companyList[i].shortName
              company.companyObj = companyList[i]
              self.companyMarkerList.push(company)
            }
          }
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        // self.$Message.error('获取异常!')
        console.log(err)
      })
    },
    getMajorHazards (majorHazards) {
      this.dangerousMarkerList1 = majorHazards
      this.getDangerousList()
    },
    // 获取危险源列表
    getDangerousList () {
      let self = this
      // self.dangerousMarkerList = majorHazards
      if (this.isShowDan === true) {
        self.dangerousMarkerList = self.dangerousMarkerList1
        for (let i = 0; i < self.dangerousMarkerList.length; i++) {
          let extData = {}
          extData.title = self.dangerousMarkerList[i].sourceDangerName
          let detail = [
            '危险源危险程度：' + self.dangerousMarkerList[i].riskLevel,
            '安评到期时间：' + self.dangerousMarkerList[i].reportTime,
            '安评状态：' + this.getSafeStatus(self.dangerousMarkerList[i].reportTime),
            '危险源内存量：' + self.dangerousMarkerList[i].principal
          ]
          extData.detail = detail
          self.dangerousMarkerList[i].point = this.getPoint(JSON.parse(self.dangerousMarkerList[i].lonLat))
          self.dangerousMarkerList[i].extData = extData
        }
      } else {
        self.dangerousMarkerList = []
      }
      /* postDangerousList(self.searchDangerousParam).then(res => {
        if (res.code === 1) {
          if (this.isShowDan === true) {
            self.dangerousMarkerList = res.data.content
            for (let i = 0; i < self.dangerousMarkerList.length; i++) {
              let extData = {}
              extData.title = self.dangerousMarkerList[i].sourceDangerName
              let detail = [
                '危险源危险程度：' + self.dangerousMarkerList[i].riskLevel,
                '安评到期时间：' + self.dangerousMarkerList[i].reportTime,
                '安评状态：' + this.getSafeStatus(self.dangerousMarkerList[i].reportTime),
                '危险源内存量：' + self.dangerousMarkerList[i].principal
              ]
              extData.detail = detail
              self.dangerousMarkerList[i].point = this.getPoint(JSON.parse(self.dangerousMarkerList[i].lonLat))
              self.dangerousMarkerList[i].extData = extData
            }
          }
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      }) */
    },
    // 根据时间判断安评状态
    getSafeStatus (time) {
      if (new Date(time).getTime() > new Date().getTime()) {
        return '正常'
      } else {
        return '异常'
      }
    },
    // 获取储罐点位
    getTankList () {
      var self = this
      postTankMarker().then(res => {
        if (res.resultCode.code === 1) {
          // self.tankMarkerList = res.data.list
          var tankList = res.data.list
          for (let i = 0; i < tankList.length; i++) {
            if (tankList[i].longitude !== null && tankList[i].longitude !== '') {
              let extData = {}
              let tank = {}
              tank.point = { 'lng': tankList[i].longitude, 'lat': tankList[i].latitude }
              tank.type = 'tank'
              extData.title = tankList[i].name
              let detail = [
                '储罐名称：' + tankList[i].name,
                '储存危化品名称：' + tankList[i].storeCargo,
                '储存危化品存量：' + tankList[i].realValume,
                '所属企业：' + tankList[i].companyCreditCode
              ]
              extData.detail = detail
              tank.extData = extData
              self.infoMarkerList.push(tank)
            }
          }
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取堆场点位
    getYardList () {
      var self = this
      postYardMarker().then(res => {
        if (res.resultCode.code === 1) {
          var yardList = res.data.list
          for (var i = 0; i < yardList.length; i++) {
            if (yardList[i].longitude !== null && yardList[i].longitude !== '') {
              let extData = {}
              var yard = {}
              yard.point = { 'lng': yardList[i].longitude, 'lat': yardList[i].latitude }
              yard.type = 'yard'
              extData.title = yardList[i].name
              let detail = [
                '堆场名称：' + yardList[i].name,
                '储存物品名称：' + yardList[i].storeCargo,
                '储存危化品存量：' + yardList[i].realValume,
                '所属企业：' + yardList[i].companyCreditCode
              ]
              extData.detail = detail
              yard.extData = extData
              self.infoMarkerList.push(yard)
            }
          }
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取管道列表
    getPipelineList () {
      var self = this
      postPipelineMarker().then(res => {
        if (res.resultCode.code === 1) {
          self.pipelineMarkerList = res.data.list
          for (let i = 0; i < self.pipelineMarkerList.length; i++) {
            let extData = {}
            extData.title = self.pipelineMarkerList[i].name
            let detail = [
              '管道材质：' + self.pipelineMarkerList[i].material,
              '管道输送品种类：' + self.pipelineMarkerList[i].storeCargo,
              '管道输送量：' + self.pipelineMarkerList[i].valume
            ]
            extData.detail = detail
            self.pipelineMarkerList[i].point = this.getPoint(JSON.parse(self.pipelineMarkerList[i].lonlat))
            self.pipelineMarkerList[i].extData = extData
          }
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取传感器列表
    getSensorList () {
      var self = this
      self.sensorMarkerList = []
      postSensorMarker({ page: 1, size: 100 }).then(res => {
        if (res.code === 1) {
          let sensorList = res.data.content
          for (let i = 0; i < sensorList.length; i++) {
            if (sensorList[i].longitude !== null && sensorList[i].longitude !== '') {
              let extData = {}
              var sensor = {}
              sensor.point = { 'lng': sensorList[i].longitude, 'lat': sensorList[i].latitude }
              sensor.type = this.getSensorType(sensorList[i].equipmentType)
              if (sensor.type === 'video' && this.isShowVideo === false) {
                continue
              } else if (sensor.type === 'pressure' && this.isShowPre === false) {
                continue
              } else if (sensor.type === 'gas' && this.isShowGas === false) {
                continue
              } else if (sensor.type === 'temperature' && this.isShowTem === false) {
                continue
              }
              sensor.extData = extData
              sensor.cameraId = sensorList[i].cameraUuid
              sensor.equipmentType = sensorList[i].equipmentType
              sensor.company = sensorList[i].company
              sensor.address = sensorList[i].address
              sensor.maintenancePhone = sensorList[i].maintenancePhone
              sensor.maintenancePerson = sensorList[i].maintenancePerson
              sensor.num = sensorList[i].num
              sensor.manufacturer = sensorList[i].manufacturer
              sensor.isCallPolice = sensorList[i].dtoData >= sensorList[i].firstThreshold
              self.sensorMarkerList.push(sensor)
            }
          }
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hideLayer (type, status) {
      switch (type) {
        case 'video' :
          this.isShowVideo = status
          break
        case 'tem' :
          this.isShowTem = status
          break
        case 'pre' :
          this.isShowPre = status
          break
        case 'gas' :
          this.isShowGas = status
          break
        case 'dan' :
          this.isShowDan = status
          break
      }
      if (type === 'dan') {
        this.getDangerousList()
      } else {
        this.getSensorList()
      }
    },
    // 获取传感器类别
    getSensorType (type) {
      let sensorType = ''
      switch (type) {
        case 1:
          sensorType = 'video'
          break
        case 2:
          sensorType = 'pressure'
          break
        case 3:
          sensorType = 'gas'
          break
        case 4:
          sensorType = 'temperature'
          break
        case 5:
          sensorType = 'liquid'
          break
        case 6:
          sensorType = 'humidity'
          break
        case 7:
          sensorType = 'pipe'
          break
      }
      return sensorType
    },
    getPoint (point) {
      let centerPoint = {}
      let lng = 0
      let lat = 0
      let num = 0
      point.forEach(item => {
        lng = lng + item.lng
        lat = lat + item.lat
        num++
      })
      if (num === 0) {
        num = 1
      }
      centerPoint.lng = lng / num
      centerPoint.lat = lat / num
      return centerPoint
    },
    // 查看企业详情
    openCompanyDetails: function (companyObj, e) {
      this.companyShowFlag = true
      this.companyObj = companyObj
      this.mapConfig.center.lat = this.companyObj.latitude
      this.mapConfig.center.lng = this.companyObj.longitude
      this.$refs.companyOverlay.reload()
    },
    changeNum () {
      let min = Math.ceil(20.5)
      let max = Math.floor(21)

      this.sensorDetail.manufacturer = Math.random().toFixed(2) * (max - min + 1) + min
    },
    // 查看传感器详情
    openSensorDetails: function (point, index, type) {
      if (type === 'video') {
        this.videoDetail = this.sensorMarkerList[index]
        this.playerOptions.sources[0].src = 'http://111.3.68.229:6713/mag/hls/' + this.videoDetail.cameraId + '/0/live.m3u8'
        this.videoShowFlag = true
        this.$refs.videoOverlay.reload()
      } else {
        this.sensorShowFlag = true
        this.sensorPointDetail = this.sensorMarkerList[index]
        this.sensorDetail = this.sensorMarkerList[index]
        // this.sensorDetail.manufacturer = Math.random().toFixed(2)

        this.mapConfig.center.lat = point.lat
        this.mapConfig.center.lng = point.lng
        this.$refs.sensorOverlay.reload()
      }
    },
    // 查看储罐堆场管道详情  并更具类型判断危险源及管道详情
    openInfoDetails (point, index, type) {
      this.infoWindow.show = true
      if (type === 1) { // 1为重大危险源
        this.infoPointDetail = this.dangerousMarkerList[index]
      } else if (type === 2) { // 2为管道
        this.infoPointDetail = this.pipelineMarkerList[index]
      } else {
        this.infoPointDetail = this.infoMarkerList[index]
      }
      this.infoWindow.extData = this.infoPointDetail.extData
      this.mapConfig.center.lat = point.lat
      this.mapConfig.center.lng = point.lng
      // this.$refs.infoOverlay.reload()
    },
    draw ({ el, BMap, map }) {
      var point = new BMap.Point(this.companyObj.longitude, this.companyObj.latitude)
      const pixel = map.pointToOverlayPixel(point)
      el.style.left = pixel.x - 300 + 'px'
      el.style.top = pixel.y - 400 + 'px'
    },
    closeCompany: function () {
      this.companyShowFlag = false
    },
    openStockModal: function (type) {
      this.$refs.companySearch.openStockModal(type)
    },
    // 打开处理单详情
    openDetail: function (id) {
      this.$refs.detail.receivedCallMsg(id)
    },
    // 打开右边警情详情
    openRightAlarmDetail (alarmDetail) {
      this.$refs.rightAlarmDetail.receivedCallMsg(alarmDetail)
    },
    // 添加视频轮播
    addCarousel: function (flag, json) {
      this.$refs.addCarousel.receivedCallMsg(flag)
      if (flag === 1) {
        this.$refs.addCarousel.getCameraList()
      } else {
        this.$refs.addCarousel.reCarousel(json)
      }
    },
    // 添加问题处理单
    addDeal (data) {
      this.wharfMenu = ''
      this.currentTabComponent = null
      this.$refs.addDeal.openAddDeal(data)
    },
    // 跳转待处理图
    turnImg () {
      this.$refs.companySearch.turnImg()
    },
    showVideo: function () {
      var self = this
      getCameraList().then(res => {
        if (res.resultCode.code === 1) {
          self.videoList = res.data.childCamList
          for (var i = 0; i < self.videoList.length; i++) {
            if (self.videoList[i].lng !== null && self.videoList[i].lng !== '') {
              var video = {}
              video.point = { 'lng': self.videoList[i].lng, 'lat': self.videoList[i].lat }
              video.type = 'video'
              video.name = self.videoList[i].cameraName
              video.cameraId = self.videoList[i].cameraUuid
              self.videoMarkerList.push(video)
            }
          }
        } else {
          self.$Message.warning(res.result)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 显示船舶
    showShip: function () {
      var self = this
      var date = new Date()
      var gt = date.getTime() - 10000
      var lt = date.getTime()
      postShipMarker({ sampleTime: 'gt::' + gt + '::lt::' + lt, pageSize: 50, pageNum: 1 }).then(res => {
        var resultData = JSON.parse(res.data)
        if (resultData.code === 0) {
          self.shipList = resultData.data.rows
          for (let i = 0, len = self.shipList.length; i < len; i++) {
            if (self.shipList[i].location !== null && self.shipList[i].location !== '') {
              var ship = {}
              var lnglat = self.wgs84togcj02tobd09(self.shipList[i].location.lon, self.shipList[i].location.lat)
              ship.point = { 'lng': lnglat[0], 'lat': lnglat[1] }
              ship.type = 'ship'
              ship.rotation = parseInt(self.shipList[i].direct)
              ship.nameId = self.shipList[i].id
              ship.name = self.shipList[i].VNO
              ship.receive_time = self.shipList[i].receive_time
              ship.direct = self.shipList[i].direct
              ship.speed = self.shipList[i].speed
              self.shipMap.set(self.shipList[i].id, ship)
              for (let j = 0, length = self.shipMarkerList.length; j < length; j++) {
                if (self.shipList[i].VNO === self.shipMarkerList[j].name) {
                  self.shipMarkerList.splice(j, 1)
                }
              }
              self.shipMarkerList.push(ship)
            }
          }
        } else {
          self.$Message.warning(resultData.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 显示船舶详情
    showShipDetail (index) {
      this.shipDetail = this.shipMarkerList[index]
      this.shipShowFlag = true
      this.$refs.shipOverlay.reload()
    },
    closeDetail () {
      this.shipShowFlag = false
    },
    closeSensorDetail () {
      this.sensorShowFlag = false
    },
    closeInfoWindow () {
      this.infoWindow.show = false
    },
    drawShipDetail ({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(this.shipDetail.point.lng, this.shipDetail.point.lat))
      el.style.left = pixel.x - 300 + 'px'
      el.style.top = pixel.y - 400 + 'px'
    },
    drawSensorDetail ({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(this.sensorPointDetail.point.lng, this.sensorPointDetail.point.lat))
      el.style.left = pixel.x - 300 + 'px'
      el.style.top = pixel.y - 400 + 'px'
    },
    drawVideoDetail ({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(this.videoDetail.point.lng, this.videoDetail.point.lat))
      el.style.left = pixel.x - 300 + 'px'
      el.style.top = pixel.y - 400 + 'px'
      this.videoName = this.videoDetail.name
    },
    drawInfoDetail ({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(this.infoPointDetail.point.lng, this.infoPointDetail.point.lat))
      el.style.left = pixel.x - 0 + 'px'
      el.style.top = pixel.y - 0 + 'px'
    },
    drawDangerousDetail ({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(this.dangerousPointDetail.point.lng, this.dangerousPointDetail.point.lat))
      el.style.left = pixel.x - 300 + 'px'
      el.style.top = pixel.y - 400 + 'px'
    },
    closeVideo () {
      this.videoShowFlag = false
    },
    /**
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
    // 时间戳
    formatDateTime (inputTime) {
      var date = new Date(inputTime)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    isNull (data) {
      if (data == null || data === 'null' || data === '' || data === undefined || data === 'undefined') {
        return '--'
      } else {
        return data
      }
    },
    getTypeOrUnit (type, flag) {
      let sensorType = ''
      if (flag === 0) {
        switch (type) {
          case 1:
            sensorType = '视频'
            break
          case 2:
            sensorType = '压力'
            break
          case 3:
            sensorType = '燃气'
            break
          case 4:
            sensorType = '温度'
            break
          case 5:
            sensorType = '液位'
            break
        }
      } else if (flag === 1) {
        switch (type) {
          case 1:
            sensorType = 'V'
            break
          case 2:
            sensorType = 'Pa'
            break
          case 3:
            sensorType = 'ppm'
            break
          case 4:
            sensorType = '℃'
            break
          case 5:
            sensorType = 'L'
            break
        }
      }
      return sensorType
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
    }
  }
}
</script>

<style lang="less" scoped>
  .model{
    color: #9db1ba;
    .model-title{
      color: #0DF6FF;
      text-align: center;
      margin-top: 25px;
    }
    .model-content{
      height: 200px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .content{
        table{
          width: 100%;
          td{
            text-align: center;
          }
        }
      }
    }
  }
  /* 地图主容器 */
  .info-window {
    min-width: 390px;
    padding: 10px;
    background: #0a3d52;
    color: #fff;
    border: 1px solid #0de0ff;
    .info-window-title {
      font-size: 16px;
      color: #0de0ff;
      font-weight: normal;
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
      right: 7px;
      font-size: 25px;
      cursor: pointer;
    }
  }
  .map-view {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height:100%;
  }
  .branch {
    position: absolute;
    top: 90px;
    left: 4px;
    width: 39px;
    text-align: center;
  }
  #wharfMonitor{
    /*左侧菜单栏*/
    .left-menu {
      position: absolute;
      top: 166px;
      left: 36px;
      width: 131px;
      height: 209px;
      .menu-item {
        box-sizing: border-box;
        width: 131px;
        height: 35px;
        margin-bottom: 24px;
        padding-left: 10px;
        line-height: 35px;
        text-align: center;
        font-size: 18px;
        color: #0df6ff;
        font-weight: normal;
        cursor: pointer;
      }
      .wharf {
        background: url("../../assets/mapTrack/noChoose.png") no-repeat center;
        background-size: 100% 100%;
        &.active {
          background: url("../../assets/mapTrack/choose.png") no-repeat center;
          color: #fff;
          background-size: 100% 100%;
        }
      }
    }
    .companyDetails {
      position: absolute;
      background: url("../../assets/mapTrack/window2.png") no-repeat center;
      width: 600px;
      height: 450px;
      background-size: 600px 450px;
      /*margin-left: -600px;*/
      /*margin-top: -450px;*/
    }
    .sensor {
      position: absolute;
    }
    .company-table-button{
      height: 36px;
      border: none;
      color: #0ddde5;
      font-size: 16px;
      background: url(../../assets/mapTrack/btn.png) no-repeat;
      width: 96px;
      display:block;
      margin: 0 auto;
    }
    .company-bg{
      margin-top: 400px;
      margin-left:  300px;
      width: 70%;
      height: 65%;
      color: white;
      font-size: 15px;
    }
    .company-bg table{
      width: 90%;
      height: 90%;
      margin: 0 auto;
    }
    .ship-td{
      padding-right: 10px;
      text-align: right;
    }
    .company-table-title{
      text-align: center;
      color: #0AB6C2;
      font-size: 20px;
    }
    .company-certificate-failure{
      display: inline-block;
      color: #E09709;
      margin-right: 10px;
    }
    .company-certificate-failure span{
      padding: 5px;
      border: solid 1px #E09709;
      background-color: #52390A;
    }
    .company-certificate-effective{
      display: inline-block;
      color: #14CD95;
    }
    .company-certificate-effective span{
      padding: 5px;
      border: solid 1px #14CD95;
      background-color: #03291E;
    }
    .company-table-td{
      color: #14CBDE;
      cursor: pointer;
    }
  }
  .mapModel{
    display: inline-flex;
    flex-direction: column;
    .body{
      display: inline-flex;
      flex-direction: row;
      justify-content: space-around;
      height: 58%;
      width: 88%;
      table{
        height: 60%;
        width: 60%;
        margin: 0;
        .msg{
          color: #10C1CC;
        }
        .ship-td{
          text-align: left;
          width: 35%;
        }
      }
      .rightDiv{
        div:nth-child(2){
          color: #FFAF14;
          font-size: 22px;
        }
      }
    }

    .btn{
      width: 60%;
      display: inline-flex;
      flex-direction: row;
      justify-content: space-around;
      margin-left: 20%;
      span{
        color: #16ADC1;
        border: 1px solid #16ADC1;
        padding: 5px 10px;
        cursor: pointer;
      }
    }
    .title{
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      width: 95%;
      div:nth-child(1){
        text-align: center;
        width: 100%;
        color: #0CD9E3;
      }
    }
  }
  .drawVideo{
    .video-js{
      height: 100%;
    }
  }
</style>
