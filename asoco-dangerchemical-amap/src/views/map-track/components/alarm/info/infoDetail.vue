<template>
    <div class="infoDetail">
      <span class="alarm-title">传感警情记录详情
       <img class="pointer" @click="closePage()" src="../../../../../assets/mapTrack/close.png">
      </span>
      <div class="alarm-content" >
        <div class="fl35" style="margin-top: 0;">
          <span class="alarm-txt">终端编号</span>
          <span class="alarm-con">{{trmlBase.trmlCode}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">终端码</span>
          <span class="alarm-con">{{trmlBase.trmlId}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">终端名称</span>
          <span class="alarm-con">{{trmlBase.trmlName}}</span>
        </div>
        <div class="fl35" style="margin-top: 0;">
          <span class="alarm-txt">终端类型</span>
          <span class="alarm-con">{{trmlBase.trmlTypeName}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">报警要素</span>
          <span class="alarm-con">{{trmlParamConfig.pointName}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">单位</span>
          <span class="alarm-con">{{trmlParamConfig.unit}}</span>
        </div>
        <div class="fl35" style="margin-top: 0;">
          <span class="alarm-txt">报警数据</span>
          <span class="alarm-con">{{alarmDetail.alarmData}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">报警时间</span>
          <span class="alarm-con">{{alarmDetail.alarmDate}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">状态</span>
          <span class="alarm-con">{{alarmDetail.alarmCd}}</span>
        </div>
        <div class="fl35" style="margin-top: 0;">
          <span class="alarm-txt">报警级别</span>
          <span class="alarm-con">{{trmlAlarmParam.levelName}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">报警上限</span>
          <span class="alarm-con">{{trmlAlarmParam.alarmMaxValue}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">报警下限</span>
          <span class="alarm-con">{{trmlAlarmParam.alarmMinValue}}</span>
        </div>
        <div class="fl35" style="margin-top: 0;">
          <span class="alarm-txt">所属单位</span>
          <span class="alarm-con">{{trmlBase.belongCoName}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">安装时间</span>
          <span class="alarm-con">{{trmlBase.installDate}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">联系人</span>
          <span class="alarm-con">{{trmlBase.contactPerson}}</span>
        </div>
        <div class="fl35" style="margin-top: 0;">
          <span class="alarm-txt">联系电话</span>
          <span class="alarm-con">{{trmlBase.contactPhone}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">所在单位</span>
          <span class="alarm-con">{{trmlBase.placeCoName}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">安装位置</span>
          <span class="alarm-con">{{trmlBase.installPosition}}</span>
        </div>
        <div class="fl35" style="margin-top: 0;">
          <span class="alarm-txt">接入IP</span>
          <span class="alarm-con">{{trmlAccessConfig.ip}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">端口号</span>
          <span class="alarm-con">{{trmlAccessConfig.port}}</span>
        </div>
        <div class="fl30" style="margin-top: 0;">
          <span class="alarm-txt">协议</span>
          <span class="alarm-con">{{trmlAccessConfig.protocol}}</span>
        </div>
      </div>
    </div>
</template>

<script>
import { getMonitorDetail } from '@/api/emergency'
export default {
  data () {
    return {
      // detailsShowTag: 0
      alarmDetail: {},
      trmlBase: {},
      trmlAccessConfig: {},
      trmlAlarmParam: {},
      trmlParamConfig: {}
    }
  },
  mounted () {
    // 登录后台系统
  },
  methods: {
    searchMonitorDetail: function (id) {
      getMonitorDetail(id).then(res => {
        if (res.code === 0) {
          this.alarmDetail = res.data
          this.trmlBase = res.data.trmlBase
          this.trmlAccessConfig = res.data.trmlAccessConfig
          this.trmlAlarmParam = res.data.trmlAlarmParam
          this.trmlParamConfig = res.data.trmlParamConfig
        } else {
          this.$Message.warning('获取数据失败')
        }
      }).catch(err => {
        this.ajaxLoadClose()
        console.log(err)
      })
    },
    closePage: function () {
      this.$emit('closeDetail')
    },
    // 打开初始化状态标志
    ajaxLoad: function () {
      this.loadFlag = true
    },
    // 关闭初始化状态标志
    ajaxLoadClose: function () {
      this.loadFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
  .infoDetail{
    position: absolute;
    margin-left: 230px;
    margin-top: 130px;
    top: -15px;
    width: 989px;
    height: 749px;
    background-image: url("../../../../../assets/mapTrack/sensor_alarm_detail_bg.png");
    background-repeat: no-repeat;
    overflow-y:auto ;
    .alarm-title {
      position: relative;
      display: block;
      margin-top: 20px;
      line-height: 35px;
      font-size: 20px;
      text-align: center;
      color: #0DDDE5;
      img{
        position: absolute;
        right: 50px;
        top: 11px;
      }
    }
    .alarm-content{
      width:  980px;
      height: 660px;
      margin-top: 20px;
      clear: both;
      padding: 10px 40px;
      padding-top: 0;
      overflow: auto;
      .fl35{
        float: left;
        width: 35%;
        height: 65px;
      }
      .fl30{
        float: left;
        width: 30%;
        height: 65px;
      }
      .alarm-txt{
        display: block;
        margin-left: 10px;
        line-height: 35px;
        font-size: 16px;
        color: #0DDDE5;
      }
      .alarm-con{
        display: block;
        margin-left: 10px;
        line-height: 35px;
        font-size: 16px;
        color: #fff;
      }
    }
    .alarm-content::-webkit-scrollbar {
      width: 4px;
      height: 1px;
    }
    .alarm-content::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #0fafc6;
    }
    .alarm-content::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #094a53;
    }
  }
  .pointer{
    cursor:pointer;
  }
</style>
