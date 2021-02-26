<template>
	<view class="uni-content">
		<u-bar v-if="myOption" :nav="setNav" :route="'/pagesA/inpatientServices/index'"/>
		<u-bar v-if="!myOption" :nav="setNav"/>
		<view class="uni-monetary">
			<view class="uni-topTime">
				<view style="width:80rpx">
					<view style="width:80rpx" v-if="backBtn" @click="goBack">
						<text class="iconfont leftArrow"></text>
					</view>
				</view>
				<view @tap="dateIsShow=true">
					<text>{{topTime}}</text>
				</view>
				<view style="width:80rpx">
					<view style="width:80rpx" v-if="nextBtn" @click="goNext">
						<text class="iconfont leftArrow" style="transform: rotate(180deg)"></text>
						<img src="http://file.aihuihc.com/patient/patientImages/images/nextBtn.png" mode="">
					</view>
				</view>
			</view>
			<view class="uni-monetary-box">
				<view class="uni-monetary-title">{{billFee?getnum(billFee/100):0}}</view>
				<view>医药费总额/元</view>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-box" v-for="(item,index) in projects" :key="index">
				<view class="uni-listBox" @click="listShow(index)">
					<view class="uni-list-detailed">
						<img class="uni-left-img uni-list-img" src="http://file.aihuihc.com/patient/patientImages/images/hospitalization.png" mode="" />
						<view class="uni-left-title uni-list-title">{{item.projectName}}</view>
					</view>
					<view class="uni-list-detailed">
						<view class="uni-right-title uni-list-title">{{getnum(item.projectFee/100)}}元</view>
						<img v-if="!item.isShow" class="uni-right-img uni-list-img" src="http://file.aihuihc.com/patient/patientImages/images/upcard.png" />
						<img v-if="item.isShow" class="uni-right-img uni-list-img" src="http://file.aihuihc.com/patient/patientImages/images/outcard.png"/>
					</view>
				</view>
				<view v-if="item.isShow">
					<view class="uni-detailed">
						<view class="uni-detailed-list uni-detailed-text">
							<view class="">名称</view>
							<view class="">规格</view>
							<view class="">单价/元</view>
							<view class="">数量</view>
							<view class="">总金额/元</view>
						</view>
					</view>
					<view class="uni-detailed-content uni-detailed-line" v-for="(items,indexs) in item.projectDetails" :key="index">
						<view class="uni-detailed-list uni-detailed-text">
							<view class="">{{items.detailName}}</view>
							<view class="">{{items.detailSpec}}</view>
							<view class="">{{getnum(items.detailPrice/100)}}</view>
							<view class="">{{items.detailCount}}</view>
							<view class="">{{getnum(items.detailFee/100)}}</view>
						</view>
					</view>
					<view @click="listShow(index)" class="uni-cutUp">
						<text>收起</text>
						<img class="uni-gather-back" src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/gather.png" />
					</view>
				</view>
			</view>
			<view class="uni-noTitle" v-if="topTime == changeNewDate(new Date()) && projects.length==0">今日消费会在24点后更新哦~</view>
			<view class="uni-noTitle" v-if="topTime !== changeNewDate(new Date()) && projects.length==0">您今日没有消费哦，祝早日康复～</view>
		</view>
		<view v-if="betweenStart">
			<u-calendar v-model="dateIsShow" :start-date='startDate' :max-date="betweenEnd" :min-date="betweenStart" @change="changeDate" :mode="mode"></u-calendar>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {serviceModel} from '@/models/inpatientServices.js'
	const inpatientService = new serviceModel()
	export default {
		data() {
			return {
				mode: 'date',
				dateIsShow: false,
				betweenStart:'',
				betweenEnd: '',
				setNav: {
					'navigationStyle': 'custom',
					'isdisPlayNavTitle': true,
					'navTitle': '每日消费清单'
				},
				userId: '',
				topTime: '',
				myIndex: 0,
				userInfo: {},
				userList:{},
				myOptions: {},
				nextBtn: false,
				backBtn: false,
				myOption: false,
				projects:[],
				billFee: 0,
				dailyList: {}
			};
		},
		onLoad(options) {
			this.userId = uni.getStorageSync('userInfo').userId
			if(options.userInfo){
				this.userInfo = JSON.parse(options.userInfo)
			}else{
				this.myOption = true
				this.myOptions = JSON.parse(JSON.stringify(options))
				uni.setStorageSync('myOptions',this.myOptions)
				this.userInfo = {
					outTime: this.myOptions.outTime,
					inTime: this.myOptions.inTime,
					hospitalId: this.myOptions.hospitalId,
					inpatientId: this.myOptions.inpatientId
				}
				this.userList = {
					billDate: this.myOptions.billDate
				}
				if(!this.userId){
					wx.showModal({
						title: '请先登录哦~',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/guide?fromType=dailyListIndex'
								})
							}
						}
					})
				}
			}
			if(options.userList){
				this.userList = JSON.parse(options.userList)
			}
		},
		onShow(){
			this.$refs.loading.open();
			if(this.userList.billDate){
				if(this.userInfo.outTime){
					this.betweenEnd = this.changeTime(this.userInfo.outTime)
				}else{
					this.betweenEnd = this.changeNewDate(new Date())
				}
				this.topTime = this.changeTime(this.userList.billDate)
			}else{
				this.betweenEnd = this.changeNewDate(new Date())
				this.topTime = this.changeNewDate(new Date())
			}
			this.betweenStart = this.changeTime(this.userInfo.inTime)
			this.startDate = this.changeNewDate(new Date())
			this.getDetail()
			this.changeBtn()
		},
		methods: {
			getnum(val){
				if(val){
					if (parseInt(val) == parseFloat(val)){
						return val+'.00'
					}else{
						var num = String(val).indexOf(".")+1;//获取小数点的位置
						var count = String(val).length - num;//获取小数点后的个数
						if(count==1){
							return val+'0'
						}else{
							return val
						}
					}
				}
			},
			changeDate(e) {
				this.topTime = e.result;
				if(this.userList.billDate){
					this.betweenEnd = this.changeNewDate(new Date())
					if(this.userInfo.outTime){
						this.betweenEnd = this.changeTime(this.userInfo.outTime)
					}else{
						this.betweenEnd = this.changeNewDate(new Date())
					}
				}else{
					this.betweenEnd = this.changeNewDate(new Date())
				}
				this.betweenStart = this.changeTime(this.userInfo.inTime)
				this.getDetail()
				this.changeBtn()
			},
			changeTime(val){
				if(val){
					let myTime = new Date(val.replace(/-/g,'/'))
					let month = ((myTime.getMonth() + 1)<10?(0+''+(myTime.getMonth() + 1)):(myTime.getMonth() + 1))
					let days = (myTime.getDate()<10?(0+''+myTime.getDate()):myTime.getDate())
					return myTime.getFullYear()+ "-" + month + "-" + days;
				}
			},
			changeNewDate(val){
				return val.getFullYear()+'-'+((val.getMonth()+1)<10?'0'+(val.getMonth()+1):(val.getMonth()+1))+'-'+(val.getDate()<10?'0'+val.getDate():val.getDate())
			},
			seriviceDailyBill(data){
				this.projects= []
				inpatientService.seriviceDailyBill(data).then(res=>{
					this.$refs.loading.close();
					this.billFee = 0
					this.dailyList = res.data.dailyBillRepData
					this.billFee = res.data.dailyBillRepData.billFee
					this.projects = res.data.dailyBillRepData.projects
					this.projects.forEach((item) => {
						return Object.assign({}, item, { isShow: false })
					})
				}).catch(err=>{
					this.$refs.loading.close();
				})
			},
			dateConfirm(){
				this.dateIsShow = false
			},
			goBack(){
				this.$refs.loading.open();
				let time=new Date (this.topTime).getTime()-24*60*60*1000;
				this.topTime = this.changeNewDate(new Date(time))
				this.getDetail()
				this.changeBtn()
			},
			goNext(){
				this.$refs.loading.open();
				let time=new Date (this.topTime).getTime()+24*60*60*1000;
				this.topTime = this.changeNewDate(new Date(time))
				this.getDetail()
				this.changeBtn()
			},
			changeBtn(){
				if(this.topTime === this.betweenEnd){
					this.nextBtn = false
				}else{
					this.nextBtn = true
				}
				if(this.topTime === this.betweenStart){
					this.backBtn = false
				}else{
					this.backBtn = true
				}
			},
			getDetail(){
				const data = {
					billDate: this.topTime,
					hospitalId: this.userInfo.hospitalId,
					inpatientId: this.userInfo.inpatientId
				}
				this.seriviceDailyBill(data)
			},
			listShow(index){
				if(this.projects){
					if (!this.projects[index].isShow) {
						this.$set(this.projects[index], 'isShow', true)
					    this.projects.forEach((item,inde)=>{
					        if(inde!==index){
					            this.$set(this.projects[inde], 'isShow', false)
					        }
					    })
					    return
					}
					if (this.projects[index].isShow) {
					    this.$set(this.projects[index], 'isShow', false)
					    return
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-content{
		height: 100vh;
		background: #FFFFFF;
	}
	.uni-monetary{
		color: #FFFFFF;
		font-size: 30rpx;
		height: 312rpx;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		.uni-topTime{
			width: 100%;
			height: 80rpx;
			background: #79A8F8;
			color: #FFFFFF;
			text-align: center;
			padding:0rpx 160rpx;
			box-sizing: border-box;
			display:flex;
			justify-content: space-around;
			view{
				display: flex;
				justify-content: center;
				align-items: center;
			}
			img{
				width: 20rpx;
				height: 40rpx;
			}
			text{
				margin: 0 40rpx;
			}
		}
		.uni-monetary-box{
			margin: 20rpx 0 90rpx 0;
			text-align: center;
			font-size: 30rpx;
			font-weight: 300;
			.uni-monetary-title{
				font-size: 60rpx;
				font-weight: 600;
			}
		}
	}
	.uni-list{
		background: #FFFFFF;
		position: relative;
		top: -50rpx;
		border-radius: 40rpx 40rpx 0 0;
		.uni-list-box{
			margin: 0 24rpx;
			border-bottom: 1rpx solid #E5E5E5;
			.uni-listBox{
				height: 152rpx;
				line-height: 152rpx;
				display: flex;
				justify-content: space-between;
				.uni-list-detailed{
					display: flex;
					.uni-list-img{
						position: relative;
						border-radius: 50%;
					}
					.uni-left-img{
						width: 72rpx;
						height: 72rpx;
						top: 40rpx;
					}
					.uni-right-img{
						width: 40rpx;
						height: 40rpx;
						top: 60rpx;
					}
					.uni-list-title{
						font-size: 30rpx;
					}
					.uni-left-title{
						color: #333333;
						padding-left: 20rpx;
					}
					.uni-right-title{
						color: #FF745F;
						padding-right: 20rpx;
					}
				}
			}
			.uni-detailed{
				color: #333333;
				background: rgba(40, 132, 255, 0.3);
			}
			.uni-detailed-list{
				margin: 0 20rpx;
				padding: 30rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
			}
			.uni-detailed-text{
				view{
					word-break:break-all;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 20%;
					text-align: center;
				}
			}
			.uni-detailed-line:nth-child(even){
				background: #FFFFFF;
			}
			.uni-detailed-line:nth-child(odd){
				background: #F5F9FF;
			}
			.uni-cutUp{
				margin: 0 0 12rpx 0;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 24rpx;
				text-align: center;
				background: #2884FF;
				color: #FFFFFF;
				.uni-gather-back {
					width: 36rpx;
					height: 20rpx;
					margin-left: 20rpx;
				}
			}
		}
		.uni-noTitle{
			padding: 60rpx;
			height: 200rpx;
			font-size: 30rpx;
			color: #B2B2B2;
			margin: 0 auto;
			text-align: center;
		}
	}
	.uni-date-confirm{
		width: 100%;
		color:#fff;
		font-size: 32rpx;
		border-radius: 0;
		background-color: #2884FF;
	}
</style>
