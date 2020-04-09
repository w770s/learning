<template>
  <div class="search-input search-table">
    <div v-show="loadFlag" class="loadDiv">
      <Row>
        <Col class="demo-spin-col" span="24">
          <Spin fix>
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>请等待...</div>
          </Spin>
        </Col>
      </Row>
    </div>
    <div class="event-title">
      <span class="title">信息发布</span>
    </div>
    <div class="search-decision">
      <input type="text" v-model="keyword" class="search-decision-active" placeholder="搜索关键字"/>
      <div @click="findMsgSubmittedList()" class="img-type">
        <img src="../../../../../assets/mapTrack/search2.png"/>
      </div>
    </div>
    <div class="event-context zdyxxbs">
      <table>
        <tr v-for="item in infoList">
          <td  @click="opendetailinfoPage(item.id)" class=" pointer">
            <span class="event-context-span">
              {{item.submittedContent}}
            </span>
            <span class="event-context-time" style="color: #bc9166;">
              {{spliceTime(item.createTime)}}
            </span>
          </td>
        </tr>
      </table>
      <div v-show="infoList.length == 0" class="resource-null">
        <span>暂无信息</span>
      </div>
      <div class="meeting-bottom">
        <span @click="openAddInfoPage()"><img src="../../../../../assets/mapTrack/add.png">发布信息</span>
      </div>
    </div>
    <!--信息报送-->
    <div class="model" v-show="addInfo">
      <div class="model-page">
        <div class="model-title">
          <span>信息发布</span>
          <img class="pointer" @click="closeAddInfoPaga()" src="../../../../../assets/mapTrack/close.png">
        </div>
        <div class="model-content">
          <div class="info-username-div">
            <span class="info-username">发布对象</span>
          </div>I
          <div class="info-username-div blueborder not-blueborder">
            <template>
              <div class="checkbox-head">
                <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">{{isCheckAll}}</Checkbox>
              </div>
              <CheckboxGroup v-model="infoData.submittedObj" @on-change="checkAllGroupChange">
                <template v-for="item in checkAllGroups">
                  <Checkbox :label= "item" ></Checkbox>
                </template>
              </CheckboxGroup>
            </template>
          </div>
          <div class="info-username-div">
            <span class="info-username">信息描述</span>
          </div>
          <div class="info-username-div blueborder">
            <textarea id="infodetails" class="model-content-textarea" v-model="infoData.submittedContent" rows="6" placeholder="请输入..."></textarea>
          </div>
          <div class="model-content-bottom">
            <button class="model-button model-button-zc" type="primary" @click="Addinfo()">发 布</button>
            <button class="model-button model-button-qx" type="primary" @click="closeAddInfoPaga()">取 消</button>
          </div>
        </div>
      </div>
    </div>
    <!--信息详情-->
    <div class="model" id="detail_info_page" v-show="detailInfo">
      <div class="model-page">
        <div class="model-title">
          <span>信息详情</span>
          <img class="pointer" @click="closedetailinfoPaga()" src="../../../../../assets/mapTrack/close.png">
        </div>
        <div class="model-content">
          <div class="detail_content1">
            <div class="info-username-div">
              <span class="info-username">报送人</span>
            </div>
            <div class="info-username-div">
              <span class="detail-info-username">{{submittedInfo.submittedUser}}</span>
            </div>
          </div>
          <div class="detail-content2">
            <div class="info-username-div">
              <span class="info-username">报送时间</span>
            </div>
            <div class="info-username-div">
              <span class="detail-info-username">{{spliceTime(submittedInfo.createTime)}}</span>
            </div>
          </div>
          <div class="info-username-div">
            <span class="info-username">报送对象</span>
          </div>
          <div class="info-username-div">
            <template v-for="item in userSelect">
              <span class="detail-info-username">{{item}}</span>
            </template>
          </div>
          <div class="info-username-div">
            <span class="info-username">报送内容</span>
          </div>
          <div class="info-username-div">
            <p>
              {{submittedInfo.submittedContent}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findMsgSubmittedList, findMsgSubmittedById, infoAdd } from '@/api/emergency'
export default {
  props: ['alarmId'],
  data () {
    return {
      token: this.$store.state.user.token,
      loadFlag: false,
      addInfo: false,
      detailInfo: false,
      /* 发布对象 */
      indeterminate: true,
      checkAll: false,
      isCheckAll: '全选',
      checkAllGroups: ['可变情报-设备编号', '微信', '对象名称'],
      /* 信息发布列表 */
      infoList: [],
      keyword: '',
      /* 信息发布 */
      submittedInfo: {},
      selectSubmitUsers: [],
      userSelect: [],
      infoData: {
        submittedUser: this.$store.state.user.userName,
        submittedObj: [],
        submittedContent: '',
        state: 2
      },
      localAlarmId: this.alarmId
      /* 信息发布end */
    }
  },
  mounted () {
    var self = this
    self.findMsgSubmittedList()
  },
  watch: {
    keyword: function () {
      var self = this
      self.findMsgSubmittedList()
    }
  },
  methods: {
    // 打开初始化状态标志
    ajaxLoad: function () {
      this.loadFlag = true
    },
    // 关闭初始化状态标志
    ajaxLoadClose: function () {
      this.loadFlag = false
    },
    // 打开信息发布页面
    openAddInfoPage: function () {
      this.infoData.submittedObj = []
      this.checkAll = false
      this.isCheckAll = '全选'
      this.infoData.submittedContent = ''
      this.addInfo = true
    },
    // 关闭信息报送页面
    closeAddInfoPaga: function () {
      this.addInfo = false
    },
    // 信息发布列表
    findMsgSubmittedList: function () {
      var self = this
      self.ajaxLoad()
      findMsgSubmittedList({ submittedContent: self.keyword, state: 2, alarmId: this.localAlarmId, token: self.token }).then(res => {
        self.ajaxLoadClose()
        if (res.resultCode.code === 1) {
          if (res.data.length > 0) {
            self.infoList = res.data
          }
        } else {
          self.$Message.warning('查询异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 信息发布列表详情
    findMsgSubmittedById: function (listId) {
      var self = this
      findMsgSubmittedById({ id: listId, token: self.token }).then(res => {
        self.ajaxLoadClose()
        if (res.resultCode.code === 1) {
          self.submittedInfo = res.data
          self.userSelect = []
          self.userSelect = res.data.submittedObj.split(',')
          // $('#detail_info_page').show()
          self.detailInfo = true
        } else {
          self.$Message.warning('查询异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 提交信息发布
    Addinfo: function () {
      var self = this
      // self.infoData.submittedObj = self.checkAllGroup
      if (self.infoData.submittedObj.length < 1) {
        self.$Message.warning('至少选择一个发布对象')
        return
      }
      if (self.infoData.submittedContent.length < 1) {
        self.$Message.warning('信息描述不能为空')
        return
      }
      infoAdd({ json: JSON.stringify(self.infoData), token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          // $('#add_info_page_out').hide()
          self.addInfo = false
          self.$Message.success('报送成功!')
          self.findMsgSubmittedList()
        } else {
          self.$Message.warning('发布异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 打开信息详情页面
    opendetailinfoPage: function (id) {
      this.findMsgSubmittedById(id)
    },
    // 关闭信息详情页面
    closedetailinfoPaga: function () {
      // $('#detail_info_page').hide()
      this.detailInfo = false
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        this.infoData.submittedObj = this.checkAllGroups
        this.isCheckAll = '取消全选'
      } else {
        this.infoData.submittedObj = []
        this.isCheckAll = '全选'
      }
    },
    checkAllGroupChange (data) {
      if (data.length === this.checkAllGroups.length) {
        this.indeterminate = false
        this.checkAll = true
        this.isCheckAll = '取消全选'
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
        this.isCheckAll = '全选'
      } else {
        this.indeterminate = false
        this.checkAll = false
        this.isCheckAll = '全选'
      }
    },
    //  截取时间
    spliceTime: function (time) {
      if (time === '' || time == null || time === 'undefined') {
        return '--'
      } else {
        return time.substr(0, 16)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /* 加载样式 */
  .loadDiv {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .ivu-row {
    height: 100%;
  }
  .demo-spin-col{
    height: 100%;
    position: relative;
    border: 1px solid #eee;
  }
  .ivu-spin-fix{
    background-color: rgba(255, 255, 255, 0.7);
  }
  .search-input{
    position: absolute;
    margin-left: 180px;
    margin-top: 400px;
    width: 90px;
  }
  .search-table{
    width: 336px;
    height: 500px;
    background-color: #52390A;
    border: 1px solid #FFAB67;
  }
  table{
    border-spacing: 0;
  }
  table tr td{
    border-bottom: 1px solid #806e4a;
  }
  .event-title{
    width: 100%;
    height: 50px;
    border-bottom: solid 1px #806E4A;
    span.title{
      display: inline-block;
      font-size: 16px;
      color: #fff;
      line-height: 50px;
      padding-left: 15px;
    }
  }

  .search-title-1{
    float: left;
    width: 50%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    font-size: 16px;
  }
  .search-title-1 label{
    padding: 0 5px;
  }
  .search-title-1-active{
    height: 40px;
    border-bottom: solid 3px #FFAF14;
  }
  .event-context{
    width: 92%;
    float: right;
    color: white;
  }
  .event-context table{
    width: 100%;
    font-size: 16px;
  }
  .event-context table tr{
    height: 71px;
    width: 100%;
    border-bottom: solid 1px #6E5931;
  }
  .event-context table tr td span{
    color: #9D814E;
  }
  .zdyxxbs{
    float: left;
    width: 99%;
    height: 341px;
    margin-top: 10px;
    overflow-y: auto;
    & tr:hover{
      background-color: #402D08;
    }
  }
  .zdyxxbs::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .zdyxxbs::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #FFAF14;
  }
  .zdyxxbs::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #52390A;
  }
  .pointer{
    cursor:pointer;
  }
  .event-context-span{
    width: 300px;
    font-size: 14px;
    color: #fff!important;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: 0 0 0 25px
  }
  .event-context-time{
    margin: 0 0 0 25px
  }
  .meeting-bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 0;
    text-align: center;
    border-top: 1px solid #ffaf14;
  }
  .meeting-bottom span {
    height: 16px;
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffaf14;
  }
  .meeting-bottom span:hover {
    cursor: pointer;
  }
  .meeting-bottom img {
    margin-right: 5px;
    margin-top: -2px;
  }
  .search-input1{
    position: absolute;
    margin-left: 230px;
    margin-top: -30px;
    width: 90px;
  }
  .search-decision{
    width: 90%;
    text-align: center;
    margin-top: 18px;
  }
  .search-decision input{
    color: #fff;
  }
  .img-type{
    position: absolute;
    display: inline-block;
    background-color: #322306;
    border-radius: 0 4px 4px 0 ;
    height: 36px;
    padding-top: 5px;
    cursor: pointer;
  }
  .search-decision-active{
    -web-kit-appearance:none;
    -moz-appearance: none;
    height: 36px;
    width: 273px;
    border:none;
    outline: none;
    background-color: #322306;
    border-radius: 4px 0 0 4px ;
    margin-left: 21px;
    padding: 10px;
    font-size: 14px;
  }
  .search-table{
    width: 336px;
    height: 500px;
    background-color: #52390A;
    border: 1px solid #FFAB67;
  }

  /*弹出层model*/
  .model {
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
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
    background: url("../../../../../assets/mapTrack/window1.png") no-repeat scroll right center transparent;
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
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #0ddde5;
    margin: 0 auto;
  }
  .model-title img {
    float: right;
    margin-right: 38px;
  }
  .model-content {
    text-align: center;
    position: relative;
    padding-left: 24px;
    width: 92%;
    margin: 10px auto 0 auto;
    overflow-y: auto;
  }
  .info-username-div{
    text-align: left;
    margin-bottom: 10px;
    color: #fff;
    .checkbox-head{
      padding-bottom: 6px;
      margin-bottom: 6px;
    }
    label{
      font-weight: 400;
      color: #bbc2c6;
    }
    span.ivu-checkbox-inner{
      border-color: #f00!important;
      background-color: #f00;
    }
  }
  .model-content-textarea{
    background-color: #0A3D52;
    width: 98%;
    height: 92%;
    border: none;
    resize:none;
    outline:none;
    color: #AAC2CC;
    padding: 5px;
    margin: 5px;
  }
  .model-content p{
    font-size: 14px;
    color: #A0A8AE;
  }
  .model-content-bottom{
    width: 92%;
    clear: both;
  }
  .model-button{
    height: 36px;
    border: none;
    color: #0ddde5;
    font-size: 16px;
    float: left;
    margin-right: 10px;
  }
  .model-button-zc{
    background-image: url(../../../../../assets/mapTrack/btn.png);
    background-repeat: no-repeat;
    width: 96px;
  }
  .model-button-zc:hover{
    background-image: url(../../../../../assets/mapTrack/btn_on.png);
  }
  .model-button-zc:disabled{
    background-image: url(../../../../../assets/mapTrack/btn_no.png);
  }
  .model-button-qx{
    width: 75px;
    color: #fff;
    background-image: url(../../../../../assets/mapTrack/btn_qx.png);
    background-repeat: no-repeat;
  }
  .model-button-qx:hover{
    background-image: url(../../../../../assets/mapTrack/btn_qx_on.png);
  }
  .model-button-qx:disabled{
    background-image: url(../../../../../assets/mapTrack/btn_qx_no.png);
  }

  .info-username{
    font-size: 16px;
    color: #0ddde5;
  }
  .info-prompt{
    font-size: 14px;
    color: #64737F;
    margin-left: 5px;
  }
  .blueborder{
    height: 150px;
    border:1px solid #0ddde5;
    background-color: #0A3D52;
    overflow-y: auto;
  }
  .zdyxxbs::-webkit-scrollbar,
  .model-content::-webkit-scrollbar,
  .blueborder::-webkit-scrollbar,
  .model-content-textarea::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .zdyxxbs::-webkit-scrollbar-thumb,
  .model-content::-webkit-scrollbar-thumb,
  .blueborder::-webkit-scrollbar-thumb,
  .model-content-textarea::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0fafc6;
  }
  .zdyxxbs::-webkit-scrollbar-thumb{
    background: #ffaf14;
  }
  .zdyxxbs::-webkit-scrollbar-track,
  .model-content::-webkit-scrollbar-track,
  .blueborder::-webkit-scrollbar-track,
  .model-content-textarea::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #094a53;
  }
  .zdyxxbs::-webkit-scrollbar-track{
    background: #322306;
  }
  .not-blueborder{
    background-color:transparent;
    border:none;
  }
  .blueborder::-webkit-scrollbar{
    display: none;
  }
  #add_distribution_group .blueborder{
    min-height: 255px;
  }
  .blueborder_input{
    min-height: 30px;
    border:1px solid #0ddde5;
    background-color: #0A3D52;
  }
  .info-user-div{
    margin: 10px 0px 0 10px;
    border: 1px solid #158199;
    float: left;
    padding: 2px 10px;
  }
  .info-user{
    color: #AAC2CC;
    padding: 0px 10px;
  }
  .info-user-close{
    cursor: pointer;
    position: relative;
    right: -6px;
  }
  /*信息详情*/
  .detail-info-username{
    font-size: 14px;
    color: #A0A8AE;
    margin: 10px 10px 10px 0px;
  }
  .detail-info-username img{
    margin-left: 10px;
  }
  #detail_info_page .model-content{
    padding-left: 50px;
  }
  #detail_info_page .info-username-div{
    padding-bottom: 5px;
  }
  .detail_content1{
    width: 50%;
    float: left;
  }
  .detail-content2{
    width: 50%;
    float: right;
  }
  .resource-null{
    position: absolute;
    top: 200px;
    height: 200px;
    width: 100%;
    color: white;
    text-align: center;
    line-height: 200px;
    font-size: 20px;
  }
</style>
