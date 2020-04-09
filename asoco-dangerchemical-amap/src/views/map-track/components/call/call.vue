<template>
  <div>
    <div class="communication-content-call"
         @mousedown="mousedown"
         v-if="callStateNow == 1">
      <div class="minimum"
           @click="cancel(1)"></div>
      <div class="headImage"></div>
      <template>
        <div style="text-align: center;">
          <div style="text-align: center;margin-top:200px">
            <div style="font-size: 30px;color: #0DF2FB"><span>{{callNum}}</span></div>
            <div class="converse"
                 id="converseCall"><span>{{callState}}</span></div>
            <div class="converseTime"><span>{{callTime}}</span></div>
          </div>
          <div style="text-align: center;margin-top:100px">
            <!--<div class="mute">-->
            <!--<img src="../../../../assets/mapTrack/record.png"-->
            <!--alt=""><br>-->
            <!--<span style="padding-top: 5px">静音</span>-->
            <!--</div>-->
            <div class="transfer"
                 @click="transfer()">
              <img src="../../../../assets/mapTrack/transfer.png"
                   alt=""><br>
              <span style="padding-top: 5px">转接</span>
            </div>
          </div>
          <div class="hangUp"
               @click="phonePullDown(-1)"></div>
        </div>
      </template>
    </div>
    <div class="communication-content-transfer"
         v-show="callStateNow == 2">
      <span class="titleTransfer">选择转接对象</span>
      <div class="closeTransfer"
           @click="cancel(2)"></div>
      <template>
        <div class="tabBtn">
          <span class="span"
                :class="{spanMenu:isActive}"
                @click="showSeatOrg(1)">呼叫坐席</span>
          <span class="span org"
                :class="{spanMenu:!isActive}"
                @click="showSeatOrg(2)">组织机构</span>
        </div>
        <div class="seatNameNum">
          <input class="tip"
                 type="text"
                 placeholder="请输入坐席名称或号码">
          <i class="icon"></i>
        </div>
        <div class="context"
             v-show="seatOrg == 1">
          <ul>
            <template>
              <div v-for="item in seatList"
                   :key="item.num">
                <li @click="addNumTranse(item.num)"
                    :class="{'addNumTransefer':numTranseFlag == item.num?true:false}">
                  <span style="float: left;color: #C4D1D6;"><img src="../../../../assets/mapTrack/small_user.png"></span>
                  <span style="float: left;color: #C4D1D6;font-size: 14px;display:inline-block;padding-left: 10px">{{item.num}}</span>
                </li>
              </div>
            </template>
          </ul>
        </div>
        <div class="context"
             v-show="seatOrg == 2">
          <div class="add_user_page_content_div_content"
               style="text-align: left;position: relative;height:350px;">
            <div class="ztree_out_div">
              <div id="treeDiv1"
                   class="ztree"></div>
            </div>
          </div>
        </div>
        <div class="footerDiv">
          <div class="cancelBtn"><img src="../../../../assets/mapTrack/cancel_button.png"
                 @click="cancel(2)" /></div>
          <div class="sureBtn"><img src="../../../../assets/mapTrack/sure_button.png"
                 @click="transeCall()" /></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { gainAddressBook, getPhonePullDown, getTransferNum, getSingleCall } from '@/api/emergency'
import $ from 'jquery'
import { mapActions } from 'vuex'
export default {
  name: 'call',
  props: ['alarmId', 'uniqueId'],
  data () {
    return {
      callStateNow: 0,
      isActive: true,
      seatList: [
        { num: '1001' },
        { num: '1002' },
        { num: '1003' }
      ],
      seatOrg: 1,
      numTranseFlag: -1,
      userLength: -1,
      phoneList: [],
      // 终点通道
      destchannels: '',
      channels: '',
      hour: 0,
      token: this.$store.state.user.token,
      minute: 0,
      second: 0,
      ms: 0,
      time: 0,
      str: '',
      callNum: '1002',
      callState: '',
      callTime: '',
      /* 信息报送列表 */
      infoList: [],
      keyword: '',
      /* 信息报送 */
      infotreeData: [],
      orgData: [],
      infoztreeObj: null,
      infotreeSetting: {
        callback: {
          onClick: this.infozTreeOnClick
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid',
            rootPId: null
          }
        },
        view: {
          showIcon: false,
          // showIcon: showIconForTree,
          fontCss: {
            color: 'white',
            fontSize: '14px'
          }
        }
      },
      moveSwitch: false,
      localAlarmId: '',
      localUniqueId: ''
    }
  },
  watch: {
    'alarmId': function () {
      this.localAlarmId = this.alarmId
    },
    'uniqueId': function () {
      this.localUniqueId = this.uniqueId
    }
  },
  mounted () { },
  methods: {
    ...mapActions([
      'getUserInfo',
      'handleLogOut'
    ]),

    mousedown (event) {
      var self = this
      var div = event.target
      self.moveSwitch = true
      // console.log(event.target.className)
      var startX = event.clientX
      var startY = event.clientY
      var currentX = div.offsetLeft
      var currentY = div.offsetTop
      if (event.target.className === 'communication-content-call') {
        document.onmousemove = function (ev) {
          var oevent = ev || event
          if (self.moveSwitch) {
            var left = oevent.clientX - startX + currentX
            var top = oevent.clientY - startY + currentY
            if (left <= 0) {
              left = 0
            } else if (left >= document.documentElement.clientWidth - div.offsetWidth) {
              // document.documentElement.clientWidth 屏幕的可视宽度
              left = document.documentElement.clientWidth - div.offsetWidth
            }
            if (top <= 0) {
              top = 0
            } else if (top >= document.documentElement.clientHeight - div.offsetHeight) {
              // document.documentElement.clientHeight 屏幕的可视高度
              top = document.documentElement.clientHeight - div.offsetHeight
            }

            div.style.left = left + 'px'
            div.style.top = top + 'px'
            // console.log(self.style.left)
          }
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          this.moveSwitch = false
        }
      }
    },
    receivedCallMsg (data) {
      var self = this
      self.destchannels = data.calledChannel
      self.channels = data.callingChannel
      $('#converseCall').removeClass('converseCall')
      $('#converseCall').removeClass('converseUn')
      if (data.state === 0) {
        if (data.status === 1) {
          self.dailCallNum(data)
        } else if (data.status === 0) {
          self.callReminder(data)
        }
      } else if (data.state === 1) {
        self.answerPrompt(data)
      } else {
        self.hangupPrompt(data)
      }
    },
    // 来电提示
    callReminder (data) {
      this.callStateNow = 1
      $('#converseCall').addClass('converseCall')
      this.callNum = data.callingNum
      this.callState = '来电中'
    },
    dailCallNum (data) {
      this.callStateNow = 1
      $('#converseCall').addClass('converseCall')
      this.callNum = data.callingNum
      this.callState = '呼叫中'
      this.callTime = ''
    },
    // 接听
    answerPrompt (data) {
      var self = this
      this.callNum = data.calledNum
      this.callState = '通话中'
      self.startTime()
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
        self.str = self.toDub(self.hour) + ':' + self.toDub(self.minute) + ':' + self.toDub(self.second)
      } else {
        self.str = self.toDub(self.minute) + ':' + self.toDub(self.second)
      }
      self.callTime = self.str
    },
    // 重置
    reset: function () {
      var self = this
      clearInterval(self.time)
      self.hour = 0
      self.minute = 0
      self.second = 0
      self.ms = 0
      self.str = '00:00'
    },
    // 补0
    toDub: function (n) {
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },
    hangupPrompt (data) {
      var self = this
      var t
      $('#converseCall').addClass('converseUn')
      this.callState = '通话已结束'
      this.callTime = ''
      clearTimeout(t)
      t = setTimeout(function () {
        self.callStateNow = 0
      }, 2000)
      self.reset()
    },
    cancel: function (data) {
      var self = this
      if (data === 1) {
        self.callStateNow = 0
      } else {
        self.callStateNow = 1
      }
    },
    transfer: function () {
      var self = this
      self.callStateNow = 2
      this.initTree()
    },
    // 挂断
    phonePullDown: function () {
      var self = this
      var t
      $('#converseCall').addClass('converseUn')
      this.callState = '通话已结束'
      // this.callTime = ''
      clearTimeout(t)
      t = setTimeout(function () {
        self.callStateNow = 0
      }, 2000)
      getPhonePullDown({ channel: self.channels, cause: 0, token: self.token })
        .then(res => {
          if (res.resultCode.code === 1) {
            self.$Message.success('挂断成功!')
          } else {
            self.$Message.warning('挂断异常!')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showSeatOrg: function (num) {
      var self = this
      if (num === 1) {
        self.isActive = true
        self.seatOrg = 1
      } else {
        self.isActive = false
        self.seatOrg = 2
      }
    },
    addNumTranse: function (num) {
      var self = this
      self.numTranseFlag = num
    },
    transeCall: function () {
      $('#converseCall').removeClass('converseUn')
      var self = this
      self.callStateNow = 1
      $('#converseCall').addClass('converseCall')
      self.callNum = self.numTranseFlag
      self.callTime = ''
      self.callState = ''
      $('#callTime').text('转接中')
      getTransferNum({ channel: self.channels, num: self.numTranseFlag, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
        } else {
          self.$Message.warning('error')
        }
      }).catch(err => {
        // self.ajaxLoadClose()
        console.log(err)
      })
    },
    singleCall: function (num) {
      var channel = '1001'
      // var channel = num
      var self = this
      $('#converseCall').addClass('converseUn')
      self.callNum = channel
      self.callTime = ''
      self.callState = '请提起话机'
      self.callStateNow = 1
      getSingleCall({ channel: channel, num: num, eventNum: this.localAlarmId, uniqueId: this.localUniqueId, token: self.token })
        .then(res => {
          if (res.resultCode.code === 1) {

          } else {
            self.$Message.warning('拨打异常!')
          }
        })
    },
    openCall: function () {
      this.callStateNow = 1
    },
    initTree () {
      var self = this
      gainAddressBook({ token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          var infoarr = []
          var infoval = res.data
          console.log(infoarr)
          for (var i1 = 0; i1 < infoval.length; i1++) {
            var obj4 = {}
            obj4.name = infoval[i1].orgName
            obj4.id = infoval[i1].id
            obj4.pid = infoval[i1].pid
            obj4.levelType = 1
            infoarr.push(obj4)
            for (var j1 = 0; j1 < infoval[i1].childList.length; j1++) {
              var obj5 = {}
              obj5.name = infoval[i1].childList[j1].orgName
              obj5.id = infoval[i1].childList[j1].id
              obj5.pid = infoval[i1].childList[j1].pid
              obj5.levelType = 2
              infoarr.push(obj5)
              if (infoval[i1].childList[j1].userList) {
                for (var k1 = 0; k1 < infoval[i1].childList[j1].userList.length; k1++) {
                  var obj6 = {}
                  obj6.name = infoval[i1].childList[j1].userList[k1].tName
                  obj6.id = 'u' + infoval[i1].childList[j1].userList[k1].id
                  obj6.pid = infoval[i1].childList[j1].userList[k1].orgId
                  obj6.orgName = infoval[i1].childList[j1].orgName
                  obj6.tMobile = infoval[i1].childList[j1].userList[k1].tMobile
                  obj6.tPhone = infoval[i1].childList[j1].userList[k1].tPhone
                  obj6.levelType = 3
                  infoarr.push(obj6)
                }
              }
            }
          }
          self.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), self.infotreeSetting, infoarr)
        } else {
          self.$Message.warning('查询异常!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    infozTreeOnClick: function (event, treeId, treeNode) {
      var self = this
      if (treeNode.levelType === 3) {
        self.addNumTranse(treeNode.tMobile)
        // console.log(treeNode.tMobile)
        // 组员
        // self.infoSelectGroupUser(treeNode.name, treeNode.orgName, treeNode.tMobile, treeNode.tPhone, treeNode.id)
      }
    }
  }
}
</script>

<style scoped>
@import "./call.less";
</style>
