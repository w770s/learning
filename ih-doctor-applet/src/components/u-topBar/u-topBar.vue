<template>
	<view>
		<view class="header" :style="{'height':titleBarHeight+'px','padding-top':statusBarHeight+'px','background': nav.bg}">
			<view class="iconfont leftArrow header-back weight" :style="{'color':nav.textColor,'top':statusBarHeight-5+'px'}" v-if="nav.isdisPlayNavTitle" @click="back"></view>
			<view class="header-title weight" :style="{'color':nav.textColor,'top':statusBarHeight+10+'px'}">{{nav.navTitle}}</view>
		</view>
		<view class="header-addition" :style="{'height':externalHeight+'px','top':titleBarHeight+'px','padding-top':statusBarHeight+'px','background': nav.bg}"></view>
		<view :style="{'height':additionBarHeight+'px','padding-top':statusBarHeight+'px'}"></view>
	</view>
</template>
<script>
	export default {
		props: {
			"nav": {
				type: Object,
				default: {
					'isdisPlayNavTitle': false,
					'navTitle': '海螺互联网医院'
				}
			},
			"route": {
				type: String,
				default: ''
			},
			"type": {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
				externalHeight: 0,
				additionBarHeight: 0
			}
		},
		created() {
			if(this.nav.externalHeight){
				this.externalHeight = this.nav.externalHeight
			}
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					if (res.model.indexOf('iPhone') !== -1) {
						that.titleBarHeight = 44;
						that.additionBarHeight = 44 + that.externalHeight;
					} else {
						that.titleBarHeight= 48;
						that.additionBarHeight = 48 + that.externalHeight;
					}
					that.statusBarHeight = res.statusBarHeight;
				}
			})
		},
		methods: {
			// 回到上一页
			back() {
				if(this.route&&this.type){
					console.log(this.route);
					uni.redirectTo({
						url: `${this.route}?&type=${this.type}`
					})
					return
				}
				if(this.route&&!this.type){
					console.log(this.route);
					uni.redirectTo({
						url: `${this.route}`
					})
					return
				}
				else{
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 10000;
		left: 0;
		background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.header-addition {
		display: flex;
		align-items: center;
		position: fixed;
		width: 100%;
		z-index: 0;
		left: 0;
		background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.header .header-title {
		color: #fff;
		position: absolute;
		left: 50%;
		/*top: 30px;*/
		font-size: 18px;
		transform: translateX(-50%);
	}

	.header-back {
		position: absolute;
		// left: 12x;
		font-size: 18px;
		padding: 20px 20px 10px 10px;
		/*padding: 10px;*/
		border-radius: 50%;
		color: #fff;
	}
</style>
