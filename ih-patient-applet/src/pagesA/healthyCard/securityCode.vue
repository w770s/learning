<template>
	<view class="content">
		<u-bar :nav="setNav" />
		<view class="uni-code-customer">
			短信验证码
		</view>
		<view style="height:64px;padding-bottom: 50px;">
			<u-validCode ref="code" :maxlength="4" @input="getCodeNow" @finish="getCode"></u-validCode>
		</view>
		<view style="text-align: center;">
			<u-button :loading="loading" @click="sureAdd" :throttleTime="2000" :customStyle="buttonStyle" type="primary" shape="square" size="default">下一步</u-button>
			<view style="font-size:12px;color:#B2B2B2;">确认添加后需要进行实名认证、请确保本人知晓</view>
		</view>
	</view>
</template>

<script>
	import {
		healthyCardModel
	} from '@/models/healthyCard.js'
	const healthyCard = new healthyCardModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '添加健康卡'
				},
				userId: '',
				userInfo: {},
				vertifyCode: '',
				loading: false,
				buttonStyle: {
					height: '47px',
					borderRadius: '8px',
					lineHeight: '47px',
					textAlign: 'center',
					color: '#fff',
					fontSize: '18px',
					marginBottom: '6px',
					background:'rgba(40,132,255,0.2)'
				}
			}
		},
		onLoad(options){
			if(options.item){
				this.userInfo = JSON.parse(options.item)
				this.userId = uni.getStorageSync('userInfo').userId
			}
		},
		methods: {
			apiaAddHealthCard(data) {
				healthyCard.addHealthCard(data).then(res => {
					let registerData = JSON.parse(JSON.stringify(wx.getStorageSync('registerData')))
					let consultData = JSON.parse(JSON.stringify(wx.getStorageSync('consultData')))
					let doctorDetail = JSON.parse(JSON.stringify(wx.getStorageSync('doctorDetail')))
					if(registerData.length>0){
						wx.removeStorageSync('registerData')
						this.userInfo = JSON.stringify(registerData[0])
						this.hisDepartId = registerData[1]
						uni.redirectTo({
							url: `/pagesA/bookRegister/doctorReserve?val=${this.userInfo}&hisDepartId=${this.hisDepartId}`
						})
					}
					if(consultData.length>0){
						wx.removeStorageSync('consultData')
						uni.navigateTo({
							url: `/pagesA/medicalReport/consultOrder?accId=${consultData[0]}&price=${consultData[1]}&doctorId=${consultData[3]}`
						})
					}
					if(doctorDetail.hisDepartId||doctorDetail.doctorId){
						wx.removeStorageSync('doctorDetail')
						uni.redirectTo({
							url: `/pagesA/consulting/doctorDetail?doctorId=${doctorDetail.doctorId}&hisDepartId=${doctorDetail.hisDepartId}&fromType=${doctorDetail.fromType}`
						})
					}
					else{
						uni.redirectTo({
							url: `./index`
						})
					}
					this.loading = false
				}).catch((err) => {
					this.loading = false
					console.log(err);
				})
			},
			apiVerifyCode() {
				const data = {phone:this.userInfo.phone,code: this.vertifyCode}
				healthyCard.verifyCode(data).then(res => {
					const data = {
						userId: this.userId,
						userName: this.userInfo.name,
						idCard: this.userInfo.idCard,
						phone: this.userInfo.phone
					}
					this.apiaAddHealthCard(data)
				}).catch((err) => {
					this.loading = false
					console.log(err);
				})
			},
			//获取code码
			getCode(val) {
				this.vertifyCode = val
			},
			getCodeNow(val){
				this.vertifyCode = val
				if(this.vertifyCode.length===4){
					this.buttonStyle['background'] = 'linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%)'
				}else{
					this.buttonStyle['background'] = 'rgba(40,132,255,0.2);'
				}
			},
			// 清空验证码
			clearCode() {
				this.$refs.code.clear();
			},
			sureAdd(){
				if(this.vertifyCode.length===4){
					this.loading = true
					this.apiVerifyCode()
				}else{
					this.loading = false
					uni.showToast({
						title: '请输入四位验证码',
						icon: 'none',
						duration: 2000
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		padding: 24px;
	}

	.uni-code-customer{
		font-size: 15px;
		color: #333333;
		padding: 24px;
		text-align: center;
	}
</style>

