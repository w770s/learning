<template>
	<view class="uni-content">
		<u-bar :nav="setNav" :route="'/pagesA/inpatientServices/index'"/>
		<view class="banner-content">
			<view class="banner-content-box">
				<view class="banner-content-title">
					<view class="banner-title-left">
						{{userInfo.patientName}}
						<text>{{userInfo.gender==0?'男':userInfo.gender==1?'女':'---'}}</text>
						<text>{{userInfo.age?userInfo.age+'岁':'---'}}</text>
					</view>
					<view class="banner-title-right">{{userInfo.departName}}</view>
				</view>
				<view><text class="banner-text-label">住院号：</text>{{userInfo.inpatientId}}</view>
				<view><text class="banner-text-label">床位号：</text>{{userInfo.bedNo?userInfo.bedNo+'号':'---'}}</view>
				<view><text class="banner-text-label">住院时间：</text>{{changeTime(userInfo.inTime,'inTime')}}~{{changeTime(userInfo.outTime,'outTime')}}</view>
				<view><text class="banner-text-label">主管医生：</text>{{userInfo.doctorName?userInfo.doctorName:'---'}}</view>
				<view><text class="banner-text-label">主管护士：</text>{{userInfo.nurseName?userInfo.nurseName:'---'}}</view>
			</view>
		</view>
		<view class="uni-list-box">
			<view class="uni-payment">
				<!-- 未出院 -->
				<view @click="goRecharge" v-if="!userInfo.outTime">
					<view class="uni-payment-box">
						<text>{{getnum(userInfo.balance/100)}}元</text>
						<img src="http://file.aihuihc.com/patient/patientImages/images/gopay.png" mode=""></img>
					</view>
					<view class="uni-payment-title">预交金余额</view>
				</view>
				<!-- 已出院 -->
				<view @click="goHospitalization" v-if="userInfo.outTime">
					<view class="uni-allPrice">{{getnum(userInfo.totalFee/100)}}元</view>
					<view class="uni-allPrice-text">总费用/元</view>
				</view>
				<view class="uni-payment-record" @click="goPaymentRecord">
					<view>预交金记录</view>
					<br/>
					<text class="uni-payment-btn">查看</text>
				</view>
			</view>
			<view class="uni-listBox" v-for="(item,index) in dailyBillList" :key="index">
				<view>
					<view class="uni-left-title">费用小结</view>
					<view class="uni-list-time">{{item.billDate}}</view>
				</view>
				<view class="uni-list-detailed" @click="goDailyList(item)">
					<view class="uni-right-title">￥{{getnum(item.billFee/100)}}</view>
					<img class="uni-right-img" src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png"></img>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {serviceModel} from '@/models/inpatientServices.js'
	const inpatientService = new serviceModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': ''
				},
				userInfo: {},
				patientId: '',
				dailyBillList: []
			}
		},
		onShow(){
			this.$refs.loading.open()
			this.userInfo = JSON.parse(uni.getStorageSync('item'))
			this.patientId = uni.getStorageSync('patientId')
			const data = {
				hospitalId: this.userInfo.hospitalId,
				inpatientId: this.userInfo.inpatientId
			}
			this.seriviceDetail(data)
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
							return val
						}
					}
				}
			},
			seriviceDetail(data){
				inpatientService.seriviceDetail(data).then(res=>{
					this.$refs.loading.close();
					this.dailyBillList = res.data.dailyBillListRepData
				}).catch(err=>{
					this.$refs.loading.close();
				})
			},
			changeTime(val,type){
				if(val){
					let myTime = new Date(val.replace(/-/g,'/'))
					let month = ((myTime.getMonth() + 1)<10?(0+''+(myTime.getMonth() + 1)):(myTime.getMonth() + 1))
					let days = (myTime.getDate()<10?(0+''+myTime.getDate()):myTime.getDate())
					return myTime.getFullYear()+ "-" + month + "-" + days;
				}
				else{
					if(type==='inTime'){
						return '---'
					}
					if(type==='outTime'){
						return '至今'
					}
				}
			},
			goRecharge(){
				wx.navigateTo({
					url:'../recharge/index?userInfo=' + JSON.stringify(this.userInfo) + '&patientId=' + this.patientId
				})
			},
			goPaymentRecord(){
				wx.navigateTo({
					url:'../recharge/paymentRecord?hospitalId='+ this.userInfo.hospitalId + '&inpatientId=' + this.userInfo.inpatientId
				})
			},
			goDailyList(item){
				wx.navigateTo({
					url:'./dailyList?userInfo=' + JSON.stringify(this.userInfo) + '&userList=' + JSON.stringify(item)
				})
			},
			goHospitalization(){
				wx.navigateTo({
					url:'./hospitalization?hospitalId='+ this.userInfo.hospitalId + '&inpatientId=' + this.userInfo.inpatientId
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
	.banner-content {
		height: 430rpx;
		font-size: 30rpx;
		color: #FFFFFF;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		.banner-content-box{
			margin: 0 24rpx;
			line-height: 60rpx;
			.banner-content-title{
				font-size: 36rpx;
				font-weight: 600;
				display: flex;
				justify-content: space-between;
				.banner-title-left{
					text{
						padding: 20rpx;
					}
				}
				.banner-title-right{
					font-size: 30rpx;
				}
			}
			.banner-text-label{
				font-size: 30rpx;
				display: inline-block;
				width: 160rpx;
			}
		}
	}
	.uni-monetary{
		color: #FFFFFF;
		font-size: 30rpx;
		height: 312rpx;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		.uni-topTime{
			width: 100%;
			height: 80rpx;
			background: #79A8F8;
			color: #FFFFFF;
			text-align: center;
			line-height: 80rpx;
			img{
				width: 20rpx;
				height: 40rpx;
				position: relative;
				top: 7rpx;
			}
			text{
				margin: 0 40rpx;
			}
		}
		.uni-monetary-box{
			margin: 20rpx 0 90rpx 0;
			text-align: center;
			.uni-monetary-title{
				font-size: 60rpx;
				font-weight: 600;
			}
		}
	}
	.uni-list-box{
		padding: 0 24rpx;
		background: #FFFFFF;
		position: relative;
		top: -50rpx;
		border-radius: 20rpx 20rpx 0 0;
		.uni-listBox{
			height: 152rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #E5E5E5;
			.uni-left-title{
				font-size: 30rpx;
				color: #333333;
			}
			.uni-list-time{
				font-size: 26rpx;
				color: #B2B2B2;
			}
			.uni-list-detailed{
				display: flex;
				align-items: center;
				.uni-right-img{
					width: 20rpx;
					height: 38rpx;
				}
				.uni-right-title{
					font-size: 36rpx;
					font-weight: 600;
					color: #333333;
					padding-right: 20rpx;
				}
			}
		}
		.uni-payment{
			height: 152rpx;
			color: #333333;
			background: #FFFFFF;
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-bottom: 2rpx solid #E5E5E5;
			.uni-payment-box{
				display: flex;
				justify-content: center;
				text{
					font-size: 36rpx;
					font-weight: 600;
					color: #2884FF;
				}
				img{
					width: 80rpx;
					height: 28rpx;
					position: relative;
					top: 10rpx;
				}
			}
			.uni-allPrice{
				text-align: center;
				font-size: 36rpx;
				font-weight: 600;
				color: #2884FF;
			}
			.uni-allPrice-text{
				text-align: center;
				font-size: 26rpx;
			}
			.uni-payment-title{
				text-align: center;
				font-size: 26rpx;
			}
			.uni-payment-record{
				text-align: center;
				.uni-payment-btn{
					font-size: 26rpx;
					padding: 4rpx 20rpx;
					color: #FFFFFF;
					background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
					border-radius: 10rpx;
				}
			}
		}
		.uni-detailed{
			background: #79A8F8;
			color: #333333;
		}
		.uni-detailed-line:nth-child(even){
			background: #FFFFFF;
		}
		.uni-detailed-line:nth-child(odd){
			background: #F5F9FF;
		}
		.uni-cutUp{
			margin: 0 20rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 24rpx;
			text-align: center;
			background: #2884FF;
			color: #FFFFFF;
		}
	}
</style>
