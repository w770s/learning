<template>
	<view class="uni-content-box">
		<!-- 这块需要改为跳转聊天页面 -->
		<u-bar :nav="setNav" />
		<view class="uni-nav"></view>
		<view class="uni-box">
			<view class="uni-user-box">
				<view class="uni-user-boxTop">
					<view class="uni-user-name">姓名：<text class="uni-user-text">{{userInfo.name?userInfo.name:''}}</text></view>
					<view class="uni-user-gender">性别：<text class="uni-user-text">{{userInfo.gender==0?'男':userInfo.gender==1?'女':''}}</text></view>
					<view class="uni-user-gender">年龄：<text class="uni-user-text">{{userInfo.age?userInfo.age+'岁':''}}</text></view>
					<view class="uni-user-age" v-if="userInfo.status">健康卡号：<text class="uni-user-text">{{userInfo.healthCardNo?userInfo.healthCardNo:''}}</text></view>
					<view class="uni-user-age" v-if="!userInfo.status">健康卡号：<text class="uni-user-text">{{userInfo.idCard?userInfo.idCard:''}}</text></view>
				</view>
				<view class="uni-user-boxBottom">
					<view class="uni-details-text">
						<view class="banner-text-label">临床诊断(ICD)：</view>
						<view class="banner-text">{{userInfo.clinicalDiagnosis?userInfo.clinicalDiagnosis:'无'}}</view>
					</view>
					<view class="uni-details-text">
						<view class="banner-text-label">患者主诉：</view>
						<view class="banner-text">{{userInfo.chiefComplaint?userInfo.chiefComplaint:'无'}}</view>
					</view>
					<view class="uni-details-text">
						<view class="banner-text-label">既往史：</view>
						<view class="banner-text">{{userInfo.medRecord?userInfo.medRecord:'无'}}</view>
					</view>
				</view>
			</view>
			<view class="" v-if="statusType">
				<view style="position:absolute;text-align: center;width: 132rpx; height: 44rpx;z-index:2;right:0;top:0;font-size: 24rpx;color: #FFFFFF;">{{statusType}}</view>
				<img v-if="payStatus == 0" style="width: 140rpx;height: 44rpx;line-height: 44rpx;position: absolute;top: -8rpx;right: 0rpx;"
				 src="http://file.aihuihc.com/patient/patientImages/images/waitPay.png" mode=""></img>
				<img v-if="payStatus == 1||payStatus == 2||payStatus == 4" style="width: 140rpx;height: 44rpx;line-height: 44rpx;position: absolute;top: -8rpx;right: 0rpx;"
				 src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/doNotPass.png" mode=""></img>
				<img v-if="payStatus == 3" style="width: 140rpx;height: 44rpx;line-height: 44rpx;position: absolute;top: -8rpx;right: 0rpx;"
				 src="http://file.aihuihc.com/patient/patientImages/images/pay.png" mode=""></img>
			</view>
			<view class="" v-if="prescriptStatusType">
				<view style="position:absolute;text-align: center;width: 132rpx; height: 44rpx;z-index:2;right:0;top:0;font-size: 24rpx;color: #FFFFFF;">{{prescriptStatusType}}</view>
				<img v-if="userInfo.status == 2" style="width: 140rpx;height: 44rpx;line-height: 44rpx;position: absolute;top: -8rpx;right: 0rpx;"
				 src="http://file.aihuihc.com/patient/patientImages/images/waitPay.png" mode=""></img>
				<img v-if="userInfo.status == 3" style="width: 140rpx;height: 44rpx;line-height: 44rpx;position: absolute;top: -8rpx;right: 0rpx;"
				 src="http://file.aihuihc.com/patient/patientImages/images/overtime.png" mode=""></img>
				<img v-if="userInfo.status == 4" style="width: 140rpx;height: 44rpx;line-height: 44rpx;position: absolute;top: -8rpx;right: 0rpx;"
				 src="http://file.aihuihc.com/patient/patientImages/images/pay.png" mode=""></img>
			</view>
			<view class="uni-bottomBox" v-if="prescriptType==='clinicBill'">
				<view class="uni-bottomBox-box" v-for="(item,index) in prescriptionMedicineList" :key="index">
					<view class="uni-bottonBox-content">
						<view class="uni-bottomBox-title">{{item.name}}<text>✖{{item.count?item.count:''}}{{item.saleUnit?item.saleUnit:''}}</text></view>
						<view class="uni-bottomBox-label">用药途径<text class="uni-bottomBox-text">{{item.medicineWay?item.medicineWay:'无'}}</text></view>
						<view class="uni-bottomBox-label">用药频率<text class="uni-bottomBox-text">{{item.medicineFrequency?item.medicineFrequency:'无'}}</text></view>
						<view class="uni-bottomBox-label">单次药量<text class="uni-bottomBox-text">{{item.dosageOne?item.dosageOne:''}}{{item.doseUnit?item.doseUnit:''}}/次</text></view>
						<view class="uni-bottomBox-label">备注<text class="uni-bottomBox-text">{{item.doctorAdvice?item.doctorAdvice:'无'}}</text></view>
					</view>
				</view>
				<!--			<view class="uni-button-box">-->
				<!--				<view>查看处方笺</view>-->
				<!--			</view>-->
				<view class="uni-doctor-box">
					<view class="uni-doctor-label">处方开立医师：<text class="uni-doctor-content">{{userInfo.prescriptionDoctorRanks?userInfo.prescriptionDoctorRanks:'---'}}</text><text
						 class="uni-doctor-content">{{userInfo.prescriptionDoctorDepartment?userInfo.prescriptionDoctorDepartment:''}}</text><text
						 class="uni-bottomBox-text">{{userInfo.prescriptionDoctorName?userInfo.prescriptionDoctorName:''}}</text></view>
					<view class="uni-doctor-label">审核药剂师：<text class="uni-doctor-content">{{userInfo.baseMedicineDoctor.rank?userInfo.baseMedicineDoctor.rank:'---'}}</text><text
						 class="uni-doctor-content">{{userInfo.baseMedicineDoctor.department?userInfo.baseMedicineDoctor.department:''}}</text><text
						 class="uni-bottomBox-text">{{userInfo.baseMedicineDoctor.name?userInfo.baseMedicineDoctor.name:''}}</text></view>
					<view class="uni-doctor-label">开方日期：<text class="uni-doctor-content">{{userInfo.prescriptionTime?userInfo.prescriptionTime:'---'}}</text></view>
				</view>
				<view class="uni-tips">提示信息：<text>处方开具当日有效</text></view>
			</view>
			<view v-if="prescriptType==='checkSpecial'">
				<view class="uni-imType-choose">
					<view class="uni-imType-defaultChoose">
						<text v-if="userInfo.examinetype===1">检查单</text>
						<text v-if="userInfo.examinetype===2">检验单</text>
						<view class="uni-imType-tabs"></view>
					</view>
				</view>
				<view class="uni-list-box uni-list-paddingBox" style="padding-top:0px;">
					<view v-for="(item,index) in userInfo.ihCheckInspectionDetails" :key="index">
						<view class="uni-medical-item">
							<view v-if="userInfo.examinetype===1" style="font-size: 36rpx;font-weight: bold;padding-bottom: 10rpx;">检查{{changeNoToChinese(index)}}：{{item.examineName?item.examineName:'暂无'}}
								{{item.detailPartAndMethodName?'('+item.detailPartAndMethodName+')':''}}</view>
							<view v-if="userInfo.examinetype===2" style="font-size: 36rpx;font-weight: bold;padding-bottom: 10rpx;">检验{{changeNoToChinese(index)}}：{{item.examineName?item.examineName:'暂无'}}</view>
							<view v-if="userInfo.examinetype===2" style="padding-bottom: 25rpx;color:#B2B2B2;">检查标本：{{item.itemName?item.itemName:'暂无'}}</view>
							<view style="padding-bottom: 25rpx;color:#B2B2B2;">执行科室：{{item.departName?item.departName:'暂无'}}</view>
							<view style="padding-bottom: 10rpx;">注意事项</view>
							<view class="uni-input" style="color:#B2B2B2;">
								{{item.remark?item.remark:'暂无'}}
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list-box uni-list-paddingBox" style="margin-top:28rpx;padding:20rpx 0rpx;">
					<view class="list-item">
						<view style="color:#333333;">给患者留言</view>
					</view>
					<view class="list-item">
						<view style="color:#333333;">
							{{userInfo.leaveMessage?userInfo.leaveMessage:'暂无'}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-see-button" v-if="prescriptType==='clinicBill'">
				<view class="uni-payBtn uni-goPay" v-if="userInfo.status == '2'" @click="goPay">去付款</view>
				<view class="uni-payBtn uni-overTime" v-if="userInfo.status == '3'">去付款</view>
				<view class="uni-payBtn uni-goPay" @click="seeLogistics" v-if="userInfo.status == '4'&&typeIndex==1">查看物流</view>
			</view>
			<view class="uni-see-button uni-see-button-special" v-if="prescriptType==='checkSpecial'">
				<view class="uni-payBtn uni-goPay" v-if="payStatus==0" @click="goToPay">去付款</view>
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
	import {
		NoToChinese
	} from '@/util/util.js'
	let app = getApp()
	export default {
		components: {
			wybPopup
		},
		data() {
			return {
				setNav: {
					isdisPlayNavTitle: true,
					navTitle: ''
				},
				typeIndex: 0,
				orderId: '',
				addressDetail: '',
				loading: false,
				isAddress: {},
				address: {},
				userInfo: {},
				prescriptType: '',
				prescriptionMedicineList: [],
				statusType: '',
				payStatus: '',
				prescriptStatusType: '',
			}
		},
		onLoad(options) {
			this.orderId = options.id
			this.prescriptType = options.type
			if (options.type === 'clinicBill') {
				this.setNav.navTitle = '处方详情'
				this.apiGetOrderDetail(options.id)
			}
			if (options.type === 'checkSpecial') {
				this.apiIhInspectionOrderGetOrderDetail(options.id)
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
			changeNoToChinese(number) {
				return NoToChinese(number + 1)
			},
			changeStatus(status) {
				switch (status) {
					case 0:
						return '待支付'
					case 1:
						return '支付成功'
					case 2:
						return '支付失败'
					case 3:
						return '已退款'
					case 4:
						return '超时未支付'
				}
			},
			changeType(type) {
				switch (type) {
					case '2':
						return '待支付'
					case '3':
						return '超时未支付'
					case '4':
						return '已支付'
				}
			},
			apiIhInspectionOrderGetOrderDetail(id) {
				this.$refs.loading.open();
				prescription.ihInspectionOrderGetOrderDetail({
					id
				}).then(res => {
					if (res.data) {
						this.userInfo = res.data
						this.statusType = this.changeStatus(res.data.ihInspectionOrder.payStatus)
						this.payStatus = res.data.ihInspectionOrder.payStatus
						if (res.data.examinetype === 1) {
							this.setNav.navTitle = '检查详情'
						}
						if (res.data.examinetype === 2) {
							this.setNav.navTitle = '检验详情'
						}
					}
					this.$refs.loading.close();
				}).catch(err => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			apiGetOrderDetail(id) {
				this.$refs.loading.open();
				prescription.getOrderDetail({
					id
				}).then(res => {
					this.userInfo = res.data
					this.prescriptStatusType = this.changeType(this.userInfo.status)
					this.$refs.loading.close();
					if (this.userInfo.prescriptionMedicineList) {
						this.prescriptionMedicineList = this.userInfo.prescriptionMedicineList
					}
					if (!this.isAddress) {
						this.typeIndex = this.userInfo.fetchType
						if (this.userInfo.fetchType == 0) {
							this.address.receiveName = this.userInfo.medicineStore
							this.address.receivePhone = this.userInfo.tel
							this.addressDetail = this.userInfo.medaddress + this.userInfo.medicineStore
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
				wx.navigateTo({
					url: '/pagesA/prescriptionOrder/editAddress?id=' + this.orderId + '&typeUrl=' + 'prescriptionDetails' + '&type=' +
						this.prescriptType
				})
				this.$refs.popup.hide()
			},
			goPay() {
				this.$refs.popup.show()
				this.getDefaultAddress(this.userId)
			},
			goToPay() {
				const data = {
					prescriptionId: this.userInfo.id,
					hospitalId: this.userInfo.hospitalId,
					patientId: this.userInfo.patientId,
					userId: this.userId
				}
				this.apiIhInspectionOrderUpdate(data)
			},
			apiIhInspectionOrderUpdate(data) {
				prescription.ihInspectionOrderUpdate(data).then(res => {
					const item = {
						openId: uni.getStorageSync('userInfo').openId || config.openId,
						orderNo: this.userInfo.ihInspectionOrder.orderNo,
						tradeChannel: '8006',
						transAmount: this.userInfo.ihInspectionOrder.payFee
					}
					this.orderNumber = this.userInfo.ihInspectionOrder.orderNo
					this.samplePay(item)
				})
			},
			seeLogistics() {
				wx.navigateTo({
					url: '/pagesA/prescriptionOrder/seeLogistics?orderNo=' + this.userInfo.orderNo + '&payTime=' + this.userInfo.payTime +
						'&type=' + 2
				})
			},
			samplePay(item) {
				const that = this
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
											if (that.prescriptType === 'clinicBill') {
												that.apiGetOrderDetail(that.orderId)
											}
											if (that.prescriptType === 'checkSpecial') {
												that.apiIhInspectionOrderGetOrderDetail(that.orderId)
											}
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
							transAmount: res.data.payFee
						}
						this.orderNumber = res.data.orderNo
						this.samplePay(item)
						that.$refs.popup.hide()
					}).catch(err => {
						console.log(err);
					});
				} else {
					wx.showToast({
						title: '请选择您的收货信息',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content-box {
		background: #FFFFFF;
		min-height: 100vh;

		.uni-box {
			position: absolute;
			top: 180rpx;
			left: 24rpx;
			right: 24rpx;
			z-index: 1;
			background: #FFFFFF;
			border-radius: 10rpx;
		}

		.uni-bottomBox {
			border-radius: 10rpx;
			margin: 40rpx 0 40rpx 0;
			box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);

			.uni-bottomBox-box {
				border-bottom: 2rpx solid #F6F6F6;

				.uni-bottonBox-content {
					padding: 0 30rpx;
					color: #989898;

					.uni-bottomBox-title {
						margin-top: 14rpx;
						font-size: 38rpx;
						font-weight: bold;
						color: #333333;

						text {
							font-size: 30rpx;
						}
					}

					.uni-bottomBox-label {
						margin: 14rpx 0;
					}
				}
			}

			.uni-button-box {
				height: 100rpx;

				view {
					width: 188rpx;
					height: 60rpx;
					font-size: 26rpx;
					position: absolute;
					right: 30rpx;
					margin-top: 20rpx;
					text-align: center;
					line-height: 60rpx;
					border-radius: 6rpx;
					background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
					color: #FFFFFF;
				}
			}

			.uni-doctor-box {
				padding: 0 30rpx 20rpx 30rpx;
				color: #B2B2B2;

				.uni-doctor-label {
					margin-top: 14rpx;
				}

				.uni-doctor-content {
					margin-left: 20rpx;
					float: right;
					color: #333333;
				}
			}

			.uni-tips {
				background: rgba(40, 132, 255, 0.1);
				color: #4E93F6;
				padding: 20rpx 30rpx;

				text {
					color: #333333;
				}
			}
		}

		.uni-bottomBox-text {
			float: right;
			color: #333333;
		}

		.uni-nav {
			height: 100rpx;
			background: linear-gradient(to right, #5EA6F8, #3B7CF4);
		}

		.uni-user-box {
			padding-top: 60rpx;
			box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);

			.uni-user-boxTop {
				padding: 0 30rpx;
			}

			.uni-user-boxBottom-title {
				padding: 0 30rpx;
			}

			.uni-user-boxBottom {
				border-top: 2rpx solid #F6F6F6;
			}
		}

		.uni-details-text {
			padding: 14rpx 30rpx;
			display: flex;
			font-size: 30rpx;

			.banner-text-label {
				color: #B2B2B2;
				width: 230rpx;
			}

			.banner-text {
				color: #333333;
				flex: 1;
				text-align: right;
			}
		}

		.uni-see-button {
			height: 200rpx;

			.uni-payBtn {
				border-radius: 10rpx;
				color: #FFFFFF;
				font-size: 36rpx;
				width: 640rpx;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				margin: 0 auto;
			}

			.uni-goPay {
				background: linear-gradient(to right, rgba(255, 181, 84, 1), rgba(255, 163, 106, 1));
			}

			.uni-overTime {
				background: linear-gradient(to right, rgba(255, 181, 84, .3), rgba(255, 163, 106, .3));
			}

			view {
				border-radius: 10rpx;
				background: linear-gradient(to right, rgba(255, 181, 84, 1), rgba(255, 163, 106, 1));
				color: #FFFFFF;
				font-size: 36rpx;
				width: 640rpx;
				height: 94rpx;
				line-height: 94rpx;
				text-align: center;
				margin: 0 auto;
			}
		}

		.uni-see-button-special {
			height: auto;
			margin: 20rpx 0rpx;
		}

		.uni-user-name {
			color: #989898;
		}

		.uni-user-gender {
			margin-top: 14rpx;
			color: #989898;
		}

		.uni-user-age {
			margin: 14rpx 0;
			color: #989898;
		}

		.uni-user-text {
			float: right;
			color: #333333;
		}
	}

	.uni-imType-choose {
		width: 100%;
		border-left: none;
		border-right: none;
		font-size: 30rpx;
		color: #333333;
		padding: 30rpx 0rpx;
		box-sizing: border-box;

		.uni-imType-tabs {
			position: absolute;
			margin-top: 15rpx;
			height: 6rpx;
			width: 100rpx;
			border-radius: 2rpx;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			background: linear-gradient(90deg, #5EA6F8 0%, #3B7CF4 100%);
		}
	}

	.uni-imType-defaultChoose {
		width: 120rpx;
		display: flex;
		padding-bottom: 15rpx;
		justify-content: center;
		position: relative;
		font-size: 40rpx;
		font-weight: bold;
	}

	.uni-medical-item {
		color: #333333;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 2rpx solid #F6F6F6;
		padding: 40rpx 30rpx;
	}

	.uni-list-box {
		position: relative;
		width: 100%;
		box-shadow: 0rpx 4rpx 12rpx 5rpx rgba(59, 124, 244, 0.15);
		border-radius: 10rpx;
		background: #fff;
		box-sizing: border-box;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		padding: 15rpx 30rpx;

		view:nth-of-type(1) {
			color: #B2B2B2;
			max-width: 230rpx;
			min-width: 160rpx;
		}

		.uni-input {
			text-align: right;
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
