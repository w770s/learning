<template>
	<view style="background: #FFFFFF;min-height:100vh;">
		<u-bar :nav="setNav" :route="'/pagesA/consultationOrder/index'" />
		<view style="height: 60rpx; background: linear-gradient(to right,#5EA6F8,#3B7CF4);"></view>
		<view style="padding:24rpx;">
			<view class="uni-user-box">
				<view class="uni-user-box-item">
					<view style="height: 90rpx; border-bottom: 1rpx solid #E5E5E5;">
						<view style="display: flex;justify-content: space-between;align-items: center;">
							<view style="margin-left: 30rpx; width: 144rpx; height: 90rpx; line-height: 90rpx; font-size: 36rpx; font-weight: 600; color: #333333;">图文问诊</view>
							<view v-if="userInfo.status === 0" class="" style="height: 90rpx;margin-right: 10rpx;">
								<view style="color: #FF745F;text-align: right;font-size: 26rpx;">待支付（剩余时间{{countDown}}）</view>
								<view style="color: #B2B2B2;text-align: right;font-size: 22rpx;">提示：若15分钟内未支付，该订单将会取消</view>
							</view>
							<view v-if="userInfo.status !== 0" class="uni-consult-color">{{ famtterStatus(userInfo.status)}}</view>
						</view>
					</view>
					<view style="padding: 15px 0px; display: flex;">
						<img style="margin-left:15px;width: 100rpx; height: 100rpx;border-radius: 50%;" :src="userInfo.doctorImageList" />
						<view style="height: 100rpx; margin-left: 20rpx;">
							<text style="font-size: 36rpx; font-weight: 600; color: #333333;">{{userInfo.name}}</text>
							<text class="docText">{{userInfo.doctorLevel?userInfo.doctorLevel:''}}</text>
							<text class="docText">{{userInfo.departName?userInfo.departName:''}}</text>
							<view style="font-size: 24rpx; color: #B2B2B2FF;margin-top:10px">{{userInfo.createTime?userInfo.createTime:''}}</view>
						</view>
					</view>
				</view>
			</view>
			<view style="line-height: 60rpx;">
				<view class="messageTitle">患者信息</view>
				<view class="messageLabel">姓名：<text class="messageText">{{userInfo.patientName}} ({{formatterCard(userInfo.idCardNo)}})</text></view>
				<view class="messageLabel">性别：<text class="messageText">{{userInfo.gender===0?'男':'女'}}</text></view>
				<view class="messageLabel">年龄：<text class="messageText">{{userInfo.age?userInfo.age+'岁':''}}</text></view>
				<view class="messageLabel">电话：<text class="messageText">{{userInfo.phone?userInfo.phone:''}}</text></view>
			</view>
			<view style="padding-top: 60rpx;line-height: 60rpx;">
				<view class="messageTitle">咨询订单信息</view>
				<view class="messageLabel">订单类型：<text class="messageText">图文问诊</text></view>
				<view class="messageLabel">下单时间：<text class="messageText">{{userInfo.createTime?userInfo.createTime:''}}</text></view>
				<view class="messageLabel">下单金额：<text class="messageText">{{userInfo.realPrice?userInfo.realPrice/100+'元':''}}</text></view>
				<view class="messageLabel">支付方式：<text class="messageText">微信支付</text></view>
				<view class="messageLabel">订单编号：<text class="messageText">{{userInfo.orderNo?userInfo.orderNo:''}}</text></view>
			</view>
			<view style="padding-top: 60rpx;line-height: 60rpx;" v-if="userInfo.status === 4">
				<view class="messageTitle">退款进度</view>
				<view class="messageLabel">退款进度：<text class="messageText">退款成功</text></view>
				<view class="messageLabel">退款时间：<text class="messageText">{{userInfo.updateTime?userInfo.updateTime:''}}</text></view>
			</view>
			<button v-if="userInfo.status === 5" class="uni-button-box" @tap="goConsult(userInfo.relationId,'2',)">进入咨询对话</button>
			<button v-if="userInfo.status === 0" class="uni-button-box" @tap="payMoney(userInfo)">去支付({{countDown}})</button>
			<button v-if="userInfo.status === 6" class="uni-button-box" @tap="goConsult(userInfo.relationId,'10001',)">去评价</button>
			<view v-if="userInfo.status === 7&&evaluateList.length>0" style="line-height: 60rpx;">
				<view class="sun-title messageTitle" style="padding-top: 60rpx;">评价信息</view>
				<view class="uni-grade-box">
					<view class="uni-grade-flexBox">
						<view style="display: flex;">
							<view class="uni-grade-RateBox">
								<u-sunui-star v-if="optionContent" :defaultStar="optionContent" starSize="2em" :disabledStar="true" />
							</view>
						</view>
					</view>
					<view class="uni-grade-textarea" v-if="textareaData">评价:{{' '+textareaData}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	import {
		consultationModel
	} from '@/models/consultationOrder.js'
	const consultation = new consultationModel()
	import {
		myOrderModel
	} from '@/models/myOrder.js'
	const myOrder = new myOrderModel()
	import {
		dateToString, getConversationInquiry
	} from "../../util/util";
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
				countDown: '',
				orderNumber: '',
				createTime: '',
				count: '',
				userInfo: {},
				dataObject: {},
				fromType: '',
				optionContent: 0,
				textareaData: '',
				evaluateList: [],
				timer: null
			}
		},
		onLoad(options) {
			this.id = options.id
			this.orderNo = options.orderNo
			this.createTime = options.createTime
			if (options.fromType) {
				this.fromType = options.fromType
			}
		},
		onShow() {
			if (this.orderNo) {
				this.evaluateList = []
				this.openId = uni.getStorageSync('userInfo').openId
				const data = {}
				data['orderNo'] = this.orderNo
				this.apiSelectRepeatDiagnosisOrder(data)
				this.apiListQuestion()
			}
			this.openId = uni.getStorageSync('userInfo').openId
			this.userId = uni.getStorageSync('userInfo').userId
		},
		methods: {
			countdown() {
				//获取当前时间
				this.timer = setInterval(() => {
					var date = new Date();
					var now = date.getTime();
					//设置截止时间
					// var t = new Date(this.createTime).getTime()
					// var end=new Date();//定义一个新时间
					// end.setTime(t+1000*60*15);//设置新时间比旧时间多15分钟
					var t = dateToString(this.createTime, 'yyyy-mm-dd hh:mm:ss')
					var tt = t.replace(/-/g, "/")
					var ts = new Date(tt).getTime()
					var end = new Date()
					end.setTime(ts + 1000 * 60 * 15)
					//时间差
					var leftTime = end - now;
					//定义变量 d,h,m,s保存倒计时的时间
					var d, h, m, s;
					if (leftTime >= 0) {
						m = Math.floor(leftTime / 1000 / 60 % 60);
						s = Math.floor(leftTime / 1000 % 60);
						this.countDown = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
					} else {
						const data = {
							orderId: this.userInfo.id,
							cancelType: 3,
							status: 2
						}
						clearInterval(this.timer);
						this.apiUpdateRepeatDiagnosisOrder(data)
					}
				}, 1000)
			},
			apiUpdateRepeatDiagnosisOrder(data) {
				consultation.updateRepeatDiagnosisOrder(data).then(res => {
					this.userInfo.status = 3
				})
			},
			apiListQuestion() {
				myOrder.specificQuestionnaireData({
					correlationNo: this.orderNo,
					questionnaireId: 82
				}).then(res => {
					this.evaluateList = res.data
					res.data.filter(item => {
						if (item.type === '1') {
							this.optionContent = item.optionContent
						}
					})
					res.data.filter(item => {
						if (item.type === '3') {
							this.textareaData = item.optionContent
						}
					})
				}).catch((err) => {
					console.log(err);
				})
			},
			famtterStatus(type) {
				switch (type) {
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
						return '待评价'
					case 7:
						return '已评价'
				}
			},
			formatterCard(card) {
				if (card) {
					return card.substring(0, 4) + "******" + card.substring(14, 18)
				}
			},
			apiSelectRepeatDiagnosisOrder(data) {
				consultation.selectRepeatDiagnosisOrder(data).then((res) => {
					res.data.doctorImageList.forEach((userInfo) => {
						if (userInfo.imageType === 1 && userInfo.sourceType === 10) {
							res.data.doctorImageList = userInfo.url
						}
					})
					this.userInfo = res.data
					console.log(this.userInfo)
					if (res.data.status == 0) {
						this.countdown()
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			goConsult(accId,businessStatus) {
				let account = 'a' + accId
				let members = [app.globalData.imClient.id, account,'onlineInquiry']
				getConversationInquiry(members)
			},
			payMoney(item) {
				this.openId = uni.getStorageSync('userInfo').openId
				const data = {
					openId: this.openId,
					orderNo: item.orderNo,
					tradeChannel: '8006',
					transAmount: item.realPrice
				}
				this.orderNumber = item.orderNo
				this.loading = true
				const that = this
				medical.weixinPay(data).then((res) => {
					if (res.data.payStatus === 1) {
						wx.showToast({
							title: '支付成功！',
							mask: true
						})
					}
					wx.requestPayment({
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.prepayId,
						paySign: res.data.sign,
						signType: res.data.signType || 'MD5',
						success(e) {
							if (e.errMsg == "requestPayment:ok") {
								setTimeout(() => {
									// const data = that.orderNumber
									// medical.frontNotify(data).then(res => {
										that.changePerson(item.relationId)
										return;
									// }).catch(err => {
									// 	console.log(err)
									// })
								}, 1000)
							}
						},
						fail(err) {
							wx.showToast({
								title: '支付失败,请重新支付！',
								icon: "none"
							})
							wx.hideLoading();
							that.loading = false
						}
					})
				}).catch((err) => {
					that.loading = false
					console.log(err)
				})
			},
			changePerson(account) {
				const data = {
					orderNo: this.userInfo.orderNo
				}
				consultation.selectOrderDataRecord(data).then(res => {
					this.dataObject = JSON.parse(res.data.pageData)
					if (this.dataObject) {
						this.goConsult(account,'1',`user=${JSON.stringify(this.dataObject)}`,'redirectTo')
						// wx.redirectTo({
						// 	url: `/pagesA/consulting/consultPage?orderId=${this.orderId}&orderNo=${this.userInfo.orderNo}&user=${JSON.stringify(this.dataObject)}`,
						// })
						clearInterval(this.timer)
						this.loading = false
					}
				}).catch(err => [
					console.log(err)
				])
			}
		}
	}
</script>

<style>
	.uni-user-box {
		height: 240rpx;
		position: relative;
	}

	.uni-user-box-item {
		position: absolute;
		top: -60rpx;
		width: 100%;
		border-radius: 16rpx;
		background: #FFFFFF;
		box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.15);
	}

	.uni-consult-color {
		color: #2884FF;
		display: block;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #333333;
		margin-right: 30rpx;
	}

	.uni-todo-color {
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

	.uni-grade-box {
		padding-top: 20rpx;
		border-bottom: 2rpx solid #E5E5E5;
	}

	.uni-grade-flexBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.uni-grade-RateBox {
		font-size: 24rpx;
		color: #B2B2B2;
		display: flex;
		line-height: 1.8;
	}

	.uni-grade-textarea {
		font-size: 30rpx;
		color: #3E3E3E;
	}

	.uni-grade-box:nth-last-child(1) {
		border-bottom: none;
		padding-bottom: none;
	}
</style>
