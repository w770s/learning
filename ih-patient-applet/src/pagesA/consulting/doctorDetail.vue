<template>
	<view style="height: 100vh;background-color: #fff;">
		<u-bar :nav="setNav" v-if="!fromType" />
		<u-bar :nav="fromNav" v-if="fromType" />
		<u-prompt :visible.sync="promptVisible" title="确认咨询" :closeName='closeName1' :confirmName='confirmName1' @close="clickPromptClose" @confirm="clickPromptConfirm">
			<view style="padding: 40rpx;color:#333333;">
				<view style="margin-bottom: 50rpx;" v-for="(item,index) in tipsArray" :key="index">{{item?item:''}}</view>
			</view>
		</u-prompt>

		<u-prompt :visible.sync="scheduleIndex" title="提示" :closeName='closeName2' :confirmName='confirmName2' @close="clickTipsClose" @confirm="clickTipsConfirm">
			<view style="padding: 40rpx;color:#333333;">
				<view style="margin-bottom: 50rpx;"><text style="color: #FFFFFF;">，，</text>在线问诊只针对我院的复诊患者，需要在我院近两个月内有过就诊记录，请知悉！</view>
			</view>
		</u-prompt>

		<view class="position:relative;">
			<view class="uni-content-box">
				<view class="uni-content-item" v-if="!doctorDetail.name">
					<view class="uni-content-theItem" style="padding: 30rpx;">
						<view class="uni-content-doctor" style="display: flex;align-items: center;">
							<view>
								<img src="http://file.aihuihc.com/patient/1594102392338oX39I43DV-PE-Wq21nWwnlqroj3A.jpg" />
							</view>
							<view style="font-size: 36rpx;">
								<text>{{doctorListName}}{{isRemoteClinic?'远程就诊':''}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-content-item" v-if="doctorDetail.name">
					<view class="uni-content-theItem">
						<view class="uni-content-doctor">
							<view>
								<img :src="doctorDetail.doctorImageList" />
							</view>
							<view>
								<view style="margin-bottom:6rpx;font-size:30rpx">
									<text class="uni-content-doctorName">{{doctorDetail.name}}</text>
									<text style="margin-right:12rpx;">{{doctorDetail.level}}</text>
									<text>{{doctorDetail.departName}}</text>
								</view>
								<view class="uni-ill-list">
									<view class="uni-ill-item" v-for="(item,index) in doctorDetail.doctorDiseaseList" :key="index">
										{{item.name}}
									</view>
								</view>
							</view>
						</view>
						<view style="margin-bottom: 10rpx;">【擅长】{{doctorDetail.specialty?doctorDetail.specialty:'暂无'}}</view>
						<view style="margin-bottom: 10rpx;" v-if="showDetail">【简介】{{doctorDetail.description?doctorDetail.description:'暂无'}}</view>
					</view>
					<view @tap="dcotorDetail" class="uni-content-consult-box">
						<view>
							<text style="margin-right:14rpx;">{{showDetail?'收起':'展开医生详情'}}</text>
							<img v-if="!showDetail" src="http://file.aihuihc.com/patient/patientImages/images/consulting/unfold.png"></img>
							<img v-if="showDetail" src="http://file.aihuihc.com/patient/patientImages/images/consulting/packup.png"></img>
						</view>
					</view>
				</view>

				<!-- 顶部导航 -->
				<view>
					<view class="uni-doctor-title">
						<view v-if="whichIndex === 0" style="margin-right:20rpx;" :class="['uni-select-line',whichIndex===0?'uni-select-name':'uni-default-name']">
							<view>{{selctTab[0].name}}</view>
							<view v-if="whichIndex===0" class="uni-color-see"></view>
						</view>
						<view v-if="whichIndex === 1" style="margin-right:20rpx;" :class="['uni-select-line',whichIndex===1?'uni-select-name':'uni-default-name']">
							<view>{{selctTab[1].name}}</view>
							<view v-if="whichIndex===1" class="uni-color-see"></view>
						</view>
						<view v-if="whichIndex === 2" style="margin-right:20rpx;" :class="['uni-select-line',whichIndex===2?'uni-select-name':'uni-default-name']">
							<view>{{selctTab[2].name}}</view>
							<view v-if="whichIndex===2" class="uni-color-see"></view>
						</view>
					</view>

					<!-- 健康咨询 -->
					<view v-if="whichIndex === 0" class="uni-consult-box">
						<view v-if="doctorDetail.name&&doctorDetail.price!=null">
							<view class="uni-consult-tip">
								<view>
									<text style="font-size:36rpx;font-weight: bold;">图文咨询</text>
									<text style="color:#2884FF;margin-left:20rpx">1天</text>
								</view>
								<view class="uni-consult-price">{{doctorDetail.price?(doctorDetail.price/100)+'元':(doctorDetail.price)+'元'}}</view>
							</view>
							<view style="margin-bottom:20rpx">
								<view>1、医生24小时内接诊，未接诊自动退款</view>
								<view>2、下单后您可以对话1天 </view>
								<view>3、医生的回复仅作为建议，具体诊疗请前往医院</view>
							</view>
							<view style="display: flex;justify-content: center;">
								<view class="uni-consult-now" @tap="consultNow(1)">立即咨询</view>
							</view>
						</view>
						<view v-if="!doctorDetail.name||doctorDetail.price==null" style="display: flex;justify-content: center;align-items: center;">
							<img style="width:200rpx;height:200rpx;" src="http://file.aihuihc.com/patient/patientImages/images/reseverd.png"></img>
						</view>
					</view>

					<!-- 预约挂号 -->
					<view v-if="whichIndex === 1" class="uni-consult-box uni-consult-boxs">
						<view v-if="apiData.length===0" style="display: flex;justify-content: center;align-items: center;">
							<img style="width:200rpx;height:200rpx;" src="http://file.aihuihc.com/patient/patientImages/images/reseverd.png"></img>
						</view>
						<view style="font-size:40rpx;text-align:center;" v-if="apiData.length>0">
							<view>
								<view style="font-size: 30rpx;font-weight: bold;">{{fun_date(0,'')}} - {{fun_date(6,'')}}</view>
								<view>
									<view class="uni-doctor-timeLine">
										<view v-for="(item,index) in selectList" :key="index" style="padding:10rpx 0rpx;">
											<view style="font-size: 18rpx;margin-bottom: 5rpx;">{{fun_week(item)}}</view>
											<view style="font-size: 24rpx;">{{fun_date(index,'')}}</view>
										</view>
									</view>
									<view style="padding:0rpx 18rpx;">
										<view style="display: flex;justify-content: space-around;border-bottom: 2rpx solid #fff;">
											<view v-for="(item,index) in doctorLists" :key="index" :class="['uni-has-rightBorder',index===6?'uni-no-rightBorder':'']">
												<view>
													<view class="uni-time-select-default uni-time-select-noColor" v-if="!item.rankWork[0].shiftName"></view>
													<view @tap="goConsulting(item.rankWork[0])">
														<view class="uni-time-select-default" v-if="item.rankWork[0].shiftName&&item.rankWork[0].regLeaveCount !== 0">{{item.rankWork[0].shiftName}}</view>
														<view class="uni-time-select-appoint" v-if="item.rankWork[0].shiftName&&item.rankWork[0].regLeaveCount == 0">
															<view style="width:100%;">{{item.rankWork[0].shiftName}}</view>
															<view class="uni-time-regLeaveCount">{{item.rankWork[0].regLeaveCount === 0?'约满': ''}}</view>
														</view>
													</view>
												</view>
											</view>
										</view>
										<view class="uni-doctor-grayLine"></view>
										<view style="display: flex;justify-content: space-around;border-top: 2rpx solid #fff;">
											<view v-for="(item,index) in doctorLists" :key="index" :class="['uni-has-rightBorder',index===6?'uni-no-rightBorder':'']">
												<view>
													<view class="uni-time-select-default uni-time-select-noColor" v-if="!item.rankWork[1].shiftName"></view>
													<view @tap="goConsulting(item.rankWork[1])">
														<view class="uni-time-select-default" v-if="item.rankWork[1].shiftName&&item.rankWork[1].regLeaveCount !== 0">{{item.rankWork[1].shiftName}}</view>
														<view class="uni-time-select-appoint" v-if="item.rankWork[1].shiftName&&item.rankWork[1].regLeaveCount == 0">
															<view style="width:100%;">{{item.rankWork[1].shiftName}}</view>
															<view class="uni-time-regLeaveCount">{{item.rankWork[1].regLeaveCount === 0?'约满': ''}}</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 在线问诊 -->
					<view  v-if="whichIndex === 2" class="uni-consult-box uni-consult-boxs">
						<view v-if="apiDatas.length===0" style="display: flex;justify-content: center;align-items: center;">
							<img style="width:200rpx;height:200rpx;" src="http://file.aihuihc.com/patient/patientImages/images/reseverd.png"></img>
						</view>
						<view style="font-size:40rpx;text-align:center;" v-if="apiDatas.length>0">
							<view>
								<view style="font-size: 30rpx;font-weight: bold;">{{fun_date(0,'')}} - {{fun_date(6,'')}}</view>
								<view>
									<view class="uni-doctor-timeLine">
										<view v-for="(item,index) in selectList" :key="index" style="padding:10rpx 0rpx;">
											<view style="font-size: 18rpx;margin-bottom: 5rpx;">{{fun_week(item)}}</view>
											<view style="font-size: 24rpx;">{{fun_date(index,'')}}</view>
										</view>
									</view>
									<view style="padding:0rpx 18rpx;">
										<view style="display: flex;justify-content: space-around;border-bottom: 2rpx solid #fff;">
											<view v-for="(item,index) in schedulList" :key="index" :class="['uni-has-rightBorder',index===6?'uni-no-rightBorder':'']">
												<view>
													<view class="uni-time-select-default uni-time-select-noColor" v-if="!item.rankWork[0].shiftName"></view>
													<view @click="selectSchedu(item.rankWork[0],index,0)">
														<view class="uni-time-select-default" v-if="item.rankWork[0].shiftName&&item.rankWork[0].regLeaveCount !== 0&&!item.rankWork[0].isSelect">{{item.rankWork[0].shiftName}}</view>
														<view class="uni-time-select-default uni-button-color" v-if="item.rankWork[0].shiftName&&item.rankWork[0].regLeaveCount !== 0&&item.rankWork[0].isSelect">{{item.rankWork[0].shiftName}}</view>
														<view class="uni-time-select-appoint" v-if="item.rankWork[0].shiftName&&item.rankWork[0].regLeaveCount == 0">
															<view style="width:100%;">{{item.rankWork[0].shiftName}}</view>
															<view class="uni-time-regLeaveCount">{{item.rankWork[0].regLeaveCount === 0?'约满': ''}}</view>
														</view>
													</view>
												</view>
											</view>
										</view>
										<view class="uni-doctor-grayLine"></view>
										<view style="display: flex;justify-content: space-around;border-top: 2rpx solid #fff;">
											<view v-for="(item,index) in schedulList" :key="index" :class="['uni-has-rightBorder',index===6?'uni-no-rightBorder':'']">
												<view>
													<view class="uni-time-select-default uni-time-select-noColor" v-if="!item.rankWork[1].shiftName"></view>
													<view @click="selectSchedu(item.rankWork[1],index,1)">
														<view class="uni-time-select-default" v-if="item.rankWork[1].shiftName&&item.rankWork[1].regLeaveCount !== 0&&!item.rankWork[1].isSelect">{{item.rankWork[1].shiftName}}</view>
														<view class="uni-time-select-default uni-button-color" v-if="item.rankWork[1].shiftName&&item.rankWork[1].regLeaveCount !== 0&&item.rankWork[1].isSelect">{{item.rankWork[1].shiftName}}</view>
														<view class="uni-time-select-appoint" v-if="item.rankWork[1].shiftName&&item.rankWork[1].regLeaveCount == 0">
															<view style="width:100%;">{{item.rankWork[1].shiftName}}</view>
															<view class="uni-time-regLeaveCount">{{item.rankWork[1].regLeaveCount === 0?'约满': ''}}</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="whichIndex === 2" style="margin-top: 30rpx;" class="uni-consult-box">
						<view>
							<view class="uni-consult-tip">
								<view>
									<text style="font-size:36rpx;font-weight: bold;">图文问诊</text>
								</view>
								<view class="uni-consult-price">{{apiDatas[0].regFee?(apiDatas[0].regFee/100)+'元':(apiDatas[0].regFee)+'元'}}/次</view>
							</view>
							<view style="margin-bottom:20rpx">
								<view>1、使用图文信息咨询医生，医生根据情况可进行下诊断，开处方</view>
								<view>2、医生24小时内接诊,未接诊自动退款</view>
								<view>3、互联网医院需在线缴费，所有缴费不支持线上申请退费</view>
								<view>4、在线问诊仅支持自费,暂不支持医保支付</view>
								<view>5、在线问诊只针对我院的复诊患者,需要近两个月在我院有过就诊记录</view>
							</view>
							<view style="display: flex;justify-content: center;">
								<view class="uni-consult-now" @tap="consultNow(2)">立即问诊</view>
							</view>
						</view>
					</view>
				</view>

				<view style="padding-bottom:60rpx;" v-if="evaluateList.length>0">
					<view class="uni-doctor-line-title">
						<view>患者评价({{backList.length}})</view>
						<view @tap="forMoreDatail" v-if="backList.length>3">
							<text class="uni-doctor-line-more">查看更多</text>
							<img src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png"></img>
						</view>
					</view>

					<view v-for="(item,index) in evaluateList" :key="index" class="uni-grade-box">
						<view class="uni-grade-flexBox">
							<view style="display: flex;">
								<view style="margin-right:30rpx;">{{item.receiveName?isFormatName(item.receiveName):'***'}}</view>
								<view class="uni-grade-RateBox">
									<view>评分：</view>
									<u-sunui-star v-if="item.optionContent" :defaultStar="item.optionContent" starSize="1em" :disabledStar="true" />
								</view>
							</view>
							<view style="font-size:24rpx;color:#B2B2B2;">{{item.createTime?formatterDate(item.createTime):'---'}}</view>
						</view>
						<view class="uni-grade-textarea">{{item.textareaData}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {dateToString,getRequest,createIMClient} from '../../util/util.js'
	import {
		consultingModel
	} from '@/models/consulting.js'
	const consulting = new consultingModel()
	import {
		healthyCardModel
	} from '@/models/healthyCard.js'
	const healthyCard = new healthyCardModel()
	let app = getApp()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '医生详情'
				},
				fromNav: {
					'navTitle': '医生详情'
				},
				selctTab: [{
						name: '健康咨询',
					},
					{
						name: '预约挂号',
					},
					{
						name: '在线问诊',
					}
				],
				doctorLists: [
					{
						rankWork:[{},{}]
					},
					{
						rankWork:[{},{}]
					},
					{
						rankWork:[{},{}]
					},
					{
						rankWork:[{},{}]
					},
					{
						rankWork:[{},{}]
					},
					{
						rankWork:[{},{}]
					},
					{
						rankWork:[{},{}]
					}
				],
				schedulList: [
					{
						rankWork:[{isSelect:false},{isSelect:false}]
					},
					{
						rankWork:[{isSelect:false},{isSelect:false}]
					},
					{
						rankWork:[{isSelect:false},{isSelect:false}]
					},
					{
						rankWork:[{isSelect:false},{isSelect:false}]
					},
					{
						rankWork:[{isSelect:false},{isSelect:false}]
					},
					{
						rankWork:[{isSelect:false},{isSelect:false}]
					},
					{
						rankWork:[{isSelect:false},{isSelect:false}]
					}
				],
				whichIndex: 0,
				closeName1: '再想想',
				confirmName1: '确定',
				closeName2: '取消',
				confirmName2: '我已知悉',
				userId: '',
				userImg: '',
				doctorId: '',
				hisDepartId: '',
				advisoryTips: '',
				doctorListName: '',
				backList: '',
				regDate: '',
				regFee: '',
				scheduleId: '',
				clinicTimeTemp: '',
				healthCardIndex: '',
				doctorDetail:{},
				dayList: [],
				dayLists:[],
				apiData: [],
				apiDatas: [],
				tipsArray: [],
				personData: [],
				selectList: [],
				evaluateList: [],
				doctorListRegister: [],
				showDetail: false,
				promptVisible: false,
				isRemoteClinic: false,
				scheduleIndex: false
			}
		},
		onLoad(options){
			this.healthCardIndex = uni.getStorageSync('whichIndex')
			this.userId = uni.getStorageSync('userInfo').userId
			this.userImg = uni.getStorageSync('userInfo').logo
			let isRemoteClinic = uni.getStorageSync('isRemoteClinic')
			if (isRemoteClinic) {
				this.isRemoteClinic = isRemoteClinic
			}
			if(options.q){
				let queryAll = decodeURIComponent(options.q);
				this.qrData = getRequest(queryAll);
				this.hisDepartId = this.qrData.hisDepartId
				this.hospitalId = this.qrData.hospitalId
				this.fromType = this.qrData.fromType
				this.doctorId = this.qrData.doctorId
				uni.setStorageSync('doctorQr',{hisDepartId:this.hisDepartId,fromType:this.fromType,doctorId:this.doctorId})
			}
			if(!options.q){
				if(options.hisDepartId){
					this.hisDepartId = options.hisDepartId
				}
				if(options.hospitalId){
					this.hospitalId = options.hospitalId
				}
				if(options.fromType){
					this.fromType = options.fromType
				}
				if(options.doctorId){
					this.doctorId = options.doctorId
				}
			}
			if(!this.userId){
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=doctorDetails'
							})
						}
					}
				});
				return
			}
			this.$refs.loading.open();
			if(this.userId){
				this.apiListHealthCard(this.userId)
			}
			if(this.hisDepartId){
				for(let i=0;i<7;i++){
					this.selectList.push(this.fun_date(i,'interface'))
				}
				const data = {
					type: 2,
					departId: this.hisDepartId,
					startDate: this.fun_date(0,'interface')+' 00:00:00',
					endDate: this.fun_date(6,'interface')+' 23:59:59'
				}
				if(this.doctorId){
					data['doctorId'] = this.doctorId
				}
				this.apiListDoctorSchedules(data)
			}
			if(this.hospitalId){
				for(let i=0;i<7;i++){
					this.selectList.push(this.fun_date(i,'interface'))
				}
				const data = {
					type: 2,
					hospitalId: this.hospitalId,
					startDate: this.fun_date(0,'interface')+' 00:00:00',
					endDate: this.fun_date(0,'interface')+' 23:59:59'
				}
				if(this.doctorId){
					data['doctorId'] = this.doctorId
				}
				this.whichIndex = 2
				this.apiListRepeatDiagnosisSchedules(data)
			}
			if(this.doctorId){
				this.apiSelectDoctor(this.doctorId)
				this.apiListQuestion(this.doctorId)
			}
		},
		methods: {
			isFormatName(name){
				switch (name.length) {
					case 1:
						return name;
					case 2:
						return name.slice(0,1)+'*';
					case 3:
						return name.slice(0,1)+'*'+name.slice(name.length-1,name.length);
					default:
						return name.slice(0,1)+'**'+name.slice(name.length-1,name.length);
				}
			},
			initIM(){ // todo 测试扫码进入
				if(this.personData.length>0){
					if(this.healthCardIndex){
						createIMClient(this.personData[this.healthCardIndex].accId)
					}
					else if(!this.healthCardIndex){
						createIMClient(this.personData[0].accId)
					}
				}
			},
			apiListHealthCard(userId) {
				healthyCard.listHealthCard({userId}).then(res => {
					this.personData = res.data.healthCardList
					if(this.fromType){
						this.initIM()
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			formatterDate(date){
				return dateToString(date,'yyyy-mm-dd')
			},
			fun_week(val) {
				let weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
				let week = weekArray[new Date(val).getDay()];
				return week;
			},
			fun_date(num,type) {
				let date1 = new Date();
				let date2 = new Date();
				let time2 = ''
				date2.setDate(date1.getDate() + num);
				let month = (date2.getMonth() + 1<10?0+''+(date2.getMonth() + 1):(date2.getMonth() + 1))
				let days = (date2.getDate()<10?(0+''+date2.getDate()):date2.getDate())
				if(type){
					time2 = date2.getFullYear() + "-" + month + "-" + days;
				}
				else{
					time2 = month + "." + days;
				}
				return time2;
			},
			apiListQuestion(doctorId) {
				let data = {senderId: doctorId,pageNum: 1,pageSize: 100}
				consulting.listQuestion(data).then(res => {
					let evaluateList = res.data.list
					this.backList = []
					var tempDataList = []
					res.data.list.forEach((item, index) => {
						if (
								// 这是判断evaluateList 里边是不是存在重复数据 比如 评分和内容都有的情况下
								this.evaluateList.filter(
										n => n.questionnaireDataId === item.questionnaireDataId
								).length === 0
						) {
							// 这是把当前id 的 评分和内容全找出来 根据type赋值
							tempDataList = evaluateList.filter(
									n => n.questionnaireDataId === item.questionnaireDataId
							)
							tempDataList.forEach(item_temp => {
								if (item_temp.type === '1') {
									item['optionContent'] = parseInt(item_temp.optionContent)
								}
								if (item_temp.type === '3') {
									item['textareaData'] = item_temp.optionContent
								}
							})
							this.evaluateList.push(item)
							this.backList.push(item)
						}
					})
					// 循环结束后 因为只展示前三条数据 所以splice = 3
					if (this.evaluateList.length > 3) {
						this.evaluateList.splice(3)
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			apiGetAdvisoryTips(departId) {
				consulting.getRegisterTips({departId}).then(res => {
					this.advisoryTips = res.data.advisoryTips
					if (this.advisoryTips) {
						this.tipsArray = this.advisoryTips.split(/\n|\r\n/g,)
						this.tipsArray.some((item, index) => {
							if (item === '' || item === ' ') {
								this.tipsArray.splice(index, 1)
							}
						})
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			apiSelectDoctor(doctorId) {
				consulting.selectDoctor({doctorId}).then(res => {
					res.data.doctorImageList.forEach((userInfo) => {
						if (userInfo.imageType === 1 && userInfo.sourceType === 10) {
							res.data.doctorImageList = userInfo.url
						}
					})
					this.doctorDetail = res.data
					this.apiGetAdvisoryTips(this.doctorDetail.hisDepartId)
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			apiListDoctorSchedules(data) {
				consulting.listDoctorSchedules(data).then(res => {
					this.doctorListRegister = res.data[0]
					this.doctorListName = res.data[0].name
					this.apiData = res.data[0].schedulesList
					this.whichIndex = 1
					if(this.apiData.length>0){
						this.selectList.forEach((item,index)=>{
							this.apiData.forEach((items)=>{
								if(item===items.regDate){
									if(items.shiftName === '上午'){
										this.doctorLists[index].rankWork[0] = JSON.parse(JSON.stringify(items))
										this.doctorLists[index].rankWork[0].specialName = items.shiftName
									}
									else if(items.shiftName === '下午'){
										this.doctorLists[index].rankWork[1] = JSON.parse(JSON.stringify(items))
										this.doctorLists[index].rankWork[1].specialName = items.shiftName
									}
									else if(items.shiftName === '全天' || items.shiftName === '全日'){
										let data1 = JSON.parse(JSON.stringify(items))
										let data2 = JSON.parse(JSON.stringify(items))
										data1['shiftName'] = '上午'
										data2['shiftName'] = '下午'
										this.doctorLists[index].rankWork[0] = data1
										this.doctorLists[index].rankWork[1] = data2
										this.doctorLists[index].rankWork[0].specialName = items.shiftName
										this.doctorLists[index].rankWork[1].specialName = items.shiftName
									}
								}
							})
						})
					}
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			apiListRepeatDiagnosisSchedules(data){
				consulting.listRepeatDiagnosisSchedules(data).then(res => {
					this.doctorListRegister = res.data[0]
					this.doctorListName = res.data[0].name
					this.apiDatas = res.data[0].schedulesList
					this.whichIndex = 2
					if(this.apiDatas.length>0){
						this.selectList.forEach((item,index)=>{
							this.apiDatas.forEach((items)=>{
								if(item===items.regDate){
									if(items.shiftName === '上午'){
										this.schedulList[index].rankWork[0] = JSON.parse(JSON.stringify(items))
										this.schedulList[index].rankWork[0].specialName = items.shiftName
									}
									else if(items.shiftName === '下午'){
										this.schedulList[index].rankWork[1] = JSON.parse(JSON.stringify(items))
										this.schedulList[index].rankWork[1].specialName = items.shiftName
									}
									else if(items.shiftName === '全日' || items.shiftName === '白天'){
										let data1 = JSON.parse(JSON.stringify(items))
										let data2 = JSON.parse(JSON.stringify(items))
										data1['shiftName'] = '上午'
										data2['shiftName'] = '下午'
										this.schedulList[index].rankWork[0] = data1
										this.schedulList[index].rankWork[1] = data2
										this.schedulList[index].rankWork[0].specialName = items.shiftName
										this.schedulList[index].rankWork[1].specialName = items.shiftName
									}
								}
							})
						})
					}
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			dcotorDetail() {
				this.showDetail = !this.showDetail
			},
			clickPromptClose() {
				this.promptVisible = false
			},
			clickTipsClose() {
				this.scheduleIndex = false
			},
			clickPromptConfirm() {
				let doctorDetail = uni.getStorageSync('doctorDetail')
				if(doctorDetail){
					uni.removeStorageSync('doctorDetail')
				}
				uni.navigateTo({
					url: `/pagesA/medicalReport/consultOrder?accId=${this.doctorDetail.hisDoctorId}&price=${this.doctorDetail.price}&doctorId=${this.doctorDetail.hisDoctorId}&doctorName=${this.doctorDetail.name}&isIndex=${1}`
				})
				this.promptVisible = false
			},
			clickTipsConfirm(){
				uni.navigateTo({
					url: `/pagesA/medicalReport/consultOrder?doctorDetail=${JSON.stringify(this.doctorDetail)}&doctorName=${this.doctorDetail.name}&price=${this.apiDatas[0].regFee}&hisDoctorId=${this.doctorDetail.hisDoctorId}&isIndex=${2}&scheduleId=${this.scheduleId}&regDate=${this.regDate}&clinicTimeTemp=${this.clinicTimeTemp}&regFee=${this.regFee}&accId=${this.doctorDetail.hisDoctorId}`
				})
				let doctorDetail = uni.getStorageSync('doctorDetail')
				if(doctorDetail){
					uni.removeStorageSync('doctorDetail')
				}
				this.scheduleIndex = false
			},
			addPerson() {
				const that = this
				wx.showModal({
					title: '提示',
					content: '您还没有添加健康卡,请添加健康卡后继续预约挂号',
					cancelText: '再想想',
					confirmText: '去添加',
					success: function (res) {
						let data = {
							hisDepartId: that.hisDepartId,
							doctorId: that.doctorId,
							fromType: that.fromType
						}
						if (res.confirm) {
							uni.setStorageSync('doctorDetail',data)
							uni.navigateTo({
								url: '/pagesA/healthyCard/addCard'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			goConsulting(val){
				if(this.personData.length===0){
					this.addPerson()
					return
				}
				if(val.regLeaveCount === 0){
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: `该医生当前时间段，已约满了,换个时间段吧`,
						success(res) {
							if (res.confirm) {
							}
						}
					});
					return
				}
				let regDate = val.regDate+ ' '+ '('+this.fun_week(val.regDate)+')'+ ' '+val.shiftName
				let dataRegister = JSON.parse(JSON.stringify(this.doctorListRegister))
				delete dataRegister.schedulesList
				val['clinicTimeTemp'] = regDate
				Object.assign(dataRegister, val)
				if(this.doctorListRegister.name && this.doctorListRegister.type===1){
					dataRegister['departName'] = this.doctorDetail.departName
					dataRegister['doctorName'] = this.doctorListRegister.name
				}
				if(this.doctorListRegister.name && this.doctorListRegister.type===2){
					dataRegister['departName'] = this.doctorListRegister.name
				}
				let doctorDetail = uni.getStorageSync('doctorDetail')
				if(doctorDetail){
					uni.removeStorageSync('doctorDetail')
				}
				uni.navigateTo({
					url: `/pagesA/bookRegister/doctorReserve?val=${JSON.stringify(dataRegister)}&hisDepartId=${this.hisDepartId}`
				})
			},
			selectSchedu(val,index,flag){
				const that = this
				if(that.personData.length===0){
					that.addPerson()
					return
				}
				if(val.regLeaveCount === 0){
					wx.showModal({
						title: '提示',
						showCancel: false,
						content: `该医生当前时间段，已约满了,换个时间段吧`,
						success(res) {
							if (res.confirm) {
							}
						}
					});
					return
				}
				let regDate = val.regDate+ ' '+ '('+that.fun_week(val.regDate)+')'+ ' '+val.shiftName
				that.regDate = regDate
				that.clinicTimeTemp = val.regDate
				that.regFee = val.regFee
				val.isSelect = !val.isSelect
				that.schedulList.forEach((item,itemIndex)=>{
					if(index == itemIndex){
						if(flag==0){
							item.rankWork[1].isSelect = false;
							item.rankWork[0].isSelect = val.isSelect;
						}else{
							item.rankWork[0].isSelect = false;
							item.rankWork[1].isSelect = val.isSelect;
						}
					}else{
						item.rankWork[0].isSelect = false;
						item.rankWork[1].isSelect = false;
					}
				})
				if(val.isSelect){
					that.scheduleId = val.scheduleId
				}else{
					that.scheduleId = ''
				}
				that.schedulList[index].rankWork.splice(flag, 1, val)
			},
			consultNow(flag) {
				if(this.personData.length===0){
					this.addPerson()
					return
				}
				if(flag==1){
					this.promptVisible = true
				}
				if(flag==2){
					const that = this
					if(that.scheduleId){
						that.scheduleIndex = true
					}else{
						that.scheduleIndex = false
						wx.showModal({
							title: '提示',
							showCancel: false,
							content: `请先选择排班`,
							success(res) {
								if (res.confirm) {
								}
							}
						})
					}
				}
			},
			forMoreDatail() {
				uni.navigateTo({
					url: `./moreEvaluate?doctorId=${this.doctorId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content-box {
		background-color: #fff;
		padding: 30rpx 24rpx;
		font-size: 30rpx;
	}

	.uni-content-item {
		position: relative;
		z-index: 0;
		background-color: #fff;
		box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);
		border-radius: 16rpx;
	}

	.uni-content-theItem{
		font-size: 24rpx;
		color:#333333;
		padding:30rpx 30rpx 0rpx 30rpx;
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

	.uni-content-doctorName{
		font-size:36rpx;
		font-weight:bold;
		margin-right:12rpx;
	}

	.uni-ill-list{
		display: flex;
		flex-wrap:wrap;
		padding:20rpx 0rpx;
	}

	.uni-ill-item{
		padding:4rpx 10rpx;
		background-color:#2884FF;
		font-size:24rpx;
		color:#fff;
		margin:0rpx 12rpx 12rpx 0rpx;
		border-radius:16rpx;
	}

	.uni-content-consult-box {
		padding: 20rpx;
		text-align: center;
		color: #B2B2B2;
		font-size: 26rpx;

		img {
			width: 30rpx;
			height: 20rpx;
		}
	}

	.uni-doctor-title {
		margin-top: 60rpx;
		margin-bottom: 20rpx;
		display: flex;
	}

	.uni-color-see {
		margin-top: 6rpx;
		width: 100rpx;
		height: 6rpx;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		border-radius: 16px;
	}

	.uni-select-line {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-top: 6rpx;
		width: 160rpx;
	}

	.uni-select-name {
		font-size: 40rpx;
		font-weight: bold;
		color: #333333;
	}

	.uni-default-name {
		font-size: 30rpx;
		color: #B2B2B2;
	}

	.uni-consult-box {
		padding: 30rpx;
		background: #fff;
		box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);
		border-radius: 16rpx;
		font-size: 30rpx;
		box-sizing: border-box;
	}

	.uni-no-product{
		margin:30rpx 0rpx;
		font-size:40rpx;
		text-align:center;
	}

	.uni-consult-tip{
		display: flex;
		justify-content: space-between;
		margin-bottom:20rpx;
	}

	.uni-consult-price{
		font-size:36rpx;
		font-weight: bold;
		color:#FF745F;
	}

	.uni-consult-boxs{
		padding: 30rpx 0rpx 10rpx 0rpx;
	}

	.uni-doctor-timeLine{
		display: flex;
		justify-content:space-around;
		width:100%;
		background-color: #F6F6F6;
		text-align: center;
	}

	.uni-doctor-itemTime{
		font-size:30rpx;
		color:#fff;
		/*display: flex;*/
		/*justify-content:space-around;*/
		width:100%;
		text-align: center;
	}

	.uni-has-rightBorder{
		/*display: flex;*/
		/*justify-content: space-around;*/
		width: 14.28%;
		color: #fff;
		font-size:30rpx;
		margin-right:2rpx;
		border-right: 4rpx solid #fff;
	}

	.uni-no-rightBorder{
		border-right: none;
	}

	.uni-doctor-grayLine{
		width: 100%;
		height: 2rpx;
		margin: 2rpx 0prx;
		background-color: #F6F6F6;
	}

	.uni-time-select-default{
		background-color: #8DBDFF;
		height:108rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
	.uni-button-color{
		background-color: #2884FF;
	}
	.uni-time-select-noColor{
		background-color: #fff;
	}

	.uni-time-select-appoint{
		background-color: #D4E7FF;
		height:108rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	.uni-time-regLeaveCount{
		width:100%;
		color:#2884FF;
		font-size:24rpx;
	}

	.uni-consult-now {
		width: 360rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		border-radius: 16rpx;
	}

	.uni-doctor-line-title {
		margin-top:60rpx;
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;

		img {
			height: 20rpx;
			width: 16rpx;
		}
	}

	.uni-doctor-line-more{
		font-size:28rpx;
		margin-right:12rpx;
		font-weight: normal;
	}

	.uni-doctor-line-img{
		width:100rpx;
		height:100rpx;
		margin-right:20rpx;
	}

	.uni-grade-box{
		padding: 20rpx;
		border-bottom: 2rpx solid #E5E5E5;
	}

	.uni-grade-flexBox{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.uni-grade-RateBox{
		font-size:24rpx;
		color:#B2B2B2;
		display: flex;
		line-height:1.8;
	}

	.uni-grade-textarea{
		padding-top:20rpx;
		font-size:30rpx;
		color:#3E3E3E;
	}

	.uni-grade-box:nth-last-child(1){
		border-bottom: none;
		padding-bottom: none;
	}
</style>

