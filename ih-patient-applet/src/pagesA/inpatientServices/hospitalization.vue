<template>
	<view class="uni-content">
		<u-bar :nav="setNav" :goHomePage="true" />
		<view class="uni-list">
			<view class="uni-list-price">
				<view class="uni-price-text">{{getnum(dailyList.totalFee/100)}}</view>
				<view class="uni-price-title">总费用/元</view>
			</view>
			<view class="uni-list-box" v-for="(item,index) in dailyList.projects" @click="goDetails(item)" :key="index">
				<view class="uni-list-detailed">
					<img class="uni-left-img uni-list-img" src="http://file.aihuihc.com/patient/patientImages/images/hospitalization.png" mode=""></img>
					<view class="uni-left-title uni-list-title">{{item.projectName}}</view>
				</view>
				<view class="uni-right-detailed">
					<view>￥{{getnum(item.projectFee/100)}}</view>
					<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png"></img>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		serviceModel
	} from '@/models/inpatientServices.js'
	const inpatientService = new serviceModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '住院费用'
				},
				userInfo: {},
				dailyList: {}
			};
		},
		onLoad(options) {
			this.userInfo = options
		},
		onShow(){
			this.$refs.loading.open();
			this.totalCostList(this.userInfo)
		},
		methods: {
			getnum(val){
				if(val){
					if (parseInt(val) == parseFloat(val)){
						return val+'.00'
					}else{
						var num = String(val).indexOf(".")+1;//获取小数点的位置
						var count = String(val).length - num;//获取小数点后的个数
						if(count==1){
							return val+'0'
						}else{
							return val
						}
					}
				}
			},
			totalCostList(data){
				inpatientService.seriviceTotalCost(data).then(res=>{
					this.$refs.loading.close();
					this.dailyList = res.data.totalCostRepData
				}).catch(err=>{
					this.$refs.loading.close();
				})
			},
			goDetails(item){
				const data = {
					hospitalId: this.userInfo.hospitalId,
					inpatientId: this.userInfo.inpatientId,
					projectTypeCode: item.projectTypeCode
				}
				wx.navigateTo({
					url:'./expenseDetails?userInfo='+ JSON.stringify(data) + '&projectFee=' + item.projectFee
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-right-detailed{
		display: flex;
		align-items: center;
		img{
			width: 20rpx;
			height: 38rpx;
		}
		view{
			font-size: 36rpx;
			font-weight: 600;
			color: #333333;
			padding-right: 20rpx;
		}
	}
	.uni-content{
		height: 100vh;
		background: #FFFFFF;
	}
	.uni-list{
		background: #FFFFFF;
		.uni-list-price{
			margin: 40rpx 0 20rpx 0;
			text-align: center;
			.uni-price-text{
				font-size: 60rpx;
				font-weight: 600;
				color: #2884FF;
			}
			.uni-price-title{
				font-size: 30rpx;
				color: #B2B2B2;
			}
		}
		.uni-list-box{
			margin: 0 24rpx;
			border-bottom: 2rpx solid #E5E5E5;
			height: 152rpx;
			line-height: 152rpx;
			display: flex;
			justify-content: space-between;
			.uni-list-detailed{
				display: flex;
				.uni-list-img{
					position: relative;
					border-radius: 50%;
				}
				.uni-left-img{
					width: 72rpx;
					height: 72rpx;
					top: 40rpx;
				}
				.uni-right-img{
					width: 30rpx;
					height: 30rpx;
					top: 60rpx;
				}
				.uni-left-title{
					color: #333333;
					padding-left: 20rpx;
				}
			}
			.uni-list-title{
				font-size: 30rpx;
			}
			.uni-right-title{
				color: #FF745F;
				padding-right: 20rpx;
			}
			.uni-detailed{
				background: #79A8F8;
				color: #333333;
			}
			.uni-detailed-list{
				margin: 0 20rpx;
				display: flex;
				justify-content: space-between;
				height: 84rpx;
				line-height: 84rpx;
				font-size: 30rpx;
			}
			.uni-detailed-line:nth-child(even){
				background: #FFFFFF;
			}
			.uni-detailed-line:nth-child(odd){
				background: #F5F9FF;
			}
			.uni-cutUp{
				margin: 0 20rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 24rpx;
				text-align: center;
				background: #2884FF;
				color: #FFFFFF;
			}
		}
	}
</style>
