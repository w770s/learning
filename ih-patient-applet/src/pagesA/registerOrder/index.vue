<template>
	<view>
		<u-bar :nav="setNav" :goLoginPage="true" />
		<view v-if="showRegisterOrder" class='no-recent'>
			<img src="http://file.aihuihc.com/patient/patientImages/images/subscribe.png" class='no-recent-image' />
			<text class='no-recent-text'>暂无预约挂号订单哦~</text>
			<button class="uni-button-box" @tap="goForRegister">预约挂号</button>
		</view>
		<view style="padding-bottom: 10rpx;">
			<view v-if="registerOrder.length > 0" @tap="goForDetail(item.id)" class="orderMessage" v-for="(item,index) in registerOrder" :key="index">
				<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png" />
				<view class="uni-orderList">
					<view class="uni-orderList-top" style="font-size: 30rpx;">
						<view><text style="font-weight: 600;margin-right:20rpx;">{{item.name}}</text><text>{{item.doctorLevel?'('+item.doctorLevel+')':''}}</text></view>
						<view>{{ famtterStatus(item.payStatus) }}</view>
					</view>
					<view class="uni-orderList-top" style="font-size: 24rpx;">
						<view>{{item.departName}}</view>
						<view style="font-size: 30rpx; font-weight: 600;">{{item.regFee/100+'元'}}</view>
					</view>
					<view class="uni-orderList-tops" style="font-size: 24rpx;">
						<view style="color: #989898FF;margin-right: 20rpx;">就诊人<text class="uni-patientName">{{item.patientName}}</text></view>
						<view class="uni-seeDoctoeTime">{{item.clinicTime?item.clinicTime:'---'}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	let app = getApp()
	import {consultingModel} from '@/models/consulting.js'
	const consulting = new consultingModel()
	export default {
		data() {
			return {
				showRegisterOrder: false,
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '预约挂号订单'
				},
				registerOrder: []
			}
		},
		onShow(){
			this.showRegisterOrder = false
			this.$refs.loading.open();
			this.listRegisterOrder()
		},
		methods: {
			goForRegister(){
				uni.navigateTo({
					url: '/pagesA/bookRegister/index'
				})
			},
			goForDetail(id){
				uni.navigateTo({
					url: `./orderDetails?id=${id}`
				})
			},
			listRegisterOrder(){
				const data = {
					userId : uni.getStorageSync('userInfo').userId
				}
				consulting.listRegisterOrder(data).then(res=>{
					let cacheData = uni.getStorageSync('registerOrder')
					if(cacheData){
						this.registerOrder = cacheData
					}
					this.registerOrder = []
					this.registerOrder = res.data
					if(this.registerOrder.length === 0){
						this.showRegisterOrder = true
					}
					this.$refs.loading.close();
					uni.setStorageSync('registerOrder',res.data)
				}).catch(err=>{
					this.$refs.loading.close();
					this.showRegisterOrder = true
					console.log(err)
				})
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
						return '已退款';
				}
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
		height: 360rpx;
		width: 360rpx;
		margin-top: 160rpx;
		margin-bottom: 100rpx;

	}
	.no-recent-text {
		width: 100%;
		font-size:40rpx;
		color:#333333;
		text-align: center;
	}
	.uni-button-box {
		width:360rpx;
		height:70rpx;
		background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
		border-radius:8rpx;
		line-height: 70rpx;
		color: #ffffff;
		font-size:32rpx;
		margin-top:30rpx;
	}
	.orderMessage {
		margin: 20rpx 24rpx;
		padding: 30rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0rpx 0rpx 20rpx 4rpx #3B7CF415;
		display: flex;
		justify-content: space-between;
		img{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		.uni-orderList {
			flex: 1;
			line-height: 50rpx;
			.uni-orderList-top {
				display: flex;
				justify-content: space-between;
				color: #3E3E3EFF;
				font-size: 30rpx;
			}

			.uni-orderList-tops {
				display: flex;
				color: #3E3E3EFF;
				font-size: 30rpx;
				.uni-patientName {
					padding-left: 20rpx;
					color: #3E3E3EFF;
				}
			}
		}
	}
</style>

