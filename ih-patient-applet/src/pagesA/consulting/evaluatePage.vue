<template>
	<view>
		<u-bar :nav="setNav"/>
		<view class="uni-content-box">
			<view style="padding-bottom:30px;" v-for="(item,index) in QuestionDetail.ihQuestionnaireTopicData" :key="index">
				<view class="uni-doctor-line-title">
					<view><text v-if="item.type==='1'" style="color:red;margin-right:4rpx;">*</text>{{item.name}}</view>
				</view>
				<view style="color:#B2B2B2;font-size:15px;margin-bottom: 10px;">{{item.remark}}</view>
				<u-sunui-star v-if="item.type!=='3'" @changeStar="changeStar" @tap="starClick(index,item.ihQuestionnaireTopicOptionData)" :defaultStar="0" starSize="2em" :disabledStar="false" />
				<view class="uni-user-box" v-if="item.type==='3'">
					<view v-for="(items,indexs) in item.ihQuestionnaireTopicOptionData" :key="indexs">
						<textarea v-if="!QuestionDetail.isFinish" @input="changeArea(index,indexs,items.optionContent,item.ihQuestionnaireTopicOptionData)" v-model="items.optionContent" placeholder="请输入对医生的评语..." placeholder-style="font-size:15px;color:#B2B2B2;" maxlength="100" class="uni-textarea-area"></textarea>
						<textarea v-if="QuestionDetail.isFinish"  placeholder="请输入对医生的评语..." placeholder-style="font-size:15px;color:#B2B2B2;" maxlength="100" class="uni-textarea-area"></textarea>
					</view>
				</view>
			</view>
			<view style="padding-bottom:30px;">
				<view style="margin-top:50px;">
					<button @tap="sureCheck(QuestionDetail.isFinish)" :class="['uni-user-hasMes',QuestionDetail.isFinish?'uni-user-appraise':'']">确认评价</button>
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
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	import {
		consultationModel
	} from '@/models/consultationOrder.js'
	const consultation = new consultationModel()
	export default {
		data() {
			return {
				setNav: {
					isdisPlayNavTitle: true,
					'navTitle': '满意度评价'
				},
				userId: '',
				orderNo: '',
				orderId: '',
				optionId: '',
				advisoryType: '',
				starNum: '',
				QuestionDetail: {},
				arrayList: [],
				submitList: [],
				indexList: [],
				mustRightArray: [],
				hasError: false,
				fromType: '3',
				statusType: '',
			}
		},
		onLoad(options){
			this.orderId = options.orderId
			this.orderNo = options.orderNo
			this.optionId = options.id
			this.advisoryType = options.advisoryType
			if(options.fromType){
				this.fromType = options.fromType
				this.statusType = options.fromType
			}
		},
		onShow(){
			if(this.optionId){
				let data = {
					"id": this.optionId,
				}
				this.apiDetailQuestion(data)
			}
			else{
				let data = {
					"questionnaireId": 82,
					"correlationNo": this.orderNo,
				}
				this.apiDetailQuestion(data)
			}
		},
		methods: {
			apiddUpdateAdvisoryOrder(status){
				const data = {
					type: status,
				}
				if(this.orderId){
					data['advisoryOrderId'] = this.orderId
				}else{
					data['advisoryOrderNumber'] = this.orderNo
				}
				medical.addUpdateAdvisoryOrder(data).then((res)=>{
					this.$refs.loading.close();
					console.log(this.orderId,this.orderNo)
					uni.navigateTo({
						url: `/pagesA/myOrder/orderDetails?orderNo=${this.orderNo}&orderId=${this.orderId}&fromType=${this.statusType}`

					})
				}).catch((err)=>{
					console.log(err);
				})
			},
			apiUpdateRepeatDiagnosisOrder(status){
				const data = {
					status: status
				}
				if(this.orderId){
					data['orderId'] = this.orderId
				}else{
					data['orderNo'] = this.orderNo
				}
				consultation.updateRepeatDiagnosisOrder(data).then((res)=>{
					this.$refs.loading.close();
					uni.navigateTo({
						url: `/pagesA/consultationOrder/orderDetails?orderNo=${this.orderNo}&orderId=${this.orderId}&id=${res.data.id}&createTime=${res.data.createTime}`
					})
				}).catch((err)=>{
					console.log(err);
				})
			},
			apiDetailQuestion(data) {
				consulting.detailQuestion(data).then(res => {
					this.QuestionDetail = res.data
					this.orderNo = res.data.correlationNo
					console.log(this.orderNo)
					if(this.QuestionDetail.isFinish==1){
						wx.showModal({
							title: '您已评价过了哦~',
							showCancel: false,
							success(res) {
							}
						});
					}
					this.QuestionDetail.ihQuestionnaireTopicData.forEach((item,index)=>{
						if(item.type!=='3'){
							this.mustRightArray.push(index)
						}
					})
					this.setNav.navTitle = res.data.questionnaireName
				}).catch((err) => {
					console.log(err);
				})
			},
			apiSubmitQuestion(data) {
				consulting.submitQuestion(data).then(res => {
					console.log(this.advisoryType)
					if(this.advisoryType == 1){
						if(this.fromType==='3'){
							this.apiddUpdateAdvisoryOrder(7)
						}else{
							uni.navigateTo({
								url: `/pagesA/registerOrder/orderDetails?id=${this.orderId}&fromType=${this.fromType}`
							})
						}
						return
					}
					if(this.advisoryType == 2){
						this.apiUpdateRepeatDiagnosisOrder(7)
					}
					if(this.advisoryType == 3){
						uni.navigateTo({
							url:'../questionnaire/index'
						})
						return
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			changeStar(data){
				this.starNum = data.curStar
			},
			starClick(index,ihQuestionnaireTopicOptionData){
				if(this.starNum){
					if(this.submitList.length>0){
						this.submitList.forEach((item,inde)=>{
							if(item.id===ihQuestionnaireTopicOptionData[this.starNum-1].id){
								return
							}
							else if(item.id!==ihQuestionnaireTopicOptionData[this.starNum-1].id){
								if(index===item.index){
									let theID = ihQuestionnaireTopicOptionData[this.starNum-1].id
									this.submitList[inde] = {content:this.starNum,id:theID,index:index}
								}
								if(index!==item.index){
									if (item.index === index) {
										let theID = ihQuestionnaireTopicOptionData[this.starNum-1].id
										this.submitList[inde] = {content:this.starNum,id:theID,index:index}
									}
									else if(this.arrayList.indexOf(index)===-1){
										this.arrayList.push(index)
										let theID = ihQuestionnaireTopicOptionData[this.starNum-1].id
										this.submitList.push({content:this.starNum,id:theID,index:index})
									}
								}
							}
						})
					}
					else if(this.submitList.length===0){
						let theID = ihQuestionnaireTopicOptionData[this.starNum-1].id
						this.submitList.push({content:this.starNum,id:theID,index:index})
						this.arrayList.push(index)
					}
				}
			},
			changeArea(keyIndex,index,value,ihQuestionnaireTopicOptionData){
				if(this.submitList.length>0){
					this.submitList.forEach((item,inde)=>{
						if(item.index===keyIndex){
							if(item.id===ihQuestionnaireTopicOptionData[index].id){
								this.submitList[inde] = {content:value,id:ihQuestionnaireTopicOptionData[index].id,index:keyIndex}
							}
						}
						else if(item.index!==keyIndex){
							if(this.arrayList.indexOf(keyIndex)===-1){
								this.arrayList.push(keyIndex)
								this.submitList.push({content:value,id:ihQuestionnaireTopicOptionData[index].id,index:keyIndex})
							}
						}
					})
				}
				else if(this.submitList.length===0){
					this.arrayList.push(keyIndex)
					let theID = ihQuestionnaireTopicOptionData[index].id
					this.submitList.push({content:value,id:theID,index: keyIndex})
				}
			},
			sureCheck(isFinish){
				this.hasError = false
				if(isFinish){
					wx.showModal({
						title: '您已评价过了哦~',
						showCancel: false,
						success(res) {
						}
					});
					return;
				}
				if(this.mustRightArray.length>this.submitList){
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: `所有带*的必填项不可为空哦`,
						success(res) {
							if (res.confirm) {
							}
						}
					});
					this.hasError = true
					return
				}
				let submitData = {questionnaireContentList:[]}
				this.indexList = []
				this.submitList.forEach((item)=>{
					this.indexList.push(item.index)
					submitData.questionnaireContentList.push({content:item.content,id:item.id})
				})
				this.mustRightArray.forEach((item)=>{
					if(!this.indexList.includes(item)){
						this.hasError = true
						wx.showModal({
							title: '提示',
							showCancel: false,
							content: `带*的必填项不可为空哦`,
							success(res) {
								if (res.confirm) {
								}
							}
						});
						return
					}
				})
				if(this.submitList.length>0&&!this.hasError){
					this.$refs.loading.open();
					this.apiSubmitQuestion(submitData)
				}
			},
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
