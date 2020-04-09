<template>
	<view class="uni-tag">
		<i :class="['iconfont',list[textword]]">&#xe62f;</i>
		<view class="textword">{{textword}}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list:{
				'承':'uni-blue',
				'牵':'uni-orange',
				'挂':'uni-blue',
				'驾':'uni-green',
				'押':'uni-orange',
				'时':'uni-lightGreen',
				'委':'uni-lightGreen',
				'装': 'uni-blue',
				'卸': 'uni-orange',
				'运': 'uni-green',
				'货': 'uni-lightGreen',
				'重': 'uni-blue',
				'体': 'uni-orange',
				'下': 'uni-green'
			}
		}
	},
	props: ['textword']
}
</script>

<style lang="scss" scoped>
.uni-tag {
	position: relative;
	height: 40upx;
	width: 40upx;
	display: flex;
	justify-content: center;
	align-item: center;
	margin-right: 10upx;
}
.uni-blue {
	font-size: 45upx;
	color: #3492FD;
}
.uni-orange {
	font-size: 45upx;
	color: #FF9400;
}
.uni-green {
	font-size: 45upx;
	color: #00C000;
}
.uni-lightGreen{
	font-size: 45upx;
	color: #00CC99;
}
.textword{
	position:absolute;
	top:5upx;
	color: #fff;
	font-size: 20upx;
}
</style>
