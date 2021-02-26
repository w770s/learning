<template>
	<view>
		<u-bar :nav="setNav" :route="'/pagesA/medicalAppointment/index'" />
		<view class="uni-content">
			<view class="" style="display: flex;align-items: center;">
				<input placeholder="请输入项目名称" style="height: 60rpx; border: 2rpx solid #DBDBDB;border-radius: 10rpx;padding-left: 20rpx;flex: 1;" type="text"
				 v-model="packageName" value="" />
				<text style="text-align: center; height: 60rpx;font-size: 12px;background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);color: #FFFFFF;border-radius: 10rpx;margin-left: 20rpx;width: 100rpx;line-height: 60rpx;"
				 @click="getList()">搜索</text>
			</view>
			<view class="" v-if="userInfo.length==0" style="padding: 200rpx 0;text-align: center;color: #DBDBDB;">
				请输入项目名称进行搜索~
			</view>
			<view class="uni-title" v-if="userInfo.length>0" v-for="(item,index) in userInfo" :key="index">
				<evan-radio v-preventReClick @change="changeRadio(index,item)" v-model="isIndex" :label="item.id"></evan-radio>
				<view class="" style="margin-left: 20rpx;" @click="goDetails(item)">
					{{item.packageName}}
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
	export default {
		data() {
			return {
				next: false,
				setNav: {
					'navTitle': '体检套餐',
					'isdisPlayNavTitle': true,
				},
				packageName: '',
				userInfo: [],
				isIndex: 0,
				userList: {}
			}
		},
		onLoad(options) {
			if (options.item) {
				this.userList = JSON.parse(options.item)
				this.isIndex = options.id;
			}
		},
		onShow() {
			// this.getList()
		},
		methods: {
			getList() {
				this.$refs.loading.open()
				const data = {
					packageName: this.packageName ? this.packageName : ''
				}
				appointment.getListPackage(data).then(res => {
					this.$refs.loading.close()
					this.userInfo = res.data
				}).catch(err => {
					this.$refs.loading.close()
					console.log(err)
				})
			},
			changeRadio(index, item) {
				this.$refs.loading.open()
				if (item) {
					this.userList.packageId = item.packageId
					this.userList.packageName = item.packageName
					uni.reLaunch({
						url: `./index?item=${JSON.stringify(this.userList)}&id=${item.id}`
					});
				}
			},
			goDetails(item) {
				uni.navigateTo({
					url: `./detailsList?item=${JSON.stringify(this.userList)}&packageId=${item.packageId}&id=${item.id}`
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
		display: flex;
		align-items: center;
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
		margin: 20rpx 0;
		color: #FFFFFF;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.uni-detailed-boxList {
		padding: 10rpx 0;
	}
</style>
