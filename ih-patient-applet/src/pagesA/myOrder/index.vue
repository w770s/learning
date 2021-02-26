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
						<view style="height: 25px; line-height: 25px; font-size: 18px; font-weight: 600; color: #333333;">图文咨询</view>
						<view class="stateText" v-if="item.status === 1">待接诊</view>
						<view class="stateText" v-if="item.status === 2">已取消</view>
						<view class="stateText" v-if="item.status === 3">退款中</view>
						<view class="stateText" v-if="item.status === 4">已退款</view>
						<view class="stateText" v-if="item.status === 6">已完成</view>
						<view class="stateText" v-if="item.status === 7">已评价</view>
						<view v-if="item.status === 5||item.status === 0">
							<button @tap.prevent.stop="goConsult(item,'2')" v-if="item.status === 5" class="stateBtn" type="primary" style="width: 108px;">进入咨询对话</button>
							<button @tap.prevent.stop="payMoney(item)" v-if="item.status === 0" class="stateBtn" type="primary" style="width: 68px;">去支付</button>
							<!--<button v-if="item.status ===6" class="stateBtn" type="primary" style="width: 68px;">去评价</button>-->

						</view>
					</view>
				</view>
				<view class="uni-doctor-title" style="display: flex;border-bottom: none;">
					<img style="width: 50px; height: 50px;border-radius:50%;" :src="item.doctorImageList" />
					<view style="height: 50px; margin-left: 10px;">
						<text style="font-size: 18px; font-weight: 600; color: #333333FF;">{{item.doctorName}}</text>
						<text class="docText">{{item.level}}</text>
						<text class="docText">{{item.departName}}</text>
						<view style="font-size: 12px; color: #B2B2B2FF;margin-top:8px;">{{item?item.createTime:'---'}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {getConversationInquiry} from "../../util/util";
	let app = getApp()
	import {
		myOrderModel
	} from '@/models/myOrder.js'
	const myOrder = new myOrderModel()
	export default {
		data() {
			return {
				showMyOrder:false,
				userId:'',
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '我的订单'
				},
				cacheData: [],
				doctorList: [],
			};
		},
		onShow(){
			this.showMyOrder = false
			this.userId = uni.getStorageSync('userInfo').userId
			if (this.userId) {
				this.cacheData = uni.getStorageSync('myOrderPage')
				this.$refs.loading.open();
				this.getAdvisoryOrder(this.userId)
			}
			if(!this.userId){
				this.doctorList = []
				this.showMyOrder = true
			}
		},
		methods: {
			goforDetail(item){
				wx.navigateTo({
					url: `./orderDetails?orderNo=${item.orderNumber}&orderId=${item.orderId}`,
				})
			},
			goConsult(item,businessStatus){
				let account = 'a'+item.doctorId
				let members = [app.globalData.imClient.id, account,'healthInquiry']
				getConversationInquiry(members)
			},
			payMoney(item) {
				wx.navigateTo({
					url: `/pagesA/medicalReport/consultOrder?accId=${item.accId}&order=${item.orderNumber}&orderId=${item.orderId}&price=${item.price}&doctorName=${item.doctorName}`,
				})
			},
			reduceDimension(arr) { // 二位数组
				let reduced = [];
				if(arr){
					arr.forEach((item1)=>{
						if(item1.doctorImageList){
							item1.doctorImageList.forEach((item2) => {
								if (item2.imageType === 1 && item2.sourceType === 10) {
									item1.doctorImageList = item2.url
								}
							})
							reduced = reduced.concat(item1);
						}
					})
					return reduced;
				}
			},
			getAdvisoryOrder(userId){
				myOrder.advisoryOrderList({userId}).then((res) => {
					const messData = this.reduceDimension(res.data)
					this.doctorList = messData
					if(this.doctorList.length === 0){
						this.showMyOrder = true
					}
					this.$refs.loading.close();
				}).catch((err) => {
					this.showMyOrder = true
					this.$refs.loading.close();
					console.log(err);
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

