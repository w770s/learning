<template>
	<view class="content">
		<view class="materials-and-time part-line">
			<view class="materials-image-box">
				<img class="materials-image" src="../../../static/image/时间.png" />
				<text>{{ data.unloadingPeriod }}</text>
			</view>
			<view class="materials-details">{{ data.productName?data.productName:'系统未录入' }}</view>
		</view>
		<view class="part-line materials-mes">
			<view class="material-flex">
				<colorful-tag :textword="chen" />
				<view>{{ data.carrierEnterpriseName?data.carrierEnterpriseName:'系统未录入' }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="qian" />
				<view>{{ data.vanCert?data.vanCert:'系统未录入' }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="guai" />
				<view>{{ data.truckCert?data.truckCert:'系统未录入' }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="jia" />
				<view>{{ data.driverName?data.driverName:'系统未录入' + ' ' + data.driverPhone?data.driverPhone:'系统未录入' }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="ya" />
				<view>{{ data.driverName2?data.driverName2:'系统未录入' + ' ' + data.driverPhone2?data.driverPhone2:'系统未录入' }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="time" />
				<view>{{data.updateTime?data.updateTime:'系统未录入'}}</view>
			</view>
			<view class="material-overdone">已完成</view>
		</view>
	</view>
</template>

<script>
import colorfulTag from '../../../components/colorfulTag.vue';
export default {
	data() {
		return {
			chen: '承',
			qian: '牵',
			guai: '挂',
			jia: '驾',
			ya: '押',
			time: '时'
		};
	},
	props: ['data'],
	components: {
		colorfulTag
	}
};
</script>

<style lang="scss">
.content {
	box-sizing: border-box;
	padding: 0upx 35upx;
	width: 100%;
	box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
	border-radius: 16upx;
	text-align: left;
	background-color: #fff;
	margin-bottom: 30upx;
	color: #7f8389;
	font-size: 28upx;
}
.part-line {
	position: relative;
	padding: 20upx 0upx;
	border-bottom: 1upx solid #eeeeee;
}
.materials-mes{
	border-bottom:none;
}
.materials-and-time {
	height: 56upx;
	display: flex;
	justify-content: space-between;
}
.materials-image-box {
	height: 56upx;
	display: flex;
	align-items: center;
	font-size: 28upx;
}
.materials-image {
	width: 32upx;
	height: 32upx;
	margin-right: 15upx;
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
	margin-bottom: 20upx;
}
.material-overdone {
	position: absolute;
	bottom: 40upx;
	right: 10upx;
	width: 172upx;
	height: 172upx;
	border: solid 10upx #18be18;
	opacity: 0.16;
	border-radius: 50%;
	font-size: 34upx;
	text-align: center;
	line-height: 172upx;
	color: #18be18;
}
</style>
