<template>
	<view>
		<view class="header" :style="{'height':titleBarHeight,'padding-top':statusBarHeight,'background': nav.bg}">
			<text class="iconfont leftArrow header-back" v-if="nav.isdisPlayNavTitle" @click="back"></text>
			<view class="header-title">{{nav.navTitle}}</view>
		</view>
		<view :style="{'height':titleBarHeight,'padding-top':statusBarHeight}"></view>
	</view>
</template>
<script>
	export default {
		props: {
			"nav": {
				type: Object,
				default: {
					'isdisPlayNavTitle': false,
					'navTitle': '安徽医科大学附属海螺医院'
				}
			},
			"goLoginPage": {
				type: Boolean,
				default: false
			},
			"goHomePage": {
				type: Boolean,
				default: false
			},
			"goTwoPage": {
				type: Boolean,
				default: false
			},
			"route": {
				type: String,
				default: ''
			}
		},
		// props:["nav"],
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
			}
		},
		created() {
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					if (res.model.indexOf('iPhone') !== -1) {
						that.titleBarHeight = 44 + 'px';
					} else {
						that.titleBarHeight = 48 + 'px';
					}
					that.statusBarHeight = res.statusBarHeight + 'px'
				},

			})
		},
		methods: {
			// 回到上一页
			back() {
				if(this.goLoginPage){
					uni.switchTab({
						url: '/pages/login/index'
					})
				}else if(this.goHomePage){
					uni.switchTab({
						url: '/pages/login/home'
					})
				}else if(this.goTwoPage){
					uni.navigateBack({
						delta: 2
					})
				}else if(this.route){
					uni.navigateTo({
						url: this.route
					})
				}else{
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style>
	.header {
		display: flex;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 100;
		left: 0;
		background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.header .header-title {
		display: inline-block;
		white-space: nowrap;
		width: 360rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		color: #fff;
		text-align: center;
		position: absolute;
		left: 50%;
		font-size: 36upx;
		transform: translateX(-50%);
	}

	.header-back {
		position: absolute;
		font-size: 18px;
		padding: 30upx 20upx 20upx 40upx;
		border-radius: 50%;
		color: #fff;
	}
</style>
