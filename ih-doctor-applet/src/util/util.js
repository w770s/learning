import emojimap from './emojimap.js'
const emoji = emojimap.emojiList.emoji
const app = getApp()
const clinicIcon = [{
  name: 'div',
  children: [{
    name: 'div',
    children:[{
      name: 'img',
      attrs: {
        src: 'http://file.aihuihc.com/patient/patientImages/images/newHome/imIcon.png',
        style: 'width:30px;height:34px;margin-left:10px;'
      }
    }],
    attrs: {
      style: 'width:30px !important;'
    }
  },{
    name: 'div',
    children: [{
      name: 'div',
      attrs: {
        style: 'text-align:left;'
      },
      children: [{
        type: 'text',
        text: '处方单'
      }]
    },
      {
        name: 'div',
        children: [{
          type: 'text',
          text: '诊断：'
        }],
        attrs: {
          style: 'text-align:left;line-height:24px;'
        }
      }],
    attrs: {
      style: 'margin-left:25px;margin-right:25px;'
    }
  },{
    name: 'div',
    children:[{
      name: 'img',
      attrs: {
        src: 'http://file.aihuihc.com/ih-doctor-applet/image/rightArrow.png',
        style: 'width:16px;height:14px;margin-right:10px;'
      }
    }],
    attrs: {
      style: 'width:20px !important;'
    }
  }],
  attrs: {
    style: 'display:flex;align-items:center;'
  },
  params:{},
  report: 'clinicBill'
}]
const reportIcon = [{
  name: 'span',
  children: [{
    name: 'img',
    attrs: {
      src: 'http://file.aihuihc.com/patient/patientImages/images/newHome/imIcon.png',
      style: 'width:18px;height:18px;margin-right:5px;line-height:24px;'
    }
  },{
    type: 'text',
    text: ''
  }],
  params:{},
  report: true
}]
//阿拉伯数字转中文数字
function NoToChinese(num) {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    alert("Number is wrong!");
    return "Number is wrong!";
  }
  var AA = new Array("零","一", "二", "三", "四", "五", "六", "七", "八", "九");
  var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
  var a = ("" + num).replace(/(^0*)/g, "").split("."),
      k = 0,
      re = "";
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
          re = BB[4] + re;
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }
  if (a.length > 1) //加上小数部分(如果有小数部分)
  {
    re += BB[6];
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
  }
  return re;
};

function dateToString (dateString,type) {
  // <--将时间对象转换为字符串 ‘yyyy-mm-dd hh:mm:ss’-->
  if (dateString === null || dateString === '') {
    dateString = ''
    return dateString
  }
  if(dateString){
    let date = new Date(dateString.replace(/-/g,'/'))
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
	if (month < 10) {
	  month = '0' + month
	}
	if (day < 10) {
	  day = '0' + day
	}
	if (hours < 10) {
	  hours = '0' + hours
	}
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    if(type==='yyyy-mm-dd'){
      date = year + '-' + month + '-' + day
    }
    if(type==='yyyy-mm-dd hh:mm:ss'){
      date = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes+ ':' + seconds
    }
    return date
  }
}
/**
 * 输入Unix时间戳，返回指定时间格式
 */
function calcTimeHeader(time) {
  // 格式化传入时间
  let date = new Date(parseInt(time)),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth(),
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getUTCMinutes()
  // 获取当前时间
  let currentDate = new Date(),
    currentYear = date.getUTCFullYear(),
    currentMonth = date.getUTCMonth(),
    currentDay = currentDate.getDate()
  // 计算是否是同一天
  if (currentYear == year && currentMonth == month && currentDay == day) {//同一天直接返回
    if (hour > 12) {
      return `下午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    } else {
      return `上午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    }
  }
  // 计算是否是昨天
  let yesterday = new Date(currentDate - 24 * 3600 * 1000)
  if (year == yesterday.getUTCFullYear() && month == yesterday.getUTCMonth && day == yesterday.getDate()) {//昨天
    return `昨天 ${hour}:${minute < 10 ? '0' + minute : minute}`
  } else {
    return `${year}-${month + 1}-${day} ${hour}:${minute < 10 ? '0' + minute : minute}`
  }
}

/**
   * 深度克隆friendCata
   */
function deepClone(data) {
  let des = {}
  for (let cataKey in data) {
    let desArr = data[cataKey]

    des[cataKey] = []
    desArr.map(item => {
      let temp = {}
      for (let key in item) {
        temp[key] = item[key]
      }
      des[cataKey].push(temp)
    })
  }
  return des
}

/**
 * 封装toast
 */
function showToast (type, text, obj) {
  let param = { duration: (obj && obj.duration) || 1500, mask: (obj && obj.isMask) || false }
  switch(type) {
    case 'text': {
      param['title'] = text || ''
      param['icon'] = 'none'
      break
    }
    case 'loading': {
      param['title'] = text || ''
      param['icon'] = 'loading'
      break
    }
    case 'success': {
      param['title'] = text || ''
      param['icon'] = 'success'
      break
    }
    case 'error': {
      param['title'] = text || ''
      param['image'] = '/images/emoji.png'
      break
    }
    default: {
      break
    }
  }
  wx.showToast(param)
}

function dealMsg(msg, store, app) {
  let account = msg.from
  if (msg.type === 'deleteMsg') {
    store.dispatch({
      type: 'RawMessageList_OppositeRecall_Msg',
      payload: msg
    })
  } else if (msg.type === 'addFriend') { //第三方将自己加到好友列表
    app.globalData.nim.subscribeEvent({
      type: 1, // 订阅用户登录状态事件
      accounts: [account],
      sync: true,
      done: function (err, obj) {
        console.log(err, obj)
      }
    })
    app.globalData.nim.getUser({
      account: account,
      done: function (err, user) {
        if (err) {
          console.log('onSysMsg: getUser: ', err)
          return
        }
        store.dispatch({
          type: 'Notification_Opposite_AddFriend',
          payload: {
            msg,
            desc: `添加好友-${msg.from}添加你为好友`
          }
        })
        store.dispatch({
          type: 'FriendCard_Add_Friend',
          payload: user
        })
      }
    })
  } else if (msg.type === 'deleteFriend') {
    store.dispatch({
      type: 'Notification_Opposite_DeleteFriend',
      payload: {
        msg,
        desc: `删除好友-${msg.from}已将你从他的好友列表中移除`
      }
    })
    store.dispatch({
      type: 'FriendCard_Delete_By_Account',
      payload: account
    })
  } else if (msg.type === 'teamInvite') { // category:"team"
    store.dispatch({
      type: 'Notification_Team_Invite',
      payload: {
        msg,
        desc: `${msg.from}邀请你入群“${msg.attach.team.name}”`
      }
    })
  } else if (msg.type === 'applyTeam') { // category:"team"
    store.dispatch({
      type: 'Notification_Team_Apply',
      payload: {
        msg,
        desc: `${msg.from}申请加入`
      }
    })
  }
}

/**
 * 计算在线 状态
 * [account,clientType,custom:{1:{net_state:1,online_state:0}},idClient,idServer,serverConfig,time,type,value]
 */
function updateMultiPortStatus(data) {
  if (data.account) {
    let account = data.account
    let multiPortStatus = ''
    function getMultiPortStatus(customType, custom) {
      // 服务器下推多端事件标记的特定序号对应值
      var netState = {
        0: '',
        1: 'Wifi',
        2: 'WWAN',
        3: '2G',
        4: '3G',
        5: '4G'
      }
      var onlineState = {
        0: '在线',
        1: '忙碌',
        2: '离开'
      }

      var custom = custom || {}
      if (customType !== 0) {
        // 有serverConfig.online属性，已被赋值端名称
        custom = custom[customType]
      } else if (custom[4]) {
        custom = custom[4]
        multiPortStatus = '电脑'
      } else if (custom[2]) {
        custom = custom[2]
        multiPortStatus = 'iOS'
      } else if (custom[1]) {
        custom = custom[1]
        multiPortStatus = 'Android'
      } else if (custom[16]) {
        custom = custom[16]
        multiPortStatus = 'Web'
      } else if (custom[64]) {
        custom = custom[64]
        multiPortStatus = 'Mac'
      }
      if (custom) {
        custom = JSON.parse(custom)
        if (typeof custom['net_state'] === 'number') {
          var tempNetState = netState[custom['net_state']]
          if (tempNetState) {
            multiPortStatus += ('[' + tempNetState + ']')
          }
        }
        if (typeof custom['online_state'] === 'number') {
          multiPortStatus += onlineState[custom['online_state']]
        } else {
          multiPortStatus += '在线'
        }
      }
      return multiPortStatus
    }

    // demo自定义多端登录同步事件
    if (+data.type === 1) {
      if (+data.value === 1 || +data.value === 2 || +data.value === 3 || +data.value === 10001) {
        var serverConfig = JSON.parse(data.serverConfig)
        var customType = 0
        multiPortStatus = ''
        // 优先判断serverConfig字段
        if (serverConfig.online) {
          if (serverConfig.online.indexOf(4) >= 0) {
            multiPortStatus = '电脑'
            customType = 4
          } else if (serverConfig.online.indexOf(2) >= 0) {
            multiPortStatus = 'iOS'
            customType = 2
          } else if (serverConfig.online.indexOf(1) >= 0) {
            multiPortStatus = 'Android'
            customType = 1
          } else if (serverConfig.online.indexOf(16) >= 0) {
            multiPortStatus = 'Web'
            customType = 16
          } else if (serverConfig.online.indexOf(64) >= 0) {
            multiPortStatus = 'Mac'
            customType = 64
          }
        }
        if (data.custom && (Object.keys(data.custom).length > 0)) {
          var portStatus = getMultiPortStatus(customType, data.custom)
          // 如果serverConfig里有属性而custom里没有对应属性值
          if ((multiPortStatus !== '') && (portStatus === '')) {
            multiPortStatus += '在线'
          } else {
            multiPortStatus = portStatus
            // multiPortStatus += portStatus
          }
        } else if (customType !== 0) {
          multiPortStatus += '在线'
        } else {
          multiPortStatus = '离线'
        }
        return multiPortStatus
      }
    }
  }
  return '离线'
}

/**
 * 输出贴图表情对象，用于生成富文本图片节点
 * content:"{"type":3,"data":{"catalog":"ajmd","chartlet":"ajmd010"}}"
 */
function generateBigEmojiImageFile(content) {
  let prefix = 'http://yx-web.nosdn.127.net/webdoc/h5/emoji/'
  let file = { w: 100, h: 100, url: '' }
  file.url = `${prefix}${content.data.catalog}/${content.data.chartlet}.png`
  return file
}

/**
 * 处理图片富文本节点
 */
function generateImageNode(file) {
  // console.log(file)
  let width = 0, height = 0
  if (file.w > 250) {
    width = 200
    height = file.h / (file.w / 200)
  } else {
    width = file.w
    height = file.h
  }
  let richTextNode = []
  richTextNode.push({
    name: 'img',
    attrs: {
      width: `${width}rpx`,
      height: `${height}rpx`,
      src: file.url
    }
  })
  return richTextNode
}

/**
 * 生成富文本节点
 */
function generateRichTextNode(text,params) {
  if(!text){
    return
  }
  let tempStr = text
  let richTextNode = []
  let leftBracketIndex = tempStr.toString().indexOf('[')
  let rightBracketIndex = tempStr.toString().indexOf(']')
  let countOfWord = 0
  Array.from(tempStr).map(item => {
    if (item != '[' && item != ']') {
      countOfWord++
    }
  })
  if (leftBracketIndex == -1 || rightBracketIndex == -1 || countOfWord == 0) {//没有emoji
    richTextNode.push({
      type: 'text',
      text: tempStr,
      params,
      // ------------------------
      report: params&&params.type==='report'?true:false
    })
    return richTextNode
  }
  while (tempStr.length != 0) {
    leftBracketIndex = tempStr.indexOf('[')
    rightBracketIndex = tempStr.indexOf(']')
    if (leftBracketIndex == 0) { // 开头是[
      rightBracketIndex = tempStr.indexOf(']')
      if (rightBracketIndex == -1) {
        richTextNode.push({
          type: 'text',
          text: tempStr,
          params
        })
        tempStr = ''
      } else {
        let emojiName = tempStr.slice(0, rightBracketIndex + 1)
        if (emoji[emojiName]) { // 有效emoji
          richTextNode.push({
            name: 'img',
            attrs: {
              width: '30rpx',
              height: '30rpx',
              src: emoji[emojiName].img
            }
          })
        } else {//无效emoji
          richTextNode.push({
            type: 'text',
            text: emojiName
          })
        }
        tempStr = tempStr.substring(rightBracketIndex + 1, tempStr.length)
      }
    } else { // 开头不是[
      if (leftBracketIndex == -1) {// 最后全是文字
        richTextNode.push({
          type: 'text',
          text: tempStr.slice(0, tempStr.length),
          params
        })
        tempStr = ''
      } else {
        richTextNode.push({
          type: 'text',
          text: tempStr.slice(0, leftBracketIndex),
          params
        })
        tempStr = tempStr.substring(leftBracketIndex, tempStr.length + 1)
      }
    }
  }
  return richTextNode
}

/**
 * 体检报告消息节点信息转换
 */

function changeCustomParams(nodes){
  if (nodes && nodes.length) {
    if (nodes[0].report === true) {
      reportIcon[0].children[1].text = nodes[0].text
      reportIcon[0].params = nodes[0].params
      return JSON.parse(JSON.stringify(reportIcon))
    }
  }
}


/**
 * 提示消息节点信息转换
 */

function changeTipParams(pushPayload,text){
  if (pushPayload.params.patientId) {
    let strArray = text.split('xla1608191455016')
    if (strArray.length === 1) {
      let simpleIcon = JSON.parse(JSON.stringify(clinicIcon))
      simpleIcon[0].children[1].children[1].children[0].text = '诊断：' + text
      simpleIcon[0].params = pushPayload.params
      return JSON.parse(JSON.stringify(simpleIcon))
    }
    if (strArray.length === 3) {
      let checkIcon = JSON.parse(JSON.stringify(clinicIcon))
      checkIcon[0].children[1].children[1].children[0].text = strArray[1]
      checkIcon[0].children[1].children[0].children[0].text = strArray[0]
      checkIcon[0].children[1].children[1].children[0].text = '诊断：' + strArray[1]
      checkIcon[0].report = 'checkSpecial'
      checkIcon[0].params = pushPayload.params
      return JSON.parse(JSON.stringify(checkIcon))
    }
  }
}

/**
 * 创建im账号
 */

function createIMClient(clientId) {
  console.log('a'+clientId,'util',app.globalData.realtime);
  app.globalData.realtime.createIMClient('a'+clientId).then(function(clientName) {
    uni.setStorageSync('ImClientId','a'+clientId)
    console.log(`创建IM账号${'a'+clientId}`,'可以聊天了');
    app.globalData.imClient = clientName
  }).catch(console.error);
}

/**
 * 查询对话
 */

function getConversationInquiry(members,params) {
  const getConversationInquiry = () => {
    return app.globalData.imClient.getQuery().withLastMessagesRefreshed().containsMembers([members]).find();
  };
  return Promise.all([getConversationInquiry()]).then((res)=>{
    app.globalData.currentConversation = res[0][0]
    if(app.globalData.currentConversation){
      uni.redirectTo({
        url: `/pagesA/consulting/consultPage?${params}`
      })
    }
  })
}

/**
 * 创建对话聊天
 */

function createConversation(custom,name,members,params,pathWay) {
  app.globalData.imClient.createConversation({ // IMClient 实例
    members: members,
    name: name,
    unique: true
  }).then((conversation)=>{
    conversation.members = members
    conversation.name = name
    conversation.set('custom',custom)
    conversation.save();
    console.log(conversation,'创建对话成功');
    app.globalData.currentConversation = conversation
    uni.redirectTo({
      url: `/pagesA/consulting/consultPage?${params}`
    })
  }).catch(console.error)
}

module.exports = {
    NoToChinese,
    dateToString,
	calcTimeHeader,
	deepClone,
	showToast,
	dealMsg,
	updateMultiPortStatus,
    generateBigEmojiImageFile,
    generateImageNode,
    generateRichTextNode,
    changeCustomParams,
    changeTipParams,
    createIMClient,
    createConversation,
    getConversationInquiry
}
