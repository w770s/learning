<template>
	<view>
		<u-bar :nav="setNav" :goLoginPage="true"/>
		<view style="padding: 12px;">
			<view class="uni-choose-type">
				<view :class="btn?'selectBtn':'noselectBtn'" @tap="changeBtn(true)">待缴费</view>
				<view :class="!btn?'selectBtn':'noselectBtn'" style="margin-left: 60rpx;" @tap="changeBtn(false)">已缴费</view>
			</view>
			<view v-if="chooseNoOne&&btn">
				<view class='no-recent'>
					<img src="http://file.aihuihc.com/patient/patientImages/images/subscribe.png" class='no-recent-image' />
					<text class='no-recent-text'>您还没有缴费订单哦~</text>
				</view>
				<view style="display: flex;justify-content: center;" @tap="addCard"><button class='uni-add-card'>添加健康卡</button></view>
			</view>
			<view v-if="chooseNoTwo&&!btn">
				<view class='no-recent'>
					<img src="http://file.aihuihc.com/patient/patientImages/images/subscribe.png" class='no-recent-image' />
					<text class='no-recent-text'>您还没有缴费订单哦~</text>
				</view>
				<view style="display: flex;justify-content: center;" @tap="addCard"><button class='uni-add-card'>添加健康卡</button></view>
			</view>
			<!-- 待缴费 -->
			<view v-if="clinicPayOrder.length !== 0 && btn" class="uni-payOrderList" v-for="(item,index) in clinicPayOrder" :key="index" @tap.prevent.stop="goConsumptionList('0',item.clinicNo,item.patientId)">
				<view class="uni-payOrderList-box">
					<view>
						<view v-for="(val,num) in item.prescriptions" :key="num">
							<text class="uni-payOrderList-title uni-bold-title">{{val.prescriptionName}}</text>
							<text class="noPay">未支付</text>
							<text class="uni-price">{{val.totalPayFee/100}}元</text>
						</view>
						<text style="color: #8E8E8EFF;">代缴费24小时内有效，请及时缴费</text>
					</view>
					<view>
						<view class="uni-goPay" @tap.prevent.stop="addClinicPayOrder(item)">确认缴费</view>
					</view>
				</view>
				<view style="padding: 12px;">
					<view style="display:flex;justify-content: space-between;">
						<view class="uni-list-box">就诊专家：<text class="uni-payOrderList-title" style="font-weight: 600;">{{item.departName}}</text></view>
					</view>
					<view class="uni-list-box">
						就诊人：<text class="uni-payOrderList-title">{{item.patientName}}({{formatterCard(item.idCard)}})</text>
					</view>
					<view class="uni-list-box">
						就诊时间：<text class="uni-payOrderList-title">{{item.clinicTime}}</text>
					</view>
				</view>
			</view>
			<!-- 已缴费 -->
			<view v-if="payOrderList.length !== 0 && !btn" class="uni-payOrderList" v-for="(item,index) in payOrderList" :key="index" @tap.prevent.stop="goConsumptionList('1',item.clinicNo,item.patientId)">
				<view class="uni-payOrderList-box">
					<view v-for="(val,num) in item.prescriptions" :key="num">
						<text class="uni-payOrderList-title uni-bold-title">{{val.prescriptionName}}</text>
						<text :class="['payStatus',val.refundStatus===1?'refundFee':'payStatusDefault']">{{val.refundStatus===1?'已退费':'已支付'}}</text>
						<text class="uni-user-price">{{val.totalPayFee/100}}元</text>
					</view>
				</view>
				<view style="padding: 12px;">
					<view style="display:flex;justify-content: space-between;">
						<view class="uni-list-box">就诊专家：<text class="uni-payOrderList-title" style="font-weight: 600;">{{item.departName}}</text></view>
					</view>
					<view class="uni-list-box">
						就诊人：<text class="uni-payOrderList-title">{{item.patientName}}({{formatterCard(item.idCard)}})</text>
					</view>
					<view class="uni-list-box">
						就诊时间：<text class="uni-payOrderList-title">{{item.clinicTime}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	import {
		payOrderModel
	} from '@/models/payOrder.js'
	const payOrder = new payOrderModel()
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	import {
		healthyCardModel
	} from '@/models/healthyCard.js'
	const healthyCard = new healthyCardModel()
	import {
		dateToString
	} from "../../util/util";
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '缴费订单'
				},
				personData:[],
				clinicPayOrder: [],
				payOrderList:[],
				btn: true,
				chooseNoOne: false,
				chooseNoTwo: false,
				userId: '',
				data: {
					userId: '',
					startDate: '',
					endDate: ''
				}
			}
		},
		onShow() {
			let date1 = new Date().toLocaleDateString();
			this.data.startDate = dateToString(date1, 'yyyy-mm-dd')
			var t = new Date(this.data.startDate).getTime()
			var end = t + 24*60*60*1000-1
			let date2 = new Date(end).toLocaleDateString()
			this.data.endDate = dateToString(date2, 'yyyy-mm-dd')
			this.userId = wx.getStorageSync('userInfo').userId
			if(!this.userId){
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=QrCode'
							})
						}
					}
				});
			}
			if(this.userId){
				this.data.userId = this.userId
				this.listPayOrder()
				this.listClinicPayOrder()
				this.apiListHealthCard(this.userId)
			}
		},
		methods: {
			changeBtn(type){
				this.btn = type
			},
			addCard(){
				console.log(this.personData);
				if(this.personData.length>0){
					uni.navigateTo({
						url: '/pagesA/healthyCard/index'
					})
				}
				else if(this.personData.length===0){
					uni.navigateTo({
						url: '/pagesA/healthyCard/addCard'
					})
				}
			},
			apiListHealthCard(userId) {
				healthyCard.listHealthCard({userId}).then(res => {
					this.personData = res.data.healthCardList
				}).catch((err) => {
					console.log(err);
				})
			},
			// 查询待缴费订单列表
			listClinicPayOrder(){
				this.btn = true
				payOrder.listClinicPayOrder(this.data).then((res)=>{
					this.clinicPayOrder = res.data
					if(this.clinicPayOrder.length === 0){
						this.chooseNoOne = true
					}
					if(this.clinicPayOrder.length > 0){
						this.chooseNoOne = false
					}
				}).catch((err)=>{
					this.chooseNoOne = true
					console.log(err)
				})
			},
			// 查询已缴费订单列表
			listPayOrder(){
				this.btn = false
				payOrder.listPayOrder(this.data).then((res)=>{
					this.payOrderList = res.data
					if(this.payOrderList.length === 0){
						this.chooseNoTwo = true
					}
					if(this.payOrderList.length > 0){
						this.chooseNoTwo = false
					}
				}).catch((err)=>{
					this.chooseNoTwo = true
					console.log(err)
				})
			},
			addClinicPayOrder(val){
				const data = {
					clinicNo: val.clinicNo,
					clinicTime: val.clinicTime,
					departId: val.departId,
					departName: val.departName,
					doctorId: val.doctorId,
					doctorName: val.doctorName,
					patientId: val.patientId,
					payFee: val.payFee,
					hospitalId: val.hospitalId
				}
				payOrder.addClinicPayOrder(data).then(res=>{
					if(res.data.payStatus==0){
						const item = {
							openId: uni.getStorageSync('userInfo').openId,
							orderNo: res.data.orderNo,
							tradeChannel: '8006',
							transAmount: val.payFee
						};
						medical.weixinPay(item).then(res => {
							console.log(res)
							wx.requestPayment({
								timeStamp: res.data.timeStamp,
								nonceStr: res.data.nonceStr,
								package: res.data.prepayId,
								paySign: res.data.sign,
								signType: 'MD5',
								success(e) {
									wx.hideLoading();
									if (e.errMsg == 'requestPayment:ok') {
										wx.navigateTo({
											url: './consumptionList?clinicNo=' + val.clinicNo + '&patientId=' + val.patientId + '&flag=1'
										})
										console.log('支付成功')
										wx.showToast({
											title: '支付成功！',
											mask: true
										});
									}
								},
								fail(err) {
									wx.hideLoading();
									console.log('支付失败')
								}
							});
						})
						.catch(err => {
							console.log(err);
						});
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			formatterCard(card){
				if(card){
					return card.substring(0,4)+"******"+ card.substring(14,18)
				}
			},
			goConsumptionList(flag,val,item){
				console.log(flag, val, item);
				if(flag === '0'){
					wx.navigateTo({
						url: './consumptionList?clinicNo=' + val + '&patientId=' + item + '&flag=' + flag
					})
				}else if(flag === '1'){
					wx.navigateTo({
						url: './consumptionList?clinicNo=' + val + '&patientId=' + item + '&flag=' + flag
					})
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.no-recent {
		width: 100%;
		color: #3E3E3E;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.no-recent-image {
		text-align: center;
		height: 360rpx;
		width: 360rpx;
		margin-top:160rpx;
		margin-bottom:40rpx;

	}
	.no-recent-text {
		width: 100%;
		font-size: 40rpx;
		color: #333333;
		text-align: center;
	}

	.uni-choose-type{
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

	.uni-payOrderList {
		background: #FFFFFF;
		margin-top: 20rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
		line-height: 30px;
		.uni-payOrderList-box {
			padding: 12px;
			border-bottom: 1px solid #F6F6F6FF;
		}
	}
	.uni-payOrderList-title {
		color: #3E3E3EFF;
	}
	.uni-bold-title{
		font-weight: bold;
	}
	.uni-code {
		color: #A5A5A5FF;
		font-size: 24rpx;
		float: right;
	}
	.noPay {
		margin-left: 20rpx;
		padding: 2rpx 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		background: linear-gradient(to right, #FFB554FF, #FFA36AFF);
	}
	.payStatus {
		margin-left: 20rpx;
		padding: 2rpx 10rpx;
		font-size: 20rpx;
		color: #FFFFFF;
	}
	.refundFee{
		background: #B2B2B2;
	}
	.payStatusDefault{
		background: #2884FF;
	}
	.uni-list-box {
		color: #989898FF;
	}
	.uni-price {
		float: right;
		color: #FF745FFF;
		font-weight: 600;
	}
	.uni-user-price {
		float: right;
		font-weight: 600;
		color: #3E3E3EFF;
	}
	.uni-goPay {
		margin:0 172rpx 0 170rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: linear-gradient(to right, #FFB554FF, #FFA36AFF);
		color: #fff;
		border-radius: 10rpx;
		text-align: center;
	}
	.uni-add-card{
		width:360rpx;
		height:70rpx;
		margin-top:30rpx;
		padding: 0rpx 50rpx;
		box-sizing: border-box;
		border-radius:16rpx;
		font-size:32rpx;
		color:#fff;
		text-align: center;
		line-height:70rpx;
		background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
	}
</style>



