<template>
	<view>
		<u-bar :nav="setNav" :route="`/pagesA/medicalAppointment/medicalDetails?item=${JSON.stringify(this.userList)}&id=${this.id}`" />
		<view v-if="!userDetails[0].comboName" style="text-align: center;">
			<view class='uni-default-tip'>
				<text>暂无项目明细～</text>
			</view>
		</view>
		<view class="uni-detailed-list uni-detailed-box" v-if="userDetails[0].comboName">
			<view class="">项目</view>
			<view class="">明细</view>
		</view>
		<view class="uni-detailed-list  uni-detailed-boxList" v-if="userDetails[0].comboName" v-for="(item,index) in userDetails" :key="index">
			<view class="uni-details-label uni-details-title">{{item.comboName?item.comboName:'---'}}</view>
			<view class="uni-details-label">
				<view class="uni-details-title" v-for="(items,indexs) in item.combosItemList" :key="indexs">{{items.itemName?items.itemName:'---'}}</view>
			</view>
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
					'navTitle': '体检套餐',
					'isdisPlayNavTitle': true,
				},
				packageName: '',
				userDetails: [],
				userList: {}
			}
		},
		onLoad(options) {
			if (options.item) {
				this.userList = JSON.parse(options.item)
			}
			this.packageId = options.packageId
		},
		onShow() {
			const data = {
				packageId: this.packageId
			}
			this.getDetails(data)
		},
		methods: {
			getDetails(data) {
				appointment.listPackageCombos(data).then(res => {
					this.userDetails = res.data
				}).catch(err => {
					console.log(err)
				})
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

	.uni-title {
		border-bottom: 1px solid #DBDBDB;
		padding: 20rpx 0;
	}

	.uni-modal {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		z-index: 999999;
	}

	.modalContent {
		border: 1px solid #ccc;
		// height: 1000rpx;
		width: 660rpx;
		height: 1000rpx;
		position: absolute;
		/*让节点脱离文档流,我的理解就是,从页面上浮出来,不再按照文档其它内容布局*/
		margin: 0 auto;
		top: 280rpx;
		/*节点脱离了文档流,如果设置位置需要用top和left,right,bottom定位*/
		left: 0;
		right: 0;
		bottom: 1;
		border-radius: 20rpx;
		z-index: 2;
		background: white;
	}

	.uni-detailed-list {
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 30rpx;
	}

	.uni-detailed-box {
		padding: 30rpx 0;
		color: #FFFFFF;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.uni-detailed-boxList {
		padding: 10rpx 0;
		border-bottom: 2rpx solid #DBDBDB;
	}

	.uni-details-label {
		width: 50%;
	}

	.uni-details-title {
		text-align: center;
	}

	.uni-default-tip {
		text-align: center;
		font-size: 40rpx;
		color:#333333;
		padding: 200rpx 0;
	}
</style>
