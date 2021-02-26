<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true"/>
		<view class="uni-content-box" v-for="(item,index) in clinicList" :key="index">
			<view class="uni-listBox" @click="goRecord(item)">
				<view class="uni-list-box">
					<view class="uni-list-top">
						<img src="http://file.aihuihc.com/patient/patientImages/images/clinic.png" mode=""></img>
						<view>{{item.patientName}}</view>
					</view>
				</view>
				<view class="uni-list">
					<view class="uni-list-middle">
						<view><text class="banner-text-label">时间：</text>{{item.medicalDate}}</view>
						<view><text class="banner-text-label">科室：</text>{{item.departName}}</view>
						<view><text class="banner-text-label">医生：</text>{{item.doctorName}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-content-box" v-if="clinicList.length===0" style="text-align: center;">
			<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/report.png" />
			<view class='uni-default-tip'>
				<text>暂无您的门诊病历哦～</text>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	let app = getApp()
	import {clinicModel} from '@/models/clinic.js'
	const clinic = new clinicModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '门诊记录'
				},
				clinicList: []
			}
		},
		onShow() {
			this.$refs.loading.open();
			this.userId = uni.getStorageSync('userInfo').userId
			this.getClinicList(this.userId)
		},
		methods: {
			getClinicList(userId){
				clinic.listMedicalRecord({userId}).then(res=>{
					this.$refs.loading.close();
					this.clinicList = res.data;
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err)
				})
			},
			goRecord(item){
				wx.navigateTo({
					url:'./medicalRecord?medicalId=' + item.medicalId + '&patientId=' + item.patientId + '&doctorId=' + item.doctorId
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-default-tip {
		text-align: center;
		font-size: 40rpx;
		color:#333333;
	}
	.uni-default-img {
		text-align: center;
		height: 360rpx;
		width: 360rpx;
		margin-top:160rpx;
		margin-bottom:40rpx;
	}
	.uni-content-box{
		padding: 0 12px;
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
				img{
					width: 52rpx;
					height: 52rpx;
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
				line-height: 50rpx;
				padding: 30rpx 30rpx;
				color: #333333;
				font-size: 30rpx;
				.banner-text-label{
					display: inline-block;
					width: 90rpx;
				}
			}
		}
	}
</style>
