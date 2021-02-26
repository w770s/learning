<template>
	<view class="content-box">
        <talkBar :nav="setNav" @recordClick="recordClick"  @talkClick="talkClick" @back="back" />
		<view class="uni-content" v-if="isReport==='1'">
			<view class='uni-user-box' @tap="goPhysicalReport(item)" v-for="(item,index) in listCheckups" :key="index">
				<view class='uni-user-text'>
					<view class='uni-user-name'>{{item.personalName}}</view>
					<view class='uni-user-mes'>
						<view class='uni-user-packageName'>{{item.packageName }}</view>
						<view :class="[item.abnormal?'uni-color-error':'uni-color-normal']">报告结果: {{item.checkupResult?item.checkupResult:'暂无'}}</view>
						<view class='uni-user-signTime'>体检时间: {{item.signTime.substring(0,10)}}</view>
					</view>
				</view>
				<view class='uni-user-img'>
					<img src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/next.png"></img>
				</view>
			</view>
			<view v-if="listCheckups.length===0" class='no-recent'>
				<img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
				<text class='no-recent-text'>暂无体检报告哦~</text>
			</view>
		</view>
		<view class="uni-content" v-if="isReport==='2'">
			<view class="uni-report-box" @tap="goSpecialEmr(item)" v-for="(item,index) in clinicList" :key="index">
				<view class="uni-report-titleBox">
					<view class='uni-report-img'>
						<img src="http://file.aihuihc.com/ih-doctor-applet/pharmacist/recordIcon.png"></img>
					</view>
					<view>{{item.patientName}}</view>
				</view>
				<view class='uni-report-text'>
					<view class='uni-report-item'>时间：{{item.medicalDate}}</view>
					<view class='uni-report-item'>科室：{{item.departName}}</view>
					<view class='uni-report-item'>科室：{{item.doctorName}}</view>
				</view>
			</view>
			<view v-if="clinicList.length===0" class='no-recent'>
				<img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
				<text class='no-recent-text'>暂无电子病历哦~</text>
			</view>
		</view>
	</view>
</template>

<script>
import talkBar from '../../components/talkBar.vue'
import { testReportModel } from '@/models/testReport.js'
const testReport = new testReportModel()
export default {
    components: {
		talkBar
    },
	data() {
		return {
			isReport:'1',
			setNav: {
				'isdisPlayNavTitle': true,
				'navTitle': ''
			},
			listCheckups: [],
			idCard: '',
			chatTo: '',
			chatType: '',
			clinicList: []
		}
	},
	onLoad(options) {
		this.idCard = options.idCard
		this.chatTo = options.chatTo
		this.chatType = options.type

		this.isReport = options.isReport
		this.patientId = options.patientId
		if(this.isReport==='1'){
			this.listCheckup()
		}
		if(this.isReport==='2'){
			this.apiListPatientMedicalRecord(this.patientId)
		}
	},
	methods: {
		apiListPatientMedicalRecord(patientId){
			testReport.listPatientMedicalRecord({patientId}).then(res=>{
				this.clinicList = res.data;
				console.log(this.clinicList);
			}).catch(err=>{
				console.log(err)
			})
		},
		recordClick(){

		},
		talkClick(){
			wx.navigateTo({
				url: './consultPage?chatTo=' + this.chatTo + '&type=' + this.chatType
			})
		},
		back(){
			uni.navigateTo({
				url: './consultPage?chatTo=' + this.chatTo + '&type=' + this.chatType
			})
		},
		listCheckup(){
			let that = this
			const data = {
				idCards: this.idCard
			}
			testReport.listCheckup(data).then(res=>{
				that.listCheckups = res.data
			}).catch(err=>{

			})
		},
		goPhysicalReport(item){
			wx.navigateTo({
				url: './physicalReport?listCheckups=' + JSON.stringify(item)
			})
		},
		goSpecialEmr(item){
			wx.navigateTo({
				url: `/pagesA/specialEmr/index?medicalId=${item.medicalId}&patientId=${item.patientId}&doctorId=${item.doctorId}&clinicNo=${item.clinicNo}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
	.content-box{
		height: 100%;
		background: #F6F6F6;
	}

	.content-box /deep/ .selectRecord{
			background: #DAEDFF;
			color: #B2B2B2;
	}
	.content-box /deep/ .selectTalk{
		background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		color: #fff;
		padding: 0 26px;
	}
	.uni-content {
		margin: 15px 12px 0 12px;
	}
	.uni-user-name{
		color: #fff;
		font-size: 20px;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right:10px;
		width:92px;
		height:80px;
		margin-top:8px;
		background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
	}
	.uni-user-mes{
		padding-top:10px;
		font-size:12px;
		view{
			margin-bottom: 10px;
		}
		.uni-color-normal{
			color:#333333;
		}
		.uni-color-error{
			color:#FF745F;
		}
		.uni-user-packageName {
			font-size: 18px;
			width: 400rpx;
			display: inline-block;
			white-space: nowrap;
			overflow: hidden;
			text-overflow:ellipsis;
		}
		.uni-user-signTime {
			color:gray;
		}
	}
	.uni-user-img {
		img{
			margin-left:10px;
			margin-right:10px;
			height: 20px;
			width: 20px;
		}
	}
	.uni-user-box {
		font-size: 12px;
		color: gray;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items:center;
		border-radius: 5px;
		height:86px;
		background-color: #fff;
		color:#333333;
		.uni-user-text {
			display: flex;
		}
	}

	.uni-report-box{
		border-radius: 10rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.uni-report-titleBox{
		display: flex;
		align-items: center;
		border-radius: 10rpx 10rpx 0rpx 0rpx;
		background: linear-gradient(90deg, #5EA6F8 0%, #3B7CF4 100%);
		height: 104rpx;
		color: #fff;
		font-size: 36rpx;
		padding: 0rpx 30rpx;
		.uni-report-img{
			display: flex;
			justify-content: center;
			align-items: center;
			img{
				height: 52rpx;
				width: 52rpx;
				margin-right: 20rpx;
			}
		}
	}

	.uni-report-text{
		font-size: 30rpx;
		padding: 30rpx 30rpx 0rpx 30rpx;
		.uni-report-item{
			padding-bottom: 20rpx;
		}
	}

	.no-recent {
		width: 100%;
		display: flex;
		font-size: 40rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: -20rpx;
		.no-recent-image {
			text-align: center;
			height: 180px;
			width: 180px;
			margin:30px 0px;
		}
		.no-recent-text {
			width: 100%;
			text-align: center;
		}
	}
</style>
