<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view style="height: 80rpx; background: linear-gradient(to right,#5EA6F8,#3B7CF4);"></view>
		<view class="uni-content">
			<view class="uni-absolute-content">
				<view class="uni-content-box">
					<view class="uni-content-title"><text>体检者信息</text></view>
					<view class="userList-details">
						<view class="userList-detailsTitle">姓名</view>
						<input placeholder="请输入体检者的姓名" placeholder-style="color:#B2B2B2;" v-model="userList.name" class="userList-detailsText"
						 @input='userInputName' />
					</view>
					<view class="userList-details">
						<view class="userList-detailsTitle">手机号</view>
						<input placeholder="请输入体检者的手机号码" placeholder-style="color:#B2B2B2;" v-model="userList.phone" class="userList-detailsText"
						 @input='userInputPhone' />
					</view>
					<view class="userList-details">
						<view class="userList-detailsTitle">身份证</view>
						<input placeholder="请输入体检者的身份证" placeholder-style="color:#B2B2B2;" v-model="userList.cardId" class="userList-detailsText"
						 @input='userAddressCard' />
					</view>
					<view style=" height: 50px; display: flex;position: relative;">
						<view class="userList-detailsTitle">体检套餐</view>
						<input disabled="true" placeholder="请选择体检套餐" placeholder-style="color:#B2B2B2;" v-model="userList.packageName"
						 class="userList-detailsText" @tap="goForChoose" />
						<img class="uni-right-img" src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png"></img>
					</view>
					<view style=" height: 50px; display: flex;position: relative;">
						<view class="userList-detailsTitle">就诊时间</view>
						<view v-model="userList.orderTime" class="userList-detailsText userList-detailsNoBorder">
							<gpp-date-picker @onConfirm="onConfirm" :startDate="startDate" :endDate="endDate" :defaultValue="pickerDate">
								<text :class="[userList.orderTime==''?'uni-gray-color':'uni-black-color']">
									{{userList.orderTime || '请选择时间'}}
								</text>
							</gpp-date-picker>
						</view>
						<img class="uni-right-img" src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png"></img>
					</view>
				</view>
				<view class="uni-reserve-button">
					<button :class="['uni-button-next',next?'uni-button-color':'uni-button-disabled']" @click="goUserTest">
						确认预约
					</button>
					<view class="uni-reserve-tip">
						<view><text>提示：</text></view>
						<view><text>1、请填写您的相关信息及所需要的体检套餐和时间；</text></view>
						<view><text>2、确认预约后，我们会在预约时间结束后统一发送短信给您，告知您具体的体检时间及注意事项。</text></view>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		medicalAppointmentModel
	} from '@/models/medicalAppointment.js'
	const appointment = new medicalAppointmentModel()
	import gppDatePicker from "../../components/gpp-datePicker.vue"
	export default {
		components: {
			gppDatePicker
		},
		data() {
			return {
				next: false,
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '体检预约'
				},
				id: '',
				inputPackageName: false,
				inputName: false,
				inputPhone: false,
				inputCard: false,
				inputOrderTime: false,
				next: false,
				startDate: this.fun_date(1),
				endDate: this.fun_date(30),
				pickerDate: this.fun_date(1),
				userList: {
					orderTime: '',
					packageId: '',
					name: '',
					phone: '',
					cardId: '',
					packageName: ''
				}
			}
		},
		onLoad(options) {
			if (options.item) {
				this.userList = JSON.parse(options.item)
				this.id = options.id
				console.log(this.userList)
				if (!this.userList.packageName) {
					this.inputPackageName = false
				} else {
					this.inputPackageName = true
					this.inputName = uni.getStorageSync('types').inputName
					this.inputPhone = uni.getStorageSync('types').inputPhone
					this.inputCard = uni.getStorageSync('types').inputCard
				}
				this.isAllright()
			}
		},
		methods: {
			fun_date(num) {
				let date1 = new Date();
				let time1 = date1.getFullYear() + '-' + ((date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1) : (date1.getMonth() +
					1)) + '-' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate())
				let date2 = new Date(date1);
				date2.setDate(date1.getDate() + num);
				let time2 = date2.getFullYear() + '-' + ((date2.getMonth() + 1) < 10 ? '0' + (date2.getMonth() + 1) : (date2.getMonth() +
					1)) + '-' + (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate());
				return time2;
			},
			onConfirm(e) {
				this.userList.orderTime = e.dateValue
				if (!this.userList.orderTime) {
					this.inputOrderTime = false
				} else {
					this.inputOrderTime = true
				}
				this.isAllright()
			},
			userInputName() {
				if (!this.userList.name) {
					this.inputName = false
				} else {
					this.inputName = true
				}
				this.isAllright()
			},
			userInputPhone() {
				const reg1 = /^[1][0-9]{10}$/;
				if (!reg1.test(this.userList.phone)) {
					this.inputPhone = false
				} else {
					this.inputPhone = true
				}
				this.isAllright()
			},
			userAddressCard() {
				const reg2 = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				if (!reg2.test(this.userList.cardId)) {
					this.inputCard = false
				} else {
					this.inputCard = true
				}
				this.isAllright()
			},
			isAllright() {
				if (this.inputName && this.inputPhone && this.inputCard && this.inputPackageName && this.inputOrderTime) {
					this.next = true
				} else {
					this.next = false
				}
			},
			goForChoose() {
				const type = {
					inputName: this.inputName,
					inputPhone: this.inputPhone,
					inputCard: this.inputCard,
				}
				uni.setStorageSync('types', type)
				uni.navigateTo({
					url: `./medicalDetails?item=${JSON.stringify(this.userList)}&id=${this.id}`
				})
			},
			throttle() {
				this.$refs.loading.open()
				this.apiSendVerifyCode(this.userList)
			},
			apiSendVerifyCode(data) {
				appointment.addAppointment(data).then(res => {
					this.$refs.loading.close()
					uni.showToast({
						title: '预约成功！',
						icon: 'none'
					})
					uni.switchTab({
						url: '../../pages/login/home'
					})
				}).catch((err) => {
					this.$refs.loading.close()
					console.log(err);
				})
			},
			showModelMes(showCancel, title, cancelText, confirmText, content) {
				wx.showModal({
					showCancel: showCancel,
					title: title,
					cancelText: cancelText,
					confirmText: confirmText,
					content: content,
					success(res) {},
					fail(err) {}
				});
			},
			goUserTest() {
				if (this.next === false) {
					this.showModelMes(false, '提示', '', '确认', '请先完善信息')
					return
				}
				this.throttle()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content {
		padding: 24rpx;
		font-size: 30rpx;
		position: relative;
	}

	.uni-content-box {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
	}

	.uni-absolute-content {
		position: absolute;
		top: -60rpx;
		left: 24rpx;
		right: 24rpx;
	}

	.uni-content-title {
		font-size: 36rpx;
		font-weight: bold;
		padding: 30rpx 30rpx 60rpx 30rpx;
	}

	.userList-details {
		display: flex;
	}

	.userList-detailsTitle {
		width: 190rpx;
		line-height: 100rpx;
		padding-left: 30rpx;
	}

	.userList-detailsText {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: 1rpx solid #E5E5E5;
		padding-right: 20rpx;
	}

	.userList-detailsNoBorder {
		border-bottom: none;
	}

	.uni-gray-color {
		color: #B2B2B2;
	}

	.uni-black-color {
		color: #333333;
	}

	.uni-right-img {
		position: absolute;
		right: 20rpx;
		top: 30rpx;
		height: 40rpx;
		width: 20rpx;
		z-index: 100;
		background-color: #fff;
	}

	.uni-reserve-button {
		padding: 0rpx 32rpx;
	}

	.uni-button-next {
		height: 96rpx;
		margin: 100rpx 0rpx 30rpx 0rpx;
		text-align: center;
		font-size: 36rpx;
		color: #fff;
		border-radius: 16rpx;
	}

	.uni-reserve-tip {
		letter-spacing: 4rpx;
		padding-bottom: 30rpx;
	}

	.uni-button-disabled {
		background: rgba(40, 132, 255, 0.2);
	}

	.uni-button-color {
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}
</style>
