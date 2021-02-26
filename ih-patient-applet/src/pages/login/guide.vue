<template>
	<view class="content">
		<u-bar :nav="setNav" />
		<view>
			<view class="uni-guide-box">
				<view style="padding-top:40px;"></view>
				<view>
					<img class="uni-guide-banner" src="http://file.aihuihc.com/patient/patientImages/images/loginBanner.png" />
				</view>
				<view class="uni-guide-firm">
					<text>海螺互联网医院</text>
				</view>
				<view class="uni-guide-tip">
					<text>预约挂号、健康咨询、报告查询、健康管理</text>
				</view>
				<view class="uni-guide-button">
					<u-button @getuserinfo="getuserinfo" :loading="loading" :hover-class="'rap'" :open-type="'getUserInfo'" :customStyle="buttonStyle" type="default" shape="square" size="default">登录</u-button>
<!--					<uniBotton :loading="false" :throttleTime="2000" @click="getData" :disabled="true" :customStyle="buttonStyle" type="default" shape="square" size="default">test</uniBotton>-->
<!--					<button open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">登录</button>-->
				</view>
				<view class="uni-guide-logo">
					<img class="uni-guide-logo-img" src="http://file.aihuihc.com/patient/patientImages/images/aihuiLogin.png" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		config
	} from '@/config/index.js'
	import {
		loginModel
	} from '@/models/login.js'
	const login = new loginModel()
	export default {
		data() {
			return {
				code: '',
				oppId: '',
				phone: '',
				setNav: {
					'isdisPlayNavTitle': true
				},
				buttonStyle:{
					width: '100%',
					background: '#fff',
					borderRadius: '16rpx',
					marginTop: '30rpx',
					height: '94rpx',
					fontSize: '18px',
					color: '#464646',
					lineHeight: '94rpx',
					textAlign: 'center'
				},
				fromType: '',
				loading: false
			}
		},
		onLoad(options) {
			if(options.fromType){
				this.fromType = options.fromType
			}
			wx.login({
				success (res) {
					if (res.code) {
						//发起网络请求
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
		},
		methods: {
			toUnicode(theString) {
				let unicodeString = '';
				for (let i = 0; i < theString.length; i++) {
					let theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
					while (theUnicode.length < 4) {
						theUnicode = '0' + theUnicode;
					}
					theUnicode = '\\u' + theUnicode;
					unicodeString += theUnicode;
				}
				return unicodeString;
			},
			apiAddUser(){
				const that = this
				wx.getUserInfo({
					success: function(res) {
						let data = res.userInfo
						console.log(config);
						data['nickName'] = that.toUnicode(data.nickName)
						data.openId = config.openId
						data.type = 1
						if(config.unionid){
							data.unionId = config.unionid
						}
						config.defaultUserLogo = data.avatarUrl
						login.addUser(data).then(res => {
							const storage = {'openId':res.data.openId,'nickname':res.data.nickName,'logo':res.data.avatarUrl,userId:res.data.id,gender:res.data.gender}
							uni.setStorageSync('userInfo',storage)
							if(that.fromType==='QrCode'){
								wx.navigateBack({
									delta: 1
								})
							}
							if(that.fromType==='doctorDetails'){
								let qrData = uni.getStorageSync('doctorQr')
								console.log(qrData,qrData.hisDepartId);
								wx.redirectTo({
									url: `/pagesA/consulting/doctorDetail?hisDepartId=${qrData.hisDepartId}&fromType=${qrData.fromType}&doctorId=${qrData.doctorId}`
								})
							}
							if(that.fromType==='registerOrderDetails'){
								let id = uni.getStorageSync('registerId')
								console.log(id);
								wx.redirectTo({
									url: `/pagesA/registerOrder/orderDetails?id=${id}`
								})
							}
							if(that.fromType==='medicalIndex'){
								wx.redirectTo({
									url: `/pagesA/medicalReport/index?fromType=${1}`
								})
							}
							if(that.fromType === 'loginIndex'){
								wx.switchTab({
									url: '/pages/login/index'
								})
							}
							if(that.fromType === 'loginHome'){
								wx.switchTab({
									url: '/pages/login/home'
								})
							}
							if(that.fromType === 'dailyListIndex'){
								let myOptions = uni.getStorageSync('myOptions')
								wx.redirectTo({
									url: '/pagesA/inpatientServices/dailyList?outTime='+ myOptions.outTime + '&inTime='+ myOptions.inTime+ '&hospitalId='+ myOptions.hospitalId+ '&inpatientId='+ myOptions.inpatientId+ '&billDate='+ myOptions.billDate
								})
							}
							if(that.fromType === 'seeLogistics'){
								let seeLogisticsData = uni.getStorageSync('seeLogisticsData')
								wx.redirectTo({
									url: '/pagesA/prescriptionOrder/seeLogistics?orderNo='+ seeLogisticsData.orderNo + '&payTime='+ seeLogisticsData.payTime+ '&isDate='+ seeLogisticsData.isDate+ '&isTime='+ seeLogisticsData.isTime+ '&type='+ 2
								})
							}
							if(that.fromType === 'inpatientServicesIndex'){
								wx.redirectTo({
									url: '/pagesA/inpatientServices/index'
								})
							}
							if(that.fromType === 'seeDoctorIndex'){
								wx.switchTab({
									url: '/pages/seeDoctor/index'
								})
							}
							if(that.fromType === 'prescriptionIndex'){
								let datas = uni.getStorageSync('prescriptionIndex')
								let data = JSON.parse(datas)
								wx.redirectTo({
									url: `/pagesA/prescriptionOrder/orderDetails?id=${data.id}&pathType=${1}`
								})
							}
							if(that.fromType === 'testDetailsIndex'){
								let datas = uni.getStorageSync('testDetailsIndex')
								let data = JSON.parse(datas)
								wx.redirectTo({
									url: `/pagesA/prescriptionOrder/testDetails?id=${data.id}&status=${data.status}&pathType=${1}`
								})
							}
							that.loading = false
						}).catch(()=>{
							uni.showToast({
								title: '登录失败',
								icon: 'none',
								duration: 2000
							})
							that.loading = false
						})
					},
					fail: res => {
						// 获取失败的去引导用户授权
						that.loading = false
						console.log(res)
					}
				})
			},
			getuserinfo() {
				this.loading = true
				this.apiAddUser()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.uni-guide-box {
		/*padding: 65px 27px 0px 27px;*/
		padding: 0px 54rpx;
		height: 100%;
		text-align: center;
	}

	.uni-guide-banner {
		width: 604rpx;
		height: 604rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 50%;
	}

	.uni-guide-firm {
		color: #fff;
		font-size: 20px;
		font-weight: bold;
		margin-top: 50rpx;
	}

	.uni-guide-tip {
		color: #fff;
		font-size: 12px;
		margin-top: 12rpx;
	}

	.uni-guide-button {
		button {
			width: 100%;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 30rpx;
			height: 94rpx;
			font-size: 18px;
			color: #464646;
			line-height: 94rpx;
			text-align: center;
		}
	}

	.uni-guide-logo {
		margin-top: 50rpx;
		text-align: center;
	}

	.uni-guide-logo-img{
		width: 208rpx;
		max-height: 64rpx;
	}
</style>

