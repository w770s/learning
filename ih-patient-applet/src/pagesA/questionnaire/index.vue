<template>
	<view>
		<u-bar :nav="setNav" :goLoginPage="true" />
		<view style="padding: 12px;">
			<view v-if="questionList.length==0" style="text-align: center;">
				<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/messageKnock.png" />
				<view class='uni-default-tip'>
					<text>暂无问卷～</text>
				</view>
			</view>
			<view class="flex-item" v-for="(item,index) in questionList" :key="index">
				<view class="uni-doctor-title" style="border-bottom: 0.5px solid #E5E5E5;">
					<view class="" style="display: flex;justify-content: space-between;">
						<view v-if="item.questionnaireId==415" class="" style="font-size: 36rpx;color: #333333;line-height: 80rpx;margin-left: 24rpx;">{{item.questionnaireName}}</view>
						<view v-if="item.questionnaireId==82" class="" style="font-size: 36rpx;color: #333333;line-height: 80rpx;margin-left: 24rpx;">{{item.orderType==1?'咨询问卷':item.orderType==2?'就诊问卷':item.orderType==3?'复诊问卷':'---'}}</view>
						<img v-if="item.isFinish==0" src="http://file.aihuihc.com/patient/patientImages/images/willWrite.png" mode=""></img>
						<img v-if="item.isFinish==1" src="http://file.aihuihc.com/patient/patientImages/images/write.png" mode=""></img>
					</view>
					<view style="height: 50px; margin-top: 20rpx;font-size: 24rpx;color: #333333;margin-left: 24rpx;">
						<view v-if="item.senderType==1" style="font-size: 12px; color: #B2B2B2FF;margin-top:8px;">就诊医生：{{item.senderName?item.senderName:'---'}}</view>
						<view v-if="item.senderType==2" style="font-size: 12px; color: #B2B2B2FF;margin-top:8px;">就诊科室：普通门诊</view>
						<view style="font-size: 12px; color: #B2B2B2FF;margin-top:8px;">就诊时间：{{item.createTime}}</view>
					</view>
				</view>
				<view class="uni-doctor-title" style="padding: 12px;">
					<view style="text-align: right;">
						<text v-if="item.isFinish==0" class="uni-evaluate uni-alreadyEvaluate" @tap="goEvaluate(item)">去评价</text>
						<text v-if="item.isFinish==1" class="uni-evaluate uni-noEvaluate" @tap="goDatails(item)">查看评价</text>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import store from '@/store/index.js'
	let app = getApp()
	import {questionnaireModel} from '@/models/questionnaire.js'
	const question = new questionnaireModel()
	export default {
		data() {
			return {
				showMyOrder:false,
				userId:'',
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '我的问卷'
				},
				advisoryType: '',
				cacheData: [],
				questionList: [],
			};
		},
		onShow(){
			this.userId = uni.getStorageSync('userInfo').userId
			if(this.userId){
				this.getQuestionList()
			}
		},
		methods: {
			getQuestionList(){
				const data = {
					userId: this.userId,
					pageNum: 1,
					pageSize: 1000
				}
				question.questionList(data).then(res=>{
					this.questionList = res.data.list
				}).catch(err=>{
					console.log(err)
				})
			},
			goDatails(item){
				if(item.questionnaireId==415){
					uni.navigateTo({
						url: `/pages/questionnaire/index?id=${item.id}&advisoryType=${1}`
					})
				}
				if(item.questionnaireId==82){
					wx.navigateTo({
						url: './questionnaireDetails?id='+item.id
					})
				}
			},
            goEvaluate(item){
				if(item.questionnaireId==415){
					uni.navigateTo({
						url: `/pages/questionnaire/index?id=${item.id}&advisoryType=${1}`
					})
				}
				if(item.questionnaireId==82){
					if(item.orderType==1){
						this.advisoryType = 1
					}
					if(item.orderType==2){
						this.advisoryType = 3
					}
					if(item.orderType==3){
						this.advisoryType = 2
					}
					uni.navigateTo({
						url: `/pagesA/consulting/evaluatePage?id=${item.id}&advisoryType=${this.advisoryType}`
					})
				}
            },
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

	.uni-doctor-title{
		box-sizing: border-box;
		img{
			width: 130rpx;
			height: 80rpx;
		}
	}
	.uni-evaluate{
		font-size: 26rpx;
		padding: 12rpx 30rpx;
		border-radius: 6rpx;
	}
	.uni-alreadyEvaluate{
		color: #5298F6;
		border: 2rpx solid #5298F6;
	}
	.uni-noEvaluate{
		color: #3E3E3E;
		border: 2rpx solid #989898;
	}
</style>

