<template>
    <view>
		<u-bar v-if="myOption" :nav="setNav" :route="'/pagesA/prescriptionOrder/index'"/>
		<u-bar v-if="!myOption" :nav="setNav"/>
        <view class="uni-content">
            <view class="uni-content-top">
                <view class="uni-contentTop">
                	<img src="http://file.aihuihc.com/patient/patientImages/images/logisticsIcon.png" mode=""></img>
                	<view class="">海螺医院 医院药房 配送</view>
                </view>
            </view>
			<view class="uni-content-logistics">
				<view class="" style="display: flex;">
					<view class="" style="width: 200rpx;">
						<view class="" style="text-align: center;">{{isDate}}</view>
						<view class="" style="text-align: center;">{{isTime}}</view>
					</view>
					<view class="uni-schedule-box">
						<img style="width: 14rpx;height: 14rpx;position: absolute;left: -6rpx;top: 4rpx;" src="http://file.aihuihc.com/patient/patientImages/images/logisticsSelect.png" mode=""></img>
						<view style="margin-top: 16rpx; float:left;width: 1px;height: 100rpx; background: #D8D8D8;"></view> 
					</view>
					<view class="" style="margin-left: 50rpx;flex: 1;">药品已确认，等待揽收中</view>
				</view>
				<view v-for="(item,index) in logisticsList" :key="index" class="uni-logistics-box">
					<view class="" style="width: 200rpx;">
						<view class="" style="text-align: center;">{{getDate(item.acceptTime)}}</view>
						<view class="" style="text-align: center;">{{getTime(item.acceptTime)}}</view>
					</view>
					<view class="uni-schedule-box" :style="{ top:3-index*'3' + 'px' }">
						<img style="width: 14rpx;height: 14rpx;position: absolute;left: -6rpx;top: 4rpx;" src="http://file.aihuihc.com/patient/patientImages/images/logisticsEdit.png" mode=""></img>
						<view style="margin-top: 16rpx; float:left;width: 1px;height: 100rpx; background: #D8D8D8;"></view> 
					</view>
					<view class="" style="margin-left: 50rpx;flex: 1;">{{item.remark}}</view>
				</view>
			</view>
        </view>
    </view>
</template>

<script>
	import {prescriptionModel} from '@/models/prescriptionOrder.js'
	const prescription = new prescriptionModel()
    export default {
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '查看物流'
                },
				orderNo: '',
				payTime: '',
				isDate: '',
				isTime: '',
				myOption: false,
				logisticsList: []
            }
        },
		onLoad(options) {
			this.orderNo = options.orderNo
			this.payTime = options.payTime
			this.isDate = this.payTime.trim().split(" ")[0]
			this.isTime = this.payTime.trim().split(" ")[1]
			if(options.type == 1){
				this.myOption = true
				const seeLogisticsData = {
					orderNo: this.orderNo,
					payTime: this.payTime,
					isDate: this.isDate,
					isTime: this.isTime
				}
				uni.setStorageSync('seeLogisticsData',seeLogisticsData)
				if(!this.userId){
					wx.showModal({
						title: '请先登录哦~',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/guide?fromType=seeLogistics'
								})
							}
						}
					})
				}
			}
		},
		onShow() {
			this.getList()
		},
        methods: {
			getList(){
				const data = {
					orderNo: this.orderNo
					// mailNo: 'SF7444407228423'
				}
				prescription.queryOrder(data).then(res=>{
					console.log(res.data)
					this.logisticsList = res.data.routeResps[0].routes
				}).catch(err=>{
					console.log(err)
				})
			},
			getDate(val){
				if(val){
					return val.trim().split(" ")[0]
				}
			},
			getTime(val){
				if(val){
					return val.trim().split(" ")[1]
				}
			}
        }
    }
</script>

<style lang="scss" scoped>
    .uni-content {
		height: 100vh;
		background: #FFFFFF;
    }

    .uni-content-top {
        height: 86rpx;
		line-height: 86rpx;
		background: linear-gradient(90deg, rgba(94, 166, 248, 0.2) 0%, rgba(59, 124, 244, 0.2) 100%);
		.uni-contentTop{
			display: flex;
			align-items: center;
			padding: 0 24rpx;
		}
		img{
			width: 64rpx;
			height: 64rpx;
		}
		view{
			margin-left: 20rpx;
			color: #3E3E3E;
		}
    }
	
	.uni-content-logistics{
		padding: 24rpx;
	}
	.uni-schedule-box{
		position: relative;
		margin-left: 26rpx;
		width: 14rpx;
		text-align: center;
	}
	.uni-logistics-box{
		display: flex;
		position: relative;
		top: -12rpx;
	}
</style>

