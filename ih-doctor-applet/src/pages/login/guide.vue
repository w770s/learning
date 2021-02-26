<template>
	<view class="content">
		<u-topBar :nav="setNav"/>
		<view class="uni-guide-box">
			<view>
				<img class="uni-guide-banner" src="http://file.aihuihc.com/ih-doctor-applet/image/login/login.png"></img>
			</view>
			<view class="uni-guide-firm">
				<text>海螺互联网医院</text>
			</view>
			<view class="uni-guide-tip">
				<text>在线咨询，问诊排班...</text>
			</view>
			<view class="uni-guide-button">
				<button v-show="!toPower" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">登录</button>
				<button v-show="toPower" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">授权登录</button>
			</view>
			<view class="uni-guide-logo">
				<img src="http://file.aihuihc.com/ih-doctor-applet/image/login/logo.png"></img>
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
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '登录',
					'bg': '#FFFFFF',
					'textColor': '#333333'
                },
				code: '',
				oppId: '',
				phone: '',
				toPower: false
			}
		},
		onLoad() {
			let that = this
			uni.login({
				success(res) {
					if (res.code) {
						that.code = res.code
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
			wxLogin(encryptedData, iv) {
				let that = this
				wx.login({
					success(res) {
						if (res.code) {
							//发起网络请求
							that.getPhoneNumber()
						} else {
							wx.showToast({
								title: '登录失败！' + res.errMsg
							})
						}
					}
				})
			},
			// 获取微信手机号
			getPhoneNumber(e) {
				wx.cloud.callFunction({
					name: 'getPhone',
					data: {
						action:'getcellphone',
						id:e.detail.cloudID
					}
				}).then(res => {
					this.openid = config.openId
					this.phone = res.result.res.list[0].data.phoneNumber
					config.phone = res.result.res.list[0].data.phoneNumber
					this.getuserinfo()
				}).catch(err=>{
					wx.showToast({
						title: '未获取到手机号',
						icon: 'none'
					})
					wx.switchTab({
						url: '/pages/home/index'
					})
				})
			},
			getuserinfo() {
			    const that = this
			    wx.getUserInfo({
					success: function(res) {
						const data = res.userInfo
						data['nickName'] = that.toUnicode(data.nickName)
						var avatarUrl = data.avatarUrl
						var gender = data.gender //性别 0：未知、1：男、2：女
						var province = data.province
						var city = data.city
						var country = data.country
						data.openId = config.openId
						data.phone = that.phone
						data.type = 2
						if(config.unionId){
							data.unionId = config.unionId
						}
						login.addUser(data).then(res => {
							wx.setStorageSync('phone', that.phone)
							wx.setStorageSync('avatar', data.avatarUrl)
							// wx.setStorageSync('phone', '18792363162')
							if(wx.getStorageSync('phone')){
								wx.switchTab({ // todo
									url: '/pages/home/index'
								})
							}
						})
					},
					fail: res => {
					// 获取失败的去引导用户授权
						wx.showModal({
							title: '警告',
							content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
							success: function (res) {
								if (res.confirm) {
									that.toPower = true
								}
							}
						})
					}
			    })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		height: 100vh;
		background: #FFFFFF;
	}

	.uni-guide-box {
		padding: 0px 27px;
		text-align: center;
	}

	.uni-guide-banner {
		width: 604rpx;
		height: 604rpx;
		background: #CCDFF0;
		border-radius: 50%;
	}

	.uni-guide-firm {
		color: #333333;
		font-size: 20px;
		margin-top: 35px;
	}

	.uni-guide-tip {
		color: #333333;
		font-size: 12px;
		margin-top: 6px;
	}

	.uni-guide-button {
		button {
			width: 100%;
			background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
			border-radius: 5px;
			margin-top: 15px;
			height: 47px;
			font-size: 18px;
			color: #FFFFFF;
			line-height: 47px;
			text-align: center;
		}
	}

	.uni-guide-logo {
		margin-top: 38px;
		text-align: center;
		img {
			width: 104px;
			height: 34px;
		}
	}

	button::after {
		border: none;
	}
</style>
