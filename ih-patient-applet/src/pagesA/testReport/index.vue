<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view class="uni-content">
			<view class="uni-choose-type" v-if="userLists.length!=0">
				<view :class="index==current?'selectBtn':'noselectBtn'" @tap="changeBtn(item,index)" v-for="(item,index) in userLists" :key="index">{{item.patientName}}</view>
				<view style="width: 200rpx;" class="content" @click="useOutClickSide">
					<u-easy-select ref="easySelect" size="medium" :placeholder="placeholder" :options="dates" :value="selecValue" @selectOne="selectOne"></u-easy-select>
				</view>
			</view>
			<view v-if="serviceList.length===0" style="text-align: center;">
				<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/report.png" />
				<view class='uni-default-tip'>
					<text>暂无您的检查检验报告哦～</text>
				</view>
			</view>
			<view class='uni-user-box' @tap="reportDetail(item)" v-for="(item,index) in serviceList" :key="index">
				<view style="display: flex;align-items: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
					<view class='uni-user-name' v-if="item.type==0">检查报告</view>
					<view class="uni-user-name" v-if="item.type==1">检验报告</view>
					<view class='uni-user-mes'>
						<view class="uni-item-packageName">{{item.type==0?item.reportTitle:item.type==1?item.inspectionName:'---'}}</view>
						<view>
							<view style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :class="[item.clinicalDiagnosis?'uni-color-error':'uni-color-normal']">报告结果: {{item.clinicalDiagnosis?item.clinicalDiagnosis:'暂无'}}</view>
							<view style="color:#B2B2B2;">检查时间: {{item.type==0?item.reportDate:item.type==1?item.inspectionDate:'---'}}</view>
						</view>
					</view>
				</view>
				<view class='uni-user-img'>
					<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/formore.png" />
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {reportModel} from '@/models/testReport.js'
	const report = new reportModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '检查检验报告'
				},
				isLogin: true,
				openDate: false,
				current: 0,
				placeholder: '',
				selecValue: '',
				storageSelectYear: '',
				userLists: [],
				serviceLists: {},
				serviceList: [],
				dates:[]
			}
		},
		onLoad() {
			this.$refs.loading.open();
			this.userId = uni.getStorageSync('userInfo').userId
			this.dates = []
			this.reoprtList(this.userId)
			this.selecValue = this.placeholder
		},
		methods: {
			reoprtList(userId){
				report.reportList({userId}).then(res=>{
					this.$refs.loading.close();
					this.userLists = res.data
					this.serviceLists = res.data[this.current]
					this.serviceList = this.serviceLists.checkReportGroupByYears[0].data
					this.serviceLists.checkReportGroupByYears.forEach(item=>{
						this.dates.push({value:item.year,label:item.year})
					})
					if(!this.selecValue){
						this.placeholder = this.dates[0].label
					}else{
						this.placeholder = this.selecValue
					}
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err)
				})
			},
			selectOne(options) {
				this.selecValue = options.label
				var thisList = this.serviceLists.checkReportGroupByYears.filter(item=>{
					return item.year == this.selecValue
				})
				this.serviceList = thisList[0].data
			},
			useOutClickSide() {
				this.$refs.easySelect.hideOptions && this.$refs.easySelect.hideOptions()
			},
			changeBtn(item,index){
				this.dates = []
				this.current=index
				this.serviceLists = this.userLists[index]
				this.serviceList = this.serviceLists.checkReportGroupByYears[0].data
				this.serviceLists.checkReportGroupByYears.forEach(item=>{
					this.dates.push({value:item.year,label:item.year})
				})
				this.selecValue = this.placeholder = this.dates[0].label
			},
			reportDetail(item){
				wx.navigateTo({
					url:'./reportDetails?userInfo=' + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content {
		padding: 30rpx 24rpx;
		.uni-choose-type{
			display: flex;
			justify-content: space-between;
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
		.orderRelevant-right{
			width: 200rpx;
			height: 60rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			text{
				font-size: 30rpx;
			}
		}
		.img-right{
			width: 20px;
			height: 9.9px;
			margin:  0 0 0 6px;
		}
		.openDate-text{
			position: fixed;
			z-index: 1;
			top: 220rpx;
			right: 24rpx;
			width: 244rpx;
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
	}
	.uni-user-name{
		color: #fff;
		font-size: 40rpx;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		width: 184rpx;
		height: 160rpx;
		padding: 0rpx 20rpx;
		background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
	}
	.uni-user-mes{
		width: 100%;
		height: 160rpx;
		font-size:24rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		view{
			margin-bottom: 20rpx;
		}
		.uni-color-normal{
			color:#333333;
		}
		.uni-color-error{
			color:#FF745F;

		}
	}
	.uni-item-packageName{
		font-size: 36rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.uni-user-img {
		height: 100%;
		width: 84rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		img{
			height: 40rpx;
			width: 40rpx;
		}
	}
	.uni-user-box {
		position: relative;
		font-size: 24rpx;
		color: gray;
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items:center;
		border-radius: 16rpx;
		height:172rpx;
		background-color: #fff;
		color:#333333;
	}
</style>
