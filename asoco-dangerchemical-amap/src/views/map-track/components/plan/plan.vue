<template>
  <div class="model" id="planSwitch_model" style="display: block">
    <div class="model_page model_pageheight">
      <div class="model_title">
        <span>请选择预案</span>
        <img class="pointer" @click="closeplanSwitch_Paga()" src="../../../../assets/mapTrack/close.png">
      </div>
      <div class="model_content">
        <div  style="float: left;">
          <div class="info_username_div">
            <span class="info_username">预案名称</span>
          </div>
          <div class="info_username_div">
            <input id="input22" type="text" placeholder="请输入..." class="planSwitch_input floatleft" v-model="searchParam.name">
            <button class="model_button model_button_zc floatleft planSwitch_btn" type="primary" @click="showPlan">搜 索</button>
            <button class="model_button model_button_qx floatleft planSwitch_btn" style="color: #fff;" type="primary" @click="resetPlan">重 置</button>
          </div>
          <div class="info_username_div">
            <span class="detail_info_username" style="width: auto;display: inline-block;margin: 0px">若无对应预案，直接启动应急。</span>
          </div>
          <div class="info_username_div">
            <div class="table">
              <Table highlight-row @on-current-change="getCurrentRow" ref="currentRowTable" :columns="planColumns" :data="emergencyPlan"></Table>
            </div>
          </div>
        </div>
        <template>
          <Page :total="total" :page-size="5" size="small" @on-change="showHistoryPlan"/>
        </template>
        <div class="model_content_bottom">
          <button class="model_button model_button_zc floatright" type="primary" @click="addPlanToEmergency()">确 定</button>
          <button class="model_button model_button_qx floatright" style="color: #fff;" type="primary" @click="closeplanSwitch_Paga()">取 消</button>

        </div>
      </div>
    </div>
  </div>
</template>x

<script>
import { updateAlarmEvents, getEmergencyPlanListByCompanyName } from '@/api/emergency'
export default {
  data () {
    return {
      emergencyPlan: [],
      emergencyPlanObj: '',
      emergencyEvent: '',
      checkPlan: '',
      searchParam: {
        companyName: '',
        name: '',
        time: ''
      },
      total: 1,
      current: 1,
      pageSize: 5,
      currentId: '',
      planColumns: [
        {
          type: 'index',
          width: 40,
          align: 'center'
        },
        {
          title: '预案名称',
          key: 'name'
        },
        {
          title: '联系人',
          key: 'contact'
        },
        {
          title: '联系电话',
          key: 'phone'
        },
        {
          title: '所属单位',
          key: 'companyName'
        }
      ]
    }
  },
  methods: {
    // 切换预案页面
    // planSwitch_Paga: function () {
    //   $('#planSwitch_model').show()
    // },
    // 关闭切换预案页面
    closeplanSwitch_Paga: function () {
      this.$emit('closePlan')
    },
    showPlanByCompany: function (eventObj) {
      this.emergencyEvent = eventObj
      this.searchParam.companyName = eventObj.relevantEnterprise
      this.showPlan()
    },
    showPlan: function () {
      var self = this
      getEmergencyPlanListByCompanyName({ page: self.current, rows: self.pageSize, companyName: self.searchParam.companyName, name: self.searchParam.name, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          this.emergencyPlan = res.data.list
          self.total = res.data.total
        } else {
          this.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showHistoryPlan: function (page) {
      var self = this
      self.current = page
      getEmergencyPlanListByCompanyName({ page: self.current, rows: self.pageSize, companyName: self.searchParam.companyName, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          this.emergencyPlan = res.data.list
          this.total = res.data.total
        } else {
          this.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    resetPlan: function () {
      var self = this
      self.searchParam.name = ''
      self.showPlan()
    },
    addPlanToEmergency: function () {
      var self = this
      self.emergencyEvent.status = '1'
      if (this.checkPlan === '') {
        self.emergencyEvent.emergencyPlanName = '无'
      } else {
        self.emergencyEvent.emergencyPlanName = self.checkPlan.name
        self.emergencyEvent.emergencyPlanId = self.checkPlan.id
      }
      updateAlarmEvents({ evetsJson: JSON.stringify(self.emergencyEvent), token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          this.$emit('successPlan', self.emergencyEvent)
          this.$Message.success('预案设置成功！')
        } else {
          this.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getCurrentRow: function (currentRow,oldCurrentRow) {
      this.checkPlan = currentRow
    }
  }
}
</script>

<style scoped>
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
  .model_page {
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
  .model_title {
    padding-top: 37px;
    text-align: center;
  }
  .model_title span {
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
  .model_title img {
    float: right;
    margin-right: 38px;
  }
  .model_content {
    text-align: center;
    position: relative;
    padding-left: 24px;
    width: 92%;
    margin: 10px auto 0 auto;
  }
  .info_username_div{
    text-align: left;
    margin-bottom: 10px;
  }
  .model_content_textarea{
    background-color: #0A3D52;
    width: 99%;
    height: 100%;
    border: none;
    resize:none;
    outline:none;
    color: #AAC2CC;
    padding: 5px;
    margin: 5px;
  }
  .model_content p{
    font-size: 14px;
    color: #A0A8AE;
  }
  .model_content_bottom{
    width: 92%;
    clear: both;
  }
  .model_button{
    height: 36px;
    border: none;
    color: #0ddde5;
    font-size: 16px;
    float: left;
    margin-right: 10px;
  }
  .model_button_zc{
    background-image: url(../../../../assets/mapTrack/btn.png);
    background-repeat: no-repeat;
    width: 96px;
  }
  .model_button_zc:hover{
    background-image: url(../../../../assets/mapTrack/btn_on.png);
  }
  .model_button_zc:disabled{
    background-image: url(../../../../assets/mapTrack/btn_no.png);
  }
  .model_button_qx{
    background-image: url(../../../../assets/mapTrack/btn_qx.png);
    background-repeat: no-repeat;
    width: 75px;
  }
  .model_button_qx:hover{
    background-image: url(../../../../assets/mapTrack/btn_qx_on.png);
  }
  .model_button_qx:disabled{
    background-image: url(../../../../assets/mapTrack/btn_qx_no.png);
  }
  .model_content_left {
    width: 68%;
    float: left;
  }
  .model_content_right {
    width: 30%;
    float: right;
  }
  /* 查看当前未处置的所有事件 */
  .event_all_div{
    margin-bottom: 10px;
    border-bottom: 1px solid #1A3346;
    min-height: 145px;
    cursor: pointer;
  }
  #event_all_model .model_content{
    height: 380px;
  }
  .scroll::-webkit-scrollbar {
    display: none;
    overflow-y: auto;
    height: 312px;
  }
  .text_ellipsis{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    max-width: 250px;
    min-width: 150px;
  }
  .floatleft1{
    float: left;
    width: calc(100% - 140px);
  }
  .floatleft{
    float: left;
  }
  .floatright{
    float: right;
  }
  /* 切换预案model */
  .model_pageheight {
    height: 600px;
    background-size: 840px 600px;
  }
  .planSwitch_input{
    height: 30px;
    width: 250px;
    background-color: #0A3D52;
    color: #A0A8AE;
    border: 1px solid #11899E;
    margin-right: 10px;
  }
  .planSwitch_btn{
    height: 30px;
    background-size: 75px 30px;
    width: 75px;
  }
  #planSwitch_model .info_username_div{
    width: 100%;
    display: inline-block;
  }
  .pagelist{
    width: 100%;
    display: inline-block;
    color: #A8B2B9;
    text-align: center;
  }
  .pagelist span{
    margin: 5px;
    cursor: pointer;
  }
  .pagelist span:hover,.pagelist .pagehover{
    color: #09AFBB;
  }
  #planSwitch_model .model_content_bottom{
    width: 100%;
    clear: both;
  }
  .xuhao{
    width: 50px;
    display: inline-block;
    text-align: center;
  }
  #input22::-webkit-input-placeholder {
    color: #655A44;
  }
  #input22::-moz-placeholder{
    color: #655A44;
  }
  #input22:-ms-input-placeholder{
    color: #655A44;
  }
  .info_username{
    font-size: 16px;
    color: #0ddde5;
  }
  .detail_info_username{
    font-size: 14px;
    color: #A0A8AE;
    margin: 10px 10px 10px 0px;
  }
  .table{
    color: #fff;
    width: 95%;
  }
  .table ul{
    width: 100%;
    clear: both;
    min-height: 30px;
  }
  .table_body{
    height: 250px;
    overflow-y: auto;
    width: 100%;
  }
  .table_body::-webkit-scrollbar {
    display: none;
  }
  .table_body ul{
    float: left;
  }
  .table li{
    list-style: none;
    float: left;
    /*margin: 5px 20px;*/
  }
  .pointer{
    cursor:pointer;
  }
</style>
