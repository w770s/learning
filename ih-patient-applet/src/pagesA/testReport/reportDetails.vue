<template>
	<view class="uni-content">
		<u-bar :nav="setNav" />
		<view class="banner-content">
			<view class="banner-content-box">
				<view class="banner-content-title">
					<view class="banner-title-left">{{userInfo.type==0?userInfo.reportTitle+'检查报告':userInfo.type==1?userInfo.inspectionName+'检验报告':'---'}}</view>
					<view class="banner-title-right">{{userInfo.type==0?userInfo.reportDate:userInfo.type==1?userInfo.inspectionDate:'---'}}</view>
				</view>
				<view><text class="banner-text-label">患者姓名：</text>{{userInfo.patientName?userInfo.patientName:'---'}}</view>
				<view><text class="banner-text-label">患者性别：</text>{{userInfo.gender==0?'男':userInfo.gender==1?'女':'---'}}</view>
				<view><text class="banner-text-label">科室：</text>{{userInfo.departName?userInfo.departName:'---'}}</view>
				<view><text class="banner-text-label">临床诊断：</text>{{userInfo.clinicalDiagnosis?userInfo.clinicalDiagnosis:'---'}}</view>
			</view>
		</view>
		<!-- 检验报告 -->
		<view class="uni-list" v-if="userInfo.type==1">
			<view class="uni-detailed">
				<view class="uni-detailed-list">
					<view class="uni-detailed-title">检验指标</view>
					<view class="uni-detailed-title">检测结果</view>
					<view class="uni-detailed-title">计量单位</view>
					<view class="uni-detailed-title">参考值</view>
					<view class="uni-detailed-title">结果</view>
				</view>
			</view>
			<view :class="['uni-detailed-line',items.exceptionResult==1 || items.exceptionResult==2?'uni-detailed-abnormal':'']" v-for="(items,indexs) in testDetail" :key="indexs">
				<view class="uni-detailed-list">
					<view>{{items.itemName?items.itemName:'---'}}</view>
					<view>{{items.examResult?items.examResult:'---'}}</view>
					<view>{{items.itemUnit?items.itemUnit:'---'}}</view>
					<view>{{items.itemRef?items.itemRef:'---'}}</view>
					<view>
						{{items.quaResult?items.quaResult:''}}
						<img v-if="items.exceptionResult==1" style="width: 16rpx;height: 20rpx;" src="http://file.aihuihc.com/patient/patientImages/images/login/arrowDown.png" mode=""></img>
						<img v-if="items.exceptionResult==2" style="width: 16rpx;height: 20rpx;" src="http://file.aihuihc.com/patient/patientImages/images/login/arrowUp.png" mode=""></img>
					</view>
				</view>
			</view>
		</view>
		<!-- 检查报告 -->
		<view class="uni-details" v-if="userInfo.type==0">
			<view class="uni-details-box">
				<view class="uni-details-text">
					<view class="banner-text-label">检查科室：</view>
					<view class="banner-text">{{reportDetail.reportDoctorName?reportDetail.reportDoctorName:'---'}}</view>
				</view>
				<view class="uni-details-text">
					<view class="banner-text-label">检查部位：</view>
					<view class="banner-text">{{reportDetail.checkParts?reportDetail.checkParts:'---'}}</view>
				</view>
				<view class="uni-details-text">
					<view class="banner-text-label">检查所见：</view>
					<view class="banner-text">{{reportDetail.examination?reportDetail.examination:'---'}}</view>
				</view>
				<view class="uni-details-text">
					<view class="banner-text-label">检查结果：</view>
					<view class="banner-text">{{reportDetail.diagnosis?reportDetail.diagnosis:'---'}}</view>
				</view>
				<view class="uni-details-text">
					<view class="banner-text-label">检查医生：</view>
					<view class="banner-text">{{reportDetail.checkDoctorName?reportDetail.checkDoctorName:'---'}}</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	let app = getApp()
	import {reportModel} from '@/models/testReport.js'
	const report = new reportModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true
				},
				userInfo: {},
				reportDetail: {},
				testDetail: []
			};
		},
		onLoad(options) {
			this.userInfo = JSON.parse(options.userInfo)
		},
		onShow(){
			this.$refs.loading.open();
			var id = ''
			if(this.userInfo.type==0){
				id = this.userInfo.reportId
			}else if(this.userInfo.type==1){
				id = this.userInfo.inspectionId
			}
			const data = {
				hospitalId: this.userInfo.hospitalId,
				id,
				type: this.userInfo.type
			}
			this.detailsList(data)
		},
		methods: {
			detailsList(data){
				report.reportDetail(data).then(res=>{
					this.$refs.loading.close();
					this.reportDetail = res.data.inspectReportRepData
					this.testDetail = res.data.testReportRepData
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err)
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
		height: 380rpx;
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
					width: 400rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
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
	.uni-monetary-box{
		height: 220rpx;
		font-size: 30rpx;
		text-align: center;
		color: #FFFFFF;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		.uni-monetary-title{
			font-size: 60rpx;
			font-weight: 600;
		}
	}
	.uni-list{
		background: #FFFFFF;
		position: relative;
		top: -50rpx;
		border-radius: 40rpx 40rpx 0 0;
		.uni-detailed{
			background: #79A8F8;
			color: #333333;
			border-radius: 20rpx 20rpx 0 0;
		}
		.uni-detailed-list{
			padding: 30rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.uni-detailed-title{
				font-size: 30rpx;
			}
			view{
				word-break:break-all;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 20%;
				text-align: center;
				font-size: 26rpx;
			}
		}
		.uni-detailed-line{
			background-color: #FFFFFF;
		}
		.uni-detailed-line:nth-child(even){
			background: #FFFFFF;
		}
		.uni-detailed-line:nth-child(odd){
			background: #F5F9FF;
		}
	}
	.uni-detailed-abnormal{
		background-color: #FF745F !important;
	}
	.uni-details{
		background: #FFFFFF;
		position: relative;
		top: -50rpx;
		border-radius: 40rpx 40rpx 0 0;
		.uni-details-box{
			padding: 40rpx 24rpx 0 24rpx;
		}
		.uni-details-text{
			display: flex;
			font-size: 30rpx;
			.banner-text-label{
				color: #B2B2B2;
				width: 160rpx;
			}
			.banner-text{
				color: #333333;
				flex: 1;
			}
		}
	}
</style>
