<template>
	<view class="personal">
		<img class="personal-img" src="http://file.aihuihc.com/ih-doctor-applet/image/login/login-banner.png"></img>

		<!-- 显示登陆信息部分 -->
		<view class="personal-flex-box">
			<view><img @tap="getLogin" :src="!isLogin?'':userUrl" /></view>
			<view class="personal-login-status">
				<view class="personal-login-name">{{!isLogin?'未登录':userList.name}}</view>
				<view class="personal-login-title" v-if="!isLogin">登录查看个人信息...</view>
				<view class="personal-login-title" v-if="isLogin">
					<text class="personal-login-level">{{userList.level}}</text>
					<text class="personal-login-departName">{{userList.departName}}</text>
				</view>
			</view>
		</view>

		<!-- 显示数据部分 -->
		<view class="favorable-comments">
			<view>
				<text>{{!isLogin?'0':'99%'}}</text>
				<view>综合好评</view>
			</view>
			<view>
				<text>{{!isLogin?'0':'42'}}</text>
				<view>咨询量</view>
			</view>
		</view>

		<!-- 分割线 -->
		<view class="dividing-line"></view>

		<!-- 显示功能部分 -->
		<view class="uni-content-box">
			<view class="userList-details" v-for="(item,index) in selectOption" :key="index" @tap="selectOptions(item.itemName)">
				<img class="img-title" :src="item.itemImg"></img>
				<view class="userList-detailsText">
					<view>{{item.itemName}}</view>
					<view class="doctorIntroduce-titleText"><img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png"></img></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {loginModel} from '@/models/login.js'
	import {createIMClient} from "../../util/util";
	const login = new loginModel()
	const app = getApp()
	export default {
		data() {
			return {
				userList: {},
				userUrl: '',
				isLogin: false,
				doctorImage: require('../../image/doctorImage.png'),
				selectOption:[
					{
						itemImg:'http://file.aihuihc.com/ih-doctor-applet/image/home/personalInformation.png',
						itemName: '个人信息'
					},
					{
						itemImg:'http://file.aihuihc.com/ih-doctor-applet/image/home/myOrder.png',
						itemName: '我的订单'
					},
					{
						itemImg:'http://file.aihuihc.com/ih-doctor-applet/image/home/prescribe.png',
						itemName: '我的处方'
					},
					{
						itemImg:'http://file.aihuihc.com/ih-doctor-applet/image/home/prescribe.png',
						itemName: '我的检查'
					},
					{
						itemImg:'http://file.aihuihc.com/ih-doctor-applet/image/home/prescribe.png',
						itemName: '我的检验'
					},
					{
						itemImg:'http://file.aihuihc.com/ih-doctor-applet/image/home/accountSettings.png',
						itemName: '账号设置'
					}
				]
			}
		},
		onShow() {
			if(wx.getStorageSync('phone')){
				this.getDoctorByPhone()
			}else{
				this.isLogin = false
			}
		},
		methods: {
			getDoctorByPhone(){
				let that = this
				const data = {
					phone: wx.getStorageSync('phone')
				}
				login.getDoctorByPhone(data).then(res=>{
					this.isLogin = true
					that.userList = res.data
					createIMClient(res.data.hisDoctorId)
					uni.setStorageSync('imList',res.data.doctorIms)
					wx.setStorageSync('doctorId',res.data.hisDoctorId)
					let url = that.userList.doctorImageList.filter(item => {
						return item.imageType === 1
					})
					if(url.length !== 0){
						that.userUrl = url[0].url
					}else{
						that.userUrl = this.doctorImage
					}
				}).catch(err=>{
					this.isLogin = false
					wx.clearStorage()
				})
			},
			selectOptions(name) {
				// 暂时注释
				if(!this.isLogin){
					wx.showModal({
						title: '请先登录哦~',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/guide'
								})
							} else if (res.cancel) {
								// 用户点击取消
							}
						}
					});
					return
				}
				// todo 有授权登录后执行
				switch (name) {
					case '个人信息':
						return uni.navigateTo({
							url: '/pagesA/personalInformation/index'
						})
					case '我的订单':
						return uni.navigateTo({
							url: '/pagesA/myOrder/index'
						})
					case '我的处方':
						return uni.navigateTo({
							url: `/pagesA/myPrescription/index?type=1`
						})
					case '我的检查':
						return uni.navigateTo({
							url: `/pagesA/myPrescription/index?type=2`
						})
					case '我的检验':
						return uni.navigateTo({
							url: `/pagesA/myPrescription/index?type=3`
						})
					case '账号设置':
						return uni.navigateTo({
							url: '/pagesA/accountSettings/index'
						})
				}
			},
			getLogin(){
				if(!this.isLogin){
					uni.navigateTo({
						url: '/pages/login/guide'
					})
					return
				}else{
					wx.navigateTo({
						url: '/pagesA/personalInformation/upDatePersonalInformation?doctorDetails=' + JSON.stringify(this.userList)
					})
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	.personal {
		height: 100vh;
		background: #FFFFFF;
		.personal-img {
			width: 100%;
			height: 514rpx;
		}
	}
	.personal-flex-box {
		width: 100%;
		text-align: center;
		position: absolute;
		z-index: 1;
		top: 54px;
		color: #FFFFFF;
		img {
			height: 120rpx;
			width: 120rpx;
			border-radius: 50%;
			margin-top: 98rpx;
			background-color: #fff;
		}
		.personal-login-status {
			color: #fff;
			.personal-login-name {
				font-size: 18px;
				margin-bottom:4px;
			}
			.personal-login-title {
				font-size: 12px;
				.personal-login-level {
					padding-right: 5px;
				}
				.personal-login-departName {
					padding-left: 5px;
				}
			}
		}
	}
	.favorable-comments {
		display: flex;
		justify-content: space-around;
		align-items: center;
		text{
			display: block;
			text-align: center;
			color: #3E3E3E;
			font-size: 30px;
		}
		view{
			color: #ACACAC;
			font-size: 15px;
		}
	}
	.dividing-line {
		width: 100%;
		height: 5px;
		background-color: #F6F6F6;
		margin-top: 20px;
	}
	.uni-options-flex {
		display: flex;
		color: #333333;
		font-size: 12px;
		.uni-options-item {
			width: 25%;
			text-align: center;
			margin: 10px 0px;

			img {
				height: 28px;
				width: 28px;
				margin-bottom: 5px;
			}
		}
	}
	.userList-details {
		height: 60px;
		display: flex;
		align-items: center;
		.img-title{
			width: 30px;
			height: 26px;
			margin-left: 13px;
		}
	}
	.doctorIntroduce-titleText{
		font-size: 14px;
		color: #3E3E3E;
		img{
			width: 7.9px;
			height: 15px;
			margin-right: 13px;
		}
	}
	.userList-detailsText {
		width: 100%;
		height: 60px;
		font-size: 15px;
		color: #333333;
		margin-left: 25px;
		border-bottom: 1px solid #E5E5E5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.userList-accountSetting {
		border-bottom: none;
	}
</style>
