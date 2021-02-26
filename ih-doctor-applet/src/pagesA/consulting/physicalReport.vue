<template>
	<view>
		<u-topBar :nav="setNav" />
		<view class="uni-top-back"></view>
		<view class="personal-box">
			<view class="uni-user-box-top">
				<view class="uni-user-box-topBox">
					<view class="uni-block-top">
						<view class='uni-default-pack'>
							<view>{{patientInfo.packageName}}</view>
							<view class='uni-default-signTime'>{{patientInfo.signTime}}</view>
						</view>
						<view class='uni-default-name'>
							<text class='uni-default-personalName'>{{patientInfo.personalName}}</text>
							<text class='uni-default-gender'>
								{{patientInfo.gender===0?'未填写':patientInfo.gender===1?'男':'女'}}
							</text>
							<text>{{patientInfo.age}}岁</text>
						</view>
						<view class='uni-default-checkupNo' style="font-size:12px;">
							<text>体检编号: {{patientInfo.checkupNo}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-content">
				<view class="uni-user-box">
					<view class='uni-default-title'>
						<view>
							<img src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/summary.png"></img>
							<text>检查综述</text>
						</view>
					</view>
					<view class='uni-default-mes'>
						<view class='uni-default-mesText' v-if="index<3" v-for="(item,index) in finSummaryArray" :key="index">
							<text>{{item}}</text>
						</view>
						<view class='uni-default-mesText' v-if="index>3&&showReview" v-for="(item,index) in finSummaryArray" :key="index">
							<text>{{item}}</text>
						</view>
					</view>
					<view class='uni-default-changeIcon' @tap="forDetail('检查综述')">
						<text>{{showReview?'收起详情':'展开详情'}}</text>
						<img v-if="showReview" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/packup.png"></img>
						<img v-if="!showReview" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/unfold.png"></img>
					</view>
				</view>
				<view class="uni-user-box">
					<view class='uni-default-title'>
						<view>
							<img src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/doctorAdvice.png"></img>
							<text>医生建议</text>
						</view>
					</view>
					<view class='uni-default-mes'>
						<view class='uni-default-mesText' v-if="index<3" v-for="(item,index) in finAdviceArray" :key="index">
							<text>{{item}}</text>
						</view>
						<view class='uni-default-mesText' v-if="index>3&&showAdvice" v-for="(item,index) in finAdviceArray" :key="index">
							<text>{{item}}</text>
						</view>
					</view>
					<view class='uni-default-changeIcon' @tap="forDetail('医生建议')">
						<text>{{showAdvice?'收起详情':'展开详情'}}</text>
						<img v-if="showAdvice" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/packup.png"></img>
						<img v-if="!showAdvice" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/unfold.png"></img>
					</view>
				</view>

				<view v-if="listIllnessData.length>0">
					<view class="uni-report-title">
						<text>结果详情</text>
					</view>
					<view class='uni-detail-box' v-for="(item,index) in listIllnessData" :key="index">
						<view :class="['uni-detail-doctor',item.isShow?'uni-detail-active':'',item.illnessList.length>0?'':'uni-buttom-detail']"
						 @tap="reportDetail(index)" v-if="item">
							<view class='uni-detail-boxText'>
								<img v-if="item.illnessList.length>0" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/error.png" />
								<text>【{{item.comboName?item.comboName:''}}】</text>
								{{item.checkDoctorName?item.checkDoctorName:''}} {{item.checkDate?formatterDate(item.checkDate):''}}
							</view>
							<view>
							</view>
							<view>
								<img v-if="!item.isShow" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/spreadInfo.png"></img>
								<img v-if="item.isShow" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/gatherInfo.png"></img>
							</view>
						</view>
						<view v-if="item.illnessList.length>0" :class="['uni-ill-box',item.isShow?'uni-ill-active':'']">
							<view class="uni-ill-tag" v-for="(items,inde) in item.illnessList" :key="inde">{{items.illnessName?items.illnessName:'---'}}</view>
						</view>
						<view v-if="item.isShow">
							<view v-if="(item.lispacs===0||item.lispacs===1)&&item.summary" class="list-summary">
								小结：{{item.summary}}
							</view>
							<view v-if="item.lispacs===0">
								<view class="uni-detail-color uni-detail-colorOther">
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
								<view class="uni-detail-colors uni-detail-colorOther">
									<view>项目名称</view>
									<view>项目结果</view>
									<view>单位</view>
									<view>参考值</view>
									<view>提示</view>
								</view>
								<view :class="['uni-detail-colors',ind%2===0?'uni-detail-blue':'uni-detail-white',items.hint?'warning-row':'']"
								 v-for="(items,ind) in item.resultList" :key="ind">
									<view>{{items.itemName?items.itemName:'---'}}</view>
									<view>{{items.result?items.result:'---'}}</view>
									<view>{{items.unit?items.unit:'---'}}</view>
									<view>{{items.reference?items.reference:'---'}}</view>
									<view :class="[items.hint?'uni-white-font':'']">{{items.hint?items.hint:'---'}}</view>
								</view>
							</view>
							<view v-if="item.lispacs===2">
								<view v-if="item.pacsDataList.length>0" style="line-height:40px;">检查部位:
									<image v-if="items.realUrl" @tap="imgChoose(items.realUrl)" v-for="items in item.pacsDataList" :src="items.realUrl"
									 mode=""></image>
									<view v-else style="line-height:40px;">{{item.comboName?item.comboName:'暂无' }}</view>
								</view>
								<view v-else style="line-height:40px;">检查部位名称:{{item.comboName?item.comboName:'暂无' }}</view>
								<view style="line-height:40px;" v-if="item.summary">
									小结：{{item.summary}}
								</view>
								<view>检查结果:<br>
									<view style="line-height:20px;margin-bottom: 20px;margin-top:5px;letter-spacing:2px;">{{item.resultList[0].result ?item.resultList[0].result:'暂无' }}</view>
								</view>
							</view>
						</view>
						<view @tap="reportDetail(index)" class='uni-detail-changeIcon' v-if="item.isShow">
							<text>收起</text>
							<img class="uni-gather-back" src="http://file.aihuihc.com/ih-doctor-applet/image/consultationList/gather.png"></img>
						</view>
					</view>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	import prompt from '@/components/prompt.vue'
	import {
		consultationList
	} from '@/models/consultationList.js'
	import {
		dateToString
	} from "../../util/util";
	const consultation = new consultationList()
	export default {
		components: {
			prompt
		},
		data() {
			return {
				patientInfo: {},
				listIllnessData: [],
				showReview: false,
				showAdvice: false,
				whichIndex: 0,
				clickNumber: 0,
				promptVisible: false,
				finSummaryArray: [],
				finAdviceArray: [],
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '体检详情'
				}
			}
		},
		onLoad(options) {
			this.patientInfo = JSON.parse(options.listCheckups)
			this.patientInfo.signTime = JSON.parse(options.listCheckups).signTime.substring(0, 10)
			this.apiGetAdviceAndSummarize(this.patientInfo.checkupNo)
			this.apiListCheckupResult(this.patientInfo.checkupNo)
		},
		methods: {
			formatterDate(date) {
				return dateToString(date, 'yyyy-mm-dd')
			},
			apiGetAdviceAndSummarize(checkupNo) {
				consultation.getAdviceAndSummarize({
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
			apiListCheckupResult(checkupNo) {
				consultation.listCheckupResult({
					checkupNo
				}).then((res) => {
					this.listIllnessData = res.data
					this.listIllnessData.forEach((item) => {
						return Object.assign({}, item, {
							isShow: false
						})
					})
				}).catch((err) => {
					console.log(err);
				})
			},
			freeConsult() {
				this.promptVisible = true
			},
			forDetail(type) {
				if (type === '检查综述') {
					this.showReview = !this.showReview
				}
				if (type === '医生建议') {
					this.showAdvice = !this.showAdvice
				}
			},
			reportDetail(index) {
				if (!this.listIllnessData[index].isShow) {
					this.$set(this.listIllnessData[index], 'isShow', true)
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
			},
			back() {
				uni.switchTab({
					url: '../home/index',

				})
			},
			formatTen(num) { // todo
				return num > 9 ? (num + "") : ("0" + num);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.personal-box {
		background: #F6F6F6;
	}

	.uni-content {
		position: relative;
		padding: 10px;
		font-size: 15px;
		color: #333333;
	}

	.uni-user-box {
		padding: 10px;
		font-size: 12px;
		border-radius: 5px;
		margin-bottom: 20px;
		background-color: #fff;

		img {
			height: 20px;
			width: 18px;
			margin-right: 10px;
		}
	}

	.uni-default-mes {
		margin-bottom: 20px;

		.uni-default-mesText {
			margin: 0;
			padding: 5px 0;
		}
	}

	.uni-default-pack {
		font-weight: bold;
		font-size: 16px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		color: #333333;

		.uni-default-signTime {
			font-size: 12px;
			font-weight: normal;
		}
	}

	.uni-default-name {
		margin-bottom: 10px;

		.uni-default-personalName {
			color: #333333;
			margin-right: 5px;
		}

		.uni-default-gender {
			margin-right: 5px;
		}
	}

	.uni-default-checkupNo {
		font-size: 12px;
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
			height: 16px;
			width: 16px;
			margin-right: 5px;

			text {
				font-size: 18px;
			}
		}

		.uni-detail-boxText {
			width: 250px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.uni-detail-doctor {
		background: rgba(40, 132, 255, 0.6);
		color: #fff;
		border-radius: 5px 5px 0px 0px;
		font-size: 12px;
		padding: 10px;
		display: flex;
		justify-content: space-between;
	}

	.uni-ill-box {
		background: rgba(40, 132, 255, 0.6);
		border-radius: 0px 0px 5px 5px;
		display: flex;
		flex-wrap: wrap;
		color: #FBFF9C;
		font-size: 12px;
		padding: 0px 10px;
	}

	.uni-ill-active {
		background: rgba(40, 132, 255, 1);
	}

	.uni-ill-tag {
		padding: 1px 6px;
		border: 1px solid #FBFF9C;
		border-radius: 3px;
		font-size: 12px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.uni-detail-active {
		background: rgba(40, 132, 255, 1);
	}

	.list-summary {
		padding: 10px 0;
	}

	.uni-buttom-detail {
		border-radius: 5px 5px 5px 5px;
	}

	.uni-detail-color {
		display: flex;
		line-height: 40px;
		background-color: #fff;

		view {
			width: 50%;
			text-align: center;
		}
	}

	.uni-detail-comboName {
		line-height: 40px;
	}

	.uni-detail-resultList {
		line-height: 20px;
	}

	.uni-detail-colorOther {
		font-size: 18px;
		font-weight: bold;
	}

	.uni-detail-colors {
		display: flex;
		background-color: #fff;
		line-height: 40px;

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
		border-radius: 0px 0px 5px 5px;

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
		border-radius: 3px;
		color: #fff;
		font-size: 13px;
		text-align: center;
		line-height: 30px;
	}

	.uni-user-box-top {
		padding: 12px;
		height: 69px;

		.uni-user-box-topBox {
			height: 110px;
			position: relative;
		}
	}

	.uni-top-back {
		height: 30px;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.uni-block-top {
		position: absolute;
		background-color: #fff;
		border-radius: 5px;
		top: -40px;
		width: 99%;
		padding: 10px;
		box-sizing: border-box;
		height: 110px;
		z-index: 1;
		color: #B2B2B2;
	}
</style>
