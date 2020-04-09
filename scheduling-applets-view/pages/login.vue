<template>
	<view class="content">
		<image class="banner-top" :src="top" alt=''/>
		<view class="login-box">
			<image class="banner-logo" :src="logo" alt='' />
			<view class="input-item input-account">
				<i class="iconfont">&#xe614;</i>
				<input class="uni-input" v-model="value1" placeholder-style="color:#cecece" placeholder="请输入您的用户名" />
			</view>
			<view class="input-item">
				<i class="iconfont">&#xe691;</i>
				<input class="uni-input" @focus="SeeWord" @blur="changValue" v-model="value2" placeholder-style="color:#cecece" :password="iconeye" type="text"
				 placeholder="请输入您的密码" />
			</view>
			<view class="login-button" @tap="login">登 录</view>
		</view>
		<image class="banner-bottom" :src="bottom" alt='' />
		<uni-popup ref="popup" type="center">
			<view class="flex-div">请选择角色</view>
		    <view class="flex-div"><button class='wtf-role' @click="closePopup('装卸管理人员')">装卸管理人员</button></view>
			<view class="flex-div"><button class='cyf-role' @click="closePopup('销售/采购人员')">销售/采购人员</button></view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from "@/components/uni-popup.vue"
import {ClassicModel} from '../models/classic.js';
const classicModel = new ClassicModel();
import {config} from '../config.js';
import top from '../static/image/top.png';
import logo from '../static/image/logo.png';
import bottom from '../static/image/bottom.png';
	export default {
		components:{
			uniPopup
		},
		data() {
			return {
				top: '',
				logo: '',
				bottom: '',
				value1: '',
				value2: '',
				arrLogin: [],
				iconeye: false
			};
		},
		onShow() {
			this.top = top;
			this.logo = logo;
			this.bottom = bottom;
			this.checkUser();
		},
		methods: {
			closePopup(value){
				if(value==='装卸管理人员'){
					this.$store.dispatch('menu_1')
					uni.reLaunch({
						url: '/pages/admin/index'
					});
					this.arrLogin.push('old')
					uni.setStorageSync('userLogin', this.arrLogin);
				}
				if(value==='销售/采购人员'){
					this.$store.dispatch('menu_2')
					uni.reLaunch({
						url: '/pages/wtf/order'
					});
					this.arrLogin.push('new')
					uni.setStorageSync('userLogin', this.arrLogin);
				}
				this.$refs.popup.close()
			},
			SeeWord(){
				this.iconeye = false
			},
			changValue(){
				this.iconeye = true
			},
			checkUser() {
				const arr = uni.getStorageSync('userPassword');
				const arr1 = uni.getStorageSync('userLogin');
				if (arr && arr1) {
					this.value1 = arr[0];
					this.value2 = arr[1];
					config.appHeader = arr1[0];
					if(!arr1[4]){
						this.$store.dispatch('menu_3')
						uni.reLaunch({
							url: '/pages/cyf/order'
						});
					}
					if(arr1[4]==='new'){
						this.$store.dispatch('menu_2')
						uni.reLaunch({
							url: '/pages/wtf/order'
						});
					}
					if(arr1[4]==='old'){
						this.$store.dispatch('menu_1')
						uni.reLaunch({
							url: '/pages/admin/index'
						});
					}
				}
			},
			login() {
				// 企业端获取认证token
				const data = {
					account: this.value1,
					password: this.value2,
					isExpireLong: true
				}
				classicModel.verifyToken(data).then(res => {
					if (res.code == '-1') {
						uni.showToast({
							title: '用户名或密码不正确',
							icon: 'none',
							duration: 2000
						});
					} else if (res.code === 1) {
						let mes = res.data;
						this.arrLogin = [res.data.tokenType + res.data.accessToken, res.data.userName, res.data.authority, res.data.expiresIn];
						config.appHeader = this.arrLogin[0];
						uni.setStorageSync('userLogin', this.arrLogin);
						uni.setStorageSync('userPassword', [this.value1, this.value2]);
						if(this.arrLogin[2]==='whp-cyf'){
							this.$store.dispatch('menu_3')
							uni.reLaunch({
								url: '/pages/cyf/order'
							});
						}
						if(this.arrLogin[2]==='whp-wtf'){
							this.$refs.popup.open()
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.cyf-role,.wtf-role{
		color: #fff;
		width:400upx;
		height:80upx;
		font-size:30upx;
		text-align: center;
		line-height:80upx;
		background:#FF6D00;
		border-radius:40upx;
	}
	.cyf-role{
		background:#29B6F6;
	}
	.flex-div{
		text-align: center;
		width: 600upx;
	}
	.content {
		width: 750upx;
	}
	.banner-top{
		width:645upx;
		height:200upx;
	}
	
	.login-box{
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
		width:450upx;
		height:80upx;
		border-radius:40upx;
		background:#29B6F6;
		border:2upx solid #29B6F6;
	}
	
	.banner-logo{
		margin: 0 auto;
		width:255upx;
		height:300upx;
	}
	
	.banner-bottom{
		position:fixed;
		z-index: -1;
		bottom: 0;
		width:750upx;
		height:300upx;
	}
	
	.input-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20upx 30upx;
		margin: 15upx 0;
		width: 480upx;
		height: 80upx;
		color: #cecece;
		.iconfont{
			font-size: 50upx;
			color:#29B6F6;
		}
		.uni-input {
			border-bottom: 1upx solid #29B6F6;
			text-align: center;
			font-size: 26upx;
			color: black;
			width: 400upx;
		}
	}
	.input-account{
		margin-top: 90upx;
	}
</style>
