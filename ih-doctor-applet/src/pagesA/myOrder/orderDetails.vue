<template>
	<view>
		<u-topBar :nav="setNav" />
		<view class="topBar-top"></view>
		<view class="personal-box">
			<view class="uni-user-box" :style="{ top: top + 'px'}">
				<view class="uni-user-boxTop">
					<view class="uni-user-boxTop-top">
						<view class="uni-user-boxTop-topTitle" v-if="!subsequentVisit">{{orderDetails.advisoryType == 1?'图文咨询':orderDetails.advisoryType == 2?'视频咨询':''}}</view>
						<view class="uni-user-boxTop-topTitle" v-if="subsequentVisit">{{orderDetails.businessType == 1?'图文复诊':orderDetails.businessType == 2?'视频复诊':''}}</view>
						<view class="stateText">{{orderDetails.status == 1?'待接诊':orderDetails.status == 2?'已取消':orderDetails.status ==4?'已退款':orderDetails.status ==5?'进行中':orderDetails.status ==6?'已完成':''}}</view>
					</view>
				</view>
				<view class="uni-user-boxBottom">
					<img :src="doctorUrl" mode=""></img>
					<view class="uni-user-boxBottom-box">
						<text v-if="!subsequentVisit" class="uni-user-boxBottom-doctorName">{{orderDetails.doctorName}}</text>
						<text v-if="!subsequentVisit" class="docText">{{orderDetails.level}}</text>
						<text v-if="subsequentVisit" class="uni-user-boxBottom-doctorName">{{orderDetails.name?orderDetails.name:''}}</text>
						<text v-if="subsequentVisit" class="docText">{{orderDetails.doctorLevel?orderDetails.doctorLevel:''}}</text>
						<text class="docText">{{orderDetails.departName}}</text>
						<view class="uni-user-boxBottom-createTime">{{orderDetails.createTime?orderDetails.createTime:''}}</view>
					</view>
				</view>
			</view>
			<view class="patientMessage">
				<view class="messageTitle">患者信息</view>
				<view class="messageLabel">姓名：
					<text class="messageText">{{orderDetails.patientName}}</text>
					<text v-if="!subsequentVisit">({{orderDetails.cardId}})</text>
					<text v-if="subsequentVisit">({{orderDetails.idCardNo}})</text>
				</view>
				<view class="messageLabel">性别：<text class="messageText">{{orderDetails.gender==0?'男':orderDetails.gender==1?'女': ''}}</text></view>
				<view class="messageLabel">年龄：<text class="messageText">{{orderDetails.age}}岁</text></view>
				<view class="messageLabel">电话：<text class="messageText">{{orderDetails.phone}}</text></view>
			</view>
			<view class="orderMessage">
				<view class="messageTitle">咨询订单信息</view>
				<view v-if="orderDetails.advisoryType" class="messageLabel">订单类型：<text class="messageText">{{orderDetails.advisoryType == 1?'图文咨询':orderDetails.advisoryType == 2?'视频咨询':''}}</text></view>
				<view v-if="orderDetails.businessType" class="messageLabel">订单类型：<text class="messageText">{{orderDetails.businessType == 1?'图文复诊':orderDetails.advisoryType == 2?'视频复诊':''}}</text></view>
				<view class="messageLabel">下单时间：<text class="messageText">{{orderDetails.createTime}}</text></view>
				<view class="messageLabel">下单金额：<text class="messageText">{{orderDetails.realPrice/100}}元</text></view>
				<view class="messageLabel">支付方式：<text class="messageText">微信支付</text></view>
				<view v-if="orderDetails.orderNumber" class="messageLabel">订单编号：<text class="messageText">{{orderDetails.orderNumber}}</text></view>
				<view v-if="orderDetails.orderNo" class="messageLabel">订单编号：<text class="messageText">{{orderDetails.orderNo}}</text></view>
			</view>
			<button v-if="orderDetails.status == '5' || orderDetails.status == '1'" class="uni-button-box" @click="switchToChating">进入咨询对话</button>
			<view v-if="orderDetails.status == '7'&&evaluateList.length>0" style="line-height: 60rpx;">
				<view class="sun-title messageTitle" style="padding-top: 60rpx;">评价信息</view>
				<view class="uni-grade-box">
					<view class="uni-grade-flexBox">
						<view style="display: flex;">
							<view class="uni-grade-RateBox">
								<sunui-star v-if="optionContent" :defaultStar="optionContent" starSize="2em" :disabledStar="true" />
							</view>
						</view>
					</view>
					<view class="uni-grade-textarea" v-if="textareaData">评价:{{' '+textareaData}}</view>
				</view>
			</view>

			<view class="messageTitle-box" v-if="orderDetails.status == '2'">
				<view class="messageTitle">取消原因</view>
				<view class="messageTitle-text">{{orderDetails.cancelDescription == null?'': orderDetails.cancelDescription}}</view>
			</view>
			<view class="messageTitle-box" v-if="orderDetails.status == '4'">
				<view class="messageTitle">退款原因</view>
				<view class="messageTitle-text">{{orderDetails.cancelType == 1?'医生拒绝：':''}}{{orderDetails.cancelDescription == null?'': orderDetails.cancelDescription}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import {
		orderModel
	} from '@/models/myOrder.js'
	import {getConversationInquiry} from "../../util/util";
	const order = new orderModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '订单详情'
				},
				orderDetails: {},
				doctorUrl: '',
				top: app.globalData.ImTitleBarHeight,
				optionContent: 0,
				textareaData: '',
				evaluateList: [],
				subsequentVisit: '',
				advisoryType: '',
				businessStatus: '',
			}
		},
		onLoad(options) {
			this.evaluateList = []
			if(options.orderId){
				this.subsequentVisit = false
				this.apiGetAdvisoryOrder(options.orderId)
			}
			if(options.orderNo){
				this.orderNo = options.orderNo
				this.subsequentVisit = true
				this.apiSelectRepeatDiagnosisOrder(options.orderNo)
				this.apiListQuestion()
			}
		},
		methods: {
			apiListQuestion() {
				order.specificQuestionnaireData({correlationNo: this.orderNo,questionnaireId: 82}).then(res => {
					this.evaluateList = res.data
					res.data.filter(item=>{
						if(item.type==='1'){
							this.optionContent = item.optionContent
						}
					})
					res.data.filter(item=>{
						if(item.type==='3'){
							this.textareaData = item.optionContent
						}
					})
				}).catch((err) => {
					console.log(err);
				})
			},
			apiSelectRepeatDiagnosisOrder(orderNo){
				order.selectRepeatDiagnosisOrder({orderNo}).then(res=>{
					this.orderDetails = res.data
					this.orderDetails.idCardNo = res.data.idCardNo.substr(0,3)+ '***********' + res.data.idCardNo.substr(14)
					var url = this.orderDetails.doctorImageList.filter(item => {
						return item.imageType == 1
					})
					if(url.length != 0){
						this.doctorUrl = url[0].url
					}else{
						this.doctorUrl = ''
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			apiGetAdvisoryOrder(orderId){
				order.getAdvisoryOrder({orderId}).then(res=>{
					this.orderDetails = res.data
					this.accId = 'a'+this.orderDetails.patientAccId
					this.orderDetails.cardId = res.data.cardId.substr(0,3)+ '***********' + res.data.cardId.substr(14)
					var url = this.orderDetails.doctorImageList.filter(item => {
						return item.imageType == 1
					})
					if(url.length != 0){
						this.doctorUrl = url[0].url
					}else{
						this.doctorUrl = ''
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			apiSelectHealthCardDetails(patientId) {
				order.selectHealthCardDetails({patientId}).then(res => {
					this.accId = 'a'+res.data.accId
					if(this.accId){
						this.switchDetail()
					}
					if(!this.accId){
						uni.showToast({
							title: '患者账号不存在,暂无法聊天咨询聊天',
							icon: 'none',
							duration: 1000
						})
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			/**
			 * 单击进入聊天页面
			 */
			switchToChating() {
				if(this.orderDetails.status===1){
					this.businessStatus = 1
				}
				if(this.orderDetails.status===5){
					this.businessStatus = 2
				}
				if(!this.subsequentVisit){
					this.advisoryType = '1'
					this.switchDetail()
				}
				else{
					this.accId = ''
					this.advisoryType = '2'
					this.apiSelectHealthCardDetails(this.orderDetails.patientId)
				}
			},
			switchDetail(){
				// console.log(app.globalData.imClient,this.accId);
				let inquiryType = this.advisoryType === '1'? 'healthInquiry' : 'onlineInquiry'
				let members = [this.accId, app.globalData.imClient.id, inquiryType]
				getConversationInquiry(members)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topBar-top {
		height: 40rpx;
		background: linear-gradient(to right,#5EA6F8,#3B7CF4);
	}
	.personal-box {
		background: #FFFFFF;
		padding:24rpx;
	}
	.uni-user-box {
		border-radius: 10rpx;
		height: 252rpx;
		background: #FFFFFF;
		position: absolute;
		/* top: 176rpx; */
		left: 24rpx;
		right: 24rpx;
		z-index: 1;
		box-shadow: 0rpx 0rpx 20rpx 4rpx #3B7CF426;
		.uni-user-boxTop {
			height: 90rpx;
			border-bottom: 1rpx solid #E5E5E5FF;
			.uni-user-boxTop-top{
				margin: 0 0 0 15px;
				padding-top: 10px;
				display: flex;
				.uni-user-boxTop-topTitle{
					width: 144rpx;
					height: 50rpx;
					line-height: 50rpx;
					font-size: 36rpx;
					font-weight: 600;
					color: #333333FF;
				}
			}
		}
		.uni-user-boxBottom {
			height: 100rpx;
			margin: 15px 0 0 0;
			display: flex;
			img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-left: 10px;
			}
			.uni-user-boxBottom-box {
				height: 100rpx;
				margin-left: 20rpx;
				.uni-user-boxBottom-doctorName {
					font-size: 36rpx;
					font-weight: 600;
					color: #333333FF;
				}
				.uni-user-boxBottom-createTime {
					font-size: 24rpx;
					color: #B2B2B2FF;
				}
			}
		}
	}
	.patientMessage {
		padding-top: 252rpx;
		line-height: 60rpx;
	}
	.orderMessage {
		padding-top: 60rpx;
		line-height: 60rpx;
	}
	.stateText {
		display: block;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 420rpx;
		font-size: 26rpx;
		color: #333333FF;
	}
	.docText {
		margin-left: 20rpx;
		font-size: 30rpx;
		color: #333333FF;
	}
	.messageTitle-box {
		padding-top: 60rpx;
		line-height: 60rpx;
		.messageTitle {
			color: #333333FF;
			font-size: 36rpx;
			font-weight: 600;
		}
		.messageTitle-text {
			color: #3E3E3E;
			font-size: 30rpx;
		}
	}
	.messageLabel {
		color: #B2B2B2FF;
		font-size: 30rpx;
	}
	.messageText {
		color: #333333FF;
	}
	.uni-button-box {
		width: 640rpx;
		height: 94rpx;
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
		color: #FFFFFF;
		margin-top: 60rpx;
	}

	.uni-grade-box{
		padding-top: 20rpx;
		border-bottom: 2rpx solid #E5E5E5;
	}

	.uni-grade-flexBox{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.uni-grade-RateBox{
		font-size:24rpx;
		color:#B2B2B2;
		display: flex;
		line-height:1.8;
	}

	.uni-grade-textarea{
		font-size:30rpx;
		color:#3E3E3E;
	}

	.uni-grade-box:nth-last-child(1){
		border-bottom: none;
		padding-bottom: none;
	}
</style>
