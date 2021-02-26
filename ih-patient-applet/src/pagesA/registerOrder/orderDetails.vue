<template>
	<view style="background: #FFFFFF;min-height:100vh;">
		<u-bar :nav="setNav" :route="'/pagesA/registerOrder/index'" />
		<view class="uni-bottom-bar"></view>
		<view>
			<view class="uni-content-box">
				<view class="uni-user-box">
					<view class="uni-user-topBox">
						<view class="uni-content-topBox">
							<view class="uni-subscribe">预约挂号</view>
							<view class="stateText">{{famtterStatus(userInfo.payStatus)}}</view>
						</view>
					</view>
					<view class="uni-user-middleBox">
						<img :src="userInfo.headImage" />
						<view class="uni-content-middleBox">
							<view class="uni-word-split">
								<text class="uni-doctorName" v-if="userInfo.name">{{userInfo.name}}</text>
								<text class="docText" v-if="userInfo.doctorLevel">{{ userInfo.doctorLevel}}</text>
								<text class="docText" v-if="userInfo.departName">{{ userInfo.departName}}</text>
							</view>
							<view class="uni-createDate">{{userInfo.clinicTime}}</view>
						</view>
					</view>
					<view class="uni-user-bottomBox" v-if="userInfo.payStatus === 1&&userInfo.queueNo">
						<view class="uni-content-bottomBox">
							<view class="uni-code">
								<text>{{userInfo.queueNo}}</text>
								号
							</view>
						</view>
					</view>
				</view>
				<view :class="['uni-message',userInfo.payStatus === 1?'uni-message2':'uni-message1']">
					<view class="uni-user-Title">患者信息</view>
					<view class="uni-user-label">
						姓名：
						<text class="messageText">{{ userInfo.patientName }} ({{ formatterCard(userInfo.idCard) }})</text>
					</view>
					<view class="uni-user-label">
						性别：
						<text class="messageText">{{ userInfo.gender=== 0?'男' : '女' }}</text>
					</view>
					<view class="uni-user-label">
						年龄：
						<text class="messageText">{{ userInfo.age?userInfo.age+'岁':'---'}}</text>
					</view>
					<view class="uni-user-label">
						电话：
						<text class="messageText">{{ userInfo.phone?userInfo.phone:'---'}}</text>
					</view>
				</view>
				<view class="" style="padding-top: 60rpx;line-height: 60rpx;">
					<view class="uni-user-Title">挂号信息</view>
					<view class="uni-user-label">
						挂号科室：
						<text class="messageText">{{ userInfo.departName }}</text>
					</view>
					<view class="uni-user-label">
						挂号时间：
						<text class="messageText">{{ userInfo.registerTime?userInfo.registerTime:'---' }}</text>
					</view>
					<view class="uni-user-label">
						就诊时间：
						<text class="messageText">{{ userInfo.clinicTime?userInfo.clinicTime:'---' }}</text>
					</view>
					<!-- <view class="uni-user-label">
						门诊类型：
						<text class="messageText">{{ userInfo.outpatientType }}</text>
					</view> -->
					<view class="uni-user-label">
						挂号费用：
						<text :class="['messageText',userInfo.regFee!==userInfo.oriPayAmt&&userInfo.oriPayAmt?'red-color':'']">{{ userInfo.regFee /100 }}元</text>
						<text class="messageBigText" v-if="userInfo.regFee!==userInfo.oriPayAmt&&userInfo.oriPayAmt">{{ userInfo.oriPayAmt /100 }}元</text>
					</view>
					<view class="uni-user-label uni-address" v-if="userInfo.address">
						<view class="uni-user-text">地址：</view>
						<view class="messageText" style="flex: 1;">{{ userInfo.address }}</view>
						<view class="seeMap" @tap.prevent.stop="getLocation(userInfo.address)">查看地图</view>
					</view>
				</view>
			</view>
			<view v-if="userInfo.payStatus === 0 || userInfo.payStatus === 2" class="reserved">
				<view class="uni-user-Title uni-warning">提示信息：</view>
				<view>1、预约免费</view>
				<view>2、预约成功后，到达就诊当日0点后方可支付</view>
				<view>3、支付前可取消，如果已经支付，则需要到医院线下取消</view>
			</view>
			<view v-if="userInfo.payStatus === 1" class="reserved">
				<view class="uni-user-Title uni-warning">取消提示：</view>
				<view>当前订单您已经付款，如果需要取消，则需要在医院线下取消退款</view>
			</view>
			<view class="uni-evaluate" v-if="userInfo.payStatus === 4&&evaluateList.length>0">
				<view class="uni-user-Title">评价信息</view>
				<view v-for="(item,index) in evaluateList" :key="index" class="uni-grade-box">
					<view class="uni-grade-flexBox">
						<view style="display: flex;">
							<view class="uni-grade-RateBox">
								<u-sunui-star v-if="item.optionContent" :defaultStar="item.optionContent" starSize="2em" :disabledStar="true" />
							</view>
						</view>
					</view>
					<view class="uni-grade-textarea" v-if="item.textareaData">评价:{{' '+item.textareaData}}</view>
				</view>
			</view>
			<view class="uni-user-btn">
				<button v-if="userInfo.payStatus === 0" class="uni-button-box" @tap="payMoney"><text>去支付</text>({{ (userInfo.regFee/100)+'元'}})</button>
				<button v-if="userInfo.payStatus !== 1&&userInfo.payStatus !== 6" :class="['button-box', userInfo.payStatus === 0 ? 'cancelReservation' : userInfo.payStatus === 2 || userInfo.payStatus === 3 || userInfo.payStatus === 4 || userInfo.payStatus === 5 ? 'visited' : '']"
				 @tap="cancelAppointment(payStatus(userInfo.payStatus))">
					{{ payStatus(userInfo.payStatus) }}
				</button>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		config
	} from '@/config/index.js'
	import {
		consultingModel
	} from '@/models/consulting.js'
	const consulting = new consultingModel()
	import {
		consultationModel
	} from '@/models/consultationOrder.js'
	const consultation = new consultationModel()
	import {
		myOrderModel
	} from '@/models/myOrder.js'
	const myOrder = new myOrderModel()
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js';
	const medical = new MedicalReportModel();
	import QQMapWX from '../../util/qqmap-wx-jssdk.min';
	import ENVIRONMENT_CONFIG from '@/config/envConfig.js'
	export default {
		data() {
			return {
				location: {
					latitudeHp: '',
					longitudeHp: '',
				},
				qqmapsdk: {},
				setNav: {
					isdisPlayNavTitle: true,
					navTitle: '订单详情'
				},
				userId: '',
				openId: '',
				orderId: '',
				fromType: '',
				userInfo: {},
				evaluateList: [],
			}
		},
		onLoad(options) {
			this.orderId = options.id
			this.fromType = options.fromType
			console.log(this.orderId);
			this.qqmapsdk = new QQMapWX({
				// key: '2XSBZ-AIVCO-GVKWI-SPXLY-PBI3H-GLB3H' //必需，自己申请 测试环境
				// key: 'UPIBZ-ADDLP-JB3D2-LJE5R-MZHFT-UUFT6' //必需，自己申请 正式环境
				key: ENVIRONMENT_CONFIG.QQMapWXKey
			})
			this.userId = wx.getStorageSync('userInfo').userId
			if (!this.userId) {
				uni.setStorageSync('registerId', this.orderId)
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=registerOrderDetails'
							})
						}
					}
				});
			}
			if (options.id) {
				this.evaluateList = []
				this.$refs.loading.open();
				this.openId = uni.getStorageSync('userInfo').openId || config.openId;
				this.selectRegisterOrder(options.id);
			}
		},
		methods: {
			payStatus(type) {
				switch (type) {
					case 0:
						return '取消预约';
					case 1:
						return '再次预约';
					case 2:
						return '取消预约';
					case 3:
						return '重新预约';
					case 4:
						return '再次预约';
					case 5:
						return '重新预约';
				}
			},
			geocoder(address) {
				let that = this
				this.qqmapsdk.geocoder({
					address: address, //需要转换为经纬度的地址
					success: function(res) { //返回的数据里面有该地址的经纬度
						console.log("qqmapsdk.geocoder 接口调用成功返回的回调", res)
						let location = res.result.location //经纬度对象
						that.location.latitudeHp = location.lat
						that.location.longitudeHp = location.lng
					},
					fail: function(res) {
						console.log("qqmapsdk.geocoder 接口调用失败返回的回调", res)
					}
				})
			},
			famtterStatus(type) {
				let str = type + ''
				switch (str) {
					case '0':
						return '预约成功';
					case '1':
						return '已取号';
					case '2':
						return '预约成功';
					case '3':
						return '已取消';
					case '4':
						return '已就诊';
					case '5':
						return '已过期';
					case '6':
						return '已退费';
				}
			},
			apiListQuestion(orderNo) {
				myOrder.specificQuestionnaireData({
					correlationNo: orderNo,
					questionnaireId: 82
				}).then(res => {
					let evaluateList = res.data
					res.data.forEach((item, index) => {
						evaluateList.forEach((items, indexs) => {
							if (item.questionnaireDataId === items.questionnaireDataId) {
								if (item.type === '1' && items.type === '3') {
									item['textareaData'] = items.optionContent
									item['optionContent'] = parseInt(item.optionContent)
									this.evaluateList.push(item)
								}
							}
						})
					})
					console.log(this.evaluateList);
				}).catch((err) => {
					console.log(err);
				})
			},
			getLocation(address) {
				console.log(address);
				// let address = '上海市东方明珠电视塔'
				let that = this
				wx.openLocation({ //​使用微信内置地图查看位置。
					type: 'gcj02',
					latitude: that.location.latitudeHp,
					longitude: that.location.longitudeHp,
					name: address,
					address: address,
					scale: 18,
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
															that.getLocation(address)
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
			},
			formatterCard(card) {
				if (card) {
					return card.substring(0, 4) + '******' + card.substring(14, 18);
				}
			},
			selectRegisterOrder(id) {
				consulting.selectRegisterOrder({
					id
				}).then((res) => {
					this.userInfo = res.data
					// console.log(res.data.payStatus,res.data.orderNo);
					if (res.data.payStatus === 4) {
						this.apiListQuestion(res.data.orderNo)
					}
					if (this.userInfo.address) {
						console.log('地址解析');
						this.geocoder(this.userInfo.address)
					}
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			payMoney() {
				if (this.userInfo.clinicTime) {
					let clineTime = this.userInfo.clinicTime.substring(0, 10)
					let dayMonth = (new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1)
					let dayDate = new Date().getDate() < 10 ? ('0' + (new Date().getDate())) : new Date().getDate()
					let dayNow = new Date().getFullYear() + '-' + dayMonth + '-' + dayDate
					console.log(clineTime, dayNow, clineTime !== dayNow)
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
				const datas = {
					bookingNo: this.userInfo.bookingNo,
					hospitalId: this.userInfo.hospitalId,
					patientId: this.userInfo.patientId,
					regType: 1
				}
				consulting.payable(datas).then(res => {
					if (res.data == 1) {
						const data = {
							openId: this.openId,
							orderNo: this.userInfo.orderNo,
							tradeChannel: '8006',
							transAmount: this.userInfo.regFee
						}
						this.getWeixingPay(data)
					} else {
						wx.showToast({
							title: '不能支付！',
							icon: 'none'
						})
					}
				})
			},
			getWeixingPay(data) {
				let that = this
				medical.weixinPay(data).then(res => {
						wx.showLoading({
							title: '支付中...',
						})
						if (res.data.payStatus === 1) {
							wx.showToast({
								title: '支付成功！',
								mask: true
							})
							that.selectRegisterOrder(that.orderId);
							return;
						}
						uni.requestPayment({
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.prepayId,
							paySign: res.data.sign,
							signType: res.data.signType || 'MD5',
							success(e) {
								wx.hideLoading();
								if (e.errMsg == 'requestPayment:ok') {
									setTimeout(() => {
										// const data = that.userInfo.orderNo
										// medical.frontNotify(data).then(res => {
											that.selectRegisterOrder(that.orderId);
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
								console.log(err);
								wx.hideLoading();
							}
						});
					})
					.catch(err => {
						console.log(err);
					});
			},
			cancelAppointment(val) {
				let that = this
				if (val == '取消预约') {
					wx.showModal({
						title: '提示',
						content: '您确认取消预约吗？取消3次后可能会导致无法线上预约',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success(res) {
							if (res.confirm) {
								// 改变状态接口
								const data = {
									orderNo: that.userInfo.orderNo,
									patientId: that.userInfo.patientId,
									bookingNo: that.userInfo.bookingNo,
									regType: 1,
									type: 1
								}
								consultation.cancelRegister1(data).then(res => {
									that.selectRegisterOrder(that.orderId);
								}).catch(err => {
									console.log(err)
								})
							}
						},
						fail(err) {}
					});
				} else if (val == '重新预约') {
					wx.navigateTo({
						url: '/pagesA/bookRegister/index'
					})
				} else if (val == '再次预约') {
					if (this.userInfo.type === 1) {
						wx.navigateTo({
							url: `/pagesA/consulting/doctorDetail?hisDepartId=${this.userInfo.departId}&doctorId=${this.userInfo.relationId}`
						})
						this.hisDepartId = this.userInfo.departId
					}
					if (this.userInfo.type === 2) {
						wx.navigateTo({
							url: `/pagesA/consulting/doctorDetail?hisDepartId=${this.userInfo.relationId}`
						})
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-bottom-bar {
		height: 80rpx;
		background: linear-gradient(to right, #5EA6F8, #3B7CF4);
	}

	.uni-content-box {
		background: #FFFFFF;
		padding: 24rpx;
	}

	.uni-user-box {
		border-radius: 10rpx;
		// height: 252rpx;
		background: #ffffff;
		position: absolute;
		top: 160rpx;
		left: 24rpx;
		right: 24rpx;
		z-index: 1;
		box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.15);

		.uni-user-topBox {
			height: 90rpx;
			border-bottom: 1rpx solid #F6F6F6FF;

			.uni-content-topBox {
				margin: 0rpx 30rpx;
				padding-top: 20rpx;
				display: flex;
				justify-content: space-between;

				.uni-subscribe {
					width: 144rpx;
					height: 50rpx;
					line-height: 50rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
				}
			}
		}

		.uni-user-middleBox {
			margin: 30rpx 0 0 0;
			display: flex;
			padding-bottom: 20rpx;

			img {
				margin-left: 30rpx;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}

			.uni-content-middleBox {
				margin-left: 20rpx;

				.uni-doctorName {
					font-size: 36rpx;
					font-weight: 600;
					color: #333333;
				}

				.docText {
					margin-left: 20rpx;
					font-size: 30rpx;
					color: #333333;
				}

				.uni-createDate {
					font-size: 24rpx;
					color: #B2B2B2FF;
					margin-top: 20rpx;
				}
			}

			.uni-word-split {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.uni-user-bottomBox {
			height: 90rpx;
			border-top: 1px solid #F6F6F6FF;
		}

		.uni-content-bottomBox {
			margin: 0 0 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.uni-code {
				font-size: 30rpx;
				color: #2884FFFF;

				text {
					font-size: 60rpx;
					font-weight: bold;
					margin-right: 8rpx;
				}
			}
		}
	}

	.stateText {
		display: block;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		color: #333333;
	}

	.uni-message {
		line-height: 60rpx;
	}

	.uni-message1 {
		padding-top: 200rpx;
	}

	.uni-message2 {
		padding-top: 280rpx;
	}

	.seeMap {
		padding: 0 16rpx 0 16rpx;
		color: #ffffff;
		font-size: 26rpx;
		border-radius: 6rpx;
		background: linear-gradient(to right, #5ea6f8, #3b7cf4);
	}

	.reserved {
		padding: 20rpx 30rpx;
		border-radius: 0 0 5px 5px;
		background: #2884ff19;
		line-height: 40rpx;
		color: #3E3E3EFF;
		font-size: 30rpx;
	}

	.uni-evaluate {
		line-height: 60rpx;
		padding: 24rpx;
	}

	.uni-user-Title {
		color: #333333;
		font-size: 36rpx;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.uni-warning {
		color: #186DB6FF;
	}

	.uni-address {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.uni-user-label {
		color: #b2b2b2ff;
		font-size: 30rpx;

		.messageBigText {
			font-size: 28rpx;
			text-decoration: line-through;
		}

		.red-color {
			margin-right: 10rpx;
			color: red;
		}

		.uni-user-text {
			display: inline-block;
			width: 150rpx;
		}
	}

	.messageText {
		color: #333333;
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

	.uni-user-btn {
		background: #ffffff;
		padding-bottom: 60rpx;

		.uni-button-box {
			width: 640rpx;
			height: 94rpx;
			line-height: 94rpx;
			background: linear-gradient(to right, #ffb554ff, #ffa36aff);
			color: #ffffff;
			margin-top: 60rpx;
			font-size: 36rpx;

			text {
				margin-right: 20rpx;
			}
		}
	}

	.button-box {
		width: 640rpx;
		height: 94rpx;
		line-height: 94rpx;
		margin-top: 30rpx;
		font-size: 36rpx;
	}

	.cancelReservation {
		color: #2884ffff;
		background: #ffffff;
		border: 2rpx solid #2884ffff;
	}

	.visited {
		color: #ffffffff;
		background: linear-gradient(to right, #5ea6f8ff, #3b7cf4ff);
	}
</style>
