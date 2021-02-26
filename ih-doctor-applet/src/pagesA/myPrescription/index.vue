<template>
	<view class="content-box">
		<u-topBar :nav="setNav"/>
		<view class="uni-content">
			<view class='uni-user-box' @tap="goSpecialEmr(item)" v-for="(item,index) in prescriptionList" :key="index">
				<view class='uni-user-mes'>
					<view class='uni-user-name'>{{item.name}}<text style="margin-left: 10rpx;">(就诊人名)</text></view>
					<view class='uni-user-packageName'>
						<text style="margin-right:6rpx;" v-if="item.gender!==''">{{item.gender===0?'男':'女'}}</text>
						<text class="uni-text-age">{{item.age?item.age+'岁':'暂无'}}</text>
						<text class="uni-text-age uni-text-time">{{item.prescriptionTime?item.prescriptionTime:'暂无'}}</text>
					</view>
					<view>就诊卡号：<text style="margin-left: 10rpx;">{{item.healthCardNo?item.healthCardNo:'暂无'}}</text></view>
					<view>诊断：<text style="margin-left: 10rpx;">{{item.clinicalDiagnosis?item.clinicalDiagnosis:'暂无'}}</text></view>
					<view v-if="prescribeType==='1'">主诉：<text style="margin-left: 10rpx;">{{item.chiefComplaint?item.chiefComplaint:'暂无'}}</text></view>
					<view v-if="prescribeType==='2'||prescribeType==='3'" v-for="(items,index) in item.prescriptionMedicineList" :key="index">
						<view>
							<text>申请单{{changeNoToChinese(index)}}：</text>
							<text style="margin-left: 20rpx;">{{items.examineName?items.examineName:'暂无'}}</text>
						</view>
					</view>
				</view>
				<view class='uni-user-img'>
					<view v-if="item.status" :class="[(item.status==='0'||item.status==='1'||item.status==='3')?'uni-color-error':'uni-color-normal']">{{item.status?changeStatus(item.status):'暂无'}}</view>
					<view v-if="item.payStatus!==''" :class="['uni-color-normal']">{{(item.payStatus+'')!==''?changePayStatus(item.payStatus):'暂无'}}</view>
					<img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
				</view>
			</view>
			<view v-if="prescriptionList.length===0" class='no-recent'>
				<img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
				<text v-if="prescribeType==='1'" class='no-recent-text'>暂无您的历史处方信息哦~</text>
				<text v-if="prescribeType==='2'" class='no-recent-text'>暂无您的检查处方信息哦~</text>
				<text v-if="prescribeType==='3'" class='no-recent-text'>暂无您的检验处方信息哦~</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {prescriptions} from '@/models/prescriptions.js'
	const prescript = new prescriptions()
	import {NoToChinese} from '@/util/util.js'
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': ''
				},
				payStatus: '',
				hisDoctorId: '',
				prescribeType: '',
				prescriptionList:[],
			}
		},
		onLoad(options) {
			this.hisDoctorId = wx.getStorageSync('doctorId')
			if(options.type){
				this.prescribeType = options.type
				if(options.type==='1'){
					this.setNav.navTitle = '历史处方'
					uni.setStorageSync('prescribeType','1')
					this.apiOrderList()
				}
				if(options.type==='2'){
					this.setNav.navTitle = '检查处方'
					uni.setStorageSync('prescribeType','2')
					this.apiInspectionOrderList(1)
				}
				if(options.type==='3'){
					this.setNav.navTitle = '检验处方'
					uni.setStorageSync('prescribeType','3')
					this.apiInspectionOrderList(2)
				}
			}
			// todo
			console.log(options);
		},
		methods: {
			changeNoToChinese(number){
				return NoToChinese(number+1)
			},
			changePayStatus(status) { // 检查检验
				switch (status) {
					case 0:
						return '待支付'
					case 1:
						return '支付成功'
					case 2:
						return '支付失败'
					case 3:
						return '已退款'
					case 4:
						return '超时未支付'
				}
			},
			apiOrderList(){
				const data = {
					prescriptionDoctorId: this.hisDoctorId
				}
				prescript.orderList(data).then(res=>{
					this.prescriptionList = res.data
				}).catch(err=>{
				})
			},
			apiInspectionOrderList(type){
				prescript.ihInspectionOrderList({type}).then(res=>{
					this.prescriptionList = res.data
				}).catch(err=>{
				})
			},
			changeStatus(status){ //  处方
				switch (status) {
					case '0':
						return '待审方'
					case '1':
						return '审核未通过'
					case '2':
						return '已审方'
					case '3':
						return '超时未支付'
					case '4':
						return '已支付'
					case '5':
						return '支付失败'
					case '6':
						return '已退款'
				}
			},
			goSpecialEmr(item){
				wx.navigateTo({
					url: `/pagesA/myPrescription/details?id=${item.id}`
				})
			},
		}
	}
</script>

<style>
	page{
		background-color: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.content-box{
		padding-bottom: 20rpx;
	}
	.uni-content {
		margin: 15px 12px 0 12px;
	}
	.uni-user-name{
		font-weight: bold;
	}
	.uni-user-mes{
		view{
			margin-bottom: 10rpx;
		}
	}

	.uni-color-normal{
		color:#333333;
	}
	.uni-color-error{
		color:#FF745F;
	}
	.uni-user-packageName {
		font-size: 26rpx;
		line-height: 1;
		color:#B2B2B2;
		margin-bottom: 20rpx;
		.uni-text-age{
			margin-left: 4rpx;
			display: inline-block;
			border-left:1px solid;
			padding-left:3px;
		}
		.uni-text-time{
			border-left:none;
			padding-left:30rpx;
		}
	}
	.uni-user-signTime {
		color:gray;
	}
	.uni-user-img {
		position: absolute;
		top: 30rpx;
		right: 0rpx;
		display: flex;
		align-items: center;
		img{
			margin-left:20rpx;
			margin-right:30rpx;
			width: 16rpx;
			height: 30rpx;
		}
	}
	.uni-user-box {
		position: relative;
		font-size: 30rpx;
		color: gray;
		padding: 30rpx;
		margin-bottom: 30rpx;
		border-radius: 10rpx;
		background-color: #fff;
		color:#333333;
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
