<template>
  <div>
    <div class='communication'>
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
      <div class='event-title'
           style='text-align: center'>
        <div @click="communicationClick(1)"
             class="search-title-1 communication-title pointer"
             :class="{'search-title-1-active':communicationFlag == 1?true:false}">
          <img v-show="communicationFlag == 1"
               src="../../../../../assets/mapTrack/group_active.png">
          <img v-show="communicationFlag != 1"
               src="../../../../../assets/mapTrack/group_off.png">
        </div>
        <div @click="communicationClick(3)"
             class="search-title-1 communication-title pointer"
             :class="{'search-title-1-active':communicationFlag == 3?true:false}">
          <img v-show="communicationFlag == 3"
               src="../../../../../assets/mapTrack/group_big_active.png">
          <img v-show="communicationFlag != 3"
               src="../../../../../assets/mapTrack/group_big.png">
        </div>
        <div @click="communicationClick(4)"
             class="search-title-1 communication-title pointer"
             :class="{'search-title-1-active':communicationFlag == 4?true:false}">
          <img v-show="communicationFlag == 4"
               src="../../../../../assets/mapTrack/call_active.png">
          <img v-show="communicationFlag != 4"
               src="../../../../../assets/mapTrack/call.png">
        </div>
      </div>
      <div class="event-context">
        <div class="communication-content-out">
          <div class="communication-content"
               v-show="communicationFlag == 1">
            <div class="contact-list-table" style="bottom: 0;">
              <div v-show="contactBookListLen == 0" style="text-align: center;line-height: 120px;font-size: 34px;">
                暂无企业
              </div>
              <table v-show="contactBookListLen != 0">
                <template v-for="(item, index) in contactBookList">
                  <tr class='group-company-row'
                      :key="item.orgName + index">
                    <td>
                      <img class="pull-icon pull-company pull-down"
                           @click="communicationPull(index, $event, 1)"
                           src="../../../../../assets/mapTrack/pull-down-tri.png">
                    </td>
                    <td></td>
                    <td>
                      <img src="../../../../../assets/mapTrack/org-com.png">
                    </td>
                    <td>{{item.orgName}}</td>
                    <td>
                      <!--<img src="../../../../../assets/mapTrack/call_white.png"-->
                      <!--@click="groupCall(item.orgName)">-->
                    </td>
                    <td>
                      <!--<img src="../../../../../assets/mapTrack/video_white.png">-->
                    </td>

                  </tr>
                  <template v-for="(group, gindex) in item.childList">
                    <tr class='group-row'
                        v-show="communicationGroupNum == index"
                        :key="group.orgName + gindex">
                      <td></td>
                      <td>
                        <img class="pull-icon pull-group pull-down"
                             @click="communicationPull(group.id, $event, 2)"
                             src="../../../../../assets/mapTrack/pull-down-tri.png">
                      </td>
                      <td>
                        <img src="../../../../../assets/mapTrack/group.png">
                      </td>
                      <td>{{group.orgName}}</td>
                      <td class="pointer" width="30px">
                        <img src="../../../../../assets/mapTrack/call_white.png"
                             @click="groupCall(index, 1, gindex)">
                      </td>
                      <td width="30px">
                        <img src="../../../../../assets/mapTrack/video_white.png">
                      </td>
                    </tr>
                    <template v-for="it in group.userList">
                      <tr class="group-user-row"
                          v-show="communicationCompanyNum == it.orgId"
                          :key="it.tName">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{{it.tName}}</td>
                        <td class="pointer" width="30px">
                          <img src="../../../../../assets/mapTrack/call_white.png"
                               @click="singleCall(2, it.tMobile)">
                        </td>
                        <td width="30px">
                          <img src="../../../../../assets/mapTrack/video_white.png">
                        </td>
                      </tr>
                    </template>

                  </template>

                </template>
              </table>
            </div>
            <!--<div class="add_book_button pointer"-->
            <!--@click="open_distribution_group()">-->
            <!--<span>+ 添加调度组</span>-->
            <!--</div>-->
          </div>
          <div class="communication-content"
               v-show="communicationFlag == 3">
            <div class="contact-list-table">
              <div v-show="contactGroupListLen == 0" style="text-align: center;line-height: 120px;font-size: 34px;">
                暂无调度组
              </div>
              <table v-show="contactGroupListLen != 0">
                <template v-for="(item, index) in contactGroupList">
                  <tr class='group-row' :key="item.id">
                    <td>
                      <img class="pull-icon pull-down pull-groupC"
                           @click="communicationPull(index, $event, 3)"
                           src="../../../../../assets/mapTrack/pull-down-tri.png">
                    </td>
                    <td>
                      <img src="../../../../../assets/mapTrack/group.png">
                    </td>
                    <td>{{item.orgName}}</td>
                    <td class="pointer">
                      <img src="../../../../../assets/mapTrack/call_white.png"
                           @click="groupCall(index,3)">
                    </td>
                    <td>
                      <img src="../../../../../assets/mapTrack/video_white.png">
                    </td>

                  </tr>
                  <tr class="group-user-row"
                      v-show="communicationCgroupNum == index"
                      v-for="it in item.users"
                      :key="it.tName + it.id">
                    <td></td>
                    <td>
                    </td>
                    <td>{{it.tName}}</td>
                    <td class="pointer">
                      <img src="../../../../../assets/mapTrack/call_white.png"
                           @click="singleCall(2, it.tMobile)">
                    </td>
                    <td>
                      <img src="../../../../../assets/mapTrack/video_white.png">
                    </td>
                  </tr>
                </template>
              </table>
            </div>
            <div class="add_book_button">
              <span class="fl30" @click="chooseUsers(false)">电话会议</span>
              <span class="fl30" @click="chooseUsers(false)">语音会议</span>
              <span class="fl30" @click="chooseUsers(false)">视频会议</span>
            </div>
          </div>
          <div class="communication-content"
               v-show="communicationFlag == 2">
            <div style="text-align: center;padding: 20px;">
              <span>暂无会议</span>
            </div>
            <div class="add_book_button pointer"
                 @click="open_distribution_group()">
              <span>+ 邀请成员创建会议</span>
            </div>
          </div>
          <div class="communication-content"
               v-show="communicationFlag == 4">
            <div class="search-decision">
              <input type="text"
                     v-model="phoneNumber"
                     class="search-communication-active">
            </div>
            <template>
              <div class="communication-number">
                <input type="button"
                       @click="clickNumber($event)"
                       value="1">
                <input type="button"
                       @click="clickNumber($event)"
                       value="2">
                <input type="button"
                       @click="clickNumber($event)"
                       value="3">
                <input type="button"
                       @click="clickNumber($event)"
                       value="4">
                <input type="button"
                       @click="clickNumber($event)"
                       value="5">
                <input type="button"
                       @click="clickNumber($event)"
                       value="6">
                <input type="button"
                       @click="clickNumber($event)"
                       value="7">
                <input type="button"
                       @click="clickNumber($event)"
                       value="8">
                <input type="button"
                       @click="clickNumber($event)"
                       value="9">
                <input type="button"
                       @click="clickNumber($event)"
                       value="#">
                <input type="button"
                       @click="clickNumber($event)"
                       value="0">
                <input type="button"
                       @click="clickNumber($event)"
                       value="*">
              </div>
              <div class="communication-confirm">
                <input type="button"
                       @click="backspace()"
                       value="退格">
                <input type="button"
                       @click="singleCall(1,'')"
                       value="拨打">
                <input type="button"
                       @click="del()"
                       value="删除">
              </div>
            </template>
          </div>
        </div>
        <div style="clear:both;"></div>
      </div>
      <!--创建语音会议-->
      <div class="communication-content-call"
           v-show="callState == 2">
        <div class="meeting-content-inner">
          <span class="meetingtitle word-color">{{userName}}创建的语音会议({{ userLength }})</span>
          <div class="minimum"
               @click="cancel(1)"></div>
          <div class="meetingcontent meetingcontent-1">
            <template>
              <div v-for="item in phoneList"
                   :key="item.tName">
                <div style="float: left;text-align: center;cursor: pointer;padding: 20px;">
                  <img style="margin-bottom:10px"
                       src="../../../../../assets/mapTrack/user_meeting_on.png"
                       alt=""><br>
                  <span style="margin-top:10px;color: white;">{{ item.tName }}</span>
                </div>
              </div>
            </template>
          </div>
          <div class="operate">
            <div class="muteMetting">
              <img style="margin-bottom:10px"
                   src="../../../../../assets/mapTrack/record.png"
                   alt=""><br>
              <span style="margin-top:10px;color: white;">静音</span>
            </div>
            <div class="inviteUser" @click="chooseUsers(true)">
              <img style="margin-bottom:10px"
                   src="../../../../../assets/mapTrack/invite_person.png"
                   alt=""><br>
              <span style="margin-top:10px;color: white;">邀请</span>
            </div>
            <div class="manageUser" @click="manageUsers()">
              <img style="margin-bottom:10px;padding-left: 10px"
                   src="../../../../../assets/mapTrack/group_manage.png"
                   alt=""><br>
              <span style="margin-top:10px;color: white;">成员管理</span>
            </div>
          </div>
          <div class="hangUpMeeting"
               @click="disbandment()"></div>
        </div>
        <div class="bg-user" v-show="bgUser">
          <div class="bg-user-header">
            <span class="meetingtitle word-color">当前会议成员({{ userLength }})</span>
            <div class="minimum close-btn"
                 @click="closeBgUser"></div>
          </div>
          <div class="bg-user-content">
            <template>
              <div v-for="(item, index) in phoneList"
                   :key="item.tName">
                <div class="user-item">
                  <span style="float:left;width: 30px;"><img src="../../../../../assets/mapTrack/single-person.png" alt=""></span>
                  <span class="phoneList-name ellipsis">{{ item.tName }}</span>
                  <span class="user-status" v-show="item.isJoin == 0">正在呼叫中</span>
                  <span class="user-status" v-show="item.isJoin == 1">已连接</span>
                  <span class="user-status">{{ item.tMobile }}</span>
                  <span class="user-click" @click="kickMeetOneUser(index,item.tMobile)"><img src="../../../../../assets/mapTrack/detele-user.png" alt=""></span>
                  <span class="user-click" v-show="item.isMute == 0" @click="settingMute(index,item.tMobile)"><img src="../../../../../assets/mapTrack/record.png" alt=""></span>
                  <span class="user-click" v-show="item.isMute == 1" @click="allowedToSpeak(index,item.tMobile)"><img src="../../../../../assets/mapTrack/mute.png" alt=""></span>
                </div>
              </div>
            </template>
          </div>

        </div>
      </div>
      <!--<call ref='call' v-show="0===1" v-bind:is="components.call"></call>-->
    </div>
    <!--选择会议成员-->
    <div class="choose-group" v-show="isChoose">
      <div class="bg">
        <div class="header">
          <p class="head-word">选择会议成员</p>
          <span class="close-btn" @click="closeBtn"></span>
        </div>
        <div class="org-div" id="orgDiv">
          <div class="fl content-div">
            <div class="header-div header-color"><span>组织机构</span></div>
            <div class="header-div">
              <input type="text" class="search-inp" v-model="inpval">
            </div>
            <ul id="treeDiv1" v-show="isShow" class="ztree tree-div"></ul>
            <ul id="treeDiv" v-show="!isShow" class="ztree tree-div" style="color: #fff">
              <template v-for="(item, index) in chooseList">
                <li class="select-user-list" :key="index" @click="infoSelectGroupUser(item.tName, item.tMobile, item.tPhone, 'u'+item.id)">{{item.tName}}</li>
              </template>
            </ul>
          </div>
          <div class="fl content-div">
            <div class="header-div header-color"><span>会议成员</span></div>
            <ul class="users-ul">
              <template v-for="(item, index) in selectSubmitUsers">
                <li class="info-user-li" :key="item.id">
                  <span class="info-user">{{item.tName}}</span>
                  <span class="info-user-close" @click="delInfoUsers(index)"><img src="../../../../../assets/mapTrack/close.png"></span>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="footer">
          <div class="fl fldiv"></div>
          <div class="fl frdiv">
            <span class="fl cancel-btn button" @click="closeBtn">取消</span>
            <span class="fl confirm-btn button" @click="saveBtn">确&nbsp;&nbsp;&nbsp;定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import 'ztree/js/jquery.ztree.core'
import $ from 'jquery'
import Vue from 'vue'
import call from './../../call/call'
import 'ztree'
import pullDown from '@/assets/mapTrack/pull-down-tri.png'
import pullUp from '@/assets/mapTrack/pull-up-tri.png'
import { gainAddressBook, findSchedulingGroup, getOrgTeamListById, getGroupCall, kickMeetOneUser, settingMute, allowedToSpeak, getDisbandment } from '@/api/emergency'
export default {
  props: ['companyName', 'wsData'],
  name: 'communication',
  data () {
    return {
      components: {
        call: call
      },
      loadFlag: false,
      isShow: true,
      bgUser: false,
      communicationFlag: 1,
      isChoose: false,
      /* 应急通讯 */
      contactBookList: [],
      contactBookListLen: 0,
      contactGroupList: [],
      contactGroupListLen: 0,
      communicationGroupNum: -1,
      communicationCompanyNum: -1,
      communicationCgroupNum: -1,
      phoneNumber: '',
      callState: 0,
      token: this.$store.state.user.token,
      userLength: -1,
      phoneList: [],
      seatList: [
        { num: '1001' },
        { num: '1002' },
        { num: '1003' }
      ],
      images: {
        pullDown: pullDown,
        pullUp: pullUp
      },
      seatOrg: 1,
      numTranseFlag: -1,
      // 终点通道
      destchannels: '',
      channels: '',
      hour: 0,
      minute: 0,
      second: 0,
      ms: 0,
      time: 0,
      str: '',
      currentCompanyName: '',
      groupNum: 0,
      /* 组织机构 */
      inpval: '',
      infotreeData: [],
      orgData: [],
      infoztreeObj: null,
      infotreeSetting: {
        callback: {
          onClick: this.zTreeOnClick
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
      details: '',
      wordNum: 0,
      selectSubmitUsers: [],
      submittedInfo: {},
      userSelect: [],
      chooseList: [],
      infoData: {
        submittedUser: this.$store.state.user.userName,
        submittedObj: [],
        submittedContent: '',
        state: 1
      }
    }
  },
  watch: {
    inpval: function () {
      var self = this
      console.log(this.inpval.length)
      if (this.inpval.length === 0) {
        self.isShow = true
        self.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), self.infotreeSetting, self.infotreeData)
      } else {
        self.isShow = false
        $('#treeDiv1').empty()
        self.getOrgTeamListById()
      }
    },
    wsData () {
      var webSocketData = this.wsData
      // this.groupNum = webSocketData.num
      // console.log('==================' + JSON.stringify(webSocketData))
      var self = this
      switch (webSocketData.callState) {
        case 'Join':
          $(self.phoneList).each(function (i, item) {
            if (webSocketData.callingChannel.indexOf(item.tMobile) !== -1) {
              console.log(self.phoneList[i])
              self.phoneList[i].isJoin = 1
            }
          })
          console.log('asdasd=' + webSocketData.callingChannel)
          break
        case 'hangup':
          $(self.phoneList).each(function (j, item) {
            if (webSocketData.callingChannel.indexOf(item.tMobile) !== -1) {
              console.log('==================' + self.phoneList[j])
              self.phoneList.splice(j, 1)
              self.userLength -= 1
            }
          })
          console.log('asdasd=' + webSocketData.callingChannel)
          break
      }
    }
  },
  mounted () {
    var self = this
    this.currentCompanyName = this.companyName.relevantEnterprise
    // console.log(this.companyName.relevantEnterprise)
    // 获取组织机构数据
    self.ajaxLoad()
    gainAddressBook({ token: self.token }).then(res => {
      self.ajaxLoadClose()
      if (res.resultCode.code === 1) {
        self.contactBookListLen = res.data.length
        self.contactBookList = res.data
        //  选择会议成员
        var infoarr = []
        var infoval = res.data
        // 组织机构
        for (var i1 = 0; i1 < infoval.length; i1++) {
          var obj4 = {}
          obj4.name = infoval[i1].orgName
          obj4.id = infoval[i1].id
          obj4.pid = infoval[i1].pid
          obj4.levelType = 1
          infoarr.push(obj4)
          // 群组
          for (var j1 = 0; j1 < infoval[i1].childList.length; j1++) {
            var obj5 = {}
            obj5.name = infoval[i1].childList[j1].orgName
            obj5.id = infoval[i1].childList[j1].id
            obj5.pid = infoval[i1].childList[j1].pid
            obj5.levelType = 2
            infoarr.push(obj5)
            //  群组人员
            if (infoval[i1].childList[j1].userList) {
              for (var k1 = 0; k1 < infoval[i1].childList[j1].userList.length; k1++) {
                var obj6 = {}
                obj6.name = infoval[i1].childList[j1].userList[k1].tName
                obj6.id = 'u' + infoval[i1].childList[j1].userList[k1].id
                obj6.pid = infoval[i1].childList[j1].userList[k1].orgId
                obj6.tMobile = infoval[i1].childList[j1].userList[k1].tMobile
                obj6.tPhone = infoval[i1].childList[j1].userList[k1].tPhone
                obj6.levelType = 3
                infoarr.push(obj6)
              }
            }
          }
        }
        self.infotreeData = infoarr
        self.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), self.infotreeSetting, self.infotreeData)

        console.log(infoarr)
      } else {
        self.$Message.warning('查询异常!')
      }
    }).catch(err => {
      self.ajaxLoadClose()
      console.log(err)
    })
    // 获取调度组数据
    findSchedulingGroup({ firmName: self.currentCompanyName, token: self.token }).then(res => {
      self.ajaxLoadClose()
      if (res.resultCode.code === 1) {
        self.contactGroupListLen = res.data.length
        self.contactGroupList = res.data
        console.log(res.data)
      } else {
        self.$Message.warning('查询异常!')
      }
    }).catch(err => {
      self.ajaxLoadClose()
      console.log(err)
    })
  },
  computed: {
    userName () {
      return this.$store.state.user.userName
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
    zTreeOnClick: function (event, treeId, treeNode) {
      var self = this
      if (treeNode.levelType === 3) {
        // 组员
        console.log(treeNode.tMobile)
        self.infoSelectGroupUser(treeNode.name, treeNode.tMobile, treeNode.tPhone, treeNode.id)
      }
    },
    // 信息报送选中组中的用户
    infoSelectGroupUser: function (name, tMobile, tPhone, id) {
      var self = this
      // 判断是否已存在
      var flag = true
      for (var i = 0; i < self.selectSubmitUsers.length; i++) {
        if (self.selectSubmitUsers[i].id === id) {
          flag = false
          break
        }
      }
      if (flag) {
        var obj = {}
        obj.tName = name
        obj.tMobile = tMobile
        obj.tPhone = tPhone
        obj.id = id
        self.selectSubmitUsers.push(obj)
      }
      console.log(self.selectSubmitUsers)
    },
    // 根据下标删除会议用户
    delInfoUsers: function (index) {
      var self = this
      self.selectSubmitUsers.splice(index, 1)
    },
    // 搜索人员
    getOrgTeamListById: function () {
      var self = this
      getOrgTeamListById({ numAndName: self.inpval, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.chooseList = res.data.list
        } else {
          self.$Message.warning('查询异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 显示应急通讯不同内容
    communicationClick: function (type) {
      var self = this
      self.communicationFlag = type
    },
    // 显示下拉或上拉
    communicationPull: function (num, event, comOrGro) {
      var self = this
      // 组织机构
      if (comOrGro === 1) {
        if ($(event.target).hasClass('pull-down')) {
          $('.pull-company').removeClass('pull-up')
          $('.pull-company').addClass('pull-down')
          $(event.target).removeClass('pull-down')
          $(event.target).addClass('pull-up')
          $('.pull-company').attr('src', self.images.pullDown)
          $(event.target).attr('src', self.images.pullUp)
          self.communicationGroupNum = num
          $('.pull-group').removeClass('pull-up')
          $('.pull-group').addClass('pull-down')
          $('.pull-group').attr('src', self.images.pullDown)
          self.communicationCompanyNum = -1
        } else {
          $('.pull-icon').removeClass('pull-up')
          $('.pull-icon').addClass('pull-down')
          $('.pull-icon').attr('src', self.images.pullDown)
          self.communicationGroupNum = -1
          self.communicationCompanyNum = -1
        }
      }
      // 组织机构下的调度组
      if (comOrGro === 2) {
        console.log(event.target)
        console.log(num)
        if ($(event.target).hasClass('pull-down')) {
          $('.pull-group').removeClass('pull-up')
          $('.pull-group').addClass('pull-down')
          $(event.target).removeClass('pull-down')
          $(event.target).addClass('pull-up')
          $('.pull-group').attr('src', self.images.pullDown)
          $(event.target).attr('src', self.images.pullUp)
          self.communicationCompanyNum = num
        } else {
          $('.pull-group').removeClass('pull-up')
          $('.pull-group').addClass('pull-down')
          $('.pull-group').attr('src', self.images.pullDown)
          self.communicationCompanyNum = -1
        }
      }
      // 调度组
      if (comOrGro === 3) {
        console.log(event.target)
        console.log(num)
        if ($(event.target).hasClass('pull-down')) {
          $('.pull-groupC').removeClass('pull-up')
          $('.pull-groupC').addClass('pull-down')
          $(event.target).removeClass('pull-down')
          $(event.target).addClass('pull-up')
          $('.pull-groupC').attr('src', self.images.pullDown)
          $(event.target).attr('src', self.images.pullUp)
          self.communicationCgroupNum = num
        } else {
          $('.pull-groupC').removeClass('pull-up')
          $('.pull-groupC').addClass('pull-down')
          $('.pull-groupC').attr('src', self.images.pullDown)
          self.communicationCgroupNum = -1
        }
      }
    },
    // 输入电话号码
    clickNumber: function (event) {
      this.phoneNumber += $(event.target).val()
    },
    // 退格
    backspace: function () {
      this.phoneNumber = this.phoneNumber.substr(0, this.phoneNumber.length - 1)
    },
    // 删除输入框中的号码
    del: function () {
      this.phoneNumber = ''
    },
    // 单呼
    singleCall: function (index, num) {
      var self = this
      console.log(1)
      if (index === 1) {
        console.log(2)
        num = self.phoneNumber
      }
      self.$emit('singleCall', num)
    },
    // 组呼
    groupCall: function (index, isCgroup, gindex) {
      var self = this
      self.phoneList = []
      var phoneNum = []
      // 组织机构
      if (isCgroup === 1) {
        var numList = self.contactBookList[index].childList[gindex].userList
        if (numList) {
          $(numList).each(function (i, item) {
            Vue.set(item, 'isJoin', 0)
            Vue.set(item, 'isMute', 0)
            self.phoneList.push(item)
            phoneNum.push(item.tMobile)
          })
        } else {
          self.phoneList = []
          self.userLength = -1
        }
      }
      // 调度组
      if (isCgroup === 3) {
        var userList = self.contactGroupList[index].users
        if (userList) {
          // self.userLength = userList.length
          $(userList).each(function (i, item) {
            Vue.set(item, 'isJoin', 0)
            Vue.set(item, 'isMute', 0)
            self.phoneList.push(item)
            phoneNum.push(item.tMobile)
          })
        } else {
          self.phoneList = []
          self.userLength = -1
        }
      }
      self.userLength = self.phoneList.length
      if (self.userLength > 0) {
        self.callState = 2
      } else {
        self.$Message.warning('该救援组无成员')
      }
      self.callGroup(phoneNum)
    },
    callGroup: function (phoneNum) {
      var self = this
      if (self.groupNum < 100) {
        self.groupNum = Math.floor(Math.random() * 900) + 100
      }
      getGroupCall({ listPhone: JSON.stringify(phoneNum), groupNum: self.groupNum, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.callStatus = 2
        } else {
          self.$Message.warning('群组呼叫异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    kickMeetOneUser: function (index, channel) {
      var self = this
      kickMeetOneUser({ conference: self.groupNum, channel: channel, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.$Message.success(self.phoneList[index].tName + '已退出房间')
          self.phoneList.splice(index, 1)
          self.userLength -= 1
        } else {
          self.$Message.warning(self.phoneList[index].tName + '无法退出房间')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 设置静音
    settingMute: function (index, channel) {
      var self = this
      settingMute({ conference: self.groupNum, channel: channel, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.$Message.success(self.phoneList[index].tName + '已静音')
          self.phoneList[index].isMute = 1
        } else {
          self.$Message.warning(self.phoneList[index].tName + '无法静音')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    // 允许说话
    allowedToSpeak: function (index, channel) {
      var self = this
      allowedToSpeak({ conference: self.groupNum, channel: channel, token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          self.$Message.success(self.phoneList[index].tName + '已允许说话')
          self.phoneList[index].isMute = 0
        } else {
          self.$Message.warning(self.phoneList[index].tName + '无法允许说话')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    cancel: function (data) {
      var self = this
      if (data === 1) {
        self.callState = 0
      } else {
        self.callState = 2
      }
    },
    // 结束会议
    disbandment: function () {
      var self = this
      self.callState = 0
      getDisbandment({ conference: self.groupNum, token: self.token }).then(res => {
        self.groupNum = 0
        self.$Message.success('结束会议成功')
        self.phoneList = []
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    //  选择会议成员
    chooseUsers: function (isInvite) {
      var self = this
      self.selectSubmitUsers = []
      self.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), self.infotreeSetting, self.infotreeData)
      self.isChoose = true
    },
    // 管理会议成员
    manageUsers: function () {
      var self = this
      self.bgUser = true
    },
    closeBtn: function () {
      this.isChoose = false
    },
    closeBgUser: function () {
      this.bgUser = false
    },
    saveBtn: function () {
      var self = this
      var phoneNum = []
      var numList = self.selectSubmitUsers
      $(numList).each(function (i, item) {
        Vue.set(item, 'isJoin', 0)
        Vue.set(item, 'isMute', 0)
        self.phoneList.push(item)
        phoneNum.push(item.tMobile)
      })
      self.userLength = self.phoneList.length
      if (self.userLength > 0) {
        self.callState = 2
      } else {
        self.$Message.warning('该救援组无成员')
      }
      self.callGroup(phoneNum)
      this.isChoose = false
    }
  }
}
</script>
<style lang="less" scoped>
  @import "./../../call/call.less";
  .communication-content-call{
    position: fixed;
  }
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

  .communication {
    position: absolute;
    left: 180px;
    top: 280px;
    width: 336px;
    height: 500px;
    background-color: #52390a;
    border: 1px solid #ffab67;
  }
  .event-title {
    width: 100%;
    height: 40px;
    border-bottom: solid 1px #806e4a;
  }
  .search-title-1 {
    float: left;
    width: 50%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    font-size: 16px;
  }
  .search-title-1 label {
    padding: 0 5px;
  }
  /* 应急通讯  */
  .communication-title {
    width: 42px;
    display: inline-block;
    float: none;
    margin: 0 20px;
    margin-top: 5px;
  }
  .communication-content-out {
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    bottom: 0px;
  }
  .communication-content {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .event-context {
    width: 92%;
    float: right;
    color: white;
  }
  .event-context table {
    width: 100%;
    font-size: 16px;
  }
  table{
    border-spacing: 0;
  }
  table tr td{
    border-bottom: 1px solid #806e4a;
  }
  .event-context table tr {
    height: 71px;
    width: 100%;
    border-bottom: solid 1px #6e5931;
  }
  .event-context table tr td span {
    color: #9d814e;
  }
  .contact-list-table {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 41px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .contact-list-table td:first-of-type {
    text-align: center;
  }
  .contact-list-table::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .contact-list-table::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #FFAF14;
  }
  .contact-list-table::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #52390A;
  }
  .search-decision {
    width: 293px;
    text-align: center;
    margin-top: 18px;
  }
  .search-decision input {
    color: #fff;
  }
  .pull-icon{
    cursor: pointer;
  }
  .fl30{
    display: inline-block;
    width: 33.3%;
    cursor: pointer;
    &:hover{
      color: #fff;
    }
  }
  /* 拨号盘 */
  .search-communication-active {
    -web-kit-appearance: none;
    -moz-appearance: none;
    height: 69px;
    width: 298px;
    border: none;
    background-color: #322306;
    border-radius: 4px;
    margin-left: 21px;
    padding: 10px;
    font-size: 32px;
    text-align: center;
  }
  .communication-number {
    text-align: center;
  }
  .communication-number input {
    margin: 0;
    padding: 0;
    border: 1px solid transparent;
    outline: none;
    width: 96px;
    height: 77px;
    color: #fff;
    background-color: transparent;
    font-size: 28px;
    cursor: pointer;
  }
  .communication-number input:hover {
    background-color: #644d23;
  }
  .communication-confirm {
    text-align: center;
  }
  .communication-confirm input {
    margin: 0;
    padding: 0;
    border: 1px solid transparent;
    outline: none;
    width: 96px;
    height: 42px;
    color: #fff;
    background-color: transparent;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
  }
  .communication-confirm input:hover {
    background-color: #30bb9c;
  }
  .pointer{
    cursor: pointer;
  }

  /* 选择会议成员 */
  .fl{
    float: left;
  }
  .choose-group{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(100,100,100,.8);
    z-index: 8888
  }
  .bg{
    position: absolute;
    left: 50%;
    margin-left: -287px;
    margin-top: 220px;
    top: -15px;
    height: 577px;
    width: 575px;
    color: #0DDDE5;
    background-image: url("../../../../../assets/mapTrack/transfer_bg.png");
    background-repeat: no-repeat;
    z-index: 8888;
    /*  头部
    */
    .header{
      position: relative;
      height: 60px;
      .head-word{
        height: 60px;
        margin-top: 15px;
        font-size: 20px;
        line-height: 60px;
        text-align: center;
      }
      .close-btn{
        position: absolute;
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
        float: right;
        background-image: url("../../../../../assets/mapTrack/close.png");
        background-repeat: no-repeat;
        cursor: pointer;
      }
    }
    /* 组织机构树 */
    .org-div{
      width: 535px;
      height: 430px;
      margin-left: 20px;
      .content-div{
        width: 240px;
        height: 100%;
        margin-left: 16px;
        background-color: #020e18;
      }
      .header-color{
        background-color: #0a3d52;
      }
      .header-div{
        width: 100%;
        height: 35px;
        line-height: 35px;
        span{
          height: 14px;
          padding-left: 20px;
          font-family: PingFang-SC-Regular;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #fff;
        }
        .search-inp{
          -web-kit-appearance:none;
          -moz-appearance: none;
          height: 36px;
          width: 210px;
          border:1px solid #16adc1;
          background-color: transparent;
          color: #fff;
          padding: 10px;
          margin-left: 15px;
          margin-top: 10px;
          font-size: 14px;
        }
      }
      .tree-div{
        height: 330px;
        margin-top: 20px;
        overflow: auto;
        .select-user-list{
          padding: 3px 10px;
          cursor: pointer;
          &:hover{
            background-color: #032;
          }
        }
      }
      .users-ul{
        float: left;
        width: 100%;
        height: 380px;
        margin-top: 10px;
        list-style: none;
        overflow: auto;
        .info-user-li{
          float: left;
          width: 100%;
          height: 35px;
          margin-bottom: 5px;
          line-height: 35px;
          background-color: #16adc1;
          color: #fff;
          .info-user{
            padding-left: 10px;
          }
          .info-user-close{
            float: right;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
    }

    /* 底部*/
    .footer{
      height: 80px;
      width: 535px;
      margin-left: 20px;
      .fldiv{
        width: 300px;
        height: 100%;
      }
      .frdiv{
        width: 230px;
        text-align: center;
        .button{
          height: 36px;
          margin-top: 5px;
          margin-left: 20px;
          line-height: 36px;
          cursor: pointer;
        }
        .cancel-btn{
          width: 75px;
          background-image: url("../../../../../assets/mapTrack/btn_qx.png");
          background-repeat: no-repeat;
          &:hover{
            background-image: url("../../../../../assets/mapTrack/btn_qx_on.png");
          }
        }
        .confirm-btn{
          width: 96px;
          background-image: url("../../../../../assets/mapTrack/btn.png");
          background-repeat: no-repeat;
          &:hover{
            background-image: url("../../../../../assets/mapTrack/btn_on.png");
          }
        }
      }
    }
  }
  /* 会议人员管理背景 */
  .bg-user{
    position: fixed;
    width: 380px;
    height: 440px;
    left: 40%;
    font-size: 16px;
    background-color: rgba(0,0,0,.8);
    top:calc(29% + 60px);
    .bg-user-header{
      float:left;
      width: 100%;
      height: 30px;
      margin-bottom: 10px;
    }
    .bg-user-content{
      float:left;
      width: 100%;
      height: 400px;
      overflow: auto;
      .user-item{
        float:left;
        padding: 5px;
        width: 100%;
      }
      .phoneList-name{
        float:left;
        width: 50px;
        height: 30px;
        margin-left:10px;
        line-height:29px;
        color: white;
      }
      .user-status{
        float:left;
        margin-left:10px;
        line-height:29px;
        color: #06767c;
      }
      .user-click{
        float: right;
        margin-right:10px;
        cursor: pointer;
      }
    }
    .close-btn{
      background-image: url("../../../../../assets/mapTrack/close.png");
    }
  }
  .ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .word-color{
    color: #fff;
  }

  .tree-div::-webkit-scrollbar,
  .users-ul::-webkit-scrollbar,
  .bg-user-content::-webkit-scrollbar{
    width: 4px;
    height: 1px;
  }
  .tree-div::-webkit-scrollbar-thumb,
  .users-ul::-webkit-scrollbar-thumb,
  .bg-user-content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #0df6ff;
  }
  .tree-div::-webkit-scrollbar-track,
  .users-ul::-webkit-scrollbar-track,
  .bg-user-content::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #064f61;
  }
</style>
