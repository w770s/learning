<template>
	<view>
		<u-bar v-if="!fromType" :nav="setNav" :route="'/pagesA/payOrder/index'" />
		<!--		<u-bar v-if="fromType" :nav="fromTypeNav" />-->
		<view class="uni-bottom-bar"></view>
		<view v-if="consumptionList.length===0" style="text-align: center;">
			<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/report.png" />
			<view class='uni-default-tip'>
				<text>暂无相关的缴费订单哦～</text>
			</view>
		</view>
		<view class="uni-box-radius" v-for="(item,index) in consumptionList" :key="index">
			<!-- 检查费 -->
			<view class="uni-content-box uni-content-topBox" v-for="(val,num) in item.prescriptions" :key="num">
				<view class="uni-user-topBox">
					<view class="inspection">{{val.prescriptionName}}<text :class="['payBtn',val.refundStatus === 1?'refundFee':item.payStatus == 0?'waitPay':'paid']">{{val.refundStatus === 1?'已退费':item.payStatus === 0?'未支付':'已支付'}}</text></view>
					<view class="inspection-price">{{val.totalPayFee/100}}元</view>
				</view>
				<view class="" v-for="(items,indexs) in val.prescriptionInfoList" :key="indexs">
					<view class="uni-user-topBox uni-user-bottomBox">
						<view style="max-width:540rpx;">{{items.detailName}} ×{{items.detailCount}}</view>
						<view>{{items.detailFee/100}}元</view>
					</view>
				</view>
			</view>
			<view class="uni-content-box uni-content-middleBox">
				<view class="inspection">费用信息</view>
				<view class="uni-cost"><text class="uni-cost-text">就诊专家：</text><text class="uni-cost-content" style="font-weight: 600;">{{item.doctorName}}</text></view>
				<view class="uni-cost"><text class="uni-cost-text">就诊科室：</text><text class="uni-cost-content">{{item.departName}}</text></view>
				<view class="uni-cost"><text class="uni-cost-text">就诊人：</text><text class="uni-cost-content">{{item.patientName}}</text><text
					 class="uni-cost-content">({{item.idCard?formatterCard(item.idCard):'---'}})</text></view>
				<view class="uni-cost"><text class="uni-cost-text">就诊时间：</text><text class="uni-cost-content">{{item.clinicTime}}</text></view>
			</view>
		</view>
		<view v-for="(item,index) in consumptionList" :key="index" v-if="item.payStatus == 0" class="bottom-bar">
			<view class="bottom-bar-total">共计{{item.payFee/100}}元</view>
			<view class="uni-goPay" @click="addClinicPayOrder(item)">确认缴费</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		config
	} from '@/config/index.js'
	import {
		getRequest
	} from '../../util/util.js'
	let app = getApp()
	import {
		payOrderModel
	} from '@/models/payOrder.js'
	const payOrder = new payOrderModel()
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '缴费订单'
				},
				fromTypeNav: {
					'navTitle': '缴费订单'
				},
				consumptionList: [],
				data: {
					userId: '',
					startDate: '',
					endDate: '',
					clinicNo: ''
				},
				orderNumber: '',
				qrData: {},
				btn: false,
				flag: '0',
				fromType: ''
			}
		},
		onShow() {
			this.userId = wx.getStorageSync('userInfo').userId
			if (!this.userId) {
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=QrCode'
							})
						}
					}
				});
			}
		},
		onLoad(options) {
			let date1 = new Date(new Date(new Date().toLocaleDateString()).getTime());
			let date2 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
			this.data.startDate = date1.getFullYear() + "-" + ((date1.getMonth() + 1) < 10 ? "0" + (date1.getMonth() + 1) : (
				date1.getMonth() + 1)) + "-" + (date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate());
			this.data.endDate = date2.getFullYear() + '-' + ((date2.getMonth() + 1) < 10 ? "0" + (date2.getMonth() + 1) : (date2
				.getMonth() + 1)) + '-' + (date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate());
			if (options.q) {
				let queryAll = decodeURIComponent(options.q);
				this.qrData = getRequest(queryAll)
				this.data.clinicNo = this.qrData.clinicNo
				this.data.userId = this.qrData.patientId
				this.flag = this.qrData.flag
				// this.fromType = this.qrData.fromType
			}
			if (!options.q) {
				if (options.clinicNo) {
					this.data.clinicNo = options.clinicNo
				}
				if (options.patientId) {
					this.data.userId = options.patientId
				}
				if (options.flag) {
					this.flag = options.flag
				}
			}
			console.log(this.flag);
			if (this.flag === '0') {
				// 待缴费
				this.$refs.loading.open();
				console.log(123123);
				this.listClinicPayOrder(this.data)
			} else if (this.flag === '1') {
				// 已缴费
				this.$refs.loading.open();
				this.listPayOrder(this.data)
			}
		},
		methods: {
			formatterCard(card) {
				if (card) {
					return card.substring(0, 4) + "******" + card.substring(14, 18)
				}
			},
			listClinicPayOrder(data) {
				payOrder.listClinicPayOrder(data).then((res) => {
					console.log(res.data)
					this.consumptionList = res.data
					let parseData = JSON.parse(JSON.stringify(res.data))
					if (parseData === null || parseData === '{}' || parseData.length === 0) {
						this.listPayOrder(data)
					}
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err)
				})
			},
			listPayOrder(data) {
				payOrder.listPayOrder(data).then((res) => {
					console.log(res)
					this.consumptionList = res.data
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err)
				})
			},
			addClinicPayOrder(val) {
				let that = this
				const data = {
					clinicNo: val.clinicNo,
					clinicTime: val.clinicTime,
					departId: val.departId,
					departName: val.departName,
					doctorId: val.doctorId,
					doctorName: val.doctorName,
					patientId: val.patientId,
					payFee: val.payFee,
					hospitalId: val.hospitalId
				}
				payOrder.addClinicPayOrder(data).then(res => {
					console.log(res)
					if (res.data.payStatus == 0) {
						const item = {
							openId: uni.getStorageSync('userInfo').openId || config.openId,
							orderNo: res.data.orderNo,
							tradeChannel: '8006',
							transAmount: val.payFee
						}
						this.orderNumber = res.data.orderNo
						medical.weixinPay(item).then(res => {
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
												// const data = that.orderNumber
												// medical.frontNotify(data).then(res => {
													that.data.clinicNo = val.clinicNo
													that.data.userId = val.patientId
													that.listPayOrder(that.data)
													console.log('支付成功')
													wx.showToast({
														title: '支付成功！',
														mask: true
													});
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
								console.log(err);
							});
					}
				}).catch(err => {
					console.log(err)
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.uni-default-tip {
		text-align: center;
		font-size: 40rpx;
		color: #333333;
	}

	.uni-default-img {
		text-align: center;
		height: 360rpx;
		width: 360rpx;
		margin-top: 160rpx;
		margin-bottom: 40rpx;
	}

	.uni-content-box {
		padding: 20rpx;
		background: #FFFFFF;
	}

	.uni-content-topBox {
		line-height: 60rpx;
		border-radius: 10rpx;
	}

	.uni-content-middleBox {
		line-height: 60rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
	}

	.uni-cost {
		font-size: 30rpx;

		.uni-cost-text {
			display: inline-block;
			width: 150rpx;
			color: #989898;
		}

		.uni-cost-content {
			color: #3E3E3E;
		}
	}

	.uni-user-topBox {
		display: flex;
		justify-content: space-between;
	}

	.uni-user-bottomBox {
		color: #333333FF;
		font-size: 30rpx;
	}

	.inspection {
		color: #3E3E3EFF;
		font-size: 36rpx;
		font-weight: 600;
	}

	.inspection-price {
		font-size: 30rpx;
		font-weight: 600;
		color: #333333FF;
	}

	.uni-bottom-bar {
		height: 40rpx;
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
	}

	.payBtn {
		margin-left: 20rpx;
		padding: 0 10rpx 0 10rpx;
		font-size: 20rpx;
		font-weight: normal;
		border-radius: 4rpx;
		color: #FFFFFFFF;
	}

	.refundFee {
		background: #B2B2B2;
	}

	.waitPay {
		background: linear-gradient(to right, #FFB554FF, #FFA36AFF);
	}

	.paid {
		background: #2884FF99;
	}

	.uni-goPay {
		padding: 0 24rpx;
		background: linear-gradient(to right, #FFB554FF, #FFA36AFF);
		/*border-radius: 5px;*/
		line-height: 100rpx;
		text-align: center;
		color: #fff;
		flex: 1;
		height: 100rpx;
	}

	.uni-box-radius {
		padding: 24rpx 24rpx 120rpx 24rpx;
		position: relative;
		top: -58rpx;
		border-radius: 10rpx;
	}

	.bottom-bar {
		position: fixed;
		height: 100rpx;
		bottom: 0;
		background: #FFFFFF;
		width: 100%;
		display: flex;
		align-items: flex-start;

		.bottom-bar-total {
			flex: 1;
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 24rpx;
			color: #FF745FFF;
			font-size: 30rpx;
			font-weight: 600;
		}
	}
</style>
