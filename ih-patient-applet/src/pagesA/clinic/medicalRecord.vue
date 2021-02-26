<template>
	<view style="height: 100vh;background-color: #fff;">
		<u-bar :nav="setNav" />
		<view class="uni-content-box">
			<view class="uni-content-item">
				<view class="uni-content-theItem">
					<view class="uni-content-doctor">
						<view>
							<img :src="doctorDetail.doctorImageList" />
						</view>
						<view>
							<view style="margin-bottom:6rpx;font-size:30rpx">
								<text class="uni-content-doctorName">{{doctorDetail.name}}</text>
								<text style="margin-right:12rpx;">{{doctorDetail.level}}</text>
								<text>{{doctorDetail.departName}}</text>
							</view>
							<view class="uni-ill-list">
								<view class="uni-ill-item" v-for="(item,index) in doctorDetail.doctorDiseaseList" :key="index">
									{{item.name}}
								</view>
							</view>
						</view>
					</view>
					<view style="margin-bottom: 10rpx;">【擅长】{{doctorDetail.specialty?doctorDetail.specialty:'暂无'}}</view>
					<view style="margin-bottom: 10rpx;" v-if="showDetail">【简介】{{doctorDetail.description?doctorDetail.description:'暂无'}}</view>
				</view>
				<view @tap="dcotorDetail" class="uni-content-consult-box">
					<view>
						<text style="margin-right:14rpx;">{{showDetail?'收起':'展开医生详情'}}</text>
						<img v-if="!showDetail" src="http://file.aihuihc.com/patient/patientImages/images/consulting/unfold.png"></img>
						<img v-if="showDetail" src="http://file.aihuihc.com/patient/patientImages/images/consulting/packup.png"></img>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-user-box">
			<view class="uni-user">
				<view>
					<view>{{clinicDetail.patientName?clinicDetail.patientName:'---'}}</view>
					<view class="uni-user-name">姓名</view>
				</view>
				<view>
					<view>{{clinicDetail.gender==0?'男':clinicDetail.gender==1?'女':'---'}}</view>
					<view class="uni-user-name">性别</view>
				</view>
				<view>
					<view>{{clinicDetail.age?clinicDetail.age+'岁':'---'}}</view>
					<view class="uni-user-name">年龄</view>
				</view>
			</view>
		</view>
		<view class="uni-content-box">
			<view class="uni-content-item">
				<view class="uni-result-list">
					<view class="uni-result-title">诊断结果:</view>
					<view class="uni-result-text">{{clinicDetail.diagnosis?clinicDetail.diagnosis:'---'}}</view>
				</view>
				<view class="uni-result-list">
					<view class="uni-result-title">就诊时间:</view>
					<view class="uni-result-text">{{clinicDetail.medicalDate?clinicDetail.medicalDate:'---'}}</view>
				</view>
				<view class="uni-result-list">
					<view class="uni-result-title">病情主诉:</view>
					<view class="uni-result-text">{{clinicDetail.chiefComplaint?clinicDetail.chiefComplaint:'---'}}</view>
				</view>
				<view class="uni-result-list">
					<view class="uni-result-title">简要病史:</view>
					<view class="uni-result-text">{{clinicDetail.medRecord?clinicDetail.medRecord:'---'}}</view>
				</view>
				<view class="uni-result-list">
					<view class="uni-result-title">医嘱:</view>
					<view class="uni-result-text">{{clinicDetail.order?clinicDetail.order:'---'}}</view>
				</view>
				<view class="uni-result-list">
					<view class="uni-result-title">备注:</view>
					<view class="uni-result-text uni-item-last">{{clinicDetail.remark?clinicDetail.remark:'---'}}</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {clinicModel} from '@/models/clinic.js'
	const clinic = new clinicModel()
	import {consultingModel} from '@/models/consulting.js'
	const consulting = new consultingModel()
	export default {
		data() {
			return {
				showDetail: false,
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '电子病历'
				},
				doctorDetail: {},
				clinicDetail: {}
			}
		},
		onLoad(options){
			this.$refs.loading.open();
			const data = {
				medicalId: options.medicalId,
				patientId: options.patientId
			}
			this.getDetailList(data)
			this.apiSelectDoctor(options.doctorId)
		},
		methods: {
			getDetailList(data){
				clinic.medicalRecordDetails(data).then(res=>{
					this.$refs.loading.close();
					this.clinicDetail = res.data
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err)
				})
			},
			apiSelectDoctor(doctorId) {
				consulting.selectDoctor({doctorId}).then(res => {
					this.$refs.loading.close();
					res.data.doctorImageList.forEach((userInfo) => {
						if (userInfo.imageType === 1 && userInfo.sourceType === 10) {
							res.data.doctorImageList = userInfo.url
						}
					})
					this.doctorDetail = res.data
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			dcotorDetail() {
				this.showDetail = !this.showDetail
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content-box {
		background-color: #fff;
		padding: 30rpx 24rpx;
		font-size: 30rpx;
	}
	.uni-user-box{
		padding: 0 24rpx;
		.uni-user{
			height: 146rpx;
			font-size: 36rpx;
			border-radius: 10rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			text-align: center;
			color: #333333;
			background: rgba(40, 132, 255, 0.1);
			.uni-user-name{
				font-size: 26rpx;
				color: #B2B2B2;
			}
		}
	}
	.uni-content-item {
		position: relative;
		z-index: 0;
		background-color: #fff;
		box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);
		border-radius: 16rpx;
	}
	.uni-content-theItem{
		font-size: 24rpx;
		color:#333333;
		padding:30rpx 30rpx 0rpx 30rpx;
	}
	.uni-content-doctor {
		display: flex;
		img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}
	.uni-content-doctorName{
		font-size:36rpx;
		font-weight:bold;
		margin-right:12rpx;
	}
	.uni-ill-list{
		display: flex;
		flex-wrap:wrap;
		padding:20rpx 0rpx;
	}
	.uni-ill-item{
		padding:4rpx 10rpx;
		background-color:#2884FF;
		font-size:24rpx;
		color:#fff;
		margin:0rpx 12rpx 12rpx 0rpx;
		border-radius:16rpx;
	}
	.uni-content-consult-box {
		padding: 20rpx;
		text-align: center;
		color: #B2B2B2;
		font-size: 26rpx;
		img {
			width: 30rpx;
			height: 20rpx;
		}
	}
	.uni-result-list{
		font-size: 30rpx;
		color: #333333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.uni-result-title{
			color: #B2B2B2;
			width: 160rpx;
			// text-align: center;
		}
		.uni-result-text{
			padding: 30rpx 30rpx;
			flex: 1;
			text-align: left;
			border-bottom: 2rpx solid #E5E5E5;
		}
		.uni-item-last{
			border-bottom: none;
		}
	}
</style>
