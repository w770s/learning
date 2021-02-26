<template>
	<view style="background: #FFFFFF;min-height:100vh;">
		<u-bar :nav="setNav" v-if="!fromType" :route="'/pagesA/myOrder/index'" />
		<u-bar :nav="fromTypeNav" v-if="fromType" :route="'/pagesA/myOrder/index'" />
		<view style="height: 60rpx; background: linear-gradient(to right,#5EA6F8,#3B7CF4);"></view>
		<view style="padding:24rpx;">
			<view class="uni-user-box">
				<view class="uni-user-box-item">
					<view style="height: 90rpx; border-bottom: 1rpx solid #E5E5E5;">
						<view style="margin: 0 0 0 30rpx; padding-top: 20rpx; display: flex;justify-content: space-between">
							<view style="width: 144rpx; height: 50rpx; line-height: 50rpx; font-size: 36rpx; font-weight: 600; color: #333333;">图文咨询</view>
							<view :class="['stateText',userInfo.status === 1 || userInfo.status === 4?'uni-consult-color': userInfo.status === 0?'uni-todo-color':'']">{{ famtterStatus(userInfo.status)}}</view>
						</view>
					</view>
					<view style="padding: 15px 0px; display: flex;">
						<img style="margin-left:15px;width: 100rpx; height: 100rpx;border-radius: 50%;" :src="userInfo.doctorImageList" />
						<view style="height: 100rpx; margin-left: 20rpx;">
							<text style="font-size: 36rpx; font-weight: 600; color: #333333;">{{userInfo.doctorName}}</text>
							<text class="docText">{{userInfo.level}}</text>
							<text class="docText">{{userInfo.departName}}</text>
							<view style="font-size: 24rpx; color: #B2B2B2FF;margin-top:10px">{{userInfo.createTime}}</view>
						</view>
					</view>
				</view>
			</view>
			<view style="line-height: 60rpx;">
				<view class="messageTitle">患者信息</view>
				<view class="messageLabel">姓名：<text class="messageText">{{userInfo.patientName}} ({{formatterCard(userInfo.cardId)}})</text></view>
				<view class="messageLabel">性别：<text class="messageText">{{userInfo.gender===0?'男':'女'}}</text></view>
				<view class="messageLabel">年龄：<text class="messageText">{{userInfo.age}}</text></view>
				<view class="messageLabel">电话：<text class="messageText">{{userInfo.phone}}</text></view>
			</view>
			<view style="padding-top: 60rpx;line-height: 60rpx;">
				<view class="messageTitle">咨询订单信息</view>
				<view class="messageLabel">订单类型：<text class="messageText">图文咨询</text></view>
				<view class="messageLabel">下单时间：<text class="messageText">{{userInfo.createTime}}</text></view>
				<view class="messageLabel">下单金额：<text class="messageText">{{userInfo.realPrice/100+'元'}}</text></view>
				<view class="messageLabel">支付方式：<text class="messageText">微信支付</text></view>
				<view class="messageLabel">订单编号：<text class="messageText">{{userInfo.orderNumber}}</text></view>
			</view>
			<view style="padding-top: 60rpx;line-height: 60rpx;" v-if="userInfo.status === 4">
				<view class="messageTitle">退款进度</view>
				<view class="messageLabel">退款进度：<text class="messageText">退款成功</text></view>
				<view class="messageLabel">退款时间：<text class="messageText">{{userInfo.updateTime}}</text></view>
			</view>
			<button v-if="userInfo.status === 5" class="uni-button-box" @tap="goConsult(userInfo,'2')">进入咨询对话</button>
			<button v-if="userInfo.status === 0" class="uni-button-box" @tap="payMoney(userInfo)">去支付</button>
			<button v-if="userInfo.status === 6" class="uni-button-box" @tap="goConsult(userInfo,'10001')">去评价</button>
			<view v-if="userInfo.status === 7&&evaluateList.length>0" style="line-height: 60rpx;">
				<view class="sun-title messageTitle" style="padding-top: 60rpx;">评价信息</view>
				<view class="uni-grade-box">
					<view class="uni-grade-flexBox">
						<view style="display: flex;">
							<view class="uni-grade-RateBox">
								<u-sunui-star v-if="evaluateList[0].optionContent" :defaultStar="evaluateList[0].optionContent" starSize="2em" :disabledStar="true" />
							</view>
						</view>
					</view>
					<view class="uni-grade-textarea" v-if="evaluateList[1].textareaData">评价:{{' '+evaluateList[1].textareaData}}</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		myOrderModel
	} from '@/models/myOrder.js'
	let myOrder = new myOrderModel()
	import {getConversationInquiry} from "../../util/util";
	let app = getApp()
	export default {
		data() {
			return {
				setNav: {
					isdisPlayNavTitle: true,
					navTitle: '订单详情'
				},
				fromTypeNav: {
					navTitle: '订单详情'
				},
				openId: '',
				orderId: '',
				orderNo: '',
				userInfo:{},
				fromType: '',
				evaluateList: []
			}
		},
		onLoad(options){
			console.log(options)
			this.orderId = options.orderId
			this.orderNo = options.orderNo
			if(options.fromType){
				this.fromType = options.fromType
			}
		},
		onShow(){
			if(this.orderNo){
				this.evaluateList = []
				this.openId = uni.getStorageSync('userInfo').openId
				this.apiGetAdvisoryOrder(this.orderNo)
				this.apiListQuestion()
			}
			this.openId = uni.getStorageSync('userInfo').openId
		},
		methods:{
			apiListQuestion() {
				myOrder.specificQuestionnaireData({correlationNo: this.orderNo,questionnaireId: 82}).then(res => {
					let evaluateList = res.data
					res.data.forEach((item,index) => {
						if (item.type==='1'){
							this.evaluateList.push({optionContent:item.optionContent})
						}
						if (item.type==='3'){
							this.evaluateList.push({textareaData:item.optionContent})
						}
					})
				}).catch((err) => {
					console.log(err);
				})
			},
			famtterStatus(type){
				switch (type) {
					case 0:
						return '待支付'
					case 1:
						return '待接诊'
					case 2:
						return '已取消'
					case 3:
						return '退款中'
					case 4:
						return '已退款'
					case 5:
						return '接诊进行中'
					case 6:
						return '已完成'
					case 7:
						return '已评价'
				}
			},
			formatterCard(card){
				if(card){
					return card.substring(0,4)+"******"+card.substring(14,18)
				}
			},
			apiGetAdvisoryOrder(orderNo){
				myOrder.getAdvisoryOrder({orderNo}).then((res) => {
					res.data.doctorImageList.forEach((userInfo) => {
						if (userInfo.imageType === 1 && userInfo.sourceType === 10) {
							res.data.doctorImageList = userInfo.url
						}
					})
					this.userInfo = res.data
				}).catch((err) => {
					console.log(err);
				})
			},
			goConsult(item,businessStatus){
				let account = 'a'+item.doctorId
				let members = [app.globalData.imClient.id, account,'healthInquiry']
				getConversationInquiry(members)
			},
			payMoney(item) {
				wx.navigateTo({
					url: `/pagesA/medicalReport/consultOrder?accId=${item.doctorId}&order=${item.orderNumber}&orderId=${item.orderId}&price=${item.realPrice}&doctorName=${item.doctorName}`,
				})
			}
		}
	}
</script>

<style>
	.uni-user-box {
		height: 240rpx;
		/*position: absolute;*/
		position: relative;
		/*top: 150rpx;*/
		/*left: 24rpx;*/
		/*right: 24rpx;*/
		/*z-index: 1;*/
	}

	.uni-user-box-item{
		position:absolute;
		top: -60rpx;
		width:100%;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-shadow:0px 2px 6px 0px rgba(59,124,244,0.15);
	}

	.stateText {
		display: block;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #333333;
		margin-right: 30rpx;
	}

	.uni-consult-color{
		color: #2884FF;
	}

	.uni-todo-color{
		color: #FF745F;
	}

	.docText {
		margin-left: 20rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.messageTitle {
		color: #333333;
		font-size: 36rpx;
		font-weight: 600;
	}

	.messageLabel {
		color: #B2B2B2FF;
		font-size: 30rpx;
	}

	.messageText {
		color: #333333;
	}

	.uni-button-box {
		width: 640rpx;
		height: 94rpx;
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
		color: #FFFFFF;
		margin-top: 60rpx;
		line-height: 94rpx;
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
