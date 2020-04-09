<template>
  <div>
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
    <div class="search-input search-table">
      <div class="event-title">
        <div @click="clickButton(4)" class="search-title-2">
          <label :class="{'search-title-1-active':eventFlag == 4?true:false}">危化品</label>
        </div>
        <div @click="clickButton(5)" class="search-title-2">
          <label :class="{'search-title-1-active':eventFlag == 5?true:false}">专家库</label>
        </div>
        <div @click="clickButton(6)" class="search-title-2">
          <label :class="{'search-title-1-active':eventFlag == 6?true:false}">案例库</label>
        </div>
      </div>
      <div v-if="eventFlag == 4" class="search-decision">
        <input type="text" v-model="whpName" @keyup.enter="getCargoListByWhpName()" class="search-decision-active" placeholder="搜索关键字"/>
        <div @click="getCargoListByWhpName()" class="img-type">
          <img src="../../../../../assets/mapTrack/search2.png"/>
        </div>
      </div>
      <div v-if="eventFlag == 5" class="search-decision">
        <input type="text" v-model="expertsName" @keyup.enter="getExpertsListByName()" class="search-decision-active" placeholder="搜索关键字"/>
        <div @click="getExpertsListByName()" class="img-type">
          <img src="../../../../../assets/mapTrack/search2.png"/>
        </div>
      </div>
      <div v-if="eventFlag == 6" class="search-decision">
        <input type="text" v-model="relatedCompany" @keyup.enter="getCaseBankListByEventType()" class="search-decision-active" placeholder="搜索关键字"/>
        <div @click="getCaseBankListByEventType()" class="img-type">
          <img src="../../../../../assets/mapTrack/search2.png"/>
        </div>
      </div>
      <div class="event-context">
        <table v-show="eventFlag == 4">
          <tr v-for="item in cargo">
            <td>{{item}}&nbsp;&nbsp;&nbsp;&nbsp;<!--<span style="color: #ffe400;">{{item.whpCharacter}}</span>-->
              <span><a class="decision-a" target="_blank" :href="'http://whpgylxt.iasoco.com/#/productInfoNoLogin?name=' + item">安全周知卡</a></span>
              <span><a class="decision-a" target="_blank" :href="'http://whpgylxt.iasoco.com/#/productInfoNoLogin?name=' + item">MSDS</a></span>
            </td>
          </tr>
        </table>
        <table class="decision-table-2" v-show="eventFlag == 5">
          <tr v-for="(item, index) in experts">
            <td style="cursor: pointer;">
              <a style="color: white;" @click="showExpertsDetails(index)">{{item.name}}</a>&nbsp;&nbsp;<img  @click="singleCall(item.phone)" class="decision-img" src="../../../../../assets/mapTrack/call_white.png"/>
              <span style="color: #ffe400;" @click="showExpertsDetails(index)">{{item.category}}</span>
              <span style="color: #bc9166;" @click="showExpertsDetails(index)">专家类别：</span>
              <p>
                {{item.mark}}
              </p>
            </td>
          </tr>
        </table>
        <table class="decision-table-3" v-show="eventFlag == 6">
          <tr v-for="(item, index) in caseList">
            <td>
              {{item.relatedCompany}}{{handleEventType(item.eventType)}}<br>
              <span style="color: #bc9166;">案例类别：</span><span style="color: #ffe400;">{{handleEventType(item.eventType)}}</span>
              <span @click="showCaseBankDetails(index)"><a class="decision-a">查看详情</a></span><br/>
              <span style="color: #bc9166;">事发时间：</span><span style="color: #ffe400;">{{item.happenTime}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="(cargo.length == 0 && eventFlag== 4) || (experts.length == 0 && eventFlag== 5) || (caseList.length == 0 && eventFlag== 6)" class="resource-null">
        <span>暂无信息</span>
      </div>
    </div>
    <div v-show="showFlag == 1" class="experts-detalis">
      <div class="details-close">
        <img @click="closeDetails()" src="../../../../../assets/mapTrack/close.png">
      </div>
      <div class="details-context">
        <table>
          <tr>
            <td>专家姓名：{{expertsObj.name}}</td>
            <td>联系方式：{{expertsObj.phone}}</td>
          </tr>
          <tr>
            <td>类别：{{expertsObj.categpry}}</td>
            <td>学历：{{handleLevel(expertsObj.level)}}</td>
          </tr>
          <tr>
            <td colspan="2">专业：{{expertsObj.professional}}</td>
          </tr>
          <tr style="height: 150px;">
            <td colspan="2">简介：{{expertsObj.mark}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-show="showFlag == 2" class="experts-detalis">
      <div class="details-close">
        <img @click="closeDetails()" src="../../../../../assets/mapTrack/close.png">
      </div>
      <div class="details-context">
        <table>
          <tr>
            <td>事故企业名称：{{caseBankObj.relatedCompany}}</td>
            <td>事件类型：{{handleEventType(caseBankObj.eventType)}}</td>
          </tr>
          <tr>
            <td>事发时间：{{caseBankObj.happenTime}}</td>
            <td>事发地点：{{caseBankObj.happenAddress}}</td>
          </tr>
          <tr>
            <td colspan="2">事件详情：{{caseBankObj.accidentDetails}}</td>
          </tr>
          <tr>
            <td colspan="2">伤亡情况：{{caseBankObj.casualties}}</td>
          </tr>
          <tr>
            <td colspan="2">相关危化品：{{caseBankObj.chemicals}}</td>
          </tr>
          <tr>
            <td colspan="2">事故救援评价：{{caseBankObj.evaluation}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getExpertsListByName, getCaseBankListByEventType } from '@/api/emergency'
export default {
  props: ['chemical1'],
  data () {
    return {
      loadFlag: false,
      eventFlag: 4,
      cargo: [],
      experts: [],
      caseList: [],
      whpName: '',
      expertsName: '',
      relatedCompany: '',
      token: '8244f664dede72f9af64c8a5e98bbf265563e8df86dcc8829cbc31b9247f1c91',
      expertsObj: {
        name: '',
        phone: '',
        professional: '',
        level: '',
        categpry: '',
        mark: ''
      },
      caseBankObj: {
        relatedCompany: '',
        eventType: '',
        happenTime: '',
        happenAddress: '',
        accidentDetails: '',
        casualties: '',
        chemicals: '',
        evaluation: ''
      },
      showFlag: 0,
      chemical: this.chemical1
    }
  },
  mounted () {
    var self = this
    self.getCargoListByWhpName()
  },
  methods: {
    singleCall: function (phoneNum) {
      this.$emit('singleCall', phoneNum)
    },
    // 选中要显示的内容
    clickButton: function (type) {
      if (type === 4) {
        this.getCargoListByWhpName()
      } else if (type === 5) {
        this.getExpertsListByName()
      } else {
        this.getCaseBankListByEventType()
      }
      this.eventFlag = type
    },
    // 获取危化品信息
    getCargoListByWhpName: function () {
      this.cargo = []
      if (this.chemical !== '') {
        var cargoList = this.chemical.split(';')
        if (this.whpName !== '') {
          for (var i = 0; i < cargoList.length; i++) {
            if (cargoList[i].indexOf(this.whpName) >= 0) {
              this.cargo.push(cargoList[i])
            }
          }
        } else {
          this.cargo = cargoList
        }
      }
      // var self = this
      // getCargoListByWhpName({ whpName: self.whpName,token: self.token }).then(res => {
      //   self.cargo = res.data
      // }).catch(err => {
      //   self.error(err)
      //   console.log(err)
      // })
    },
    // 获取专家信息
    getExpertsListByName: function () {
      var self = this
      getExpertsListByName({ name: self.expertsName, token: self.token }).then(res => {
        self.experts = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取案例库信息
    getCaseBankListByEventType: function () {
      var self = this
      getCaseBankListByEventType({ accidentFirmName: self.relatedCompany, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.caseList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showExpertsDetails: function (index) {
      this.expertsObj = this.experts[index]
      this.showFlag = 1
    },
    showCaseBankDetails: function (index) {
      this.caseBankObj = this.caseList[index]
      this.showFlag = 2
    },
    closeDetails: function () {
      this.showFlag = 0
    },
    handleEventType: function (type) {
      if (type === '1') {
        return '火灾'
      } else if (type === '2') {
        return '旱灾'
      } else {
        return '水灾'
      }
    },
    handleLevel: function (level) {
      if (level === 1) {
        return '本科'
      } else if (level === 2) {
        return '硕士'
      } else if (level === 3) {
        return '博士'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
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
  /* ---- */
  .search-input{
    position: absolute;
    width: 90px;
    top: 453px;
    left: 180px;
    z-index: 99;
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
    height: 40px;
    border-bottom: solid 1px #806E4A;
  }
  .search-title-2{
    float: left;
    width: 33.3333%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
  }
  .search-title-2 label{
    cursor: pointer;
  }
  .search-title-1-active{
    padding-bottom: 10px;
    border-bottom: solid 3px #FFAF14;
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
  .event-context{
    width: 92%;
    float: right;
    margin-top: 10px;
    color: white;
    height: 380px;
    overflow: auto;
  }
  .event-context::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .event-context::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #FFAF14;
  }
  .event-context::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #52390A;
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
  .decision-a{
    float: right;
    margin-right: 10px;
    border: solid 1px #ffaf14;
    color: #ffaf14;
    padding: 3px;
    border-radius: 4px;
    height: 22px;
    line-height: 14px;
    text-decoration: none;
  }
  .decision-table-2 tr td{
    padding: 5px 10px;
  }
  .decision-table-2 tr td span{
    float: right;
    font-size: 14px;
  }
  .decision-table-2 tr td p{
    margin-top: 9px;
    font-size: 14px;
  }
  .decision-img{
    width: 14px;
    height: 14px;
  }
  .decision-table-3 tr td span{
    font-size: 14px;
  }
  .experts-detalis{
    position: absolute;
    top: 300px;
    left: 50%;
    margin-left: -300px;
    z-index: 99;
    background: url("../../../../../assets/mapTrack/window1.png") no-repeat scroll right center transparent;
    background-size: 100% 100%;
    width: 600px;
    height: 320px;
  }
  .experts-detalis table{
    margin-top: 30px;
    margin-left: 40px;
    width: 90%;
    height: 250px;
    text-align: left;
    color: white;
    border: none;
  }
  .experts-detalis td{
    width: 50%;
    border-bottom: none;
  }
  .details-close{
    float: right;
    margin-top: 20px;
    margin-right: 30px;
    cursor: pointer;
  }
  .details-context{
    width: 90%;
    height: 280px;
    margin-top: 30px;
    overflow: auto;
  }
  .details-context::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .details-context::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0fafc6;
  }
  .details-context::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #094a53;
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
