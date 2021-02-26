<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true"/>
		<view style="padding: 12px;">
			<view class="uni-choose-type">
				<view :class="index==current?'selectBtn':'noselectBtn'" @tap="changeBtn(item,index)" v-for="(item,index) in userLists" :key="index">{{item.patientName}}</view>
			</view>
			<view v-if="!serviceLists.listInpatientsServiceRepData" style="text-align: center;">
				<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/report.png" />
				<view class='uni-default-tip'>
					<text>暂无您的住院信息哦～</text>
				</view>
			</view>
			<view class="uni-listBox" v-for="(item,index) in serviceLists.listInpatientsServiceRepData" :key="index">
				<view class="uni-list-box">
					<view class="uni-list-top">
						<img src="http://file.aihuihc.com/patient/patientImages/images/inpatientMessage.png" mode=""></img>
						<view class="">{{changeTime(item.inTime,'inTime')+'~'+changeTime(item.outTime,'outTime')}}</view>
					</view>
				</view>
				<view class="uni-list" @click="goInpatientMessage(item)">
					<view class="uni-list-middle">
						<view>
							<view class="uni-payment-box">
								{{item.patientName}}
								<text>{{item.gender==0?'男':item.gender==1?'女':'---'}}</text>
								<text>{{item.age?item.age+'岁':'---'}}</text>
							</view>
							<view class="uni-payment-title">{{item.departName?item.departName:'---'}}</view>
						</view>
						<view class="uni-payment-record" v-if="!item.outTime">
							<view>
								<text>{{getnum(item.balance/100)}}</text>元
							</view>
							<br/>
							<text class="uni-payment-btn">预交金余额</text>
						</view>
					</view>
				</view>
				<view class="uni-list-bottom" v-if="!item.outTime">
					<view class="uni-bottom-box" @click="goRecharge(item)">
						<img style="height: 42rpx;" src="http://file.aihuihc.com/patient/patientImages/images/recharge.png" mode=""></img>
						<view>预交金充值</view>
					</view>
					<view class="uni-bottom-box" @click="goDailyList(item)">
						<img src="http://file.aihuihc.com/patient/patientImages/images/dailyList.png" mode=""></img>
						<view>每日清单</view>
					</view>
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
					'navTitle': '住院记录'
				},
				userId: '',
				current: 0,
				userLists: [],
				serviceLists:{}
			}
		},
		onShow() {
			this.$refs.loading.open()
			this.userId = uni.getStorageSync('userInfo').userId
			if(this.userId){
				this.serviceList(this.userId)
			}else{
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=inpatientServicesIndex'
							})
						}
					}
				})
			}
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
			serviceList(userId){
				inpatientService.seriviceList({userId}).then(res=>{
					this.$refs.loading.close();
					this.userLists = res.data
					if(res.data.length>0){
						this.serviceLists = res.data[this.current]
					}
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
				}else{
					if(type==='inTime'){
						return '---'
					}
					if(type==='outTime'){
						return '至今'
					}
				}
			},
			changeBtn(item,index){
				this.current=index
				this.serviceLists = this.userLists[index]
			},
			goRecharge(item){
				uni.setStorageSync('item',JSON.stringify(item))
				uni.setStorageSync('patientId',this.serviceLists.patientId)
				wx.redirectTo({
					url:'../recharge/index'
				})
			},
			goDailyList(item){
				wx.navigateTo({
					url:'./dailyList?userInfo=' + JSON.stringify(item)
				})
			},
			goInpatientMessage(item){
				this.$refs.loading.open()
				uni.setStorageSync('item',JSON.stringify(item))
				uni.setStorageSync('patientId',this.serviceLists.patientId)
				wx.navigateTo({
					url:'./inpatientMessage'
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-default-img {
		text-align: center;
		height: 360rpx;
		width: 360rpx;
		margin-top: 160rpx;
		margin-bottom: 40rpx;
	}

	.uni-default-tip {
		text-align: center;
		font-size: 40rpx;
		color:#333333;
	}
	.uni-listBox{
		background: #FFFFFF;
		margin-top: 20rpx;
		border-radius: 0 0 20rpx 20rpx;
		.uni-list-box{
			border-radius: 20rpx 20rpx 0 0;
			background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
			.uni-list-top{
				height: 104rpx;
				margin: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: start;
				img{
					width: 52rpx;
					height: 46rpx;
				}
				view{
					font-size: 36rpx;
					color: #FFFFFF;
					padding-left: 20rpx;
				}
			}
		}
		.uni-list{
			.uni-list-middle{
				height: 160rpx;
				margin: 0 30rpx;
				color: #333333;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.uni-payment-box{
					font-size: 36rpx;
					font-weight: 600;
					text{
						font-size: 30rpx;
						font-weight: normal;
						padding-left: 30rpx;
					}
				}
				.uni-payment-title{
					font-size: 30rpx;
				}
				.uni-payment-record{
					text-align: center;
					view{
						color: #333333;
						font-size: 26rpx;
						text{
							color: #FF745F;
						font-size: 36rpx;
						}
					}
					.uni-payment-btn{
						font-size: 26rpx;
						color: #B2B2B2;
					}
				}
			}
		}
		.uni-list-bottom{
			height: 112rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-top: 2rpx solid #E5E5E5;
			.uni-bottom-box {
				display: flex;
				align-items: center;
				img{
					width: 52rpx;
					height: 46rpx;
				}
				view{
					color: #333333;
					font-size: 30rpx;
					margin-left: 20rpx;
				}
			}
		}
	}
	.uni-choose-type{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		view{
			width: 120rpx;
			text-align: center;
		}
	}
	.selectBtn {
		font-size: 40rpx;
		font-weight: 600;
		color: #3E3E3EFF;
		border-bottom: 2px solid #2884FFFF;
	}

	.noselectBtn {
		font-size: 30rpx;
		color: #B2B2B2FF;
	}
</style>
