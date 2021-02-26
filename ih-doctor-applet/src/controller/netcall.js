import NetcallWeixin from '../vendors/NIM_Web_Netcall_weixin_v6.8.0.js'
import NIM from '../vendors/NIM_Web_NIM_weixin_v6.8.0.js'
import Emitter from '../util/emitter.js'
import store from '@/store/index.js'
let app = getApp()

export default class NetcallController {
  constructor(props) {
    NIM.use(NetcallWeixin)
    NetcallWeixin.destroy()
    this.netcall = app.globalData.netcall = NetcallWeixin.getInstance(props)
    app.globalData.emitter = new Emitter()
    this.bindNetcallEvent()

    this.state = {
      onTheCall: false, // 正在通话中
    }
  }
  bindNetcallEvent() {
    this.netcall.on('syncDone', (data) => {
      app.globalData.emitter.emit('syncDone', data)
    })
    this.netcall.on('clientLeave', (data) => {
      app.globalData.emitter.emit('clientLeave', data)
    })
    this.netcall.on('clientJoin', (data) => {
      // {account,cid,mode,uid,url}
      this.state.onTheCall = true // 标记正在通话
      app.globalData.emitter.emit('clientJoin', data)
    })
    this.netcall.on('callRejected', (data) => {
      app.globalData.emitter.emit('callRejected', data)
    })
    this.netcall.on('callAccepted', (data) => {
      app.globalData.emitter.emit('callAccepted', data)
    })
    this.netcall.on('beCalling', (data) => {
      // {caller,cid,type}
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      if (currentPage.route.includes('videoCall') === false && app.globalData.isPushBeCallPage == false) { // 不在多人通话中，才提示
        if (!currentPage) {
          wx.navigateTo({
            url: `/partials/videoCall/videoCall?beCalling=true&caller=${data.caller}&cid=${data.cid}&type=${data.type}`,
          })
          app.globalData.isPushBeCallPage = true
          return
        }
        let netcallGroupCallInfo = store.state.user.netcallGroupCallInfo
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        if (Object.keys(netcallGroupCallInfo).length === 0) { // p2p视频
          if (!currentPage.route.includes('videoCall') && app.globalData.isPushBeCallPage == false) {
            wx.navigateTo({
              url: `/partials/videoCall/videoCall?beCalling=true&caller=${data.caller}&cid=${data.cid}&type=${data.type}`,
            })
            app.globalData.isPushBeCallPage = true
          }
        }
      }
      app.globalData.emitter.emit('beCalling', data)
    })
    this.netcall.on('callerAckSync', (data) => {
      // {timetag,type,fromClientType:number,cid,accepted}
      wx.showToast({
        title: '已在其他端处理！',
        duration: 2000,
        icon: 'none',
        success: function() {
          setTimeout(() => {
            let pages = getCurrentPages()
            let currentPage = pages[pages.length - 1]
            if (currentPage.route.includes('videoCall') || currentPage.route.includes('videoCallMeeting')) {
              wx.navigateBack(1)
            }
          }, 2000)
        }
      })
    })
    this.netcall.on('hangup', (data) => {
      this.state.onTheCall = false // 标记正在通话
      app.globalData.emitter.emit('hangup', data)
    })
    this.netcall.on('control', (data) => {
      // {cid,account,command}
      app.globalData.emitter.emit('control', data)
    })
    this.netcall.on('joinChannel', (data) => {
      // {uid,account,cid}
      app.globalData.emitter.emit('joinChannel', data)
    })
    this.netcall.on('clientUpdate', (data) => {
    })
    this.netcall.on('error', (error) => {
    })
    this.netcall.on('open', (data) => {
    })
    this.netcall.on('willreconnect', (data) => {
      // 直播通道准备重连
      app.globalData.emitter.emit('willreconnect', data)
    })
    this.netcall.on('sendCommandOverTime', (data) => {
    })
    this.netcall.on('liveRoomClose', (data) => {
    })
    this.netcall.on('sessionDuration', (data) => {
    })
  }
}
