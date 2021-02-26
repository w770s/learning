<template>
	<view>
		<u-bar :nav="setNav" :goLoginPage="true" />
		<view style="padding: 12px;">
			<view v-if="showMyOrder" style="text-align: center;">
				<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/messageKnock.png" />
				<view class='uni-default-tip'>
					<text>暂无会话内容～</text>
				</view>
			</view>
			<view class="flex-item" v-for="(item, index) in doctorList" v-if="doctorList.length>0" @tap.prevent.stop="goforDetail(item)" :key="index">
				<view class="uni-doctor-title" style="padding: 12px;">
					<view style="display: flex;justify-content: space-between;">
						<view style="height: 25px; line-height: 25px; font-size: 18px; font-weight: 600; color: #333333;">图文问诊</view>
						<view class="stateText" v-if="item.status === 1">待接诊</view>
						<view class="stateText" v-if="item.status === 2">已取消</view>
						<view class="stateText" v-if="item.status === 3">退款中</view>
						<view class="stateText" v-if="item.status === 4">已退款</view>
						<view class="stateText" v-if="item.status === 7">已评价</view>
						<view v-if="item.status === 5||item.status === 0||item.status === 6">
							<button v-if="item.status === 5" class="stateBtn" type="primary" style="width: 108px;">进入咨询对话</button>
							<button v-if="item.status === 6" class="stateBtn" type="primary" style="width: 108px;">去评价</button>
							<button v-if="item.status === 0" class="stateBtn" type="primary" style="width: 68px;">去支付</button>
						</view>
					</view>
				</view>
				<view class="uni-doctor-title" style="display: flex;border-bottom: none;">
					<img style="width: 50px; height: 50px;border-radius:50%;" src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png" />
					<view style="height: 50px; margin-left: 10px;">
						<text style="font-size: 18px; font-weight: 600; color: #333333FF;">{{item.name?item.name:''}}</text>
						<text class="docText">{{item.doctorLevel?item.doctorLevel:''}}</text>
						<text class="docText">{{item.departName?item.departName:'---'}}</text>
						<view style="font-size: 12px; color: #B2B2B2FF;margin-top:8px;">{{item?item.createTime:'---'}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import store from '@/store/index.js'
	let app = getApp()
	import {consultationModel} from '@/models/consultationOrder.js'
	const consultation = new consultationModel()
	import {MedicalReportModel} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	export default {
		data() {
			return {
				showMyOrder:false,
				userId:'',
				openId: '',
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '问诊订单'
				},
				cacheData: [],
				doctorList: [],
			};
		},
		onShow(){
			this.openId = uni.getStorageSync('userInfo').openId
			this.showMyOrder = false
			this.userId = uni.getStorageSync('userInfo').userId
			if (this.userId) {
				this.cacheData = uni.getStorageSync('myOrderPage')
				this.apiListRepeatDiagnosisOrder(this.userId)
			}
			if(!this.userId){
				this.doctorList = []
				this.showMyOrder = true
			}
		},
		methods: {
			apiListRepeatDiagnosisOrder(userId){
				consultation.ListRepeatDiagnosisOrder({userId}).then(res=>{
					this.doctorList = res.data
				}).catch((err) => {
					console.log(err);
				})
			},
			goforDetail(item){
				wx.navigateTo({
					url: `./orderDetails?id=${item.id}&orderNo=${item.orderNo}&createTime=${item.createTime}&status=${item.status}`,
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

	.flex-item {
		margin-bottom: 10px;
		height: 126px;
		background-color: white;
		border-radius: 8px;
	}

	.stateBtn {
		height: 30px;
		line-height: 30px;
		font-size: 13px;
		background: linear-gradient(to right, #ffb554ff, #ffa36aff);
	}

	.stateText {
		display: block;
		height: 30px;
		line-height: 30px;
		font-size: 13px;
		color: #333333FF;
	}

	.docText {
		margin-left: 10px;
		font-size: 15px;
		color: #333333FF;
	}

	.uni-doctor-title{
		padding: 12px;
		box-sizing: border-box;
		border-bottom: 0.5px solid #E5E5E5;
	}
</style>
