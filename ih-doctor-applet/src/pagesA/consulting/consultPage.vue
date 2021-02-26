<template>
	<view class="content-box">
		<talkBar :nav="setNav" @recordClick="recordClick" @talkClick="talkClick" @back="back"/>

		<!-- 对话时的顶部固定栏 -->
		<view v-if="talkBtn" class='chating-history' :style="{ top: top + 'px'}">
<!--						<view class='chating-history' :style="{ top: top + 'px'}">-->
			<view>
				<!-- <text class='chating-history-left'>当前对话 <text class='chating-history-text'>{{alreadyTalk}}</text></text>
                <text class='chating-history-right'>可对话 <text class='chating-history-text'>{{canTalk}}</text></text> -->
			</view>
			<view>
				<view class='chating-history-right-button' v-if="advisoryType==='1'" @tap="finishOrder('咨询')">完成咨询</view>
				<view class='chating-history-right-button' v-if="advisoryType==='2'&&status===5" @tap="finishOrder('问诊')">完成问诊</view>
<!--				<view class='chating-history-right-button' @tap="finishOrder('问诊')">完成问诊</view>-->
			</view>
		</view>

		<view class='chating-wrapper' @tap.stop.prevent='chatingWrapperClick'>
			<!-- 消息记录 -->
			<view :class="['record-wrapper']"
				  id="recordWrapper"
				  :style="{ transform: `translateY(-${inputBottomPadding}rpx)`}"
			>
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
						<view v-if="message.type === 'audio'" class='audio-wrapper audio-wrapper-box' @tap.stop.prevent='playAudio(message.audio)'>
							<img :src='iconBase64Map.iconVoiceWhite' class='image'></img>
							<text class='text'>{{message.audio.dur / 1000 << 1 >> 1}}''</text>
						</view>
						<rich-text @tap="playImage(message.nodes[0].attrs)" v-if="message.type === 'image'" class='record-chatting-item-text nobg'
						 :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'emoji'" class='record-chatting-item-text nobg' :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'text'"
					   	class='record-chatting-item-text' :nodes="message.nodes"></rich-text>
						<rich-text @tap="getMes(message)" v-if="message.type === 'custom'"
					   	class='record-chatting-item-text' :nodes="message.nodes"></rich-text>
						<rich-text @tap="getMes(message)" v-if="message.type === 'tip'" class='tip-rich-text' :nodes="message.nodes"></rich-text>
						<text v-if="message.type !== 'tip' && message.type !== 'notification' && message.type !== 'image' && message.type !== 'video' && message.type !== 'geo' && message.type !== 'emoji'"
						 class='right-triangle'></text>
						<img v-if="message.type !== 'tip'" :src='message.avatar' class='record-chatting-item-img'></img>
					</view>
					<view v-if="message.sendOrReceive == 'receive'" :class="['record-chatting-item',message.sendOrReceive === 'receive' ? 'other': '']"
					 :style="{'justify-content': message.type === 'tip' ? 'center !important' : 'flex-end'}"
					 >
						<img v-if="message.type !== 'tip'" data-account='message.from' :src='message.avatar' class='record-chatting-item-img' />
						<text v-if="message.type !== 'tip' && message.type !== 'image' && message.type !== 'video' && message.type !== 'geo' && message.type !== 'emoji' "
						 class='left-triangle'></text>
						<view v-if="message.type === 'video'" @tap.stop.prevent='requestFullScreenVideo(message.video)' class='small-video-wrapper'>
							<img style="width: 50rpx;height: 50rpx;position: absolute;z-index:1;" src="http://file.aihuihc.com/patient/patientImages/images/newHome/play.png"></img>
							<video style="width: 200rpx;height: 200rpx;position: absolute;border-radius: 16rpx;" :src="message.video.url"
							 :initial-time="0.01" :show-fullscreen-btn="false" :show-play-btn="false" :show-center-play-btn="false"
							 :controls="false"></video>
						</view>
						<view v-if="message.type === 'audio'" @tap.stop.prevent='playAudio(message.audio)' class='audio-wrapper'>
							<img :src='iconBase64Map.iconVoiceGrey' class='image'></img>
							<text class='text text-audio'>{{message.audio.dur / 1000 << 1 >> 1}}''</text>
						</view>
						<rich-text @tap="playImage(message.nodes[0].attrs)" v-if="message.type === 'image'" class='record-chatting-item-text nobg'
						 :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'emoji'" class='record-chatting-item-text nobg' :nodes="message.nodes"></rich-text>
						<rich-text v-if="message.type === 'text' || (message.type === 'custom'&&!message.nodes[0].report)"
						 :class="['record-chatting-item-text record-chatting-item-nodes',message.nodes[0].report?'record-chatting-item-underline':'']"
						 :nodes="message.nodes"></rich-text>
						<rich-text @tap="getMes(message)" v-if="message.type === 'custom'&&message.nodes[0].report" class='record-chatting-item-text record-chatting-item-nodes record-chatting-item-underline' :nodes="message.nodes"></rich-text>
						<view class="rich-text-box">
							<rich-text @tap="getMes(message)" v-if="message.type === 'tip'" class='tip-rich-text' :nodes="message.nodes"></rich-text>
						</view>
					</view>
				</view>
			</view>

			<!-- 非模态框提示是否接受咨询 -->
			<view class='chatinput-wrapper' v-if="selectBtn">
				<view class='tipsBtn-content'>
					<button type="primary" plain="true" class="tipsBtn tipsBtnCancel" @click="cancelBtn">拒绝咨询</button>
					<u-button @click="confirmBtn" :throttleTime="1000" :customStyle="acceptButtonStyle" type="primary" shape="square" size="default">接受咨询</u-button>
				</view>
			</view>

			<!-- 非模态框提示是否接受问诊 -->
			<view class='chatinput-wrapper' v-if="advisoryType==='2'&&status===1">
				<view class='tipsBtn-content'>
					<button type="primary" plain="true" class="tipsBtn tipsBtnCancel" @click="cancelBtn">拒绝问诊</button>
					<u-button @click="confirmInquiry" :throttleTime="1000" :customStyle="acceptButtonStyle" type="primary" shape="square" size="default">接受问诊</u-button>
				</view>
			</view>

			<!-- 赠送服务 -->
			<view class='chatinput-btn' v-if="givellBtn&&advisoryType==='1'">
				<view class='tipsBtn-content'>
					<u-button @click="addAdvisoryOrder" :throttleTime="1000" :customStyle="sendButtonStyle" type="primary" shape="square" size="default">赠送服务</u-button>
				</view>
			</view>

			<!-- 拒绝咨询时的弹出框 -->
			<view v-if="!isHidden" class='uni-modal'>
				<view class='modalContent'>
					<view class="" style="width: 95%; text-align: center; padding: 30rpx 0; color: #333333;">拒绝原因</view>
					<view class="personal-box">
						<textarea v-model="cancelDescription" placeholder="请输入拒绝原因" disable-default-padding="true" adjust-position maxlength='-1' />
					</view>
					<view class="uni-btn">
						<button class="cancleBtn" @click="goCancle">再考虑一下</button>
						<button class="confirmBtns"  @click="goConfirm">确定</button>
<!--						<u-button  @click="goConfirm" :throttleTime="1000" :customStyle="confirmButtonStyle" type="primary" shape="square" size="default">确定</u-button>-->
					</view>
				</view>
			</view>

			<view class='chatinput-wrapper' :style="{bottom:inputBottom+'px'}" v-if="talkBtn"  @tap.stop.prevent=''>
				<view class='chatinput-content'>
					<img v-if="sendType === 0" src="http://file.aihuihc.com/ih-doctor-applet/image/voice.png" class='chatinput-img' @tap.stop.prevent='switchSendType'></img>
					<img v-else src="http://file.aihuihc.com/ih-doctor-applet/image/keyboard.png" class='chatinput-img' @tap.stop.prevent='switchSendType'></img>
					<input type="text" style='margin-bottom: 10px;' v-if="sendType === 0" :value='inputValue'
						   :focus='focusFlag'
						   :adjust-position="false"
						   @input='inputChange'
						   @focus='inputFocus'
						   @blur='inputBlur'
						   @confirm='inputSend'
						   class='chatinput-input'
						   placeholder="输入文字"
						   confirm-type='send'>
					</input>
					<button v-if="sendType == 1"
							:class="[isLongPress ? 'chatinput-voice-mask chatinput-voice-mask-hover' : 'chatinput-voice-mask']"
							hover-class="none" @touchstart='longPressStart' @touchend='longPressEnd'>
						{{isLongPress ? '松开结束' : '按住说话'}}
					</button>
					<img src='http://file.aihuihc.com/ih-doctor-applet/image/more.png' @tap.stop.prevent='toggleMore' class='chatinput-img fr'></img>
					<img src='http://file.aihuihc.com/ih-doctor-applet/image/emoji.png' @tap.stop.prevent='toggleEmoji' class='chatinput-img fr emoji'></img>
				</view>
				<view v-if="emojiFlag" class='chatinput-subcontent' @tap.stop.prevent="">
					<emoji @EmojiClick="emojiCLick" @EmojiSend="emojiSend"></emoji>
				</view>
				<view v-if="moreFlag" class='more-subcontent'>
					<view class='more-subcontent-box'>
						<view class='more-subcontent-item' @tap.stop.prevent='chooseImageToSend'>
							<img class="more-subcontent-img" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/send.png"></img>
							<text class='text'>图片</text>
						</view>
						<view class='more-subcontent-item' @tap.stop.prevent='chooseImageOrVideo'>
							<img class="more-subcontent-img" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/video.png"></img>
							<text class='text'>视频</text>
						</view>
						<view class='more-subcontent-items uni-special-imBox' v-if="isShowRoute&&advisoryType==='2'" @tap.stop.prevent="openPresention('1')">
							<img class="more-subcontent-img-special" src="http://file.aihuihc.com/ih-doctor-applet/image/openOrder.png"></img>
							<text class='text-special'>开处方</text>
						</view>
						<view class='more-subcontent-items more-subcontent-noMarginRight uni-special-imBox' v-if="isShowRoute&&advisoryType==='2'" @tap.stop.prevent="openPresention('2')">
							<img class="more-subcontent-img-special" src="http://file.aihuihc.com/ih-doctor-applet/image/check.png"></img>
							<text class='text-special'>开检查</text>
						</view>
						<view class='more-subcontent-items uni-special-imBox' v-if="isShowRoute&&advisoryType==='2'" @tap.stop.prevent="openPresention('3')">
							<img class="more-subcontent-img-special" src="http://file.aihuihc.com/ih-doctor-applet/image/access.png"></img>
							<text class='text-special'>开检验</text>
						</view>
					</view>
				</view>
			</view>

        </view>
    </view>
</template>

<script>
    import talkBar from '../../components/talkBar.vue'
    import emoji from '../../components/emoji.vue'
	import OBSupload from '@/obs/OBSUploadFile.js'
    import {showToast, generateBigEmojiImageFile,generateImageNode,calcTimeHeader, generateRichTextNode, changeCustomParams, changeTipParams} from '../../util/util.js'
    import * as iconBase64Map from '../../util/imageBase64.js'
    import {orderModel} from '@/models/myOrder.js'
    import { consultationList } from '@/models/consultationList.js'
    const consultation = new consultationList()
    const order = new orderModel()
    const app = getApp()
	const { TextMessage } = require('../../libs/leancloud-realtime.js')
    export default {
        components: {
            talkBar,
            emoji
        },
        data() {
            return {
				sendButtonStyle:{
					color: '#fff',
					position: 'fixed',
					bottom: '3px',
					right: '12px',
					left: '12px',
					background: 'linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%)'
				},
				acceptButtonStyle:{
					padding: '0 57px',
					border: 'none',
					height: '40px',
					lineHeight: '40px',
					textAlign: 'center',
					color: '#fff',
					fontSize: '13px',
					background: 'linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%)'
				},
				confirmButtonStyle: {
					// margin: '15px 20px',
					width: '123px',
					// height: '35px',
					// lineHeight: '35px',
					textAlign: 'center',
					color: '#FFFFFF',
					fontSize: '16px',
					background: 'linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%)',
				},
            	isShowRoute: false,
				checkIcon: [],
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': ''
                },
				defaultUserLogo: 'http://file.aihuihc.com/patient/patientImages/images/default-icon.png',
                videoContext: null, // 视频操纵对象
				videoPlayStatus: false, // 视频是否播放
                videoSrc: '', // 视频源
                recorderManager: null, // 微信录音管理对象
                recordClicked: false, // 判断手指是否触摸录音按钮
                iconBase64Map: {}, //发送栏base64图标集合
                isLongPress: false, // 录音按钮是否正在长按
                chatWrapperMaxHeight: 0,// 聊天界面最大高度
                chatTo: '', //聊天对象account
                chatType: '', //聊天类型 advanced 高级群聊 normal 讨论组群聊 p2p 点对点聊天
                focusFlag: false,//控制输入框失去焦点与否
                emojiFlag: false,//emoji键盘标志位
                moreFlag: false, // 更多功能标志
                tipFlag: false, // tip消息标志
                tipInputValue: '', // tip消息文本框内容
                sendType: 0, //发送消息类型，0 文本 1 语音
                messageArr: [], //[{text, time, sendOrReceive: 'send', displayTimeHeader, nodes: []},{type: 'geo',geo: {lat,lng,title}}]
				originMessages: [], // im原始消息
				inputValue: '',//文本框输入内容
                from: '',
				selectBtn: false,
				givellBtn: false,
				talkBtn: false,
				isHidden: true,
				optionsOrderId: '',
				status: '',
				healthCardId: '',
				checkupNo: '',
				cardId: '',
				cancelDescription: '',
				listCheckups: {},
				customerLast:{},
				// todo
				bookingNo: '',
				clinicNo: '',
				hospitalId: '',
				patientId: '',
				advisoryType: '',
                orderId: '',
                orderNumber: '',
				clinicTime: '',
				price: '',
                canTalk: '20000',
                alreadyTalk: '0',
                top: app.globalData.ImTitleBarHeight,
				inputBottom: 0,
				inputBottomPadding: 0,
				prescribeType: '',
				lastMessage:{},
				conversationCustom: {},
				messageLimit: 0,
            }
        },
        onUnload() {
            // 更新当前会话对象账户
        },
		onShow(){
			this.drawPoint()
			this.initImCustom()
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
				// console.log(12312);
				this.scrollToBottom()
			}
			console.log(this.messageLimit);
		},
        onLoad(options){
        	let avatar = uni.getStorageSync('avatar')
			app.globalData.currentConversation.set('custom.doctorAvatar',avatar);
			app.globalData.currentConversation.save();
			uni.startPullDownRefresh();
			console.log(options,avatar,app.globalData.currentConversation);
			this.prescribeType = uni.getStorageSync('prescribeType')
            if(options.orderId){
                this.optionsOrderId = options.orderId
            }
            let chatWrapperMaxHeight = wx.getSystemInfoSync().windowHeight - 52 - 35
            // 初始化聊天对象
            this.iconBase64Map = iconBase64Map
            this.chatWrapperMaxHeight = chatWrapperMaxHeight

			this.advisoryType = uni.getStorageSync('advisoryType')+ ''
			if(options.prescribeIndex){
				this.advisoryType = '2'
				app.globalData.currentConversation.set('custom.advisoryType','2');
				app.globalData.currentConversation.save();
				let prescribeIndex = JSON.parse(options.prescribeIndex)
				console.log(prescribeIndex,this.prescribeType,'处方检查检验');
				this.drawPoint()
				this.initImCustom()
				this.scrollToBottom()
				if(this.prescribeType==='1'){
					this.doTheThing(prescribeIndex.clinicalDiagnosis,prescribeIndex.patientId,prescribeIndex.hospitalId,prescribeIndex.diagnosisOrderNo,prescribeIndex.id)
				}
				if(prescribeIndex.ihCheckInspectionDetails){
					for(let i=0;i<prescribeIndex.ihCheckInspectionDetails.length;i++){
						if(i===prescribeIndex.ihCheckInspectionDetails.length-1){
							let item = prescribeIndex.ihCheckInspectionDetails[i]
							const titleName = this.prescribeType==='2'?'检查申请单xla1608191455016':this.prescribeType==='3'?'检验申请单xla1608191455016':''
							const trueVal = titleName+prescribeIndex.clinicalDiagnosis+'xla1608191455016'+item.departName
							console.log(i,trueVal,prescribeIndex,'testData');
							this.doTheThing(trueVal,prescribeIndex.patientId,prescribeIndex.hospitalId,'',prescribeIndex.id)
						}
					}
				}
			}
        },
		computed:{
			hasNewMes() {
				console.log(app.globalData.currentConversation.lastMessage,'收到消息');
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
				console.log(app.globalData.currentConversation,app.globalData.currentConversation.lastMessage,'最后消息');
				if(app.globalData.currentConversation._attributes.custom){
					this.conversationCustom = app.globalData.currentConversation._attributes.custom
					this.orderId = this.conversationCustom.orderId?this.conversationCustom.orderId:''
					this.orderNumber = this.conversationCustom.orderNumber?this.conversationCustom.orderNumber:''
					this.advisoryType = this.conversationCustom.advisoryType?this.conversationCustom.advisoryType:''
				}
				if(app.globalData.currentConversation.lastMessage){
					this.lastMessage = app.globalData.currentConversation.lastMessage
				}
			},
			confirmInquiry(){ // 接受问诊
				this.apiUpdateRepeatDiagnosisOrder(5)
			},
			// 查询订单状态
			selectAdvisoryOrder(){
				const data = {
					advisoryOrderId: this.orderId
				}
				order.selectAdvisoryOrder(data).then(res=>{
					if(res.data){
						this.status = res.data.status
						this.price = res.data.realPrisce
						this.orderNumber = res.data.orderNumber
						this.healthCardId = res.data.healthCardId
						this.updateOrderStatus()
						const data = {
							healthCardId: res.data.healthCardId
						}
						this.getCardId(data)
					}
				}).catch(err=>{
					this.givellBtn = true
					this.selectBtn = false
					this.talkBtn = false
				})
			},
			getCardId(data) {
				consultation.healthCardDetails(data).then(res => {
					this.cardId = res.data.healthCardNo
				}).catch(err => {
					console.log(err)
				})
			},
			// 页面内改变状态
			updateOrderStatus(){
				if(this.status == 1){
					this.selectBtn = true
					this.givellBtn = false
					this.talkBtn = false
				}
				else if(this.status == 0 || this.status == 2 || this.status == 3 || this.status == 4 || this.status == 6 || this.status == 7){
					this.givellBtn = true
					this.selectBtn = false
					this.talkBtn = false
				}else if(this.status == 5){
					this.selectBtn = false
					this.talkBtn = true
					this.givellBtn = false
				}
			},
			apiGetStatus(){ // 取消预约锁定的号源
				consultation.getStatus().then((res)=>{
					console.log(res);
					if(res.data===0){ // todo
						this.isShowRoute = true
					}
					if(res.data===1){
						this.isShowRoute = true
					}
				}).catch((err)=>{
					console.log(err);
				})
			},
			apiUpdateRepeatDiagnosisOrder(status){
				if(this.advisoryType==='1'){
					return
				}
				let data = {
					orderNo:this.orderNumber,
					status: status
				}
				consultation.updateRepeatDiagnosisOrder(data).then((res)=>{
					if(status===5){
						app.globalData.currentConversation.set('custom.businessStatus',2);
						app.globalData.currentConversation.save();
						this.doTheThing(`你已接受问诊`)
					}
					if(status===6){
						app.globalData.currentConversation.set('custom.businessStatus',10001);
						app.globalData.currentConversation.save();

						// todo
					}
				}).catch((err)=>{
				})
			},
			apiSelectRepeatDiagnosisOrder(){ // 查询复诊订单详情
				if(this.advisoryType==='1'){
					return
				}
				consultation.selectRepeatDiagnosisOrder({orderNo:this.orderNumber}).then((res)=>{
					if(res.data){
						this.hospitalId = res.data.hospitalId
						this.patientId = res.data.patientId
						this.bookingNo = res.data.bookingNo
						this.clinicNo = res.data.clinicNo
						this.orderNumber = res.data.orderNo
						this.clinicTime = res.data.clinicTime
						this.price = res.data.realPrice
						this.status = res.data.status
						if(res.data.status === 5){
							this.talkBtn = true
						}
						else{
							this.talkBtn = false
						}
					}
				}).catch((err)=>{
					console.log(err);
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
            formatMes(sendOrReceive,mes){
                if(sendOrReceive==='send'){
                    if(mes.message){
                        return mes.message
                    }
                    else{
                        return mes
                    }
                }
                if(sendOrReceive==='receive'){
                    if(mes.message){
                        return mes.message
                    }
                    else{
                        mes = mes.replace(/你/, "该患者")
                        return mes
                    }
                }
            },
            //取消按钮
            goCancle(){
                this.isHidden = true
				this.cancelDescription = ''
            },
            drawPoint(type){
				let messageLimit = this.messageLimit===0?1:this.messageLimit
				if(type){
					wx.showLoading({
						title: '加载中...'
					})
					setTimeout(()=>{
						wx.hideLoading()
					},500)
				}
				let doctorMessage = app.globalData.currentConversation.createMessagesIterator({ limit: 20*messageLimit })
				doctorMessage.next().then((messages)=> {
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
				}).catch(console.error.bind(console));
				app.globalData.currentConversation.fetch().then((res)=>{
					console.log(res,'asdfasdfads')
				})
				if(this.customerLast){
					if(this.customerLast.custom){
						const custom = JSON.parse(this.customerLast.custom)
						if(!this.orderId){
							if(this.optionsOrderId.length>0){
								this.orderId = this.optionsOrderId
							}else{
								this.orderId = custom.orderId
							}
						}
					}
				}
				if(!this.orderId){
					if(this.optionsOrderId.length>0){
						this.orderId = this.optionsOrderId
					}
				}
				if(this.advisoryType==='1'){
					this.selectAdvisoryOrder()
				}
				if(this.advisoryType==='2'){ // 问诊订单状态查询
					this.apiSelectRepeatDiagnosisOrder()
					this.apiGetStatus()
				}
            },
            apiPayRefund(){
				const data = {
					bookingNo: this.bookingNo,
					cancelReason: this.cancelDescription,
					clinicNo:this.clinicNo,
					clinicTime:this.clinicTime,
					orderNo: this.orderNumber,
					patientId: this.patientId,
					cancelType:1,
					regType: 2,
					price: this.price
				}
				consultation.cancelRegister(data).then((res) => {
					this.givellBtn = true
					this.selectBtn = false
					this.talkBtn = false
					wx.switchTab({
						url: '/pages/consultationList/index'
					})
					this.cancelDescription = ''
				}).catch((err) => {
					uni.showToast({
						title: '退款失败',
						icon: 'none',
					})
					this.cancelDescription = ''
				})
            },
            //确认
            goConfirm(){
                if(this.cancelDescription == ''){
                    wx.showToast({
                        title: '请填写拒绝原因',
                        icon: 'none'
                    })
                }else{
					this.isHidden = true
                	if(this.advisoryType==='1'){
						const data = {
							advisoryOrderId: this.orderId,
							cancelDescription: this.cancelDescription,
							cancelType: 1
						}
						this.getPayRefund(data)
					}
					if(this.advisoryType==='2'){
						this.apiPayRefund()
					}
                }
            },
			getPayRefund(data) {
				order.advisoryOrderRefund(data).then(res => {
					this.givellBtn = true
					this.selectBtn = false
					this.talkBtn = false
					this.doTheThing(`你由于"${this.cancelDescription}"的原因取消了订单，请知悉`)
					this.cancelDescription = ''
				}).catch(err => {
					this.isHidden = true
					this.cancelDescription = ''
				})
			},
            // 获取体检报告参数
            getMes(data){
				if(!data.text){
					return
				}
				console.log(data);
				let myTime = data.text.slice(-19)
				if(myTime && this.cardId && data.nodes[0].report===true&&data.nodes[0].params.params.checkupNo) {
					let cardData = {
						idCards: this.cardId
					}
					consultation.listCheckup(cardData).then(res => {
						this.listCheckups = res.data.filter(item => {
							return item.signTime == myTime
						})
						wx.navigateTo({
							url: './physicalReport?listCheckups=' + JSON.stringify(this.listCheckups[0])
						})
					}).catch(err => {
					})
				}
				if(myTime && data.nodes[0].params.patientId) {
					console.log(data.nodes[0].params,data.nodes[0].params.id);
					let myPrescriptionId = data.nodes[0].params.id
					uni.setStorageSync('prescribeType','1')
					if(data.nodes[0].report==='clinicBill'){
						uni.setStorageSync('prescribeType','1')
					}
					if(data.nodes[0].report==='checkSpecial'){
						let mesType = data.text.split('xla1608191455016')[0]
						if(mesType==='检查申请单'){
							uni.setStorageSync('prescribeType','2')
						}
						if(mesType==='检验申请单'){
							uni.setStorageSync('prescribeType','3')
						}
					}
					uni.navigateTo({
						url: `/pagesA/myPrescription/details?id=${myPrescriptionId}`
					})
				}
            },
            // 赠送服务
            apiAddAdvisoryOrder(data){
                order.addAdvisoryOrder(data).then(res=>{
                    this.orderId = res.data.id
                    this.status = res.data.status
                    this.orderNumber = res.data.orderNumber
					app.globalData.currentConversation.set('custom.orderId',this.orderId);
					app.globalData.currentConversation.set('custom.orderNumber',this.orderNumber);
					app.globalData.currentConversation.save();
                    this.doTheThing('你已赠送服务')
                    this.updateOrderStatus()
                }).catch(err=>{

                })
            },
            throttle(gapTime) {
                let _nowTime = new Date().getTime()
                if (_nowTime - this._lastTime > gapTime || !this._lastTime) {
                    const data = {
                        healthCardId: this.healthCardId,
                        doctorId: wx.getStorageSync('doctorId'),
                        advisoryConfigId: 1,
                        isPay: 2,
                        price: 0
                    }
                    this.apiAddAdvisoryOrder(data)
                    this._lastTime = _nowTime
                }
            },
            addAdvisoryOrder(){
                this.throttle(1500)
            },
            cancelBtn(){
                this.isHidden = false
            },
            confirmBtn(){
                const data = {
                    advisoryOrderId: this.orderId,
                    type: 5
                }
                order.updateAdvisoryOrder(data).then(res=>{
                    this.selectBtn = false
                    this.givellBtn = false
                    this.talkBtn = true
                    this.doTheThing('你已接受咨询')
                }).catch(err=>{

                })
            },
            finishOrder(type){
                let that = this
                uni.showModal({
                    title: '提示',
                    content: `确定已经完成${type}吗？`,
                    showCancel: true,
                    cancelText: '取消',
                    confirmText: '确定',
                    success(res) {
                        if (res.confirm) {
							if(that.advisoryType==='1'){
								const data = {
									advisoryOrderId: that.orderId,
									type: 6
								}
								order.updateAdvisoryOrder(data).then(res=>{
									that.doTheThing(`你已完成订单`)
								}).catch(err=>{
								})
							}
							if(that.advisoryType==='2'){
								that.apiUpdateRepeatDiagnosisOrder(6)
							}
						}
					},
					fail(err) {}
				})
			},
			recordClick(){
				// if(this.talkBtn){
				// todo
				if(this.advisoryType === '1'||this.advisoryType === '2'){
					let report = '1'
					if(this.advisoryType === '2'){
						report = '2'
					}
					uni.navigateTo({
						url: `/pagesA/consulting/medicalRecord?idCard=${this.cardId}&chatTo=${this.chatTo}&type=${this.chatType}&isReport=${report}&patientId=${this.patientId}`
					})
				}else{
					wx.showToast({
						title: '在咨询中方可查看电子病历',
						icon: 'none'
					})
				}
			},
			talkClick(){
				return
			},
			back(){
				uni.switchTab({
					url: '/pages/consultationList/index'
				})
			},
            /**
             * 重新计算时间头
             */
            reCalcAllMessageTime() {
                let tempArr = [...this.messageArr]
                if (tempArr.length == 0) return
                // 计算时差
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
				this.inputBottomPadding = this.inputBottom*2
				console.log(this.inputBottom,'mnargin');
			},
            /**
             * 切出更多
             */
            toggleMore() {
                this.moreFlag = !this.moreFlag
                this.focusFlag = false
                this.emojiFlag = false
				if(!this.moreFlag){
					this.inputBottomPadding = 0
				}
			   	if(this.moreFlag) {
			   		this.inputBottomPadding = 400
				}
            },
            /**
             * 切换出emoji键盘
             */
            toggleEmoji() {
                this.sendType = 0
                this.emojiFlag =  !this.emojiFlag
                this.moreFlag = false
				if(!this.emojiFlag){
					this.inputBottomPadding = 0
				}
				if(this.emojiFlag) {
					this.inputBottomPadding = 490
				}
            },
            inputBlur() { // 失去焦点
				console.log('asdfaasd');
				this.focusFlag = false
				this.inputBottom = 0
				if(!this.emojiFlag&&!this.moreFlag){
					this.inputBottomPadding = 0
				}
            },
            inputSend(e) { // 键盘单击发送，发送文本
                this.sendRequest(e.detail.value,'text')
            },
            /**
             * 滚动页面到底部
             */
            scrollToBottom() {
				let timer = setTimeout(() =>{
					uni.pageScrollTo({
						scrollTop: 999999,//滚动到目标位置
						duration:200,//过渡时间必须为0，uniapp bug，否则运行到手机会报错
						success:function(){
						}
					})
					clearTimeout(timer)
				},100)
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
                                success: function (res) {
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
                                success: () => {//授权成功
                                    showToast('success', '授权成功')
                                }
                            })
                        }
                    },
                    fail: function () {
                        showToast('error', '鉴权失败，请重试')
                    }
                })
            },
            /**
             * 开始录音
             */
            startRecord() {
                let self = this
                showToast('text', '开始录音', {duration: 120000})
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
                    success: function (res) {
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
			openPresention(type){
				const dataMes = {
					hospitalId:this.hospitalId,
					orderNo: this.orderNumber,
					patientId:this.patientId,
					bookingNo:this.bookingNo,
					clinicNo:this.clinicNo,
				}
				console.log(dataMes);
				uni.setStorageSync('prescribeType',type)
				uni.removeStorageSync('dosageData')
				uni.removeStorageSync('prescribeIndex')
				uni.navigateTo({
					url: `/pagesA/prescribe/index?imData=${JSON.stringify(dataMes)}`
				})
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
                    success: function (res) {
                        if (res.tapIndex === 0) { // 相片
                            wx.chooseImage({
                                sourceType: ['camera'],
                                success: function (res) {
                                    self.sendImageToNOS(res)
                                },
                            })
                        } else if (res.tapIndex === 1) { // 视频
                            wx.chooseVideo({
                                sourceType: ['camera', 'album'],
                                success: function (res) {
                                    if (res.duration > 60) {
                                        showToast('text', '视频时长超过60s，请重新选择')
                                        return
                                    }
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
                    this.inputValue = this.inputValue + val
                } else {//大图
                    this.sendBigEmoji(val)
                }
            },
			doTheThing(val,patientId,hospitalId,orderNo,prescribeId) {
				let content = {}
				if(patientId){
					content = {
						type: 'report',
						content: val,
						params: {
							hospitalId:hospitalId,
							orderNo:orderNo,
							patientId:patientId,
							id: prescribeId,
							type:'report'
						}
					}
				}
				this.sendRequest(val,'tip',content)
            },
			getImNick(type){
				console.log(this.lastMessage);
				if(this.lastMessage){
					if(this.lastMessage.attributes){
						if(this.lastMessage.attributes.nickFrom && type==='from'){
							return this.lastMessage.attributes.nickFrom
						}
						if(this.lastMessage.attributes.nickTo && type==='to'){
							return this.lastMessage.attributes.nickTo
						}
					}
				}
			},
			sendRequest(val,type,content) { // 发送网络请求：发送文本消息(包括emoji)
				let self = this
				this.initShow(true,200)
				let doctorNick = app.globalData.currentConversation._attributes.custom.doctorNick
				const messageData = { // 默认文本格式
					"type": "text",
					"time": new Date().getTime(),
					"nick": doctorNick,
				}
				if(type==='text'){
					messageData['text'] = val || self.inputValue
				}
				if(type==='tip'){
					messageData['type'] = "tip"
					messageData['params'] = content
					messageData['text'] = val
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
						console.log('Tom & Jerry', '发送text成功',message);
					}
					if(type==='emoji'||type==='custom'){
						self.tipFlag = false
						self.moreFlag = false
						self.focusFlag = false
						self.emojiFlag = false
						this.inputBlur()
						console.log('Tom & Jerry', '发送emoji表情成功',message);
					}
					let messageCopy = {
						from: app.globalData.imClient.id,
						to: app.globalData.currentConversation.members[0],
						custom: JSON.stringify(app.globalData.currentConversation._attributes.custom),
						messageContent:JSON.stringify(messageData)
					}
					console.log('后台回调接口');
					this.messageCopyCallBack(messageCopy)
					// 滚动到底部
					this.drawPoint()
					this.initImCustom()
					this.scrollToBottom()
					this.initShow(true,200)
					wx.hideLoading()
				}).catch(console.error)
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
					success: function (res) {
						switch (res.tapIndex) {
							case 0:
								wx.showActionSheet({
									itemList: ['确定'],
									itemColor: '#ff0000',
									success: function (res) {
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
			recallMessage(oldMessage) {
				let self = this
				app.globalData.currentConversation.recall(oldMessage).then(function(recalledMessage) {
					self.drawPoint()
				}).catch(function(error) {
					console.log(error);
					showToast('text', '消息已超过2分钟，不能撤回')
				});
			},
            requestFullScreenVideo(video) { // 全屏播放视频
                this.videoSrc = video.url
				console.log(this.videoSrc);
				uni.navigateTo({
					url: './videoDetail?videoSrc=' + encodeURIComponent(this.videoSrc)
				})
            },
            playImage(imgNode){
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
                audioContext.onPlay(() => {
                })
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
						return custom.doctorAvatar
					}
					if(sendOrReceive==='receive'){
						return custom.patientAvatar
					}
					else{
						return this.defaultUserLogo
					}
				}
			},
        }
    }
</script>
<style>
	page {
		height: 100%;
		background-color: rgb(248, 248, 248);
	}
</style>

<style lang="scss" scoped>
    /*顶部记录框  */
    .chating-history {
        position: fixed;
        padding: 0 20rpx;
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        box-sizing: border-box;
        background-color: #FDF3E9;
        z-index: 1;
        display: flex;
        color:#333333;
        font-size:15px;
        justify-content: space-between;
        align-items: center;
        .chating-history-left {
            margin-left:12px;
        }
        .chating-history-right {
            margin-left:18px;
        }
        .chating-history-text {
            color:#734D23;
            margin-left:3px;
        }
    }
    .chating-history-right-button{
        width:82px;
        height:30px;
        color:#734D23;
        line-height: 30px;
        font-size:13px;
        text-align: center;
        border-radius:3px;
        border:1px solid #734D23;
    }
    .content-box {
        /*height: 100vh;*/
    }
    .content-box /deep/ .selectTalk{
        background: #DAEDFF;
        color: #B2B2B2;
        padding: 0 26px;
    }
    .content-box /deep/ .selectRecord{
        background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
        color: #fff;
    }
    .chating-wrapper {
        width: 100%;
        min-height: 100%;
        position: relative;
        box-sizing: border-box;
        background: #F8F8F8;
	}
    /* 收起键盘热区 */
    .fold-keyboad-wrapper {
        position: fixed;
        top: 35px;
        width: 100%;
        height: 250px;
    }
    /*聊天输入框  */
    .chatinput-wrapper {
        width: 100%;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
    }
	.uni-text-inputHidden{
		width: 100%;
		height: 100rpx;
	}
    .chatinput-btn{
        width: 100%;
        height: 50px;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
    }
    .chatinput-content {
        width: 100%;
        height: 100rpx;
        input {
            margin-bottom: 10px;
        }
    }
    .tipsBtn-content {
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;
		justify-content: space-around;
        .tipsBtn{
            height: 80rpx;
            line-height: 80rpx;
            font-size: 13px;
            padding: 0 114rpx;
            border: none;
			margin: 0;
        }
        .tipsBtnCancel{
            color: #2884FF;
            border: 1px solid #2884FF;
        }
        .tipsBtnConfirm{
            color: #fff;
            background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
        }
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
        border-radius: 12rpx;
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
        border-radius: 12rpx;
        border: 1px solid #ccc;
        margin-top: 12rpx;
        vertical-align: top;
        box-sizing: border-box;
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
    .chatinput-subcontent {
        width: 100%;
        height: 470rpx;
        background-color: #999;
    }
    .fr {
        float: right;
    }
    .more-subcontent {
        padding: 40rpx 30rpx 0rpx 30rpx;
        border: 2rpx solid #ccc;
        .more-subcontent-box {
            display:flex;
			flex-wrap: wrap;
        }
    }
    .more-subcontent .more-subcontent-item {
        display: flex;
        position: relative;
        margin-right: 35rpx;
        margin-bottom: 35rpx;
		width: 140rpx;
		height: 140rpx;
    }

	.more-subcontent-items{
		display: flex;
		position: relative;
		margin-right: 35rpx;
		margin-bottom: 35rpx;
		width: 138rpx;
		height: 138rpx;
	}

	.more-subcontent-noMarginRight{
		margin-right: 0rpx;
	}

	.uni-special-imBox{
		display: flex;
		text-align: center;
		border:1rpx solid #E7E7E7;
		border-radius: 10rpx;
		img{
			margin-top:24rpx;
			margin-left:44rpx;
			width: 54rpx;
			height: 60rpx;
		}
		.text-special{
			position: absolute;
			bottom:8px;
			display: block;
			width: 100%;
			font-size: 24rpx;
			text-align: center;
			color: #6C7074;
		}
	}
	.more-subcontent-img{
		width: 140rpx;
		height: 140rpx;
	}

    .more-subcontent .more-subcontent-item .text {
        position: absolute;
        bottom:8px;
        display: block;
        width: 100%;
        font-size: 24rpx;
        text-align: center;
        color: #6C7074;
    }
    /*聊天记录  */
    .record-wrapper {
        width: 100%;
		transition: 0.1s;
        padding-bottom: 100rpx;
        padding-top: 100rpx;
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
        border-radius: 8rpx;
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
        border-radius: 8rpx;
        background-color: #3387FF;
        padding: 16rpx;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow: hidden;
        font-size: 32rpx;
        line-height: 48rpx;
    }
    .record-chatting-item-underline{
        text-decoration: underline;
    }
    .record-chatting-item-nodes {
        color:#000;
        background-color:#fff;
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
        border-radius: 10rpx;
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
    .small-map-wrapper {
        overflow: hidden;
        width: 452rpx;
        height: 300rpx;
        position: relative;
        border-radius: 8rpx;
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
        opacity: 0.75;
        font-size: 28rpx;
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
        border-radius: 20rpx;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .video-triangle-text {
            color: #000;
        }
    }
    .small-video-wrapper .video {
        max-width: 200px;
        max-height: 300px;
    }
    .audio-wrapper {
        background-color: #fff;
        border-radius: 28rpx;
        display: flex;
        justify-content: space-between;
        padding: 0 20rpx;
        min-width: 30%;
        box-sizing: border-box;
        margin-left: -2px;
    }
    .audio-wrapper-box {
        background-color:#3387FF;
        color: #000;
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
    .text-audio {
        color:#000;
    }
    .rich-text-box {
        display: flex;
        justify-content: center !important;
        align-items: center;
    }
    /*拒绝弹出框*/
    .cancel-modal {
        border-radius: 5px;
        .cancel-textarea {
            border: 1px solid gray;
            width: 95%;
            margin: 0 auto;
            border-radius: 5px;
        }
    }
	.uni-modal {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		z-index: 999999;
	}
	.modalContent {
		padding: 20rpx 20rpx;
		border: 1px solid #ccc;
		width: 660rpx;
		position: absolute;
		/*让节点脱离文档流,我的理解就是,从页面上浮出来,不再按照文档其它内容布局*/
		margin: 0 auto;
		top: 280rpx;
		/*节点脱离了文档流,如果设置位置需要用top和left,right,bottom定位*/
		left: 0;
		right: 0;
		bottom: 1;
		border-radius: 20rpx;
		z-index: 2;
		background: white;
	}
	.personal-box {
		width: 95%;
		height: 600rpx;
		margin: 0 auto;
		background-color: #FFFFFF;
		font-size: 15px;
		color: #333333;
		border-radius: 10px;
		border: 1px solid #e5e5e5;
		textarea{
			padding: 20px 5px;
			margin: 0 auto;
			width: 100%;
		}
	}
	.uni-btn{
		display: flex;
	}
	.confirmBtn {
		width: 246rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 32rpx;
		text-align: center;
		color: #FFFFFF;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		margin: 30rpx 40rpx;
	}
	.cancleBtn {
		width: 246rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 32rpx;
		text-align: center;
		color: #4484F8FF;
		background: #FFFFFF;
		border: 2rpx solid #4484F8FF;
		margin: 30rpx 40rpx;
	}
	.confirmBtns{
		margin-top: 15px;
		width: 246rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	button::after {
		border: none;
	}
</style>
