<template>
	<view>
		<u-bar :nav="setNav" :goLoginPage="true" />
		<view class="uni-nav"></view>
		<view class="uni-box">
			<view class="uni-healthCard">
				<view>
					<view class="uni-healthCard-name">{{healthCard.name}}</view>
					<view class="uni-healthCard-text">{{healthCard.gender==0?'男':healthCard.gender==1?'女':''}}<text>{{healthCard.age?healthCard.age+'岁':''}}</text></view>
				</view>
				<view v-preventReClick class="uni-tabBtn" @click="changeUser">
					<img src="http://file.aihuihc.com/patient/patientImages/images/switch.png" mode=""></img>
					<view>切换就诊人</view>
				</view>
			</view>
			<view class="">
				<view class="uni-choose-type">
					<view :class="btn?'selectBtn':'noselectBtn'" @tap="changeBtn(true)">处方</view>
					<view :class="!btn?'selectBtn':'noselectBtn'" style="margin-left: 60rpx;" @tap="changeBtn(false)">检查检验</view>
				</view>
			</view>
			<view v-preventReClick @click="goDetails(item,btn)" v-if="orderList.length>0" class="uni-uesrList" v-for="(item,index) in orderList" :key="index">
				<view class="uni-userList-title">
					<view class="uni-userList-label" v-if="btn">{{item.prescriptionDoctorName?item.prescriptionDoctorName:''}} <text>{{item.prescriptionDoctorDepartment?item.prescriptionDoctorDepartment:''}}</text></view>
					<view class="uni-userList-label" v-if="!btn">{{item.prescriptionDoctorName?item.prescriptionDoctorName:''}} <text>{{item.departname?item.departname:''}}</text></view>
					<view v-if="item.status!==null">
						<view v-if="item.status==2" class="uni-userList-btn uni-userList-btnPay">待支付</view>
						<view v-if="item.status==3" class="uni-userList-btn uni-userList-btnOvertime">超时未支付</view>
						<view v-if="item.status==4" class="uni-userList-btn uni-userList-btnPaid">支付成功</view>
						<view v-if="item.status==5" class="uni-userList-btn uni-userList-btnOvertime">支付失败</view>
						<view v-if="item.status==6" class="uni-userList-btn uni-userList-btnOvertime">已退款</view>
					</view>

					<view v-if="item.payStatus!==null">
						<view v-if="item.payStatus==0" class="uni-userList-btn uni-userList-btnPay">待支付</view>
						<view v-if="item.payStatus==4" class="uni-userList-btn uni-userList-btnOvertime">超时未支付</view>
						<view v-if="item.payStatus==1" class="uni-userList-btn uni-userList-btnPaid">支付成功</view>
						<view v-if="item.payStatus==2" class="uni-userList-btn uni-userList-btnOvertime">支付失败</view>
						<view v-if="item.payStatus==3" class="uni-userList-btn uni-userList-btnOvertime">已退款</view>
					</view>
				</view>
				<view class="uni-userList-content">
					<view class="uni-userList-contentLalel1">就诊人：<text class="uni-userList-contentName">{{item.name?item.name:''}}</text></view>
					<view class="uni-userList-contentLalel2">诊断：<text class="uni-userList-contentName">{{item.clinicalDiagnosis?item.clinicalDiagnosis:''}}</text></view>
					<view v-if="btn" class="uni-userList-contentLalel3"><text v-for="(val,index) in item.prescriptionMedicineList" :key="index">{{item.prescriptionMedicineList.length>1?val.name+'、':val.name}}</text></view>
					<view v-if="!btn" class="uni-userList-contentLalel3"><text v-for="(val,index) in item.prescriptionMedicineList" :key="index">{{item.prescriptionMedicineList.length>1?val.examineName+(val.detailPartAndMethodName?'('+val.detailPartAndMethodName+')'+'、':''):val.examineName+(val.detailPartAndMethodName?'('+val.detailPartAndMethodName+')':'')}}</text></view>
				</view>
				<view class="uni-userList-timeBox">
					<view class="uni-userList-time">开方时间：{{changeTime(item.prescriptionTime)}}</view>
					<view v-if="item.status==2||item.status==4" class="uni-userListbtn">
						<view v-if="item.status==2" class="uni-userList-timeBtn uni-userList-timeBtnPay">确认缴费</view>
						<view v-if="btn&&item.status==4&&item.fetchType==1" class="uni-userList-timeBtn uni-userList-timeBtnSee">查看物流</view>
					</view>
				</view>
			</view>
			<view v-if="orderList.length==0" style="text-align: center;">
				<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/messageKnock.png" />
				<view class='uni-default-tip'>
					<text v-if="btn">暂无处方订单～</text>
					<text v-if="!btn">暂无检查检验单～</text>
				</view>
			</view>
		</view>
		<wyb-popup ref="popup" type="bottom" height="400" width="500" radius="6" :showCloseIcon="true">
		    <view class="popup-content">
		        <view class="uni-healthCardList">就诊人列表</view>
				<view v-preventReClick v-for="(item,index) in healthCardList" :key="index" @click="selectUser(item,index)" class="uni-healthCardList-box">
					<view :class="['uni-healthCardList-name',index===whichIndex?'uni-healthCardList-select':'uni-healthCardList-noSelect']">{{item.name}}</view>
					<view class="uni-healthCardList-content">
						<view class="uni-healthCardList-contentName">{{item.name}}<text>{{item.gender==0?'男':item.gender==1?'女':''}}</text><text>{{item.age?item.age+'岁':''}}</text></view>
						<view class="uni-healthCardList-contentCard" style="font-size: 24rpx;">{{item.healthCardNo?'卡号：'+item.healthCardNo:''}}</view>
					</view>
					<view class="uni-healthCardList-title" v-if="index===whichIndex">当前就诊人</view>
				</view>
				<view class="uni-tips"></view>
		    </view>
		</wyb-popup>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
	import {prescriptionModel} from '@/models/prescriptionOrder.js'
	const prescription = new prescriptionModel()
	import {healthyCardModel} from '@/models/healthyCard.js'
	const healthyCard = new healthyCardModel()
	export default {
		components: {
			wybPopup
		},
		data() {
			return {
				showMyOrder:false,
				userId:'',
				selectBar: ['处方','检查检验'],
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '处方记录'
				},
				btn: true,
				healthCard: {},
				healthCardList: [],
				patientId: '',
				orderList: [],
				loading: false,
				whichIndex: 0,
				selectIndex: 0
			};
		},
		onShow(){
			this.$refs.loading.open();
			const whichIndex = uni.getStorageSync('whichIndex')
			if(whichIndex){
			    this.whichIndex = whichIndex
			}
			this.userId = uni.getStorageSync('userInfo').userId
			this.apiListHealthCard(this.userId)
		},
		methods: {
			changeBtn(type){
				this.btn = type
				if(this.btn){
					this.apiOrderList(this.patientId)
				}else{
					this.apiTestList(this.patientId)
				}
			},
			apiOrderList(patientId){
				this.orderList = []
				prescription.orderList({patientId}).then(res=>{
					this.$refs.loading.close();
					this.orderList = res.data.filter(n=>(n.status!=0 && n.status!=1))
				}).catch(err=>{
					this.$refs.loading.close();
				})
			},
			apiTestList(patientId){
				this.orderList = []
				prescription.testOrderList({patientId}).then(res=>{
					this.$refs.loading.close();
					this.orderList = res.data
				}).catch(err=>{
					this.$refs.loading.close();
				})
			},
			apiListHealthCard(userId) {
			    healthyCard.listHealthCard({userId}).then(res => {
					this.healthCardList = res.data.healthCardList
					this.healthCard = this.healthCardList[this.whichIndex]
					this.patientId = this.healthCard.hisPatientId
					if(this.btn){
						this.apiOrderList(this.patientId)
					}else{
						this.apiTestList(this.patientId)
					}
			    }).catch((err) => {
					this.$refs.loading.close();
			        console.log(err);
			    })
			},
			changeBar(index){
				this.selectIndex=index
				if(index===0){
					this.apiOrderList(this.patientId)
				}
				if(index===1){
					this.apiInspectionOrderList()
				}
			},
			changeTime(val){
				if(val){
					return val.replace('T','   ');
				}
			},
			changeUser(){
				this.$refs.popup.show()
			},
			selectUser(item,index){
				this.whichIndex = index
				this.healthCard = item
				this.patientId = item.hisPatientId
				if(this.btn){
					this.apiOrderList(this.patientId)
				}else{
					this.apiTestList(this.patientId)
				}
				this.$refs.popup.hide()
			},
			goDetails(item,btn){
				console.log(btn)
				if(btn){
					wx.navigateTo({
						url: `/pagesA/prescriptionOrder/orderDetails?id=${item.id}`
					})
				}else{
					wx.navigateTo({
						url: `/pagesA/prescriptionOrder/testDetails?id=${item.id}&status=${item.payStatus}&pathType=${1}`
					})
				}
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
	.uni-nav{
		height: 100rpx;
		background: linear-gradient(to right,#5EA6F8,#3B7CF4);
	}
	.uni-businessType-choose{
		display: flex;
		width: 100%;
		height: 92rpx;
		padding: 20rpx 24rpx;
		box-sizing: border-box;
		font-size: 26rpx;
	}
	.uni-Show-bar-default{
		font-size: 40rpx;
		font-weight: bold;
	}
	.uni-show-bar{
		color: #5399F6;
	}
	.uni-notShow-bar{
		color: #333333;
	}

	.uni-showBarLine-default{
		height: 4rpx;
		margin-top: 5rpx;
		border-radius: 4rpx;
	}
	.uni-showBarLine-bar{
		background: linear-gradient(90deg, #5EA6F8 0%, #3B7CF4 100%);
	}
	.uni-notShowBarLine-bar{
		background: #F8F8F8;
	}

	.uni-businessType-notChoose{
		color: #B2B2B2;
		margin-top: 5rpx;
		border: 1px solid #CACACA;
		background: #ffffff;
	}
	.uni-box{
		position: absolute;
		top: 160rpx;
		left: 0;
		right: 0;
		.uni-healthCard{
			margin: 0 24rpx;
			background: #FFFFFF;
			padding: 40rpx;
			border-radius: 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.uni-healthCard-name{
				font-size: 40rpx;
				font-weight: bold;
			}
			.uni-healthCard-text{
				color: #B1B1B1;
				text{
					padding-left: 30rpx;
				}
			}
			.uni-tabBtn{
				text-align: center;
				img{
					width: 72rpx;
					height: 72rpx;
					border-radius: 50%;
				}
				view{
					font-weight: bold;
				}
			}
		}
		.uni-uesrList{
			margin: 20rpx 24rpx;
			background: #FFFFFF;
			padding: 0 40rpx;
			border-radius: 10rpx;
			.uni-userList-title{
				padding: 30rpx 0;
				border-bottom: 2rpx solid #F6F6F6;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.uni-userList-label{
					color: #8E8E8E;
					text{
						padding-left: 10rpx;
					}
				}
				.uni-userList-btn{
					padding: 0 10rpx;
					border-radius: 6rpx;
					color: #FFFFFF;
				}
				.uni-userList-btnPay{
					background: linear-gradient(to right,#FFB554,#FFA36A);
				}
				.uni-userList-btnOvertime{
					background: linear-gradient(to right,#A5A5A5,#777777);
				}
				.uni-userList-btnPaid{
					background: linear-gradient(to right,#5EA6F8,#3B7CF4);
				}
			}
			.uni-userListbtn{
				margin-top: 40rpx;
			}
			.uni-userList-content{
				padding: 30rpx 0;
				border-bottom: 2rpx solid #F6F6F6;
				.uni-userList-contentLalel1{
					font-weight: bold;
					color: #989898;
				}
				.uni-userList-contentLalel2{
					font-weight: bold;
					margin-top: 10rpx;
					color: #989898;
				}
				.uni-userList-contentLalel3{
					font-weight: bold;
					margin-top: 10rpx;
				}
				.uni-userList-contentName{
					color: #3E3E3E;
				}
			}
			.uni-userList-timeBox{
				padding: 30rpx 0 40rpx 0;
				.uni-userList-time{
					color: #989898;
				}
				.uni-userList-timeBtn{
					color: #FFFFFF;
					text-align: center;
					border-radius: 10rpx;
					margin: 0 auto;
				}
				.uni-userList-timeBtnPay{
					width: 360rpx;
					height: 70rpx;
					line-height: 70rpx;
					background: linear-gradient(to right,#FFB554,#FFA36A);
				}
				.uni-userList-timeBtnSee{
					width: 360rpx;
					height: 70rpx;
					line-height: 70rpx;
					background: linear-gradient(to right,#5EA6F8,#3B7CF4);
				}
			}
		}
	}
	.uni-healthCardList{
		padding-top: 40rpx;
		text-align: center;
		font-size: 36rpx;
		font-weight: bold;
		color: #2B2B2B;
	}
	.uni-healthCardList-box{
		margin: 30rpx 24rpx 0 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.15);
	}
	.uni-healthCardList-name{
		font-size: 40rpx;
		text-align: center;
		line-height: 160rpx;
		width: 184rpx;
		height: 160rpx;
		color: #FFFFFF;
		border-radius: 20rpx;
	}
	.uni-healthCardList-select{
		background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
	}
	.uni-healthCardList-noSelect{
		background: #CCDFF0;
	}
	.uni-healthCardList-content{
		flex: 1;
		margin-left: 20rpx;
	}
	.uni-healthCardList-contentName{
		text{
			font-size: 24rpx;
			padding-left: 32rpx;
		}
	}
	.uni-healthCardList-contentCard{
		font-size: 24rpx;
	}
	.uni-healthCardList-title{
		margin-left: 40rpx;
		color: #4083F4;
		font-size: 24rpx;
	}
	.uni-tips{
		height: 100rpx;
	}
	.uni-choose-type{
		padding: 30rpx;
		display: flex;
		view{
			display:flex;
			justify-content: center;
			align-items: center;
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

