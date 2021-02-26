<template>
	<view>
		<u-bar :nav="setNav" />
		<view style="position:relative;">
			<scroll-view scroll-x class="uni-day-choose">
				<view :class="['scroll-view-item',chooseIndex===index?'srcoll-active-color':'',item.week!=='全部'?'srcoll-active-height':'']" @tap.prevent.stop="switchDate(item.week,item.days,index)"  v-for="(item,index) in dayList" :key="index">
					<view :style="{'font-size':item.week==='全部'?'30rpx':'20rpx;'}">{{item.week}}</view>
					<view>{{item.day}}</view>
					<view class="uni-scroll-line">
						<view :class="['',chooseIndex===index?'srcoll-active-border':'']"></view>
					</view>
				</view>
			</scroll-view>
			<view style="padding: 124rpx 24rpx 0rpx 24rpx;">
				<view v-if="doctorList.length===0" style="text-align: center;">
					<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/messageKnock.png" />
					<view class='uni-default-tip'>
						<text>医生还没有入驻哦～</text>
					</view>
				</view>
				<view v-for="(item,index) in doctorList" v-if="doctorList.length>0" :key="index">
					<view class="uni-content-box" @tap.prevent.stop="goConsult(item)" v-if="item.type===1">
						<view class="uni-content-line">
							<view class="uni-content-doctor">
								<view>
									<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png" />
								</view>
								<view style="width: 100%;">
									<view class="uni-content-name-box">
										<view style="margin-right:6px;">
											<text style="font-size: 18px;font-weight: bold;margin-right:6px;">{{item.name}}</text>
											<text style="font-size: 15px;">{{item.doctorLevel}}</text>
										</view>
										<view class="uni-content-reserve" @tap.prevent.stop="goConsult(item)">预约</view>
									</view>
									<view class="description">简介: {{item.description?item.description:''}}</view>
								</view>
							</view>
						</view>
					</view>

					<view class="uni-content-box" @tap.prevent.stop="goConsult(item)" v-if="item.type===2">
						<view class="uni-content-line">
							<view class="uni-content-doctor">
								<view>
									<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png" />
								</view>
								<view style="width: 100%;">
									<view class="uni-content-name-box">
										<view style="margin-right:6px;">
											<text style="font-size: 18px;font-weight: bold;margin-right:6px;">{{item.name}}</text>
										</view>
										<view class="uni-content-reserve" @tap.prevent.stop="goConsult(item)">预约</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		 <u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		consultingModel
	} from '@/models/consulting.js'
	const consulting = new consultingModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': ''
				},
				dayList:[{week: '全部',day: '医生'}],
				chooseIndex: 0,
				doctorList: [],
				departId: '',
				hisName: '',
			}
		},
		onLoad(options) {
			this.departId = options.departId
			this.setNav.navTitle = options.name
			this.switchDate('全部','','')
			for(let i=0;i<7;i++){
				let date = this.fun_date(+i,'');
				let dates = this.fun_date(+i,'interface');
				let week= this.fun_week(dates)
				this.dayList.push({"week": week,"day": date,"days":dates});
			}
		},
		methods: {
			fun_week(val) {
				let weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
				let week = weekArray[new Date(val).getDay()];
				return week;
			},
			fun_date(num,type) {
				let date1 = new Date();
				let date2 = new Date();
				date2.setDate(date1.getDate() + num);
				let time2 = ''
				if(type){
					time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1<10?0+''+(date2.getMonth() + 1):(date2.getMonth() + 1)) + "-" + (date2.getDate()<10?0+''+(date2.getDate()):(date2.getDate()));
				}
				else{
					time2 = (date2.getMonth() + 1<10?0+''+(date2.getMonth() + 1):(date2.getMonth() + 1)) + "." + (date2.getDate()<10?0+''+(date2.getDate()):(date2.getDate()));
				}
				return time2;
			},
			formatterWeek(week){
				switch (week) {
					case 1:
						return '一'
					case 2:
						return '二'
					case 3:
						return '三'
					case 4:
						return '四'
					case 5:
						return '五'
					case 6:
						return '六'
					case 7:
						return '日'
				}
			},
			getNowDate(){
				const dateMonth = new Date().getMonth()+1
				const month = dateMonth<10?'0'+dateMonth:dateMonth
				const day = new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate()
				return new Date().getFullYear()+'-'+month+'-'+day
			},
			switchDate(week,day,index){
				this.$refs.loading.open();
				this.doctorList = []
				this.chooseIndex = index
				if(week == '全部'){
					let month = new Date().getMonth() + 1
					let theMonth = month<10?0+''+month:month
					let dates = (new Date().getDate()<10?0+''+(new Date().getDate()):(new Date().getDate()))
					let startDate = new Date().getFullYear() + '-' + theMonth + '-' + dates
					let endDate = this.fun_date(6,'interface')
					const data = {
						type: 1,
						departId: this.departId,
						startDate: startDate+' 00:00:00',
						endDate: endDate+' 23:59:59'
					}
					this.apiListDoctorSchedul(data)
				}else{
					const data = {
						type: 1,
						departId: this.departId,
						startDate: day+' 00:00:00',
						endDate: day+' 23:59:59'
					}
					this.apiListDoctorSchedul(data)
				}
			},
			formatterDate(date,type){
				if(type==='排班'){
					return date.substring(11,16)
				}
				if(type==='咨询'){
					return date.substring(0,10)
				}
			},
			apiListDoctorSchedul(data) {
				consulting.listDoctorSchedules(data).then(res => {
					this.doctorList = res.data
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			goConsult(val) {
				if(val.type == 1){
					uni.navigateTo({
						url:`/pagesA/consulting/doctorDetail?doctorId=${val.relationId}&hisDepartId=${val.departId}`
					})
				}else if(val.type == 2){
					uni.navigateTo({
						url:`/pagesA/consulting/doctorDetail?departId=${val.relationId}&hisDepartId=${val.departId}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.description{
		line-height: 36rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		color: #818181;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.uni-day-choose{
		position:fixed;
		height: 100rpx;
		z-index:1;
		width: 100%;
		background-color: #fff;
		font-size: 30rpx;
		white-space: nowrap;
		.scroll-view-item{
			text-align: center;
			padding: 12rpx 21rpx;
			display: inline-block;
			box-sizing: border-box;
			height: 100rpx;
			vertical-align:top;
			position: relative;
		}

		.srcoll-active-height{
			padding: 20rpx;
		}

		.srcoll-active-color{
			color: #2884FF;
		}

		.uni-scroll-line{
			display:flex;
			height:4rpx;
			align-items:center;
			justify-content:center;
			position:absolute;
			bottom:0;
			right:0;
			left:0;
			.srcoll-active-border{
				height:4rpx;
				width:46rpx;
				background-color: #2884FF;
				border-radius: 2rpx;
			}
		}

	}

	.uni-default-img {
		text-align: center;
		height: 360rpx;
		width: 360rpx;
		margin-top:160rpx;
		margin-bottom:100rpx;
	}

	.uni-default-tip {
		text-align: center;
		font-size: 40rpx;
		color:#333334;
	}

	.uni-content-box {
		height: 100%;
		margin-bottom:20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		position: relative;
		z-index:0;
	}

	.uni-content-line{
		font-size: 24rpx;
		color:#333333;
		padding: 30rpx;
	}

	.uni-content-doctor {
		display: flex;

		img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}

	.uni-content-name-box{
		margin-bottom:16rpx;
		display: flex;
		line-height:60rpx;
		justify-content: space-between;
		font-size:24rpx;

		.uni-content-reserve{
			width:136rpx;
			height:60rpx;
			background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
			border-radius:6rpx;
			line-height:60rpx;
			text-align: center;
			font-size:26rpx;
			color:#fff;
		}
	}

	.uni-content-personName{
		font-size:36rpx;
		font-weight:bold;
		margin-right:12rpx;
	}
</style>
