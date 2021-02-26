<script>
    import ENVIRONMENT_CONFIG from './config/envConfig.js'
    import {loginModel} from '@/models/login.js'
    const login = new loginModel()
    import {config} from './config/index.js'
    const { Realtime, setAdapters } = require('./libs/leancloud-realtime.js');
    const adapters = require('./libs/leancloud-adapters-weapp.js');
    setAdapters(adapters); // 为即时通讯 SDK 设置 adapters
    const realtime = new Realtime({
        appId: 'AvIQcWgwhwdecvVE9zX6RDvL-gzGzoHsz',
        appKey: 'gPfQc79OtAvJYpQSCb8x4ADE',
        server: "https://aviqcwgw.lc-cn-n1-shared.com",
        // appId: 'LNqD4S0dGURsvBSfI14cS9Ky-gzGzoHsz',
        // appKey: '3Ttj0YRmhHwuitq33dtkgc5U',
        // server: "https://im.test.aihuihc.com",
    });
    export default {
        globalData: {
            emitter: null,
            netcallController: null,
            ENVIRONMENT_CONFIG,
            ImTitleBarHeight: '',
            titleBarHeight: '',
            statusBarHeight: '',
            realtime: realtime,
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
            let Authorization = uni.getStorageSync('Authorization')
            if(!Authorization){
                login.getCommonToken().then(res=>{
                    ENVIRONMENT_CONFIG.Authorization = 'Bearer'+' '+res.data
                    uni.setStorageSync('Authorization','Bearer'+' '+res.data)
                }).catch(err=>{
                    console.log(err);
                })
            }
            // 第一步：初始化微信云函数
            wx.cloud.init({
                env: ENVIRONMENT_CONFIG.cloudInitEnv,
                traceUser: true
            })
            // 第二步：获取用户的openid
            wx.cloud.callFunction({
                name: 'getOpen',	 // 打开微信云开发控制平台，左上角点击[云函数]
                data: {},
                success: res => {
                    // 第三步(可省略)：缓存用户openid，方便后续再次调
					// console.log(res)
                    // console.log('成功获取unionId: ', res.result.openid)
                    if(res.result.openid){
                        config.openId = res.result.openid
                    }
					if(res.result.unionid){
					    config.unionId = res.result.unionid
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

            // todo

        },
        onHide: function() {
            console.log('App Hide')
        }
    }
</script>

<style>
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
        /* background-color: rgb(248, 248, 248); */
    }
</style>
