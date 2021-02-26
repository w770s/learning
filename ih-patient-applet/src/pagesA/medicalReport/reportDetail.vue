<template>
	<view>
		<u-bar :nav="setNav" />
		<view class="uni-top-back"></view>
		<view class="uni-user-box-top">
			<view style="height:110px;position: relative;">
				<view class="uni-block-top" style="color:#B2B2B2;">
					<view class='uni-default-pack'>
						<view style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 100%;">{{patientInfo.packageName}}</view>
						<view style="font-size:12px;font-weight: normal;color:#B2B2B2;width:50%;text-align: right;">{{formatterDate(patientInfo.signTime)}}</view>
					</view>
					<view class='uni-default-name'>
						<text style="color:#333333;margin-right: 5px;">{{patientInfo.personalName}}</text>
						<text style="margin-right: 5px;">
							{{patientInfo.gender===0?'未填写':patientInfo.gender===1?'男':'女'}}
						</text>
						<text>{{patientInfo.age}}岁</text>
					</view>
					<view style="font-size:12px;">
						<text>体检编号: {{patientInfo.checkupNo}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-content">
			<view class="uni-user-box">
				<view class='uni-default-title'>
					<view>
						<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/summary.png"></img>
						<text>检查综述</text>
					</view>
				</view>
				<view class='uni-default-mes'>
					<view style="margin: 0;padding: 5px 0;" v-if="index<3" v-for="(item,index) in finSummaryArray" :key="index">
						<text>{{item}}</text>
					</view>
					<view style="margin: 0;padding: 5px 0;" v-if="index>3&&showReview" v-for="(item,index) in finSummaryArray" :key="index">
						<text>{{item}}</text>
					</view>
				</view>
				<view class='uni-default-changeIcon' @tap="forDetail('检查综述')">
					<text>{{showReview?'收起详情':'展开详情'}}</text>
					<img v-if="showReview" src="http://file.aihuihc.com/patient/patientImages/images/consulting/packup.png"></img>
					<img v-if="!showReview" src="http://file.aihuihc.com/patient/patientImages/images/consulting/unfold.png"></img>
				</view>
			</view>
			<view class="uni-user-box">
				<view class='uni-default-title'>
					<view>
						<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/doctorAdvice.png"></img>
						<text>医生建议</text>
					</view>
				</view>
				<view class='uni-default-mes'>
					<view style="margin: 0;padding: 5px 0;" v-if="index<3" v-for="(item,index) in finAdviceArray" :key="index">
						<text>{{item}}</text>
					</view>
					<view style="margin: 0;padding: 5px 0;" v-if="index>3&&showAdvice" v-for="(item,index) in finAdviceArray" :key="index">
						<text>{{item}}</text>
					</view>
				</view>
				<view class='uni-default-changeIcon' @tap="forDetail('医生建议')">
					<text>{{showAdvice?'收起详情':'展开详情'}}</text>
					<img v-if="showAdvice" src="http://file.aihuihc.com/patient/patientImages/images/consulting/packup.png"></img>
					<img v-if="!showAdvice" src="http://file.aihuihc.com/patient/patientImages/images/consulting/unfold.png"></img>
				</view>
			</view>

			<view class='uni-consult-box'>
				<view class="uni-consult-deepService">
					<view style="display: flex;">
						<view class="uni-img-center">
							<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/onlineDoctor.png"></img>
						</view>
						<view style="font-size:20px;font-weight:bold;margin-right:10px;">深度解读服务</view>
					</view>
					<!--                    <view class="uni-consult-time">免费咨询 X 2</view>-->
					<br>
					<view v-if="reportList.length!==0" style="width: 100%;padding: 8px 0px;font-size:12px;color:#B2B2B2;text-align: center">
						依据您的异常指标我们建议您寻求下列科室医生的专业意见
					</view>
					<br>
					<view v-if="reportList.length===0" style="margin-top:7px;width: 100%;display: flex;justify-content: center;align-items: center;">
						<view class="uni-sure-consult" @tap="goForConsult">
							立即咨询
						</view>
					</view>
				</view>

				<view v-if="reportList.length>0" class="uni-specical-tip">
					<view v-for="(item,index) in reportList" :key="index" class="uni-specical-item">
						<view style="display: flex;justify-content: space-between;">
							<view style="font-size: 15px; font-weight: 800">{{item.departName}}</view>
							<view class="uni-freeConsult" @tap="goForConsult(item)">去咨询</view>
						</view>
						<view style="display: flex;flex-wrap: wrap;">
							<view>{{item.diseaseName}}</view>
							<!--                            <view class="uni-the-tips" v-for="(items,inde) in item.tipList" :key="inde">-->
							<!--                                <view>{{items.diseaseName}}</view>-->
							<!--                            </view>-->
						</view>
					</view>
				</view>
			</view>

			<view v-if="listIllnessData.length>0">
				<view class="uni-report-title">
					<text>结果详情</text>
				</view>
				<view class='uni-detail-box' v-for="(item,index) in listIllnessData" :key="index">
					<view v-if="item" @tap="reportDetail(index)">
						<view :class="['uni-detail-doctor',item.isShow?'uni-detail-active':'']">
							<view style="display: flex;justify-content: space-between;">
								<view style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
									<img v-if="item.illnessList.length>0" style="height:16px;width: 16px;margin-right:5px;" src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/error.png" />
									<text style="font-size:18px;">【{{item.comboName?item.comboName:''}}】</text>
									{{item.checkDoctorName?item.checkDoctorName:''}} {{item?formatterDate(item.checkDate):''}}
								</view>
								<view>
									<img v-if="!item.isShow" src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/spreadInfo.png"></img>
									<img v-if="item.isShow" src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/gatherInfo.png"></img>
								</view>
							</view>
							<view v-if="item.illnessList.length>0" :class="['uni-ill-box',item.isShow?'uni-ill-active':'']">
								<view class="uni-ill-tag" v-for="(items,inde) in item.illnessList" :key="inde">{{items.illnessName}}</view>
							</view>
						</view>
					</view>
					<view v-if="item.isShow">
						<view v-if="(item.lispacs===0||item.lispacs===1)&&item.summary" class="list-summary">
							小结：{{item.summary}}
						</view>
						<view v-if="item.lispacs===0">
							<view class="uni-detail-color" style="font-size:18px;font-weight:bold;">
								<view>项目名称</view>
								<view>项目结果</view>
							</view>
							<view :class="['uni-detail-color',ind%2===0?'uni-detail-blue':'uni-detail-white']" v-for="(items,ind) in item.resultList"
							 :key="ind">
								<view>{{items.itemName?items.itemName:'---'}}</view>
								<view>{{items.result?items.result:'---'}}</view>
							</view>
						</view>
						<view v-if="item.lispacs===1">
							<view class="uni-detail-colors" style="font-size:18px;font-weight:bold;">
								<view>项目名称</view>
								<view>项目结果</view>
								<view>单位</view>
								<view>参考值</view>
								<view>提示</view>
							</view>
							<view :class="['uni-detail-colors',ind%2===0?'uni-detail-blue':'uni-detail-white',items.hint?'warning-row':'']"
							 v-for="(items,ind) in item.resultList" :key="ind">
								<view>{{items.itemName ?items.itemName:'---'}}</view>
								<view>{{items.result ?items.result:'---'}}</view>
								<view>{{items.unit ?items.unit:'---'}}</view>
								<view>{{items.reference ?items.reference:'---'}}</view>
								<view :class="[items.hint?'uni-white-font':'']">{{items.hint?items.hint:'---'}}</view>
							</view>
						</view>
						<view v-if="item.lispacs===2">
							<view v-if="item.pacsDataList.length>0" style="line-height:40px;">检查部位:
								<image v-if="items.realUrl" @tap="imgChoose(items.realUrl)" v-for="items in item.pacsDataList" :src="items.realUrl"
								 mode=""></image>
								<view v-else style="line-height:40px;">{{item.comboName?item.comboName:'暂无' }}</view>
							</view>
							<view v-else style="line-height:40px;">检查部位名称：{{item.comboName?item.comboName:'暂无' }}</view>
							<view style="line-height:40px;" v-if="item.summary">
								小结：{{item.summary}}
							</view>
							<view>检查结果：<br>
								<view style="line-height:20px;margin-bottom: 20px;margin-top:5px;letter-spacing:2px;">{{item.resultList[0].result ?item.resultList[0].result:'暂无' }}</view>
							</view>
						</view>
					</view>
					<view @tap="reportDetail(index)" class='uni-detail-changeIcon' v-if="item.isShow">
						<text>收起</text>
						<img class="uni-gather-back" src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/gather.png"></img>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	import {
		dateToString
	} from "../../util/util";
	const medicalReport = new MedicalReportModel()
	export default {
		data() {
			return {
				patientInfo: {},
				listIllnessData: [],
				showReview: false,
				showAdvice: false,
				whichIndex: 0,
				clickNumber: 0,
				finSummaryArray: [],
				finAdviceArray: [],
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '体检详情'
				},
				reportList: []
			}
		},
		onLoad(options) {
			this.$refs.loading.open();
			this.patientInfo = JSON.parse(options.item)
			this.apiGetAdviceAndSummarize(this.patientInfo.checkupNo)
			this.apiListCheckupResult(this.patientInfo.checkupNo)
			this.apiRecommendDepart(this.patientInfo.checkupNo)
		},
		methods: {
			imgChoose(item) {
				var src = item; //获取data-src
				var imgList = [item]; //获取data-list
				//图片预览
				wx.previewImage({
					current: src, // 当前显示图片的http链接
					urls: imgList // 需要预览的图片http链接列表
				})
			},
			formatterDate(date) {
				return dateToString(date, 'yyyy-mm-dd')
			},
			apiGetAdviceAndSummarize(checkupNo) {
				medicalReport.getAdviceAndSummarize({
					checkupNo
				}).then((res) => {
					if (res.data) {
						this.filterPoint(res.data.summarize, this.finSummaryArray, 'summary')
						this.filterPoint(res.data.advice, this.finAdviceArray, 'advice')
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			apiRecommendDepart(checkupNo) { // 标签
				medicalReport.recommendDepart({
					checkupNo
				}).then((res) => {
					this.reportList = res.data
				}).catch((err) => {
					console.log(err);
				})
			},
			apiListCheckupResult(checkupNo) {
				medicalReport.listCheckupResult({
					checkupNo
				}).then((res) => {
					this.listIllnessData = res.data
					this.listIllnessData.forEach((item) => {
						return Object.assign({}, item, {
							isShow: false
						})
					})
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			forDetail(type) {
				if (type === '检查综述') {
					this.showReview = !this.showReview
				}
				if (type === '医生建议') {
					this.showAdvice = !this.showAdvice
				}
			},
			goForConsult(item) {
				if (item.departId) {
					uni.navigateTo({
						url: `/pagesA/consulting/index?id=${item.departId}`
					})
				} else {
					uni.navigateTo({
						url: `/pagesA/consulting/index`
					})
				}
			},
			reportDetail(index) {
				if (!this.listIllnessData[index].isShow) {
					this.$set(this.listIllnessData[index], 'isShow', true)
					this.listIllnessData.forEach((item, inde) => { // todo 点击一个
						if (inde !== index) {
							this.$set(this.listIllnessData[inde], 'isShow', false)
						}
					})
					return
				}
				if (this.listIllnessData[index].isShow) {
					this.$set(this.listIllnessData[index], 'isShow', false)
					return
				}
			},
			filterPoint(str, whichArray, type) {
				if (str) {
					const strArray = str.split('*')
					let returnStr = ''
					strArray.forEach((item) => {
						returnStr += item
					})
					if (returnStr) {
						whichArray = returnStr.split(/\n|\r\n/g, )
						whichArray.some((item, index) => {
							if (item === '' || item === ' ') {
								whichArray.splice(index, 1)
							}
						})
					}
					if (type === 'summary') {
						this.finSummaryArray = whichArray
					}
					if (type === 'advice') {
						this.finAdviceArray = whichArray
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content {
		position: relative;
		padding: 10px;
		font-size: 15px;
		color: #333333;
	}

	.uni-consult-box {
		padding: 10px 0px;
		text-align: center;
		border-radius: 8px;
		background-color: #fff;
		margin-bottom: 15px;

		.uni-img-center {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		img {
			width: 18px;
			height: 20px;
			margin-right: 10px;
		}
	}

	.uni-specical-tip {
		width: 100%;

		.uni-specical-item {
			padding: 10px;
			margin-top: 5px;
			border-left: 2px solid #2884FF;
			background-color: #F5F9FF;

			.uni-the-tips {
				padding: 6px;
				font-size: 12px;
				margin-right: 10px;
				margin-top: 5px;
				border-radius: 8px;
				border: 1px solid #2884FF;
				color: #2884FF;
				text-align: center;

			}
		}
	}

	.uni-consult-deepService {
		padding: 0px 10px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-bottom: 10px;
		align-items: center;
		position: relative;

		.uni-consult-time {
			position: absolute;
			padding: 3px 10px;
			top: 0px;
			right: 0px;
			text-align: center;
			font-size: 15px;
			color: #fff;
			background: linear-gradient(90deg, rgba(255, 181, 84, 1) 0%, rgba(255, 163, 106, 1) 100%);
			border-radius: 100px 0px 0px 100px;
		}

		.uni-sure-consult {
			color: #fff;
			font-size: 16px;
			text-align: center;
			line-height: 35px;
			width: 180px;
			height: 35px;
			background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
			border-radius: 8px;
		}
	}

	.uni-user-box {
		padding: 10px;
		font-size: 12px;
		border-radius: 8px;
		margin-bottom: 20px;
		background-color: #fff;

		img {
			height: 20px;
			width: 18px;
			margin-right: 10px;
		}
	}

	.uni-default-mes {
		margin-bottom: 5px;
	}

	.uni-default-pack {
		font-weight: bold;
		font-size: 18px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		color: #333333;
	}

	.uni-default-name {
		margin-bottom: 10px;
	}

	.uni-default-title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.uni-default-changeIcon {
		text-align: center;
		color: #B2B2B2;

		img {
			width: 18px;
			height: 10px;
			margin-left: 10px;
		}
	}

	.uni-detail-box {
		margin-bottom: 10px;

		img {
			height: 20px;
			width: 20px;
		}
	}

	.uni-detail-doctor {
		background: rgba(40, 132, 255, 0.6);
		color: #fff;
		border-radius: 8px;
		font-size: 12px;
		padding: 10px;

	}

	.uni-ill-box {
		display: flex;
		flex-wrap: wrap;
		color: #FBFF9C;
		font-size: 12px;
	}

	.uni-ill-active {
		background: rgba(40, 132, 255, 1);
	}


	.uni-ill-tag {
		padding: 1px 6px;
		border: 1px solid #FBFF9C;
		border-radius: 8px;
		font-size: 12px;
		margin: 10px 10px 0px 0px;
	}

	.uni-detail-active {
		background: rgba(40, 132, 255, 1);
	}

	.list-summary {
		padding: 10px 0;
	}

	.uni-detail-color {
		display: flex;
		line-height: 28px;
		background-color: #fff;

		view {
			width: 50%;
			text-align: center;
		}
	}

	.uni-detail-colors {
		display: flex;
		background-color: #fff;
		line-height: 25px;

		view {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 20%;
			text-align: center;
		}

		view:nth-of-type(1) {
			width: 25%;
		}

		view:nth-of-type(2) {
			width: 25%;
		}

		view:nth-of-type(4) {
			width: 25%;
		}

	}

	.uni-detail-white {
		background-color: #fff;
	}

	.uni-detail-blue {
		background-color: #CCDFF0;
	}

	.warning-row {
		background: #FF8080 !important;
	}

	.uni-white-font {
		color: #fff;
	}

	.uni-detail-changeIcon {
		padding: 6px;
		height: 28px;
		color: #fff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(40, 132, 255, 1);
		border-radius: 0px 0px 8px 8px;

		.uni-gather-back {
			width: 18px;
			height: 10px;
			margin-left: 10px;
		}
	}

	.uni-report-title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.uni-freeConsult {
		width: 82px;
		height: 30px;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		border-radius: 8px;
		color: #fff;
		font-size: 13px;
		text-align: center;
		line-height: 30px;
	}

	.uni-user-box-top {
		padding: 12px;
		height: 69px;
	}

	.uni-top-back {
		height: 30px;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.uni-block-top {
		position: absolute;
		background-color: #fff;
		border-radius: 8px;
		top: -40px;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		z-index: 1;
	}
</style>
