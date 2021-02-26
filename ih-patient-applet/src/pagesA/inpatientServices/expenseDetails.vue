<template>
	<view class="uni-content">
		<u-bar :nav="setNav" />
		<view class="uni-monetary">
			<view class="uni-monetary-box">
				<view class="uni-monetary-title">{{getnum(projectFee/100)}}</view>
				<view>医药费总额/元</view>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-detailed">
				<view class="uni-detailed-list">
					<view>名称</view>
					<view>规格</view>
					<view>单价/元</view>
					<view>数量</view>
					<view>总金额/元</view>
				</view>
			</view>
			<view class="uni-detailed-content uni-detailed-line" v-for="(items,indexs) in dailyList" :key="index">
				<view class="uni-detailed-list">
					<view>{{items.detailName}}</view>
					<view>{{items.detailUnit}}</view>
					<view>{{getnum(items.detailPrice/100)}}</view>
					<view>{{items.detailCount}}</view>
					<view>{{getnum(items.detailFee/100)}}</view>
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
					'navTitle': '费用明细'
				},
				userInfo: {},
				projectFee: '',
				dailyList: []
			};
		},
		onLoad(options) {
			this.userInfo = JSON.parse(options.userInfo)
			this.projectFee = options.projectFee
		},
		onShow(){
			this.$refs.loading.open();
			this.detailsList(this.userInfo)
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
			detailsList(data){
				inpatientService.costDetails(data).then(res=>{
					this.$refs.loading.close();
					this.dailyList = res.data.data
				}).catch(err=>{
					this.$refs.loading.close();
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
	.uni-monetary-box{
		height: 220rpx;
		font-size: 30rpx;
		text-align: center;
		color: #FFFFFF;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		.uni-monetary-title{
			font-size: 60rpx;
			font-weight: 600;
		}
	}
	.uni-list{
		background: #FFFFFF;
		position: relative;
		top: -50rpx;
		border-radius: 20rpx 20rpx 0 0;
		.uni-detailed{
			background: #79A8F8;
			color: #333333;
			border-radius: 20rpx 20rpx 0 0;
		}
		.uni-detailed-list{
			margin: 0 20rpx;
			padding: 30rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
			view{
				word-break:break-all;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 20%;
				text-align: center;
			}
		}
		.uni-detailed-line:nth-child(even){
			background: #FFFFFF;
		}
		.uni-detailed-line:nth-child(odd){
			background: #F5F9FF;
		}
	}
</style>
