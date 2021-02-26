<template>
	<view>
		<u-bar :nav="setNav"/>
		<view class="uni-content-box">
			<view style="padding-bottom:30px;">
				<view style="color:#333333;font-size:40rpx;margin-bottom: 10px;">星级评分</view>
				<view style="color:#B2B2B2;font-size:30rpx;margin-bottom: 10px;">医生的接诊态度您觉得怎么样？</view>
				<u-sunui-star :defaultStar="starText" starSize="2em" :disabledStar="true" />
				<view v-if="contentText" style="color:#333333;font-size:40rpx;margin-bottom: 10px;margin-top: 60rpx;">评语描述</view>
				<view v-if="contentText" style="color:#3E3E3E;font-size:30rpx;margin-bottom: 10px;">{{contentText}}</view>
			</view>
			<view style="background: #F6F6F6;" v-if="replyContent">
				<view class="" style="padding: 20rpx 26rpx;">
					<view style="color:#333333;font-size:40rpx;margin-bottom: 10px;">医生回复</view>
					<view style="color:#3E3E3E;font-size:30rpx;margin-bottom: 10px;word-wrap:break-word;word-break:break-all;">{{replyContent}}</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {questionnaireModel} from '@/models/questionnaire.js'
	const question = new questionnaireModel()
	export default {
		data() {
			return {
				setNav: {
                    'isdisPlayNavTitle': true,
					'navTitle': '满意度评价'
				},
				questionId: '',
				starText: 2,
				contentText: '',
				replyContent: '',
				questionDetails: [],
				starDetails: [],
				starDetail: [],
				contentDetails: []
			}
		},
		onLoad(options){
			this.questionId = options.id
		},
		onShow(){
			this.getQuestionDetails()
		},
		methods: {
			getQuestionDetails(){
				const data = {
					id: this.questionId
				}
				question.questionListDetails(data).then(res=>{
					this.replyContent = res.data.replyContent
					this.questionDetails = res.data.ihQuestionnaireTopicData
					this.starDetails = this.questionDetails.filter(item=>{
						return item.type==1
					})
					this.contentDetails = this.questionDetails.filter(item=>{
						return item.type==3
					})
					this.starDetails[0].ihQuestionnaireTopicOptionData.forEach(items=>{
						if(items.optionContent){
							this.starText = items.optionContent
						}
					})
					this.contentText = this.contentDetails[0].ihQuestionnaireTopicOptionData[0].optionContent
					console.log(this.starText,this.contentText)
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.uni-content-box {
		height: 100vh;
		background-color: #fff;
		padding: 15px 12px;
		font-size: 15px;
	}

	.uni-doctor-line-title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.uni-grade-box{
		padding: 10px;
		border-bottom: 1px solid #E5E5E5;
	}

	.uni-grade-box:nth-last-child(1){
		border-bottom: none;
		padding-bottom: none;
	}

	.uni-textarea-area {
		width: 100%;
		height: 110px;
		padding:10px 10px 30px 10px;
		background-color: #fff;
		box-sizing: border-box;
		color: #333333;
		font-size: 15px;
		border-radius: 8px;
		border:1px solid #E5E5E5;
		margin-bottom: 20rpx;
	}

	.uni-user-hasMes {
		text-align: center;
		width: 640rpx;
		height: 94rpx;
		line-height: 94rpx;
		border-radius: 16rpx;
		color: #fff;
		background: rgba(40, 132, 255, 1);
	}

	.uni-user-appraise{
		background: #E5E5E5;
	}
</style>
