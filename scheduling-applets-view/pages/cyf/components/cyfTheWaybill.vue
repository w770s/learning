<template>
	<view class="content">
		<view class="materials-and-time part-line" v-if="list.orderNo&&list.orderStatusValue!=='待发单'||list.waybillNo">
			<view class="materials-image-box">
				<text>{{list.waybillNo?'运单号: ':'订单号: '}}{{ list.waybillNo?list.waybillNo:list.orderNo}}</text>
				<img class="materials-image" @tap="copyText(list.waybillNo?list.waybillNo:list.orderNo)" src="../../../static/image/copyicon.png" />
			</view>
		</view>
		<view class="materials-mes">
			<view class="material-flex">
				<colorful-tag :textword="zhuang" />
				<view class="color-black">{{ list.loadingEnterprise}}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="xie" />
				<view class="color-black">{{ list.unloadingEnterprise}}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="yun" />
				<view class="color-black">{{ list.carrierEnterpriseName}}</view>
			</view>
			<view class="material-flex" v-if="list.driverName">
				<i class="iconfont">&#xe614;</i>
				<view>{{ list.driverName+' '+list.driverPhone }}</view>
			</view>
			<view class="material-flex">
				<i class="iconfont">&#xe730;</i>
				<view>{{ list.productName }}</view>
			</view>
			<view class="material-flex">
				<i class="iconfont">&#xe652;</i>
				<view>{{ list.weightShow }}吨</view>
			</view>
			<!-- 订单下单时间 -->
			<view class="material-flex" v-if='!list.dispatchingTime'>
				<i class="iconfont">&#xe612;</i>
				<view>{{ list.createdTime }}</view>
			</view>
			<!-- 运单派车时间 -->
			<view class="material-flex" v-if='list.dispatchingTime'>
				<i class="iconfont">&#xe612;</i>
				<view>{{ list.dispatchingTime }}</view>
			</view>
			<view class="material-flex" v-if='list.vanCert'>
				<i class="iconfont">&#xe658;</i>
				<view>{{ list.vanCert }}</view>
			</view>
			<!-- 订单状态 -->
			<view v-if="list.orderStatusValue" :class="['material-overdone',orderStatus[list.orderStatusValue]]">
				<text>{{list.orderStatusValue}}</text>
			</view>
			<!-- 运单状态 -->
			<view 
				v-if="list.waybillStatus" 
				:class="['material-overdone',
				waybillStatus[selectWaybillStatus(list.waybillStatus,list.isException)]]">
				<text>{{selectWaybillStatus(list.waybillStatus,list.isException)}}</text>
			</view>
		</view>
		<!-- 订单跳转详情 -->
		<view class="search-details" 
			v-if="list.orderStatusValue" 
			@tap="orderDetails({id:list.id,status:list.orderStatusValue})">
			查看详情
		</view>
		<!-- 运单跳转详情 -->
		<view class="search-details"
			v-if="list.waybillStatus!=='WAYBILL-STATUS-DPC'&&list.waybillStatus" 
			@tap="waybillDetails({id:list.id,status:selectWaybillStatus(list.waybillStatus,list.isException),waybillStatus:list.waybillStatus})">
			查看详情
		</view>
		<!-- 运单待派车状态 -->
		<view 
			class="search-details" 
			v-if="list.waybillStatus==='WAYBILL-STATUS-DPC'&&list.isException===0"
			@tap="waybillDetails({id:list.id,status:selectWaybillStatus(list.waybillStatus,list.isException),waybillStatus:list.waybillStatus})">
			派车
		</view>
	</view>
</template>

<script>
	import colorfulTag from './colorfulTag.vue';
	export default {
		components: {
			colorfulTag
		},
		data() {
			return {
				zhuang: '装',
				xie: '卸',
				yun: '运',
				huo: '货',
				zhong: '重',
				xia: '下',
				orderStatus:{
					'待发单': 'uni-default',
					'待接单': 'uni-default',
					'已接单': 'uni-success',
					'已拒绝': 'uni-error',
					'已取消': 'uni-error'
				},
				waybillStatus:{
					'待派车': 'uni-default',
					'待装货': 'uni-default',
					'待卸货': 'uni-default',
					'待签收': 'uni-default',
					'已完成': 'uni-success',
					'异常': 'uni-error'
				}
			};
		},
		props: ['list'],
		methods: {
			selectWaybillStatus(value,isException,waybillStatus){
				if(isException===1){
					return '异常'
				}
				switch(value){
					case 'WAYBILL-STATUS-DPC':
						return '待派车';
					case 'WAYBILL-STATUS-DZH':
						return '待装货';
					case 'WAYBILL-STATUS-DXH':
						return '待卸货';
					case 'WAYBILL-STATUS-DQS':
						return '待签收';
					case 'WAYBILL-STATUS-YWC':
						return '已完成';
					default:
						return '异常'
				}
			},
			copyText(data) {
				uni.setClipboardData({
					data: data,
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								uni.showToast({
									title: '复制成功'
								})
								console.log(res.data)
							}
						})
					}
				})
			},
			orderDetails(obj) { // 订单跳转详情
				uni.navigateTo({
					url: `orderDetail?id=${obj.id}&status=${obj.status}`
				})
			},
			waybillDetails(obj) { // 运单跳转详情
				uni.navigateTo({
					url: `waybillDetail?id=${obj.id}&status=${obj.status}&waybillStatus=${obj.waybillStatus}`
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	.content {
		margin-bottom: 30upx;
		padding: 0upx 35upx 30upx 35upx;
		box-sizing: border-box;
		border-radius: 16upx;
		text-align: left;
		background-color: #fff;
		color: #7f8389;
		font-size: 24upx;
	}

	.part-line {
		position: relative;
		padding: 10upx 0upx;
		border-bottom: 1upx solid #eeeeee;
	}

	.materials-mes {
		position: relative;
		padding: 20upx 0upx 10upx 0upx;
		border-bottom: 1upx solid #eeeeee;
	}

	.materials-and-time {
		height: 50upx;
		display: flex;
		justify-content: space-between;
	}

	.materials-image-box {
		color: #212121;
		height: 50upx;
		font-size: 24upx;
		display: flex;
		align-items: center;
	}

	.materials-image {
		width: 26upx;
		height: 26upx;
		margin-left: 25upx;
	}

	.materials-details {
		text-align: center;
		line-height: 56upx;
		padding: 0upx 55upx;
		border-radius: 28upx;
		border: solid 1upx #eeeeee;
	}

	.material-flex {
		display: flex;
		font-size: 30upx;
		margin-bottom: 20upx;
		color:#757575;
		.iconfont{
			line-height:45upx; 
			margin-left: 5upx;
			margin-right: 10upx;
			color: #29B6F6;
		}
		.color-black{
			color:#212121;
		}
	}

	.material-overdone {
		position: absolute;
		bottom: 40upx;
		right: 10upx;
		width: 172upx;
		height: 172upx;
		border-radius: 50%;
		font-size: 34upx;
		text-align: center;
		line-height: 172upx;
		font-weight: 400;
	}
	
	.uni-default{
		border: solid 10upx rgba(41, 182, 246, 0.16);
		color: #29B6F6;
	}
	
	.uni-success{
		border: solid 10upx rgba(19, 206, 102, 0.16);
		color: #13CE66;
	}
	
	.uni-error{
		border: solid 10upx rgba(224, 32, 32, 0.16);
		color: #E02020;
	}

	.search-details {
		position: relative;
		font-size: 26upx;
		margin-top: 30upx;
		width:100%;
		color: #fff;
		text-align: center;
		font-weight: bold;
		line-height: 80upx;
		background: #29B6F6;
		border-radius: 10upx;
	}
	
	.order-operate {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding-top: 30upx;
	}

	.order-dispacth {
		font-size: 26upx;
		width: 100%;
		line-height: 80upx;
		text-align: center;
		font-weight: bold;
		color: #fff;
		border-radius: 10upx;
		background: rgba(59, 149, 250, 1);
	}
</style>
