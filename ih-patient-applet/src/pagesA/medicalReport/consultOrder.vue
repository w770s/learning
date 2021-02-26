<template>
	<view>
		<u-bar v-if="isIndex==1" :nav="setNav" />
		<u-bar v-if="isIndex==2" :nav="setNavs" />
		<view class="swiper-box">
			<view class="uni-swipper-title"></view>
			<swiper class="swiper" previous-margin="10px" next-margin='120px' v-if="personData.length>0">
				<span v-for="(item,index) in personData" :key="index">
					<swiper-item>
						<view class="swiper-item" v-if="item.name">
							<view class="swiper-item-person" @tap.prevent.stop="radioTap(index,'person',item)">
								<view style="display: flex;flex-wrap: wrap;align-content: space-between;">
									<view style="font-size: 18px;margin-bottom:4px;font-weight: normal;width: 100%;">{{item.name}}</view>
									<view style="font-size: 15px;color:#B2B2B2;">{{item.gender===0?'男':'女'}} &nbsp;{{item.age}}岁</view>
								</view>
								<view class="uni-radio-choose">
									<radio style="transform:scale(1.2,1.2);" color="#2984FF" :checked="whichIndex===index" />
								</view>
							</view>
						</view>
						<view class="swiper-item" v-if="!item.name">
							<view class="swiper-item-default">
								<view>
									<view @tap="addPerson">
										<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/addPatient.png" />
									</view>
									<view style="font-size: 18px;color:#333333;">添加就诊人</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</span>
			</swiper>
		</view>
		<view class="uni-content">
			<view class="uni-user-box">
				<view class="uni-user-title"><text>情况描述</text></view>
				<view style="position: relative;">
					<textarea v-if="showtextarea" :placeholder="isIndex==1?placeholder1:isIndex==2?placeholder2:''" placeholder-style="font-size:15px;color:#B2B2B2;"
					 maxlength="100" class="uni-textarea-area" @input="hasRequired" v-model="textareaData"></textarea>
					<view v-if="!showtextarea" class="uni-textarea-area">{{textareaData}}</view>
					<view class="uni-textarea-word"><text style="color:#FF745F;margin-right:8px;" v-if="textareaData.length<10&&textareaData.length!==0">请最少输入10个字</text>{{textareaData.length +'/'+ 100}}</view>
				</view>
			</view>
			<view class="uni-user-box">
				<view style="margin-bottom: 10px;">
					<text class="uni-user-title">相关报告</text>
					<text style="color:#B2B2B2;font-size:15px;">请选择你需要发给医生看的报告</text>
				</view>
				<view style="display: flex;justify-content: space-between;">
					<view class="uni-report-list" v-for="(item,index) in showSlectOption" :key="index">
						<view style="color:#2884FF;font-size: 15px;margin-bottom: 3px;">{{item.packageName}}</view>
						<view style="margin-bottom: 3px;">{{item.personalName}}</view>
						<view>{{item.signTime?formatterDate(item.signTime):'暂无'}}</view>
						<img @tap="deleteOption(index,'report')" class="uni-delete-img" src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/cancel.png" />
					</view>
					<view class="uni-report-list uni-report-lists" @tap="showPopcom" v-if="showSlectOption.length<2">
						<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/add.png" />
					</view>
				</view>
			</view>
			<view class="uni-user-box">
				<view class="uni-user-title">相关图片</view>
				<view style="display: flex;flex-wrap: wrap;">
					<view :class="['uni-image-list',index===3||index===7?'uni-image-style':'']" v-for="(item,index) in Imglist" :key="index">
						<img :src="item" class="big-one-pic" />
						<img @tap="deleteOption(index,'img')" :class="['uni-delete-img']" src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/cancel.png" />
					</view>
					<view class="uni-image-list uni-image-style" @tap="chooseImg" v-if="Imglist.length<8">
						<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/add.png" />
					</view>
				</view>
			</view>
			<view class="uni-user-sure">
				<u-button v-if="isIndex==1" :loading="loading" @click="sureConsult" :throttleTime="2000" :customStyle="buttonStyle"
				 type="primary" shape="square" size="default">确认咨询 （{{price/100}}元）</u-button>
				<u-button v-if="isIndex==2" :loading="loading" @click="sureConsult" :throttleTime="2000" :customStyle="buttonStyle"
				 type="primary" shape="square" size="default">确认问诊 （{{price/100}}元）</u-button>
			</view>
			<u-popup ref="popup" :maskClick="twoData" @change="popupchange" type="bottom">
				<view class="uni-bottom-select">
					<view @click="closePopcom" style="text-align: left;color:#B2B2B2;"><text style="margin-left:10px;">算了</text></view>
					<view style="text-align: center;font-weight:bold;">选择报告</view>
					<view @click="surePopcom" style="text-align: right;color:#2884FF;"><text style="margin-right:10px;">确认</text></view>
				</view>
				<view style="height:50px;"></view>
				<view v-if="medicalList.length>0">
					<view class='uni-select-box' @tap.prevent.stop="radioTap(index,'package',item)" v-for="(item,index) in medicalList"
					 :key="index">
						<view style="display: flex;">
							<view :class="['uni-select-all',item.checked?'uni-select-name':'uni-select-default']">{{item.personalName}}</view>
							<view class='uni-select-mes'>
								<view style="color:#333333;font-size: 15px;font-weight:bold;">{{item.packageName}}</view>
								<view :class="[item.abnormal?'uni-color-error':'uni-color-normal']">报告结果:
									{{item.checkupResult?item.checkupResult:'暂无'}}</view>
								<view style="color:gray;">体检时间: {{item.signTime?formatterDate(item.signTime):'暂无'}}</view>
							</view>
						</view>
						<view class='uni-select-img'>
							<radio color="#2984FF" :checked="item.checked" />
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {createConversation, createIMClient} from "../../util/util";
	import {
		MedicalReportModel
	} from '@/models/medicalReport.js'
	const medical = new MedicalReportModel()
	import {
		healthyCardModel
	} from '@/models/healthyCard.js'
	const healthyCard = new healthyCardModel()
	import {
		consultationModel
	} from '@/models/consultationOrder.js'
	const consultation = new consultationModel()
	const app = getApp()
	export default {
		data() {
			return {
				twoData: false,
				visible: true,
				isDetail: false,
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '咨询下单'
				},
				setNavs: {
					'isdisPlayNavTitle': true,
					'navTitle': '问诊下单'
				},
				placeholder1: '请详细描述您需要咨询的问题...',
				placeholder2: '请详细描述就诊人的病情症状、持续时间和用药情况，或者已经确诊的病情和医生建议，我们将保证您的隐私安全。（最少输入10个字）',
				count: 0,
				whichIndex: 0,
				isIndex: 0,
				showtextarea: true,
				showSlectOption: [],
				Imglist: [],
				personData: [],
				listCheckData: [],
				medicalListClone: [],
				medicalList: [],
				filePath: {},
				IdCards: '',
				price: '',
				userId: '',
				openId: '',
				doctorId: '',
				doctorName: '',
				regDate: '',
				clinicTimeTemp: '',
				orderId: '',
				accid: '',
				regFee: '',
				orderNumber: '',
				advisoryType: '',
				onlineEnquiry: false,
				textareaData: '',
				loading: false,
				doctorDetail: {},
				checkupNos: [],
				checkupNo: '',
				medicalReports: [],
				medicalReport: '',
				buttonStyle: {
					textAlign: 'center',
					width: '320px',
					height: '47px',
					lineHeight: '47px',
					borderRadius: '8px',
					color: '#fff',
					background: 'rgba(40, 132, 255, 0.2)'
				}
			}
		},
		onShow() {
			const whichIndex = uni.getStorageSync('whichIndex')
			if (whichIndex) {
				this.whichIndex = whichIndex
			}
		},
		onLoad(options) {
			console.log(options, 'options')
			if (options.order) {
				this.orderNumber = options.order
				this.orderId = options.orderId
			}
			this.accid = options.accId || options.hisDoctorId
			this.price = options.price
			this.doctorId = options.doctorId
			this.doctorName = options.doctorName
			this.isIndex = options.isIndex
			if (options.doctorDetail) {
				this.doctorDetail = JSON.parse(options.doctorDetail)
				this.accid = this.doctorDetail.hisDoctorId
			}
			this.scheduleId = options.scheduleId
			this.regDate = options.regDate
			this.regFee = options.regFee
			this.clinicTimeTemp = options.clinicTimeTemp
			this.userId = uni.getStorageSync('userInfo').userId
			this.openId = uni.getStorageSync('userInfo').openId
			if (this.userId) {
				this.$refs.loading.open();
				this.apiListHealthCard(this.userId)
			}
		},
		methods: {
			restoreIM(account, token) {
				createIMClient(account)
				uni.setStorageSync('whichIndex', this.whichIndex)
				this.medicalList = []
				this.showSlectOption = []
				this.medicalListClone = []
			},
			formatterDate(date) {
				return date.substring(0, 11)
			},
			apiListHealthCard(userId) {
				healthyCard.listHealthCard({
					userId
				}).then(res => {
					this.personData = []
					res.data.healthCardList.forEach((item, index) => {
						if (item) {
							this.personData.push({
								healthCardNo: item.healthCardNo,
								name: item.name,
								gender: item.gender,
								birthday: item.birthday,
								cardId: item.cardId,
								age: item.age,
								accid: item.accId,
								token: item.token,
								id: item.id,
								patientId: item.hisPatientId,
								phone: item.phone
							})
						}
					})
					if (this.personData.length < 5) {
						this.personData.push({
							name: ''
						})
					}
					this.IdCards = this.personData[this.whichIndex].cardId
					this.$refs.loading.close();
					this.apiListCheckup(this.IdCards)
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			apiListCheckup(idCards) {
				medical.listCheckup({
					idCards
				}).then(res => {
					const errNormal = new RegExp('异常'); // 这个是非全局的匹配
					this.medicalList = res.data
					this.medicalListClone = res.data
				}).catch((err) => {
					console.log(err);
				})
			},
			apiAddRepeatDiagnosisOrder(data) {
				consultation.addRepeatDiagnosisOrder(data).then(res => {
					if (res.message == '该患者已存在待支付或者进行中的订单！') {
						wx.navigateTo({
							url: `/pagesA/consultationOrder/orderDetails?id=${res.data.id}&orderNo=${res.data.orderNo}&createTime=${res.data.createTime}&status=${res.data.status}`,
						})
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 5000
						})
					} else {
						this.orderId = res.data.id
						this.price = res.data.realPrice
						this.onlineEnquiry = true
						this.orderNumber = res.data.orderNo
						this.patientId = res.data.patientId
						this.hospitalId = res.data.hospitalId
						this.advisoryType = '2'
						let user = this.personData[this.whichIndex]
						let dataObject = {
							userInfo: user,
							textarea: this.textareaData,
							showSlectOption: this.showSlectOption,
							filePath: this.filePath
						}
						const data = {
							description: this.textareaData,
							healthCardId: this.personData[this.whichIndex].id,
							orderNo: this.orderNumber,
							checkupNo: this.checkupNo ? this.checkupNo : '',
							medicalReport: this.medicalReport ? this.medicalReport : '',
							pageData: JSON.stringify(dataObject),
							type: 2
						}
						consultation.addOrderDataRecordprescription(data).then(res => {
							this.getPay()
						}).catch((err) => {
							console.log(err);
						})
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			apiAddAdvisoryOrder(data) {
				medical.addAdvisoryOrder(data).then(res => {
					this.orderNumber = res.data.orderNumber
					this.orderId = res.data.id
					const data = {
						checkupNo: this.checkupNo,
						description: this.textareaData,
						healthCardId: this.personData[this.whichIndex].id,
						medicalReport: this.medicalReport,
						orderNo: this.orderNumber,
						type: 2
					}
					this.onlineEnquiry = false
					this.advisoryType = '1'
					consultation.addOrderDataRecordadvisory(data).then(res => {
						const data = {
							openId: this.openId,
							orderNo: this.orderNumber,
							tradeChannel: '8006',
							transAmount: this.price
						}
						this.loading = true
						const that = this
						medical.weixinPay(data).then((res) => {
							if (res.data.payStatus === 1) {
								wx.showToast({
									title: '支付成功！',
									mask: true
								})
								that.changePerson(that.accid)
								return;
							}
							wx.requestPayment({
								timeStamp: res.data.timeStamp,
								nonceStr: res.data.nonceStr,
								package: res.data.prepayId,
								paySign: res.data.sign,
								signType: res.data.signType || 'MD5',
								success(e) {
									if (e.errMsg == "requestPayment:ok") {
										setTimeout(() => {
											// const data = that.orderNumber
											// medical.frontNotify(data).then(res => {
												that.apiSelectAdvisoryOrder()
											// }).catch(err => {
											// 	console.log(err)
											// })
										}, 1000)
									}
								},
								fail(err) {
									wx.showToast({
										title: '支付失败,请重新预约支付！',
										con: "none",
									})
									wx.hideLoading();
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										})
									}, 500)
									that.loading = false
								}
							})
						}).catch((err) => {
							that.loading = false
							console.log(err)
						})
					}).catch((err) => {
						console.log(err);
					})
				}).catch((err) => {
					console.log(err);
				})
			},
			getPay() {
				const data = {
					openId: this.openId,
					orderNo: this.orderNumber,
					tradeChannel: '8006',
					transAmount: this.price
				}
				this.loading = true
				const that = this
				medical.weixinPay(data).then((res) => {
					if (res.data.payStatus === 1) {
						wx.showToast({
							title: '支付成功！',
							mask: true
						})
					}
					wx.requestPayment({
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.prepayId,
						paySign: res.data.sign,
						signType: res.data.signType || 'MD5',
						success(e) {
							if (e.errMsg == "requestPayment:ok") {
								setTimeout(() => {
									// const data = that.orderNumber
									// medical.frontNotify(data).then(res => {
										that.changePerson(that.accid)
									// }).catch(err => {
									// 	console.log(err)
									// })
								}, 1000)
							}
						},
						fail(err) {
							wx.showToast({
								title: '支付失败,请重新支付！',
								icon: "none"
							})
							wx.hideLoading();
							that.loading = false
						}
					})
				}).catch((err) => {
					that.loading = false
					console.log(err)
				})
			},
			popupchange(data) {
				this.showtextarea = !data.show
			},
			deleteOption(index, type) {
				if (type === 'report') {
					this.showSlectOption.splice(index, 1)
				}
				if (type === 'img') {
					this.Imglist.splice(index, 1)
				}
			},
			closePopcom() {
				this.medicalList = []
				this.showSlectOption = []
				this.medicalList = JSON.parse(JSON.stringify(this.medicalListClone))
				this.$refs.popup.close()
			},
			showPopcom() {
				if (this.medicalList.length === 0) {
					wx.showToast({
						title: '用户账号暂无相关报告哦~',
						icon: "none",
					})
				}
				if (this.medicalList.length > 0) {
					this.$refs.popup.open()
				}
			},
			surePopcom() {
				if (this.count > 2) {
					uni.showToast({
						title: '最多只能选择两个报告哦',
						icon: 'none',
					})
					return false
				}
				if (this.count <= 2) {
					this.count = 0
					this.showSlectOption = []
					this.medicalList.forEach((item, index) => {
						if (item.checked) {
							this.count++
							if (this.count > 2) {
								uni.showToast({
									title: '最多只能选择两个报告哦',
									icon: 'none',
								})
								return false
							}
							this.showSlectOption.push(item)
						}
					})
					this.$refs.popup.close()
				}
			},
			radioTap(index, type, item) {
				this.checkupNos.push(item.checkupNo)
				if (this.checkupNos.length > 1) {
					this.checkupNo = this.checkupNos.join(",")
				}
				this.medicalReports.push(item.packageName)
				if (this.medicalReports.length > 1) {
					this.medicalReport = this.medicalReports.join(",")
				}
				if (type === 'person' && index !== this.whichIndex) {
					this.IdCards = item.cardId
					this.apiListCheckup(this.IdCards)
					this.whichIndex = index
					this.restoreIM(item.accid, item.token)
				}
				if (type === 'package') {
					this.medicalList[index].checked = !this.medicalList[index].checked;
					this.count = 0
					this.showSlectOption = []
					this.medicalList.forEach((item, index) => {
						if (item.checked) {
							this.count++
							if (this.count > 2) {
								uni.showToast({
									title: '最多只能选择两个报告哦',
									icon: 'none',
								})
								return false
							}
							this.showSlectOption.push(item)
						}
					})
				}
			},
			changePerson(account) {
				console.log(account, 'account')
				let imAccount = 'a' + account
				let user = this.personData[this.whichIndex]
				console.log(user.name,'获取用户信息');
				let dataObject = {
					userInfo: user,
					textarea: this.textareaData,
					showSlectOption: this.showSlectOption,
					filePath: this.filePath
				}
				let consultData = wx.getStorageSync('consultData')
				if (consultData.length > 0) {
					wx.removeStorageSync('consultData')
				}
				this.isDetail = true
				this.loading = false
				let inquiryType =  this.advisoryType === '1'? 'healthInquiry' : 'onlineInquiry'
				let name = `${app.globalData.imClient.id} & ${imAccount} & ${inquiryType}`
				let members = [app.globalData.imClient.id, imAccount, inquiryType]
				let paramsData = `user=${JSON.stringify(dataObject)}&doctorName=${this.doctorName}&patientName=${user.name}`
				let avatar = uni.getStorageSync('userInfo').logo
				let custom = {
					patientAvatar: avatar,
					doctorAvatar: "",
					patientNick: user.name,
					doctorNick: this.doctorName,
					canTalk: '10000',
					alreadyTalk: '0',
					orderId: this.orderId,
					orderNumber: this.orderNumber,
					advisoryType: this.advisoryType,
					businessStatus: 1
				}
				console.log(user.name, this.doctorName, avatar, custom, '创建数据');
				createConversation(custom,name,members,paramsData)
			},
			apiSelectAdvisoryOrder() { // todo 支付两笔问题
				if (this.orderId) {
					const data = {
						advisoryOrderId: this.orderId
					}
					medical.selectAdvisoryOrder(data).then((res) => {
						this.status = res.data.status
						wx.hideLoading();
						if (res.data.status === 1) {
							wx.showToast({
								title: '支付成功！',
								mask: true
							})
							this.changePerson(this.accid)
						} else {
							wx.showToast({
								title: '订单状态异常！',
								mask: true
							})
						}
						this.loading = false
					}).catch((err) => {
						this.loading = false
						console.log(err);
					})
				}
			},
			sureConsult() {
				if (this.personData.length === 0 || this.personData.length === 1) {
					wx.showModal({
						title: '提示',
						content: '您还没有添加健康卡,请添加健康卡后继续预约挂号',
						cancelText: '再想想',
						confirmText: '去添加',
						success: function(res) {
							uni.navigateTo({
								url: `/pagesA/healthyCard/addCard`
							})
						}
					})
					return
				}
				if (this.textareaData.length < 10) {
					wx.showToast({
						title: '情况描述最少输入10个字哦~',
						icon: "none",
					})
					return
				}
				if (!this.orderNumber) {
					if (this.isIndex == 1) {
						const data = {
							healthCardId: this.personData[this.whichIndex].id,
							doctorId: this.doctorId,
							advisoryConfigId: '1',
							isPay: 1,
							price: this.price
						}
						this.apiAddAdvisoryOrder(data)
					} else if (this.isIndex == 2) {
						const data = {
							businessType: 1,
							clinicTime: this.regDate,
							regDate: this.clinicTimeTemp,
							departId: this.doctorDetail.hisDepartId,
							departName: this.doctorDetail.departName,
							healthCardId: this.personData[this.whichIndex].id,
							hospitalId: this.doctorDetail.hospitalId,
							idCardNo: this.personData[this.whichIndex].cardId,
							isPay: 1,
							name: this.doctorDetail.name,
							patientId: this.personData[this.whichIndex].patientId,
							patientName: this.personData[this.whichIndex].name,
							phone: this.personData[this.whichIndex].phone,
							price: this.regFee,
							relationId: this.doctorDetail.hisDoctorId,
							scheduleId: this.scheduleId,
							type: 1
						}
						this.apiAddRepeatDiagnosisOrder(data)
					}
				} else {
					this.advisoryType = '2'
					this.onlineEnquiry = true
					this.getPay()
				}
			},
			addPerson() {
				uni.navigateTo({
					url: '/pagesA/healthyCard/addCard'
				})
			},
			hasRequired() {
				if (this.textareaData.length > 100) {
					uni.showToast({
						title: '已经达到100个字段了',
						icon: 'none',
					})
				}
				if (this.textareaData.length >= 10) {
					this.buttonStyle['background'] = 'rgba(40, 132, 255, 1)'
				}
				if (this.textareaData.length < 10) {
					this.buttonStyle['background'] = 'rgba(40, 132, 255, 0.2)'
				}
			},
			chooseImg() {
				let that = this;
				uni.showActionSheet({
					itemList: ['拍摄', '从相册选择'],
					success: function(e) {
						if (e.tapIndex === 0) {
							// 拍摄
							uni.chooseImage({
								count: 8, // 默认9
								sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
								sourceType: ['camera'], // 可以指定来源是相机
								success: function(res) {
									that.filePath = res;
									that.Imglist = res.tempFilePaths;
								}
							});
						} else if (e.tapIndex === 1) {
							// 从相册选择
							uni.chooseImage({
								count: 8, // 默认9
								sizeType: ['original', 'compressed'],
								sourceType: ['album'], // 可以指定来源是相册
								success: function(res) {
									that.filePath = res;
									that.Imglist = res.tempFilePaths;
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content {
		position: relative;
		padding: 10px;
		background-color: #F6F6F6;
	}

	.all-the-same {
		width: 100px;
		height: 100px;
	}

	.uni-user-box {
		font-size: 12px;
		color: gray;
		border-radius: 8px;
		margin-bottom: 20px;

		.uni-user-title {
			font-size: 18px;
			font-weight: bold;
			margin-right: 6px;
			margin-bottom: 10px;
			color: #333333;
		}

		.uni-image-list {
			margin-bottom: 10px;
			margin-right: 10px;
			position: relative;
			background-color: #fff;
			width: 77px;
			height: 77px;
			border-radius: 8px;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			image {
				width: 30px;
				height: 30px;
			}

			.big-one-pic {
				width: 100%;
				height: 100%;
				border-radius: 8px;
			}

			.uni-delete-img {
				position: absolute;
				top: 0px;
				right: 0px;
				width: 14px;
				height: 14px;
			}
		}

		.uni-image-style {
			margin-right: 0px;
		}

		.uni-report-list {
			position: relative;
			width: 50%;
			background-color: #fff;
			min-height: 80px;
			border-radius: 8px;
			font-size: 12px;
			color: #B2B2B2;
			padding: 10px 15px;
			box-sizing: border-box;

			image {
				width: 30px;
				height: 30px;
			}

			.uni-delete-img {
				position: absolute;
				top: 0px;
				right: 0px;
				width: 14px;
				height: 14px;
			}
		}

		.uni-report-list:nth-of-type(1) {
			margin-right: 10px;
		}

		.uni-report-lists {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.uni-textarea-area {
			width: 100%;
			height: 110px;
			padding: 10px;
			padding-bottom: 30px;
			background-color: #fff;
			box-sizing: border-box;
			color: #333333;
			font-size: 15px;
			border-radius: 8px;
		}

		.uni-textarea-word {
			position: absolute;
			right: 15px;
			bottom: 10px;
			color: #B2B2B2;
		}

	}

	.uni-user-sure {
		// position: fixed;
		// left:28px;
		// bottom: 35px;
		// z-index:100;
		display: flex;
		justify-content: center;
		align-items: center;

		view {
			text-align: center;
			width: 320px;
			height: 47px;
			line-height: 47px;
			border-radius: 8px;
			color: #fff;
			background: rgba(40, 132, 255, 0.2);
		}

		.uni-user-hasMes {
			background: rgba(40, 132, 255, 1);
		}
	}

	.swiper-box {
		position: relative;
		height: 90px;
	}

	.uni-swipper-title {
		height: 52px;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.swiper {
		position: absolute;
		top: 0px;
		width: 100%;
		height: 90px;
	}

	.swiper-item {
		margin-right: 11px;
		padding: 15px;
		box-sizing: border-box;
		height: 90px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.15);
		border-radius: 8px;
	}

	.swiper-item-person {
		display: flex;
		width: 100%;
		justify-content: space-between;

		.uni-radio-choose {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}


	.swiper-item-default {
		text-align: center;

		img {
			height: 34px;
			width: 34px;
			border-radius: 50%;
			margin-right: 10px;
		}
	}

	.uni-bottom-select {
		position: fixed;
		z-index: 1000;
		right: 10px;
		top: 0px;
		left: 0px;
		width: 100%;
		display: flex;
		padding: 10px 0px;
		height: 30px;
		background-color: #fff;

		view {
			font-size: 18px;
			width: 33.3%;
		}
	}

	.uni-select-box {
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.1);
		border-radius: 8px;

		image {
			height: 20px;
			width: 20px;
			border-radius: 50%;
			background-color: gray;
			margin-right: 10px;
		}
	}

	.uni-select-all {
		padding: 10px;
		width: 80px;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.uni-select-name {
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.uni-select-default {
		background: #CCDFF0;
	}

	.uni-select-mes {
		padding-top: 10px;
		font-size: 12px;

		view {
			margin-bottom: 10px;
		}

		.uni-color-normal {
			color: #000000;
		}

		.uni-color-error {
			color: red;
		}
	}

	.uni-select-img {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
