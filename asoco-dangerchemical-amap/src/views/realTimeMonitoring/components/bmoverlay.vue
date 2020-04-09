<template>
  <bm-overlay
    ref="customOverlay"
    pane="labelPane"
    class="sample"
    @draw="draw">
    <div class="iconControl" @click="iconControl">
      <img class="ui-close" :src="icon">
    </div>
<!--  车辆查询弹出框  -->
    <div v-if="!content.type" class="carBox">
      <div class="motorTractor">牵引车：
        <a target="_blank" class="ui-carBlue" :href="baseXietongLinkUrl+motorTractor+content.vanCert">
          {{content.carNum}}
        </a>
      </div>
      <div class="handCar">挂车：
        <a target="_blank" class="ui-carBlue" :href="baseXietongLinkUrl+handCar+content.truckCert">
          {{content.truckCert}}
        </a>
      </div>
      <div>时速：<span class="ui-carBlue">{{content.vec1}}公里/小时</span></div>
      <div>货物：<span class="ui-carBlue">{{content.openMesBox}}吨</span></div>
      <div>物流公司：
        <a target="_blank" class="ui-carBlue" :href="baseXietongLinkUrl+logisticFirm+content.carrierEnterpriseId+'&token'">
          {{content.enterpriseName}}
        </a>
      </div>
      <div>驾驶员：
        <a target="_blank" class="ui-carBlue" :href="baseXietongLinkUrl+driver+content.driverId">
          {{content.driverName}}
        </a>
      </div>
      <div>押运员：
        <a target="_blank" class="ui-carBlue" :href="baseXietongLinkUrl+supercargo+content.driverId2">
          {{content.driverName2}}
        </a>
      </div>
      <div class="ui-flexBox">
        <div class="ui-iconBox">
          <div class="ui-iconCenter"><img class="ui-arrows" :src="iarrows"></div>
          <div class="ui-iconCenter"><img class="ui-circles" :src="icircles"></div>
        </div>
        <div class="ui-inOutBox">
          <p>发货地：{{content.loadingMap}}</p>
          <p>收货地：{{content.unloadingMap}}</p>
        </div>
      </div>
      <div>
        <a target="_blank" :href="baseXietongLinkUrl+productInfo+content.productName">
          <img class="ui-rescues" :src="irescues">
        </a>
      </div>
    </div>
<!--  预警报警弹出框  -->
    <div v-else class="warnBox">
      <div class="warnType">{{content.warnTypeName}}</div>
      <div>挂车：
        <a target="_blank" class="ui-blueColor" :href="baseXietongLinkUrl+handCar+content.truckCert">
          {{content.truckCert}}
        </a>
      </div>
      <div>牵引车：
        <a target="_blank" class="ui-blueColor" :href="baseXietongLinkUrl+motorTractor+content.vanCert">
          {{content.vanCert}}
        </a>
      </div>
      <div>物流公司：
        <a target="_blank" class="ui-blueColor" :href="baseXietongLinkUrl+logisticFirm+content.carrierEnterpriseId+'&token'">
          {{content.carrierEnterpriseName}}
        </a>
      </div>
      <div>驾驶员：
        <a target="_blank" class="ui-blueColor" :href="baseXietongLinkUrl+driver+content.driverId">
          {{content.driverName}}
        </a>
      </div>
      <div>押运员：
        <a target="_blank" class="ui-blueColor" :href="baseXietongLinkUrl+supercargo+content.driverId2">
          {{content.driverName2}}
        </a>
      </div>
      <div class="warnLine"></div>
      <div>时间：{{content.createTime|formatDate}}</div>
      <div>地点：{{content.warnAddress}}</div>
      <div>详情：{{content.warnDetail}}</div>
      <div></div>
    </div>
  </bm-overlay>
</template>

<script>
import iclose from '@/assets/realTimeMonitoring/i-close.png'
import iarrow from '@/assets/realTimeMonitoring/i-arrow.png'
import irescue from '@/assets/realTimeMonitoring/i-rescue.png'
import icircle from '@/assets/realTimeMonitoring/i-circle.png'
import { baseXietongUrl } from '@/api/map'
import moment from 'moment'

export default {
  name: 'bmoverlay',
  props: ['content', 'position'],
  data () {
    return {
      icon: iclose,
      iarrows: iarrow,
      irescues: irescue,
      icircles: icircle,
      baseXietongLinkUrl: baseXietongUrl(), // 跳转协同基础地址
      motorTractor: '/#/vehicleInfoNoLogin?id=',
      handCar: '/#/vehicleInfoNoLogin?plateNo=',
      logisticFirm: '/#/enterpriseInfoNoLogin?enterpriseCode=',
      driver: '/#/staffInfoNoLogin?supercargo=',
      supercargo: '/#/staffInfoNoLogin?supercargo=',
      productInfo: '/#/productInfoNoLogin?name='
    }
  },
  watch: {
    position: {
      handler () {
        this.$refs.customOverlay.reload()
        this.iconOut = true
      },
      deep: true
    }
  },
  // 时间过滤
  filters: {
    formatDate: function (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    draw ({ el, BMap, map }) {
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    },
    iconControl () {
      this.$emit('iconCont')
    }
  }
}
</script>

<style scoped>
  .sample {
    position: absolute;
    margin: -280px 0 0 75px;
    width: 290px;
    padding:10px;
    box-sizing: border-box;
    background-color: #0a3d52;
    border: solid 1px #0df6ff;
    color:#fff;
  }
  .iconControl{
    top:0px;
    right:0px;
    width: 20px;
    height: 20px;
    padding:20px;
    display:flex;
    justify-content: flex-start;
    align-items:flex-end;
    position: absolute;
  }

  .motorTractor{
    font-size:20px;
    color:#0DBCD9;
  }

  .handCar{
    font-size:16px;
    color:#0DBCD9;
  }

  .ui-close{
    width: 12px;
    height: 12px;
  }

  .ui-iconBox{
    width:20px;
    display:flex;
    justify-content: space-around;
  }

  .ui-iconCenter{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ui-flexBox{
    display: flex;
  }

  .ui-arrows{
    width: 8px;
    height: 30px;
  }
  .ui-circles{
    height: 30px;
  }

  .carBox{
    line-height: 24px;
    font-size: 10px;
  }

  .warnBox{
    line-height: 24px;
    font-size: 14px;
    color:#fff;
  }

  .warnType{
    font-size: 16px;
    color: #ff5635;
    padding-bottom:5px;
  }

  .ui-blueColor{
    color: #0df6ff;
  }

  .ui-carBlue{
    color: #0DBCD9;
  }

  .warnLine{
    margin:3px 0;
    width: 100%;
    height: 1px;
    background-color: #1691a1;
  }
</style>
