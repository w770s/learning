<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view class="uni-detailed-box">
			<view class="" @click="changeIndex(index)" v-for="(item, index) in navBar" :key="index" :class="whichIndex == index ? 'app-navTitle' : ''">{{item.name}}</view>
		</view>
		<view class="uni-find-box">
			<view class="" style="display: flex;align-items: center;">
				<input :placeholder="whichIndex==0?'请输入药品首字母':whichIndex==1?'请输入项目名称':whichIndex==2?'请输入项目名称':'请输入名称'" style="height: 60rpx; border: 2rpx solid #DBDBDB;border-radius: 10rpx;padding-left: 20rpx;flex: 1;"
				 type="text" v-model="keyword" value="" @input='inputTex' />
				<text style="text-align: center; height: 60rpx;font-size: 12px;background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);color: #FFFFFF;border-radius: 10rpx;margin-left: 20rpx;width: 100rpx;line-height: 60rpx;"
				 @click="changeBtn(whichIndex)">搜索</text>
			</view>
			<view v-if="userList.length>0" class="uni-title" v-for="(item,index) in userList" :key="index">
				<view class="" style="flex: 1;">{{item.itemDesc}}</view>
				<view class="" style="flex: 1;text-align: right;color: #ACACAC;">{{item.amount?'￥'+item.amount:'---'}}</view>
			</view>
			<view v-if="userInfo.length>0" class="uni-title" v-for="(item,index) in userInfo" :key="index">
				<view class="" style="flex: 1;">{{item.name}}</view>
				<view class="" style="flex: 1;text-align: right;color: #ACACAC;">{{item.retailPrice?'￥'+item.retailPrice:'---'}}{{item.saleUnit?'/'+item.saleUnit:'---'}}</view>
			</view>
		</view>
		<view class="" v-if="userList.length==0&&(whichIndex==1||whichIndex==2)" style="padding: 200rpx 0;text-align: center;color: #DBDBDB;">
			{{whichIndex==1?'请输入项目名称进行搜索~':whichIndex==2?'请输入项目名称进行搜索~':'请输入首字母进行搜索~'}}
		</view>
		<view class="" v-if="userInfo.length==0&&whichIndex==0" style="padding: 200rpx 0;text-align: center;color: #DBDBDB;">
			请输入首字母进行搜索~
		</view>
	</view>
</template>

<script>
	import {
		medicalAppointmentModel
	} from '@/models/medicalAppointment.js'
	const appointment = new medicalAppointmentModel()
	export default {
		data() {
			return {
				next: false,
				setNav: {
					'navTitle': '价格公示',
					'isdisPlayNavTitle': true,
				},
				whichIndex: 0,
				keyword: '',
				userList: [],
				userInfo: [],
				navBar: [{
						name: '药品价格'
					},
					{
						name: '检查项目'
					},
					{
						name: '检验项目'
					}
				]
			}
		},
		onShow() {
			// this.changeBtn(0)
		},
		methods: {
			changeIndex(type) {
				this.whichIndex = type
				this.keyword = ''
				this.userList = []
				this.userInfo = []
			},
			changeBtn(type) {
				if (this.whichIndex == 0) {
					this.getList0()
				} else {
					this.getList1()
				}
			},
			getList0() {
				const data = {
					abbreviationCode: this.keyword ? this.keyword : ''
				}
				appointment.medicineSearch(data).then(res => {
					if (res.data == null) {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						this.userInfo = []
						this.keyword = ''
					} else {
						this.userInfo = res.data
					}
				}).catch(err => {
					console.log(err)
				})
			},
			getList1() {
				const data = {
					keyword: this.keyword ? this.keyword : ''
				}
				if (this.whichIndex == 1) {
					data['type'] = 1
				}
				if (this.whichIndex == 2) {
					data['type'] = 2
				}
				appointment.checkmePrices(data).then(res => {
					if (!res.data) {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						this.userList = []
						this.keyword = ''
					} else {
						this.userList = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			},
			inputTex() {
				if (!this.keyword) {
					this.userInfo = []
					this.userList = []
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-detailed-box {
		padding: 30rpx 30rpx 0 30rpx;
		display: flex;
		justify-content: space-around;
		border-bottom: 2rpx solid #E5E5E5;
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

	.app-navTitle {
		padding-bottom: 30rpx;
		border-bottom: 4rpx solid #2884FF;
	}

	.uni-find-box {
		padding: 30rpx;
	}

	.uni-title {
		border-bottom: 1px solid #DBDBDB;
		padding: 20rpx 0;
		margin-left: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
</style>
