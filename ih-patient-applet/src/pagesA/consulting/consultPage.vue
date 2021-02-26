<template>
	<view>
		<u-bar :nav="setNav" :route="'/pagesA/myNews/index'" />

		<view v-if="advisoryType==='1'" :style="{ top: top + 'px'}" class='chating-history'>
<!--			<view>-->
<!--				<text style="margin-left:12px;">当前对话 <text style="color:#2884FF;margin-left:3px;">{{alreadyTalk}}</text></text>-->
<!--				<text style="margin-left:18px;">可对话 <text style="color:#2884FF;margin-left:3px;">{{canTalk}}</text></text>-->
<!--			</view>-->
			<view>
				<view v-if="status===1" class='chating-history-right-button' @tap="cancelPay">取消对话</view>
				<view v-if="status===5" class='chating-history-right-button' @tap="overConsult">完成咨询</view>
			</view>
		</view>
		<!-- 非模态框提示是否接受问诊 -->
		<view v-if="advisoryType==='2'" :style="{ top: top + 'px'}" class='chating-history'>
			<view>
				<view v-if="status===1" class='chating-history-right-button' @tap="cancelPay">取消订单</view>
				<view v-if="status===5" class='chating-history-right-button' @tap="confirmInquiry">完成问诊</view>
			</view>
		</view>

		<view class='chating-wrapper' @click.stop.prevent='chatingWrapperClick'>
			<!-- 消息记录 -->
			<view :class="['record-wrapper']" id="recordWrapper" :style="{ transform: `translateY(-${inputBottomPadding}rpx)`}">
				<view v-for="(message,index) in messageArr" :key="message.time">
					<view class='record-item-time-wrapper' v-if="message.displayTimeHeader != ''">
						<text class='record-item-time'>{{message.displayTimeHeader}}</text>
					</view>
					<view v-if="message.sendOrReceive == 'send'" :class="['record-chatting-item',message.sendOrReceive === 'send' ? 'self' : '']"
					 :style="{'justify-content': message.type === 'tip' ? 'center' : 'flex-end'}"
					 @longpress='showEditorMenu(index)'>
						<view v-if="message.type === 'video'" @tap.stop.prevent='requestFullScreenVideo(message.video)' class='small-video-wrapper'>
							<img style="width: 50rpx;height: 50rpx;position: absolute;z-index:1;" src="http://file.aihuihc.com/patient/patientImages/images/newHome/play.png"></img>
							<video style="width: 200rpx;height: 200rpx;position: absolute;border-radius: 16rpx;" :src="message.video.url"
							 :initial-time="0.01" :show-fullscreen-btn="false" :show-play-btn="false" :show-center-play-btn="false"
							 :controls="false"></video>
						</view>
						<view v-if="message.type === 'audio'" class='audio-wrapper' @tap.stop.prevent='playAudio(message.audio)' style='background-color:#3387FF;color: #000;'>
							<img :src='iconBase64Map.iconVoiceWhite' class='image' />
							<text class='text'>{{message.audio.dur / 1000 << 1 >> 1}}''</text>
						</view>
						<rich-text @tap="playImage(message.nodes[0].attrs)" v-if="message.type === 'image'" class='record-chatting-item-text nobg'
						 :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'emoji'" class='record-chatting-item-text nobg' :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'text' || (message.type === 'custom'&&!message.nodes[0].report)"
						 :class="['record-chatting-item-text']" :nodes="message.nodes"></rich-text>
						<rich-text @tap="getMes(message)" v-if="message.type === 'custom'&&message.nodes[0].report" class='record-chatting-item-text record-chatting-item-nodes record-chatting-item-underline'
						 :nodes="message.nodes"></rich-text>

						<rich-text v-if="message.type === 'tip'" class='tip-rich-text' :nodes="message.nodes"></rich-text>
						<text v-if="message.type !== 'tip' && message.type !== 'image' && message.type !== 'video' && message.type !== 'geo' && message.type !== 'emoji'"
						 :class="[message.type === 'custom'&&message.nodes[0].report?'right-triangle-report':'right-triangle']"></text>
						<img v-if="message.type !== 'tip'" :src="message.avatar" class='record-chatting-item-img' />
					</view>

					<view v-if="message.sendOrReceive == 'receive'" :class="['record-chatting-item',message.sendOrReceive === 'receive' ? 'other': '']"
					 :style="{'justify-content': message.type === 'tip' || message.type === 'notification' ? 'center !important' : 'flex-end'}"
					>
						<img v-if="message.type !== 'tip'" data-account='message.from' :src='message.avatar' class='record-chatting-item-img' />
						<text v-if="message.type !== 'tip' && message.type !== 'notification' && message.type !== 'image' && message.type !== 'video' && message.type !== 'geo' && message.type !== 'emoji' "
						 class='left-triangle'></text>
						<view v-if="message.type === 'video'" @tap.stop.prevent='requestFullScreenVideo(message.video)' class='small-video-wrapper'>
							<img style="width: 50rpx;height: 50rpx;position: absolute;z-index:1;" src="http://file.aihuihc.com/patient/patientImages/images/newHome/play.png"></img>
							<video style="width: 200rpx;height: 200rpx;position: absolute;border-radius: 16rpx;" :src="message.video.url"
							 :initial-time="0.01" :show-fullscreen-btn="false" :show-play-btn="false" :show-center-play-btn="false"
							 :controls="false"></video>
						</view>
						<view v-if="message.type === 'audio'" @tap.stop.prevent='playAudio(message.audio)' class='audio-wrapper'>
							<img :src='iconBase64Map.iconVoiceGrey' class='image'></img>
							<text class='text' style='color:#000;'>{{message.audio.dur / 1000 << 1 >> 1}}''</text>
						</view>
						<rich-text @tap="playImage(message.nodes[0].attrs)" v-if="message.type === 'image'" class='record-chatting-item-text nobg'
						 :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'emoji'" class='record-chatting-item-text nobg' :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'text' || message.type === 'custom'"
						 class='record-chatting-item-text' style='color:#000;background-color:#fff;' :nodes="message.nodes"></rich-text>
						<rich-text @tap="getMes(message)" v-if="message.type === 'tip'" class='tip-rich-text'
						 :nodes="message.nodes"></rich-text>
					</view>
				</view>
			</view>
			<!--底部输入框 -->
			<view :style="{bottom:inputBottom+'px'}" v-if="status==0||status===1||status===5" class='chatinput-wrapper'
			 @tap.stop.prevent="">
				<view class='chatinput-content'>
					<img v-if="sendType === 0" src="http://file.aihuihc.com/patient/patientImages/images/voice.png" class='chatinput-img'
					 @tap.stop.prevent='switchSendType'></img>
					<img v-else src="http://file.aihuihc.com/patient/patientImages/images/keyboard.png" class='chatinput-img'
					 @tap.stop.prevent='switchSendType'></img>
					<input type="text" style='margin-bottom: 10px;' v-if="sendType === 0" :value='inputValue' :focus='focusFlag'
					 :adjust-position="false" @input='inputChange' @focus='inputFocus' @blur='inputBlur' @confirm='inputSend' class='chatinput-input'
					 placeholder="输入文字" confirm-type='send'>
					</input>
					<button v-if="sendType == 1" :class="[isLongPress ? 'chatinput-voice-mask chatinput-voice-mask-hover' : 'chatinput-voice-mask']"
					 hover-class="none" @touchstart='longPressStart' @touchend='longPressEnd'>
						{{isLongPress ? '松开结束' : '按住说话'}}
					</button>
					<img src='http://file.aihuihc.com/patient/patientImages/images/more.png' @tap.stop.prevent='toggleMore' class='chatinput-img fr'></img>
					<img src='http://file.aihuihc.com/patient/patientImages/images/emoji.png' @tap.stop.prevent='toggleEmoji' class='chatinput-img fr emoji'></img>
				</view>
				<view v-if="emojiFlag" @tap.stop.prevent="" class='chatinput-subcontent'>
					<u-emoji @EmojiClick="emojiCLick" @EmojiSend="emojiSend"></u-emoji>
				</view>
				<view v-if="moreFlag" class='more-subcontent'>
					<view style='display:flex;'>
						<view class='more-subcontent-item' @tap.stop.prevent='chooseImageToSend'>
							<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/picture.png" />
							<text class='text'>图片</text>
						</view>
						<view class='more-subcontent-item' @tap.stop.prevent='chooseImageOrVideo'>
							<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/video.png" />
							<text class='text'>视频</text>
						</view>
						<view class='more-subcontent-item' @tap.stop.prevent='showTipMessagePanel'>
							<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/report.png" />
							<text class='text'>报告</text>
						</view>
					</view>
				</view>
			</view>
			<!--底部输入框  -->
			<view v-if="status===3||status===4||status===7" class='chatinput-wrappers'>
				<view v-if="advisoryType==='1'" @tap="goforConsult(1)" class='uni-goConsult-button'>
					去咨询
				</view>
				<view v-if="advisoryType==='2'" @tap="goforConsult(2)" class='uni-goConsult-button'>
					去问诊
				</view>
			</view>
			<view v-if="status===6" class='chatinput-wrappers'>
				<view @tap="goEvaluate" class='uni-goConsult-button'>
					对医生进行评价
				</view>
			</view>
		</view>

		<u-popup ref="popup" :maskClick="twoData" type="bottom">
			<view class="uni-bottom-select">
				<view @click="closePopcom" style="text-align: left;color:#B2B2B2;"><text style="margin-left:10px;">算了</text></view>
				<view style="text-align: center;font-weight:bold;">选择报告</view>
				<view @click="surePopcom" style="text-align: right;color:#2884FF;"><text style="margin-right:10px;">确认</text></view>
			</view>
			<view style="height:50px;"></view>
			<view v-if="medicalList.length>0">
				<view class='uni-select-box' @tap.prevent.stop="radioTap(index)" v-for="(item,index) in medicalList" :key="index">
					<view style="display: flex;">
						<view :class="['uni-select-all',item.checked?'uni-select-name':'uni-select-default']">{{item.personalName}}</view>
						<view class='uni-select-mes'>
							<view style="color:#333333;font-size: 15px;font-weight:bold;">{{item.packageName}}</view>
							<view :class="[item.abnormal?'uni-color-error':'uni-color-normal']">报告结果:
								{{item.checkupResult?item.checkupResult:'暂无'}}</view>
							<view style="color:gray;">体检时间: {{item.signTime?formatterDate(item.signTime):'暂无'}}</view>
						</view>
					</view>
					<view class='uni-select-img'>
						<radio color="#2984FF" :checked="item.checked" />
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		showToast,
		generateBigEmojiImageFile,
		generateImageNode,
		calcTimeHeader,
		generateRichTextNode,
		changeCustomParams,
		changeTipParams
	} from '../../util/util.js'
	import OBSupload from '@/obs/OBSUploadFile.js'
	import * as iconBase64Map from '../../util/imageBase64.js';
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	import {
		consultationModel
	} from '@/models/consultationOrder.js'
	const consultation = new consultationModel()
	import {
		healthyCardModel
	} from '@/models/healthyCard.js'
	const healthy = new healthyCardModel()
	const { TextMessage } = require('../../libs/leancloud-realtime.js')
	const app = getApp()
	export default {
		data() {
			return {
				checkIcon: [],
				count: 0,
				twoData: false,
				medicalListClone: [],
				medicalList: [],
				showSlectOption: [],
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': ''
				},
				videoSrc: '', // 视频源
				recorderManager: null, // 微信录音管理对象
				recordClicked: false, // 判断手指是否触摸录音按钮
				iconBase64Map: {}, //发送栏base64图标集合
				isLongPress: false, // 录音按钮是否正在长按
				chatWrapperMaxHeight: 0, // 聊天界面最大高度
				defaultUserLogo: 'http://file.aihuihc.com/patient/patientImages/images/default-icon.png',
				focusFlag: false, //控制输入框失去焦点与否
				emojiFlag: false, //emoji键盘标志位
				moreFlag: false, // 更多功能标志
				tipFlag: false, // tip消息标志
				tipInputValue: '', // tip消息文本框内容
				sendType: 0, //发送消息类型，0 文本 1 语音
				messageArr: [], //[{text, time, sendOrReceive: 'send', displayTimeHeader, nodes: []},{type: 'geo',geo: {lat,lng,title}}]
				originMessages: [], // im原始消息
				inputValue: '', //文本框输入内容
				user: {}, // 一期健康咨询用户im携带参数
				// todo
				businessType: '',
				advisoryType: '',
				patientId: '',
				bookingNo: '',
				orderId: '',
				orderNumber: '',
				price: '',
				canTalk: '20',
				alreadyTalk: '0',
				top: app.globalData.ImTitleBarHeight,
				status: '',
				inputBottom: 0,
				inputBottomPadding: 0,
				lastMessage: '',
				conversationCustom:{},
				messageLimit: 0,
			}
		},
		onUnload() { // todo
			// 更新当前会话对象账户
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.messageLimit++
			uni.stopPullDownRefresh();
			if(this.messageLimit>1){
				this.drawPoint(true)
				this.initImCustom()
				this.initShow(false)
			}
			if(this.messageLimit===1){
				console.log(12312);
				this.scrollToBottom()
			}
			console.log(this.messageLimit);
		},
		onLoad(options) {
			uni.startPullDownRefresh();
			console.log(options, 'options')
			let chatWrapperMaxHeight = wx.getSystemInfoSync().windowHeight - 52 - 35
			this.iconBase64Map = iconBase64Map
			this.chatWrapperMaxHeight = chatWrapperMaxHeight
			if (options.user) {
				this.user = JSON.parse(options.user)
				this.drawPoint()
				this.initImCustom()
				this.scrollToBottom()
				this.firstReport()
			}
		},
		onShow() {
			this.drawPoint()
			this.initImCustom()
		},
		computed:{
			hasNewMes() {
				// console.log(app.globalData.currentConversation,app.globalData.currentConversation.lastMessage,'收到消息');
				if (app.globalData.currentConversation.unreadMessagesCount) {
					app.globalData.currentConversation.read();
				}
				return app.globalData.currentConversation.lastMessage
			}
		},
		watch: {
			hasNewMes:{
				handler(newName, oldName) {
					if(newName!==oldName){
						this.drawPoint()
						this.initImCustom()
						this.scrollToBottom()
						this.initShow(true,200)
					}
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			initShow(type, time){
				setTimeout(()=>{
					this.drawPoint()
					this.initImCustom()
					if(type){
						this.scrollToBottom()
					}
				},time || 500)
			},
			initImCustom(){
				// console.log(app.globalData.currentConversation,app.globalData.currentConversation.lastMessage,'最后消息');
				if(app.globalData.currentConversation._attributes.custom){
					this.conversationCustom = app.globalData.currentConversation._attributes.custom
					this.orderId = this.conversationCustom.orderId?this.conversationCustom.orderId:''
					this.orderNumber = this.conversationCustom.orderNumber?this.conversationCustom.orderNumber:''
					this.advisoryType = this.conversationCustom.advisoryType?this.conversationCustom.advisoryType:''
					let consultType = this.advisoryType === '1'?'健康咨询':'图文问诊'
					this.setNav.navTitle = `与${this.conversationCustom.doctorNick}的${consultType}`
				}
				if(app.globalData.currentConversation.lastMessage){
					this.lastMessage = app.globalData.currentConversation.lastMessage
				}
			},
			confirmInquiry() { // 完成问诊
				let that = this
				wx.showModal({
					title: '提示',
					cancelText: '再想想',
					content: `确认要完成本次咨询吗？`,
					success(res) {
						if (res.confirm) {
							that.apiUpdateRepeatDiagnosisOrder(6)
						} else if (res.cancel) {
							console.log(res.cancel);
						}
					}
				});
			},
			apiGetOrderDetail(diagnosisOrderNo, id, type) {
				consultation.getOrderDetail({
					id
				}).then(res => {
					if (res.data) {
						if (res.data.id) {
							if (res.data.status === '2' || res.data.status === '3' || res.data.status === '4' || res.data.status === '5' ||
								res.data.status === '6') {
								wx.navigateTo({
									url: `/pagesA/consulting/prescriptionDetails?id=${res.data.id}&type=${type}`
								})
							} else {
								uni.showToast({
									title: '处方审核通过方能查看详情，审核不通过将会作废。',
									icon: 'none',
								})
							}
						}
					}
				}).catch(err => {
					uni.showToast({
						title: '处方审核通过方能查看详情，审核不通过将会作废。',
						icon: 'none',
					})
					console.log(err);
				})
			},
			apiCancelRegister() { // 取消预约锁定的号源
				let that = this
				uni.showModal({
					title: '提示',
					cancelText: '再想想',
					content: `确认要取消本次问诊吗？`,
					success(res) {
						if (res.confirm) {
							// 退款
							that.apiPayRefund()
						}
					}
				});
			},
			apiUpdateRepeatDiagnosisOrder(status) {
				let data = {
					orderNo: this.orderNumber,
					status: status
				}
				consultation.updateRepeatDiagnosisOrder(data).then((res) => {
					if (status === 5) {
						this.doTheThing(`你已接受问诊`)
					}
					this.status = status
				}).catch((err) => {})
			},
			apiSelectRepeatDiagnosisOrder() { // 查询复诊订单详情
				consultation.selectRepeatDiagnosisOrder({
					orderNo: this.orderNumber
				}).then((res) => {
					if(res.data){
						this.orderNumber = res.data.orderNo
						this.orderId = res.data.id
						this.price = res.data.realPrice
						this.status = res.data.status
						this.patientId = res.data.patientId
						this.bookingNo = res.data.bookingNo
						this.cardId = res.data.idCardNo
						this.clinicNo = res.data.clinicNo
						this.clinicTime = res.data.clinicTime
						if (this.cardId) {
							this.apiListCheckup(this.cardId)
						}
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			formatterDate(date) {
				return date.substring(0, 11)
			},
			radioTap(index) {
				this.medicalList[index].checked = !this.medicalList[index].checked;
				this.showSlectOption = []
				this.count = 0
				this.medicalList.forEach((item, index) => {
					if (item.checked) {
						this.count++
						if (this.count > 2) {
							uni.showToast({
								title: '最多只能选择两个报告哦',
								icon: 'none',
							})
							return false
						}
						this.showSlectOption.push(item)
					}
				})
				console.log(this.showSlectOption);
			},
			apiListCheckup(idCards) {
				medical.listCheckup({
					idCards
				}).then(res => {
					this.medicalList = res.data
					this.medicalListClone = res.data
				}).catch((err) => {
					console.log(err);
				})
			},
			firstReport() {
				if (this.user) {
					if (this.user.userInfo) {
						let conversation = app.globalData.currentConversation
						conversation.set('custom.businessStatus',1); // 需要发送欢迎语(只此一例) todo
						conversation.save();
						let userInfo = this.user.userInfo
						let gender = userInfo.gender === 0 ? '男' : '女'
						let dataMes = userInfo.name + ' ( ' + `${gender}` + userInfo.age + '岁 ) ' + '描述:' + this.user.textarea
						console.log(dataMes, '我的用户信息');
						this.sendRequest(dataMes,'text')
					}
					if (this.user.showSlectOption) {
						if (this.user.showSlectOption.length > 0) {
							this.user.showSlectOption.forEach((item) => {
								let data = '【报告】' + item.packageName + ' ' + item.personalName + item.signTime
								const checkupNo = item.checkupNo
								this.sendReport(data, this.cardId, checkupNo)
							})
						}
					}
					if (this.user.filePath) {
						if (this.user.filePath.tempFilePaths) {
							if (this.user.filePath.tempFilePaths.length > 0) {
								console.log(this.user.filePath);
								this.sendImageToNOS(this.user.filePath)
							}
						}
					}
				}
			},
			formatMes(sendOrReceive, mes) {
				if (sendOrReceive === 'send') {
					return mes
				}
				if (sendOrReceive === 'receive') {
					mes = mes.replace(/(你|您)/, "医生")
					return mes
				}
			},
			// 获取体检报告参数
			getMes(data) {
				console.log(data);
				if (!data.text) {
					return
				}
				let myTime = data.text.slice(-19)
				console.log(data,myTime, this.cardId, 'data');
				if (myTime && this.cardId && data.nodes[0].report === true && data.nodes[0].params.params.checkupNo) {
					let cardData = {
						idCards: this.cardId
					}
					consultation.listCheckup(cardData).then(res => {
						this.listCheckups = res.data.filter(item => {
							return item.signTime == myTime
						})
						wx.navigateTo({
							url: '/pagesA/medicalReport/reportDetail?item=' + JSON.stringify(this.listCheckups[0])
						})
					}).catch(err => {})
				}
				if (myTime && data.nodes[0].params.patientId) {
					let type = data.nodes[0].report
					let myPrescriptionId = data.nodes[0].params.id
					let orderNo = data.nodes[0].params.orderNo
					if (type === 'clinicBill') {
						console.log(orderNo);
						this.apiGetOrderDetail(orderNo, myPrescriptionId, type)
					}
					if (type === 'checkSpecial') {
						wx.navigateTo({
							url: `/pagesA/consulting/prescriptionDetails?id=${myPrescriptionId}&type=${type}`
						})
					}
					console.log(type, myPrescriptionId);
				}
			},
			stopEventPropagation() {},
			overConsult() {
				const that = this
				wx.showModal({
					title: '提示',
					cancelText: '再想想',
					content: `确认要完成本次咨询吗？`,
					success(res) {
						if (res.confirm) {
							that.doTheThing('你已完成本次咨询服务')
							that.apiddUpdateAdvisoryOrder(6)
						} else if (res.cancel) {
							console.log(res.cancel);
						}
					}
				});
			},
			goforConsult(flag) {
				if (flag == 1) {
					uni.navigateTo({
						url: '/pagesA/consulting/index'
					})
					return
				}
				if (flag == 2) {
					uni.navigateTo({
						url: '/pagesA/onlineConsultation/index'
					})
					return
				}
			},
			goEvaluate() {
				uni.navigateTo({
					url: `/pagesA/consulting/evaluatePage?orderId=${this.orderId}&orderNo=${this.orderNumber}&advisoryType=${this.advisoryType}`
				})
			},
			surePopcom() {
				if (this.count > 2) {
					uni.showToast({
						title: '最多只能选择两个报告哦',
						icon: 'none',
					})
					return false
				}
				if (this.count <= 2) {
					this.count = 0
					this.showSlectOption = []
					this.medicalList.forEach((item, index) => {
						if (item.checked) {
							this.count++
							if (this.count > 2) {
								uni.showToast({
									title: '最多只能选择两个报告哦',
									icon: 'none',
								})
								return false
							}
							this.showSlectOption.push(item)
						}
					})
					if (this.showSlectOption.length > 0) {
						this.showSlectOption.forEach((item) => {
							let data = '【报告】' + item.packageName + ' ' + item.personalName + item.signTime
							const checkupNo = item.checkupNo
							this.sendReport(data, this.cardId, checkupNo)
						})
					}
					this.$refs.popup.close()
				}
			},
			closePopcom() {
				this.medicalList = []
				this.showSlectOption = []
				this.medicalList = JSON.parse(JSON.stringify(this.medicalListClone))
				this.$refs.popup.close()
			},
			apiddUpdateAdvisoryOrder(status) {
				const data = {
					type: status,
					advisoryOrderId: parseInt(this.orderId)
				}
				medical.addUpdateAdvisoryOrder(data).then((res) => {
					this.status = status
				}).catch((err) => {
					console.log(err);
				})
			},
			apiSelectAdvisoryOrder() {
				if (this.orderId) {
					const data = {
						advisoryOrderId: parseInt(this.orderId)
					}
					medical.selectAdvisoryOrder(data).then((res) => {
						if(res.data){
							this.status = res.data.status
							this.price = res.data.realPrice
							this.orderNumber = res.data.orderNumber
							const data = {
								healthCardId: res.data.healthCardId
							}
							this.getCardId(data)
						}
					}).catch((err) => {
						console.log(err);
					})
				}
			},
			getCardId(data) {
				healthy.healthCardDetails(data).then(res => {
					this.cardId = res.data.healthCardNo
					if (this.cardId) {
						this.apiListCheckup(this.cardId)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			apiPayRefund() {
				const data = {
					bookingNo: this.bookingNo,
					cancelReason: '',
					clinicNo:this.clinicNo,
					clinicTime:this.clinicTime,
					orderNo: this.orderNumber,
					patientId: this.patientId,
					cancelType:2,
					regType: 2,
					price: this.price
				}
				consultation.cancelRegister2(data).then((res) => {
				}).catch((err) => {
					console.log(err);
				})
			},
			cancelPay() {
				const that = this
				if (that.advisoryType === '1') {
					wx.showModal({
						title: '提示',
						cancelText: '再想想',
						content: `确认要取消本次咨询吗？`,
						success(res) {
							if (res.confirm) {
								if (that.advisoryType === '1') {
									const data = {
										advisoryOrderId: that.orderId,
										cancelType: 2
									}
									that.getPayRefund(data)
								}
							}
						}
					})
				}
				if (that.advisoryType === '2') {
					that.apiCancelRegister()
				}
			},
			getPayRefund(data) {
				medical.advisoryOrderRefund(data).then(res => {
					this.doTheThing(`你已取消本次咨询服务`)
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			messageCopyCallBack(data) {
				if(this.advisoryType==='1'){
					consultation.healthInquiryMessageCallBack(data).then(res => {
						console.log(res,'发送suc')
					}).catch(err => {
						console.log(err)
					})
				}
				if(this.advisoryType==='2'){
					consultation.onlineInquiryMessageCallBack(data).then(res => {
						console.log(res,'发送suc')
					}).catch(err => {
						console.log(err)
					})
				}
			},
			drawPoint(type){
				let messageLimit = this.messageLimit===0?1:this.messageLimit
				console.log(20*messageLimit, this.messageArr);
				if(type){
					wx.showLoading({
						title: '加载中...'
					})
					setTimeout(()=>{
						wx.hideLoading()
					},500)
				}
				let patientMessage = app.globalData.currentConversation.createMessagesIterator({limit: 20*messageLimit})
				patientMessage.next().then((messages)=> {
					this.messageArr = this.convertRawMessageListToRenderMessageArr(messages.value)
					this.reCalcAllMessageTime()
					console.log(messages.value,this.messageArr,'消息记录');
					if(type && 20*messageLimit>messages.value.length){
						setTimeout(()=>{
							uni.showToast({
								title: '没有更多消息了哦~',
								icon: 'none',
							})
						},500)
					}
				})
				if (this.advisoryType === '1') {
					this.apiSelectAdvisoryOrder()
				}
				if (this.advisoryType === '2') { // 问诊订单状态查询
					this.apiSelectRepeatDiagnosisOrder()
				}
			},
			/**
			 * 重新计算时间头
			 */
			reCalcAllMessageTime() {
				let tempArr = [...this.messageArr]
				if (tempArr.length == 0) return
				// 计算时差
				console.log(tempArr,'计算时差');
				tempArr.map((msg, index) => {
					if (index === 0 && msg.time) {
						msg['displayTimeHeader'] = calcTimeHeader(msg.time)
					} else {
						let delta = (msg.time - tempArr[index - 1].time) / (60 * 1000)
						if (delta > 1) { // 距离上一条，超过两分钟重新计算头部
							msg['displayTimeHeader'] = calcTimeHeader(msg.time)
						}
					}
				})
				this.messageArr = tempArr
			},
			chatingWrapperClick() { // 收起所有输入框
				this.focusFlag = false
				this.emojiFlag = false
				this.tipFlag = false
				this.moreFlag = false
				this.inputBottomPadding = 0
			},
			inputChange(e) { // 文本框输入事件
				this.inputValue = e.detail.value
			},
			inputFocus(e) { // 获取焦点
				this.moreFlag = false
				this.emojiFlag = false
				this.focusFlag = true
				this.inputBottom = e.detail.height
				this.inputBottomPadding = this.inputBottom * 2
			},
			/**
			 * 切出更多
			 */
			toggleMore() {
				this.moreFlag = !this.moreFlag
				this.focusFlag = false
				this.emojiFlag = false
				if (!this.moreFlag) {
					this.inputBottomPadding = 0
				}
				if (this.moreFlag) {
					this.inputBottomPadding = 400
				}
			},
			/**
			 * 切换出emoji键盘
			 */
			toggleEmoji() {
				this.sendType = 0
				this.emojiFlag = !this.emojiFlag
				this.moreFlag = false
				if (!this.emojiFlag) {
					this.inputBottomPadding = 0
				}
				if (this.emojiFlag) {
					this.inputBottomPadding = 490
				}
			},
			inputBlur() { // 失去焦点
				this.focusFlag = false
				this.inputBottom = 0
				if (!this.emojiFlag && !this.moreFlag) {
					this.inputBottomPadding = 0
				}
			},
			inputSend(e) { // 键盘单击发送，发送文本
				this.sendRequest(e.detail.value,'text')
			},
			// 取消咨询， 完成咨询
			doTheThing(val) {
				this.sendRequest(val,'tip')
			},
			sendRequest(val,type,content) { // 发送网络请求：发送文本消息(包括emoji)
				let self = this
				this.initShow(true,200)
				let patientNick = app.globalData.currentConversation._attributes.custom.patientNick
				const messageData = {
					"type": "text",
					"time": new Date().getTime(),
					"nick": patientNick
				}
				if(type==='text'){
					messageData['text'] = val || self.inputValue
				}
				if(type==='tip'){
					messageData['type'] = "tip"
					messageData['params'] = content
					messageData['text'] = val || self.inputValue
				}
				if(type==='emoji'){
					messageData['type'] = "emoji"
					messageData['content'] = content
					messageData['text'] = val
				}
				if(type==='custom'){
					messageData['type'] = "custom"
					messageData['params'] = content
					messageData['text'] = val || self.inputValue
				}
				if(type==='image'||type==='audio'||type==='video'){
					messageData['type'] = type
					messageData['file'] = content
				}
				let message = new TextMessage(val || self.inputValue)
				message.setAttributes(messageData)
				app.globalData.currentConversation.send(message).then((message)=> {
					if(type==='text'){
						self.inputValue = ''
						self.focusFlag = false
						console.log('发送text成功',message);
					}
					if(type==='emoji'||type==='custom'){
						self.tipFlag = false
						self.moreFlag = false
						self.focusFlag = false
						self.emojiFlag = false
						this.inputBlur()
						console.log('发送emoji表情成功',message);
					}
					let messageCopy = {
						from: app.globalData.imClient.id,
						to: app.globalData.currentConversation.members[1],
						custom: JSON.stringify(app.globalData.currentConversation._attributes.custom),
						messageContent:JSON.stringify(messageData)
					}
					this.messageCopyCallBack(messageCopy)
					// 滚动到底部
					this.drawPoint()
					this.initImCustom()
					this.scrollToBottom()
					this.initShow(true,200)
					console.log(app.globalData.currentConversation,'最后发送消息');
					wx.hideLoading()
				}).catch(console.error)
			},
			/**
			 * 滚动页面到底部
			 */
			scrollToBottom() {
				let timer = setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 999999, //滚动到目标位置
						duration: 200, //过渡时间必须为0，uniapp bug，否则运行到手机会报错
					})
					clearTimeout(timer)
				}, 100)
			},
			/**
			 * 语音按钮长按结束
			 */
			longPressEnd() {
				this.recordClicked = false
				// 第一次授权，
				if (!this.recorderManager) {
					this.isLongPress = false
					return
				}
				if (this.isLongPress === true) {
					this.isLongPress = false
					wx.hideToast()
					this.recorderManager.stop()
				}
			},
			/**
			 * 手动模拟按钮长按，
			 */
			longPressStart() {
				let self = this
				this.recordClicked = true
				setTimeout(() => {
					if (self.recordClicked === true) {
						self.executeRecord()
					}
				}, 350)
			},
			/**
			 * 执行录音逻辑
			 */
			executeRecord() {
				let self = this
				self.isLongPress = true
				wx.getSetting({
					success: (res) => {
						let recordAuth = res.authSetting['scope.record']
						if (recordAuth == false) { //已申请过授权，但是用户拒绝
							wx.openSetting({
								success: function(res) {
									let recordAuth = res.authSetting['scope.record']
									if (recordAuth == true) {
										showToast('success', '授权成功')
									} else {
										showToast('text', '请授权录音')
									}
									self.isLongPress = true
								}
							})
						} else if (recordAuth == true) { // 用户已经同意授权
							self.startRecord()
						} else { // 第一次进来，未发起授权
							wx.authorize({
								scope: 'scope.record',
								success: () => { //授权成功
									showToast('success', '授权成功')
								}
							})
						}
					},
					fail: function() {
						showToast('error', '鉴权失败，请重试')
					}
				})
			},
			/**
			 * 开始录音
			 */
			startRecord() {
				let self = this
				showToast('text', '开始录音', {
					duration: 120000
				})
				const recorderManager = self.recorderManager || wx.getRecorderManager()
				const options = {
					duration: 120 * 1000,
					format: 'mp3'
				}
				recorderManager.start(options)
				this.recorderManager = recorderManager
				recorderManager.onStop((res) => {
					if (res.duration < 2000) {
						showToast('text', '录音时间太短')
					} else {
						self.sendAudioMsg(res)
					}
				})
			},
			/**
			 * 发送语音消息
			 */
			sendAudioMsg(res) {
				wx.showLoading({
					title: '发送中...',
				})
				console.log(res,'音频原始数据');
				let self = this
				let ext = 'mp3'
				let dur = res.duration
				OBSupload(res.tempFilePath,'mp3');
				let file = wx.getStorageSync('fileName')
				let url = 'http://file.aihuihc.com/'+file
				let audioFile = {
					dur,
					ext,
					url,
				}
				self.sendRequest('','audio',audioFile)
			},
			/**
			 * 选择相册图片
			 */
			chooseImageToSend(e) {
				let self = this
				this.moreFlag = false
				this.inputBottomPadding = 0
				wx.chooseImage({
					sourceType: ['album'],
					success: function(res) {
						console.log(res);
						self.sendImageToNOS(res)
					},
				})
			},
			/**
			 * 发送图片到nos
			 */
			sendImageToNOS(res) {
				wx.showLoading({
					title: '发送中...',
				})
				let self = this
				let tempFilePaths = res.tempFilePaths
				for (let i = 0; i < tempFilePaths.length; i++) {
					// 上传文件到nos
					wx.getImageInfo({
						src: tempFilePaths[i],
						success (res) {
							let w = res.width
							let h = res.height
							let ext = res.type
							OBSupload(tempFilePaths[i]);
							let file = wx.getStorageSync('fileName')
							let url = 'http://file.aihuihc.com/'+file
							let imageFile = {
								w,
								h,
								ext,
								url,
							}
							self.sendRequest('','image',imageFile)
							console.log(imageFile,'image');
						}
					})
				}
			},
			/**
			 * 选择拍摄视频或者照片
			 */
			chooseImageOrVideo() {
				let self = this
				this.moreFlag = false
				this.inputBottomPadding = 0
				wx.showActionSheet({
					itemList: ['照相', '视频'],
					success: function(res) {
						if (res.tapIndex === 0) { // 相片
							wx.chooseImage({
								sourceType: ['camera'],
								success: function(res) {
									self.sendImageToNOS(res)
								},
							})
						} else if (res.tapIndex === 1) { // 视频
							wx.chooseVideo({
								sourceType: ['camera', 'album'],
								success: function(res) {
									console.log(res,'videoSource');
									if (res.duration > 60) {
										showToast('text', '视频时长超过60s，请重新选择')
										return
									}
									console.log(res);
									// {duration,errMsg,height,size,tempFilePath,width}
									self.sendVideoToNos(res)
								}
							})
						}
					}
				})
			},
			/**
			 * 发送视频文件到nos
			 */
			sendVideoToNos(res) {
				wx.showLoading({
					title: '发送中...',
				})
				// 上传文件到nos
				let ext = 'mp4'
				let dur = res.duration
				OBSupload(res.tempFilePath,'mp4');
				let file = wx.getStorageSync('fileName')
				let url = 'http://file.aihuihc.com/'+file
				let imageFile = {
					dur,
					ext,
					url,
				}
				this.sendRequest('','video',imageFile)
			},
			/**
			 * 调出tip发送面板
			 */
			showTipMessagePanel() {
				this.tipFlag = true
				this.moreFlag = false
				if (this.medicalList.length === 0) {
					wx.showToast({
						title: '用户账号暂无相关报告哦~',
						icon: "none",
					})
				}
				if (this.medicalList.length > 0) {
					this.$refs.popup.open()
				}
			},
			switchSendType() { // 切换发送文本类型
				this.sendType = this.sendType === 0 ? 1 : 0
				this.focusFlag = false
				this.emojiFlag = false
				this.inputBottomPadding = 0
			},
			/**
			 * emoji点击发送
			 */
			emojiSend(e) {
				let val = this.inputValue
				this.sendRequest(val,'text')
				this.emojiFlag = false
				this.inputBottomPadding = 0
			},
			/**
			 * emoji组件回调
			 */
			emojiCLick(data) {
				let val = data
				// 单击删除按钮，，删除emoji
				if (val == '[删除]') {
					let lastIndex = this.inputValue.lastIndexOf('[')
					if (lastIndex != -1) {
						this.inputValue = this.inputValue.slice(0, lastIndex)
					}
					return
				}
				if (val[0] == '[') { // emoji
					console.log(val[0]);
					this.inputValue = this.inputValue + val
				} else { //大图
					console.log(val);
					this.sendBigEmoji(val)
				}
			},

			/**
			 * 发送体检报告
			 */
			sendReport(val, cardId, checkupNo) {
				wx.showLoading({
					title: '发送中...',
				})
				let self = this
				let content = {
					type: 'report',
					content: val,
					params: {
						cardId: cardId,
						checkupNo: checkupNo,
						orderId: self.orderId,
						type: 'report'
					}
				}
				this.sendRequest(val,'custom',JSON.stringify(content))
			},
			/**
			 * 发送大的emoji:实际上是type=3的自定义消息
			 * {"type":3,"data":{"catalog":"ajmd","chartlet":"ajmd010"}}
			 */
			sendBigEmoji(val) {
				let catalog = ''
				if (val[0] === 'a') {
					catalog = 'ajmd'
				} else if (val[0] === 'x') {
					catalog = 'xxy'
				} else if (val[0] === 'l') {
					catalog = 'lt'
				}
				let content = {
					type: 3,
					data: {
						catalog,
						chartlet: val
					}
				}
				this.sendRequest(val,'emoji',JSON.stringify(content))
			},
			/**
			 * 展示编辑菜单
			 */
			showEditorMenu(index) {
				let self = this
				let oldMessage = this.originMessages[index]
				wx.showActionSheet({
					itemList: ['撤回'],
					success: function(res) {
						switch (res.tapIndex) {
							case 0:
								wx.showActionSheet({
									itemList: ['确定'],
									itemColor: '#ff0000',
									success: function(res) {
										if (res.tapIndex === 0) {
											self.recallMessage(oldMessage)
										}
									}
								})
								break
							default:
								break
						}
					}
				})
			},
			/**
			 * 撤回消息
			 */
			recallMessage(oldMessage) { // todo
				let self = this
				app.globalData.currentConversation.recall(oldMessage).then(function(recalledMessage) {
					self.drawPoint()
				}).catch(function(error) {
					console.log(error);
					// 异常处理
					showToast('text', '消息已超过2分钟，不能撤回')
				});
			},
			requestFullScreenVideo(video) { // 全屏播放视频
				this.videoSrc = video.url
				let videoItem = {
					content: '',
					titleName: '',
					isImVideo: true,
					url: encodeURIComponent(this.videoSrc)
				}
				uni.navigateTo({
					url: '/pagesA/videoList/videoDetail?item=' + JSON.stringify(videoItem)
				})
			},
			playImage(imgNode) {
				wx.previewImage({
					current: '', // 当前显示图片的http链接
					urls: [imgNode.src] // 需要预览的图片http链接列表
				})
			},
			playAudio(audio) { // 播放音频
				console.log(audio,'播放音频');
				showToast('text', '播放中', {
					duration: audio.dur,
					mask: true
				})
				const audioContext = wx.createInnerAudioContext()
				audioContext.src = audio.url
				audioContext.play()
				audioContext.onPlay(() => {})
				audioContext.onEnded(() => {
					wx.hideToast()
				})
				audioContext.onError((res) => {
					showToast('text', res.errCode)
				})
			},
			/**
			 * 原始消息列表转化为适用于渲染的消息列表
			 * {unixtime1: {flow,from,fromNick,idServer,scene,sessionId,text,target,to,time...}, unixtime2: {}}
			 * =>
			 * [{text, time, sendOrReceive: 'send', displayTimeHeader, nodes: []},{type: 'geo',geo: {lat,lng,title}}]
			 */
			convertRawMessageListToRenderMessageArr(rawMsgList) {
				let messageArr = []
				this.originMessages = []
				rawMsgList.forEach((rawMsg)=>{
					if(!rawMsg.attributes){
						return
					}
					this.originMessages.push(rawMsg)
					let $attr = rawMsg.attributes
					let msgType = $attr.type
					let displayTimeHeader = ''
					let sendOrReceive = app.globalData.imClient.id === rawMsg.from ? 'send' : 'receive'
					let specifiedObject = {}
					switch (msgType) {
						case 'text':
							{
								specifiedObject = {
									nodes: generateRichTextNode(rawMsg.text)
								}
								break
							}
						case 'image':
							{
								specifiedObject = {
									nodes: generateImageNode($attr['file'])
								}
								break
							}
						case 'geo':
							{
								specifiedObject = {
									geo: $attr['geo']
								}
								break
							}
						case 'audio':
							{
								specifiedObject = {
									audio: $attr['file']
								}
								break
							}
						case 'video':
							{
								specifiedObject = {
									video: $attr['file']
								}
								break
							}
						case 'emoji':
							{
								let content = JSON.parse($attr['content'])
								specifiedObject = {
									nodes: generateImageNode(generateBigEmojiImageFile(content))
								}
								break
							}
						case 'tip':
							{
								let text = this.formatMes(sendOrReceive, rawMsg.text)
								let sampleNodes = [{type: 'text',text: text}]
								let finalNodes = $attr['params']&&JSON.stringify($attr['params'])!=='{}'?changeTipParams($attr['params'],text):sampleNodes
								specifiedObject = {
									text: rawMsg.text,
									nodes: finalNodes,
									pushPayload:  $attr['params']
								}
								break
							}
						case 'custom':
							{
								let params = JSON.parse($attr['params'])
								let sampleNodes = generateRichTextNode(rawMsg.text, params)
								specifiedObject = {
									nodes: changeCustomParams(sampleNodes)
								}
								break;
							}
						default:
							{
								break
							}
					}
					messageArr.push(Object.assign({}, {
						from: app.globalData.imClient.id,
						to: $attr.nick,
						type: msgType,
						text: rawMsg.text || '',
						avatar: this.getUserAvatar(sendOrReceive),
						time: $attr.time,
						sendOrReceive,
						displayTimeHeader
					}, specifiedObject))
				})
				return messageArr
			},
			getUserAvatar(sendOrReceive){
				if(app.globalData.currentConversation._attributes.custom){
					let custom = app.globalData.currentConversation._attributes.custom
					if(sendOrReceive==='send'){
						return custom.patientAvatar
					}
					if(sendOrReceive==='receive'){
						return custom.doctorAvatar
					}
					else{
						return this.defaultUserLogo
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.chating-wrapper {
		width: 100%;
		min-height: 100%;
		position: relative;
		/* margin: 70rpx 0 100rpx; */
		box-sizing: border-box;
		/* overflow: hidden; */
		/* background: #F3F4F6; */
		background: #f8f8f8;
	}

	/* 收起键盘热区 */
	.fold-keyboad-wrapper {
		position: fixed;
		top: 35px;
		width: 100%;
		height: 250px;
	}

	/*历史消息  */
	.chating-history {
		position: fixed;
		padding: 0 20rpx;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		box-sizing: border-box;
		background-color: #fff;
		z-index: 1;
		display: flex;
		flex-direction: row-reverse;
		color: #333333;
		font-size: 15px;
		justify-content: space-between;
		align-items: center;
	}

	.chating-history-right-button {
		width: 82px;
		height: 30px;
		color: #2884FF;
		line-height: 30px;
		font-size: 13px;
		text-align: center;
		border-radius: 8px;
		border: 1px solid rgba(40, 132, 255, 1);
	}

	/*聊天输入框  */
	.chatinput-wrapper {
		width: 100%;
		background-color: #fff;
		border-top: 2rpx solid #ccc;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.chatinput-content {
		width: 100%;
		height: 100rpx;
	}

	.chatinput-img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
		margin: 20rpx 20rpx;
		display: inline-block;
	}

	.chatinput-img.emoji {
		margin-right: 0;
	}

	.chatinput-img:active {
		opacity: .6;
	}

	.chatinput-input {
		width: 466rpx;
		min-height: 72rpx;
		border-radius: 16rpx;
		border: 1px solid #ccc;
		margin-top: 15rpx;
		display: inline-block;
		vertical-align: top;
		box-sizing: border-box;
		padding-left: 20rpx;
		font-size: 30rpx;
	}

	.chatinput-voice-mask {
		width: 466rpx;
		height: 76rpx;
		line-height: 76rpx;
		display: inline-block;
		border-radius: 16rpx;
		border: 1px solid #ccc;
		margin-top: 12rpx;
		vertical-align: top;
		box-sizing: border-box;
		/* padding-left: 20rpx; */
		font-size: 30rpx;
		text-align: center;
		color: #333336;
		background-color: #fff;
		letter-spacing: 4rpx;
	}

	.chatinput-voice-mask-hover {
		background-color: #cecece;
		color: #333336;
	}

	/*subcontent wrapper  */
	.chatinput-subcontent {
		width: 100%;
		height: 470rpx;
		background-color: #999;
	}

	.fr {
		float: right;
	}

	/* more-subcontent */
	.more-subcontent {
		padding: 40rpx 30rpx;
		border: 2rpx solid #ccc;
	}

	.more-subcontent .more-subcontent-item {
		display: flex;
		flex-direction: column;
		position: relative;
		margin-right: 20px;
	}

	.more-subcontent .more-subcontent-item img {
		width: 70px;
		height: 70px;
		/*border-radius: 50%;*/
	}

	.more-subcontent .more-subcontent-item .text {
		position: absolute;
		bottom: 8px;
		display: block;
		width: 100%;
		font-size: 24rpx;
		text-align: center;
		color: #6C7074;
	}

	/*聊天记录  */
	.record-wrapper {
		width: 100%;
		padding-bottom: 120rpx;
		padding-top: 100rpx;
		transition: 0.1s;
		background: #F8F8F8;
	}

	.record-chatting-item {
		width: 100%;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
	}

	.record-item-time-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.record-item-time {
		padding: 4rpx 10rpx;
		background: #D6D6D6;
		border-radius: 16rpx;
		font-size: 24rpx;
		color: #fff;
	}

	.record-chatting-item-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 100%;
		display: inline-block;
	}

	.record-chatting-item-text {
		max-width: 70%;
		border-radius: 16rpx;
		background-color: #3387FF;
		padding: 16rpx;
		box-sizing: border-box;
		word-wrap: break-word;
		overflow: hidden;
		font-size: 32rpx;
		line-height: 48rpx;
	}

	.record-chatting-item-underline {
		text-decoration: underline;
	}

	.record-chatting-item-nodes {
		color: #000;
		background-color: #fff;
	}

	.record-chatting-item-text.nobg {
		background: transparent;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	/* tip消息富文本 */
	.tip-rich-text {
		background-color: #fff;
		text-align: center;
		align-self: center;
		min-height: 40rpx;
		word-break: break-word;
		font-size: 26rpx;
		padding: 20rpx;
		color: #000;
		border-radius: 16rpx;
	}

	.self {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		color: #fff;
	}

	.other {
		display: flex;
		flex-direction: row;
		justify-content: flex-start !important;
		color: #222;
	}

	.left-triangle {
		height: 0px;
		width: 0px;
		border-width: 20rpx;
		border-style: solid;
		border-color: transparent #fff transparent transparent;
		margin-top: 20rpx;
	}

	.right-triangle {
		height: 0px;
		width: 0px;
		border-width: 20rpx;
		border-style: solid;
		border-color: transparent transparent transparent #3387FF;
		margin-top: 20rpx;
	}

	.right-triangle-report {
		height: 0px;
		width: 0px;
		border-width: 20rpx;
		border-style: solid;
		border-color: transparent transparent transparent #ffffff;
		margin-top: 20rpx;
	}

	.small-map-wrapper {
		overflow: hidden;
		width: 452rpx;
		height: 300rpx;
		position: relative;
		border-radius: 16rpx;
	}

	.self .small-map-wrapper {
		margin-right: 20rpx;
	}

	.other .small-map-wrapper {
		margin-left: 20rpx;
	}

	.small-map-wrapper .small-geo-img {
		width: 100%;
		height: 100%;
		background-color: pink;
	}

	.small-map-wrapper .text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		box-sizing: border-box;
		width: 100%;
		padding: 10rpx;
		min-height: 70rpx;
		/* line-height: 70rpx; */
		opacity: 0.75;
		font-size: 28rpx;
		/* white-space: nowrap; */
		text-align: center;
		text-overflow: ellipsis;
		background-color: #444;
		color: #fff;
	}

	.small-video-wrapper {
		margin-left: 20rpx;
		margin-right: 20rpx;
		width: 200rpx;
		height: 200rpx;
		padding: 10rpx;
		background-color: #fff;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.small-video-wrapper .video {
		width: 200rpx;
		height: 200rpx;
		position: absolute;
		z-index: 10000;
		border-radius: 16rpx;
	}

	.audio-wrapper {
		background-color: #fff;
		border-radius: 16rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
		min-width: 30%;
		box-sizing: border-box;
		margin-left: -2px;
	}

	.audio-wrapper img {
		width: 70rpx;
		height: 70rpx;
		align-self: center;
	}

	.audio-wrapper .text {
		align-self: center;
		color: #fff;
	}

	.chatinput-wrappers {
		width: 100%;
		padding: 0px 28px;
		box-sizing: border-box;
		position: fixed;
		height: 50px;
		bottom: 0;
		left: 0;
		border: none;
	}

	.uni-goConsult-button {
		width: 100%;
		height: 47px;
		font-size: 18px;
		color: #fff;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		border-radius: 8px;
		text-align: center;
		line-height: 47px;
	}

	.uni-bottom-select {
		position: fixed;
		z-index: 1000;
		right: 10px;
		top: 0px;
		left: 0px;
		width: 100%;
		display: flex;
		padding: 10px 0px;
		height: 30px;
		background-color: #fff;

		view {
			font-size: 18px;
			width: 33.3%;
		}
	}

	.uni-select-box {
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.1);
		border-radius: 8px;

		image {
			height: 20px;
			width: 20px;
			border-radius: 50%;
			background-color: gray;
			margin-right: 10px;
		}
	}

	.uni-select-all {
		padding: 10px;
		width: 80px;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.uni-select-name {
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.uni-select-default {
		background: #CCDFF0;
	}

	.uni-select-mes {
		padding-top: 10px;
		font-size: 12px;

		view {
			margin-bottom: 10px;
		}

		.uni-color-normal {
			color: #000000;
		}

		.uni-color-error {
			color: red;
		}
	}

	.uni-select-img {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.video-control {
		background-color: rgba(0, 0, 0, 0.2);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
		flex-direction: row;
		display: flex;
	}
</style>
