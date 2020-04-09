<template>
  <div class="dealDetail">
    <div class="model" v-show="showFlag === 1">
      <div class="model-page">
        <div class="model-title">
          <span>处理单</span>
          <img class="pointer" title="关闭" @click="closeDetailPaga()" src="../../../../assets/mapTrack/close.png">
        </div>
        <div class="model-content">
          <div style="float: left;margin: 0 0 10px 20px">状态：<span style="color: #C88F1B">{{dataobj.status}}</span> <span @click="openTime" class="pointer">【展开】</span></div>
          <div class="timeDiv" v-show="isOpenTime">
            <Timeline>
              <template v-for="(item,index) in dataobj.statusList">
                <TimelineItem :key="index">
                  <span class="timeSlot" slot="dot"></span>
                  <div class="timeDivItem">
                    <span>{{item.status}}</span>
                    <p v-show="item.remark !== null">{{item.remark | remarkContent(item.status, item.remark)}}</p>
                    <p>{{item.statusTime}}</p>
                  </div>
                </TimelineItem>
              </template>
              <TimelineItem>
                <span class="timeSlot" slot="dot"></span>
                <div class="timeDivItem">
                  <span>生成处理单</span>
                  <p>{{dataobj.company}}：{{dataobj.discoveryTime}}</p>
                </div>
              </TimelineItem>
            </Timeline>
          </div>
          <div class="model-body">
            <div class="model-body-left">
              <div>处理单号</div>
              <div><span style="color: #A0ABB3">{{dataobj.orderId}}</span></div>
              <div>监管者单位</div>
              <div><span style="color: #A0ABB3">{{dataobj.regulatorOrg}}</span></div>
              <div>企业名称</div>
              <div><span style="color: #A0ABB3">{{dataobj.company}}</span></div>
              <div>问题描述</div>
              <div><span style="color: #A0ABB3">{{dataobj.problemDesc}}</span></div>
            </div>
            <div class="model-body-right">
              <div>监管者名称</div>
              <div><span style="color: #A0ABB3">{{dataobj.regulatorName}}</span></div>
              <div>发现问题时间</div>
              <div><span style="color: #A0ABB3">{{dataobj.discoveryTime}}</span></div>
              <div>违规作业类型</div>
              <div><span style="color: #A0ABB3"><span v-for="item in typeDatas" :key="item">{{item}}</span></span></div>
            </div>

          </div>
          <div class="model-body-div">
            <div style="text-align: left;">照片</div>
            <div class="model-body-imgdiv">
              <template v-for="img in picture">
                <div @click="oprnPicModal(img)"><img :src="img"></div>
              </template>
            </div>
          </div>
          <template v-for="(item,index) in dataobj.processEctificateFeedbacks">
            <div class="model-body-div">
              <div style="text-align: left;">整改反馈{{index+1}}</div>
              <div style="text-align: left;color: #A0ABB3">{{item.feedbackOpinion}}</div>
              <div class="model-body-imgdiv">
                <div @click="oprnPicModal(item.picture)"><img :src="item.picture" alt=""></div>
              </div>
            </div>
          </template>
          <div class="model-body-div" style="position: relative" v-show="dataobj.status === '待审批'">
            <div class="btn-div">
              <span class="pointer" @click="rectification">整改通过，结单</span>
              <span class="pointer" @click="noRectification">整改不通过，退回</span>
            </div>
            <!--tip-model-->
            <div class="tip-model" v-show="openTipModel">
              <div class="tip-body">
                <div class="tip-body-content">
                  <textarea onresize="false" v-model="approvalOpinion" placeholder="请输入审批意见，可不填"></textarea>
                  <div class="tip-body-content-btn">
                    <span @click="closeTip">取消</span><span :class="{ 'yellow-span': isRight }" @click="rectificationTip">{{rectificationTipText}}</span>
                  </div>
                </div>
              </div>
              <div class="tip-body-tag" :class="{ 'tag-right': isRight }">
                <div></div>
                <span></span>
              </div>
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
import { jobViolationType, dealDetails, abarbeitung } from '@/api/wharf'
export default {
  name: 'dealDetail',
  data () {
    return {
      ip: 'http://api.iasoco.com',
      showFlag: 0,
      picModal: false, // 图片预览model
      picSrc: '', // 预览单个图片src
      dataobj: {},
      rectificationTipText: '整改通过，结单',
      openTipModel: false,
      isRight: false,
      isOpenTime: false,
      processId: 0,
      picture: [], // 图片数组
      status: 1, // 默认整改通过
      approvalOpinion: '', // 整改通过或不通过理由
      typeDatas: []
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
    receivedCallMsg (id) {
      // console.log(data)
      this.processId = id
      this.Detail()
      this.showFlag = 1
    },
    oprnPicModal (src) {
      this.picModal = true
      this.picSrc = src
      // console.log(src)
    },
    // 整改通过按钮
    rectification () {
      this.openTipModel = true
      this.rectificationTipText = '整改通过，结单'
      this.isRight = false
      this.status = 1
    },
    noRectification () {
      this.openTipModel = true
      this.rectificationTipText = '整改不通过，退回'
      this.isRight = true
      this.status = 0
    },
    // tip 确定按钮
    rectificationTip () {
      abarbeitung({ id: this.processId, status: this.status, approvalOpinion: this.approvalOpinion }).then(res => {
        if (res.code === 1) {
          this.$Message.success('审批提交成功！')
          this.Detail()
        } else {
          this.$Message.success('审批异常！')
        }
      }).catch(err => {
        console.log(err)
      })
      this.openTipModel = false
    },
    // 关闭tip
    closeTip () {
      this.openTipModel = false
    },
    // 打开时间轴
    openTime () {
      if (this.isOpenTime === true) {
        this.isOpenTime = false
      } else {
        this.isOpenTime = true
      }
    },
    Detail () {
      dealDetails({ processId: this.processId }).then(res => {
        if (res.code === 1) {
          // console.log(res.data)
          // 降序排列
          let data = res.data.statusList
          let dateToTime = function (str) {
            return (new Date(str.replace(/-/g, '/'))).getTime() // 用/替换日期中的-是为了解决Safari的兼容
          }
          for (let i = 0; i < data.length; i++) {
            data[i].publishTimeNew = dateToTime(data[i].statusTime)
          }
          data.sort(function (a, b) {
            return b.publishTimeNew > a.publishTimeNew ? 1 : -1
          })
          this.dataobj = res.data
          this.picture = this.dataobj.picture.split('&')
          this.typeDatas = []
          this.violationTypeSwitch(this.dataobj.violationType)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取码头违规作业类型
    getJobViolationType () {
      jobViolationType().then(res => {
        if (res.code === 1) {
          this.illegalTypeList = res.data
          localStorage.setItem('violationTypes', JSON.stringify(res.data))
        } else {
          this.$Message.warning('获取码头违规作业类型异常!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 码头违规作业类型转换
    violationTypeSwitch (t) {
      let reg = RegExp(/,/)
      if (reg.test(t)) {
        let pram = t.split(',')
        // console.log(pram)
        if (localStorage.getItem('violationTypes')) {
          let typeData = JSON.parse(localStorage.getItem('violationTypes'))
          for (let p of pram) {
            p = parseInt(p)
            for (let v of typeData) {
              if (v.id === p) {
                this.typeDatas.push(p + ':' + v.detail + ' ')
              }
            }
          }
        }
      } else {
        t = parseInt(t)
        if (localStorage.getItem('violationTypes')) {
          let typeData = JSON.parse(localStorage.getItem('violationTypes'))
          for (let v of typeData) {
            if (v.id === t) {
              this.typeDatas.push(v.detail)
            }
          }
        }
      }
    }
  },
  filters: {
    remarkContent (remark, status) {
      if (status === '已反馈') {
        return '反馈内容: ' + remark
      } else if (status === '已结单' || status === '已退回') {
        return '审批理由: ' + remark
      } else {
        return '内容: ' + remark
      }
    }
  }
}
</script>

<style lang="less">
  /*弹出层model*/
 .dealDetail .model {
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 666;
  }
  .dealDetail .model-page {
    position: absolute;
    width: 840px;
    height: 540px;
    top: 50%;
    left: 50%;
    margin-top: -270px;
    margin-left: -420px;
    background: url("../../../../assets/mapTrack/window1.png") no-repeat scroll right center transparent;
    background-size: 840px 540px;

  }
  .dealDetail .model-title {
    padding-top: 37px;
    text-align: center;
  }
  .dealDetail .model-title span {
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
  .dealDetail .model-title img {
    float: right;
    margin-right: 38px;
  }
  .dealDetail .model-content {
    text-align: center;
    position: relative;
    /*padding-left: 24px;*/
    width: 92%;
    height: calc(100% - 100px);
    margin: 10px auto 0 auto;
    overflow-y: auto;
    color: #0ddde5;
    font-size: 15px;
  }
  .pointer{
    cursor: pointer;
  }
  .dealDetail .model-body{
    clear: both;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /*height: 350px;*/
  }
  .dealDetail .model-body-left{
    display: inline-flex;
    width: 50%;
    margin-left: 20px;
    height: 100%;
    flex-direction: column;
  }
  .dealDetail .model-body-left div{
    width: 100%;
    padding: 3px 0;
    display: inline-flex;
    justify-content: flex-start;
  }
  .dealDetail .model-body-right{
    display: inline-flex;
    flex-direction: column;
    width: 45%;
    height: 100%;
  }
  .dealDetail .model-body-right div{
    width: 100%;
    padding: 3px 0;
    display: inline-flex;
    justify-content: flex-start;
  }
  .dealDetail .model-body-span{
    color: #A0ABB3;
    padding: 1px 3px;
    background-color: #0A3D52;
    margin-right: 3px;
  }
  .dealDetail .model-body-div{
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    padding-left: 20px;
    /*background-color: #0E6D82;*/
  }
  .dealDetail .model-body-imgdiv{
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .dealDetail .model-body-imgdiv div{
    width: 100px;
    height: 100px;
    padding: 5px;
  }
  .dealDetail .model-body-imgdiv div img{
    width: 100%;
    height: 100%;
  }
  .picModal .modelImg{
    width: 100%;
  }
  .dealDetail .btn-div{
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
  }
  .dealDetail .btn-div span{
    width: 135px;
    height: 30px;
    line-height: 30px;
  }
  .dealDetail .btn-div span:first-child{
    background-image: url("../../../../assets/mapTrack/btn_on.png");
    background-size: 135px 29px;
    background-repeat: no-repeat;
  }
  .dealDetail .btn-div span:last-child{
    background-image: url("../../../../assets/mapTrack/btn_qx_on.png");
    background-size: 135px 29px;
    background-repeat: no-repeat;
    color: #fff;
    margin-left: 10px;
  }
  /*tip model*/
  .dealDetail .tip-model{
    position: absolute;
    top: -153px;
    left: 33%;
  }
  .dealDetail .tip-body{
    width: 320px;
    height: 127px;
    border: 1px solid #16ADC1;
    background-color: #0A3D52;
  }
  .dealDetail .tip-body-tag{
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-top: 29px solid #16ADC1;
    position: relative;
    top: -13px;
    left: 5px
  }
  .dealDetail .tag-right{
    left: 60%;
  }
  .dealDetail .tip-body-tag div{
    width: 53px;
    height: 10px;
    position: absolute;
    top: -27px;
    background-color: #0A3D52;
    left: -28px;
  }
  .dealDetail .tip-body-tag span{
    display: block;
    width: 0;
    height: 0;
    border-left: 24px solid transparent;
    border-right: 24px solid transparent;
    border-top: 28px solid #0A3D52;
    position: relative;
    left: -24px;
    top: -29px;
  }
  .dealDetail .tip-body-content{
    padding: 10px;
    z-index: 30;
  }
  .dealDetail .tip-body-content textarea{
    width: 100%;
    height: 70px;
    background-color: #042035;
    border: none;
    resize:none;
    color: #A0ABB3;
    outline:none;
  }
  .dealDetail .tip-body-content-btn{
    margin-left: 40%;
  }
  .dealDetail .tip-body-content-btn span{
    width: 135px;
    height: 30px;
    line-height: 30px;
    padding: 3px;
    border: 1px solid #0ddde5;
    cursor: pointer;
  }
  .dealDetail .tip-body-content-btn span:first-child{
    color: #fff;
  }
  .dealDetail .tip-body-content-btn span:last-child{
    color: #0ddde5;
    margin-left: 10px;
  }
  .dealDetail .yellow-span{
    color: #FFD600!important;
    border: 1px solid #FFD600!important;
  }
  /*tap model end*/
  /*时间轴*/
  .dealDetail .timeDiv{
    width: 90%;
    margin-left: 23px;
    display: flex;
    justify-content: flex-start;
    .timeSlot{
      height: 7px;
      width: 7px;
      border: 1px solid #0ddde5;
      border-radius: 50%;
      display: inline-block;
      background-color: #0ddde5;
      position: relative;
      top: -1px;
    }
    .ivu-timeline-item-head{
      background: none!important;
    }
    .ivu-timeline-item-tail{
      border-left: 1px solid #253D4F;
    }
    .ivu-timeline{
      width: 100%;
    }
    .timeDivItem{
      width: 100%;
      background-color: #0A3D52;
      border-radius: 3px;
      min-height: 40px;
      text-align: left;
      padding: 10px 0 5px 10px;
      color: rgb(160, 171, 179);
      font-size: 14px;
    }
    .timeDivItem p{
      font-size: 12px;
      margin-top: 5px;
    }
  }

  .dealDetail *::-webkit-scrollbar {
    width: 8px;
    height: 6px;
  }
  .dealDetail *::-webkit-scrollbar-track {
    background-color:#041E32;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius:2em;
  }
  .dealDetail *::-webkit-scrollbar-thumb {
    background-color:#153448;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius:2em;
  }
</style>
