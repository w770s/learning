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
      <span class="title">信息报送</span>
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
      <div class="meeting-bottom" @click="openAddInfoPage()">
        <span><img src="../../../../../assets/mapTrack/add.png">信息报送</span>
      </div>
    </div>
    <!--信息报送-->
    <div class="model" v-show="addInfo">
      <div class="model-page">
        <div class="model-title">
          <span>信息报送</span>
          <img class="pointer" @click="closeAddInfoPaga()" src="../../../../../assets/mapTrack/close.png">
        </div>
        <div class="model-content">
          <div class="model-content-left">
            <div class="info-username-div username-head">
              <span class="info-username">收件人</span>
              <span class="info-prompt" v-bind:title = "message">请从通讯录选择人员,或输入正确的手机号,两个手机号用分号隔开</span>
              <span class="span-btn" @click="clearUsers()">清空</span>
            </div>
            <div class="info-username-div blueborder">
              <template v-for="(item, index) in selectSubmitUsers">
                <div class="info-user-div" :key="item.name">
                  <span class="info-user">{{item.tMobile}}</span>
                  <span class="info-user" v-if="isBlank(item.tMobile)">,</span>
                  <span class="info-user">{{item.tPhone}}</span>
                  <span class="info-user" v-if="isBlank(item.tMobile) || isBlank(item.tPhone)">_</span>
                  <span class="info-user">{{item.name}}_</span>
                  <span class="info-user">{{item.orgName}}</span>
                  <span class="info-user-close" @click="delInfoUsers(index)"><img src="../../../../../assets/mapTrack/blueclose.png"></span>
                </div>
              </template>
            </div>
            <div class="info-username-div">
              <span class="info-username">报送内容</span>
            </div>
            <div class="info-username-div blueborder">
              <textarea v-model="infodetails" class="model-content-textarea" rows="6" placeholder="请输入..."></textarea>
              <span class="model-span" style="margin-right: 10px;">/500</span>
              <span class="model-span">{{wordNum}}</span>
            </div>
            <div class="model-word">70字为一条短信，超过70字即为长短信，以67个字数计为一条短信计算，字数最多不能超过500字</div>
          </div>
          <div class="model_content_right">
            <div class="add-user-page-content-div-title"><span>通讯组</span></div>
            <div class="search-user">
              <input type="text" class="search-user-inp" v-model="inpval" placeholder="搜索关键字"/>
              <span class="input-clear" @click="cleraInp()">&times;</span>
            </div>
            <div class="add-user-page-content-div-content" style="text-align: left;position: relative;height:310px;">
              <div class="ztree-out-div">
                <div id="treeDiv1" v-show="isShow" class="ztree"></div>
                <div id="treeDiv" v-show="!isShow" class="ztree" style="color: #fff">
                  <template v-for="item in chooseList">
                    <div class="select-user-list"  @click="infoSelectGroupUser(item.tName, item.department, item.tMobile, item.tPhone, 'u'+item.id)">{{item.tName}}</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="model-content-bottom">
            <button class="model-button model-button-zc" type="primary" @click="Addinfo()">报 送</button>
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
            <table class="table table-bordered" style="color: #fff;text-align: center">
              <thead>
                <tr style="background-color: #0a3d52">
                  <td>姓名</td>
                  <td>手机号</td>
                  <td>单位名称</td>
                </tr>
              </thead>
              <tbody v-for="item in userSelect" :key="item.name">
                <tr>
                  <td>{{isNull(item.name)}}</td>
                  <td>
                    <span>{{isNull(item.tPhone)}}</span>
                    <span>,</span>
                    <span>{{isNull(item.tMobile)}}</span>
                  </td>
                  <td>{{isNull(item.orgName)}}</td>
                </tr>
              </tbody>
            </table>
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
import { findMsgSubmittedList, findMsgSubmittedById, gainAddressBook, getOrgTeamListById, infoAdd } from '@/api/emergency'
import $ from 'jquery'
export default {
  props: ['alarmId'],
  data () {
    return {
      token: this.$store.state.user.token,
      loadFlag: false,
      isShow: true,
      addInfo: false,
      detailInfo: false,
      inpval: '',
      message: '请从通讯录选择人员,或输入正确的手机号,两个手机号用分号隔开',
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
      infodetails: '',
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
      },
      localAlarmId: this.alarmId
      /* 信息报送end */
    }
  },
  mounted () {
    var self = this
    /* 造假数据 start */
    self.contactBookList = [
      {
        name: '抢险救灾组',
        list: [
          { name: '张三', num: '1001' },
          { name: '李四', num: '1002' },
          { name: '王五', num: '1003' }
        ]
      },
      {
        name: '后勤保障组',
        list: [
          { name: '张三', num: '18516566300' },
          { name: '李四', num: '15757828071' }
          /* { name: '王五', num: '1003' } */
        ]
      },
      {
        name: '测试组',
        list: [
          { name: '张三', num: '8252' },
          { name: '李四', num: '8253' },
          { name: '王五', num: '8254' }
        ]
      }
    ]
    self.communicationList = [
      {
        name: '嘉兴石化有限公司',
        id: '1',
        pid: null,
        groupList: [
          {
            name: '抢险救灾组',
            id: '11',
            pid: '1',
            userList: [
              { name: '张三', id: '111', pid: '11' },
              { name: '李四', id: '112', pid: '11' },
              { name: '王五', id: '113', pid: '11' },
              { name: '赵六', id: '114', pid: '11' }
            ]
          },
          {
            name: '应急救援组',
            id: '12',
            pid: '1',
            userList: [
              { name: '张三1', id: '121', pid: '12' },
              { name: '李四1', id: '122', pid: '12' },
              { name: '王五1', id: '123', pid: '12' },
              { name: '赵六1', id: '124', pid: '12' }
            ]
          },
          {
            name: '后勤保障组',
            id: '13',
            pid: '1',
            userList: [
              { name: '张三', id: '131', pid: '13' },
              { name: '李四', id: '132', pid: '13' },
              { name: '王五', id: '133', pid: '13' },
              { name: '赵六', id: '134', pid: '13' }
            ]
          }
        ]
      },
      {
        name: '嘉兴金燕化工有限公司',
        id: '2',
        pid: null,
        groupList: [
          {
            name: '抢险救灾组',
            id: '21',
            pid: '2',
            userList: [
              { name: '张三', id: '211', pid: '21' },
              { name: '李四', id: '212', pid: '21' },
              { name: '王五', id: '213', pid: '21' },
              { name: '赵六', id: '214', pid: '21' }
            ]
          },
          {
            name: '应急救援组',
            id: '22',
            pid: '2',
            userList: [
              { name: '张三', id: '221', pid: '22' },
              { name: '李四', id: '222', pid: '22' },
              { name: '王五', id: '223', pid: '22' },
              { name: '赵六', id: '224', pid: '22' }
            ]
          },
          {
            name: '后勤保障组',
            id: '23',
            pid: '2',
            userList: [
              { name: '张三', id: '231', pid: '23' },
              { name: '李四', id: '232', pid: '23' },
              { name: '王五', id: '233', pid: '23' },
              { name: '赵六', id: '234', pid: '23' }
            ]
          }
        ]
      },
      {
        name: '三江化工有限公司',
        id: '3',
        pid: null,
        groupList: [
          {
            name: '抢险救灾组',
            id: '31',
            pid: '3',
            userList: [
              { name: '张三', id: '311', pid: '31' },
              { name: '李四', id: '312', pid: '31' },
              { name: '王五', id: '313', pid: '31' },
              { name: '赵六', id: '314', pid: '31' }
            ]
          },
          {
            name: '应急救援组',
            id: '32',
            pid: '3',
            userList: [
              { name: '张三', id: '321', pid: '32' },
              { name: '李四', id: '322', pid: '32' },
              { name: '王五', id: '323', pid: '32' },
              { name: '赵六', id: '324', pid: '32' }
            ]
          },
          {
            name: '后勤保障组',
            id: '33',
            pid: '3',
            userList: [
              { name: '张三', id: '331', pid: '33' },
              { name: '李四', id: '332', pid: '33' },
              { name: '王五', id: '333', pid: '33' },
              { name: '赵六', id: '334', pid: '33' }
            ]
          }
        ]
      }
    ]
    /* 信息报送 */
    // var infoarr = []
    // var infoval = self.communicationList
    // // var infoval = self.infoSubmitList
    // for (var i1 = 0; i1 < infoval.length; i1++) {
    //   var obj4 = {}
    //   obj4.name = infoval[i1].name
    //   obj4.id = infoval[i1].id
    //   obj4.pid = infoval[i1].pid
    //   obj4.levelType = 1
    //   infoarr.push(obj4)
    //   for (var j1 = 0; j1 < infoval[i1].groupList.length; j1++) {
    //     var obj5 = {}
    //     obj5.name = infoval[i1].groupList[j1].name
    //     obj5.id = infoval[i1].groupList[j1].id
    //     obj5.pid = infoval[i1].groupList[j1].pid
    //     obj5.levelType = 2
    //     infoarr.push(obj5)
    //     for (var k1 = 0; k1 < infoval[i1].groupList[j1].userList.length; k1++) {
    //       var obj6 = {}
    //       obj6.name = infoval[i1].groupList[j1].userList[k1].name
    //       obj6.id = infoval[i1].groupList[j1].userList[k1].id
    //       obj6.pid = infoval[i1].groupList[j1].userList[k1].pid
    //       obj6.levelType = 3
    //       infoarr.push(obj6)
    //     }
    //   }
    // }
    // self.infotreeData = infoarr
    // self.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), self.infotreeSetting, self.infotreeData)
    self.findMsgSubmittedList()
    gainAddressBook({ token: self.token }).then(res => {
      self.ajaxLoadClose()
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
        // for (var i1 = 0; i1 < infoval.length; i1++) {
        //   // 组织
        //   var obj = {}
        //   obj.pid = 0
        //   obj.id = 'o' + infoval[i1].pid
        //   obj.name = infoval[i1].orgName
        //   obj.levelType = 1
        //   // 人员
        //   var objChild = {}
        //   objChild.pid = 'o' + infoval[i1].pid
        //   objChild.id = 'u' + infoval[i1].id
        //   objChild.name = infoval[i1].tName
        //   objChild.orgName = infoval[i1].orgName
        //   objChild.tMobile = infoval[i1].tMobile
        //   objChild.tPhone = infoval[i1].tPhone
        //   objChild.levelType = 2
        //   self.orgData.push(obj)
        //   infoarr.push(objChild)
        // }
        console.log(infoarr)
        self.infotreeData = infoarr.concat(self.arrRemoval(self.orgData))
        self.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), self.infotreeSetting, self.infotreeData)
      } else {
        self.$Message.warning('查询异常!')
      }
    }).catch(err => {
      self.ajaxLoadClose()
      console.log(err)
    })
  },
  watch: {
    keyword: function () {
      var self = this
      self.findMsgSubmittedList()
    },
    // 如果 `inpval` 发生改变，这个函数就会运行
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
    infodetails: function () {
      this.wordNum = this.infodetails.length
      if (this.infodetails.length > 500) {
        this.infodetails = this.infodetails.substr(0, 500)
        this.$Message.warning('最多只能输入500字')
      }
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
    // 打开信息报送页面
    openAddInfoPage: function () {
      this.addInfo = true
      this.selectSubmitUsers = []
      this.infodetails = ''
      this.isShow = true
      this.inpval = ''
      this.infoztreeObj = $.fn.zTree.init($('#treeDiv1'), this.infotreeSetting, this.infotreeData)
    },
    // 关闭信息报送页面
    closeAddInfoPaga: function () {
      this.addInfo = false
    },
    // 信息报送获取菜单列表
    infozTreeOnClick: function (event, treeId, treeNode) {
      var self = this
      if (treeNode.levelType === 3) {
        // 组员
        self.infoSelectGroupUser(treeNode.name, treeNode.orgName, treeNode.tMobile, treeNode.tPhone, treeNode.id)
      }
    },
    // 信息报送选中组中的用户
    infoSelectGroupUser: function (name, orgName, tMobile, tPhone, id) {
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
        obj.name = name
        obj.orgName = orgName
        obj.tMobile = tMobile
        obj.tPhone = tPhone
        obj.id = id
        self.selectSubmitUsers.push(obj)
      }
    },
    // 清除会议用户
    clearUsers: function () {
      this.selectSubmitUsers = []
    },
    // 根据下标删除会议用户
    delInfoUsers: function (index) {
      var self = this
      self.selectSubmitUsers.splice(index, 1)
    },
    // 信息报送列表
    findMsgSubmittedList: function () {
      var self = this
      self.ajaxLoad()
      findMsgSubmittedList({ submittedContent: self.keyword, state: 1, alarmId: this.localAlarmId, token: self.token }).then(res => {
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
    // 信息报送列表详情
    findMsgSubmittedById: function (listId) {
      var self = this
      findMsgSubmittedById({ id: listId, token: self.token }).then(res => {
        self.ajaxLoadClose()
        if (res.resultCode.code === 1) {
          self.submittedInfo = res.data
          var user = res.data.submittedObj.split(',')
          self.userSelect = []
          for (var i = 0; i < user.length; i++) {
            var obj = {}
            var userDetail = user[i].split('_')
            obj.name = userDetail[0]
            obj.tMobile = userDetail[1]
            obj.tPhone = userDetail[2]
            obj.orgName = userDetail[3]
            self.userSelect.push(obj)
          }
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
    // 提交信息报送
    Addinfo: function () {
      var self = this
      var userList = []
      var numList = self.selectSubmitUsers
      $(numList).each(function (j, item) {
        var user = item.name + '_' + item.tMobile + '_' + item.tPhone + '_' + item.orgName
        userList.push(user)
      })
      self.infoData.submittedObj = userList
      self.infoData.submittedContent = self.infodetails
      infoAdd({ json: JSON.stringify(self.infoData), token: self.token }).then(res => {
        if (res.resultCode.code === 1) {
          // $('#add_info_page_out').hide()
          this.addInfo = false
          self.$Message.success('报送成功!')
          self.findMsgSubmittedList()
        } else {
          self.$Message.warning('报送异常!')
        }
      }).catch(err => {
        self.ajaxLoadClose()
        console.log(err)
      })
    },
    cleraInp: function () {
      this.inpval = ''
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
    // 判断是否为空
    isNull: function (str) {
      if (str === '' || str == null || str === 'undefined') {
        console.log(str)
        return '--'
      } else {
        return str
      }
    },
    // 判断是否为空
    isBlank: function (str) {
      if (str === '') {
        return false
      } else {
        return true
      }
    },
    //  截取时间
    spliceTime: function (time) {
      if (time === '' || time == null || time === 'undefined') {
        return '--'
      } else {
        return time.substr(0, 16)
      }
    },
    //  数组去重
    arrRemoval: function (arr) {
      var temp = []
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].id === arr[j].id) {
            ++i
          }
        }
        temp.push(arr[i])
      }
      return temp
    }

  }
}
</script>

<style lang="less" scoped>
  table,tr,td,th{
    border: none;
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

  .search-input{
    position: absolute;
    margin-left: 180px;
    margin-top: 340px;
    width: 90px;
  }
  .search-table{
    width: 336px;
    height: 500px;
    background-color: #52390A;
    border: 1px solid #FFAB67;
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
    cursor: pointer;
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
    border-radius: 4px 0 0 4px;
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
  }
  .username-head{
    float: left;
    width: 100%;
    .info-username{
      float: left;
      line-height: 23px;
    }
    .info-prompt{
      float: left;
      width: 76%;
      line-height: 23px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .model-content-textarea{
    background-color: #0A3D52;
    width: 98%;
    height: 74%;
    border: none;
    resize:none;
    outline:none;
    color: #AAC2CC;
    padding: 5px;
    margin: 5px;
  }

  .model-span{
    float: right;
    color: #97a1a9;
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
    &:hover{
      background-image: url(../../../../../assets/mapTrack/btn_on.png);
    }
    &:disabled{
      background-image: url(../../../../../assets/mapTrack/btn_no.png);
    }
  }
  .model-button-qx{
    width: 75px;
    color: #fff;
    background-image: url(../../../../../assets/mapTrack/btn_qx.png);
    background-repeat: no-repeat;
    &:hover{
      background-image: url(../../../../../assets/mapTrack/btn_qx_on.png);
    }
    &:disabled{
      background-image: url(../../../../../assets/mapTrack/btn_qx_no.png);
    }
  }
  .model-content-left{
    width: 68%;
    float: left;
    .model-word{
      margin-bottom: 5px;
      color: #97a1a9;
      text-align: left;
      font-size: 12px;
    }
  }
  .model_content_right {
    width: 30%;
    float: right;
    .search-user{
      position: relative;
      width: 100%;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      .search-user-inp{
        -web-kit-appearance:none;
        -moz-appearance: none;
        height: 36px;
        width: 210px;
        border:1px solid #16adc1;
        background-color: transparent;
        color: #fff;
        padding: 10px;
        font-size: 14px;
      }
      .input-clear{
        display: block;
        position: absolute;
        right: 17px;
        top: 9px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .add-user-page-content-div-title {
    width: 100%;
    height: 34px;
    line-height: 34px;
    background-color: #0a3d52;
  }
  .add-user-page-content-div-title span {
    height: 14px;
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
  }
  .ztree-out-div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .ztree {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .select-user-list{
      padding: 3px 10px;
      cursor: pointer;
      &:hover{
        background-color: #032;
      }
    }
  }
  .info-username{
    font-size: 16px;
    color: #0ddde5;
  }
  .info-prompt{
    /*width: ;*/
    font-size: 12px;
    color: #64737F;
    margin-left: 10px;
  }
  .span-btn{
    float: right;
    padding: 1px 10px;
    line-height: 21px;
    border: 1px solid #ffaf14;
    background-color: #52390a;
    color: #ffaf14;
    cursor: pointer;
    &:hover{
      opacity: .8;
    }
  }
  .blueborder{
    height: 135px;
    border:1px solid #0ddde5;
    background-color: #0A3D52;
    overflow-y: auto;
  }
  .zdyxxbs::-webkit-scrollbar,
  .model-content::-webkit-scrollbar,
  .ztree::-webkit-scrollbar,
  .blueborder::-webkit-scrollbar,
  .model-content-textarea::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  .zdyxxbs::-webkit-scrollbar-thumb,
  .model-content::-webkit-scrollbar-thumb,
  .ztree::-webkit-scrollbar-thumb,
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
  .ztree::-webkit-scrollbar-track,
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
    /*padding: 0px 10px;*/
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
  table{
    width: 100%;
    border-spacing: 0;
  }
  table tr td{
    border-bottom: 1px solid #806e4a;
  }
  #detail_info_page table tr td {
    padding: 5px;
  }
  .table-bordered>tbody>tr>td,
  .table-bordered>tbody>tr>th,
  .table-bordered>tfoot>tr>td,
  .table-bordered>tfoot>tr>th,
  .table-bordered>thead>tr>td,
  .table-bordered>thead>tr>th {
    border: 1px solid #0a3d52;
  }
  .table>caption+thead>tr:first-child>td,
  .table>caption+thead>tr:first-child>th,
  .table>colgroup+thead>tr:first-child>td,
  .table>colgroup+thead>tr:first-child>th,
  .table>thead:first-child>tr:first-child>td,
  .table>thead:first-child>tr:first-child>th {
    border-top-color: #0a3d52;
  }
  .resource-null{
    position: absolute;
    top: 150px;
    height: 200px;
    width: 100%;
    color: white;
    text-align: center;
    line-height: 200px;
    font-size: 20px;
  }
</style>
