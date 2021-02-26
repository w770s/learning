<template>
    <view>
        <u-bar :nav="setNav" :goLoginPage="true"/>
        <view class='recentchat-wrapper'>
            <view v-if="chatList.length == 0" class='no-recent'>
                <img class='no-recent-image' src="http://file.aihuihc.com/patient/patientImages/images/messageKnock.png" />
                <text class='no-recent-text'>暂无会话内容</text>
            </view>
            <view v-if="chatList.length != 0" v-for="(message,index) in chatList" :key="index">
                <u-swipedelete @deleteItem='catchDeleteTap(message,index)'>
                    <view @tap='switchToChating(message,index)' class='recentchat-item' hover-class='recentchat-item-hover'>
                        <img :src='message.avatar || defaultUserLogo' class='recentchat-item-img'></img>
                        <view class='recentchat-item-right'>
                            <view class='recentchat-item-top'>
                                <text class='recentchat-item-title'>
                                    {{message.nick}}
                                    <text class="isBtn">{{message.advisoryType==='1'?'健康咨询':'图文问诊'}}</text>
                                </text>
                                <text class='recentchat-item-time'>{{message.displayTime}}</text>
                            </view>
                            <view class='recentchat-item-bottom'>
                                <view style='display:flex;align-items:center;'>
                                    <text class='recentchat-item-desc'>{{message.lastMsg}}</text>
                                </view>
                                <view v-if="message.unread" class='recentchat-item-unread'>{{message.unread || ''}}
                                </view>
                            </view>
                        </view>
                    </view>
                </u-swipedelete>
            </view>
        </view>
    </view>
</template>

<script>
    import {calcTimeHeader} from '../../util/util.js'
    const app = getApp()
    const { Event, TextMessage } = require('../../libs/leancloud-realtime.js');
    export default {
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '我的消息'
                },
                // http://file.aihuihc.com/doctor/testMiniprogram41613809736626.jpg
                defaultUserLogo:  'http://file.aihuihc.com/patient/patientImages/images/default-icon.png',
                chatList: [], // [{account,nick,lastestMsg,timestamp,Time,message,unread}]
                chatAccount: {}, // {accountName: accountName} 备注:消息通知key为notification
                conversationList: [],
                ImClientId: ''
            }
        },
        onShow() {
            // 当前用户被添加至某个对话
            console.log(app.globalData.imClient);
            app.globalData.imClient.on(Event.INVITED, function invitedEventHandler(payload, conversation) {
                console.log('接受者被添加', payload.invitedBy, conversation.id);
            });
            // 当前用户收到了某一条消息，可以通过响应 Event.MESSAGE 这一事件来处理。
            app.globalData.imClient.on(Event.MESSAGE, function(message, conversation) {
                console.log('收到新消息：' + message.text);
                this.getIMessage()
            });
            this.getIMessage()
        },
        methods: {
            getIMessage(){
                let ImClientId = uni.getStorageSync('ImClientId')
                const getHealthInquiry = () => {
                    return app.globalData.imClient.getQuery().withLastMessagesRefreshed().containsMembers(['healthInquiry',ImClientId]).notEqualTo('custom.businessStatus',10002).find();
                };
                const getOnlineInquiry = () => {
                    return app.globalData.imClient.getQuery().withLastMessagesRefreshed().containsMembers(['onlineInquiry',ImClientId]).notEqualTo('custom.businessStatus',10002).find();
                };
                return Promise.all([getHealthInquiry(),getOnlineInquiry()]).then((datas)=>{
                    this.conversationList = datas[0].concat(datas[1])
                    console.log(datas[0],datas[1],this.conversationList,'就是想要的结果');
                    this.doTheFirst(datas[0],datas[1])
                })
            },
            /**
             * 捕获从滑动删除传递来的事件
             */
            catchDeleteTap(session,index) {
                let that = this
                wx.showModal({
                    title: '确认删除对话吗?',
                    success(res) {
                        if (res.confirm) {
                            app.globalData.currentConversation = that.conversationList[index]
                            if(app.globalData.currentConversation){
                                let conversation = app.globalData.currentConversation
                                conversation.set('custom.businessStatus',10002)
                                conversation.save();
                                that.getIMessage()
                            }
                        } else if (res.cancel) {
                            // 用户点击取消
                        }
                    }
                });
            },
            /**
             * 单击进入聊天页面
             */
            switchToChating(message,index) {
                console.log(message,app.globalData.currentConversation,this.conversationList[index],'查询对话数据');
                app.globalData.currentConversation = this.conversationList[index]
                uni.redirectTo({
                    url: `/pagesA/consulting/consultPage`
                })
            },
            /**
             * 判断消息类型，返回提示
             */
            judgeMessageType(rawMsg) {
                rawMsg = rawMsg || {}
                let msgType = ''
                if (rawMsg.type === 'image') {
                    msgType = '[图片]'
                } else if (rawMsg.type === 'video') {
                    msgType = '[视频]'
                } else if (rawMsg.type === 'tip') {
                    msgType = '[提醒消息]'
                } else if (rawMsg.type === 'geo') {
                    msgType = '[位置]'
                } else if (rawMsg.type === 'audio') {
                    msgType = '[语音]'
                } else if (rawMsg.type === 'emoji') {
                    msgType = '[贴图表情]'
                }
                return msgType
            },
            changeLastMesTime(attr){
                if(attr){
                    return attr.time?calcTimeHeader(attr.time):''
                }
                else{ return '' }
            },
            /**
             * 将原生消息转化为最近会话列表渲染数据
             */
            convertRawMessageListToRenderChatList(dataList) {
                let chatList = []
                dataList.map((msg)=>{
                    let custom = msg._attributes.custom
                    let lastMsg = msg.lastMessage?this.judgeMessageType(msg.lastMessage.attributes):''
                    if(msg.lastMessage&&custom){
                        console.log(msg.lastMessage,custom,'test nickTo');
                        chatList.push({
                            members: msg.members,
                            nick: custom.doctorNick,
                            avatar: custom.doctorAvatar,
                            advisoryType: custom.advisoryType,
                            businessStatus: custom.businessStatus,
                            orderId: custom.orderId,
                            orderNumber: custom.orderNumber,
                            canTalk: custom.canTalk,
                            alreadyTalk: custom.alreadyTalk,
                            lastMsg: lastMsg || msg.lastMessage.text,
                            unread: msg.unreadMessagesCount,
                            displayTime: this.changeLastMesTime(msg.lastMessage.attributes)
                        })
                    }
                })
                // 排序
                chatList.sort((a, b) => {
                    return b.timestamp - a.timestamp
                })
                return chatList
            },
            doTheFirst(healthList,onlineList){
                let healthInquiry = this.convertRawMessageListToRenderChatList(healthList)
                let onlineInquiry = this.convertRawMessageListToRenderChatList(onlineList)
                this.chatList = healthInquiry.concat(onlineInquiry)
				console.log(this.chatList)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .recentchat-wrapper {
        width: 100%;
        padding: 0 22rpx;
        box-sizing: border-box;
        background-color: #fff;
        min-height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .recentchat-wrapper:first-child {
        border-top: 1px solid rgba(220, 220, 220, 0.5);
    }

    .no-recent {
        width: 100%;
        position: fixed;
        top: 20%;
        color: #ccc;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: -20rpx;
    }

    .no-recent-image {
        height: 360rpx;
        width: 360rpx;
        margin-bottom: 40rpx;
    }

    .no-recent-text {
        width: 100%;
        font-size: 20px;
        color:#333333;
        text-align: center;
    }

    /* 循环列表条目样式 */
    .recentchat-item {
        width: 100%;
        height: 132rpx;
        padding: 20rpx 28rpx 20rpx 0;
        box-sizing: border-box;
        display: flex;
        border-bottom: 1px solid rgba(220, 220, 220, 0.5);
    }

    .recentchat-item-img {
        width: 100rpx;
        height: 100rpx;
        margin-right: 24rpx;
        box-sizing: border-box;
        display: flex;
        align-self: center;
        border-radius: 100%;
    }

    .recentchat-item-right {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-around;
    }

    .recentchat-item-right .recentchat-item-message {
        font-size: 28rpx;
        color: #ccc;
        word-break: break-all;
    }

    .recentchat-item-top {
        align-self: flex-start;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        height: 44rpx;
        line-height: 44rpx;
        font-size: 36rpx;
    }

    .recentchat-item-bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        /* align-self: flex-start; */
        font-size: 28rpx;
        color: #9B9B9B;
        height: 44rpx;
        line-height: 44rpx;
    }

    .recentchat-item-bottom .recentchat-item-desc {
        max-width: 400rpx;
        overflow: hidden;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .recentchat-item-bottom .recentchat-item-unread {
        background: #F43530;
        border-radius: 16rpx;
        width: 52rpx;
        height: 36rpx;
        line-height: 36rpx;
        text-align: center;
        font-size: 22rpx;
        color: #fff;
    }

    .recentchat-item-top .recentchat-item-title {
        overflow: hidden;
        max-width: 330rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 32rpx;
    }

    .recentchat-item-top .recentchat-item-time {
        font-size: 24rpx;
        color: #9B9B9B;
    }

    .isBtn {
        margin-left: 10px;
        font-size: 12px;
        padding: 0 5px;
        color: #2884FF;
        border: 1px solid #2884FF;
        border-radius: 2px;
    }
</style>

