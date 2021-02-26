<template>
	<view class="uni-content">
		<u-bar :nav="setNav" />
		<view class="uni-record-box" @click="goPaymentRecord">
			<view class="uni-top-record">
				<img src="http://file.aihuihc.com/patient/patientImages/images/payRecord.png" mode=""></img>
				<view>缴费记录</view>
			</view>
		</view>
		<view class="uni-monetary">
			<view class="uni-monetary-box">
				<view class="uni-monetary-title">{{getnum(userInfo.balance/100)}}</view>
				<view>预交金余额/元</view>
			</view>
		</view>
		<view class="uni-record-price">
			<view class="uni-form-item">
				<input type="digit" @input="inputData" v-model="rechargePrice" class="uni-input" placeholder="自定义金额" />
			</view>
			<view class="uni-select-all">
				<button @click="selectData(index,item)" :class="item.isSelect?'uni-button-color':'uni-button-disabled'" v-for="(item,index) in selectParice"
				 :key="index">{{item.num}}元</button>
			</view>
			<button :class="['uni-button-next',next?'uni-button-color':'uni-button-disabled']" @click="goUserTest">确认充值</button>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>


<script>
	import {
		prepayModel
	} from '@/models/recharge.js'
	const prepay = new prepayModel()
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '预交金充值'
				},
				rechargePrice: '',
				changetext: '',
				next: false,
				current: null,
				userInfo: {},
				patientId: '',
				orderNumber: '',
				selectParice: [{
						num: 100,
						isSelect: false
					},
					{
						num: 200,
						isSelect: false
					},
					{
						num: 500,
						isSelect: false
					},
					{
						num: 1000,
						isSelect: false
					},
					{
						num: 2000,
						isSelect: false
					},
					{
						num: 5000,
						isSelect: false
					}
				]
			}
		},
		onShow() {
			this.userInfo = JSON.parse(uni.getStorageSync('item'))
			this.patientId = uni.getStorageSync('patientId')
		},
		methods: {
			getnum(val) {
				if (val) {
					if (parseInt(val) == parseFloat(val)) {
						return val + '.00'
					} else {
						var num = String(val).indexOf(".") + 1; //获取小数点的位置
						var count = String(val).length - num; //获取小数点后的个数
						if (count == 1) {

							return val + '0'
						} else {
							console.log(val)
							return val
						}
					}
				}
			},
			goUserTest() {
				if (this.next) {
					const data = {
						hospitalId: this.userInfo.hospitalId,
						inpatientId: this.userInfo.inpatientId,
						patientId: this.patientId,
						payFee: Number(this.rechargePrice*100).toFixed(0)
					}
					prepay.rechargePay(data).then(res => {
						const item = {
							openId: uni.getStorageSync('userInfo').openId,
							orderNo: res.data.advancePayOrder.orderNo,
							tradeChannel: '8006',
							transAmount: Number(this.rechargePrice*100).toFixed(0)
						}
						this.orderNumber = res.data.advancePayOrder.orderNo
						this.goPay(item)
					}).catch(err => {
						console.log(err)
					})
				}
			},
			goPay(data) {
				medical.weixinPay(data).then(res => {
						wx.requestPayment({
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.prepayId,
							paySign: res.data.sign,
							signType: res.data.signType || 'MD5',
							success(e) {
								wx.hideLoading();
								if (e.errMsg == 'requestPayment:ok') {
									setTimeout(() => {
										// const data = this.orderNumber
										// medical.frontNotify(data).then(res => {
											wx.showToast({
												title: '支付成功！',
												mask: true
											})
											wx.navigateTo({
												url: './payFinish?hospitalId'
											})
										// }).catch(err => {
										// 	console.log(err)
										// })
									}, 1000)
								}
							},
							fail(err) {
								wx.hideLoading();
								console.log('支付失败')
							}
						});
					})
					.catch(err => {
						console.log(err)
					})
			},
			inputData() {
				const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
				let that = this;
				if (reg.test(that.rechargePrice)) {
					that.next = true
					try {
						that.selectParice.forEach(function(item, i) {
							item.isSelect = false
						});
						if (that.rechargePrice <= 0) {
							that.next = false;
							return;
						} else if (that.rechargePrice >= 1000000) {
							wx.showToast({
								title: '限额1,000,000',
								icon: 'none'
							})
							that.next = false;
							return;
						}
						that.selectParice.forEach(function(item, i) {
							if (that.rechargePrice == item.num) {
								item.isSelect = true
								if (item.isSelect) {
									that.rechargePrice = item.num
									throw Error();
								}
							} else {
								item.isSelect = false
							}
						});
					} catch {}
				} else {
					that.next = false
				}
			},
			selectData(index, item) {
				let that = this;
				that.selectParice.forEach(function(item, i) {
					if (index == i) {
						item.isSelect = !item.isSelect
						console.log(item.isSelect, that.rechargePrice)
						if (item.isSelect) {
							that.rechargePrice = item.num
							item.isSelect = true
							console.log(item.isSelect, that.rechargePrice)
							that.next = true
						} else {
							that.rechargePrice = ''
							that.next = false
						}
					} else {
						item.isSelect = false
					}
				});
			},
			goPaymentRecord() {
				wx.navigateTo({
					url: './paymentRecord?hospitalId=' + this.userInfo.hospitalId + '&inpatientId=' + this.userInfo.inpatientId
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-content {
		height: 100vh;
		background: #FFFFFF;
	}

	.uni-record-box {
		height: 104rpx;

		.uni-top-record {
			width: 236rpx;
			height: 84rpx;
			display: flex;
			float: right;
			align-items: center;
			margin-top: 20rpx;
			border-radius: 60rpx 0 0 60rpx;
			color: #FFFFFF;
			background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);

			img {
				width: 40rpx;
				height: 40rpx;
				margin-left: 36rpx;
			}

			view {
				font-size: 30rpx;
				padding-left: 16rpx;
			}
		}
	}

	.uni-monetary-box {
		height: 220rpx;
		font-size: 30rpx;
		text-align: center;
		color: #B2B2B2;

		.uni-monetary-title {
			font-size: 60rpx;
			font-weight: 600;
			color: #2884FF;
		}
	}

	.uni-record-price {
		padding: 0 56rpx;

		.uni-form-item {
			width: 640rpx;
			border: 2rpx solid #E5E5E5;
			border-radius: 10rpx;

			.uni-input {
				height: 94rpx;
				line-height: 94rpx;
				padding-left: 36rpx;
			}
		}

		.uni-select-all {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			text-align: center;

			button {
				color: #FFFFFF;
				font-size: 30rpx;
				margin-top: 40rpx;
				width: 196rpx;
				height: 84rpx;
				line-height: 84rpx;
			}
		}

		.uni-button-next {
			height: 47px;
			color: #FFFFFF;
			margin-top: 40px;
			line-height: 47px;
			text-align: center;
			font-size: 18px;
			color: #fff;
			border-radius: 8px;
		}

		.uni-button-disabled {
			background: rgba(40, 132, 255, 0.2);
		}

		.uni-button-color {
			background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		}
	}
</style>
