<template>
  <!--右边警情详情 zengxiaohui-->
   <div id="rightAlarmDetail">
     <div class="model" v-show="showFlag === 1">
       <div class="model-page">
         <div class="model-title">
           <span>报警详情</span>
           <img class="pointer" title="关闭" @click="closeDetailPaga()" src="../../../assets/mapTrack/close.png">
         </div>
         <div class="model-content">
           <div class="model-body">
             <div class="model-body-left">
               <div class="itemDiv">终端基本信息</div>
               <!--<div class="imgDiv">-->
                 <!--<img src="../../../assets/home/bg.jpg" @click="openPicModal">-->
                 <!--<img src="../../../assets/home/bg.jpg" @click="openPicModal">-->
               <!--</div>-->
               <div><span>终端编号：</span><span>{{alarmDetail.num}}</span></div>
               <div><span>终端名称：</span><span>{{alarmDetail.name}}</span></div>
               <div><span>终端类型：</span><span>{{showTerminalType(alarmDetail.equipmentType)}}</span></div>
               <div><span>所属企业：</span><span>{{alarmDetail.company}}</span></div>
               <div><span>安装时间：</span><span>{{alarmDetail.installationDate}}</span></div>
               <div><span>安装位置：</span><span>{{alarmDetail.longitude}}/{{alarmDetail.latitude}}</span></div>
               <div><span>所在地：</span><span>{{alarmDetail.address}}</span></div>
               <div><span>终端简介：</span><span>{{alarmDetail.remark}}</span></div>
             </div>
             <div class="model-body-right">
               <div class="itemDiv">报警数据详情</div>
               <div><span>报警时间：</span><span>{{alarmDetail.dtoCreateTime}}</span></div>
               <div><span>报警数值：</span><span>{{alarmDetail.dtoData}}</span></div>
               <div><span>最小值：</span><span>{{alarmDetail.min}}</span></div>
               <div><span>最大值：</span><span>{{alarmDetail.max}}</span></div>
               <div><span>一级阀值：</span><span>{{alarmDetail.firstThreshold}}</span></div>
               <div><span>二级阀值：</span><span>{{alarmDetail.secondThreshold}}</span></div>
               <div><span>报警级别：</span><span>{{alarmDetail.dtoAlarmType}}</span></div>
               <div><span @click="mesInform">发短信</span></div>
             </div>
           </div>
         </div>
       </div>
     </div>
     <!--pic预览-->
     <Modal v-model="picModal" class="picModal" title="图片预览" width="650">
       <img class="modelImg" :src="picSrc"/>
     </Modal>
     <!--pic预览-->
   </div>
</template>

<script>
import {postSendMessage} from '@/api/wharf'
export default {
  name: 'rightAlarmDetail',
  data () {
    return {
      showFlag: 0,
      picModal: false,
      picSrc: '',
      alarmDetail: {
        id: '',
        terminalId: '',
        terminalName: '',
        terminalType: '',
        terminalStatus: '',
        company: '',
        alarmTime: '',
        alarmElements: '',
        unit: '',
        alarmData: '',
        upLimit: '',
        underLimit: '',
        status: '',
        alarmGrade: '',
        monitoringArea: '',
        dataStatus: '',
        mnNum: '',
        setUpTime: '',
        setUpAddress: '',
        contact: '',
        contactNum: '',
        location: '',
        terminalSynopsis: ''
      }
    }
  },
  created () {
    // this.Detail()
  },
  methods: {
    // 关闭详情页面
    closeDetailPaga () {
      this.showFlag = 0
    },
    receivedCallMsg (alarmDetail) {
      // this.processId = id
      this.showFlag = 1
      this.alarmDetail = alarmDetail
    },
    openPicModal (e) {
      this.picModal = true
      this.picSrc = e.target.src
    },
    showStatus (status) {
      var str = ''
      switch (status) {
        case '0':
          str = '待处理'
          break
        case '1':
          str = '已处理'
          break
        default:
          str = ''
          break
      }
      return str
    },
    mesInform () {
      this.$Modal.confirm({
        title: '短信发送',
        content: '<p>是否确定向企业联系人发送提醒短信！！</p>',
        onOk: () => {
          postSendMessage({num: this.alarmDetail.num}).then(res => {
            if (res.code === 1) {
              self.$Message.success('短信通知成功！！')
            } else {
              self.$Message.warning('短信发送异常！！')
            }
          }).catch(err => {
            console.log(err)
          })
        },
        onCancel: () => {

        }
      })
    },
    showTerminalType (terminalType) {
      var str = ''
      switch (terminalType) {
        case 1:
          str = '视频'
          break
        case 2:
          str = '压力'
          break
        case 3:
          str = '燃气'
          break
        case 4:
          str = '温度'
          break
        case 5:
          str = '液位'
          break
      }
      return str
    }
  }
}
</script>

<style scoped lang="less">
  /*弹出层model*/
  #rightAlarmDetail{
    .model {
      background-color: rgba(0, 0, 0, 0.7);
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 666;
      .model-page {
        position: absolute;
        width: 640px;
        height: 540px;
        top: 50%;
        left: 50%;
        margin-top: -270px;
        margin-left: -320px;
        background: url("../../../assets/mapTrack/window1.png") no-repeat scroll right center transparent;
        background-size: 640px 540px;
        .model-title {
          padding-top: 37px;
          text-align: center;
          img {
            float: right;
            margin-right: 38px;
          }
          span {
            position: relative;
            top: -7px;
            font-family: PingFang-SC-Regular;
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #0ddde5;
            margin: 0 auto;
          }
        }
        .model-content {
          text-align: left;
          position: relative;
          width: 92%;
          height: 100%;
          margin: 10px auto 0 auto;
          overflow-y: auto;
          color: #e0e0e0;
          font-size: 15px;
          .model-body{
            clear: both;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            height: calc(100% - 100px);
            /*height: 350px;*/
            .itemDiv{
              background-color: #0A3D52;
              padding: 7px 10px;
              color: #f5f5f5;
            }
            .model-body-left{
              display: inline-flex;
              width: 47%;
              min-height: 100%;
              flex-direction: column;
              background-color: #041725;
              div{
                padding-left: 10px;
                display: inline-flex;
                flex-direction: row;
                justify-content: flex-start;
                line-height: 28px;
                span:nth-child(1){
                  min-width: 100px;
                }
              }
              div:nth-child(2){
                padding-top: 10px;
              }
              .imgDiv{
                img{
                  width: 60px;
                  height: 60px;
                  margin-right: 8px;
                }
              }
            }
            .model-body-right{
              display: inline-flex;
              flex-direction: column;
              width: 47%;
              min-height: 100%;
              background-color: #041725;
              div{
                padding-left: 10px;
                line-height: 28px;
              }
              div:nth-child(2){
                padding-top: 10px;
              }
              div:last-child{
                padding-top: 10px;
                span{
                  color: #16ADC1;
                  border: 1px solid #16ADC1;
                  padding: 3px 7px;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
    .pointer{
      cursor: pointer;
    }
  }
</style>
