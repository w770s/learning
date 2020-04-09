<template>
  <div class="info">
    <span class="alarm-word">处理信息</span>
    <div class="alarm-content" style="padding: 10px 5px; width: 100%; height:90%; margin-top: 10px;">
      <ul id="alarmInfoTab" class="nav nav-tabs" style="width: 90%;">
        <li :class="{'active':activeFlag == 0?true:false}">
          <a data-toggle="tab" @click="turnAlarmStatus(0)">
            待处理(<span>{{ dealNum }}</span>)
          </a>
        </li>
        <li :class="{'active':activeFlag == 1?true:false}">
          <a data-toggle="tab" @click="turnAlarmStatus(1)">
            已处理
          </a>
        </li>
      </ul>
      <div class="alarm-tables">
        <div class="fl20_search">
          <span class="alarm-title">所属企业</span>
          <span>
            <input type="text" class="alarm-input" placeholder="请输入"
                   v-model="alarmSearchParam.relevantEnterprise">
          </span>
        </div>
        <div class="fl20_search">
          <span class="alarm-title">报警级别</span>
          <span>
            <select type="text" class="alarm-input" v-model="alarmSearchParam.alarmType">
              <option value="">请选择</option>
              <option value="1">一级警情</option>
              <option value="2">二级警情</option>
              <option value="3">三级警情</option>
            </select>
          </span>
        </div>
        <div class="fl20" style="padding: 31px; float: right;">
          <span>
            <span class="reset-alarm" @click="resetSearch()"></span>
            <span class="search-alarm" style="margin-right:20px;" @click="searchAlarmList()"></span>
          </span>
        </div>
      </div>
      <div class="alarm-table">
        <table class="table alarm-info-table">
          <tr>
            <th>序号</th>
            <th>终端编号</th>
            <th>终端名称</th>
            <th>终端类型</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>所在单位</th>
            <th>报警级别</th>
            <th>报警时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          <template v-for="(item, index) in alarmDataList">
            <tr :key="index">
              <td>{{(alarmSearchParam.page - 1) * alarmSearchParam.rows + (index+1)}}</td>
              <td>{{isNull(item.trmlBaseId)}}</td>
              <td>{{isNull(item.trmlName)}}</td>
              <td>{{isNull(item.trmlTypeName)}}</td>
              <td>--</td>
              <td>--</td>
              <td>{{isNull(item.placeCoName)}}</td>
              <td>{{isType(item.alarmLevel)}}</td>
              <td>{{isNull(item.alarmDate)}}</td>
              <td><span id="alarm_status">{{isStatus(item.dealCd)}}</span></td>
              <td>
                <span v-show="item.dealCd == 0" style="position:relative;cursor:pointer;" @click="showIsValid(index)" title="处理">
                  <img src="../../../../../assets/mapTrack/deal_button.png" style="width: 64px; height: 30px;">
                  <span class="isValidOrNot" v-show="activeIndex===index">
                    <span class="valid-span" @click="saveAlarm(1)">
                      <span class="point_valid"></span>
                      有效警情
                    </span>
                    <span class="valid-span" style="margin-top: 0;" @click="saveAlarm(0)">
                      <span class="point_invalid"></span>
                      无效警情
                    </span>
                  </span>
                </span>
                <span style="cursor:pointer; margin-left: 10px;" @click="searchAlarmInfoDetail(index)" title="详情">
                  <img src="../../../../../assets/mapTrack/detail_button.png" style="width: 64px; height: 30px;">
                </span>
              </td>
            </tr>
          </template>
        </table>
        <div style="float: right;margin-top: 10px">
          <template>
            <Page :total="total" show-total show-elevator @on-change="pagechange" />
          </template>
        </div>
        <detail ref='detail' @closeDetail="closeDetail" v-show="detailsShowTag == 1" ></detail>
      </div>
    </div>
  </div>
</template>

<script>
import detail from './infoDetail'
import { getMonitorList } from '@/api/emergency'
import $ from 'jquery'
export default {
  data () {
    return {
      isValidOrNot: 0,
      dealNum: 0,
      activeFlag: 0,
      alarmDataList: [],
      show: false,
      alarmSearchParam: {
        page: 1, // 当前页
        rows: 10, // 每页数量
        relevantEnterprise: '', // 所属企业
        alarmType: '', // 报警级别
        status: 0 // 状态
      },
      total: 0,
      alarmTotalPage: 1,
      display: 10, // 每页显示条数
      current: 1, // 当前的页数
      activeIndex: -1,
      detailsShowTag: 0
    }
  },
  mounted () {
    // 登录后台系统
    this.searchAlarmList()
  },
  methods: {
    isStatus: function (data) {
      if (data === '0') {
        $('span #alarm_status').css('color', '#FFAF14')
        return '未处理'
      } else if (data === '1') {
        $('span #alarm_status').css('color', '#FFAF14')
        return '已处理'
      } else {
        return '--'
      }
    },
    isNull: function (data) {
      if (data === '' || data == null) {
        return '--'
      } else {
        return data
      }
    },
    isType: function (data) {
      if (data === '1') {
        return '一级警情'
      } else if (data === '2') {
        return '二级警情'
      } else if (data === '3') {
        return '三级警情'
      }
    },
    jumpPage: function (num) {
      var self = this
      self.alarmSearchParam.page = num
      self.searchAlarmList()
    },
    turnAlarmStatus: function (num) {
      var self = this
      if (num === 0) {
        self.activeFlag = 0
      }else{
        self.activeFlag = 1
      }
      self.alarmSearchParam.status = num
      self.searchAlarmStatus = num
      self.researchAlarmList(num)
    },
    resetSearch: function () {
      var self = this
      self.alarmSearchParam.trmlBaseId = ''
      self.alarmSearchParam.alarmType = ''
      self.alarmSearchParam.status = 0
      self.alarmSearchParam.relevantEnterprise = ''
      self.researchAlarmList(0)
    },
    researchAlarmList: function (dealCd) {
      this.alarmSearchParam.page = 1
      this.searchAlarmList(dealCd)
    },
    searchAlarmList: function () {
      var self = this
      self.alarmDataList = []
      this.$emit('ajaxLoad')
      getMonitorList({ trmlFieldName: '环保', pageIndex: self.alarmSearchParam.page, pageSize: self.alarmSearchParam.rows, dealCd: self.alarmSearchParam.status }).then(res => {
        this.$emit('ajaxLoadClose')
        if (res.code === 0) {
          var data = res.data
          self.alarmDataList = data.list
          if(self.alarmSearchParam.status === 0) {
            self.dealNum = data.count
          }
          self.total = data.count
          self.alarmTotalPage = data.pageTotal
        } else {
          this.$Message.warning('数据查询失败')
        }
      }).catch(err => {
        this.$emit('ajaxLoadClose')
        console.log(err)
      })
    },
    pagechange: function (currentPage) {
      var self = this
      self.alarmSearchParam.page = currentPage
      self.searchAlarmList()
      // ajax请求, 向后台发送 currentPage, 来获取对应的数据
    },
    searchAlarmInfoDetail: function (index) {
      var self = this
      self.detailsShowTag = 1
      this.$refs.detail.searchMonitorDetail(self.alarmDataList[index].id)
    },
    showIsValid: function (index) {
      if (this.activeIndex === index) {
        this.activeIndex = -1
      } else {
        this.activeIndex = index
      }
    },
    saveAlarm: function (num) {

    },
    closeDetail: function () {
      this.detailsShowTag = 0
    }
  },
  components: {
    'detail': detail
  }
}
</script>

<style lang="less" scoped>
  ul,li{
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .info{
    position: absolute;
    margin-left: 180px;
    margin-top: 130px;
    top: -15px;
    width: 1688px;
    height: 982px;
    background-image: url("../../../../../assets/mapTrack/alarm_info_bg.png");
    background-repeat: no-repeat;
    overflow-y:auto ;
    .alarm-word {
      display: block;
      margin-left: 35px;
      line-height: 35px;
      font-size: 16px;
      color: #0DDDE5;
    }
    .alarm-content{
      width: 888px;
      height: 720px;
      margin-top: 20px;
      clear: both;
      padding: 10px 40px;
      padding-top: 0;
      overflow: auto;
      .alarm-tables{
        width: 1688px;
        margin-top: 20px;
        clear: both;
        padding: 10px 40px;
        padding-top: 0;
        overflow: auto;
        .fl20_search{
          float: left;
          width: 20%;
          height: 65px;
          margin-right: 25px;
          .alarm-title{
            float: left;
            width: 100%;
            line-height: 32px;
            color: #0DDDE5;//0DF6FF
          }
        }
        .fl20{
          float: left;
          width: 20%;
          height: 65px;
        }
      }
      .alarm-table {
        padding: 10px 40px;
        margin-top: 20px;
        .alarm-info-table th {
          padding: 8px;
          color: #ffffff;
          background-color: #0A3D52;
          text-align: center;
          font-weight:bold;
          height: 44px;
        }
        .alarm-info-table td {
          padding: 8px;
          color: #ffffff;
          text-align: center;
          height: 44px;
        }
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
  .alarm-input{
    width: 302px;
    height: 32px;
    padding: 0 8px;
    border-width: 1px;
    border-color: #0DDDE5;
    outline-color: #16ADC1;
    color: #fff;
    background-color: #0A3D52;
  }
  .alarm-input::-webkit-input-placeholder { /* WebKit browsers */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  //firefox火狐浏览器
  .alarm-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  .alarm-input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  //IE浏览器
  .alarm-input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: rgba(255,255,255,.25);
    font-size:14px;
  }
  .nav-tabs li,
  .nav-tabs li a{
    display: inline-block;
    padding: 10px;
  }
  .nav-tabs {
    padding-left: 30px;
    border-bottom: 1px solid #0A3D52;
  }
  .nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover {
    color: #0DDDE5;
    background-color: #042035;
    border: 0px solid #ddd;
    border-bottom: 3px solid #0DDDE5;
  }
  .nav-tabs>li>a {
    color: #A7B1B8;
    background-color: #042035;
    border: 0px solid #ddd;
  }
  .nav-tabs>li>a:focus, .nav-tabs>li0>a:hover {
    color: #0DDDE5;
    background-color: #042035;
    border: 0px solid #ddd;
  }
  .reset-alarm{
    float: right;
    width: 75px;
    height: 36px;
    background-image: url("../../../../../assets/mapTrack/reset_button.png");
    background-repeat: no-repeat;
    cursor: pointer;
  }
  table{
    width: 100%;
    border-spacing: 0;
  }
  table.table tr td {
    padding: 5px;
  }
  .search-alarm{
    float: right;
    width: 75px;
    height: 36px;
    background-image: url("../../../../../assets/mapTrack/search_button.png");
    background-position: -16px -16px;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .isValidOrNot{
    position: absolute;
    right: -19px;
    top: 24px;
    width: 96px;
    height: 80px;
    background-image: url("../../../../../assets/mapTrack/isValidOrNot.png");
    background-repeat: no-repeat;
    z-index: 10;
    /*cursor: pointer;*/
    .valid-span{
      display: block;
      height: 35px;
      margin-top: 15px;
      .point_valid{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #FFAF14;
      }
      .point_invalid{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #C4C4C4;
      }
    }
  }
</style>
