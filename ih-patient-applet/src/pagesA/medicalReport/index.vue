<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view class="uni-content">
			<view v-if="showMedical" style="text-align: center;">
				<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/report.png" />
				<view class='uni-default-tip'>
					<text>绑定健康卡查看体检报告哦～</text>
				</view>
				<view style="display: flex;justify-content: center;" @tap="addCard"><button class='uni-add-card'>添加健康卡</button></view>
			</view>
			<view v-if="medicalList.length>0">
				<view class='uni-user-box' @tap="reportDetail(item)" v-for="(item,index) in medicalList" :key="index">
					<view style="display: flex;align-items: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
						<view class='uni-user-name'>{{item.personalName}}</view>
						<view class='uni-user-mes'>
							<view class="uni-item-packageName">{{ item.packageName }}</view>
							<view>
								<view style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :class="[item.abnormal?'uni-color-normal':'uni-color-error']">报告结果: {{item.checkupResult?item.checkupResult:'暂无'}}</view>
								<view style="color:gray;">体检时间: {{item.signTime }}</view>
							</view>
						</view>
					</view>
					<view class='uni-user-img'>
						<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/formore.png" />
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {createIMClient} from "../../util/util";
	import {MedicalReportModel} from '@/models/medicalReport.js'
	const medicalReport = new MedicalReportModel()
	import {healthyCardModel} from '@/models/healthyCard.js'
	const healthyCard = new healthyCardModel()
	let app = getApp()
	export default {
		data() {
			return {
				userImg: uni.getStorageSync('userInfo').logo,
				userId: uni.getStorageSync('userInfo').userId,
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '体检报告'
				},
				showMedical:false,
				medicalList: [],
				whichIndex: 0,
				fromType: '',
				loading: false
			}
		},
		onLoad(options){
			this.showMedical = false
			if(options.fromType){
				this.fromType = options.fromType
			}
			if(this.userId){
				this.$refs.loading.open();
				this.apiListHealthCard(this.userId)
			}
			else if(!this.userId){
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages/login/guide?fromType=${'medicalIndex'}`
							})
						}
					}
				})
			}
		},
		methods: {
			initIM(){ // todo
				if(this.personData.length>0){
					console.log(this.personData);
					uni.setStorageSync('whichIndex',this.whichIndex)
					// createIMClient(this.personData[this.whichIndex].accId)
				}
			},
			apiListHealthCard(userId) {
				this.$refs.loading.open();
				healthyCard.listHealthCard({userId}).then(res => {
					this.$refs.loading.close();
					this.personData = []
					let cacheData = uni.getStorageSync('loginPage')
					if(cacheData){
						this.personData = cacheData
					}
					uni.setStorageSync('loginPage',JSON.parse(JSON.stringify(res.data.healthCardList)))
					this.personData = res.data.healthCardList
					if(this.fromType){
						this.initIM()
					}
					if(res.data.idCards){
						this.apiListCheckup(res.data.idCards)
					}
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			apiListCheckup(idCards){
				medicalReport.listCheckup({idCards}).then((res)=>{
					const errNormal = new RegExp('异常');// 这个是非全局的匹配
					const rejected = new RegExp('不合格');// 这个是非全局的匹配
					const Normal = new RegExp('暂无异常');// 这个是非全局的匹配
					this.medicalList = res.data
					if(this.medicalList.length===0){
						this.showMedical = true
					}
					this.medicalList.forEach((item)=>{
						if(item.checkupResult){
							if(item.checkupResult.match(errNormal) || item.checkupResult.match(rejected)){
								item.abnormal = false
							}
							else if(item.checkupResult.match(Normal)){
								item.abnormal = true
							}
							else{
								item.abnormal = true
							}
						}
						else{
							item.abnormal = true
						}
					})
				}).catch((err)=>{
					console.log(err);
				})
			},
			addCard(){
				uni.navigateTo({
					url: '/pagesA/healthyCard/addCard'
				})
			},
			reportDetail(item){
				uni.navigateTo({
					url: `./reportDetail?item=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content {
		padding: 30rpx 24rpx;
		.uni-default-tip {
			text-align: center;
			font-size: 40rpx;
			color:#333333;
		}
		.uni-default-img {
			text-align: center;
			height: 360rpx;
			width: 360rpx;
			margin-top:160rpx;
			margin-bottom:40rpx;
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
	}

	.uni-user-name{
		color: #fff;
		font-size: 20px;
		border-radius: 8px;
		display: inline-block;
		margin-right:10px;
		width: 184rpx;
		height:80px;
		line-height: 80px;
		text-align: center;
		padding: 0px 10px;
		box-sizing: content-box;
		overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-break: break-word;
		background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
	}
	.uni-user-mes{
		width: 100%;
		height: 80px;
		font-size:12px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		/*display: flex;*/
		/*flex-wrap: wrap;*/
		/*align-content: space-around;*/
		view{
			/*width: 100%;*/
			margin-bottom: 10px;
		}
		.uni-color-normal{
			color:#333333;
		}
		.uni-color-error{
			color:#FF745F;
		}
	}

	.uni-item-packageName{
		font-size:18px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.uni-user-img {
		height: 100%;
		width: 42px;
		display: flex;
		justify-content: center;
		align-items: center;
		img{
			height: 20px;
			width: 20px;
		}
	}
	.uni-user-box {
		position: relative;
		font-size: 12px;
		color: gray;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items:center;
		border-radius: 8px;
		height:86px;
		background-color: #fff;
		color:#333333;

	}
</style>
