<template>
  <div class="search-input search-table">
    <div class="event-title">
      <div @click="clickButton(2)" class="search-title-1">
        <label @click="getEmergencySuppliesList()" :class="{'search-title-1-active':eventFlag == 2?true:false}">公共资源</label>
      </div>
      <div @click="clickButton(1)" class="search-title-1">
        <label @click="getEmergencyResourceList()" :class="{'search-title-1-active':eventFlag == 1?true:false}">企业资源</label>
      </div>
    </div>
    <div v-if="eventFlag == 2" class="search-decision">
      <input id="input11" @keyup.enter="getEmergencySuppliesList()" v-model="unitName" type="text" class="search-decision-active" placeholder="搜索关键字"/>
      <div @click="getEmergencySuppliesList()" class="img-type">
        <img src="../../../../../assets/mapTrack/search2.png"/>
      </div>
    </div>
    <div v-if="eventFlag == 1" class="search-decision">
      <input id="input22" type="text" @keyup.enter="getEmergencyResourceList()" v-model="resourceName" class="search-decision-active" placeholder="搜索关键字"/>
      <div @click="getEmergencyResourceList()" class="img-type">
        <img src="../../../../../assets/mapTrack/search2.png"/>
      </div>
    </div>
    <div class="event-context zdyxxbs">
      <table v-show="eventFlag == 2">
        <tr v-for="(item, index) in publicResource">
          <td>
            <div @click="showEmergencySupplies(index)" class="event_analysisdiv floatleft">{{item.unitName}}<br><span>{{item.firstContact}}({{item.firstPhone}})</span></div>
            <div class="call_yellow floatright"><img @click="singleCall(item.firstPhone)" src="../../../../../assets/mapTrack/call_yellow.png"></div>
          </td>
        </tr>
      </table>
      <table v-show="eventFlag == 1">
        <div class="search-decision" style="margin-top: 0px">
          <select @change="getEmergencyResourceList()" class="event_analysis_select" v-model="orgPid">
            <option v-for="item in parentOrgList" :value="item.creditCode">{{item.name}}</option>
          </select>
        </div>
        <tr v-for="(item, index) in enterpriseResources">
          <td>
            <div @click="showEmergencyResources(index)" class="event_analysisdiv floatleft">{{item.resourceName}} {{item.resourceCount}}{{item.resourceUnit}}<br>
              <span>{{item.contact}}({{item.mobile}})</span></div>
            <div class="call_yellow floatright"><img @click="singleCall(item.mobile)" src="../../../../../assets/mapTrack/call_yellow.png"></div>
          </td>
        </tr>
      </table>
    </div>
    <div v-show="(eventFlag == 1 && enterpriseResources.length == 0) || (eventFlag == 2 && publicResource.length ==0)" class="resource-null">
      <span>暂无资源</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getEmergencySuppliesListByDistance, getEmergencyResourceListByName, getCompanyPreList } from '@/api/emergency'
import BMap from 'BMap'
import callBlue from '@/assets/mapTrack/call_blue.png'
export default {
  props: ['distance', 'latitude', 'longitude'],
  data () {
    return {
      token: this.$store.state.user.token,
      eventFlag: 2,
      publicResource: [],
      enterpriseResources: [],
      unitName: '',
      resourceName: '',
      parentOrgList: [],
      orgPid: -1,
      lat: 0,
      lng: 0,
      images: {
        callBlue: callBlue
      }
    }
  },
  watch: {
    'distance': function () {
      if (this.eventFlag === 2) {
        this.getEmergencySuppliesList()
      } else {
        this.getCompanyOption()
        this.getEmergencyResourceList()
      }
    },
    'orgPid': function () {
      var self = this
      for (var i = 0; i < self.parentOrgList.length; i++) {
        if (self.orgPid === self.parentOrgList[i].creditCode) {
          self.lat = self.parentOrgList[i].latitude
          self.lng = self.parentOrgList[i].longitude
        }
      }
    }
  },
  mounted () {
    var self = this
    self.getEmergencySuppliesList()
    self.getCompanyOption()
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'handleLogOut'
    ]),
    // 选中要显示的内容
    clickButton: function (type) {
      this.eventFlag = type
    },
    getEmergencySuppliesList: function () {
      var self = this
      getEmergencySuppliesListByDistance({ unitName: self.unitName, distance: self.distance, latitude: self.latitude, longitude: self.longitude, token: self.token }).then(res => {
        self.publicResource = res.data
        self.$emit('showPublicResourceAtMap', self.publicResource)
      }).catch(err => {
        self.publicResource = []
        console.log(err)
      })
    },
    getEmergencyResourceList: function () {
      var self = this
      var searchParams = {
        resourceName: self.resourceName,
        orgPid: self.orgPid,
        token: self.token
      }
      getEmergencyResourceListByName(searchParams).then(res => {
        if (res.resultCode.code === 1) {
          self.enterpriseResources = res.data
          self.$emit('showCompanyResourceAtMap', self.enterpriseResources)
        } else {
          self.enterpriseResources = []
        }
      }).catch(err => {
        self.enterpriseResources = []
        console.log(err)
      })
    },
    getCompanyOption: function () {
      var self = this
      getCompanyPreList({ distance: self.distance, latitude: self.latitude, longitude: self.longitude, token: self.token }).then(res => {
        self.parentOrgList = res.data
        if (self.parentOrgList.length > 0) {
          self.orgPid = self.parentOrgList[0].creditCode
        } else {
          self.orgPid = -1
        }
      }).catch(err => {
        self.parentOrgList = []
        console.log(err)
      })
    },
    showEmergencySupplies: function (index) {
      var self = this
      var emergencySupplies = self.publicResource[index]
      var point = new BMap.Point(emergencySupplies.longitude, emergencySupplies.latitude)
      self.$emit('showEmergencySupplies', point, emergencySupplies)
    },
    singleCall: function (phoneNum) {
    // this.$refs.call.singleCall(phoneNum)
      this.$emit('singleCall', phoneNum)
    },
    showEmergencyResources: function (index) {
      var self = this
      var point = ''
      var enterpriseResource = self.enterpriseResources[index]
      var orgName = ''
      var orgAddress = ''
      for (var i = 0; i < self.parentOrgList.length; i++) {
        if (self.orgPid === self.parentOrgList[i].creditCode) {
          point = new BMap.Point(self.parentOrgList[i].longitude, self.parentOrgList[i].latitude)
          orgName = self.parentOrgList[i].name
          orgAddress = self.parentOrgList[i].orgAddress
        }
      }
      self.$emit('showEmergencyResources', point, enterpriseResource, orgName, orgAddress)
    }
  }
}
</script>

<style scoped>
  .search-input{
    position: absolute;
    width: 90px;
    top: 223px;
    left: 180px;
    z-index: 99;
  }
  .search-table{
    width: 336px;
    height: 500px;
    background-color: #52390A;
    border: 1px solid #FFAB67;
  }
  .event-title{
    width: 100%;
    height: 40px;
    border-bottom: solid 1px #806E4A;
  }
  .search-title-1{
    float: left;
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 20px;
  }
  .search-title-1 label{
    padding: 0 5px;
  }
  .search-title-1-active{
    border-bottom: solid 3px #FFAF14;
    color: #FFAF14;
  }
  .event-context{
    width: 92%;
    float: right;
    color: white;
    overflow-y: auto;
    max-height: 385px;
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
    border:none;
    outline: none;
    -web-kit-appearance:none;
    -moz-appearance: none;
    height: 36px;
    width: 273px;
    background-color: #322306;
    border-radius: 4px 0 0 4px ;
    margin-left: 21px;
    padding: 10px;
    font-size: 14px;
  }
  /* 输入框提示文字样式 */
  #input11::-webkit-input-placeholder {
    color: #655A44;
  }
  #input11::-moz-placeholder{
    color: #655A44;
  }
  #input11:-ms-input-placeholder{
    color: #655A44;
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
  .event_analysisdiv{
    margin: 0px 0px 0px 25px;
    cursor: pointer;
  }
  .call_yellow{
    margin: 10px 20px;
    cursor: pointer;
  }
  .event_analysis_select{
    width: 100%;
    margin-left: 21px;
    background-color: #322306;
    height: 30px;
    border: none;
    color: #FFAF14;
  }
  .floatleft{
    float: left;
  }
  .floatright{
    float: right;
  }
  .zdyxxbs{
    width: 100%;
    margin-top: 10px;
  }
  .zdyxxbs tr:hover{
    background-color: #402D08;
  }
  .pointer{
    cursor:pointer;
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
