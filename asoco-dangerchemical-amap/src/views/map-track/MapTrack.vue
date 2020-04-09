<template>
  <div class="map-container">
    <!--地图容器-->
    <div id="bMap"></div>
    <!--左侧框体-->
    <div class="branch-emergency"
         v-show="monitorType === $config.monitorType.emergency">
      <img src="../../assets/mapTrack/fenzhi2.png"
           alt=""
           width="28">
    </div>
    <div class="branch-alarm"
         v-show="monitorType === $config.monitorType.alarm">
      <img src="../../assets/mapTrack/fenzhi3.png"
           alt=""
           width="28">
    </div>
    <div class="draw-manager"
         style="cursor: pointer;"
         @click="coverageFlag = coverageFlag ? false : true"
         v-show="mapFlag">
      <span>图层管理</span>
      <img src="../../assets/mapTrack/down.png"
           style="position: relative;top:6px;" />
    </div>
    <div class="draw-labelType"
         v-show="mapFlag && coverageFlag">
      <div id="coverageTree"
           class="ztree"></div>
    </div>
    <div class="videoDiv"
         v-if="videoFlag">
      <div style="background-color: #0D539A;padding: 5px 10px;color: white;height: 25px;">
        <span>{{videoName}}</span>
        <span @click="closeVideo()"
              style="display: inline-block;float: right;font-size: 16px;width:20px;height:20px;cursor: pointer;text-align: center;">×</span>
        <span style="float: right;margin-right: 20px;cursor: pointer;" @click="getSnapPicture(videoId)">截图</span>
      </div>
      <div id="spvDiv"
           style="position:absolute;left: 0;top:30px;right:0;bottom: 0;">
        <!--<p class="load" style="font-size: 20px;cursor: pointer;margin-top:15%;text-align: center;"></p>-->
        <!--<object classid="clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3" id="spv"  width="100%" height="100%" />-->
        <video-player class="video-player vjs-custom-skin"
                      style="width: 100%;height: 100%;"
                      :playsinline="true"
                      :options="playerOptions">
        </video-player>
      </div>
    </div>
    <div class="left-menu"
         v-show="monitorType === $config.monitorType.emergency">
      <h4 class="menu-item emergency"
          :class="{ active: emergencyMenu === $config.emergencyMenu.search }"
          @click="changeEmergencyMenu($config.emergencyMenu.search)">搜&nbsp;&nbsp;&nbsp;&nbsp;索</h4>
      <h4 class="menu-item emergency"
          :class="{ active: emergencyMenu === $config.emergencyMenu.eventAnalysis }"
          @click="changeEmergencyMenu($config.emergencyMenu.eventAnalysis)">事件分析</h4>
      <h4 class="menu-item emergency"
          :class="{ active: emergencyMenu === $config.emergencyMenu.emergCommun }"
          @click="changeEmergencyMenu($config.emergencyMenu.emergCommun)">应急通讯</h4>
      <h4 class="menu-item emergency"
          :class="{ active: emergencyMenu === $config.emergencyMenu.messageSubmit }"
          @click="changeEmergencyMenu($config.emergencyMenu.messageSubmit)">信息报送</h4>
      <h4 class="menu-item emergency"
          :class="{ active: emergencyMenu === $config.emergencyMenu.messageRelease }"
          @click="changeEmergencyMenu($config.emergencyMenu.messageRelease)">信息发布</h4>
      <h4 class="menu-item emergency"
          :class="{ active: emergencyMenu === $config.emergencyMenu.decisionMak }"
          @click="changeEmergencyMenu($config.emergencyMenu.decisionMak)">辅助决策</h4>
    </div>
    <div class="left-menu"
         v-show="monitorType === $config.monitorType.alarm">
      <h4 class="menu-item alarm"
          :class="{ active: alarmMenu === $config.alarmMenu.alarmRegister }"
          @click="changeAlarmMenu($config.alarmMenu.alarmRegister)">接警登记</h4>
      <h4 class="menu-item alarm"
          :class="{ active: alarmMenu === $config.alarmMenu.alarmInfo }"
          @click="changeAlarmMenu($config.alarmMenu.alarmInfo)">报警信息</h4>
      <h4 class="menu-item alarm"
          :class="{ active: alarmMenu === $config.alarmMenu.alarmEvent }">
        <!-- @click="changeAlarmMenu($config.alarmMenu.alarmEvent)">应急事件-->
        <a target="_blank"
           :href="hrefs">应急事件</a></h4>
    </div>
    <div class="map-tab">
      <div class="map-tab-item emergency"
           :class="{ active: monitorType === $config.monitorType.emergency }"
           @click="changeMonitorType($config.monitorType.emergency)"></div>
      <div class="map-tab-item alarm"
           :class="{ active: monitorType === $config.monitorType.alarm }"
           @click="changeMonitorType($config.monitorType.alarm)"></div>
    </div>
    <component v-bind:is="currentTabComponent"
               @getPositionOfCompany="getPositionOfCompany"
               @mapCarShipPoint="mapCarShipPoint"
               @showAlarmAddress="showAlarmAddress"
               @clearMenu="clearMenu"
               @changeEvent="changeEvent"
               @showEditAddress="showEditAddress"
               @showEmergencySupplies="showEmergencySupplies"
               @showEmergencyResources="showEmergencyResources"
               @showPublicResourceAtMap="showPublicResourceAtMap"
               @showCompanyResourceAtMap="showCompanyResourceAtMap"
               @singleCall="singleCall"
               @ajaxLoad="ajaxLoad"
               @ajaxLoadClose="ajaxLoadClose"
               :companyList="companyList"
               :ejson="ejson"
               :isQueue="isQueue"
               :addressLon="addressLon"
               :addressLat="addressLat"
               :savedPlace="savedPlace"
               :companyName="ejson"
               :wsData="wsData"
               :contactNumber1="contactNumber"
               :alarmTime1="alarmTime"
               :uniqueId1="uniqueId"
               :chemical1="chemical"
               :distance="distance"
               :latitude="latitude"
               :alarmId="alarmId"
               :longitude="longitude"></component>
    <component ref="queue"
               @singleCall="singleCall"
               @openAlarmMenu="openAlarmMenu"
               @showDangerSource="showDangerSource"
               @closeDangerousSource="closeDangerousSource"
               @sendEjson="sendEjson"
               @showEmergencyPlan="showEmergencyPlan"
               @getAlarmData="getAlarmData"
               @mapCarShipPoint="mapCarShipPoint"
               @openCall="openCall"
               @getChemical="getChemical"
               @changeCurrentOrAllEvent="changeCurrentOrAllEvent"
               @changeAlarmId="changeAlarmId"
               :queueName="queueName"
               v-bind:is="components.queue"></component>
    <call ref='call' :alarmId="alarmId" :uniqueId="uniqueId"></call>
    <editAddress ref='editAddress'
                 v-show="editShow == 1"
                 @closeEditAddress="closeEditAddress"
                 @editPlace="editPlace"></editAddress>
    <plan ref='plan'
          v-show="planShow == 1"
          @closePlan="closePlan"
          @successPlan="successPlan"></plan>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import 'ztree/js/jquery.ztree.core'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
import { getCompanyByCode, getStorageTankListByCompanyCode, getPipelineAndReportList, getHeweiAndBerth,
  getPointList, getCameraList, getTransReportListByWorkPointId, getPointListByNameOrId,
  getGeoJson, getCompanyGeoJson, getWebsocketUrl } from '@/api/emergency'
import { getSnapPicture } from '@/api/wharf'
import BMapLib from 'BMapLib'
import $ from 'jquery'
import inMap from 'inMap'
import BMap from 'BMap'
import config from '@/config/track'
import register from './components/alarm/register/register'
import info from './components/alarm/info/info'
import queue from './components/queue_event/queue'
import communication from './components/emergency/communication/communication'
import search from './components/emergency/search/search'
import analysis from './components/emergency/analysis/analysis'
import infosubmit from './components/emergency/infoSubmit/infoSubmit'
import inforelease from './components/emergency/infoRelease/infoRelease'
import aiddecision from './components/emergency/aidDecision/aidDecision'
import cg1 from '@/assets/mapTrack/cg1.svg'
import cg2 from '@/assets/mapTrack/cg2.svg'
import cg3 from '@/assets/mapTrack/cg3.svg'
import cg4 from '@/assets/mapTrack/cg4.svg'
import cg5 from '@/assets/mapTrack/cg5.svg'
import cg6 from '@/assets/mapTrack/cg6.svg'
import icQiye2 from '@/assets/mapTrack/ic_qiye2.png'
import icBowei from '@/assets/mapTrack/ic_bowei.svg'
import icHewei from '@/assets/mapTrack/ic_hewei.svg'
import icVedio from '@/assets/mapTrack/ic_vedio.svg'
import shipImg from '@/assets/mapTrack/240.png'
import carImg from '@/assets/mapTrack/ic_cheliang.svg'
import guanbi from '@/assets/mapTrack/close.png'
import window1 from '@/assets/mapTrack/window1.png'
import window2 from '@/assets/mapTrack/window2.png'
import pullDown from '@/assets/mapTrack/pull_down.png'
import pullUp from '@/assets/mapTrack/pull_up.png'
import dangerSourceImg from '@/assets/mapTrack/dangerSource.png'
import callBlue from '@/assets/mapTrack/call_blue.png'
import hydrant from '@/assets/mapTrack/hydrant.png'
import fireCovers from '@/assets/mapTrack/fire_covers.png'
import fireCock from '@/assets/mapTrack/fire_cock.png'
import barrierGate from '@/assets/mapTrack/barrier_gate.png'
import baseStation from '@/assets/mapTrack/base_station.png'
import tower from '@/assets/mapTrack/tower.png'
import airDefenseSigns from '@/assets/mapTrack/air_defense_signs.png'
import airVent from '@/assets/mapTrack/air_vent.png'
import trafficSquare from '@/assets/mapTrack/traffic_square.png'
import leisureSquare from '@/assets/mapTrack/leisure_square.png'
import school from '@/assets/mapTrack/school.png'
import facilityAccess from '@/assets/mapTrack/facility_access.png'
import drugstore from '@/assets/mapTrack/drugstore.png'
import clinic from '@/assets/mapTrack/clinic.png'
import hospital from '@/assets/mapTrack/hospital.png'
import video from '@/assets/mapTrack/video.png'
import petrolStation from '@/assets/mapTrack/petrol_station.png'
import gasStation from '@/assets/mapTrack/gas_station.png'
import storageTank from '@/assets/mapTrack/storage_tank.png'
import whpStorageTank from '@/assets/mapTrack/whp_storage_tank.png'
import crane from '@/assets/mapTrack/crane.png'
import emergencyFacilities from '@/assets/mapTrack/emergency_facilities.png'
import wareHouse from '@/assets/mapTrack/ware_house.png'
import location from '@/assets/mapTrack/location.png'
import analysisBg from '@/assets/mapTrack/analysis_backgroud.png'
import analysisDel from '@/assets/mapTrack/analysis_del.png'
import publicResourceImg from '@/assets/mapTrack/publicResource.png'
import companyResourceImg from '@/assets/mapTrack/companyResource.png'
import call from './components/call/call'
import editAddress from './components/alarm/register/editAddress'
import plan from './components/plan/plan'

export default {
  // 绑定call子页面
  // --------------
  components: {
    call: call,
    editAddress: editAddress,
    plan: plan
  },
  // -----------------
  data () {
    return {
      hrefs: this.$config.ecs + '/#/daily-manage/emergency-event',
      editShow: 0,
      token: this.$store.state.user.token,
      inMap: null,
      bMap: null,
      monitorType: config.monitorType.emergency,
      currentTabComponent: null,
      emergencyMenu: '',
      alarmMenu: '',
      components: {
        register: register,
        queue: queue,
        communication: communication,
        search: search,
        analysis: analysis,
        infosubmit: infosubmit,
        inforelease: inforelease,
        aiddecision: aiddecision
      },
      loadFlag: false,
      images: {
        cg1: cg1,
        cg2: cg2,
        cg3: cg3,
        cg4: cg4,
        cg5: cg5,
        cg6: cg6,
        icQiye2: icQiye2,
        icBowei: icBowei,
        icHewei: icHewei,
        icVedio: icVedio,
        shipImg: shipImg,
        carImg: carImg,
        guanbi: guanbi,
        window1: window1,
        pullDown: pullDown,
        pullUp: pullUp,
        window2: window2,
        dangerSourceImg: dangerSourceImg,
        callBlue: callBlue,
        analysisBg: analysisBg,
        analysisDel: analysisDel,
        publicResourceImg: publicResourceImg,
        companyResourceImg: companyResourceImg
      },
      companyGeo: {
        dataMarker: null,
        dataList: []
      },
      xml: '',
      camera: {},
      ocxObj: null,
      /* 点位数据 */
      pointTreeList: [
        {
          layerName: '消防栓',
          dataMarkerList: [],
          icon: hydrant,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '消防井盖',
          dataMarkerList: [],
          icon: fireCovers,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '消防龙头',
          dataMarkerList: [],
          icon: fireCock,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '泡沫站',
          dataMarkerList: [],
          icon: fireCock,
          dataList: [],
          type: 'Point' // todo 待确认
        },
        {
          layerName: '通讯基站',
          dataMarkerList: [],
          icon: baseStation,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '通讯铁塔',
          dataMarkerList: [],
          icon: tower,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '人防指示牌',
          dataMarkerList: [],
          icon: airDefenseSigns,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '人防通风口',
          dataMarkerList: [],
          icon: airVent,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '交通广场',
          dataMarkerList: [],
          icon: trafficSquare,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '休闲广场',
          dataMarkerList: [],
          icon: leisureSquare,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '学校',
          dataMarkerList: [],
          icon: school,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '设施出入口',
          dataMarkerList: [],
          icon: facilityAccess,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '道闸',
          dataMarkerList: [],
          icon: barrierGate,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '主干道',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '次干道',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '药店',
          dataMarkerList: [],
          icon: drugstore,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '诊所',
          dataMarkerList: [],
          icon: clinic,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '医院',
          dataMarkerList: [],
          icon: hospital,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '监控电子眼',
          dataMarkerList: [],
          icon: video,
          dataList: [],
          type: 'Point'
        },
        /* {
          layerName: '企业内传感器',
          dataMarkerList: [],
          icon: sensor,
          dataList: [],
          type: 'Point'
        }, */
        {
          layerName: '加油站',
          dataMarkerList: [],
          icon: petrolStation,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '压缩天然气加气站',
          dataMarkerList: [],
          icon: gasStation,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '压缩天然气储配站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '液化石油气储配站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '人工煤气储配站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '危险化学品存储罐',
          dataMarkerList: [],
          icon: whpStorageTank,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '废物处理区',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '事故缓冲站',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '生产辅助区',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '罐区',
          dataMarkerList: [],
          icon: storageTank,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(7,101,151,0.71)'
        },
        {
          layerName: '钢瓶区',
          dataMarkerList: [],
          icon: null,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '装卸区',
          dataMarkerList: [],
          icon: crane,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        },
        {
          layerName: '应急设施',
          dataMarkerList: [],
          icon: emergencyFacilities,
          dataList: [],
          type: 'Point'
        },
        {
          layerName: '仓库',
          dataMarkerList: [],
          icon: wareHouse,
          dataList: [],
          type: 'MultiPolygon',
          backgroundColor: 'rgba(252,196,95,0.71)'
        }
      ],
      coverageFlag: true,
      mapFlag: true,
      videoFlag: false,
      coverageTreeData: [
        { id: 1, pid: null, name: '消防设施', isChecked: true },
        { id: 101, pid: 1, name: '消防栓', msg: 9, isChecked: true },
        { id: 102, pid: 1, name: '消防井盖', msg: 10, isChecked: true },
        { id: 103, pid: 1, name: '消防龙头', msg: 11, isChecked: true },
        { id: 104, pid: 1, name: '泡沫站', msg: 12, isChecked: true },
        { id: 2, pid: null, name: '通讯设施', isChecked: true },
        { id: 201, pid: 2, name: '通讯基站', msg: 13, isChecked: true },
        { id: 202, pid: 2, name: '通讯铁塔', msg: 14, isChecked: true },
        { id: 3, pid: null, name: '应急疏散', isChecked: true },
        { id: 301, pid: 3, name: '人防指示牌', msg: 15, isChecked: true },
        { id: 302, pid: 3, name: '人防通风口', msg: 16, isChecked: true },
        { id: 303, pid: 3, name: '交通广场', msg: 17, isChecked: true },
        { id: 304, pid: 3, name: '休闲广场', msg: 18, isChecked: true },
        { id: 305, pid: 3, name: '学校', msg: 19, isChecked: true },
        { id: 306, pid: 3, name: '设施出入口', msg: 20, isChecked: true },
        { id: 307, pid: 3, name: '道闸', msg: 21, isChecked: true },
        { id: 308, pid: 3, name: '企业', msg: 1, isChecked: true },
        { id: 4, pid: null, name: '重点道路', isChecked: true },
        { id: 401, pid: 4, name: '主干道', msg: 22, isChecked: true },
        { id: 402, pid: 4, name: '次干道', msg: 23, isChecked: true },
        { id: 5, pid: null, name: '医疗设施', isChecked: true },
        { id: 501, pid: 5, name: '药店', msg: 24, isChecked: true },
        { id: 502, pid: 5, name: '诊所', msg: 25, isChecked: true },
        { id: 503, pid: 5, name: '医院', msg: 26, isChecked: true },
        { id: 6, pid: null, name: '传感监控', isChecked: true },
        { id: 601, pid: 6, name: '监控电子眼', msg: 4, isChecked: true },
        { id: 602, pid: 6, name: '企业内传感器', msg: 27, isChecked: true },
        { id: 7, pid: null, name: '重大危险源', isChecked: true },
        { id: 701, pid: 7, name: '加油站', msg: 28, isChecked: true },
        { id: 702, pid: 7, name: '压缩天然气加气站', msg: 29, isChecked: true },
        { id: 703, pid: 7, name: '压缩天然气储配站', msg: 30, isChecked: true },
        { id: 704, pid: 7, name: '液化石油气储配站', msg: 31, isChecked: true },
        { id: 705, pid: 7, name: '人工煤气储配站', msg: 32, isChecked: true },
        { id: 706, pid: 7, name: '危险化学品存储罐', msg: 6, isChecked: true },
        { id: 8, pid: null, name: '危险区域', isChecked: true },
        { id: 801, pid: 8, name: '废物处理区', msg: 33, isChecked: true },
        { id: 802, pid: 8, name: '事故缓冲站', msg: 34, isChecked: true },
        { id: 803, pid: 8, name: '生产辅助区', msg: 35, isChecked: true },
        { id: 804, pid: 8, name: '罐区', msg: 36, isChecked: true },
        { id: 805, pid: 8, name: '钢瓶区', msg: 37, isChecked: true },
        { id: 806, pid: 8, name: '装卸区', msg: 7, isChecked: true },
        { id: 808, pid: 8, name: '应急设施', msg: 38, isChecked: true },
        { id: 809, pid: 8, name: '仓库', msg: 39, isChecked: true },
        { id: 810, pid: 8, name: '管道', msg: 5, isChecked: true },
        { id: 812, pid: 8, name: '泊位', msg: 8, isChecked: true },
        { id: 9, pid: null, name: '运输力量', isChecked: true },
        { id: 901, pid: 9, name: '车辆', msg: 2, isChecked: true },
        { id: 902, pid: 9, name: '船舶', msg: 3, isChecked: true }
      ],
      coverageTreeObj: null,
      coverageTreeSetting: {
        callback: {
          onClick: this.coverageTreeOnClick,
          onCheck: this.coverageTreeOnCheck
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
          },
          key: {
            checked: 'isChecked'
          }
        },
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: { 'Y': 'ps', 'N': 'ps' }
        },
        view: {
          showIcon: false,
          fontCss: {
            color: 'white',
            fontSize: '14px'
          }
        }
      },
      storageTankList: [],
      chuguanMarkerList: [],
      chugaunMarkers: [],
      companyList: [],
      companyMarkerList: [],
      heweiList: [],
      workPointMarkerList: [],
      wharfMarkerList: [],
      boweiMarkerList: [],
      heweiMarkerList: [],
      videoMarkerList: [],
      carList: [],
      shipList: [],
      shipMarkerList: [],
      carMarkerList: [],
      historyPointList: [],
      historyMarker: [],
      historyPointMarker: [],
      pipelineList: [],
      pipelineMarkerList: [],
      lastInfoBox: null,
      lastInfoBox1: null,
      dangerSource: {
        company: '',
        eventType: '',
        eventAddress: '',
        eventTime: '',
        contact: '',
        contactPhone: '',
        eventDetails: ''
      },
      /* 点击储罐显示信息 */
      detailsShowTag: 0,
      inReportShowTag: 0,
      traceShowFlag: true,
      deleteHisPointShowFlag: false,
      reportTitle: '存量',
      inOutDataList: [],
      inOutDataTotal: 0,
      inOutDataTotalPages: 1,
      dayStockOfVisualization: {
        num: '',
        address: '',
        companyName: '',
        whpName: '',
        cargoCount: 0,
        dayInCount: 0,
        dayOutCount: 0,
        time: ''
      },
      searchInOutDataParam: {
        token: '',
        type: '',
        workPointNum: '',
        page: 1,
        rows: 5
      },
      storageTankDetails: {
        id: '',
        num: '',
        address: '',
        longitude: '',
        latitude: '',
        valume: '',
        storeCargo: '',
        companyCreditCode: ''
      },
      // 添加接警字段
      contactNumber: '',
      alarmTime: '',
      uniqueId: '',
      queueName: '通话队列',
      ejson: {},
      wsData: {},
      isQueue: 0,
      addressLon: '',
      addressLat: '',
      savedPlace: '',
      markerDetail: '',
      dangerSourceMarker: '',
      dangerSourceCircle: '',
      planShow: 0,
      carShipMarker: null,
      chemical: '',
      username: '',
      distance: 2000,
      latitude: 0,
      longitude: 0,
      wsuri: 'ws://192.168.108.130:9090/voice/userName',
      publicResourceMarker: [],
      companyResourceMarker: [],
      playerOptions: {
        //  playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
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
        // poster: "poster.jpg", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //  controlBar: {
        //   timeDivider: true,
        //   durationDisplay: true,
        //   remainingTimeDisplay: false,
        //   fullscreenToggle: true //全屏按钮
        //  }
      },
      videoName: '',
      videoId: '',
      currentOrAllEvent: '',
      alarmId: '',
      uniqueId: ''
    }
  },
  // 打开页面初始化websocket
  // ------------------
  created () {
    getWebsocketUrl().then(res => {
      this.wsuri = 'ws://' + res.data + '/socket/callMsg/1/test'
      this.initWebSocket()
    }).catch(err => {
      console.log(err)
    })
  },
  // 页面销毁时关闭长连接
  destroyed: function () {
    this.websocketclose()
  },
  // ---------------------
  mounted () {
    var self = this
    // self.ajaxLoad()
    self.getUserName()
    this.initMap()
    // this.initOverlay()
    self.getGeoJson()
    self.getCompanyGeo()
    self.initUserInfo()
    // 控制地图放大缩小时显示的图层
    self.bMap.addEventListener('zoomend', function (a, b) {
      var zoom = self.bMap.getZoom()
      if (zoom > 10) {
        self.hideLayer('监控电子眼')
        self.hideLayer('企业内传感器')
        self.showOrhide(2, false)
        self.showOrhide(3, false)
        self.showOrhide(5, false)
        self.showOrhide(8, false)
        if (self.mapFlag) {
          if (self.isShowOrHide('管道')) {
            self.showOrhide(2, true)
            self.showOrhide(3, true)
            self.showOrhide(5, true)
            self.showOrhide(8, true)
          }
          if (self.isShowOrHide('监控电子眼')) {
            // 显示监控电子眼
            self.getSingleGeoJson('监控电子眼')
          }
          if (self.isShowOrHide('企业内传感器')) {
            // 显示企业内传感器
            self.getSingleGeoJson('企业内传感器')
          }
        }
      } else {
        self.showOrhide(2, false)
        self.showOrhide(3, false)
        self.showOrhide(5, false)
        self.showOrhide(8, false)
        self.hideLayer('监控电子眼')
        self.hideLayer('企业内传感器')
      }
      if (zoom > 15) {
        self.hideLayer('交通广场')
        self.hideLayer('休闲广场')
        self.hideLayer('学校')
        self.hideLayer('药店')
        self.hideLayer('诊所')
        self.hideLayer('医院')
        self.hideLayer('加油站')
        self.hideLayer('压缩天然气加气站')
        self.hideLayer('压缩天然气储配站')
        self.hideLayer('液化石油气储配站')
        self.hideLayer('人工煤气储配站')
        self.hideLayer('主干道')
        self.hideLayer('次干道')
        if (self.mapFlag) {
          if (self.isShowOrHide('交通广场')) {
            // 显示交通广场
            self.getSingleGeoJson('交通广场')
          }
          if (self.isShowOrHide('休闲广场')) {
            // 显示休闲广场
            self.getSingleGeoJson('休闲广场')
          }
          if (self.isShowOrHide('学校')) {
            // 显示学校
            self.getSingleGeoJson('学校')
          }
          if (self.isShowOrHide('药店')) {
            // 显示药店
            self.getSingleGeoJson('药店')
          }
          if (self.isShowOrHide('诊所')) {
            // 显示诊所
            self.getSingleGeoJson('诊所')
          }
          if (self.isShowOrHide('医院')) {
            // 显示医院
            self.getSingleGeoJson('医院')
          }
          if (self.isShowOrHide('加油站')) {
            // 显示加油站
            self.getSingleGeoJson('加油站')
          }
          if (self.isShowOrHide('压缩天然气加气站')) {
            // 显示压缩天然气加气站
            self.getSingleGeoJson('压缩天然气加气站')
          }
          if (self.isShowOrHide('压缩天然气储配站')) {
            // 显示压缩天然气储配站
            self.getSingleGeoJson('压缩天然气储配站')
          }
          if (self.isShowOrHide('液化石油气储配站')) {
            // 显示液化石油气储配站
            self.getSingleGeoJson('液化石油气储配站')
          }
          if (self.isShowOrHide('人工煤气储配站')) {
            // 显示人工煤气储配站
            self.getSingleGeoJson('人工煤气储配站')
          }
          if (self.isShowOrHide('主干道')) {
            // 显示主干道
            self.getSingleGeoJson('主干道')
          }
          if (self.isShowOrHide('次干道')) {
            // 显示次干道
            self.getSingleGeoJson('次干道')
          }
        }
      } else {
        self.hideLayer('交通广场')
        self.hideLayer('休闲广场')
        self.hideLayer('学校')
        self.hideLayer('药店')
        self.hideLayer('诊所')
        self.hideLayer('医院')
        self.hideLayer('加油站')
        self.hideLayer('压缩天然气加气站')
        self.hideLayer('压缩天然气储配站')
        self.hideLayer('液化石油气储配站')
        self.hideLayer('人工煤气储配站')
        self.hideLayer('主干道')
        self.hideLayer('次干道')
      }
      if (zoom > 17) {
        self.removeChuGuan()
        self.hideLayer('消防栓')
        self.hideLayer('消防井盖')
        self.hideLayer('消防龙头')
        self.hideLayer('通讯基站')
        self.hideLayer('通讯铁塔')
        self.hideLayer('人防指示牌')
        self.hideLayer('人防通风口')
        self.hideLayer('设施出入口')
        self.hideLayer('道闸')
        self.hideLayer('危险化学品存储罐')
        self.hideLayer('废物处理区')
        self.hideLayer('事故缓冲站')
        self.hideLayer('生产辅助区')
        self.hideLayer('罐区')
        self.hideLayer('钢瓶区')
        self.hideLayer('装卸区')
        self.hideLayer('应急设施')
        self.hideLayer('仓库')
        self.showOrhide(7, false)
        if (self.mapFlag) {
          if (self.isShowOrHide('装卸区')) {
            self.showOrhide(7, true)
          }
          if (self.storageTankFlag) {
            self.showStorageTank()
          }
          if (self.isShowOrHide('消防栓')) {
            // 显示消防栓
            self.getSingleGeoJson('消防栓')
          }
          if (self.isShowOrHide('消防井盖')) {
            // 显示消防井盖
            self.getSingleGeoJson('消防井盖')
          }
          if (self.isShowOrHide('消防龙头')) {
            // 显示消防龙头
            self.getSingleGeoJson('消防龙头')
          }
          if (self.isShowOrHide('通讯基站')) {
            // 显示通讯基站
            self.getSingleGeoJson('通讯基站')
          }
          if (self.isShowOrHide('通讯铁塔')) {
            // 显示通讯铁塔
            self.getSingleGeoJson('通讯铁塔')
          }
          if (self.isShowOrHide('人防指示牌')) {
            // 显示人防指示牌
            self.getSingleGeoJson('人防指示牌')
          }
          if (self.isShowOrHide('人防通风口')) {
            // 显示人防通风口
            self.getSingleGeoJson('人防通风口')
          }
          if (self.isShowOrHide('设施出入口')) {
            // 显示设施出入口
            self.getSingleGeoJson('设施出入口')
          }
          if (self.isShowOrHide('道闸')) {
            // 显示道闸
            self.getSingleGeoJson('道闸')
          }
          if (self.isShowOrHide('危险化学品存储罐')) {
            // 危险化学品存储罐
            self.getSingleGeoJson('危险化学品存储罐')
          }
          if (self.isShowOrHide('废物处理区')) {
            // 显示废物处理区
            self.getSingleGeoJson('废物处理区')
          }
          if (self.isShowOrHide('事故缓冲站')) {
            // 显示事故缓冲站
            self.getSingleGeoJson('事故缓冲站')
          }
          if (self.isShowOrHide('生产辅助区')) {
            // 显示生产辅助区
            self.getSingleGeoJson('生产辅助区')
          }
          if (self.isShowOrHide('罐区')) {
            // 显示罐区
            self.getSingleGeoJson('罐区')
          }
          if (self.isShowOrHide('钢瓶区')) {
            // 显示钢瓶区
            self.getSingleGeoJson('钢瓶区')
          }
          if (self.isShowOrHide('装卸区')) {
            // 显示装卸区
            self.getSingleGeoJson('装卸区')
          }
          if (self.isShowOrHide('应急设施')) {
            // 显示应急设施
            self.getSingleGeoJson('应急设施')
          }
          if (self.isShowOrHide('仓库')) {
            // 显示仓库
            self.getSingleGeoJson('仓库')
          }
        }
      } else {
        self.removeChuGuan()
        self.showOrhide(7, false)
        self.hideLayer('消防栓')
        self.hideLayer('消防井盖')
        self.hideLayer('消防龙头')
        self.hideLayer('通讯基站')
        self.hideLayer('通讯铁塔')
        self.hideLayer('人防指示牌')
        self.hideLayer('人防通风口')
        self.hideLayer('设施出入口')
        self.hideLayer('道闸')
        self.hideLayer('危险化学品存储罐')
        self.hideLayer('废物处理区')
        self.hideLayer('事故缓冲站')
        self.hideLayer('生产辅助区')
        self.hideLayer('罐区')
        self.hideLayer('钢瓶区')
        self.hideLayer('装卸区')
        self.hideLayer('应急设施')
        self.hideLayer('仓库')
      }
    })
    self.coverageTreeObj = $.fn.zTree.init($('#coverageTree'), self.coverageTreeSetting, self.coverageTreeData)
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'handleLogOut'
    ]),
    initUserInfo () {
      this.getUserInfo().then(user => {
        console.log('user', user)
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @description 初始化地图
     */
    // 初始化百度地图并加载所有图层、百度地图模块修改暂时先搁置
    initMap: function () {
      var self = this
      self.inMap = null
      self.bMap = null
      if (!self.inMap) {
        self.inMap = new inMap.Map({
          id: 'bMap',
          skin: 'Blueness',
          center: [121.071573, 30.588971], // 地图中心点
          radius: 5,
          zoom: {
            value: 15, // 当前地图级别
            show: true, // 放大缩小按钮显示
            max: 19,
            min: 5
          }
        })
        self.bMap = this.inMap.getMap()
        // self.bMap.centerAndZoom(new BMap.Point(121.071573, 30.588971), 17)
        /* 开启鼠标滚轮缩放 */
        // self.bMap.enableScrollWheelZoom(true)
        /* 地图样式 */
        var styleJson = '[' +
          '{' +
          '"featureType": "water",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#0E5978"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "highway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#147a92"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "arterial",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#0b3d51"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "local",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "land",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#052237"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "railway",' +
          '"elementType": "geometry.stroke",' +
          '"stylers": {' +
          '"color": "#08304b"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "subway",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"lightness": -70' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry.fill",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#857f7f"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.stroke",' +
          '"stylers": {' +
          '"color": "#000000"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "building",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "green",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#062032"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "boundary",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"color": "#1e1c1c"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "manmade",' +
          '"elementType": "geometry",' +
          '"stylers": {' +
          '"color": "#022338"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "poi",' +
          '"elementType": "all",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.icon",' +
          '"stylers": {' +
          '"visibility": "off"' +
          '}' +
          '},' +
          '{' +
          '"featureType": "all",' +
          '"elementType": "labels.text.fill",' +
          '"stylers": {' +
          '"color": "#2da0c6",' +
          '"visibility": "on"' +
          '}' +
          '}' +
          ']'
        self.bMap.setMapStyle({
          styleJson: JSON.parse(styleJson)
        })
        self.getStorageTank()
        self.showCompany()
        self.showWharf()
        self.showHeweiAndBerth()
        self.showCameraList()
        self.showCarAndShip()
        // self.showPipeline()  // 管道图层暂时隐藏
        // self.showDangerSource()
      }
    },
    getUserName () {
      this.username = this.$store.state.user.userName
      console.log(this.username)
    },
    // 根据图层名称判断图层是否显示或隐藏
    isShowOrHide: function (layerName) { // 获取树节点，判断是否显示
      var self = this
      var nodes = self.coverageTreeObj.getNodes()
      var arr = self.coverageTreeObj.transformToArray(nodes)
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].pid !== null && arr[i].name === layerName) {
          return arr[i].isChecked
        }
      }
      return false
    },
    // 根据图层名称隐藏该图层
    hideLayer: function (layerName) {
      var self = this
      var list = self.getDataMarkerList(layerName)
      for (var i = 0; i < list.length; i++) {
        self.inMap.remove(list[i])
      }
    },
    // 显示成功提示
    success (msg) {
      this.$Message.success(msg)
    },
    // 显示警告提示
    warning (msg) {
      this.$Message.warning(msg)
    },
    // 显示错误提示
    error: function (err) {
      this.$Message.error(err)
    },
    // 打开初始化状态标志
    ajaxLoad: function () {
      this.loadFlag = true
    },
    // 关闭初始化状态标志
    ajaxLoadClose: function () {
      this.loadFlag = false
    },
    /**
     * 设置地图中心点和层级
     * @param center
     * @param zoom
     */
    setCenterAndZoom (center, zoom) {
      this.bMap.setZoom(zoom)
      this.bMap.panTo(new BMap.Point(center[0], center[1]))
    },
    // 获取所有的储罐信息
    getStorageTank: function () {
      var self = this
      var chuguan1 = new BMap.Icon(self.images.cg1, new BMap.Size(29, 27))
      var chuguan2 = new BMap.Icon(self.images.cg2, new BMap.Size(33, 30))
      var chuguan3 = new BMap.Icon(self.images.cg3, new BMap.Size(37, 34))
      var chuguan4 = new BMap.Icon(self.images.cg4, new BMap.Size(41, 38))
      var chuguan5 = new BMap.Icon(self.images.cg5, new BMap.Size(45, 42))
      var chuguan6 = new BMap.Icon(self.images.cg6, new BMap.Size(49, 46))
      self.ajaxLoad()
      getStorageTankListByCompanyCode({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.storageTankList = res.data
        for (var i = 0; i < self.storageTankList.length; i++) {
          if (self.storageTankList[i].imageSize === 1) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan1 })
          } else if (self.storageTankList[i].imageSize === 2) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan2 })
          } else if (self.storageTankList[i].imageSize === 3) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan3 })
          } else if (self.storageTankList[i].imageSize === 4) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan4 })
          } else if (self.storageTankList[i].imageSize === 5) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan5 })
          } else if (self.storageTankList[i].imageSize === 6) {
            self.chugaunMarkers[i] = new BMap.Marker(new BMap.Point(self.storageTankList[i].longitude, self.storageTankList[i].latitude), { icon: chuguan6 })
          }
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 显示储罐图层
    showStorageTank: function () {
      var self = this
      for (var i = 0; i < self.chugaunMarkers.length; i++) {
        var marker = self.chugaunMarkers[i]
        marker.num = self.storageTankList[i].num
        marker.addEventListener('click', clickChuguan)
        self.bMap.addOverlay(marker)
        self.chuguanMarkerList.push(marker)
      }
      function clickChuguan (event) {
        var marker = event.target
        var num = marker.num
        // 储罐
        var content = ''
        var tankCount = 0
        var cargoDayInCount = 0
        var cargoDayOutCount = 0
        for (var i = 0; i < self.storageTankList.length; i++) {
          if (self.storageTankList[i].num === num) {
            self.dayStockOfVisualization.num = self.storageTankList[i].num
            self.dayStockOfVisualization.address = self.storageTankList[i].companyAddress
            self.dayStockOfVisualization.companyName = self.storageTankList[i].companyName
            self.dayStockOfVisualization.whpName = self.storageTankList[i].whpName
            self.dayStockOfVisualization.cargoCount = self.storageTankList[i].cargoCount
            self.dayStockOfVisualization.dayInCount = self.storageTankList[i].cargoDayInCount
            self.dayStockOfVisualization.dayOutCount = self.storageTankList[i].cargoDayOutCount
            self.dayStockOfVisualization.time = self.storageTankList[i].time
            if (self.storageTankList[i].cargoCount !== null) {
              tankCount = self.storageTankList[i].cargoCount
              cargoDayInCount = self.storageTankList[i].cargoDayInCount
              cargoDayOutCount = self.storageTankList[i].cargoDayOutCount
            }
            content = '<div style="margin: 10px;color: white;">' + self.storageTankList[i].num +
              '<br>危化品现存' + self.storageTankList[i].cargoName + tankCount + '吨<br>' +
              '今日流入危化品' + cargoDayInCount + '吨<br>' +
              '今日流出危化品' + cargoDayOutCount + '吨</div>'
          }
        }
        if (self.lastInfoBox !== null) {
          self.lastInfoBox.close()
        }
        self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(15, 20),
          boxStyle: {
            background: 'url("' + self.images.window1 + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: '200px',
            height: '100px'
          },
          closeIconUrl: self.images.guanbi,
          closeIconWidth: '15px',
          closeIconMargin: '5px 5px 0 0',
          enableAutoPan: true,
          align: 1
        })
        /* self.lastInfoBox.open(marker) */
        self.detailsShowTag = 1
        self.inOutDataList = []
        self.inReportShowTag = 0
      }
    },
    // 显示所有的企业图层
    showCompany: function () {
      var self = this
      var companyImg = new BMap.Icon(self.images.icQiye2, new BMap.Size(32, 33))
      self.ajaxLoad()
      getCompanyByCode({ creditCode: '', token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.companyList = res.data
        for (var i = 0; i < self.companyList.length; i++) {
          if (self.companyList[i].longitude !== null && self.companyList[i].longitude !== '') {
            var point = new BMap.Point(self.companyList[i].longitude, self.companyList[i].latitude)
            var marker = new BMap.Marker(point, { icon: companyImg })
            marker.creditCode = self.companyList[i].creditCode
            marker.addEventListener('click', self.clickCompany)
            self.bMap.addOverlay(marker)
            self.companyMarkerList.push(marker)
          }
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 根据输入框中的信息定位相应的企业位置并显示企业详情
    getPositionOfCompany: function (point, content) {
      var self = this
      self.bMap.centerAndZoom(point, 16)
      self.clickCompanyList(point, content, 250, 195, self.images.window1, self.images.guanbi, '10px 10px 0 0')
    },
    clickCompany: function (event) {
      var self = this
      var marker = event.target
      var creditCode = marker.creditCode
      var point = marker.getPosition()
      var content = ''
      for (var i = 0; i < self.companyList.length; i++) {
        var cargoTotal = 0
        var cargoTotalDayInCount = 0
        var cargoTotalDayOutCount = 0
        var cargoExpectInCount = 0
        var cargoExpectOutCount = 0
        if (self.companyList[i].totalStock != null) {
          cargoTotal = self.companyList[i].totalStock
          cargoTotalDayInCount = self.companyList[i].totalDayInCount
          cargoTotalDayOutCount = self.companyList[i].totalDayOutCount
        }
        if (self.companyList[i].expectInCount != null) {
          cargoExpectInCount = self.companyList[i].expectInCount
        }
        if (self.companyList[i].expectOutCount != null) {
          cargoExpectOutCount = self.companyList[i].expectOutCount
        }
        if (self.companyList[i].creditCode === creditCode) {
          content = '<div style="width: 80%;margin-top: 20px; margin-left: 20px;color: white;">' + self.companyList[i].name +
            '<br>危化品现存' + cargoTotal + '吨<br>' +
            '预计今日流入危化品' + cargoExpectInCount + '吨<br>' +
            '今日流入危化品' + cargoTotalDayInCount + '吨<br>' +
            '预计今日流出危化品' + cargoExpectOutCount + '吨<br>' +
            '今日流出危化品' + cargoTotalDayOutCount + '吨</div>'
        }
      }
      self.clickCompanyList(point, content, 250, 195, self.images.window1, self.images.guanbi, '10px 10px 0 0')
    },
    clickCompanyList (point, content, infoWindowWidth, infoWindowHeight, background, closeIconUrl, closeIconMargin) {
      var self = this
      if (self.lastInfoBox !== null) {
        self.lastInfoBox.close()
      }
      self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
        offset: new BMap.Size(15, 20),
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
    // 显示鹤位和泊位图层
    showHeweiAndBerth: function () {
      var self = this
      self.ajaxLoad()
      // 获取鹤位和泊位信息
      getHeweiAndBerth({ token: self.token, name: '', num: '', page: 1, rows: 50 }).then(res => {
        self.ajaxLoadClose()
        self.heweiList = res.data.list
        var heweiImg = new BMap.Icon(self.images.icHewei, new BMap.Size(18, 18))
        var bowei = new BMap.Icon(self.images.icBowei, new BMap.Size(18, 18))
        for (var i = 0; i < self.heweiList.length; i++) {
          if (self.heweiList[i].type === 1) {
            var berth = new BMap.Marker(new BMap.Point(self.heweiList[i].longitude, self.heweiList[i].latitude), { icon: bowei })
            berth.berthId = self.heweiList[i].id
            berth.berthName = self.heweiList[i].name
            berth.addEventListener('click', clickBerthMark)
            self.bMap.addOverlay(berth)
            self.wharfMarkerList.push(berth)
            self.workPointMarkerList.push(berth)
            self.boweiMarkerList.push(berth)
          } else if (self.heweiList[i].type === 2) {
            var hewei = new BMap.Marker(new BMap.Point(self.heweiList[i].longitude, self.heweiList[i].latitude), { icon: heweiImg })
            hewei.heweiId = self.heweiList[i].id
            hewei.heweiName = self.heweiList[i].name
            hewei.addEventListener('click', clickHeweiMark)
            self.bMap.addOverlay(hewei)
            self.workPointMarkerList.push(hewei)
            self.heweiMarkerList.push(hewei)
            self.showOrhide(7, false)
          }
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
      // 点击泊位显示相应的泊位信息
      function clickBerthMark (event) {
        var marker = event.target
        var berthId = marker.berthId
        var titleName = marker.berthName
        var infoWindowWidth = 800
        var infoWindowHeight = 150
        var content = ''
        var nowContent = ''
        var wiatContent = ''
        var completeContent = ''
        self.ajaxLoad()
        getTransReportListByWorkPointId({ token: self.token, workPointId: berthId }).then(res => {
          self.ajaxLoadClose()
          var transReportList = res.data
          for (var i = 0; i < transReportList.length; i++) {
            if (transReportList[i].status === 0) {
              nowContent += '<tr>' +
                '<td style="width: 25%">船名:' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%" colspan="2">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '</tr>'
            } else if (transReportList[i].status === 1) {
              wiatContent += '<tr>' +
                '<td style="width: 25%">船名：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%" colspan="2">已等待时间:' + self.getTime(transReportList[i].inTime) + '</td>' +
                '</tr>'
            } else {
              completeContent += '<tr>' +
                '<td style="width: 25%">船名：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 25%">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '<td style="width: 25%">结束作业时间:' + transReportList[i].endTime + '</td>' +
                '</tr>'
            }
            infoWindowHeight += 30
          }
          content += '<h4 style="color: white;margin: 20px;">' + titleName + '</h4>'
          content += '<table border="1" style="margin: 10px auto; width: 93%;border: 1px solid #ccc;color: white;text-align: center;">' +
            '<tr>' +
            '<td colspan="4">' +
            '当前作业船舶 ' +
            '</td>' +
            '</tr>' +
            nowContent +
            '<tr>' +
            '<td colspan="4">' +
            '等待作业船舶' +
            '</td>' +
            '</tr>' +
            wiatContent +
            '<tr>' +
            '<td colspan="4">' +
            '结束作业船舶 ' +
            '</td>' +
            '</tr>' +
            completeContent +
            '</table>'
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '15px 25px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(marker)
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      }
      // 点击鹤位显示相应的鹤位信息
      function clickHeweiMark (event) {
        var marker = event.target
        var heweiId = marker.heweiId
        var titleName = marker.heweiName
        var infoWindowWidth = 800
        var infoWindowHeight = 150
        var content = ''
        var nowContent = ''
        var wiatContent = ''
        var completeContent = ''
        self.ajaxLoad()
        getTransReportListByWorkPointId({ token: self.token, workPointId: heweiId }).then(res => {
          self.ajaxLoadClose()
          var transReportList = res.data
          for (var i = 0; i < transReportList.length; i++) {
            if (transReportList[i].status === 0) {
              nowContent += '<tr>' +
                '<td style="width: 25%;">车牌号:' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%;">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%;" colspan="2">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '</tr>'
            } else if (transReportList[i].status === 1) {
              wiatContent += '<tr>' +
                '<td style="width: 25%;">车牌号：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%;">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 50%;" colspan="2">已等待时间:' + self.getTime(transReportList[i].inTime) + '</td>' +
                '</tr>'
            } else {
              completeContent += '<tr>' +
                '<td style="width: 25%;">车牌号：' + transReportList[i].transName + '</td>' +
                '<td style="width: 25%;">危化品:' + transReportList[i].whpName + transReportList[i].whpCount + transReportList[i].unit + '</td>' +
                '<td style="width: 25%;">开始作业时间:' + transReportList[i].startTime + '</td>' +
                '<td style="width: 25%;">结束作业时间:' + transReportList[i].endTime + '</td>' +
                '</tr>'
            }
            infoWindowHeight += 30
          }
          content += '<h4 style="color: white;margin: 20px;">' + titleName + '</h4>'
          content += '<table border="1" style="margin: 20px auto; width: 93%;border: 1px solid #ccc;color: white;text-align: center;">' +
            '<tr>' +
            '<td colspan="4">' +
            '当前作业车辆 ' +
            '</td>' +
            '</tr>' +
            nowContent +
            '<tr>' +
            '<td colspan="4">' +
            '等待作业车辆' +
            '</td>' +
            '</tr>' +
            wiatContent +
            '<tr>' +
            '<td colspan="4">' +
            '结束作业车辆 ' +
            '</td>' +
            '</tr>' +
            completeContent +
            '</table>'
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '15px 25px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(marker)
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      }
    },
    // 显示码头图层
    showWharf: function () {
      var self = this
      var wharfs = [new BMap.Polyline([
        new BMap.Point(121.067782, 30.586934),
        new BMap.Point(121.070351, 30.581649),
        new BMap.Point(121.074232, 30.582846),
        new BMap.Point(121.071609, 30.588349)
      ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
        new BMap.Polyline([
          new BMap.Point(121.074232, 30.582846),
          new BMap.Point(121.077897, 30.58423),
          new BMap.Point(121.075378, 30.589697)
        ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
        new BMap.Polyline([
          new BMap.Point(121.077897, 30.58423),
          new BMap.Point(121.083323, 30.586157),
          new BMap.Point(121.081903, 30.593914)
        ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
        new BMap.Polyline([
          new BMap.Point(121.083323, 30.586157),
          new BMap.Point(121.086503, 30.587261),
          new BMap.Point(121.084401, 30.594333)
        ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 }),
        new BMap.Polyline([
          new BMap.Point(121.086503, 30.587261),
          new BMap.Point(121.08909, 30.587991),
          new BMap.Point(121.087832, 30.594831)
        ], { strokeColor: '#06305E', strokeWeight: 4, strokeOpacity: 1 })]
      for (var i = 0; i < wharfs.length; i++) {
        self.bMap.addOverlay(wharfs[i])
        self.wharfMarkerList.push(wharfs[i])
      }
    },
    // 显示危险源
    showDangerSource: function (obj) {
      var self = this
      self.bMap.removeOverlay(self.dangerSourceMarker)
      self.bMap.removeOverlay(self.dangerSourceCircle)
      var myIcon = new BMap.Icon(self.images.dangerSourceImg, new BMap.Size(48, 59))
      var point = new BMap.Point(obj.longitude, obj.latitude)
      self.dangerSourceCircle = new BMap.Circle(point, 2000, { strokeColor: '#07AEC2', strokeWeight: 1, strokeOpacity: 1, fillOpacity: 0.1 }) // 圆
      self.dangerSourceMarker = new BMap.Marker(point, { icon: myIcon }) // 创建点
      self.dangerSourceMarker.addEventListener('click', clickDangerSource)
      self.bMap.addOverlay(self.dangerSourceMarker)

      if (obj.longitude !== '' & obj.longitude !== null && obj.latitude !== '' && obj.latitude !== null) {
        self.setCenterAndZoom([obj.longitude, obj.latitude], 15)
      } else {
        self.setCenterAndZoom([121.071573, 30.588971], 15)
      }

      // 点击危险源显示危险源详情信息
      function clickDangerSource (event) {
        var marker = event.target
        var point = marker.getPosition()
        console.log(point.lat)
        self.latitude = point.lat
        self.longitude = point.lng
        var content = '<div id="analysisButton" style="color: #099EAC;margin: 8px;float: right;right: 10px;font-size: 16px;">' +
          '</div>'
        // self.clickCompanyList(point, content, 118, 49, self.images.analysisBg, self.images.analysisDel, '10px 70px 0 0')
        if (self.lastInfoBox1 !== null) {
          self.lastInfoBox1.close()
        }
        self.lastInfoBox1 = new BMapLib.InfoBox(self.bMap, content, {
          offset: new BMap.Size(15, 20),
          boxStyle: {
            background: 'url("' + self.images.analysisBg + '") no-repeat center top',
            backgroundSize: '100% 95%',
            width: 118 + 'px',
            height: 49 + 'px'
          },
          closeIconUrl: self.images.analysisDel,
          closeIconWidth: '15px',
          closeIconMargin: '10px 70px 0 0',
          enableAutoPan: true,
          align: 1
        })
        self.lastInfoBox1.open(point)
        self.lastInfoBox1.addEventListener('close', function (e) {
          self.bMap.removeOverlay(self.dangerSourceCircle)
          for (var i = 0; i < self.publicResourceMarker.length; i++) {
            self.bMap.removeOverlay(self.publicResourceMarker[i])
          }
          for (var j = 0; j < self.companyResourceMarker.length; j++) {
            self.bMap.removeOverlay(self.companyResourceMarker[j])
          }
        })
        var button = document.createElement('button')
        button.style.margin = '0'
        button.style.padding = '0'
        button.style.border = '1px solid transparent'
        button.style.outline = 'none'
        button.style.backgroundColor = 'transparent'
        button.style.color = '#099EAC'
        button.innerText = '分析'
        button.onclick = function () {
          self.bMap.addOverlay(self.dangerSourceCircle)
          self.dangerSourceCircle.enableEditing()
          self.dangerSourceCircle.addEventListener('lineupdate', function () {
            self.distance = self.dangerSourceCircle.getRadius()
          })
        }
        $('#analysisButton').append(button)
      }
    },
    showPublicResourceAtMap: function (publicResource) {
      var self = this
      for (var i = 0; i < self.publicResourceMarker.length; i++) {
        self.bMap.removeOverlay(self.publicResourceMarker[i])
      }
      var myIcon = new BMap.Icon(self.images.publicResourceImg, new BMap.Size(32, 32))
      for (var j = 0; j < publicResource.length; j++) {
        if (publicResource[j].longitude !== '' & publicResource[j].longitude !== null && publicResource[j].latitude !== '' && publicResource[j].latitude !== null) {
          var point = new BMap.Point(publicResource[j].longitude, publicResource[j].latitude)
          var mark = new BMap.Marker(point, { icon: myIcon })
          mark.publicResource = publicResource[j]
          mark.addEventListener('click', clickPublicResourceMark)
          self.publicResourceMarker.push(mark) // 创建点
          self.bMap.addOverlay(mark)
        }
      }
      function clickPublicResourceMark (event) {
        var marker = event.target
        var emergencySupplies = marker.publicResource
        var point = marker.getPosition()
        self.bMap.centerAndZoom(point, 16)
        var content = '<div style="margin: 60px 50px;color: #CFD1D3;width: 80%;height:60%;">' +
          '<table style="width: 95%;height:80%;text-align: left;margin: 20px;">' +
          '<tr><th style="text-align: center;color: #0BC7D0;font-size: 20px">' + emergencySupplies.unitName + '</th></tr>' +
          '<tr><td style="font-size: 15px;">联系人：' + emergencySupplies.firstContact + '<span style="color: #0BC7D0;"> ' + emergencySupplies.firstPhone + ' </span><span style="cursor: pointer;" id="firstPhone"></span></td></tr>' +
          '<tr><td style="font-size: 15px;">单位电话：<span style="color: #0BC7D0;"> ' + emergencySupplies.allDayPhone + ' </span><span style="cursor: pointer;" id="callPhone"></span></td></tr>' +
          '<tr><td style="font-size: 15px;">详细地址：' + emergencySupplies.address + '</td></tr>' +
          '</table>' +
          '</div>'
        self.clickCompanyList(point, content, 450, 300, self.images.window2, self.images.guanbi, '45px 65px 0 0')
        var img1 = document.createElement('img')
        img1.src = self.images.callBlue
        img1.onclick = function () {
          self.$refs.call.singleCall(emergencySupplies.allDayPhone)
        }
        var img2 = document.createElement('img')
        img2.src = self.images.callBlue
        img2.onclick = function () {
          self.$refs.call.singleCall(emergencySupplies.firstPhone)
        }
        $('#callPhone').append(img1)
        $('#firstPhone').append(img2)
      }
    },
    showCompanyResourceAtMap: function (enterpriseResources) {
      var self = this
      for (var j = 0; j < self.companyResourceMarker.length; j++) {
        self.bMap.removeOverlay(self.companyResourceMarker[j])
      }
      var myIcon = new BMap.Icon(self.images.companyResourceImg, new BMap.Size(32, 32))
      for (var i = 0; i < enterpriseResources.length; i++) {
        if (enterpriseResources[i].longitude !== '' & enterpriseResources[i].longitude !== null && enterpriseResources[i].latitude !== '' && enterpriseResources[i].latitude !== null) {
          var point = new BMap.Point(enterpriseResources[i].longitude, enterpriseResources[i].latitude)
          var mark = new BMap.Marker(point, { icon: myIcon })
          mark.enterpriseResource = enterpriseResources[i]
          mark.addEventListener('click', clickEnterpriseResourcesMark)
          self.companyResourceMarker.push(mark) // 创建点
          self.bMap.addOverlay(mark)
        }
      }
      function clickEnterpriseResourcesMark (event) {
        var marker = event.target
        var point = marker.getPosition()
        var enterpriseResource = marker.enterpriseResource
        self.bMap.centerAndZoom(point, 16)
        var content = '<div style="margin: 60px 50px;color: #CFD1D3;width: 80%;height:60%;">' +
          '<table style="width: 95%;height:80%;text-align: left;margin: 20px;">' +
          '<tr><th style="text-align: center;color: #0BC7D0;font-size: 20px">' + enterpriseResource.resourceName + '</th></tr>' +
          '<tr><td style="font-size: 15px;">物资数量：' + enterpriseResource.resourceCount + enterpriseResource.resourceUnit + '</td></tr>' +
          '<tr><td style="font-size: 15px;">联系人：' + enterpriseResource.contact + '<span style="color: #0BC7D0;"> ' + enterpriseResource.mobile + ' </span><span style="cursor: pointer;" id="mobile"></span></td></tr>' +
          '<tr><td style="font-size: 15px;">企业名称：' + enterpriseResource.department + '</td></tr>' +
          '<tr><td style="font-size: 15px;">存放位置：' + enterpriseResource.location + '</td></tr>' +
          '<tr><td style="font-size: 15px;">用途：' + enterpriseResource.resourceUse + '</td></tr>' +
          '</table>' +
          '</div>'
        self.clickCompanyList(point, content, 500, 300, self.images.window2, self.images.guanbi, '45px 65px 0 0')
        var img1 = document.createElement('img')
        img1.src = self.images.callBlue
        img1.onclick = function () {
          self.$refs.call.singleCall(enterpriseResource.mobile)
        }
        $('#mobile').append(img1)
      }
    },
    closeDangerousSource: function () {
      var self = this
      self.bMap.removeOverlay(self.dangerSourceMarker)
      self.bMap.removeOverlay(self.dangerSourceCircle)
      for (var i = 0; i < self.publicResourceMarker.length; i++) {
        self.bMap.removeOverlay(self.publicResourceMarker[i])
      }
      for (var j = 0; j < self.companyResourceMarker.length; j++) {
        self.bMap.removeOverlay(self.companyResourceMarker[j])
      }
    },
    /* 视频事件 */
    // 显示视频图层
    showCameraList: function () {
      var self = this
      self.ajaxLoad()
      getCameraList({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        if (res.resultCode.code === 1) {
          var cameraList = res.data.childCamList
          var shiping = new BMap.Icon(self.images.icVedio, new BMap.Size(18, 18))
          // var points = [new BMap.Point(121.076684, 30.583771), new BMap.Point(121.078427, 30.584463),
          //   new BMap.Point(121.064485, 30.586375), new BMap.Point(121.064585, 30.586575), new BMap.Point(121.064385, 30.586275)]
          for (var i = 0; i < cameraList.length; i++) {
            if (cameraList[i].lng === '' || cameraList[i].lng === null || cameraList[i].lng === undefined) {
              continue
            }
            var point = new BMap.Point(cameraList[i].lng, cameraList[i].lat)
            var marker = new BMap.Marker(point, { icon: shiping })
            marker.customId = cameraList[i].cameraUuid
            marker.customName = cameraList[i].cameraName
            marker.addEventListener('click', cameraClick)
            self.bMap.addOverlay(marker)
            self.videoMarkerList.push(marker)
          }
        } else {
          self.warning('获取摄像头失败')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
      // 点击视频图层播放相应的视频
      function cameraClick (event) {
        let marker = event.target
        self.videoName = marker.customName
        self.videoId = marker.customId
        self.playerOptions.sources[0].src = 'http://111.3.68.229:6713/mag/hls/' + marker.customId + '/0/live.m3u8'
        self.openVideo()
      }
    },
    openVideo: function () {
      var self = this
      self.videoFlag = true
    },
    showVideo: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      self.ocxObj.MPV_StartPreviewBySelectedWnd(self.xml)
    },
    closeVideo: function () {
      var self = this
      self.videoFlag = false
    },
    initVideo: function () {
      var self = this
      if (self.ocxObj === null) {
        // 初始化设置
        self.InitSpvx()
        // 链接平台
        // 初始化的屏幕数
        self.SetWnd()
        $('.load').hide()
        // 设置预览时间
        self.SetLocalParam()
      }
    },
    InitSpvx: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      var languageType = 1
      var ret = self.ocxObj.MPV_Init(languageType)
      if (ret !== 0) {
        alert('初始化失败')
      }
    },
    SetWnd: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      var opt = 1
      var ret = self.ocxObj.MPV_SetPlayWndCount(parseInt(opt, 10))
      if (ret !== 0) {
        alert('设置分屏失败！')
      }
    },
    SetLocalParam: function () {
      var self = this
      if (self.ocxObj === null) {
        self.ocxObj = document.getElementById('spv')
      }
      var devPxRa = screen.deviceXDPI / screen.logicalXDPI
      var height = $('#spv').height() * devPxRa
      var width = $('#spv').width() * devPxRa
      var xml = '<?xml version="1.0" encoding="UTF-8"?> ' +
        '<localParam> ' +
        '<width>' + width + '</width> ' +
        '<height>' + height + '</height> ' +
        '<picType>0</picType> ' +
        '<capturePath>C:\\Hikvision</capturePath> ' +
        '<recordSize>2</recordSize> ' +
        '<recordPath>C:\\Hikvision</recordPath> ' +
        '<limitPreviewTime>1800</limitPreviewTime> ' +
        '<showMsgTip>1</showMsgTip> ' +
        '</localParam>'
      var ret = self.ocxObj.MPV_SetLocalParam(xml)
      if (ret !== 0) {
        alert('设置本地参数失败')
      }
    },
    // 显示车辆和船舶图层
    showCarAndShip: function () {
      var self = this
      self.ajaxLoad()
      // 获取车辆和船舶信息
      getPointList({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.carList = res.data.licenseList
        self.shipList = res.data.shipList
        for (var i = 0; i < self.carList.length; i++) {
          var car = self.carList[i]
          var point = new BMap.Point(car.longitude, car.latitude)
          var myIcon = new BMap.Icon(self.images.carImg, new BMap.Size(18, 18))
          var marker = new BMap.Marker(point, { icon: myIcon })
          marker.customName = car.name
          marker.customType = 1
          marker.addEventListener('click', clickMark)
          self.carMarkerList.push(marker)
          self.bMap.addOverlay(marker)
        }

        for (var x = 0; x < self.shipList.length; x++) {
          var ship = self.shipList[x]
          var shipPoint = new BMap.Point(ship.longitude, ship.latitude)
          var shipIcon = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
          var marker1 = new BMap.Marker(shipPoint, { icon: shipIcon })
          marker1.customName = ship.name
          marker1.customType = 2
          marker1.addEventListener('click', clickMark)
          self.shipMarkerList.push(marker1)
          self.bMap.addOverlay(marker1)
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
      // 点击显示车辆或船舶详情
      function clickMark (event) {
        var marker = event.target
        var type = marker.customType
        var content1 = marker.customName
        self.ajaxLoad()
        getPointListByNameOrId({ type: type, name: content1, token: self.token }).then(res => {
          self.ajaxLoadClose()
          var infoWindowWidth = 360
          var infoWindowHeight = 400
          var content = ''
          var orderList = res.data
          if (type === 1) {
            content += '<div style="color: white;margin-top: 20px;">\n' +
              '        <div style="margin:20px auto;width: 90%;border-radius: 5px 5px 0 0;padding:10px;background-color: #0e90d2;color: white;">\n' +
              '            单号:' + orderList[0].orderNum + '<br/>\n' +
              '            起点:' + orderList[0].departure + ' ---- 终点:' + orderList[0].destination + '\n' +
              '        </div>\n' +
              '        <div style="margin: 20px;">\n' +
              '出发时间: ' + self.handleData(orderList[0].createTime) + '<br>' +
              '车牌号: ' + self.handleData(orderList[0].licensePlate) + '<br>' +
              '承运人:' + self.handleData(orderList[0].manager) + '<br>' +
              '联系方式: ' + self.handleData(orderList[0].contact) + '<br>' +
              '危化品名: ' + self.handleData(orderList[0].cargoName) + '<br>' +
              '危化品数量: ' + self.handleData(orderList[0].cargoCount) + orderList[0].cargoUnit + '<br>' +
              '进站装卸作业时间: ' + self.handleData(orderList[0].orderTime) + '<br>' +
              '作业完成时间: ' + self.handleData(orderList[0].completeTime) + '<br>' +
              '流入危化品企业名称: ' + self.handleData(orderList[0].companyName) + '<br>' +
              '流入储罐编号: ' + self.handleData(orderList[0].tankNum) + '<br>' +
              '<div id="pathButtonDiv"></div>' +
              /* '<button class="pathButton" data="1" style="border: none;border-radius: 5px;width: 80px;height: 30px;background-color: #0E90D2">轨迹回放</button>' + */
              '        </div>\n' +
              '    </div>'
          } else if (type === 2) {
            content = '<div style="color: white;margin: 20px;">\n' +
              '        <div style="margin:20px auto;width: 98%;border-radius: 5px 5px 0 0;padding:10px;background-color: #0e90d2;color: white;">\n' +
              '            单号:' + orderList[0].orderNum + '<br/>\n' +
              '            起点:' + orderList[0].departure + ' ----  终点:' + orderList[0].destination +
              '        </div>\n' +
              '        <div style="margin: 20px;">\n' +
              '出发时间: ' + self.handleData(orderList[0].createTime) + '<br>' +
              '船名: ' + self.handleData(orderList[0].shipName) + '<br>' +
              '航次: ' + self.handleData(orderList[0].aisIdentificationNum) + '<br>' +
              '承运人:' + self.handleData(orderList[0].manager) + '<br>' +
              '联系方式: ' + self.handleData(orderList[0].contact) + '<br>' +
              '危化品名: ' + self.handleData(orderList[0].cargoName) + '<br>' +
              '危化品数量: ' + self.handleData(orderList[0].cargoCount) + orderList[0].cargoUnit + '<br>' +
              '进站装卸作业时间: ' + self.handleData(orderList[0].orderTime) + '<br>' +
              '作业完成时间: ' + self.handleData(orderList[0].completeTime) + '<br>' +
              '流入危化品企业名称: ' + self.handleData(orderList[0].companyName) + '<br>' +
              '流入储罐编号: ' + self.handleData(orderList[0].tankNum) + '<br>' +
              '<div id="pathButtonDiv"></div>' +
              '        </div>\n' +
              '    </div>'
          }
          // 开始绘制轨迹
          self.historyPointList = []
          if (orderList.length > 1) {
            for (var i = orderList.length - 1; i >= 0; i--) {
              self.historyPointList.push(new BMap.Point(orderList[i].longitude, orderList[i].latitude))
            }
          }
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '25px 25px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(marker)
          var button = document.createElement('button')
          button.style.border = 'none'
          button.style.borderRadius = '5px'
          button.style.width = '80px'
          button.style.height = '30px'
          button.style.backgroundColor = '#0E90D2'
          button.innerText = '轨迹回放'
          button.onclick = function () {
            if (self.historyPointList.length > 1) {
              self.closeHistoryFlag = 1
            }
            if (self.historyPointMarker.length > 1) {
              return
            }
            if (type === 1) {
              self.bMap.removeOverlay(self.historyMarker)
              self.bMap.removeOverlay(self.polyline)
              for (var i = 0; i < self.historyPointMarker.length; i++) {
                self.bMap.removeOverlay(self.historyPointMarker[i])
              }

              self.historyPointMarker = []
              self.polyline = new BMap.Polyline(self.historyPointList, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
              self.bMap.addOverlay(self.polyline)
              for (var c = 1; c < self.historyPointList.length - 1; c++) {
                var myIcon = new BMap.Icon(self.images.carImg, new BMap.Size(18, 18))
                var marker1 = new BMap.Marker(self.historyPointList[c], { icon: myIcon })
                self.bMap.addOverlay(marker1)
                self.historyPointMarker.push(marker1)
              }
              var qidian = new BMap.Icon(self.images.carImg, new BMap.Size(40, 40))
              var marker2 = new BMap.Marker(self.historyPointList[0], { icon: qidian })
              self.bMap.addOverlay(marker2)
              self.historyPointMarker.push(marker2)
            } else if (type === 2) {
              self.bMap.removeOverlay(self.historyMarker)
              self.bMap.removeOverlay(self.polyline)
              for (var b = 0; b < self.historyPointMarker.length; b++) {
                self.bMap.removeOverlay(self.historyPointMarker[b])
              }
              self.polyline = new BMap.Polyline(self.historyPointList, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
              self.bMap.addOverlay(self.polyline)
              self.historyPointMarker = []
              for (var a = 1; a < self.historyPointList.length - 1; a++) {
                var myIcon1 = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
                var markerMyIcon1 = new BMap.Marker(self.historyPointList[a], { icon: myIcon1 })
                self.bMap.addOverlay(markerMyIcon1)
                self.historyPointMarker.push(markerMyIcon1)
              }
              var qidian1 = new BMap.Icon(self.images.shipImg, new BMap.Size(40, 40))
              var markerQidian = new BMap.Marker(self.historyPointList[0], { icon: qidian1 })
              self.bMap.addOverlay(markerQidian)
              self.historyPointMarker.push(markerQidian)
            }
          }
          $('#pathButtonDiv').append(button)
          var button2 = document.createElement('button')
          button2.style.border = 'none'
          button2.style.borderRadius = '5px'
          button2.style.width = '80px'
          button2.style.height = '30px'
          button2.style.marginLeft = '10px'
          button2.style.backgroundColor = '#0E90D2'
          button2.innerText = '消除轨迹'
          button2.onclick = function () {
            self.$Modal.confirm({
              title: '消除轨迹',
              width: 300,
              closable: false,
              okText: '确定',
              cancelText: '取消',
              loading: false,
              onOk () {
                self.bMap.removeOverlay(self.historyMarker)
                self.bMap.removeOverlay(self.polyline)
                self.historyMarker = []
                self.polyline = []
                if (self.historyPointMarker.length > 0) {
                  for (var i = 0; i < self.historyPointMarker.length; i++) {
                    self.bMap.removeOverlay(self.historyPointMarker[i])
                  }
                }
                self.closeHistoryFlag = 0
                self.historyPointMarker = []
              }
            })
          }
          $('#pathButtonDiv').append(button2)
        }).catch(err => {
          self.ajaxLoadClose()
          console.log(err)
        })
      }
    },
    // 显示管道图层
    showPipeline: function () {
      var self = this
      self.ajaxLoad()
      getPipelineAndReportList({ token: self.token }).then(res => {
        self.ajaxLoadClose()
        self.pipelineList = res.data
        var pipeline = new BMap.Polyline([
          new BMap.Point(121.070383, 30.581712),
          new BMap.Point(121.067787, 30.587043),
          new BMap.Point(121.067072, 30.588551),
          new BMap.Point(121.068469, 30.589084),
          new BMap.Point(121.068267, 30.589453),
          new BMap.Point(121.067423, 30.58913)
        ], { strokeColor: '#00FFF8', strokeWeight: 4, strokeOpacity: 1 })
        pipeline.pipelineId = self.pipelineList[5].id
        pipeline.pipelinePoint = new BMap.Point(121.067787, 30.587043)
        pipeline.addEventListener('click', clickPipelineMark)
        self.bMap.addOverlay(pipeline)
        self.pipelineMarkerList.push(pipeline)
        // 点击管道显示管道详情
        function clickPipelineMark (event) {
          var marker = event.target
          var pipelineId = marker.pipelineId
          var point = marker.pipelinePoint
          var infoWindowWidth = 300
          var infoWindowHeight = 80
          var content = '<div style="margin: 10px;color: white;">'
          for (var i = 0; i < self.pipelineList.length; i++) {
            if (self.pipelineList[i].id === pipelineId) {
              content += '管道名:' + self.pipelineList[i].name + '<br>' +
                '企业名：' + self.pipelineList[i].companyName + '<br>'

              if (self.pipelineList[i].status === 0) {
                content += '运输状态:空闲<br>'
              } else {
                infoWindowHeight += 50
                content += '运输状态:运输中<br>' +
                  '危化品:' + self.pipelineList[i].whpName + self.pipelineList[i].whpCount + self.pipelineList[i].unit + '<br>' +
                  '开始作业时间:' + self.pipelineList[i].startTime + '<br>'
              }
            }
          }
          content += '</div>'
          if (self.lastInfoBox != null) {
            self.lastInfoBox.close()
          }
          self.lastInfoBox = new BMapLib.InfoBox(self.bMap, content, {
            offset: new BMap.Size(15, 20),
            boxStyle: {
              background: 'url("' + self.images.window1 + '") no-repeat center top',
              backgroundSize: '100% 95%',
              width: infoWindowWidth + 'px',
              height: infoWindowHeight + 'px'
            },
            closeIconUrl: self.images.guanbi,
            closeIconWidth: '15px',
            closeIconMargin: '5px 5px 0 0',
            enableAutoPan: true,
            align: 1
          })
          self.lastInfoBox.open(point)
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 根据菜单判断是否选中
    coverageTreeOnCheck: function (event, treeId, treeNode) {
      var self = this
      var arr = []
      if (treeNode.pid === null) {
        // 一级菜单
        for (var i = 0; i < self.coverageTreeData.length; i++) {
          if (self.coverageTreeData[i].pid === treeNode.id) {
            arr.push(self.coverageTreeData[i].msg)
          }
        }
      } else {
        // 二级菜单
        arr.push(treeNode.msg)
      }
      for (var k = 0; k < arr.length; k++) {
        self.showOrhide(arr[k], treeNode.isChecked)
      }
    },
    // 显示或隐藏图层
    showOrhide: function (type, flag) {
      if (type !== 0) {
        var self = this
        var list = []
        var layerName = ''
        switch (type) {
          case 1:
            if (flag) {
              self.getCompanyGeo()
            } else {
              self.inMap.remove(self.companyGeo.dataMarker)
            }
            list = self.companyMarkerList
            break
          case 2:
            list = self.carMarkerList
            break
          case 3:
            list = self.shipMarkerList
            break
          case 4:
            list = self.getDataMarkerList('监控电子眼')
            if (flag) {
              $.each(list, function (k, v) {
                self.getSingleGeoJson('监控电子眼')
              })
            } else {
              $.each(list, function (k, v) {
                self.inMap.remove(v)
              })
            }
            list = self.videoMarkerList
            break
          case 5:
            list = self.pipelineMarkerList
            break
          case 6:
            list = self.getDataMarkerList('危险化学品存储罐')
            if (flag) {
              $.each(list, function (k, v) {
                self.getSingleGeoJson('危险化学品存储罐')
              })
            } else {
              $.each(list, function (k, v) {
                self.inMap.remove(v)
              })
            }
            list = self.chuguanMarkerList
            self.storageTankFlag = flag
            break
          case 7:
            list = self.getDataMarkerList('装卸区')
            if (flag) {
              $.each(list, function (k, v) {
                self.getSingleGeoJson('装卸区')
              })
            } else {
              $.each(list, function (k, v) {
                self.inMap.remove(v)
              })
            }
            list = self.heweiMarkerList
            break
          case 8:
            list = self.boweiMarkerList
            break
          case 9:
            layerName = '消防栓'
            list = self.getDataMarkerList('消防栓')
            break
          case 10:
            layerName = '消防井盖'
            list = self.getDataMarkerList('消防井盖')
            break
          case 11:
            layerName = '消防龙头'
            list = self.getDataMarkerList('消防龙头')
            break
          case 12:
            layerName = '泡沫站'
            list = self.getDataMarkerList('泡沫站')
            break
          case 13:
            layerName = '通讯基站'
            list = self.getDataMarkerList('通讯基站')
            break
          case 14:
            layerName = '通讯铁塔'
            list = self.getDataMarkerList('通讯铁塔')
            break
          case 15:
            layerName = '人防指示牌'
            list = self.getDataMarkerList('人防指示牌')
            break
          case 16:
            layerName = '人防通风口'
            list = self.getDataMarkerList('人防通风口')
            break
          case 17:
            layerName = '交通广场'
            list = self.getDataMarkerList('交通广场')
            break
          case 18:
            layerName = '休闲广场'
            list = self.getDataMarkerList('休闲广场')
            break
          case 19:
            layerName = '学校'
            list = self.getDataMarkerList('学校')
            break
          case 20:
            layerName = '设施出入口'
            list = self.getDataMarkerList('设施出入口')
            break
          case 21:
            layerName = '道闸'
            list = self.getDataMarkerList('道闸')
            break
          case 22:
            layerName = '主干道'
            list = self.getDataMarkerList('主干道')
            break
          case 23:
            layerName = '次干道'
            list = self.getDataMarkerList('次干道')
            break
          case 24:
            layerName = '药店'
            list = self.getDataMarkerList('药店')
            break
          case 25:
            layerName = '诊所'
            list = self.getDataMarkerList('诊所')
            break
          case 26:
            layerName = '医院'
            list = self.getDataMarkerList('医院')
            break
          case 27:
            layerName = '企业内传感器'
            list = self.getDataMarkerList('企业内传感器')
            break
          case 28:
            layerName = '加油站'
            list = self.getDataMarkerList('加油站')
            break
          case 29:
            layerName = '压缩天然气加气站'
            list = self.getDataMarkerList('压缩天然气加气站')
            break
          case 30:
            layerName = '压缩天然气储配站'
            list = self.getDataMarkerList('压缩天然气储配站')
            break
          case 31:
            layerName = '液化石油气储配站'
            list = self.getDataMarkerList('液化石油气储配站')
            break
          case 32:
            layerName = '人工煤气储配站'
            list = self.getDataMarkerList('人工煤气储配站')
            break
          case 33:
            layerName = '废物处理区'
            list = self.getDataMarkerList('废物处理区')
            break
          case 34:
            layerName = '事故缓冲区'
            list = self.getDataMarkerList('事故缓冲区')
            break
          case 35:
            layerName = '生产辅助区'
            list = self.getDataMarkerList('生产辅助区')
            break
          case 36:
            layerName = '罐区'
            list = self.getDataMarkerList('罐区')
            break
          case 37:
            layerName = '钢瓶区'
            list = self.getDataMarkerList('钢瓶区')
            break
          case 38:
            layerName = '应急设施'
            list = self.getDataMarkerList('应急设施')
            break
          case 39:
            layerName = '仓库'
            list = self.getDataMarkerList('仓库')
            break
          default:
            break
        }
        if (type >= 1 && type <= 8) {
          // 只有港口点位
          if (flag) {
            $.each(list, function (k, v) {
              v.show()
            })
          } else {
            $.each(list, function (k, v) {
              v.hide()
            })
          }
        } else if (type >= 9 && type <= 40) {
          // 只有园区点位
          if (flag) {
            $.each(list, function (k, v) {
              self.getSingleGeoJson(layerName)
            })
          } else {
            $.each(list, function (k, v) {
              self.inMap.remove(v)
            })
          }
        }
      }
    },
    // 根据图层名称获取图层列表信息
    getDataMarkerList: function (layerName) {
      var self = this
      var list = []
      for (var i = 0; i < self.pointTreeList.length; i++) {
        if (self.pointTreeList[i].layerName === layerName) {
          list = self.pointTreeList[i].dataMarkerList
        }
      }
      return list
    },
    // 删除储罐图层
    removeChuGuan: function () {
      var self = this
      $.each(self.chuguanMarkerList, function (k, v) {
        self.bMap.removeOverlay(v)
      })
      self.chuguanMarkerList = []
    },
    /*  获取点位 */
    getGeoJson: function () {
      var self = this
      for (let i = 0; i < self.pointTreeList.length; i++) {
        self.ajaxLoad()
        getGeoJson({ layerName: self.pointTreeList[i].layerName, type: 'bd0911', mapType: 'inmap' }).then(res => {
          self.ajaxLoadClose()
          if (res.code === 0 && res.data !== null && res.data.totalFeatures > 0) {
            self.pointTreeList[i].dataList = res.data.features
          }
        }).catch(err => {
          self.ajaxLoadClose()
        })
      }
    },
    // 根据图层名称显示图层
    getSingleGeoJson: function (layerName) {
      var self = this
      var index = -1
      for (var i = 0; i < self.pointTreeList.length; i++) {
        if (self.pointTreeList[i].layerName === layerName) {
          index = i
          break
        }
      }
      if (index === -1) {
        return
      }
      self.pointTreeList[index].dataMarkerList = []
      if (self.pointTreeList[index].dataList.length <= 0) {
        self.ajaxLoad()
        getGeoJson({ layerName: layerName, type: 'bd0911', mapType: 'inmap' }).then(res => {
          self.ajaxLoadClose()
          if (res.code === 0 && res.data !== null && res.data.totalFeatures > 0) {
            var dataList = res.data.features
            self.pointTreeList[index].dataList = dataList
            var type = dataList[0].geometry.type
            if (type === 'Point') {
              var overlay = new inMap.ImgOverlay({
                tooltip: {
                  show: false
                },
                style: {
                  normal: {
                    icon: self.pointTreeList[index].icon,
                    width: 20,
                    height: 20,
                    offsets: {
                      top: '-100%',
                      left: '-50%'
                    }
                  }
                },
                data: dataList,
                event: {
                  onMouseClick: function (item, event) {
                  }
                }
              })
              self.inMap.add(overlay)
              self.pointTreeList[index].dataMarkerList.push(overlay)
            }
            if (type === 'MultiPolygon') {
              var overlay2 = new inMap.PolygonOverlay({
                style: {
                  normal: {
                    backgroundColor: self.pointTreeList[index].backgroundColor,
                    borderWidth: 1,
                    borderColor: '#CE0203',
                    borderOpacity: 0.9,
                    label: {
                      show: true,
                      font: '微软雅黑',
                      color: 'white'
                    }
                  }
                },
                data: dataList,
                event: {
                  onMouseClick: function (item, event) {

                  }
                }
              })
              self.inMap.add(overlay2)
              self.pointTreeList[index].dataMarkerList.push(overlay2)
            }
          }
        }).catch(err => {
          self.ajaxLoadClose()
        })
      } else {
        if (self.pointTreeList[index].type === 'Point') {
          var overlay = new inMap.ImgOverlay({
            tooltip: {
              show: false
            },
            style: {
              normal: {
                icon: self.pointTreeList[index].icon,
                width: 20,
                height: 20,
                offsets: {
                  top: '-100%',
                  left: '-50%'
                }
              }
            },
            data: self.pointTreeList[index].dataList,
            event: {
              onMouseClick: function (item, event) {
              }
            }
          })
          self.inMap.add(overlay)
          self.pointTreeList[index].dataMarkerList.push(overlay)
        } else if (self.pointTreeList[index].type === 'MultiPolygon') {
          var overlay1 = new inMap.PolygonOverlay({
            style: {
              normal: {
                backgroundColor: self.pointTreeList[index].backgroundColor,
                borderWidth: 1,
                borderColor: '#CE0203',
                borderOpacity: 0.9,
                label: {
                  show: true,
                  font: '微软雅黑',
                  color: 'white'
                }
              }
            },
            data: self.pointTreeList[index].dataList,
            event: {
              onMouseClick: function (item, event) {

              }
            }
          })
          self.inMap.add(overlay1)
          self.pointTreeList[index].dataMarkerList.push(overlay1)
        }
      }
    },
    // 设置企业园区样式
    getCompanyGeo: function () {
      var self = this
      if (self.companyGeo.dataList.length <= 0) {
        self.ajaxLoad()
        getCompanyGeoJson({ mapType: 'inmap' }).then(res => {
          self.ajaxLoadClose()
          if (res.code === 0 && res.data !== null) {
            self.companyGeo.dataList = res.data.features
            var overlay = new inMap.PolygonOverlay({
              style: {
                normal: {
                  backgroundColor: 'rgba(252,196,95,0.71)',
                  borderWidth: 1,
                  borderColor: '#CE0203',
                  borderOpacity: 0.9,
                  label: {
                    show: true,
                    font: '微软雅黑',
                    color: 'white'
                  }
                }
              },
              data: self.companyGeo.dataList,
              event: {
                onMouseClick: function (item, event) {

                }
              }
            })
            self.inMap.add(overlay)
            self.companyGeo.dataMarker = overlay
          }
        }).catch(err => {
          self.ajaxLoadClose()

        })
      } else {
        var overlay = new inMap.PolygonOverlay({
          style: {
            normal: {
              backgroundColor: 'rgba(252,196,95,0.71)',
              borderWidth: 1,
              borderColor: '#CE0203',
              borderOpacity: 0.9,
              label: {
                show: true,
                font: '微软雅黑',
                color: 'white'
              }
            }
          },
          data: self.companyGeo.dataList,
          event: {
            onMouseClick: function (item, event) {

            }
          }
        })
        self.inMap.add(overlay)
        self.companyGeo.dataMarker = overlay
      }
    },
    /**
     * @description 改变跟踪监控类型
     * @param mapLevel
     */
    changeMonitorType (monitorType) {
      if (monitorType === '应急指挥') {
        this.queueName = '通话队列'
      } else {
        this.queueName = '呼叫队列'
      }
      if (this.monitorType === monitorType) return
      this.monitorType = monitorType
      this.currentTabComponent = null
      this.alarmMenu = ''
      this.emergencyMenu = ''
    },
    changeAlarmMenu (alarmMenu) {
      if (this.alarmMenu === alarmMenu) {
        this.currentTabComponent = null
        this.alarmMenu = ''
        return
      }
      this.alarmMenu = alarmMenu
      switch (alarmMenu) {
        case config.alarmMenu.alarmRegister:
          this.currentTabComponent = register
          this.contactNumber = ''
          this.alarmTime = ''
          this.ejson = {}
          this.isQueue = 0
          this.addressLon = ''
          this.addressLat = ''
          this.savedPlace = ''
          break
        case config.alarmMenu.alarmInfo:
          this.currentTabComponent = info
          break
      }
    },
    changeCurrentOrAllEvent (currentOrAllEvent) {
      this.currentOrAllEvent = currentOrAllEvent
    },
    changeAlarmId (alarmId, uniqueId) {
      this.alarmId = alarmId
      this.uniqueId = uniqueId
    },
    changeEmergencyMenu (emergencyMenu) {
      if (this.emergencyMenu === emergencyMenu) {
        this.currentTabComponent = null
        this.emergencyMenu = ''
        return
      }
      this.emergencyMenu = emergencyMenu
      switch (emergencyMenu) {
        case config.emergencyMenu.emergCommun:
          if (this.currentOrAllEvent === 1) {
            this.currentTabComponent = communication
          } else {
            this.emergencyMenu = ''
            this.warning('请选择当前事件')
          }
          break
        case config.emergencyMenu.search:
          this.currentTabComponent = search
          break
        case config.emergencyMenu.eventAnalysis:
          if (this.currentOrAllEvent === 1) {
            this.currentTabComponent = analysis
          } else {
            this.emergencyMenu = ''
            this.warning('请选择当前事件')
          }
          break
        case config.emergencyMenu.messageSubmit:
          if (this.currentOrAllEvent === 1) {
            this.currentTabComponent = infosubmit
          } else {
            this.emergencyMenu = ''
            this.warning('请选择当前事件')
          }
          break
        case config.emergencyMenu.messageRelease:
          if (this.currentOrAllEvent === 1) {
            this.currentTabComponent = inforelease
          } else {
            this.emergencyMenu = ''
            this.warning('请选择当前事件')
          }
          break
        case config.emergencyMenu.decisionMak:
          this.currentTabComponent = aiddecision
          break
      }
    },
    //  websocket--------------------------------------
    initWebSocket () {
      let $this = this
      // const wsuri = 'ws://192.168.108.130:9090/voice/userName'
      // const wsuri = 'ws://192.168.109.33:8088/voice/userName'
      console.log(this.wsuri)
      $this.websock = new WebSocket(this.wsuri)
      $this.websock.onopen = $this.websocketonopen
      $this.websock.onerror = $this.websocketonerror
      $this.websock.onmessage = $this.websocketonmessage
      $this.websock.onclose = $this.websocketclose
    },
    websocketonopen () {
      console.log('WebSocket连接成功')
    },
    websocketonerror (e) {
      console.log('WebSocket连接发生错误')
    },
    // 接收消息
    websocketonmessage (e) {
      let $this = this
      const redata = JSON.parse(e.data)
      $this.displayCallState(redata)
    },
    // 关闭
    websocketclose (e) {
      console.log('connection closed (' + e.code + ')')
    },
    displayCallState (data) {
      var _this = this
      if (data.callState === 'Link') {
        _this.uniqueId = data.uniqueId
      }
      _this.$refs.call.receivedCallMsg(data)
      _this.$refs.queue.receivedCallMsg(data)
    },
    // --------------------------------------
    getAlarmData: function (callingNum, alarmTime) {
      var _this = this
      _this.monitorType = '接警管理'
      _this.alarmMenu = '接警登记'
      _this.queueName = '呼叫队列'
      _this.currentTabComponent = register
      _this.contactNumber = callingNum
      _this.alarmTime = alarmTime
      _this.isQueue = 0
    },
    clearMenu () {
      this.currentTabComponent = null
      this.alarmMenu = ''
      this.emergencyMenu = ''
    },
    changeEvent () {
      this.$refs.queue.alarmList()
    },
    mapCarShipPoint: function (lngs, lats, name, type) {
      var self = this
      if (self.carShipMarker) {
        self.bMap.removeOverlay(self.carShipMarker)
      }
      var point = new BMap.Point(lngs, lats)
      self.bMap.centerAndZoom(point, 18)
      var myIcon = ''
      if (type === 'ship') {
        myIcon = new BMap.Icon(shipImg, new BMap.Size(48, 59))
      } else if (type === 'car') {
        myIcon = new BMap.Icon(carImg, new BMap.Size(48, 59))
      }

      self.carShipMarker = new BMap.Marker(point, { icon: myIcon })
      var label = new BMap.Label(name, { offset: new BMap.Size(-15, 40) })
      label.setStyle({
        color: '#fff',
        backgroundColor: 'transparent',
        border: '0'
      })
      self.carShipMarker.setLabel(label)

      self.bMap.addOverlay(self.carShipMarker)
    },
    // 打开弹窗
    showEditAddress: function (name) {
      this.editShow = 1
      this.$refs.editAddress.showAlarmAddress(name)
    },
    // 关闭弹窗
    closeEditAddress: function () {
      this.editShow = 0
    },
    //  保存弹窗获取的地点
    editPlace: function (place, lon, lat) {
      this.savedPlace = place
      this.addressLon = lon
      this.addressLat = lat
      // this.$refs.register.saveEditAddress(place)
    },
    // 显示详细地点
    showAlarmAddress: function (address) {
      var self = this
      var myIcon = ''
      var myGeo = new BMap.Geocoder()
      myGeo.getPoint(address, function (point) {
        myIcon = new BMap.Icon(location, new BMap.Size(30, 30))
        if (self.markerDetail) {
          self.bMap.removeOverlay(self.markerDetail)
        }
        self.markerDetail = new BMap.Marker(point, { icon: myIcon })
        if (point) {
          self.addressLon = point.lng
          self.addressLat = point.lat
          var label = new BMap.Label(name, { offset: new BMap.Size(-13, 17) })
          self.markerDetail.setLabel(label)
          self.bMap.centerAndZoom(point, 18)
          self.bMap.addOverlay(self.markerDetail)
        } else {
          self.warning('该地址没有解析到结果')
        }
      }, '中国')
    },
    // 显示公共资源位置详情
    showEmergencySupplies: function (point, emergencySupplies) {
      var self = this
      self.bMap.centerAndZoom(point, 16)
      var content = '<div style="margin: 60px 50px;color: #CFD1D3;width: 80%;height:60%;">' +
        '<table style="width: 95%;height:80%;text-align: left;margin: 20px;">' +
        '<tr><th style="text-align: center;color: #0BC7D0;font-size: 20px">' + emergencySupplies.unitName + '</th></tr>' +
        '<tr><td style="font-size: 15px;">联系人：' + emergencySupplies.firstContact + '<span style="color: #0BC7D0;"> ' + emergencySupplies.firstPhone + ' </span><span style="cursor: pointer;" id="firstPhone"></span></td></tr>' +
        '<tr><td style="font-size: 15px;">单位电话：<span style="color: #0BC7D0;"> ' + emergencySupplies.allDayPhone + ' </span><span style="cursor: pointer;" id="callPhone"></span></td></tr>' +
        '<tr><td style="font-size: 15px;">详细地址：' + emergencySupplies.address + '</td></tr>' +
        '</table>' +
        '</div>'
      self.clickCompanyList(point, content, 450, 300, self.images.window2, self.images.guanbi, '45px 65px 0 0')
      var img1 = document.createElement('img')
      img1.src = self.images.callBlue
      img1.onclick = function () {
        self.$refs.call.singleCall(emergencySupplies.allDayPhone)
      }
      var img2 = document.createElement('img')
      img2.src = self.images.callBlue
      img2.onclick = function () {
        self.$refs.call.singleCall(emergencySupplies.firstPhone)
      }
      $('#callPhone').append(img1)
      $('#firstPhone').append(img2)
    },
    showEmergencyResources: function (point, enterpriseResource, orgName, orgAddress) {
      var self = this
      console.log(point)
      self.bMap.centerAndZoom(point, 16)
      var content = '<div style="margin: 60px 50px;color: #CFD1D3;width: 80%;height:60%;">' +
        '<table style="width: 95%;height:80%;text-align: left;margin: 20px;">' +
        '<tr><th style="text-align: center;color: #0BC7D0;font-size: 20px">' + enterpriseResource.resourceName + '</th></tr>' +
        '<tr><td style="font-size: 15px;">物资数量：' + enterpriseResource.resourceCount + enterpriseResource.resourceUnit + '</td></tr>' +
        '<tr><td style="font-size: 15px;">联系人：' + enterpriseResource.contact + '<span style="color: #0BC7D0;"> ' + enterpriseResource.mobile + ' </span><span style="cursor: pointer;" id="mobile"></span></td></tr>' +
        '<tr><td style="font-size: 15px;">企业名称：' + orgName + '</td></tr>' +
        '<tr><td style="font-size: 15px;">存放位置：' + orgAddress + '</td></tr>' +
        '<tr><td style="font-size: 15px;">用途：' + enterpriseResource.resourceUse + '</td></tr>' +
        '</table>' +
        '</div>'
      self.clickCompanyList(point, content, 500, 300, self.images.window2, self.images.guanbi, '45px 65px 0 0')
      var img1 = document.createElement('img')
      img1.src = self.images.callBlue
      img1.onclick = function () {
        self.$refs.call.singleCall(enterpriseResource.mobile)
      }
      $('#mobile').append(img1)
    },
    openAlarmMenu (obj, isQueue) {
      this.monitorType = '接警管理'
      this.alarmMenu = '接警登记'
      // if (this.currentTabComponent === register) {
      //   return
      // }
      this.currentTabComponent = register
      this.queueName = '呼叫队列'
      this.ejson = obj
      this.isQueue = isQueue
    },
    singleCall (num) {
      var self = this
      self.$refs.call.singleCall(num)
    },
    openCall () {
      var self = this
      self.$refs.call.openCall()
    },
    sendEjson (obj) {
      this.ejson = obj
    },
    showEmergencyPlan: function (eventObj) {
      this.planShow = 1
      this.currentTabComponent = null
      this.emergencyMenu = ''
      this.$refs.plan.showPlanByCompany(eventObj)
    },
    closePlan: function () {
      this.planShow = 0
    },
    successPlan: function (eventObj, chemical) {
      this.planShow = 0
      this.chemical = chemical
      this.$refs.queue.showPlanDetail(eventObj)
    },
    // 获取危化品
    getChemical: function (chemical) {
      this.chemical = chemical
    },
    // 视频截图
    getSnapPicture (camId) {
      let time = (new Date()).valueOf()
      // var camerasUuid = 'ada3123518f64676b7cb7242d613b907'
      getSnapPicture({ time: time, camerasUuid: camId }).then(res => {
        if (res.code === 1) {
          this.$Message.success('截图成功！')
          // var data = JSON.parse(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  /* 地图主容器 */
  .map-container {
    width: 100%;
    height: 100%;
  }
  #bMap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  /*跟踪监控类别选择tab（接警管理、应急指挥）*/
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
    .alarm {
      position: relative;
      left: 8px;
      background: url("../../assets/mapTrack/alarm_no.png");
      background-size: 100% 100%;
      &.active {
        background: url("../../assets/mapTrack/alarm_on.png");
      }
    }
    .emergency {
      background: url("../../assets/mapTrack/emergency1.png");
      background-size: 100% 100%;
      &.active {
        background: url("../../assets/mapTrack/emergency2.png");
      }
    }
  }
  .branch-emergency,
  .branch-alarm {
    position: absolute;
    top: 90px;
    left: 4px;
    width: 39px;
    text-align: center;
  }
  /*左侧菜单栏*/
  .left-menu {
    position: absolute;
    top: 158px;
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
    .alarm {
      background: url("../../assets/mapTrack/noChoose.png") no-repeat center;
      background-size: 100% 100%;
      &.active {
        background: url("../../assets/mapTrack/choose.png") no-repeat center;
        color: #fff;
        background-size: 100% 100%;
      }
      a {
        color: #0df6ff;
      }
    }
    .emergency {
      background: url("../../assets/mapTrack/noChoose.png") no-repeat center;
      background-size: 100% 100%;
      &.active {
        background: url("../../assets/mapTrack/choose.png") no-repeat center;
        color: #fff;
        background-size: 100% 100%;
      }
    }
  }
  .draw-manager {
    position: absolute;
    background: url("../../assets/mapTrack/drawManage.png") no-repeat;
    background-size: 100%;
    width: 149px;
    height: 36px;
    color: white;
    top: 100px;
    right: 350px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
  }
  .draw-labelType {
    position: absolute;
    border: solid 1px #0e7285;
    width: 140px;
    height: 320px;
    color: white;
    top: 142px;
    right: 350px;
    background-color: #0a3d52;
  }
  .draw-labelType label {
    width: 98%;
    text-align: left;
    margin-left: 20px;
    font-size: 10px;
    font-weight: 400;
  }
  .ztree {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .ztree::-webkit-scrollbar {
    display: none;
  }
  .videoDiv {
    position: absolute;
    bottom: 500px;
    right: 500px;
    width: 600px;
    height: 400px;
    background-color: #fff;
    z-index: 10;
  }
</style>
