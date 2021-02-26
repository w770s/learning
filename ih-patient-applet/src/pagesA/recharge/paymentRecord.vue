<template>
	<view class="uni-content">
		<u-bar :nav="setNav" />
		<view class="uni-list">
			<view class="uni-list-price">
				<view class="uni-price-text">{{getnum(dailyList.totalFee/100)}}</view>
				<view class="uni-price-title">预交金总金额/元</view>
			</view>
			<view class="uni-list-box" v-for="(item,index) in dailyList.prepayList" :key="index">
				<view class="uni-list-detailed">
					<img class="uni-left-img uni-list-img" src="http://file.aihuihc.com/patient/patientImages/images/paymentRecord.png" mode=""></img>
					<view class="uni-left-title uni-list-title">
						<view>预交金缴纳</view>
						<view class="uni-left-time">{{item.payTime}}</view>
					</view>
				</view>
				<view class="uni-right-title uni-list-title">{{item.payFee?getnum(item.payFee/100):0}}元</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		prepayModel
	} from '@/models/recharge.js'
	const prepay = new prepayModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '预交金缴费记录'
				},
				userInfo: {},
				dailyList: {}
			}
		},
		onLoad(options) {
			this.userInfo = options
		},
		onShow(){
			this.prepayList(this.userInfo)
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
							console.log(val)
							return val
						}
					}
				}
			},
			prepayList(data){
				prepay.listPrepayRecords(data).then(res=>{
					this.dailyList = res.data.data
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
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
			display: flex;
			align-items: center;
			justify-content: space-between;
			.uni-list-detailed{
				display: flex;
				align-items: center;
			}
			.uni-list-img{
				border-radius: 50%;
			}
			.uni-left-img{
				width: 72rpx;
				height: 72rpx;
			}
			.uni-list-title{
				font-size: 30rpx;
			}
			.uni-left-title{
				color: #333333;
				padding-left: 20rpx;
				.uni-left-time{
					font-size: 26rpx;
					color: #B2B2B2;
				}
			}
			.uni-right-title{
				color: #FF745F;
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
