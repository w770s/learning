<template>
  <div class="queue">
    <div>
      <div class="model_title">
        <span style="cursor: pointer;"
              @click="showCallOrPhone(1)">
          <font :class="{'call_title':queueFlag == 1?false:true}">{{queueNameLocal}}({{callList.length}})</font>
        </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span style="cursor: pointer;"
              @click="showCallOrPhone(2)">
          <font :class="{'call_title':queueFlag == 2?false:true}">通话记录</font>
        </span>
      </div>
      <div v-show="queueFlag == 1"
           class="model_content"
           style="height: 230px;">
        <template v-for="(item, index) in callList">
          <div v-if="item.state == 0"
               class="call_all_div">
            <div class="info_call_div">
              <div class="detail_info_call"
                   @click="openCall()">{{item.callingNum}}</div>
              <span class="ringing">振铃中</span><br>
              <span class="ringing"
                    @click="phonePullDown(index)">
                <!--<img src="../../../../assets/mapTrack/hang_on_small.png" width="16px" height="16px">-->
                <!--<font color="#0893A2"> 接听</font> |-->
                <img src="../../../../assets/mapTrack/hang_up_small.png"
                     width="20px"
                     height="20px">
                <font color="red"> 挂断</font>
              </span>
            </div>
          </div>
          <div v-if="item.state == 1"
               class="call_all_div">
            <div class="info_call_div">
              <div class="detail_info_call"
                   @click="openCall()">{{item.callingNum}}{{handleCalledNum(item.calledNum)}}</div>
              <span class="ringing">||| {{callTime}}</span><br>
              <span class="ringing"
                    @click="phonePullDown(index)">
                <!--<img src="../../../../assets/mapTrack/record.png" width="18px" height="18px">-->
                <!--<font color="#73838F"> 静音</font> |-->
                <img src="../../../../assets/mapTrack/hang_up_small.png"
                     width="18px"
                     height="18px">
                <font color="red"
                      @click="phonePullDown(index)"> 挂断</font>
              </span>
            </div>
          </div>
        </template>
      </div>
      <div v-show="queueFlag == 2"
           class="model_content"
           style="height: 230px;">
        <template v-for="(item, index) in callRecodesList">
          <div v-if="item.state == 1"
               class="call_all_div">
            <div class="info_username_div">
              <span class="detail_info_call">{{item.dialingNum}}{{handleCalledNum(item.calledNum)}}</span>
              <span class="no_call"
                    id="audio"
                    @click="playRecording(item.fileName)"><img src="../../../../assets/mapTrack/play_back.png"
                                                               width="16px"
                                                               height="16px">
              </span><br>
              <span class="detail_info_call">电话 {{item.callOutTime}}</span>
            </div>
          </div>
          <div v-else=""
               class="call_all_div">
            <div class="info_username_div">
              <span class="detail_info_call">{{item.dialingNum}}{{handleCalledNum(item.calledNum)}}</span>
              <span class="no_call">未接听</span><br>
              <span class="detail_info_call">电话 {{item.callOutTime}}</span>
            </div>
          </div>
        </template>
      </div>
      <div v-show="queueFlag == 2"
           class="model_content_bottom1">
        <a :href="$config.ecs + '/#/address-manage/call-log?token=' + token"
           target="_blank"
           style="font-size: 20px;color: #0BCED9;">点击查看更多</a>
      </div>
      <div v-show="(callList.length == 0 && queueFlag == 1) || (callRecodesList.length == 0 && queueFlag == 2)"
           class="model_content noinfo1"
           style="display: none;">
        <span>暂无信息</span>
      </div>
    </div>
    <div class="event_page event_page1">
      <div class="model_title model_title1">
        <span>当前事件</span><span>({{eventsList.length}})</span>
        <span v-if="currentOrAllEvent == 1"
              class="closeimg"
              @click="switch_Event_Paga()"></span>
        <span v-if="currentOrAllEvent == 2"
              class="closeimg closeimgshu"
              @click="switch_Event_All_Paga()"></span>
      </div>
      <div v-if="currentOrAllEvent == 1"
           class="model_content">
        <div class="info_username_div">
          <span class="detail_info_username">警情类型：</span>
          <span class="detail_info_des red">{{alarmType(eventObj.alertType)}}</span>
        </div>
        <div class="info_username_div">
          <span class="detail_info_username">事件状态：</span>
          <span class="detail_info_des">{{status(eventObj.status)}}</span>
        </div>
        <div class="info_username_div">
          <span class="detail_info_username">事发地点：</span>
          <span class="detail_info_des">{{eventObj.theAddress}}</span>
        </div>
        <div class="info_username_div">
          <span class="detail_info_username">相关企业：</span>
          <span class="detail_info_des">{{eventObj.relevantEnterprise}}</span>
        </div>
        <div class="info_username_div"
             v-show="carsListLen > 0">
          <span class="detail_info_username">涉及车辆：</span>
          <template v-for="(item,index) in carNameList">
            <span class="detail_info_des"
                  :class="{ 'ml75':index == 0 ? false:true}"
                  :key="item.id">
              <span class="alarm-tool"
                    :key="item.id">{{item.plateNumber}}</span>
              <span class="alarm-img alarm-location"
                    @click="mapCarShipPoint(item.aisLongitude, item.aisLatitude, item.plateNumber, 1)"></span>
            </span>
          </template>
        </div>
        <div class="info_username_div"
             v-show="shipsListLen > 0">
          <span class="detail_info_username">涉及船舶：</span>
          <template v-for="(item, index) in shipNameList">
            <span class="detail_info_des"
                  :class="{ 'ml75':index == 0 ? false:true}"
                  :key="item.id">
              <span class="alarm-tool"
                    :key="item.id">{{item.shipName}}</span>
              <span class="alarm-img alarm-location"
                    @click="mapCarShipPoint(item.aisLongitude, item.aisLatitude, item.shipName, 0)"></span>
            </span>
          </template>
        </div>
        <div class="info_username_div">
          <span class="detail_info_username">报警人：</span>
          <span class="detail_info_des">{{eventObj.policeMan}}&nbsp;&nbsp;({{eventObj.contactNumber}})
            &nbsp;<span style="cursor: pointer;"
                        @click="singleCall(eventObj.contactNumber)"><img class="pointer"
                                                                         src="../../../../assets/mapTrack/call_blue.png"></span>
          </span>
        </div>
        <div class="info_username_div">
          <span class="detail_info_username">人员情况：</span>
          <span class="detail_info_des"
                :class="{ 'second-level':eventObj.hurtAlarm == '造成（危及）三人以下人员伤亡' ? true:false, 'third-level':eventObj.hurtAlarm == '造成（危及）三人以上人员伤亡' ? true:false}">{{eventObj.hurtAlarm}}</span>
        </div>
        <div class="info_username_div">
          <span class="detail_info_username">污染情况：</span>
          <span class="detail_info_des"
                :class="{ 'second-level':eventObj.pollutionAlarm == '造成轻微污染' ? true:false, 'third-level':eventObj.pollutionAlarm == '危化品重特大生产安全事件' ? true:false}">{{eventObj.pollutionAlarm}}</span>
        </div>
        <div class="info_username_div">
          <span class="detail_info_username">事件详情：</span>
          <span class="detail_info_des">
            {{eventObj.remark}}
          </span>
        </div>
        <div class="info_username_div"
             v-show="eventObj.status === '1' && eventObj.emergencyPlanName !== null && eventObj.emergencyPlanName!== ''">
          <span class="detail_info_username">应急预案：</span>
          <span class="detail_info_des">
            {{eventObj.emergencyPlanName}}
            <span class="edit-btn"
                  @click="start_emergency">【编辑】</span>
          </span>
        </div>
      </div>
      <div v-if="currentOrAllEvent == 1"
           class="model_content_bottom">
        <button class="model_button model_button_zc"
                v-show="eventObj.status === '0'"
                type="primary"
                @click="start_emergency">启动应急</button>
        <button class="model_button model_button_zc"
                v-show="eventObj.status === '1'"
                type="primary"
                @click="completed_disposal()">完成处置</button>
      </div>
      <div v-if="currentOrAllEvent == 2"
           class="model_content">
        <template v-for="(item, index) in eventsList">
          <div class="event_all_div"
               :key="item.id"
               @click="openAlarmMenu(index)">
            <div class="info_username_div">
              <span class="detail_info_username">事件编号：</span>
              <span class="detail_info_des red">{{item.id}}</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">警情类型：</span>
              <span class="detail_info_des red">{{alarmType(item.alertType)}}</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事件状态：</span>
              <span class="detail_info_des">{{status(item.status)}}</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">事发地点：</span>
              <span class="detail_info_des">{{item.theAddress}}</span>
            </div>
            <div class="info_username_div">
              <span class="detail_info_username">相关企业：</span>
              <span class="detail_info_des">{{item.relevantEnterprise}}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="model_content noinfo2"
           v-if="currentOrAllEvent == 3"
           style="height: 100px;">
        <img src="../../../../assets/mapTrack/event_noinfo.png"><br>
        <span>暂无事件信息</span>
      </div>
    </div>
    <Modal v-model="audiomodal"
           width="600">
      <p slot="header"
         style="text-align:left;">
        <span>录音播放</span>
      </p>
      <div style="text-align:center">
        <audio :src="filename"
               ref="audio"
               controls></audio>
      </div>
      <div slot="footer">
        <Button size="small"
                type="primary"
                @click="close">
          确定
        </Button>
      </div>

    </Modal>
    <!--<call ref='call' v-bind:is="components.call"></call>-->
  </div>
</template>

<script>
import Vue from 'vue'
import { getPhonePullDown, getAlarmNoStatusList, findCallRecordsAll, getShipsList, getCarsList, getCarMarker, getShipMarker, updateAlarmEvents, getEmergencyPlanById } from '@/api/emergency'
export default {
  props: ['queueName'],
  data () {
    return {
      token: this.$store.state.user.token,
      userName: this.$store.state.user.userName,
      queueFlag: 1,
      callList: [],
      currentOrAllEvent: 2,
      callStatus: 1,
      dangerSource: {
        company: '东恒石化有限公司',
        eventType: '泄露',
        eventAddress: '浙江省嘉兴港区乍浦经济开发区雅山西路555号',
        eventTime: '2018-06-01 03:30',
        contact: '陈翔',
        contactPhone: '18088976675',
        eventDetails: '2018年5月23日上午10时许，位于江都区丁沟州环宇药物化工有限公司发生一起火灾，火灾波及区丁沟州环宇药物化工有限公司发生一起火灾'
      },
      // 当前事件列表
      eventsList: [],
      // 当前事件
      eventObj: {},
      eventIndex: -1,
      shipsListLen: 0,
      carsListLen: 0,
      shipNameList: [{
        shipName: '',
        id: '',
        aisLongitude: '',
        aisLatitude: ''
      }],
      carNameList: [{
        plateNumber: '',
        id: '',
        aisLongitude: '',
        aisLatitude: ''
      }],
      // 终点通道
      destchannels: '',
      channels: '',
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
      time: 0,
      callTime: '00:00:00', // 通话时间
      queueNameLocal: this.queueName,
      callRecodesList: [],
      callFlag: 0,
      startEmergencyFlag: 1,
      filename: '',
      audiomodal: false
    }
  },
  watch: {
    'queueName': function () {
      this.queueNameLocal = this.queueName
      this.getCallRecodesList()
    },
    'eventObj.emergencyPlanName': function () {
      if (this.eventObj.emergencyPlanName !== null && this.eventObj.emergencyPlanName !== '') {
        this.postEmergencyPlanById()
      }
    },
    'eventObj.id': function () {
      this.$emit('changeAlarmId', this.eventObj.id, this.eventObj.uniqueId)
    },
    'currentOrAllEvent': function () {
      this.$emit('changeCurrentOrAllEvent', this.currentOrAllEvent)
    }
  },
  mounted () {
    // alert(window.location.href.split('=')[1])
    this.alarmList()
    this.getCallRecodesList()
  },
  methods: {
    showCallOrPhone: function (type) {
      this.queueFlag = type
      if (type === 2) {
        this.getCallRecodesList()
      }
    },
    // 切换所有事件页面
    switch_Event_Paga: function () {
      this.currentOrAllEvent = 2
    },
    // 切换当前事件页面
    switch_Event_All_Paga: function () {
      this.currentOrAllEvent = 1
    },
    // 启动应急
    start_emergency: function () {
      this.$emit('showEmergencyPlan', this.eventObj)
    },
    // 完成处置
    completed_disposal: function () {
      var self = this
      self.$Modal.confirm({
        title: '是否完成处置？',
        width: 300,
        closable: false,
        okText: '确定',
        cancelText: '取消',
        loading: false,
        onOk () {
          self.eventObj.status = 2
          updateAlarmEvents({ evetsJson: JSON.stringify(self.eventObj), token: self.token }).then(res => {
            if (res.resultCode.code === 1) {
              self.$Message.success('预案完成处置')
              self.alarmList()
              self.currentOrAllEvent = 2
              self.$emit('closeDangerousSource')
            } else {
              self.$Message.warning('异常')
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    openAlarmMenu: function (index) {
      this.eventIndex = index
      this.eventObj = this.eventsList[index]
      this.currentOrAllEvent = 1
      this.shipNameList = []
      this.carNameList = []
      this.carsList(this.eventsList[index].id)
      this.shipsList(this.eventsList[index].id)
      this.$emit('openAlarmMenu', this.eventsList[index], 1)
      this.$emit('showDangerSource', this.eventObj)
    },
    // 显示车辆船舶
    mapCarShipPoint (longitude, latitude, name, num) {
      var self = this
      if (num === 0) {
        getShipMarker({ shipName: name, token: self.token }).then(res => {
          var data = res.data
          if (res.resultCode.code === 1) {
            if (data.longitude) {
              self.$emit('mapCarShipPoint', data.longitude, data.latitude, name, 'ship')
            }
          } else {
            self.$Message.warning('无此船具体信息!')
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        getCarMarker({ plateNum: name, token: self.token }).then(res => {
          var data = res.data
          if (res.resultCode.code === 1) {
            if (data.longitude) {
              self.$emit('mapCarShipPoint', data.longitude, data.latitude, name, 'car')
            }
          } else {
            self.$Message.warning('无此车辆坐标!')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getNowDate: function () {
      var today = new Date()
      var dd = today.getDate()
      var mm = today.getMonth() + 1
      var yyyy = today.getFullYear()
      var hour = today.getHours()
      var minutes = today.getMinutes()
      var seconds = today.getSeconds()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minutes + ':' + seconds
      return today
    },
    receivedCallMsg: function (data) {
      var self = this
      self.showTransfer = 1
      self.destchannels = data.calledChannel
      self.channels = data.callingChannel
      console.log('data', data)
      if (data.state === 0) {
        if (data.status === 1) {
          console.log('data1', data)
          this.queueNameLocal = '通话队列'
          this.callFlag = 1
          self.reminder(data)
        } else if (data.status === 0) {
          this.queueNameLocal = '呼叫队列'
          this.callFlag = 0
          self.reminder(data)
        }
      } else if (data.state === 1) {
        self.answerPrompt(data)
      } else {
        self.hangupPrompt(data)
      }
    },
    // 来电提示
    reminder (data) {
      var call = {
        callingNum: data.callingNum,
        calledNum: data.calledNum,
        state: data.state,
        uniqueId: data.uniqueId
      }
      this.callList.push(call)
      this.queueFlag = 1
    },
    // 接听
    answerPrompt (data) {
      var self = this
      for (var i = 0; i < self.callList.length; i++) {
        if (self.callList[i].uniqueId === data.uniqueId) {
          Vue.set(self.callList[i], 'state', data.state)
          Vue.set(self.callList[i], 'calledNum', data.calledNum)
          var alarmTime = self.getNowDate()
          if (self.callFlag === 0) {
            self.$emit('getAlarmData', self.callList[i].callingNum, alarmTime)
          }
        }
      }
      this.startTime()
    },
    hangupPrompt (data) {
      var self = this
      var t
      for (var i = 0; i < self.callList.length; i++) {
        if (self.callList[i].uniqueId === data.uniqueId) {
          self.callList.splice(i, 1)
        }
      }
      clearTimeout(t)
      self.reset()
    },
    // 挂断
    phonePullDown: function (index) {
      var self = this
      getPhonePullDown({ channel: self.channels, cause: 0, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          if (index >= 0) {
            self.callList.splice(index, 1)
          }
        } else {
          self.$Message.warning('挂断异常!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    alarmList: function () {
      var self = this
      getAlarmNoStatusList({ rows: 50, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          var data = res.data.list
          if (data.length > 0) {
            self.currentOrAllEvent = 2
          }
          if (data.length === 0) {
            self.currentOrAllEvent = 3
            return
          }
          self.eventsList = []
          var currentData = {}
          var flag = true
          for (var i = 0; i < data.length; i++) {
            console.log('...lds......', data[i])
            self.eventsList.push(data[i])
            if (data[i].id === window.location.href.split('=')[1]) {
              currentData = data[i]
              self.currentOrAllEvent = 1
              flag = false
            }
          }
          if (flag) {
            currentData = data[0]
          }
          // if (window.location.href.split('=')[1]) {
          //   alert(window.location.href.split('=')[1])
          self.eventObj = currentData
          console.log(currentData)
          self.shipNameList = []
          self.carNameList = []
          self.carsList(currentData.id)
          self.shipsList(currentData.id)
          // } else {
          //   self.eventObj = data[0]
          //   self.shipNameList = []
          //   self.carNameList = []
          //   self.carsList(data[0].id)
          //   self.shipsList(data[0].id)
          // }
          self.postEmergencyPlanById()
          this.$emit('sendEjson', self.eventObj)
        } else {
          self.$Message.warning('查询列表异常!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    shipsList: function (alarmId) {
      var self = this
      getShipsList({ alarmId: alarmId, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.shipsListLen = res.data.length
          if (res.data.length > 0) {
            self.shipNameList = res.data
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    carsList: function (alarmId) {
      var self = this
      getCarsList({ alarmId: alarmId, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.carsListLen = res.data.length
          if (res.data.length > 0) {
            self.carNameList = res.data
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    startTime: function () {
      var self = this
      self.time = setInterval(self.timer, 50)
    },
    timer: function () {
      var self = this
      self.ms = self.ms + 50
      if (self.ms >= 1000) {
        self.ms = 0
        self.second = self.second + 1
      }
      if (self.second >= 60) {
        self.second = 0
        self.minute = self.minute + 1
      }
      if (self.minute >= 60) {
        self.minute = 0
        self.hour = self.hour + 1
      }
      if (self.hour > 0) {
        self.callTime = self.toDub(self.hour) + ':' + self.toDub(self.minute) + ':' + self.toDub(self.second)
      } else {
        self.callTime = self.toDub(self.minute) + ':' + self.toDub(self.second)
      }
    },
    // 重置
    reset: function () {
      var self = this
      clearInterval(self.time)
      self.hour = 0
      self.minute = 0
      self.second = 0
      self.ms = 0
      self.callTime = '00:00'
    },
    // 补0
    toDub: function (n) {
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },
    alarmType (alertType) {
      var type = ''
      switch (alertType) {
        case '1':
          type = '火灾'
          break
        case '2':
          type = '爆炸'
          break
        default:
          type = '--'
      }
      return type
    },
    status (status) {
      var state = ''
      switch (status) {
        case '0':
          state = '待处理'
          break
        case '1':
          state = '处理中'
          break
        case '2':
          state = '处置完成'
          break
        default:
          state = '--'
      }
      return state
    },
    singleCall: function (phoneNum) {
      this.$emit('singleCall', phoneNum)
    },
    openCall () {
      this.$emit('openCall')
    },
    getCallRecodesList: function () {
      var self = this
      var status = '1'
      if (this.queueNameLocal === '通话队列') {
        status = '1'
      } else {
        status = '0'
      }
      var nowDate = self.getNowDate().substr(0, 10)
      findCallRecordsAll({ startDate: nowDate, status: status, page: 1, rows: 20, token: self.token }).then(res => {
        if (res.data !== null) {
          self.callRecodesList = res.data.list
        }
      }).catch(err => {
        self.callRecodesList = []
        console.log(err)
      })
    },
    handleCalledNum: function (calledNum) {
      if (calledNum === '' || calledNum === null) {
        return ''
      } else {
        return '-' + calledNum
      }
    },
    showPlanDetail: function (eventObj) {
      // this.alarmList()
      this.eventObj = eventObj
      this.eventsList[this.eventIndex] = eventObj
    },
    postEmergencyPlanById: function () {
      var self = this
      if (self.eventObj.emergencyPlanId !== null && self.eventObj.emergencyPlanId !== '') {
        getEmergencyPlanById({ id: self.eventObj.emergencyPlanId }).then(res => {
          if (res.resultCode.code === 1) {
            this.$emit('getChemical', res.data.chemical)
          } else {
            self.$Message.warning('获取异常!')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    playRecording: function (fileName) {
      this.audiomodal = true
      this.$refs.audio.src = 'api1/play/' + fileName
      this.$refs.audio.play()
    },
    close: function () {
      this.audiomodal = false
      this.$refs.audio.pause()
      this.$refs.audio.load()
    }
  }

}
</script>

<style lang="less" scoped>
  .queue {
    position: absolute;
    width: 330px;
    height: 827px;
    top: 100px;
    right: 20px;
    background: url("../../../../assets/mapTrack/right_bg.png") no-repeat scroll
    right center transparent;
    background-size: 330px 827px;
    z-index: 999;
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
  .call_title {
    color: #076d7d;
  }
  .model_content {
    text-align: center;
    position: relative;
    padding-left: 10px;
    width: 90%;
    margin: 10px auto 0;
    height: 320px;
    overflow-y: auto;
  }
  .model_content::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .model_content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0fafc6;
  }
  .model_content::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #094a53;
  }
  .model_content1 {
    height: 230px;
    overflow-y: auto;
  }
  .model_content1::-webkit-scrollbar {
    display: none;
  }
  .call_all_div {
    margin-bottom: 10px;
    border-bottom: 1px solid #1a3346;
    min-height: 60px;
    cursor: pointer;
  }
  .info_username_div {
    float: left;
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
  }
  .info_call_div {
    margin-top: 20px;
    text-align: left;
    margin-bottom: 10px;
  }
  .detail_info_username {
    /*display: inline-block;*/
    float: left;
    width: 75px;
    font-size: 14px;
    color: #a0a8ae;
    /*margin: 10px 0;*/
  }
  .detail_info_call {
    float: left;
    width: 65%;
    font-size: 15px;
    color: #a0a8ae;
  }
  .detail_info_des {
    /*display: inline-block;*/
    float: left;
    width: 200px;
    font-size: 14px;
    color: #a0a8ae;
    /*margin: 10px 0;*/
    .edit-btn {
      color: #0df6ff;
      cursor: pointer;
    }
  }
  .ml75 {
    margin-left: 75px;
    margin-top: 10px;
  }
  .alarm-tool {
    float: left;
    /*width: 150px;*/
  }
  .alarm-location {
    margin-left: 10px;
    background: url("../../../../assets/mapTrack/location.png") no-repeat center;
    background-size: cover;
  }
  .alarm-img {
    float: left;
    width: 20px;
    height: 20px;
    margin-left: 10px;
    /*margin-top: 4px;*/
    cursor: pointer;
  }
  .detail_info_username img {
    margin-left: 10px;
  }
  .ringing {
    line-height: 20px;
    float: right;
    color: #d0941a;
    margin-right: 20px;
  }
  .no_call {
    line-height: 40px;
    float: right;
    color: #d0941a;
    margin-right: 20px;
  }
  .model_content_bottom1 {
    position: absolute;
    width: 100%;
    text-align: center;
    clear: both;
  }
  .noinfo1 {
    position: absolute;
    top: 170px;
    color: white;
    font-size: 20px;
    height: 30px;
  }
  .event_page1 {
    position: absolute;
    top: 370px;
    height: 440px;
    width: 100%;
  }
  .model_title1 {
    margin-left: 20px;
    margin-right: 18px;
    border-bottom: solid 1px #0ddde5;
  }
  .closeimg {
    width: 20px;
    height: 20px;
    background: url("../../../../assets/mapTrack/event_on.png") no-repeat scroll
    right center transparent;
    display: inline-block;
    right: 40px;
    float: right;
    cursor: pointer;
  }
  .closeimgshu {
    background: url("../../../../assets/mapTrack/event_shu.png") no-repeat scroll
    right center transparent !important;
  }
  .model_button {
    height: 36px;
    border: none;
    color: #0ddde5;
    font-size: 16px;
    float: left;
    margin-right: 10px;
  }
  .model_button_zc {
    background-image: url(../../../../assets/mapTrack/btn.png);
    background-repeat: no-repeat;
    width: 96px;
  }
  .model_button_zc:hover {
    background-image: url(../../../../assets/mapTrack/btn_on.png);
  }
  .model_button_zc:disabled {
    background-image: url(../../../../assets/mapTrack/btn_no.png);
  }
  .model_content_bottom {
    width: 96px;
    margin: 0 auto;
  }
  .event_all_div {
    float: left;
    width: 100%;
    /*margin-bottom: 10px;*/
    padding-top: 10px;
    border-bottom: 1px solid #555;
    min-height: 150px;
    cursor: pointer;
    &:hover {
      background-color: #2b4354;
    }
  }
  .noinfo2 {
    position: relative;
    top: 100px;
    color: #435868;
    font-size: 20px;
  }
  .second-level {
    color: #ffaf14;
  }
  .third-level {
    color: #ff2323;
  }
</style>
