<template>
	<view>
		<u-bar :nav="setNav" />
		<view class="uni-bottom-bar"></view>
		<view v-if="seeDoctorDetail" class='no-recent'>
			<img src="http://file.aihuihc.com/patient/patientImages/images/seedoctor.png" class='no-recent-image' />
			<text class='no-recent-text'>进行中的就诊~</text>
			<button class="uni-reserve-box" @tap.prevent.stop="goForReserve">预约挂号</button>
			<view class="seeAllRecord" @tap.prevent.stop="goRegisterOrder">所有门诊就诊记录>></view>
		</view>

		<!--代缴费，已缴费-->
		<view v-for="(item,index) in clinicPayOrderList" :key="index" class="uni-user-box">
			<view class="uni-userBig-box">
				<view class="uni-user-title">
					<view>{{item.refundStatus === 1?'已退费':item.payStatus === 0?'待缴费':'已缴费'}}</view>
				</view>
				<view @tap.prevent.stop="showMoreDetail('up',index)">
					<view class="uni-user-label"><text class="uni-user-text">就诊专家：</text><text class="messageText"><text class="uni-doctorName">{{item.doctorName?item.doctorName:'---'}}</text></text></view>
					<view class="uni-user-label"><text class="uni-user-text">就诊科室：</text><text class="messageText">{{item.departName?item.departName:'---'}}</text></view>
					<view class="uni-user-label">
						<text class="uni-user-text">就诊人：</text>
						<text class="messageText">{{item.patientName?item.patientName:'---'}} ({{item.idCard?formatterCard(item.idCard):'---'}})</text>
						<img class="uni-user-img" v-if="!item.show" src="http://file.aihuihc.com/patient/patientImages/images/consulting/unfold.png" />
					</view>
					<view v-if="item.show">
						<view class="uni-user-label"><text class="uni-user-text">电话：</text><text class="messageText">{{item.phone?item.phone:'---'}}</text></view>
						<view class="uni-user-label"><text class="uni-user-text">就诊时间：</text><text class="messageText">{{item.clinicTime?item.clinicTime:'---'}}</text></view>
						<!-- <view class="uni-user-label"><text class="uni-user-text">门诊类型：</text><text class="messageText">{{item.outpatientType}}</text></view> -->
						<view class="uni-user-label">
							<text class="uni-user-text">预约费用：</text>
							<text class="messageText">{{item.payFee?(item.payFee / 100)+'元':'---'}}</text>
							<img class="uni-user-img" v-if="item.show" src="http://file.aihuihc.com/patient/patientImages/images/consulting/packup.png" />
						</view>
					</view>
				</view>
			</view>

			<!-- 待缴费时显示的 -->
			<view class="uni-status-box inspect">
				<view @tap.prevent.stop="goPayOrder(item)">
					<view class="uni-status-topBox" v-for="(val,num) in item.prescriptions" :key="num">
						<view style="max-width: 540rpx;">
							<view style="display: flex;align-items: center;">
								<text>{{val.prescriptionName}}</text>
								<text :class="['payBtn',val.refundStatus === 1?'refundFee':item.payStatus == 0?'waitPay':'paid']">{{val.refundStatus === 1?'已退费':item.payStatus === 0?'未支付':'已支付'}}</text>
							</view>
						</view>
						<view :class="[val.refundStatus === 1?'refundFee-price':item.payStatus === 0?'inspect-price':'inspect-paid']">{{val.totalPayFee?(val.totalPayFee / 100)+'元':'---'}}</view>
					</view>
					<view style="color: #8E8E8EFF;text-align: center;" v-if="item.payStatus === 0">待缴费24小时内有效，请及时缴费</view>
				</view>
				<button v-if="item.payStatus === 0" class="uni-button-box confirmPay" @tap.prevent.stop="addClinicPayOrder(item)">确认缴费</button>
				<view class="seeMore" @tap.prevent.stop="goPayOrder('')">查看更多订单></view>
			</view>
			<!-- 指引单 -->
			<view class="uni-status-box guideSheet" v-if="item.refundStatus !== 1&&item.payStatus===1&&item.guidesList.length>0">
				<view class="pointList">指引单</view>
				<view v-for="(items,index) in item.guidesList" :key="index" style="margin-bottom: 20rpx;">
					<view style="display: flex;">
						<text class="uni-user-label">科室：</text>
						<view class="messageText">{{items.execDeptName?items.execDeptName:'---'}}</view>
					</view>
					<view style="display: flex;">
						<text class="uni-user-label">地点：</text>
						<view class="messageText">{{items.execDepartLocation?items.execDepartLocation:'---'}}</view>
					</view>
					<view style="display: flex;">
						<text class="uni-user-label">项目：</text>
						<view>
							<view class="messageText">{{items.itemName?items.itemName:'---'}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--挂号订单-->
		<view v-if="registerOrderList.length > 0" class="uni-user-box" v-for="(item,index) in registerOrderList" :key="index"
		 @tap.prevent.stop="goOrderDetails(item.id)">
			<view class="uni-userBig-box">
				<view class="uni-user-title">
					<view>{{famtterStatus(item.payStatus)}}</view>
				</view>
				<view class="queueNum" v-if="item.payStatus === 1&&item.queueNo">
					<view class="queueNum-num queueNum-code">{{item.queueNo?item.queueNo:'---'}}</view>
					<view class="queueNum-num queueNum-linenum">排队号</view>
				</view>
				<view class="uni-user-label"><text class="uni-user-text">就诊专家：</text><text class="messageText">
						<text class="uni-doctorName" v-if="item.name==item.departName">{{item.name}} {{item.doctorLevel?' '+(item.doctorLevel):''}}</text></text>
					<text class="uni-doctorName" v-if="item.name!==item.departName">{{item.name}} {{item.doctorLevel?' '+(item.doctorLevel):''}}</text></text>
				</view>
				<view class="uni-user-label"><text class="uni-user-text">就诊科室：</text><text class="messageText">{{item.departName?item.departName:'---'}}</text></view>
				<view class="uni-user-label">
					<text class="uni-user-text">就诊人：</text>
					<text class="messageText">{{item.patientName?item.patientName:'---'}} ({{formatterCard(item.idCard)}})</text>
				</view>
				<view class="uni-user-label"><text class="uni-user-text">电话：</text><text class="messageText">{{item.phone?item.phone:'---'}}</text></view>
				<view class="uni-user-label"><text class="uni-user-text">就诊时间：</text><text class="messageText">{{item.clinicTime?item.clinicTime:'---'}}</text></view>
				<view class="uni-user-label"><text class="uni-user-text">就诊地点：</text><text class="messageText">{{item.clinicPlace?item.clinicPlace:'---'}}</text></view>
				<!-- <view class="uni-user-label"><text class="uni-user-text">门诊类型：</text><text class="messageText">{{item.outpatientType}}</text></view> -->
				<view class="uni-user-label"><text class="uni-user-text">预约费用：</text><text class="messageText">{{(item.regFee||item.regFee===0)?(item.regFee / 100)+'元':'---'}}</text></view>
				<view v-if="(item.payStatus === 0||item.payStatus === 2) && item.address" class="uni-user-label uni-user-labelBox">
					<view class="uni-user-text">地址：</view>
					<view class="messageText uni-address">{{item.address}}</view>
					<view class="seeMap" @tap.prevent.stop="getLocation(item.address)">查看地图</view>
				</view>
			</view>
			<!-- 已预约时显示的 -->
			<view v-if="item.payStatus === 0||item.payStatus === 2" class="uni-status-box reserved">
				<view class="messageTitle">预约说明：</view>
				<view class="uni-user-label">1、预约免费</view>
				<view class="uni-user-label">2、预约成功后，到达就诊当日0点后方可支付</view>
			</view>
			<view v-if="item.payStatus === 0||item.payStatus === 2" class="uni-status-box payNum">
				<button class="uni-button-box" @tap.prevent.stop="payMoney(item)">支付取号</button>
			</view>
			<view class="seeAllRecord" @tap.prevent.stop="goRegisterOrder">所有门诊就诊记录>></view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		consultingModel
	} from '@/models/consulting.js'
	const consulting = new consultingModel()
	import {
		payOrderModel
	} from '@/models/payOrder.js'
	const payOrder = new payOrderModel()
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	import QQMapWX from '../../util/qqmap-wx-jssdk.min';
	import ENVIRONMENT_CONFIG from '@/config/envConfig.js'
	export default {
		data() {
			return {
				setNav: {
					isdisPlayNavTitle: false,
					navTitle: '就诊'
				},
				isShow: true,
				openId: '',
				userId: '',
				orderNumber: '',
				seeDoctorDetail: false,
				clinicPayOrderList: [],
				registerOrderList: [],
				qqmapsdk: {},
				location: {
					latitudeHp: '',
					longitudeHp: '',
					latitudePer: '',
					longitudePer: ''
				},
			};
		},
		onShow() {
			this.seeDoctorDetail = false
			this.openId = uni.getStorageSync('userInfo').openId;
			this.userId = uni.getStorageSync('userInfo').userId;
			if (this.userId) {
				this.listClinicOrder({
					userId: this.userId
				})
				this.qqmapsdk = new QQMapWX({
					key: '2XSBZ-AIVCO-GVKWI-SPXLY-PBI3H-GLB3H' //测试环境
					// key: 'UPIBZ-ADDLP-JB3D2-LJE5R-MZHFT-UUFT6' //正式环境
					// key: ENVIRONMENT_CONFIG.QQMapWXKey //正式环境
				})
			}
			if (!this.userId) {
				this.seeDoctorDetail = true
				this.clinicPayOrderList = []
				this.registerOrderList = []
			}
		},
		methods: {
			formatterDate(str) {
				if (str) {
					return str.substring(0, 26)
				}
			},
			listClinicOrder(data) {
				consulting.listClinicOrder(data).then(res => {
					this.clinicPayOrderList = []
					this.registerOrderList = []
					let cacheData = uni.getStorageSync('seeDoctorPage')
					if (cacheData) {
						this.clinicPayOrderList = cacheData.clinicPayOrderList
						this.clinicPayOrderList.forEach((item, index) => {
							return Object.assign({}, item, {
								show: false
							})
						})
						this.registerOrderList = res.data.registerOrderList
					}
					if (!cacheData) {
						this.$refs.loading.open();
					}
					uni.setStorageSync('seeDoctorPage', JSON.parse(JSON.stringify(res.data)))
					this.clinicPayOrderList = res.data.clinicPayOrderList
					this.clinicPayOrderList.forEach((item, index) => {
						return Object.assign({}, item, {
							show: false
						})
					})
					this.registerOrderList = res.data.registerOrderList
					if (this.registerOrderList.length === 0 && this.clinicPayOrderList.length === 0) {
						this.seeDoctorDetail = true
					}
					this.$refs.loading.close();
				}).catch(err => {
					this.seeDoctorDetail = true
					this.$refs.loading.close();
					console.log(err)
				})
			},
			formatterCard(card) {
				if (card) {
					return card.substring(0, 4) + "******" + card.substring(14, 18)
				}
			},
			showMoreDetail(type, index) {
				if (this.clinicPayOrderList[index].show) {
					this.$set(this.clinicPayOrderList[index], 'show', false)
					this.clinicPayOrderList.forEach((item, inde) => { // todo 点击一个
						if (inde !== index) {
							this.$set(this.clinicPayOrderList[inde], 'show', false)
						}
					})
					return
				}
				if (!this.clinicPayOrderList[index].show) {
					this.$set(this.clinicPayOrderList[index], 'show', true)
					return
				}
			},
			famtterStatus(type) {
				switch (type) {
					case 0:
						return '预约成功';
					case 1:
						return '已取号';
					case 2:
						return '预约成功';
					case 3:
						return '已取消';
					case 4:
						return '已就诊';
					case 5:
						return '已过期';
					case 6:
						return '已退费';
				}
			},
			getOpenLocation(latitude, longitude, address) {
				let that = this
				if (latitude && longitude) {
					wx.openLocation({ //​使用微信内置地图查看位置。
						latitude: latitude, //要去的纬度-地址
						longitude: longitude, //要去的经度-地址
						name: address,
						address: address,
						success: function(res) {
							console.log(res)
						},
						fail: function(err) {
							console.log(err);
							wx.getSetting({
								success: function(res) {
									let statu = res.authSetting;
									if (!statu['scope.userLocation']) {
										wx.showModal({
											title: '是否授权当前位置',
											content: '查看地图需要获取您的地理位置，请确认授权',
											success: function(tip) {
												if (tip.confirm) {
													wx.openSetting({
														success: function(data) {
															if (data.authSetting["scope.userLocation"] === true) {
																wx.showToast({
																	title: '授权成功',
																	icon: 'success',
																	duration: 1000
																})
																that.getOpenLocation(latitude, longitude, address)
															} else {
																wx.showToast({
																	title: '授权失败',
																	icon: 'success',
																	duration: 1000
																})
															}
														}
													})
												}
											}
										})
									} else if (status['scope.userLocation']) {
										wx.showToast({
											title: '无法获取你的位置信息,请到设置中打开位置获取哦~',
											icon: 'none',
											duration: 1000
										})
									}
								},
								fail: function(res) {
									wx.showToast({
										title: '调用授权窗口失败',
										icon: 'success',
										duration: 1000
									})
								}
							})
						}
					})
				}
			},
			getLocation(address) {
				this.geocoder(address, '打开地图')
			},
			geocoder(address, type) {
				let that = this
				this.qqmapsdk.geocoder({
					address: address, //需要转换为经纬度的地址
					success: function(res) { //返回的数据里面有该地址的经纬度
						console.log("qqmapsdk.geocoder 接口调用成功返回的回调", res)
						let location = res.result.location //经纬度对象
						that.location.latitudeHp = location.lat
						that.location.longitudeHp = location.lng
						if (type) {
							that.getOpenLocation(location.lat, location.lng, address)
						}
					},
					fail: function(res) {
						console.log("qqmapsdk.geocoder 接口调用失败返回的回调")
					}
				})
			},
			payMoney(val) {
				if (val.clinicTime) {
					let clineTime = val.clinicTime.substring(0, 10)
					let dayMonth = (new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1)
					let dayDate = new Date().getDate() < 10 ? ('0' + (new Date().getDate())) : new Date().getDate()
					let dayNow = new Date().getFullYear() + '-' + dayMonth + '-' + dayDate
					console.log(clineTime, dayNow, val);
					if (clineTime !== dayNow) {
						wx.showModal({
							title: '提示',
							content: '就诊时间不在当日,暂无法支付',
							showCancel: false,
							confirmText: '确定',
							success(res) {},
							fail(err) {}
						});
						return
					}
				}
				const data = {
					bookingNo: val.bookingNo,
					hospitalId: val.hospitalId,
					patientId: val.patientId,
					regType: 1
				}
				consulting.payable(data).then(res => {
					if (res.data == 1) {
						const item = {
							openId: this.openId,
							orderNo: val.orderNo,
							tradeChannel: '8006',
							transAmount: val.regFee
						}
						this.orderNumber = val.orderNo
						this.payMethod(item, val, '挂号')
					} else {
						wx.showToast({
							title: '不能支付！',
							icon: 'none'
						})
					}
				})
			},
			payMethod(item, val, type) {
				medical.weixinPay(item).then(res => {
						wx.showLoading({
							title: '支付中...',
						})
						if (res.data.payStatus === 1) {
							wx.showToast({
								title: '支付成功！',
								mask: true
							})
							if (type === '挂号') {
								wx.navigateTo({
									url: `/pagesA/registerOrder/orderDetails?id=${val.id}`
								})
							}
							if (type === '缴费') {
								wx.navigateTo({
									url: '/pagesA/payOrder/consumptionList?clinicNo=' + val.clinicNo + '&userId=' + val.patientId + '&flag=1'
								})
							}
							return;
						}
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
											if (type === '挂号') {
												wx.navigateTo({
													url: `/pagesA/registerOrder/orderDetails?id=${val.id}`
												})
											}
											if (type === '缴费') {
												wx.navigateTo({
													url: '/pagesA/payOrder/consumptionList?clinicNo=' + val.clinicNo + '&patientId=' + val.patientId +
														'&flag=1'
												})
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
			addClinicPayOrder(val) {
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
					if (res.data.payStatus == 0) {
						const item = {
							openId: this.openId,
							orderNo: res.data.orderNo,
							tradeChannel: '8006',
							transAmount: val.payFee
						}
						this.orderNumber = res.data.orderNo
						this.payMethod(item, val, '缴费')
					}
				}).catch(err => {
					console.log(err)
				})
			},
			goPayOrder(item) {
				if (item.clinicNo && item.patientId) {
					let flag = item.payStatus === 0 ? 0 : 1
					wx.navigateTo({
						url: `/pagesA/payOrder/consumptionList?clinicNo=${item.clinicNo}&patientId=${item.patientId}&flag=${flag}`
					})
				} else {
					wx.navigateTo({
						url: '/pagesA/payOrder/index'
					})
				}
			},
			goForReserve() {
				if (this.userId) {
					uni.navigateTo({
						url: '/pagesA/bookRegister/index'
					})
				} else {
					wx.showModal({
						title: '请先登录哦~',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/guide?fromType=seeDoctorIndex'
								})
							} else if (res.cancel) {
								// 用户点击取消
							}
						}
					});
				}
			},
			goRegisterOrder() {
				if (this.userId) {
					wx.navigateTo({
						url: '/pagesA/registerOrder/index'
					})
				} else {
					wx.showModal({
						title: '请先登录哦~',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/guide'
								})
							} else if (res.cancel) {
								// 用户点击取消
							}
						}
					});
				}
			},
			goOrderDetails(id) {
				wx.navigateTo({
					url: `/pagesA/registerOrder/orderDetails?id=${id}`
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.no-recent {
		width: 100%;
		color: #ccc;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.no-recent-image {
		text-align: center;
		height: 180px;
		width: 180px;
		margin-top: 80px;
		margin-bottom: 50px;

	}

	.no-recent-text {
		width: 100%;
		color: #3E3E3E;
		text-align: center;
	}

	.uni-reserve-box {
		width: 360rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		border-radius: 8rpx;
		color: #fff;
		line-height: 70rpx;
		font-size: 32rpx;
		margin-top: 30rpx;
	}

	.uni-button {
		width: 640rpx;
		height: 94rpx;
		background: linear-gradient(to right, #5ea6f8, #3b7cf4);
		color: #ffffff;
	}

	.uni-bottom-bar {
		height: 40rpx;
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
	}

	.uni-user-box {
		border-radius: 10rpx;
		position: relative;
		top: -38rpx;
		margin-bottom: 30rpx;

		.uni-userBig-box {
			background: #ffffff;
			margin: 0 30rpx 0 30rpx;
			padding: 0 30rpx 30rpx 30rpx;
			line-height: 60rpx;
			border-radius: 10rpx 10rpx 0 0;
		}
	}

	.uni-user-title {
		display: flex;
		justify-content: space-between;
		font-size: 40rpx;
		font-weight: 600;
		color: #333333;
		padding: 16rpx 0 40rpx 0;
	}

	.queueNum {
		color: #333333;
		font-size: 30rpx;
		padding-bottom: 60rpx;

		.queueNum-num {
			color: #2884FF;
			text-align: center;

			text {
				font-weight: 600;
			}
		}

		.queueNum-code {
			font-size: 60rpx;
			font-weight: 600;
		}

		.queueNum-linenum {
			font-size: 24rpx;
			color: #AEAEAEFF;
		}
	}

	.payBtn {
		height: 30rpx;
		margin-left: 20rpx;
		line-height: 30rpx;
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
		background: #2884FF;
	}

	.refundFee-price {
		color: #B2B2B2;
	}

	.inspect-paid {
		color: #2884FF;
	}

	.inspect-price {
		color: #FF745F;
	}

	.seeMap {
		padding: 0 16rpx 0 16rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		border-radius: 5px;
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
	}

	.uni-status-box {
		background: #ffffff;
		margin: 0 30rpx 0 30rpx;
		line-height: 60rpx;

		.pointList {
			padding: 30rpx 0 0 0;
			border-top: 2rpx solid #E5E5E5;
			font-size: 40rpx;
			font-weight: 600;
			color: #3E3E3E;
		}
	}

	.guideSheet {
		font-size: 30rpx;
		padding: 0 30rpx 10rpx 30rpx;
		border-radius: 0 0 5px 5px;
	}

	.reserved {
		padding: 0 30rpx 0 30rpx;
		border-radius: 0 0 5px 5px;
		background: #2884FF19;
		color: #3E3E3E;
	}

	.payNum {
		padding: 30rpx 30rpx 30rpx 30rpx;
	}

	.inspect {
		font-size: 30rpx;
		padding: 0 30rpx 0 30rpx;
		border-radius: 0 0 5px 5px;
	}

	.seeMore {
		color: #8E8E8E;
		font-size: 26rpx;
		text-align: center;
		padding: 20rpx 0 20rpx 0;
	}

	.uni-status-topBox {
		font-size: 30rpx;
		font-weight: 600;
		padding: 20rpx 0 0 0;
		display: flex;
		justify-content: space-between;
	}

	.uni-status-topBox:first-child {
		border-top: 2rpx solid #E5E5E5FF;
	}

	.messageTitle {
		color: #186DB6FF;
		font-size: 30rpx;
		font-weight: 600;
	}

	.uni-user-label {
		// width: 150rpx;
		position: relative;
		color: #989898;
		font-size: 30rpx;

		.uni-user-text {
			display: inline-block;
			width: 150rpx;
		}

		.uni-user-img {
			position: absolute;
			right: 0rpx;
			top: 50%;
			transform: translateY(-50%);
			width: 36rpx;
			height: 20rpx;
		}
	}

	.uni-user-labelBox {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.messageText {
		color: #333333;
	}

	.uni-address {
		flex: 1;
	}

	.uni-doctorName {
		color: #3E3E3E;
		font-weight: 600;
		margin-right: 15rpx;
	}

	.uni-button-box {
		height: 70rpx;
		line-height: 70rpx;
		font-size: 32rpx;
		background: linear-gradient(to right, #FFB554FF, #FFA36AFF);
		color: #ffffff;
		width: 360rpx;
		border-radius: 8rpx;
	}

	.confirmPay {
		margin-top: 30rpx;
	}

	.seeAllRecord {
		color: #3E3E3EFF;
		font-size: 30rpx;
		text-align: center;
		padding: 30rpx 0rpx;
	}

	.orderMessage {
		margin: 20rpx 24rpx;
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0rpx 0rpx 20rpx 4rpx #3B7CF415;
		display: flex;
		justify-content: space-between;
		align-items: center;

		img {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			border: 1px solid gray;
		}

		.uni-orderList {
			flex: 1;
			line-height: 50rpx;

			.uni-orderList-top {
				display: flex;
				justify-content: space-between;
				color: #3E3E3EFF;
				font-size: 30rpx;

				.uni-outpatient {
					padding-right: 240rpx;
				}

				.uni-seeDoctoeTime {
					padding-right: 170rpx;
				}

				.uni-patientName {
					padding-left: 20rpx;
					color: #3E3E3EFF;
				}
			}
		}
	}

	.uni-payOrderList {
		background: #FFFFFF;
		margin-top: 20rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
		line-height: 30px;

		.uni-payOrderList-box {
			padding: 12px;
			border-bottom: 1px solid #F6F6F6FF;
		}
	}

	.uni-payOrderList-title {
		color: #3E3E3EFF;
	}

	.uni-bold-title {
		font-weight: bold;
	}

	.uni-code {
		color: #A5A5A5FF;
		font-size: 24rpx;
		float: right;
	}

	.noPay {
		margin-left: 20rpx;
		padding: 2rpx 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		background: linear-gradient(to right, #FFB554FF, #FFA36AFF);
	}

	.payStatus {
		margin-left: 20rpx;
		padding: 2rpx 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		background: #2884FF99;
	}

	.uni-list-box {
		color: #989898FF;
	}

	.uni-price {
		float: right;
		color: #FF745FFF;
		font-weight: 600;
	}

	.uni-user-price {
		float: right;
		font-weight: 600;
		color: #3E3E3EFF;
	}

	.uni-goPay {
		margin: 0 172rpx 0 170rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: linear-gradient(to right, #FFB554FF, #FFA36AFF);
		color: #fff;
		border-radius: 10rpx;
		text-align: center;
	}
</style>
