<template>
	<view style="background: #FFFFFF;min-height:100vh;">
		<u-bar v-if="!pathType" :nav="setNav" />
		<u-bar v-if="pathType" :nav="setNav" :route="'/pagesA/prescriptionOrder/index'" />
		<view class="uni-nav" v-if="userInfo.ihInspectionOrder">
			<view>
				<view class="uni-nav-title">{{statusType}}</view>
				<view v-if="payStatus==0" class="uni-nav-tips">温馨提示：请在二十四小时内进行处方缴费，过期将会失效</view>
				<view v-if="payStatus==4" class="uni-nav-tips">温馨提示：由于您未在规定时间内缴纳申请单费用，该处方已失效！</view>
				<view v-if="payStatus==1" class="uni-nav-tips">温馨提示：您已支付申请单费用！</view>
				<view v-if="payStatus==2" class="uni-nav-tips">温馨提示：十分抱歉，支付失败，请稍后重试！</view>
				<view v-if="payStatus==3" class="uni-nav-tips">温馨提示：已为您办理退款手续，退款金额将在1-7个工作日原路退回至您的账户！</view>
			</view>
		</view>
		<view class="uni-content">
			<view class="uni-content-box">
				<view class="uni-special-box">
					<view>
						<text class="uni-title-online"></text>
						<text class="uni-title">就诊凭证</text>
					</view>
					<view style="height: 90px;width: 100%;padding:40rpx 0rpx;">
						<u-barcode cid="code128" :loadMake="true" :onval="true" :val="val" :opations="opations" format="code128" ref="code128" />
					</view>
				</view>
			</view>
			<view class="uni-content-box" v-if="payStatus!=1">
				<view class="uni-bottonBox-content">
					<view style="padding-bottom: 30rpx;">
						<text class="uni-title-online"></text>
						<text class="uni-title">就诊信息</text>
					</view>
					<view class="uni-bottomBox-title">姓名：
						<text class="uni-bottomBox-text">
							{{userInfo.ihBusiHealthCard.name?userInfo.ihBusiHealthCard.name:'---'}}
						</text>
					</view>
					<view class="uni-bottomBox-title">健康卡号：
						<text class="uni-bottomBox-text">
							{{userInfo.ihBusiHealthCard.cardId?userInfo.ihBusiHealthCard.cardId:'---'}}
						</text>
					</view>
					<view class="uni-bottomBox-label">科室名称：
						<text class="uni-bottomBox-text">
							{{userInfo.ihInspectionOrder.departName?userInfo.ihInspectionOrder.departName:'---'}}
						</text>
					</view>
					<view class="uni-bottomBox-label">医生姓名：
						<text class="uni-bottomBox-text">
							{{userInfo.ihInspectionOrder.doctorName?userInfo.ihInspectionOrder.doctorName:'---'}}
						</text>
					</view>
				</view>
			</view>
			<view class="uni-content-box" v-if="payStatus==1">
				<view class="uni-special-box">
					<view style="padding-bottom: 30rpx;">
						<text class="uni-title-online"></text>
						<text class="uni-title">就诊信息</text>
					</view>
					<view class="uni-bottomBox-title" style="display: flex;justify-content:space-between;padding-bottom: 10rpx;">
						<view>姓名：</view>
						<view class="uni-bottomBox-text">
							{{userInfo.ihBusiHealthCard.name?userInfo.ihBusiHealthCard.name:'---'}}
						</view>
					</view>
					<view class="uni-bottomBox-title" style="display: flex;justify-content:space-between;padding-bottom: 10rpx;">
						<view>健康卡号：</view>
						<view class="uni-bottomBox-text">
							{{userInfo.ihBusiHealthCard.cardId?userInfo.ihBusiHealthCard.cardId:'---'}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-content-box">
				<view v-if="payStatus!=1" style="padding-bottom: 30rpx;">
					<text class="uni-title-online"></text>
					<text class="uni-title">申请单</text>
				</view>
				<view class="uni-special-box" style="padding-bottom: 30rpx;">
					<view v-if="payStatus==1">
						<text class="uni-title-online"></text>
						<text class="uni-title">申请单</text>
					</view>
					<view class="uni-special-boxItem" v-for="(item,index) in tableList" :key="index">
						<view v-if="userInfo.examinetype===1" style="font-size: 36rpx;font-weight: bold;padding-bottom: 10rpx;">检查{{changeNoToChinese(index)}}：{{item.examineName?item.examineName:'暂无'}}
							{{item.detailPartAndMethodName?'('+item.detailPartAndMethodName+')':''}}</view>
						<view v-if="userInfo.examinetype===2" style="font-size: 36rpx;font-weight: bold;padding-bottom: 10rpx;">检验{{changeNoToChinese(index)}}：{{item.examineName?item.examineName:'暂无'}}{{item.methodName?'('+item.methodName+')':''}}</view>
						<view v-if="userInfo.examinetype===2" style="padding-bottom: 25rpx;color:#B2B2B2;">检查标本：{{item.itemName?item.itemName:'暂无'}}</view>
						<view style="color:#B2B2B2;">执行科室：{{item.departName}}</view>
					</view>
					<view class="uni-special-boxItem" style="border-bottom: none;">
						<view style="display: flex;flex-direction:row-reverse;">
							<text style="font-weight: bold;">{{userInfo.ihInspectionOrder.payFee?'￥'+userInfo.ihInspectionOrder.payFee/100:''}}</text>
							<text style="color: #B2B2B2;font-size:30rpx;font-weight: bold;">小计：</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="payStatus==0" class="uni-gopay">
				<view v-preventReClick @click="goToPay" v-preventReClick>立即支付</view>
			</view>
			<view v-if="payStatus==1" class="uni-content-box uni-content-specialBox">
				<view v-if="payStatus!=1" style="padding-bottom: 30rpx;">
					<text class="uni-title-online"></text>
					<text class="uni-title">支付详情</text>
				</view>
				<view class="uni-special-box">
					<view v-if="payStatus==1" style="padding-bottom: 30rpx;">
						<text class="uni-title-online"></text>
						<text class="uni-title">支付详情</text>
					</view>
					<view class="uni-pay-item">
						<view class="uni-pay-itemName">交易金额</view>
						<view class="uni-pay-itemDetail">￥{{userInfo.ihInspectionOrder.payFee/100}}</view>
					</view>
					<view class="uni-pay-item">
						<view class="uni-pay-itemName">支付时间</view>
						<view class="uni-pay-itemDetail">{{userInfo.ihInspectionOrder.payTime}}</view>
					</view>
					<view class="uni-pay-item">
						<view class="uni-pay-itemName">订单状态</view>
						<view class="uni-pay-itemDetail">缴费成功</view>
					</view>
					<view class="uni-pay-item">
						<view class="uni-pay-itemName">平台订单号</view>
						<view class="uni-pay-itemDetail">{{userInfo.ihInspectionOrder.orderNo}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		prescriptionModel
	} from '@/models/prescriptionOrder.js'
	const prescription = new prescriptionModel()
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	import {
		NoToChinese
	} from '@/util/util.js'
	const medical = new MedicalReportModel()
	let app = getApp()
	export default {
		data() {
			return {
				setNav: {
					isdisPlayNavTitle: true
				},
				tableList: [],
				val: '',
				opations: {
					format: "CODE128", //选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
					width: 100, //设置条之间的宽度
					displayValue: false, //是否在条形码下方显示文字
					height: 190,
					fontSize: 100,
					textAlign: "left", //设置文本的水平对齐方式
					textPosition: "bottom", //设置文本的垂直位置
					textMargin: 0, //设置条形码和文本之间的间距
					background: "#FFFFFF", //设置条形码的背景色
					margin: 0, //设置条形码周围的空白边距
				},
				typeIndex: 0,
				pathType: false,
				orderId: '',
				loading: false,
				userInfo: {},
				statusType: '',
				totalPrice: '',
				userId: '',
				payStatus: '',
			}
		},
		onLoad(options) {
			this.userId = uni.getStorageSync('userInfo').userId
			this.orderId = options.id
			if (options.pathType) {
				this.pathType = true
			}
			if (options.status == 1) {
				this.payStatus = 1
			}
			this.apiIhInspectionOrderGetOrderDetail(this.orderId) // todo
			if (!this.userId) {
				const testDetailsIndex = {
					id: this.orderId,
					status: this.payStatus,
					pathType: 1
				}
				uni.setStorageSync('testDetailsIndex', JSON.stringify(testDetailsIndex))
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=' + 'testDetailsIndex'
							})
						}
					}
				})
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('userInfo').userId
		},
		methods: {
			changeNoToChinese(number) {
				return NoToChinese(number + 1)
			},
			apiIhInspectionOrderUpdate(data) {
				prescription.ihInspectionOrderUpdate(data).then(res => {
					const item = {
						openId: uni.getStorageSync('userInfo').openId || config.openId,
						orderNo: this.userInfo.ihInspectionOrder.orderNo,
						tradeChannel: '8006',
						transAmount: this.userInfo.ihInspectionOrder.payFee
					}
					this.samplePay(item)
				})
			},
			apiIhInspectionOrderGetOrderDetail(id) {
				this.$refs.loading.open();
				prescription.ihInspectionOrderGetOrderDetail({
					id
				}).then(res => {
					if (res.data) {
						this.userInfo = res.data
						this.val = res.data.idCard
						this.tableList = res.data.ihCheckInspectionDetails
						this.tableList.forEach((item) => {
							if (item.payFee) {
								this.totalPrice += item.payFee
							}
						})
						this.payStatus = res.data.ihInspectionOrder.payStatus
						this.statusType = this.changeStatus(res.data.ihInspectionOrder.payStatus)
						this.$refs['code128']._makeCode()
					}
					this.$refs.loading.close();
				}).catch(err => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
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
							return val
						}
					}
				}
			},
			change(e) {
				console.log(e.detail);
			},
			edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
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
										// const data = that.userInfo.ihInspectionOrder.orderNo
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
		padding: 20rpx 20rpx 0 20rpx;

		.uni-title-online {
			height: 40rpx;
			border: 2rpx solid #488BF5;
		}

		.uni-title {
			padding-left: 20rpx;
			color: #3E3E3E;
			font-size: 40rpx;
			font-weight: bold;
		}

		.uni-bottonBox-content {
			margin-top: 25rpx;

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

		.uni-content-bottom {
			border-bottom: 2rpx solid #F6F6F6;
		}
	}

	.uni-content-specialBox {
		padding: 20rpx;
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
			margin: 40rpx auto;
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

	.uni-special-box {
		margin-top: 20rpx;
		padding: 20rpx 20rpx 0rpx 20rpx;
		background: #FFFFFF;
		box-shadow: 5rpx 4rpx 12rpx 5rpx rgba(59, 124, 244, 0.1);
		border-radius: 4rpx;

		.uni-pay-item {
			display: flex;
			font-size: 24rpx;
			padding-bottom: 20rpx;
			justify-content: space-between;

			.uni-pay-itemName {
				color: #989898;
			}

			.uni-pay-itemDetail {
				color: #3E3E3E;
			}
		}
	}

	.uni-special-boxItem {
		padding: 20rpx 0rpx;
		font-size: 36rpx;
		line-height: 1;
		border-bottom: 2rpx solid #F6F6F6;
	}
</style>
