<template>
	<view>
		<u-topBar :nav="setNav"/>
		<view class="uni-imType-choose">
			<view @tap="arrayShowType(true)" :class="['uni-imType-defaultChoose',chooseConsult?'uni-imType-sureChoose':'uni-imType-notChoose']">
				健康咨询
				<view  v-show="chooseConsult" class="uni-imType-tabs"></view>
			</view>
			<view @tap="arrayShowType(false)" :class="['uni-imType-defaultChoose',!chooseConsult?'uni-imType-sureChoose':'uni-imType-notChoose']">
				图文问诊
				<view v-show="!chooseConsult" class="uni-imType-tabs"></view>
			</view>
		</view>
		<view class='recentchat-wrapper'>
			<view v-if="centerShowArray.length == 0 || !isLogin" class='no-recent'>
				<img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
				<text class='no-recent-text'>暂无会话内容</text>
			</view>
			<view class="uni-businessType-choose" v-if="!chooseConsult">
				<view @tap="arrayShowBusiness('进行中')" style="border-radius: 16rpx 0rpx 0rpx 16rpx;" :class="['uni-businessType-defaultChoose',sureOn?'uni-businessType-sureChoose':'uni-businessType-notChoose']">进行中</view>
				<view @tap="arrayShowBusiness('已完成')" style="border-radius: 0rpx 16rpx 16rpx 0rpx;" :class="['uni-businessType-defaultChoose',!sureOn?'uni-businessType-sureChoose':'uni-businessType-notChoose']">已完成</view>
			</view>
			<view v-if="centerShowArray.length != 0 && isLogin" v-for="(message,index) in centerShowArray" :key="index">
				<swipe-delete @deleteItem='catchDeleteTap(message,index)'>
					<view @tap='switchToChating(message,index)' class='recentchat-item' hover-class='recentchat-item-hover'>
						<img :src='message.avatar || defaultUserLogo' class='recentchat-item-img'></img>
						<view class='recentchat-item-right'>
							<view class='recentchat-item-top'>
								<text class='recentchat-item-title'>
									{{message.nick}}
									<text class="recentchat-item-status">{{message.advisoryType==='1'?'健康咨询':'图文问诊'}}</text>
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
				</swipe-delete>
			</view>
		</view>
	</view>
</template>

<script>
	import {calcTimeHeader} from '../../util/util.js'
	import swipeDelete from '@/components/swipedelete.vue'
	import {loginModel} from '@/models/login.js'
	const login = new loginModel()
	const app = getApp()
	const { Event, TextMessage } = require('../../libs/leancloud-realtime.js');
	export default {
		components: {
			swipeDelete
		},
		data() {
			return {
				chooseConsult: true,
				sureOn: true,
				setNav: {
					'isdisPlayNavTitle': false,
					'navTitle': '我的消息',
					'bg': '#FFFFFF',
					'textColor': '#333333'
				},
				isLogin: false,
				userUrl: '',
				doctorImage: 'http://file.aihuihc.com/ih-doctor-applet/image/doctorImage.png',
				defaultUserLogo:  require('../../image/default-icon.png'),
				loginUserAccount: '',
				centerShowArray: [],
				simpleConsult: [],
				clinicOn: [],
				clinicDone: [],
				chatList: [], // [{account,nick,lastestMsg,type,timestamp,displayTime,message,unread,status}]
				chatAccount: {}, // {accountName: accountName} 备注:消息通知key为notification
				unread: '',
				translateX: 0,
				orderId: '',
				orderNumber: '',
				canTalk: '20',
				alreadyTalk: '0',
				imList: [],
				imAccount: '',
				phone: ''
			}
		},
		onLoad(){
		},
		onShow() {
			if(wx.getStorageSync('phone')){
				this.phone = wx.getStorageSync('phone')
				if(uni.getStorageSync('chooseConsult')!==''){
					this.chooseConsult = uni.getStorageSync('chooseConsult')
				}
				this.getDoctorByPhone()
				// 当前用户被添加至某个对话
				console.log(app.globalData.imClient,'查询对话');
				if(app.globalData.imClient){
					let that = this
					app.globalData.imClient.on(Event.INVITED, function invitedEventHandler(payload, conversation) {
						console.log('接受者被添加', payload.invitedBy, conversation.id);
					});
					// 当前用户收到了某一条消息，可以通过响应 Event.MESSAGE 这一事件来处理。
					app.globalData.imClient.on(Event.MESSAGE, function(message, conversation) {
						console.log('收到新消息：' + message.text);
						that.getIMessage()
					});
					this.getIMessage()
				}
			}else{
				this.isLogin = false
				uni.removeTabBarBadge({
					index: 0
				})
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '../login/guide'
							})
						} else if (res.cancel) {
							// 用户点击取消
						}
					}
				})
			}
		},
		methods: {
			getIMessage(){
				let ImClientId = uni.getStorageSync('ImClientId')
				const getHealthInquiry = () => {
					return app.globalData.imClient.getQuery().withLastMessagesRefreshed().containsMembers(['healthInquiry',ImClientId]).notEqualTo('custom.businessStatus',10002).find();
				};
				const getOnlineGoing = () => {
					return app.globalData.imClient.getQuery().withLastMessagesRefreshed().containsMembers(['onlineInquiry',ImClientId]).lessThan('custom.businessStatus',10001).find();
				};
				const getOnlineDone = () => {
					return app.globalData.imClient.getQuery().withLastMessagesRefreshed().containsMembers(['onlineInquiry',ImClientId]).equalTo('custom.businessStatus',10001).find();
				};
				return Promise.all([getHealthInquiry(),getOnlineGoing(),getOnlineDone()]).then((datas)=>{
					console.log(datas[0],datas[1],datas[2],'就是想要的结果');
					this.simpleConsult = datas[0]
					this.clinicOn = datas[1]
					this.clinicDone = datas[2]
					this.doTheFirst()
				})
			},
			arrayShowType(type){
				this.chooseConsult = type
				uni.setStorageSync('chooseConsult',this.chooseConsult)
				this.doTheFirst()
			},
			arrayShowBusiness(type){
				if(type==='进行中'){
					this.sureOn = true
					this.doTheFirst()
				}
				if(type==='已完成'){
					this.sureOn = false
					this.doTheFirst()
				}
			},
			getDoctorByPhone(){
				let that = this
				const data = {
					phone: this.phone
				}
				login.getDoctorByPhone(data).then(res=>{
					that.isLogin = true
					if(res.data.doctorIms.length){
						this.imList = res.data.doctorIms
						let urlItem = res.data.doctorImageList.filter(item => {
							return item.imageType === 1
						})
						if(urlItem.length !== 0){
							this.userUrl = urlItem[0].url
						}else{
							this.userUrl = this.doctorImage
						}
						this.arrayShowType(this.chooseConsult)
						uni.setStorageSync('imList',res.data.doctorIms)
					}
					wx.setStorageSync('doctorId',res.data.hisDoctorId)
					wx.setStorageSync('doctorMes',JSON.stringify(res.data))
				}).catch((err)=>{
					this.isLogin = false
					wx.clearStorage()
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
							if(that.chooseConsult){
								app.globalData.currentConversation = that.simpleConsult[index]
							}
							if(!that.chooseConsult && that.sureOn){
								app.globalData.currentConversation = that.clinicOn[index]
							}
							if(!that.chooseConsult && !that.sureOn){
								app.globalData.currentConversation = that.clinicDone[index]
							}
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
				console.log(message,'消息列表');
				uni.setStorageSync('imAccount',message.nick) // todo
				uni.setStorageSync('advisoryType',message.advisoryType)
				if(this.chooseConsult){
					app.globalData.currentConversation = this.simpleConsult[index]
				}
				if(!this.chooseConsult && this.sureOn){
					app.globalData.currentConversation = this.clinicOn[index]
				}
				if(!this.chooseConsult && !this.sureOn){
					app.globalData.currentConversation = this.clinicDone[index]
				}
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
				console.log(chatList);
				dataList.map((msg)=>{
					let custom = msg._attributes.custom
					let lastMsg = msg.lastMessage?this.judgeMessageType(msg.lastMessage.attributes):''
					if(msg.lastMessage){
						chatList.push({
							members: msg.members,
							nick: custom.patientNick,
							avatar: custom.patientAvatar,
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
				this.chatList = chatList
				this.unread = 0
				chatList.forEach((item)=>{
					if(chatList.length<2){
						this.unread = item.unread
					}else{
						this.unread += item.unread
					}
				})
				if(this.unread!=0){
					uni.setTabBarBadge({
						index: 0,
						text: this.unread+''
					})
				}
				if(this.unread===0){
					uni.removeTabBarBadge({
						index: 0
					})
				}
				return chatList
			},
			doTheFirst(){
				if(this.chooseConsult){
					this.centerShowArray = this.convertRawMessageListToRenderChatList(this.simpleConsult)
				}
				if(!this.chooseConsult && this.sureOn){
					this.centerShowArray = this.convertRawMessageListToRenderChatList(this.clinicOn)
				}
				if(!this.chooseConsult && !this.sureOn){
					this.centerShowArray = this.convertRawMessageListToRenderChatList(this.clinicDone)
				}
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
		top: 30%;
		color: #ccc;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: -20rpx;
	}
	.no-recent-image {
		text-align: center;
		height: 180px;
		width: 180px;
		margin-top:80px;
		margin-bottom:50px;

	}
	.no-recent-text {
		width: 100%;
		text-align: center;
	}

	.uni-imType-choose{
		display: flex;
		justify-content: space-between;
		width: 100%;
		border: 1px solid #E5E5E5;
		border-left: none;
		border-right: none;
		font-size: 30rpx;
		color: #333333;
		padding: 0rpx 40rpx;
		box-sizing: border-box;
		position: relative;
		.uni-imType-tabs{
			position: absolute;
			height: 4rpx;
			width: 64rpx;
			background: #2884FF;
			border-radius: 2rpx;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.uni-imType-defaultChoose{
		height: 90rpx;
		width: 50%;
		text-align: center;
		line-height: 90rpx;
		position: relative;
	}
	.uni-imType-sureChoose{
		font-weight: bold;
	}
	.uni-imType-notChoose{
		font-weight: normal;
	}
	.uni-businessType-choose{
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 92rpx;
		line-height: 52rpx;
		padding: 20rpx 120rpx;
		box-sizing: border-box;
		font-size: 26rpx;
	}
	.uni-businessType-defaultChoose{
		width: 50%;
		text-align: center;
	}
	.uni-businessType-sureChoose{
		color: #ffffff;
		border: 1px solid #5EA6F8;
		background: linear-gradient(90deg, #5EA6F8 0%, #3B7CF4 100%);
	}

	.uni-businessType-notChoose{
		color: #B2B2B2;
		border: 1px solid #CACACA;
		background: #ffffff;
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
		position: relative;
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
		font-size: 28rpx;
		color: #9B9B9B;
		height: 44rpx;
		line-height: 44rpx;
		.recentchat-item-bottomBox {
			display:flex;
			align-items:center;
		}
	}
	.recentchat-item-bottom .recentchat-item-desc {
		max-width: 400rpx;
		overflow: hidden;
		display: inline-block;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.recentchat-item-bottom .recentchat-item-unread {
		position: absolute;
		left: 80rpx;
		top: 25rpx;
		background: #F43530;
		border-radius: 18px;
		width: 15px;
		height: 15px;
		line-height: 15px;
		text-align: center;
		font-size: 10px;
		color: #fff;
	}
	.recentchat-item-top .recentchat-item-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 32rpx;
	}
	.recentchat-item-top .recentchat-item-status {
		font-size: 12px;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		color: #fff;
		padding: 1px 5px 1px 5px;
		margin-left: 10px;
		border-radius: 3px;
	}
	.recentchat-item-top .recentchat-item-time {
		font-size: 24rpx;
		color: #9B9B9B;
	}
	/* 删除按钮样式 */
	.swipedelete-btn {
		position: absolute;
		top: 0;
		right: -160rpx;
		text-align: center;
		background: #ffcb20;
		color: #fff;
		width: 160rpx;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
