<template>
	<view class="content">
		<view class="banner-top"></view>
		<view class="login-box">
			<image class="banner-logo" :src="logo" alt='' />
			<view class="input-item input-account">
				<i class="iconfont">&#xe614;</i>
				<input class="uni-input" type="number" v-model="value1" @input="valueNeed" placeholder-style="color:#cecece" placeholder="请输入您的手机号码" />
				<view class="view-vertify" @tap="sendVerify" :class="{ 'send-verify': blackcolor }">{{ codeMsg }}</view>
			</view>
			<view class="input-item">
				<i class="iconfont">&#xe691;</i>
				<input class="uni-input" type="number" v-model="value2" placeholder-style="color:#cecece"
				 placeholder="请输入验证码" />
			</view>
			<view class="login-button" @tap="login">登 录</view>
		</view>
		<image class="banner-bottom" :src="bottom" alt='' />
	</view>
</template>

<script>
import logo from '@/static/image/logo.png';
import bottom from '@/static/image/bottom.png';
import { ClassicModel } from '@/models/classic.js';
import { mapState, mapMutations, mapActions } from 'vuex';
import { config } from '@/config.js';
const classicModel = new ClassicModel();
export default {
	data() {
		return {
			logo: '',
			bottom: '',
			value1: '',
			value2: '',
			blackcolor: false,
			timer: false,
			codeMsg: '获取验证码',
			countdown: 60,
			clickNum: 0
		};
	},
	onShow() {
		this.logo = logo;
		this.bottom = bottom;
		this.doFirst();
	},
	methods: {
		// 获取缓存账号
		doFirst() {
			const arr = uni.getStorageSync('userPassword');
			const arr1 = uni.getStorageSync('userLogin');
			if (arr && arr1) {
				this.value1 = arr[0];
				this.value2 = arr[1];
				config.appHeader = arr1[0];
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		// 验证码60秒倒计时
		getCode() {
			if (this.timer) {
				const timer = setInterval(() => {
					if (this.countdown > 0 && this.countdown <= 60) {
						this.countdown--;
						this.blackcolor = false;
						this.codeMsg = '重新发送(' + this.countdown + ')';
					}
					if(this.countdown === 0){
						clearInterval(timer);
						this.clickNum = 0;
						this.countdown = 60;
						this.timer = false;
						this.codeMsg = '获取验证码';
						this.blackcolor = true;
					}
				}, 1000);
			}
		},
		sendVerify() {
			// 发送验证码
			this.timer = true;
			this.clickNum++;
			if (this.clickNum > 1) {
				return;
			}
			if (this.blackcolor) {
				if (this.codeMsg !== '获取验证码') {
					return;
				}
				classicModel.verify(this.value1).then(res => {
					if (res.code === -1) {
						uni.showToast({ title: res.msg, icon: 'none' });
						// this.blackcolor = false;
						this.clickNum = 0;
						return;
					}
					this.getCode();
				});
			}
		},
		valueNeed() {
			// 用户名value
			if (this.value1 && this.codeMsg === '获取验证码') {
				this.blackcolor = true;
			} else {
				this.blackcolor = false;
			}
		},
		login() {
			//登 录
			classicModel.verifyToken(this.value1, this.value2).then(res => {
				if (res.code == '-1') {
					uni.showToast({
						title: '验证码输入有误',
						icon: 'none',
						duration: 2000
					});
					return;
				} else if (res.code == '666') {
					uni.showToast({
						title: '用户账号已过期，请重新登录',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				// 缓存存储用户信息
				else {
					let arr = [res.data.tokenType + res.data.accessToken, res.data.userName, res.data.authority, res.data.expiresIn];
					uni.setStorageSync('userLogin', arr);
					let arr1 = uni.getStorageSync('userLogin') || [];
					config.appHeader = arr1[0];
					uni.setStorageSync('userPassword', [this.value1, this.value2]);
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.content {
		width: 750upx;
	}
	
	.login-box {
		display: flex;
		flex: wrap;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	
	.login-button {
		position: relative;
		margin-top: 80upx;
		line-height: 80upx;
		text-align: center;
		font-size: 30upx;
		color: #fff;
		width: 450upx;
		height: 80upx;
		border-radius: 40upx;
		background: #29B6F6;
		border: 2upx solid #29B6F6;
	}
	
	.banner-top {
		height: 200upx;
	}
	
	.banner-logo {
		margin: 0 auto;
		width: 255upx;
		height: 300upx;
	}
	
	.banner-bottom {
		position: fixed;
		z-index: -1;
		bottom: 0;
		width: 750upx;
		height: 300upx;
	}
	
	.input-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20upx 30upx;
		padding-right: 0;
		margin: 15upx 0;
		width: 550upx;
		height: 80upx;
		color: #cecece;
		position: relative;
		.view-vertify{
			line-height: 50upx;
			height: 50upx;
			padding: 0 20upx;
			display: block;
			font-size: 26upx;
			position: absolute;
			z-index: 100;
			right: 0;
		}
	
		.iconfont {
			font-size: 50upx;
			color: #29B6F6;
		}
	
		.uni-input {
			border-bottom: 1upx solid #29B6F6;
			text-align: left;
			font-size: 26upx;
			color: black;
			width: 450upx;
		}
	}
	
	.input-account {
		margin-top: 90upx;
	}
	
	.send-verify {
		color: black;
	}
</style>
