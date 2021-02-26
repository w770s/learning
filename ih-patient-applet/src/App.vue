<script>
    import ENVIRONMENT_CONFIG from './config/envConfig.js'
    import {config} from './config/index.js'
    import {
        loginModel
    } from '@/models/login.js'
    const login = new loginModel()
	export default {
        globalData: {
            emitter: null,
            netcallController: null,
            ENVIRONMENT_CONFIG,
            ImTitleBarHeight: '',
            titleBarHeight: '',
            statusBarHeight: '',
            realtime: null,
            imClient: null,
            currentConversation: null
        },
        onShow: function(e) {
            let that = this
            uni.getSystemInfo({
                success: function(res) {
                    if (res.model.indexOf('iPhone') !== -1) {
                        that.titleBarHeight = 44;
                    } else {
                        that.titleBarHeight = 48;
                    }
                    that.statusBarHeight = res.statusBarHeight;
                    that.globalData.titleBarHeight = that.titleBarHeight
                    that.globalData.statusBarHeight = that.statusBarHeight
                    that.globalData.ImTitleBarHeight = that.titleBarHeight + that.statusBarHeight
                },

            })
        },
        onLaunch: function (e) {
            let userId = uni.getStorageSync('userInfo').userId
            if(!userId){
                login.getCommonToken().then(res=>{
                    ENVIRONMENT_CONFIG.Authorization = 'Bearer'+' '+res.data
                    uni.setStorageSync('Authorization','Bearer'+' '+res.data)
                    console.log(ENVIRONMENT_CONFIG.Authorization);
                }).catch(err=>{
                    console.log(err);
                })
            }
            // 第一步：初始化微信云函数
            console.log(ENVIRONMENT_CONFIG.cloudInitEnv);
            wx.cloud.init({
                env: ENVIRONMENT_CONFIG.cloudInitEnv,
                traceUser: true
            })
              // 第二步：获取用户的openid
            wx.cloud.callFunction({
                name: 'getOpen',	 // 打开微信云开发控制平台，左上角点击[云函数]
                data: {},
                success: res => {
                  // debugger
                  // 第三步(可省略)：缓存用户openid，方便后续再次调用
                  console.log('成功获取openid: ', res.result.openid)
                    if(res.result.openid){
                        config.openId = res.result.openid
                    }
                    if(res.result.unionid){
                        config.unionid = res.result.unionid
                    }
                },
                fail: err => {
                  console.error('获取失败：', err)
                }
            })
            let userInfo = wx.getStorageSync('userInfo')
            if (userInfo) {
                this.globalData.userInfo = userInfo
            }
            let systemInfo = wx.getSystemInfoSync()
            this.globalData.videoContainerSize = {
                width: systemInfo.windowWidth,
                height: systemInfo.windowHeight
            }
            this.globalData.isPushBeCallPage = false

            // const AV = require('./libs/leancloud-storage.js');
            const { Realtime, setAdapters, Event, debug } = require('./libs/leancloud-realtime.js');
            // const { TypedMessagesPlugin, ImageMessage } = require('./libs/typed-messages.min.js'); // 富文本
            // debug.enable();  // 启用
            const adapters = require('./libs/leancloud-adapters-weapp.js');
            // AV.setAdapters(adapters); // 为存储 SDK 设置 adapters
            setAdapters(adapters); // 为即时通讯 SDK 设置 adapters
            // AV.init({
            //     appId: 'AvIQcWgwhwdecvVE9zX6RDvL-gzGzoHsz',
            //     appKey: 'gPfQc79OtAvJYpQSCb8x4ADE',
            //     serverURL: "https://aviqcwgw.lc-cn-n1-shared.com",
            // });
            this.globalData.realtime = new Realtime({
                appId: 'AvIQcWgwhwdecvVE9zX6RDvL-gzGzoHsz',
                appKey: 'gPfQc79OtAvJYpQSCb8x4ADE',
                server: "https://aviqcwgw.lc-cn-n1-shared.com",
                // appId: 'LNqD4S0dGURsvBSfI14cS9Ky-gzGzoHsz',
                // appKey: '3Ttj0YRmhHwuitq33dtkgc5U',
                // server: "https://im.test.aihuihc.com",
                // plugins: [TypedMessagesPlugin], // 注册富媒体消息插件
            });
            this.globalData.realtime.on(Event.DISCONNECT, function() {
                console.log('服务器连接已断开');
            });
            this.globalData.realtime.on(Event.OFFLINE, function() {
                console.log('离线（网络连接已断开）');
            });
            this.globalData.realtime.on(Event.ONLINE, function() {
                console.log('已恢复在线');
            });
            this.globalData.realtime.on(Event.SCHEDULE, function(attempt, delay) {
                console.log(delay + ' ms 后进行第 ' + (attempt + 1) + ' 次重连');
            });
            this.globalData.realtime.on(Event.RETRY, function(attempt) {
                console.log('正在进行第 ' + (attempt + 1) + ' 次重连');
            });
            this.globalData.realtime.on(Event.RECONNECT, function() {
                console.log('与服务端连接恢复');
            });
            // todo
        },
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@font-face {
		font-family: 'iconfont';
		/* project id 1321685 */
		src: url('//at.alicdn.com/t/font_1321685_491t5ab58us.eot');
		src: url('//at.alicdn.com/t/font_1321685_491t5ab58us.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1321685_491t5ab58us.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1321685_491t5ab58us.woff') format('woff'),
			url('//at.alicdn.com/t/font_1321685_491t5ab58us.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1321685_491t5ab58us.svg#iconfont') format('svg');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.leftArrow:before {
		content: "\e60c";
	}

	.weight {
		font-weight: bold;
	}

	page {
		height: 100%;
		background-color: rgb(248, 248, 248);
	}
    button::after{ border: none; }
</style>
