<template>
	<view style="background: #FFFFFF;min-height:100vh;">
		<u-bar v-if="!pathType" :nav="setNav" />
		<u-bar v-if="pathType" :nav="setNav" :route="'/pagesA/prescriptionOrder/index'" />
		<view class="uni-nav">
			<view class="uni-nav-title">{{changeStatus(userInfo.status)}}</view>
			<view v-if="userInfo.status==2 || userInfo.status==5" class="uni-nav-tips">温馨提示：请在二十四小时内进行处方缴费，过期将会失效</view>
			<view v-if="userInfo.status==3" class="uni-nav-tips">温馨提示：由于您未在规定时间内缴纳处方费用，该处方已失效！</view>
			<view v-if="userInfo.status==4" class="uni-nav-tips">温馨提示：缴费成功，请及时领取药品！</view>
			<view v-if="userInfo.status==6" class="uni-nav-tips">温馨提示：已为您办理退款手续，退款金额将在1-7个工作日原路退回至您的账户！</view>
		</view>
		<view class="uni-content">
			<view v-if="userInfo.status==4" class="" style="padding: 44rpx;display: flex;">
				<img style="width: 100rpx;height: 100rpx;border-radius: 50%;" src="http://file.aihuihc.com/patient/patientImages/images/pharmacy.png"
				 mode=""></img>
				<view class="" style="margin-left: 30rpx;flex: 1;">
					<view class="" style="font-size: 20px;font-weight: bolder;">{{address.receiveName}}</view>
					<view class="" v-if="typeIndex==1" style="font-weight: bold;font-size: 32rpx;display: flex;justify-content: space-between;align-items: center;">
						<view class="" style="color: #989898;">{{address.receivePhone}}</view>
						<view v-preventReClick @click="seeLogistics" class="" style="width: 136rpx;height: 60rpx;line-height: 60rpx;text-align: center;border-radius: 6rpx;color: #FFFFFF;background: linear-gradient(to right,#FFB554,#FFA36A);font-size: 26rpx;">查看物流</view>
					</view>
					<view class="">{{addressDetail}}</view>
				</view>
			</view>
			<view v-if="userInfo.status==4&&typeIndex==0" class="" style="color: #4E93F6;font-size: 20rpx;background: rgba(40, 132, 255, 0.1);padding: 10rpx 0 10rpx 16rpx;">提示：一旦您已确认购买药品，除了药品质量问题外，一律不予退还。</view>
			<view v-if="userInfo.status==4&&typeIndex==1" class="" style="color: #4E93F6;font-size: 20rpx;background: rgba(40, 132, 255, 0.1);padding: 10rpx 0 10rpx 16rpx;">提示：快递费用到付，具体收费金额以快递公司收费金额为准，一旦您已确认收货，除了药品质量问题外，一律不予退还。</view>
			<view class="uni-content-box">
				<text class="uni-title-online"></text>
				<text class="uni-title">就诊信息</text>
				<view class="uni-bottonBox-content">
					<view class="uni-bottomBox-title">姓名：<text class="uni-bottomBox-text">{{userInfo.name?userInfo.name:'---'}}</text></view>
					<view class="uni-bottomBox-title">健康卡号：<text class="uni-bottomBox-text">{{userInfo.idCard?userInfo.idCard:'---'}}</text></view>
					<view class="uni-bottomBox-label">科室名称：<text class="uni-bottomBox-text">{{userInfo.prescriptionDoctorDepartment?userInfo.prescriptionDoctorDepartment:'---'}}</text></view>
					<view class="uni-bottomBox-label">医生姓名：<text class="uni-bottomBox-text">{{userInfo.prescriptionDoctorName?userInfo.prescriptionDoctorName:'---'}}</text></view>
				</view>
			</view>
			<view class="uni-content-box" v-if="prescriptionMedicineList.length>0">
				<text class="uni-title-online"></text>
				<text class="uni-title">处方单</text>
				<view class="uni-bottonBox-content uni-content-bottom" v-for="(item,index) in prescriptionMedicineList" :key="index">
					<view class="uni-bottomBox-name">{{item.name}}✖{{item.count}}{{item.saleUnit?item.saleUnit:''}}</view>
					<view class="uni-bottomBox-title uni-font">规格<text class="uni-bottomBox-text">{{item.spec?item.spec:'无'}}</text></view>
					<view class="uni-bottomBox-label uni-font">单次药量<text class="uni-bottomBox-text">{{item.dosageOne?item.dosageOne:''}}{{item.doseUnit?item.doseUnit:''}}/次</text></view>
				</view>
			</view>
			<view v-if="userInfo.status==2||userInfo.status==5" class="uni-gopay">
				<view v-preventReClick @click="goPay" v-preventReClick>立即支付</view>
			</view>
			<view v-if="userInfo.status==4" class="uni-content-box">
				<text class="uni-title-online"></text>
				<text class="uni-title">支付详情</text>
				<view class="uni-bottonBox-content uni-bottom-box">
					<view class="uni-bottomBox-title uni-font">支付金额<text class="uni-bottomBox-text">￥{{userInfo.payFee/100}}</text></view>
					<view class="uni-bottomBox-title uni-font">支付时间<text class="uni-bottomBox-text">{{userInfo.payTime?userInfo.payTime:''}}</text></view>
					<view class="uni-bottomBox-label uni-font">支付流水号<text class="uni-bottomBox-text">{{userInfo.tradeNo?userInfo.tradeNo:''}}</text></view>
				</view>
			</view>
		</view>
		<wyb-popup ref="popup" type="bottom" height="400" width="500" radius="6" :showCloseIcon="true">
			<view class="popup-content">
				<view v-if="!address" v-preventReClick @click="goAddAddress" class="" style="display: flex;align-items: center; padding: 40rpx 0 24rpx 54rpx;">
					<img style="width: 48rpx; height: 48rpx;" src="http://file.aihuihc.com/patient/patientImages/images/edit.png" mode=""></img>
					<view style="margin-left: 34rpx;" class="">请编辑您的药品收货方式和收货地址</view>
				</view>
				<view v-if="address" class="" style="display: flex;align-items: center; padding: 40rpx 40rpx 24rpx 54rpx;">
					<view class="" style="flex: 1;">
						<view v-if="typeIndex==1" class="" style="font-size: 40rpx;font-weight: bold;">{{address.receiveName}}</view>
						<view v-if="typeIndex==1" style="font-size: 40rpx;font-weight: bold;color: #989898;">{{address.receivePhone}}</text></view>
						<view class="" style="margin-top: 14rpx;">收货方式：{{typeIndex==0?'药房自取':typeIndex==1?'快递配送':''}}</view>
						<view v-if="typeIndex==0" class="" style="margin-top: 14rpx;">药房地址：{{addressDetail}}</view>
						<view v-if="typeIndex==1" class="" style="margin-top: 14rpx;">收货地址：{{addressDetail}}</view>
					</view>
					<img v-preventReClick @click="goAddAddress" style="width: 56rpx; height: 56rpx;" src="http://file.aihuihc.com/patient/patientImages/images/edit.png"
					 mode=""></img>
				</view>
				<view class="" style="border-top: 2rpx solid #F6F6F6;border-bottom: 2rpx solid #F6F6F6; display: flex; padding: 20rpx 52rpx;justify-content: space-between;">
					<view class="" style="font-size: 40rpx; font-weight: bold;">
						西药费
					</view>
					<view class="" style="color: #FF745F;">
						￥{{userInfo.payFee/100}}
					</view>
				</view>
				<view class="" style="display: flex;justify-content: space-between;align-items: center; padding: 20rpx 20rpx 40rpx 20rpx;">
					<view class="">
						合计费用：￥{{userInfo.payFee/100}}
					</view>
					<view v-preventReClick @click="paySprice()" :class="['getPay',address?'submitPay':'closePat']">
						确认支付
					</view>
				</view>
			</view>
		</wyb-popup>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
	import {
		prescriptionModel
	} from '@/models/prescriptionOrder.js'
	const prescription = new prescriptionModel()
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	import store from '@/store/index.js'
	let app = getApp()
	export default {
		components: {
			wybPopup
		},
		data() {
			return {
				setNav: {
					isdisPlayNavTitle: true
				},
				typeIndex: 0,
				orderId: '',
				addressDetail: '',
				loading: false,
				pathType: false,
				orderNumber: '',
				isAddress: {},
				address: {},
				userInfo: {},
				prescriptionMedicineList: []
			}
		},
		onLoad(options) {
			this.orderId = options.id
			this.userId = uni.getStorageSync('userInfo').userId
			if (options.pathType) {
				this.pathType = true
			}
			this.getOrderDetail(this.orderId)
			if (!this.userId) {
				const prescriptionIndex = {
					id: this.orderId,
					pathType: 1
				}
				uni.setStorageSync('prescriptionIndex', JSON.stringify(prescriptionIndex))
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=prescriptionIndex'
							})
						}
					}
				})
			}
			if (options.addressDetail) {
				this.$refs.popup.show()
				this.isAddress = JSON.parse(options.addressDetail)
				this.address = this.isAddress
				this.typeIndex = options.isIndex
				if (options.isIndex == 1) {
					this.addressDetail = this.address.receiveProvince + this.address.receiveCity + this.address.receiveZone + this.address
						.receiveStreet + this.address.receiveAddressDetail
				}
				if (options.isIndex == 0) {
					this.addressDetail = this.address.address
					this.address.receiveName = '院内药房'
				}
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('userInfo').userId
		},
		methods: {
			getOrderDetail(id) {
				this.$refs.loading.open();
				prescription.getOrderDetail({
					id
				}).then(res => {
					this.$refs.loading.close();
					this.userInfo = res.data
					if (this.userInfo.prescriptionMedicineList) {
						this.prescriptionMedicineList = this.userInfo.prescriptionMedicineList
					}
					if (Object.keys(this.isAddress).length == 0) {
						this.typeIndex = this.userInfo.fetchType
						if (this.userInfo.fetchType == 0) {
							this.address.receiveName = this.userInfo.medicineStore
							this.address.receivePhone = this.userInfo.tel
							this.addressDetail = this.userInfo.medaddress
						}
						if (this.userInfo.fetchType == 1) {
							this.address.receiveName = this.userInfo.receiveName
							this.address.receivePhone = this.userInfo.receivePhone
							this.address.receiveProvince = this.userInfo.receiveProvince
							this.address.receiveCity = this.userInfo.receiveCity
							this.address.receiveZone = this.userInfo.receiveZone
							this.address.receiveStreet = this.userInfo.receiveStreet
							this.address.receiveAddressDetail = this.userInfo.receiveAddressDetail
							this.addressDetail = this.address.receiveProvince + this.address.receiveCity + this.address.receiveZone + this
								.address.receiveStreet + this.address.receiveAddressDetail
						}
					}
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			getDefaultAddress(userId) {
				this.$refs.loading.open();
				prescription.defaultAddress({
					userId
				}).then(res => {
					this.$refs.loading.close();
					this.address = res.data
					if (this.address) {
						this.typeIndex = 1
						this.addressDetail = this.address.receiveProvince + this.address.receiveCity + this.address.receiveZone + this.address
							.receiveStreet + this.address.receiveAddressDetail
					}
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			goAddAddress() {
				wx.redirectTo({
					url: '/pagesA/prescriptionOrder/editAddress?id=' + this.orderId + '&typeUrl=' + 'orderDetails'
				})
				this.$refs.popup.hide()
			},
			goPay() {
				this.$refs.popup.show()
				this.getDefaultAddress(this.userId)
			},
			paySprice() {
				let that = this
				if (that.address) {
					const data = {
						expressName: '顺丰',
						expressType: that.userInfo.medicineStore,
						fetchType: that.typeIndex,
						patientId: that.userInfo.patientId,
						prescriptionId: that.userInfo.id,
						receiveProvince: that.address.receiveProvince,
						receiveCity: that.address.receiveCity,
						receiveZone: that.address.receiveZone,
						receiveStreet: that.address.receiveStreet,
						receiveAddressDetail: that.address.receiveAddressDetail || that.addressDetail,
						receiveName: that.address.receiveName,
						receivePhone: that.address.receivePhone,
						userId: that.userId,
						hospitalId: 1
					}
					prescription.updateOrder(data).then(res => {
						const item = {
							openId: uni.getStorageSync('userInfo').openId || config.openId,
							orderNo: res.data.orderNo,
							tradeChannel: '8006',
							transAmount: that.userInfo.payFee
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
										if (e.errMsg == 'requestPayment:ok') {
											setTimeout(() => {
												// const data = that.orderNumber
												// medical.frontNotify(data).then(res => {
												uni.redirectTo({
													url: './index'
												})
												wx.showToast({
													title: '支付成功！',
													mask: true
												});
												// }).catch(err => {
												// 	console.log(err)
												// })
											}, 1000)
											that.$refs.popup.hide()
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
					}).catch(err => {
						console.log(err)
					})
				} else {
					wx.showToast({
						title: '请选择您的收货信息',
						icon: 'none'
					})
				}
			},
			changeStatus(type) {
				switch (type) {
					case '2':
						return '待支付'
					case '3':
						return '超时未支付'
					case '4':
						return '已支付'
					case '5':
						return '待支付'
					case '6':
						return '已退款'
				}
			},
			seeLogistics() {
				wx.navigateTo({
					url: '/pagesA/prescriptionOrder/seeLogistics?orderNo=' + this.userInfo.orderNo + '&payTime=' + this.userInfo.payTime +
						'&type=' + 2
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-nav {
		height: 300rpx;
		padding: 0 14rpx;
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
		color: #FFFFFF;

		.uni-nav-title {
			font-size: 60rpx;
			text-align: right;
		}

		.uni-nav-tips {
			font-size: 36rpx;
			padding: 14rpx 0;
		}
	}

	.uni-content {
		position: absolute;
		top: 370rpx;
		left: 0;
		right: 0;
		border-radius: 20rpx;
		background: #FFFFFF;
	}

	.uni-content-box {
		padding: 40rpx 40rpx 0 40rpx;

		.uni-title-online {
			height: 40rpx;
			border: 4rpx solid #488BF5;
		}

		.uni-title {
			padding-left: 20rpx;
			color: #3E3E3E;
			font-size: 40rpx;
			font-weight: bold;
		}

		.uni-bottonBox-content {
			.uni-bottomBox-name {
				margin-top: 14rpx;
			}

			.uni-bottomBox-title {
				margin-top: 14rpx;
			}

			.uni-bottomBox-label {
				margin: 14rpx 0;
			}

			.uni-bottomBox-text {
				float: right;
				color: #333333;
			}

			.uni-font {
				color: #989898;
			}
		}

		.uni-bottom-box {
			padding-bottom: 100rpx;
		}

		.uni-content-bottom {
			border-bottom: 2rpx solid #F6F6F6;
		}
	}

	.uni-gopay {
		height: 200rpx;
		background: #FFFFFF;

		view {
			border-radius: 10rpx;
			background: linear-gradient(to right, #5EA6F8, #3B7CF4);
			color: #FFFFFF;
			font-size: 36rpx;
			width: 640rpx;
			height: 94rpx;
			line-height: 94rpx;
			text-align: center;
			margin: 0 auto;
			position: relative;
			top: 40rpx;
		}
	}

	.getPay {
		width: 360rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: #FFFFFF;
		text-align: center;
		border-radius: 30rpx;
	}

	.closePat {
		background: linear-gradient(to right, rgba(94, 166, 248, .4), rgba(59, 124, 244, .4));
	}

	.submitPay {
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
	}
</style>
