<template>
	<view class="uni-content">
		<u-bar :nav="setNav" :route="'/pagesA/inpatientServices/index'"/>
		<view class="uni-content-title">
			<img src="http://file.aihuihc.com/patient/patientImages/images/login/paySuccess.png" mode=""></img>
			<view class="">缴费成功</view>
		</view>
		<view class="uni-content-box">
			<view class="uni-content-paice">{{balance!==null?getnum(balance/100):'---'}}</view>
			<view class="uni-contentTitle">预交金余额/元</view>
			<view class="uni-contentText">预交金余额到账时间较长，请点击刷新查看余额。</view>
		</view>
		<button class="uni-button-next" @click="getBalance">立即刷新</button>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>


<script>
	import {
		prepayModel
	} from '@/models/recharge.js'
	const prepay = new prepayModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '预交金充值'
				},
				userInfo:{},
				balance: 0
			}
		},
		onShow(){
			this.$refs.loading.open()
			this.userInfo = JSON.parse(uni.getStorageSync('item'))
			this.getBalance()
		},
		methods: {
			getnum(val){
				if(val){
					if (parseInt(val) == parseFloat(val)){
						return val+'.00'
					}else{
						var num = String(val).indexOf(".")+1;//获取小数点的位置
						var count = String(val).length - num;//获取小数点后的个数
						if(count==1){

							return val+'0'
						}else{
							console.log(val)
							return val
						}
					}
				}
			},
			getBalance(){
				this.$refs.loading.open()
				const data = {
					hospitalId: this.userInfo.hospitalId,
					inpatientId: this.userInfo.inpatientId
				}
				prepay.balance(data).then(res=>{
					this.$refs.loading.close();
					if(res.data.balanceRepData){
						this.balance = res.data.balanceRepData.balance
					}
				}).catch(err=>{
					this.$refs.loading.close();
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-content{
		height: 100vh;
		background: #FFFFFF;
	}
	.uni-content-title{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
		color: #333333;
		font-weight: 600;
		padding: 160rpx 0;
		img{
			width: 72rpx;
			height: 72rpx;
			padding-right: 20rpx;
		}
	}
	.uni-content-box{
		text-align: center;
		line-height: 60rpx;
		font-size: 30rpx;
		.uni-content-paice{
			color: #2884FF;
			font-size: 60rpx;
		}
		.uni-contentTitle{
			color: #B2B2B2;
		}
		.uni-contentText{
			color: #333333;
		}
	}
	.uni-button-next {
		width: 360rpx;
	    height: 70rpx;
	    color: #FFFFFF;
	    margin-top: 40rpx;
	    line-height: 70rpx;
	    text-align: center;
	    font-size: 32rpx;
	    color: #fff;
	    border-radius: 10rpx;
	    background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}
</style>
