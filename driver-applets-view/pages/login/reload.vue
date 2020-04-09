<template>
	<view class="reload-body">
		<image class="banner-reload" :src="reloadImg" alt='' />
		<view class="banner-word">
			<h1>登录须知:</h1>
			智能调度司机端小程序<br>
			为司机专用小程序，请确保拥有司机账号</br>
			，祝你使用愉快
		</view>
		<button @click="pageToLogin">立即登录</button>
	</view>
</template>

<script>
	import reloadImg from '@/static/reload.png';
	export default {
		data(){
			return{
				reloadImg: ''
			}
		},
		methods: {
			pageToLogin(){
				uni.reLaunch({
					url: '/pages/login/index'
				});
			}
		},
		onShow() {
			this.reloadImg = reloadImg
		}
	}
</script>

<style lang="scss" scoped>
	.reload-body{
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.banner-reload{
		height:100vh;
		width: 100%;
	}
	.banner-word{
		position: absolute;
		width: 700upx;
		top: 100upx;
		color: #fff;
		text-align: left;
	}
	button{
		position: absolute;
		bottom: 100upx;
		height: 100upx;
		width: 700upx;
		color: #fff;
		background-color: #29B6F6;
	}
</style>
