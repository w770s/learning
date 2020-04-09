<template>
  <div class="container">
    <div class="main">
      <h4>电子报告单（{{type == 1 ? '进港' : '出港'}}）</h4>
      <div class="content" style="margin-top: 5px">
        <h5 style="border-color: #16adc1;" class="word-color">申请单</h5>
        <!--进港-->
        <div class="clearfix" v-if="type == 1">
          <div class="fl50">
            <span>申请单编号：</span>
            <span>{{isNull(reportObj.reportnumber)}}</span>
          </div>
          <div class="fl50">
            <span>申请时间：</span>
            <span>{{isNull(reportObj.reporttime)}}</span>
          </div>
          <div class="fl50">
            <span>预抵港口：</span>
            <span>{{isNull(reportObj.preportname)}}</span>
          </div>
          <div class="fl50">
            <span>预靠泊位：</span>
            <span>{{isNull(reportObj.berthname)}}</span>
          </div>
          <div class="fl50">
            <span>预抵时间：</span>
            <span>{{isNull(reportObj.expecttime)}}</span>
          </div>
          <div class="fl50">
            <span>受理机构：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>前吃水（米）：</span>
            <span>{{isNull(reportObj.foredraft)}}</span>
          </div>
          <div class="fl50">
            <span>后吃水（米）：</span>
            <span>{{isNull(reportObj.aftdraft)}}</span>
          </div>
          <div class="fl50">
            <span>航次数：</span>
            <span>{{isNull(reportObj.frequency)}}</span>
          </div>
          <div class="fl50">
            <span>审核状态：</span>
            <span>{{isNull(reportObj.ifaudit)== 0 ? '未审核':'已审核'}}</span>
          </div>
          <div class="fl50">
            <span>申请人联系电话：</span>
            <span>{{isNull(reportObj.operatortelephone)}}</span>
          </div>
        </div>
        <!--出港-->
        <div class="clearfix" v-else>
          <div class="fl50">
            <span>申请单编号：</span>
            <span>{{isNull(reportObj.reportnumber)}}</span>
          </div>
          <div class="fl50">
            <span>申请时间：</span>
            <span>{{isNull(reportObj.reporttime)}}</span>
          </div>
          <div class="fl50">
            <span>停靠港口：</span>
            <span>{{isNull(reportObj.preportname)}}</span>
          </div>
          <div class="fl50">
            <span>停靠泊位：</span>
            <span>{{isNull(reportObj.berthname)}}</span>
          </div>
          <div class="fl50">
            <span>预离时间：</span>
            <span>{{isNull(reportObj.expecttime)}}</span>
          </div>
          <div class="fl50">
            <span>受理机构：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>下一海事机构：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>前吃水（米）：</span>
            <span>{{isNull(reportObj.foredraft)}}</span>
          </div>
          <div class="fl50">
            <span>后吃水（米）：</span>
            <span>{{isNull(reportObj.aftdraft)}}</span>
          </div>
          <div class="fl50">
            <span>航次数：</span>
            <span>{{isNull(reportObj.frequency)}}</span>
          </div>
          <div class="fl50">
            <span>审核状态：</span>
            <span>{{isNull(reportObj.ifaudit)== 0 ? '未审核':'已审核'}}</span>
          </div>
          <div class="fl50">
            <span>申请人联系电话：</span>
            <span>{{isNull(reportObj.operatortelephone)}}</span>
          </div>
        </div>

        <h5 class="word-color">船舶资料</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>船舶名称：</span>
            <span>{{isNull(reportObj.shipname)}}</span>
          </div>
          <div class="fl50">
            <span>船舶种类：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>船舶识别号：</span>
            <span>{{isNull(reportObj.shipidnumber)}}</span>
          </div>
          <div class="fl50">
            <span>总吨位：</span>
            <span>{{isNull(reportObj.grosstonnage)}}</span>
          </div>
          <div class="fl50">
            <span>MIMSl：</span>
            <span>{{isNull(reportObj.mmsi)}}</span>
          </div>
          <div class="fl50">
            <span>净吨位：</span>
            <span>{{isNull(reportObj.nettonnage)}}</span>
          </div>
          <div class="fl50">
            <span>船籍港：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>主机总功率：</span>
            <span>{{isNull(reportObj.enginepower)}}</span>
          </div>
          <div class="fl50">
            <span>海船/内河：</span>
            <span>{{isNull(reportObj.markcode) === '0'?'海船':'内河'}}</span>
          </div>
          <div class="fl50">
            <span>建造日期：</span>
            <span>{{isNull(reportObj.builddate)}}</span>
          </div>
          <div class="fl50">
            <span>经营人：</span>
            <span>{{isNull(reportObj.operator)}}</span>
          </div>
          <div class="fl50">
            <span>所有人：</span>
            <span>{{isNull(reportObj.owner)}}</span>
          </div>
        </div>
        <h5 class="word-color">旅客</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>实载客量（位）：</span>
            <span>--</span>
          </div>
          <div class="fl50">
            <span>本港下客（位）：</span>
            <span>--</span>
          </div>
        </div>
        <h5 class="word-color">载货</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>实载货数量（吨）：</span>
            <span>{{isNull(reportObj.realdangercargo)}}</span>
          </div>
          <div class="fl50">
            <span>本港卸货数量（吨）：</span>
            <span>{{isNull(reportObj.portdangercargo)}}</span>
          </div>
        </div>
        <h5 class="word-color">车辆</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>实载车数量（辆）：</span>
            <span>{{isNull(reportObj.realvehicle)}}</span>
          </div>
          <div class="fl50">
            <span>本港卸载数量（辆）：</span>
            <span>{{isNull(reportObj.portvehicle)}}</span>
          </div>
        </div>
        <h5 class="word-color">驳船</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>驳船艘数（艘）：</span>
            <span>{{isNull(reportObj.realbarge)}}</span>
          </div>
          <div class="fl50">
            <span>加/解载驳船数量（艘）：</span>
            <span>{{isNull(reportObj.portbarge)}}</span>
          </div>
        </div>
        <h5 class="word-color">集装箱</h5>
        <div class="clearfix">
          <div class="fl50">
            <span>实载集装箱装运量（TEU）：</span>
            <span>{{isNull(reportObj.realcontainerqay)}}</span>
          </div>
          <div class="fl50">
            <span>本港集装箱装运量（TEU）：</span>
            <span>{{isNull(reportObj.portcontainerqay)}}</span>
          </div>
        </div>
        <h5 class="word-color">货物列表</h5>
        <div class="clearfix">
          <table class="table">
            <thead>
              <tr style="background-color: #f8f8f9;">
                <td>序号</td>
                <td>货物种类</td>
                <td>货品名称</td>
                <td>实载货数量（吨）</td>
                <td>本港卸货数量（吨）</td>
                <td>是否是危险品</td>
              </tr>
            </thead>
            <tbody v-for="(item, index) in goodsList">
              <tr>
                <td>{{index+1}}</td>
                <td>{{isNull(item.goodsname)}}</td>
                <td>{{isNull(item.goodsname)}}</td>
                <td>{{isNull(item.realcargo)}}</td>
                <td>{{isNull(item.portcargo)}}</td>
                <td>{{isNull(item.ifdanger) === 1?'是':'否'}}</td>
              </tr>
            </tbody>
          </table>
          <div style="text-align: center;font-size: 20px;" v-if="goodsList.length == 0"> 暂无数据 </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postElectronicReport } from '@/api/pdc'
export default {
  name: 'report',
  data () {
    return {
      type: '',
      reportObj: {},
      goodsList: [],
      containerList: []
    }
  },
  mounted () {
    console.log(this.$route.params.id)
    this.findElectronicReport(this.$route.params.id)
  },
  methods: {
    findElectronicReport (id) {
      var self = this
      postElectronicReport({ reportId: id }).then(res => {
        if (res.resultCode.code === 1) {
          console.log(res.data)
          self.reportObj = res.data
          self.type = res.data.arrivalorleave
          this.goodsList = JSON.parse(res.data.shipreportgoodbeans)
          // console.log(this.goodsList)
        } else {
          this.$Message.warning('数据查询出错')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    isNull (data) {
      if (data == null || data === 'null' || data === '' || data === undefined || data === 'undefined') {
        return '--'
      } else {
        return data
      }
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
    }
  }
}
</script>

<style scoped lang="less">
  .container{
    height: 100%;
    overflow: auto;
    background-color: #fff;
  }
  .main{
    width: 1000px;
    margin: 20px auto;
    font-family: PingFang-SC-Regular;
  }
  h4{
    text-align: center;
    padding-bottom: 20px;
    font-size: 30px;
    border-bottom: 4px solid #16adc1;
  }
  h5{
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
  h5.word-color{
    color: #16adc1!important;
  }
  .fl50{
    float: left;
    width: 50%;
    line-height: 30px;
  }
  table.table{
    width: 100%;
    border-spacing: 0;
    /*color: #fff;*/
    td{
      padding: 10px;
    }
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
