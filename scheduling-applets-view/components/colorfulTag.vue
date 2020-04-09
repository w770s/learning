<template>
	<view v-bind:class="['uni-tag',list[textword]]">{{ textword }}</view>
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
	height: 40upx;
	width: 40upx;
	display: flex;
	justify-content: center;
	align-item: center;
	border-radius: 5upx;
	margin-right: 10upx;
	font-size: 26upx;
	color: #fff;
}
.uni-blue {
	border-radius: 50%;
	background-color: #3492FD;
}
.uni-orange {
	border-radius: 50%;
	background-color: #FF9400;
}
.uni-green {
	border-radius: 50%;
	background-color: #00C000;
}
.uni-lightGreen{
	border-radius: 50%;
	background-color: #00CC99;
}
</style>
