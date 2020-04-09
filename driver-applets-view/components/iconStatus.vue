<template>
	<view>
		<view class="icon-center"><img :src="iconkinds[iconStatus].imgUrl" /></view>
		<view class="icon-stautsMes">{{ iconkinds[iconStatus].mes }}</view>
		<view class="icon-reason" v-if='iconkinds[iconStatus].reason'>{{ iconkinds[iconStatus].reason }}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			iconkinds: [
				{
					imgUrl: require('../static/时钟.png'),
					mes: '确认入场中......'
				},
				{
					imgUrl: require('../static/对.png'),
					mes: '确认成功，请进场装卸货'
				},
				{
					imgUrl: require('../static/错.png'),
					mes: '确认失败，请进停车场等待'
				},
				{
					imgUrl: require('../static/时钟.png'),
					mes: '停车场审核中'
				},
				{
					imgUrl: require('../static/对.png'),
					mes: '停车场审核通过'
				},
				{
					imgUrl: require('../static/时钟.png'),
					mes: '取消预约停车审核中'
				},
				{
					imgUrl: require('../static/对.png'),
					mes: '已取消预约停车场'
				},
				{
					imgUrl: require('../static/错.png'),
					mes: '取消预约停车场失败',
					reason: '失败原因：已经进入停车场'
				},
				{
					imgUrl: require('../static/错.png'),
					mes: '停车场审核不通过',
					reason: '不通过原因：暂无空闲停车位'
				},
				{
					imgUrl: require('../static/u2048.png'),
					mes: '入场通知'
				},
				{
					imgUrl: require('../static/对.png'),
					mes: '确认成功，请进场装货'
				}
			]
		};
	},
	props: ['iconStatus'],
	methods: {}
};
</script>

<style lang="scss">
.icon-center {
	display: flex;
	justify-content: center;
	align-items: center;
	img {
		width: 120upx;
		height: 120upx;
	}
}
.icon-stautsMes {
	padding:30upx 0;
	color: #7f8389;
	font-size: 24upx;
	text-align: center;
}
.icon-reason{
	color:#A1A1A1;
	font-size:24upx;
	padding-bottom:30upx;
	margin-top:-20upx;
	text-align: center;
}
</style>
