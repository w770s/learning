<template>
  <!--船舶model-->
  <div class="model" v-show="shipModel">
    <div class="model-page">
      <div class="model-title">
        <span>{{isNull(shipMessage.shipName)}}</span>
        <img class="pointer" @click="closeModel" src="../../../assets/realTimeMonitoring/close.png">
      </div>
      <div class="model-content">
        <ul class="tab-ul clearfix">
          <li :class="{'active' : tabFlag == 1 ? true:false}" @click="changeTab(1)">AIS信号</li>
          <li :class="{'active' : tabFlag == 2 ? true:false}" @click="changeTab(2)">档案</li>
          <li :class="{'active' : tabFlag == 3 ? true:false}" @click="changeTab(3)">进出港电子报告</li>
          <li :class="{'active' : tabFlag == 4 ? true:false}" @click="changeTab(4)">码头作业报告</li>
        </ul>
        <div class="tab-content-div">
          <div class="container-content" v-show="tabFlag == 1">
            <div>
              <span>信息接收时间：</span>
              <span>{{formatDateTime(AISData.receive_time)}}</span>
            </div>
            <div>
              <span>航向：</span>
              <span>{{isNull(AISData.direct)}}</span>
            </div>
            <div>
              <span>经度：</span>
              <span>{{isNull(AISData.location.lon)}}</span>
            </div>
            <div>
              <span>纬度：</span>
              <span>{{isNull(AISData.location.lat)}}</span>
            </div>
            <div>
              <span>船舶信息：</span>
              <span>{{isNull(AISData.other_info.GPSDeviceNum)}}</span>
            </div>
            <div>
              <span>船舶名称：</span>
              <span>{{AISData.VNO}}</span>
            </div>
            <div>
              <span>速度：</span>
              <span>{{isNull(AISData.speed)}}</span>
            </div>
            <div>
              <span>航艏向：</span>
              <span>{{isNull(AISData.status.shipHeading)}}</span>
            </div>
          </div>
          <div class="container-content" v-show="tabFlag == 2">
            <div class="clearfix">
              <div class="fl50">
                <span>船名号：</span>
                <span>{{isNull(shipMessage.shipName)}}</span>
              </div>
              <div class="fl50">
                <span>船籍港：</span>
                <span>{{isNull(shipMessage.portRegistryName)}}</span>
              </div>
              <div class="fl50">
                <span>船检登记号：</span>
                <span>{{isNull(shipMessage.shipSurveyRegisterNumber)}}</span>
              </div>
              <div class="fl50">
                <span>船舶登记号：</span>
                <span>{{isNull(shipMessage.shipRegistrationNumber)}}</span>
              </div>
              <div class="fl50">
                <span>船舶种类：</span>
                <span>{{isNull(shipMessage.shipKindName)}}</span>
              </div>
              <div class="fl50">
                <span>船舶识别号：</span>
                <span>{{isNull(shipMessage.shipIdentificationNumber)}}</span>
              </div>
              <div class="fl50">
                <span>主机功率（千瓦）：</span>
                <span>{{isNull(shipMessage.totalPower)}}</span>
              </div>
              <div class="fl50">
                <span>参考载货量（吨）：</span>
                <span>{{isNull(shipMessage.referenceDeadweightTon)}}</span>
              </div>
              <div class="fl50">
                <span>总吨位（吨）：</span>
                <span>{{isNull(shipMessage.grossTonnage)}}</span>
              </div>
              <div class="fl50">
                <span>净吨位（吨）：</span>
                <span>{{isNull(shipMessage.netTonnage)}}</span>
              </div>
              <div class="fl50">
                <span>吃水满载（米）：</span>
                <span>{{isNull(shipMessage.fullDraft)}}</span>
              </div>
              <div class="fl50">
                <span>总长（米）：</span>
                <span>{{isNull(shipMessage.shipTotalLength)}}</span>
              </div>
              <div class="fl50">
                <span>型宽（米）：</span>
                <span>{{isNull(shipMessage.shipMoldedBeam)}}</span>
              </div>
              <div class="fl50">
                <span>型深（米）：</span>
                <span>{{isNull(shipMessage.shipMoldedDepth)}}</span>
              </div>
              <div class="fl50">
                <span>船舶所有人：</span>
                <span>{{isNull(shipMessage.owner)}}</span>
              </div>
              <div class="fl50">
                <span>船舶经营人：</span>
                <span>{{isNull(shipMessage.operator)}}</span>
              </div>
            </div>
          </div>
          <div class="container-content" v-show="tabFlag == 3">
            <table class="table">
              <thead>
                <tr style="background-color: #0a3d52">
                  <td width="55px">序号</td>
                  <td width="90px">进出港类型</td>
                  <td>申请时间</td>
                  <td>预抵/停靠泊位</td>
                  <td>预抵/停靠港口</td>
                  <td>操作</td>
                </tr>
              </thead>
              <tbody :key="item.id" v-for="(item, index) in inOutPort">
                <tr>
                  <td>{{index+1}}</td>
                  <td>{{item.arrivalorleave == 1 ? '进港' : '出港'}}</td>
                  <td>{{isNull(item.reporttime)}}</td>
                  <td>{{isNull(item.preportname)}}</td>
                  <td>{{isNull(item.reportportname)}}</td>
                  <td><span class="detail-btn" @click="goElecReportDetail(item.reportid)">详情</span></td>
                </tr>
              </tbody>
            </table>
            <div style="text-align: center;font-size: 20px;" v-if="inOutLength == 0"> 暂无数据 </div>
          </div>
          <div class="container-content" v-show="tabFlag == 4">
            <table class="table">
              <thead>
                <tr style="background-color: #0a3d52">
                  <td width="55px">序号</td>
                  <td width="80px">作业类型</td>
                  <td>预计作业时间</td>
                  <td>申报单位</td>
                  <td>作业泊位</td>
                  <td width="75px">操作</td>
                </tr>
              </thead>
              <tbody :key="item.id" v-for="(item, index) in dangerousGoodsMainInfos">
                <tr>
                  <td>{{index+1}}</td>
                  <td>{{item.workType == '01' ? '装货' : '卸货'}}</td>
                  <td>{{isNull(item.estimated_start_time)}}</td>
                  <td>{{isNull(item.company)}}</td>
                  <td>{{isNull(item.work_location_name)}}</td>
                  <td><span class="detail-btn" @click="goWorkReportDetail(item.id)">详情</span></td>
                </tr>
              </tbody>
            </table>
            <div style="text-align: center;font-size: 20px;" v-if="dangerousGoodsLength == 0"> 暂无数据 </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postShipMessage, postPortReportList, postWorkReportList } from '@/api/pdc'
export default {
  name: 'shipDetail',
  props: {
    AISData: {
      sample_time: 1553153177000,
      other_info: {
        AISdentificationNum: '',
        messageType: '1',
        GPSDeviceNum: 'WM2HZ818629'
      },
      VNO: '浙安吉货0778',
      direct: '170',
      receive_time: 1553153151581,
      project_code: '',
      location: {
        lon: 120.14165,
        lat: 30.5163
      },
      id: '浙安吉货0778-1553153177000',
      speed: '10.0',
      status: {
        shipHeading: '170'
      }
    }
  },
  data () {
    return {
      shipModel: false,
      tabFlag: 1,
      shipTimer: null,
      shipMessage: {},
      shipPolyLine: null,
      beginMarker: null,
      singleShipHistoryPointList: [],
      singleShipHistoryMarker: [],
      inOutPort: [],
      inOutLength: 0,
      dangerousGoodsMainInfos: [],
      dangerousGoodsLength: 0
    }
  },
  methods: {
    changeTab (num) {
      this.tabFlag = num
      if (num === 3) {
        this.findPortReportList(this.AISData.VNO)
      } else if (num === 4) {
        this.findWorkReportList(this.AISData.VNO)
      }
    },
    closeModel () {
      this.shipModel = false
      this.tabFlag = 1
      // console.log(this.shipModel)
    },
    // 电子报告详情
    goElecReportDetail (id) {
      const { href } = this.$router.resolve({
        name: 'elec-report',
        params: {
          id: id
        }
      })
      window.open(href, '_blank')
    },
    // 码头作业报告详情
    goWorkReportDetail (id) {
      const { href } = this.$router.resolve({
        name: 'work-report',
        params: {
          id: id
        }
      })
      window.open(href, '_blank')
    },
    // 船舶详细信息
    findShipMessage (shipName) {
      var self = this
      postShipMessage({ shipName: shipName }).then(res => {
        if (res.resultCode.code === 1) {
          // console.log(res.data)
          self.shipModel = true
          self.shipMessage = res.data.shipMessage
          self.dangerousGoodsMainInfos = res.data.dangerousGoodsMainInfos
          self.dangerousGoodsLength = res.data.dangerousGoodsMainInfos.length
        } else {
          this.$Message.warning('暂无船舶详情')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 电子报告列表
    findPortReportList (shipName) {
      var self = this
      postPortReportList({ shipName: shipName }).then(res => {
        if (res.resultCode.code === 1) {
          // console.log(res.data)
          self.inOutPort = res.data
          self.inOutLength = res.data.length
        } else {
          self.inOutLength = 0
          this.$Message.warning('数据查询出错')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 作业报告列表
    findWorkReportList (shipName) {
      var self = this
      postWorkReportList({ shipName: shipName }).then(res => {
        if (res.resultCode.code === 1) {
          // console.log(res.data)
          self.dangerousGoodsMainInfos = res.data
          self.dangerousGoodsLength = res.data.length
        } else {
          self.dangerousGoodsLength = 0
          this.$Message.warning('数据查询出错')
        }
      }).catch(err => {
        console.log(err)
      })
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
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">

  /* 船舶model */
  /*弹出层model*/
  .model {
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999;
  }
  .model-page {
    position: absolute;
    width: 840px;
    height: 540px;
    top: 50%;
    left: 50%;
    margin-top: -270px;
    margin-left: -420px;
    background: url("../../../assets/realTimeMonitoring/window.png") no-repeat scroll right center transparent;
    background-size: 840px 540px;

  }
  .model-title {
    padding-top: 37px;
    text-align: center;
  }
  .model-title span {
    position: relative;
    top: -7px;
    font-family: PingFang-SC-Regular;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #0ddde5;
    margin: 0 auto;
  }
  .model-title img {
    float: right;
    margin-right: 38px;
    cursor: pointer;
  }
  .model-content {
    position: relative;
    padding-left: 24px;
    width: 92%;
    margin: 10px auto 0 auto;
    color: #a8b0b7;
    font-family: PingFang-SC-Regular;
    overflow-y: auto;
  }
  ul,li{
    padding: 0;
    list-style: none;
  }
  .tab-ul{
    border-bottom: 1px solid #666;
  }
  .tab-ul li{
    float: left;
    padding: 7px 14px;
    font-size: 18px;
    cursor: pointer;
  }
  .tab-ul li.active{
    color: #0cd4de;
    background-color: #0a3d52;
  }
  .tab-content-div{
    height: 400px;
    padding: 20px;
    overflow: auto;
  }
  .container-content{
    height: 100%;
  }
  .container-content div{
    line-height: 30px;
  }
  .fl50{
    float: left;
    width: 50%;
    font-size: 14px;
  }
  table.table{
    width: 100%;
    border-spacing: 0;
    thead{
      color: #fff;
    }
    td{
      padding: 10px;
    }
  }

  .detail-btn{
    display: inline-block;
    padding: 2px 10px;
    background-color: #0a3d52;
    color: #0ddde5;
    border: 1px solid #0ddde5;
    cursor: pointer;
  }
  /*清除浮动代码*/
  .clearfix:after{
    display:block;
    clear:both;
    content:"";
    visibility:hidden;
    height:0;
  }
  .clearfix{
    zoom:1;
  }
</style>
