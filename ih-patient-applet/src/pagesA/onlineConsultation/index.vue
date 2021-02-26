<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view style="position:relative;">
			<view style="padding: 0 24rpx 0rpx 24rpx;">
				<view v-if="doctorList.length==0" style="text-align: center;">
					<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/messageKnock.png" />
					<view class='uni-default-tip'>
						<text>暂无在线复诊医生～</text>
					</view>
				</view>
				<view v-for="(item,index) in doctorList" :key="index">
					<view class="uni-content-box">
						<view class="uni-content-item" @tap="goConsult(item)">
							<view class="uni-content-line">
								<view class="uni-content-doctor">
									<view>
										<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png" />
									</view>
									<view>
										<view class="uni-content-name-box">
											<text class="uni-content-personName">{{item.name?item.name:''}}</text>
											<text style="margin-right:6px;">{{item.doctorLevel?item.doctorLevel:''}}</text>
											<text>{{item.departName?item.departName:''}}</text>
										</view>
										<view class="uni-amount-box">
											<view>接诊率<text>99%</text></view>
											<view class="uni-amount-boxTitle">好评率<text>99%</text></view>
											<view class="uni-amount-boxTitle">问诊量<text>999</text></view>
										</view>
									</view>
								</view>
								<view class="" style="text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;line-clamp: 2;-webkit-box-orient: vertical;">擅长：{{item.description?item.description:'暂无'}}</view>
							</view>
							<view class="uni-divide-line"></view>
							<view class="">
								<view style="position:absolute;text-align: center;width: 92rpx; height: 44rpx;z-index:2;right:0;top:0;font-size: 24rpx;">可开药</view>
								<img style="width: 100rpx;height: 44rpx;line-height: 44rpx;position: absolute;top: -5rpx;right: 0rpx;" src="http://file.aihuihc.com/patient/patientImages/images/drug.png"
								 mode=""></img>
							</view>
							<view class="uni-content-consult-box">
								<view>
								</view>
								<view style="display: flex;flex-direction: row-reverse;">
									<view :class="['uni-content-consult',item.schedulesList[0].canShowDetail?'uni-can-consult':'uni-canNot-consult']">去咨询</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		consultingModel
	} from '@/models/consulting.js'
	const consulting = new consultingModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '在线复诊'
				},
				doctorList: [],
				userId: '',
				departId: '',
				departName: '',
				healCardUserId: '',
			}
		},
		onLoad(options) {

		},
		onShow() {
			this.apiListRepeatDiagnosisSchedules()
		},
		methods: {
			fun_date(num, type) {
				let date1 = new Date();
				let date2 = new Date();
				let time2 = ''
				date2.setDate(date1.getDate() + num);
				let month = (date2.getMonth() + 1 < 10 ? 0 + '' + (date2.getMonth() + 1) : (date2.getMonth() + 1))
				let days = (date2.getDate() < 10 ? (0 + '' + date2.getDate()) : date2.getDate())
				if (type) {
					time2 = date2.getFullYear() + "-" + month + "-" + days;
				} else {
					time2 = month + "." + days;
				}
				return time2;
			},
			getNowDate() {
				const dateMonth = new Date().getMonth() + 1
				const month = dateMonth < 10 ? '0' + dateMonth : dateMonth
				const day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
				return new Date().getFullYear() + '-' + month + '-' + day
			},

			formatterDate(startTime, type, endTime) {
				if (type === '排班') {
					return startTime.substring(11, 16)
				}
				if (type === '咨询') {
					let timeForNow = new Date().getTime()
					let start = startTime ? new Date(startTime.replace(/-/g, '/')).getTime() : ''
					let end = endTime ? new Date(endTime.replace(/-/g, '/')).getTime() : ''
					if (timeForNow > start && timeForNow < end) {
						return true
					}
					return false
				}
			},
			formatterWeek(week) {
				switch (week) {
					case 1:
						return '一'
					case 2:
						return '二'
					case 3:
						return '三'
					case 4:
						return '四'
					case 5:
						return '五'
					case 6:
						return '六'
					case 7:
						return '日'
				}
			},
			apiListRepeatDiagnosisSchedules() {
				const data = {
					startDate: this.fun_date(0, 'interface') + ' 00:00:00',
					endDate: this.fun_date(0, 'interface') + ' 23:59:59',
					hospitalId: 1
				}
				consulting.listRepeatDiagnosisSchedules(data).then(res => {
					res.data.forEach((item) => {
						item.schedulesList.forEach((val) => {
							if (val.shiftName == '全日') {
								var isdate = new Date(val.regDate)
								isdate = isdate.getFullYear() + '-' + (isdate.getMonth() < 10 ? '0' + (isdate.getMonth() + 1) : (isdate.getMonth() +
									1)) + '-' + ((isdate.getDate() + 1) < 10 ? '0' + (isdate.getDate() + 1) : (isdate.getDate() + 1));
								return Object.assign(val, {
									canShowDetail: true
								})
							} else {
								return Object.assign(val, {
									canShowDetail: this.formatterDate(val.regDate + ' ' + val.startTime, '咨询', val.regDate + ' ' + val.endTime)
								})
							}
						})
					})
					this.doctorList = res.data
					console.log(this.doctorList)
				})
			},
			goConsult(val) {
				if (!val.schedulesList[0].canShowDetail) {
					wx.showModal({
						title: '该医生当前未排班，暂无法咨询~',
						showCancel: false,
						success(res) {
							if (res.confirm) {} else if (res.cancel) {}
						}
					});
					return
				} else {
					uni.navigateTo({
						url: `/pagesA/consulting/doctorDetail?doctorId=${val.relationId}&hospitalId=${1}&departId=${val.departId}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-default-img {
		text-align: center;
		height: 360rpx;
		width: 360rpx;
		margin-top: 160rpx;
		margin-bottom: 40rpx;
	}

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

	.uni-default-tip {
		text-align: center;
		font-size: 40rpx;
		color: #333333;
	}

	.uni-content-box {
		height: 100%;
		padding-bottom: 15px;
	}

	.uni-content-item {
		background-color: #fff;
		border-radius: 8px;
		position: relative;
		z-index: 0;
		margin-top: 20rpx;
	}

	.uni-content-line {
		font-size: 24rpx;
		color: #333333;
		padding: 30rpx 20rpx 30rpx 30rpx;
	}

	.uni-content-doctor {
		display: flex;

		img {
			width: 45px;
			height: 45px;
			border-radius: 50%;
			margin-right: 10px;
		}
	}

	.uni-content-name-box {
		margin-bottom: 16rpx;
		font-size: 30rpx
	}

	.uni-amount-box {
		color: #B2B2B2;
		margin-bottom: 8px;
		display: flex;

		.uni-amount-boxTitle {
			padding-left: 18rpx;
		}

		text {
			color: #2884FF;
		}
	}

	.uni-content-personName {
		font-size: 36rpx;
		font-weight: bold;
		margin-right: 12rpx;
	}

	.uni-content-img {
		position: absolute;
		width: 37px;
		height: 37px;
		top: 0px;
		left: 0px;
	}

	.uni-divide-line {
		background-color: #E5E5E5;
		height: 1px;
	}

	.uni-content-consult-box {
		display: flex;
		padding: 10px 10px 10px 15px;
		justify-content: space-between;
		align-items: center;

		.uni-currency-price {
			color: #FF745F;
			font-size: 15px;
			margin-right: 8px;
		}

		.uni-original-price {
			color: #B2B2B2;
			text-decoration: line-through;
		}

		.uni-currency-time {
			color: #2884FF;
			font-size: 12px;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 10px;
		}

		.uni-last-price {
			color: #B2B2B2;
			font-size: 12px;
			text-decoration: line-through;
		}

		.uni-content-consult {
			width: 68px;
			height: 30px;
			border-radius: 3px;
			font-size: 13px;
			color: #fff;
			text-align: center;
			line-height: 30px;
		}

		.uni-can-consult {
			background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		}

		.uni-canNot-consult {
			background: rgba(40, 132, 255, 0.2);
		}
	}
</style>
