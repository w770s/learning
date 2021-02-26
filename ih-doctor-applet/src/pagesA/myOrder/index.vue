<template>
	<view>
		<u-topBar :nav="setNav"/>
		<view>
			<view style="position:fixed;width: 100%;height: 49px;background-color: #fff;">
				<view class="uni-imType-choose">
					<view @tap="arrayShowType(true)" :class="['uni-imType-defaultChoose',chooseConsult?'uni-imType-sureChoose':'uni-imType-notChoose']">
						健康咨询
						<view  v-show="chooseConsult" class="uni-imType-tabs"></view>
					</view>
					<view @tap="arrayShowType(false)" :class="['uni-imType-defaultChoose',!chooseConsult?'uni-imType-sureChoose':'uni-imType-notChoose']">
						图文问诊
						<view v-show="!chooseConsult" class="uni-imType-tabs"></view>
					</view>
				</view>
			</view>
			<view class="orderRelevant">
				<img class="img-left" src="http://file.aihuihc.com/ih-doctor-applet/image/myOrder/orderNum.png"></img><text>{{myOrder.orderNumbers}}</text>
				<img class="img-left" src="http://file.aihuihc.com/ih-doctor-applet/image/myOrder/orderPrice.png"></img><text>{{myOrder.orderTotalMoney>=0?myOrder.orderTotalMoney/100:''}}</text>
				<view @click="openDates" class="orderRelevant-right"><text>{{times}}</text><img class="img-right" src="http://file.aihuihc.com/ih-doctor-applet/image/myOrder/open.png"></img></view>
			</view>
		</view>

		<view v-if="myOrder.finallOrderList.length == 0" class='no-recent'>
			<img src="http://file.aihuihc.com/ih-doctor-applet/image/noOrder.png" class='no-recent-image' />
			<text class='no-recent-text'>暂无订单</text>
		</view>

		<view v-if="openDate" class="openDate-text">
			<view v-for="(item,index) in dates" :key="index" @click="getTimes(item)">{{item.date}}</view>
		</view>

		<view class="myOrder-list" v-if="myOrder.finallOrderList.length !== 0">
			<view class="myOrder" v-for="(item,index) in myOrder.finallOrderList" :key="index" @click="goOrderDetails(item)">
				<view class="myOrder-box">
					<img src="http://file.aihuihc.com/ih-doctor-applet/image/myOrder/consultCard.png"></img>
					<view>
						<view class="myOrder-advisoryType" v-if="chooseConsult">健康咨询</view>
						<view class="myOrder-advisoryType" v-if="!chooseConsult">图文问诊</view>
						<view class="myOrder-createTime">{{item.createTime}}</view>
					</view>
				</view>
				<view class="myOrder-state">
					<view v-if="item.status =='2'" class="myOrder-price1">{{item.realPrice/100}}元</view>
					<view v-else class="myOrder-price2"><text>+</text>{{item.realPrice/100}}元</view>
					<view v-if="item.status == '1'" class="myOrder-state1">待接诊</view>
					<view v-if="item.status == '2'" class="myOrder-state2">已取消</view>
					<view v-if="item.status == '3'" class="myOrder-state1">退款中</view>
					<view v-if="item.status == '4'" class="myOrder-state1">已退款</view>
					<view v-if="item.status == '5'" class="myOrder-state1">进行中</view>
					<view v-if="item.status == '6'" class="myOrder-state2">已完成</view>
					<view v-if="item.status == '7'" class="myOrder-state2">已评价</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {orderModel} from '@/models/myOrder.js'
const order = new orderModel()
let app = getApp()
export default {
	data() {
		return {
			chooseConsult: true,
			setNav: {
				'isdisPlayNavTitle': true,
				'navTitle': '我的订单',
				'bg': '#FFFFFF',
				'textColor': '#333333'
			},
			dates: [],
			times: '',
			dataMonth: '',
			doctorId: '',
			openDate: false,
			myOrder:{},
			imList:[]
		}
	},
	onLoad() {
		var nowDate = new Date();
		let date = {
			year: nowDate.getFullYear(),
			month: nowDate.getMonth() + 1
		}
		for(var i=date.month;i>=1;i--){
			this.dataMonth = date.month<10?'-0'+date.month:date.month
			if(i<10){
				this.dates.push({date: date.year+'-0'+i})
				this.times = date.year+'-'+this.dataMonth
			}else{
				this.dates.push({date: date.year+'-'+i})
				this.times = date.year+'-'+this.dataMonth
			}
		}
	},
	onShow() {
		if(uni.getStorageSync('imList')){
			this.imList = uni.getStorageSync('imList')
		}
		if(uni.getStorageSync('chooseConsult')===false||uni.getStorageSync('chooseConsult')===true){
			this.chooseConsult = uni.getStorageSync('chooseConsult')
		}
		this.doctorId = uni.getStorageSync('doctorId')
		this.arrayShowType(this.chooseConsult)
	},
	methods:{
		arrayShowType(type){
			this.chooseConsult = type
			uni.setStorageSync('chooseConsult',this.chooseConsult)
			if(type===true){
				this.apiGetAdvisoryOrderList()
			}else{
				this.apiGetDoctorOrderList()
			}
		},
		getTimes(item){
			this.times = item.date
			this.openDate = false
			this.arrayShowType(this.chooseConsult)
		},
		apiGetDoctorOrderList(){
			const data = {
				doctorId: this.doctorId,
				time: this.times
			}
			order.getDoctorOrderList(data).then(res=>{
				this.myOrder = res.data
				this.myOrder.finallOrderList = this.myOrder.repeatDiagnosisOrderList
			}).catch(err=>{
				console.log(err);
			})
		},
		apiGetAdvisoryOrderList(){
			const data = {
				id: this.doctorId,
				type: 2,
				time: this.times
			}
			order.advisoryOrderList(data).then(res=>{
				this.myOrder = res.data
				this.myOrder.finallOrderList = this.myOrder.advisoryOrderList
			}).catch(err=>{
				console.log(err);
			})
		},
		openDates(){
			if(this.openDate){
				this.openDate = false
			}else{
				this.openDate = true
			}
		},
		goOrderDetails(item){
			if(this.chooseConsult){
				wx.navigateTo({
					url: './orderDetails?orderId=' + item.id
				})
			}else{
				wx.navigateTo({
					url: './orderDetails?orderNo=' + item.orderNo
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.uni-imType-choose{
		display: flex;
		justify-content: space-between;
		width: 100%;
		border: 1px solid #E5E5E5;
		border-left: none;
		border-right: none;
		font-size: 30rpx;
		color: #333333;
		padding: 0rpx 40rpx;
		box-sizing: border-box;
		position: relative;
		.uni-imType-tabs{
			position: absolute;
			height: 2px;
			width: 32px;
			background: #2884FF;
			border-radius: 1px;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.uni-imType-defaultChoose{
		height: 45px;
		width: 50%;
		text-align: center;
		line-height: 45px;
		position: relative;
	}
	.uni-imType-sureChoose{
		font-weight: bold;
	}
	.uni-imType-notChoose{
		font-weight: normal;
	}

	.no-recent {
		width: 100%;
		color: #ccc;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.no-recent-image {
		text-align: center;
		height: 180px;
		width: 180px;
		margin-top:150px;
		margin-bottom:50px;

	}
	.no-recent-text {
		width: 100%;
		text-align: center;
	}
	.orderRelevant{
		margin-top: 46px;
		position: fixed;
		width: 100%;
		background-color: #F5F9FF;
		height: 40px;
		line-height: 40px;
		font-size: 15px;
		color: #333333;
		.orderRelevant-right{
			float: right;
		}
		.img-left{
			width: 14px;
			height: 14px;
			margin: 0 6px 0 12px;
		}
		.img-right{
			width: 20px;
			height: 9.9px;
			margin:  0 12px 0 6px;
		}
	}
	.openDate-text{
		position: fixed;
		z-index: 1;
		top: 102px;
		right: 0px;
		width: 100px;
		view{
			text-align: center;
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #FFFFFF;
			background-color: #577194;
			font-size: 15px;
			color: #FFFFFF;
		}
	}
	.myOrder-list{
		background-color: #FFFFFF;
		margin-top: 89px;
		.myOrder{
			margin: 0 12px 0 12px;
			padding: 10px 0 10px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #E5E5E5;
			.myOrder-box {
				display: flex;
				img{
					width: 25px;
					height: 25px;
					margin-right: 10px;
				}
				.myOrder-advisoryType {
					color: #333333;
					font-size: 15px;
				}
				.myOrder-createTime {
					color: #B2B2B2;
					font-size: 12px;
				}
			}
		}
	}
	.myOrder-price1 {
		color: #FF745F;
		font-size: 15px;
		text-align: right;
	}
	.myOrder-price2 {
		color: #2884FF;
		font-size: 15px;
		text-align: right;
	}
	.myOrder-state1 {
		color: #333333;
		font-size: 12px;
		text-align: right;
	}
	.myOrder-state2 {
		color: #B2B2B2;
		font-size: 12px;
		text-align: right;
	}
</style>
