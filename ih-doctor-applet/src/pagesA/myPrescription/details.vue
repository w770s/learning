<template>
	<view class="content">
		<u-topBar :nav="setNav"/>
		<view style="padding:0 24rpx 130rpx 24rpx;position: relative;top:-35px;z-index:99;">
			<view class="uni-list-box">
				<view class="recent-image-waitingBox" v-if="prescribeType==='1'">
					<img v-if="prescriptionVo.status==='0'||prescriptionVo.status==='2'||prescriptionVo.status==='4'" src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/doPass.png" class='recent-image-waiting' />
					<img v-if="prescriptionVo.status==='1'||prescriptionVo.status==='3'||prescriptionVo.status==='5'||prescriptionVo.status==='6'" src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/doNotPass.png" class='no-recent-image-passDone' />
					<view class="recent-image-waiting-text">{{prescriptionVo.status?forMatterStatus(prescriptionVo.status):''}}</view>
				</view>
				<view class="recent-image-waitingBox" v-if="prescribeType!=='1'&&statusType">
					<img v-if="payStatus==0||payStatus==3" src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/doPass.png" class='recent-image-waiting' />
					<img v-if="payStatus==1||payStatus==2||payStatus==4" src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/doNotPass.png" class='no-recent-image-passDone' />
					<view class="recent-image-waiting-text">{{statusType}}</view>
				</view>
				<view class="list-item">
					<view>姓名：</view>
					<view class="uni-input">
						{{prescriptionVo.name?prescriptionVo.name:'暂无'}}
					</view>
				</view>
				<view class="list-item">
					<view>性别：</view>
					<view class="uni-input" v-if="prescriptionVo.gender">
						{{prescriptionVo.gender==='0'?'男':'女'}}
					</view>
					<view class="uni-input" v-if="!prescriptionVo.gender">
						{{prescriptionVo.gender===0?'男':'暂无'}}
					</view>
				</view>
				<view class="list-item">
					<view>年龄：</view>
					<view class="uni-input">
						{{prescriptionVo.age?prescriptionVo.age+'岁':'暂无'}}
					</view>
				</view>
				<view class="list-item list-item-border">
					<view>健康卡号：</view>
					<view class="uni-input" v-if="prescriptionVo.idCard">
						{{prescriptionVo.idCard?prescriptionVo.idCard:'暂无'}}
					</view>
					<view class="uni-input" v-else>
						{{'暂无'}}
					</view>
				</view>
				<view class="list-item" style="padding-top: 25rpx;">
					<view>临床诊断(ICD)：</view>
					<view class="uni-input">
						{{prescriptionVo.clinicalDiagnosis?prescriptionVo.clinicalDiagnosis:'暂无'}}
					</view>
				</view>
				<view class="list-item">
					<view>患者主诉：</view>
					<view class="uni-input">
						{{prescriptionVo.chiefComplaint?prescriptionVo.chiefComplaint:'暂无'}}
					</view>
				</view>
				<view class="list-item">
					<view>既往史：</view>
					<view class="uni-input">
						{{prescriptionVo.medRecord?prescriptionVo.medRecord:'暂无'}}
					</view>
				</view>
			</view>
			<view v-if="prescribeType==='1'">
				<view class="uni-imType-choose" >
					<view class="uni-imType-defaultChoose">
						处方一
						<view class="uni-imType-tabs"></view>
					</view>
				</view>
				<view class="uni-list-box uni-list-paddingBox">
					<view v-for="(item,index) in prescriptionVo.prescriptionMedicineList" :key="index">
						<view class="uni-medical-item">
							<text style="font-size: 36rpx;font-weight: bold;">{{item.name?item.name:''}}</text>
							<text style="margin:0rpx 10rpx;">{{item.name&&item.name?'x':''}}</text>
							<text>{{item.count?item.count+item.saleUnit:''}}</text>
						</view>
						<view class="list-item">
							<view>用药途径</view>
							<view class="uni-input">
								{{item.medicineWay?item.medicineWay:'暂无'}}
							</view>
						</view>
						<view class="list-item">
							<view>用药频率</view>
							<view class="uni-input">
								{{item.medicineFrequency?item.medicineFrequency:'暂无'}}
							</view>
						</view>
						<view class="list-item">
							<view>单次药量</view>
							<view class="uni-input">
								{{item.dosageOne?item.dosageOne+item.doseUnit+'/次':'暂无'}}
							</view>
						</view>
						<view :class="['list-item',index!==prescriptionVo.prescriptionMedicineList.length-1?'list-item-border':'']" style="padding-bottom: 25rpx;">
							<view>备注</view>
							<view class="uni-input">
								{{item.doctorAdvice?item.doctorAdvice:'暂无'}}
							</view>
						</view>
					</view>
					<view v-if="prescriptionVo.status" style="border-top: 1px solid rgba(238, 238, 238, 1);">
						<view class="list-item">
							<view>处方开立医师：</view>
							<view class="uni-input">
								{{prescriptionVo.prescriptionDoctorName?prescriptionVo.prescriptionDoctorName:'暂无'}}
								{{prescriptionVo.prescriptionDoctorDepartment?prescriptionVo.prescriptionDoctorDepartment:'暂无'}}
								{{prescriptionVo.prescriptionDoctorRanks?prescriptionVo.prescriptionDoctorRanks:'暂无'}}
							</view>
						</view>
						<view class="list-item" v-if="prescriptionVo.status!== '0'">
							<view>审核药剂师：</view>
							<view class="uni-input">
								{{prescriptionVo.baseMedicineDoctor.name?prescriptionVo.baseMedicineDoctor.name:'暂无'}}
								{{prescriptionVo.baseMedicineDoctor.department?prescriptionVo.baseMedicineDoctor.department:'暂无'}}
								{{prescriptionVo.baseMedicineDoctor.rank?prescriptionVo.baseMedicineDoctor.rank:'暂无'}}
							</view>
						</view>
						<view class="list-item">
							<view>开方日期：</view>
							<view class="uni-input">
								{{prescriptionVo.prescriptionTime?prescriptionVo.prescriptionTime:'暂无'}}
							</view>
						</view>
						<view class="list-item" v-if="prescriptionVo.status==='1'">
							<view>未通过原因：</view>
							<view class="uni-input" style="color: #FF745F;">
								{{prescriptionVo.refuseReason?prescriptionVo.refuseReason:'暂无'}}
							</view>
						</view>
					</view>
					<view class="uni-medical-tips">
						<text style="color:#4E93F6;">提示信息：</text><text style="color:#333333;">处方开具当日有效</text>
					</view>
				</view>
			</view>
			<view v-if="prescribeType==='2'||prescribeType==='3'">
				<view class="uni-imType-choose" >
					<view class="uni-imType-defaultChoose">
						<text v-if="prescribeType==='2'">检查单</text>
						<text v-if="prescribeType==='3'">检验单</text>
						<view class="uni-imType-tabs"></view>
					</view>
				</view>
				<view class="uni-list-box uni-list-paddingBox" style="padding-top:0px;">
					<view v-for="(item,index) in prescriptionVo.ihCheckInspectionDetails" :key="index">
						<view class="uni-medical-item">
							<view style="font-size: 36rpx;font-weight: bold;padding-bottom: 10rpx;">{{prescriptionVo.examinetype===1?'检查':'检验'}}{{changeNoToChinese(index)}}：{{item.examineName?item.examineName:'暂无'}} {{item.detailPartAndMethodName?'('+item.detailPartAndMethodName+')':''}}</view>
							<view v-if="prescribeType==='3'" style="padding-bottom: 25rpx;color:#B2B2B2;">检查标本：{{item.itemName?item.itemName:'暂无'}}</view>
							<view style="padding-bottom: 25rpx;color:#B2B2B2;">执行科室：{{item.departName?item.departName:'暂无'}}</view>
							<view style="padding-bottom: 10rpx;">注意事项</view>
							<view class="uni-input" style="color:#B2B2B2;">
								{{item.remark?item.remark:'暂无'}}
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list-box uni-list-paddingBox" style="margin-top:28rpx;padding:20rpx 0rpx;">
					<view class="list-item">
						<view style="color:#333333;">给患者留言</view>
					</view>
					<view class="list-item">
						<view style="color:#333333;">
							{{prescriptionVo.leaveMessage?prescriptionVo.leaveMessage:'暂无'}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-btn-v" v-if="prescriptionVo.status==='1'">
				<u-button @click="returnRrescription" :throttleTime="1000" :customStyle="buttonStyle" type="primary" shape="square" size="default">重新开具</u-button>
			</view>
			<view class="uni-btn-v uni-btn-v-double" v-if="!prescriptionVo.status&&showSureButton">
				<u-button @click="cancelBack" :plain="true" :throttleTime="1000" :customStyle="buttonStyleLook" type="primary" shape="square" size="default">返回</u-button>
				<u-button :loading="submitLoading" @click="sureConsult" :throttleTime="1000" :customStyle="buttonDoubleStyle" type="primary" shape="square" size="default">确认</u-button>
			</view>
		</view>
		<u-freeloading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {prescriptions} from '@/models/prescriptions.js'
	const prescript = new prescriptions()
	import {NoToChinese} from '@/util/util.js'
	export default {
		data() {
			return {
				submitLoading: false,
				textareaData: '',
				showtextarea: true,
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '处方详情',
					"externalHeight": 40
				},
				buttonStyle:{
					textAlign: 'center',
					width: '640rpx',
					height: '47px',
					lineHeight: '47px',
					borderRadius: '8px',
					color: '#fff',
					background: 'linear-gradient(90deg, #FFB554 0%, #FFA36A 100%)'
				},
				buttonStyleLook:{
					textAlign: 'center',
					width: '340rpx',
					height: '35px',
					lineHeight: '35px',
					borderRadius: '5px',
					color: '#fff',
					border: '1px solid #2884FF',
					background: '#fff'
				},
				buttonDoubleStyle:{
					textAlign: 'center',
					width: '340rpx',
					height: '35px',
					lineHeight: '35px',
					borderRadius: '5px',
					color: '#fff',
					background: 'linear-gradient(90deg, #5EA6F8 0%, #3B7CF4 100%)'
				},
				prescriptionVo:{},
				accId: '',
				prescribeType: '',
				statusType: '',
				payStatus: '',
				showSureButton: true
			}
		},
		onLoad(options) {
			console.log(this.payStatus,'payStatus')
			if(options.prescribeIndex){
				this.prescriptionVo = JSON.parse(options.prescribeIndex)
				console.log(this.prescriptionVo.chiefComplaint);
				if(this.prescriptionVo.patientId){
					this.apiSelectHealthCardDetails(this.prescriptionVo.patientId)
				}
			}
			if(uni.getStorageSync('prescribeType')){
				this.prescribeType = uni.getStorageSync('prescribeType')
				if(this.prescribeType==='2'){
					this.setNav.navTitle = '检查详情'
				}
				if(this.prescribeType==='3'){
					this.setNav.navTitle = '检验详情'
				}
			}
			if(options.id){
				console.log(options,this.prescribeType);
				if(this.prescribeType==='1'){
					this.$refs.loading.open();
					this.apiGetOrderDetail(options.id)
				}
				if(this.prescribeType==='2'||this.prescribeType==='3'){
					this.$refs.loading.open();
					this.apiIhInspectionOrderGetOrderDetail(options.id)
				}
			}
		},
		methods: {
			changeStatus(status) {
				switch (status) {
					case 0:
						return '待支付'
					case 1:
						return '支付成功'
					case 2:
						return '支付失败'
					case 3:
						return '已退款'
					case 4:
						return '超时未支付'
				}
			},
			changeNoToChinese(number){
				return NoToChinese(number+1)
			},
			apiSelectHealthCardDetails(patientId) {
				prescript.selectHealthCardDetails({patientId}).then(res => {
					this.accId = res.data.accId
				}).catch((err) => {
					console.log(err);
				})
			},
			apiIhCheckInspectionInfoCreate(data){
				prescript.ihCheckInspectionInfoCreate(data).then(res=>{
					console.log(res.data);
					this.submitLoading = false
					if(!this.accId){
						uni.showToast({
							title: '患者聊天账号获取失败',
							icon: 'none',
						})
						return
					}
					let session = 'p2p-'+this.accId
					let finalData = res.data
					console.log(finalData);
					this.switchToChating(this.accId,session,finalData)
					uni.removeStorageSync('dosageData')
					uni.removeStorageSync('prescribeIndex')
				}).catch(err=>{
					this.submitLoading = false
					console.log(err);
				})
			},
			apiPrescriptionsCreate(data){
				prescript.prescriptionsCreate(data).then(res=>{
					console.log(res.data);
					this.submitLoading = false
					if(!this.accId){
						uni.showToast({
							title: '患者聊天账号获取失败',
							icon: 'none',
						})
						return
					}
					let session = 'p2p-'+this.accId
					let finalData = res.data
					this.switchToChating(this.accId,session,finalData)
					uni.removeStorageSync('dosageData')
					uni.removeStorageSync('prescribeIndex')
				}).catch(err=>{
					this.submitLoading = false
					console.log(err);
				})
			},
			apiIhInspectionOrderGetOrderDetail(id){
				prescript.ihInspectionOrderGetOrderDetail({id}).then(res=>{
					if(res.data){
						this.prescriptionVo = res.data
						this.showSureButton = false
						this.statusType = this.changeStatus(res.data.ihInspectionOrder.payStatus)
						this.payStatus = res.data.ihInspectionOrder.payStatus
						console.log(this.payStatus,this.statusType);
						this.$refs.loading.close();
						if(res.data.patientId){
							this.apiSelectHealthCardDetails(this.prescriptionVo.patientId)
						}
					}
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err);
				})
			},
			apiGetOrderDetail(id){
				prescript.getOrderDetail({id}).then(res=>{
					if(res.data){
						this.prescriptionVo = res.data
						uni.setStorageSync('prescribeIndex', JSON.stringify(this.prescriptionVo))
						this.$refs.loading.close();
						if(res.data.patientId){
							this.apiSelectHealthCardDetails(this.prescriptionVo.patientId)
						}
					}
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err);
				})
			},
			forMatterStatus(status){
				switch (status) {
					case '0':
						return '待审方'
					case '1':
						return '审核未通过'
					case '2':
						return '已审方'
					case '3':
						return '超时未支付'
					case '4':
						return '已支付'
					case '5':
						return '支付失败'
					case '6':
						return '已退款'
				}
			},
			/**
			 * 单击进入聊天页面
			 */
			switchToChating(account,session,data) {
				console.log(account, session, data);
				uni.setStorageSync('prescribeIndex', JSON.stringify(data))
				uni.setStorageSync('advisoryType',2)
				uni.redirectTo({
					url: `/pagesA/consulting/consultPage?prescribeIndex=${JSON.stringify(data)}`
				})
			},
			cancelBack(){
				uni.redirectTo({
					url: '/pagesA/prescribe/index'
				})
			},
			sureConsult(){
				this.submitLoading = true
				if(this.prescribeType === '1'){
					this.apiPrescriptionsCreate(this.prescriptionVo)
				}
				if(this.prescribeType === '2'||this.prescribeType === '3'){
					console.log(12321);
					this.apiIhCheckInspectionInfoCreate(this.prescriptionVo)
				}
			},
			returnRrescription(){
				const that = this
				wx.showModal({
					title: '重新开具处方',
					cancelText: '不，谢谢',
					content: `复制原处方内容，直接编辑`,
					success(res) {
						uni.setStorageSync('prescribeType','1')
						if (res.confirm) {
							uni.navigateTo({
								url: '/pagesA/prescribe/index'
							})
						} else if (res.cancel) {
							const createPrescript = {
								patientId: that.prescriptionVo.patientId,
								clinicNo: that.prescriptionVo.clinicNo,
								diagnosisOrderNo: that.prescriptionVo.diagnosisOrderNo
							}
							uni.setStorageSync('prescribeIndex',JSON.stringify(createPrescript))
							uni.removeStorageSync('dosageData')
							uni.navigateTo({
								url: '/pagesA/prescribe/index'
							})
						}
					}
				});
			},
			goPdf(){ // 查看处方笺 暂时不做
				console.log(12321);
				uni.navigateTo({
					url: '/pagesA/myPrescription/prescriptionPdf'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
	}

	.uni-list-box{
		position: relative;
		width: 100%;
		padding: 40rpx 0rpx;
		box-shadow: 0rpx 4rpx 12rpx 5rpx rgba(59, 124, 244, 0.15);
		border-radius: 10rpx;
		background: #fff;
		box-sizing: border-box;

		.recent-image-waitingBox{
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			right: 0rpx;
			top: -8rpx;
			z-index: 10;
		}

		.recent-image-waiting{
			width: 100rpx;
			height: 44rpx;
		}

		.no-recent-image-passDone{
			width: 146rpx;
			height: 44rpx;
		}
		.recent-image-waiting-text{
			color: #fff;
			margin-left: 8rpx;
			font-size: 24rpx;
			position: absolute;
			top:0px;right:0px;
			left:0px;bottom: 0px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.uni-list-paddingBox{
		padding-bottom:0rpx;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		padding: 15rpx 30rpx;
		view:nth-of-type(1){
			color: #B2B2B2;
			max-width: 230rpx;
			min-width: 160rpx;
		}

		.uni-input {
			max-width: 440rpx;
			text-align: right;
			word-wrap: break-word;
			word-break: normal;
		}
	}

	.list-item-border{
		padding-bottom: 25rpx;
		border-bottom: 1px solid rgba(238, 238, 238, 1);
	}

	.uni-imType-choose{
		width: 100%;
		border-left: none;
		border-right: none;
		font-size: 30rpx;
		color: #333333;
		padding: 30rpx 0rpx;
		box-sizing: border-box;
		.uni-imType-tabs{
			position: absolute;
			margin-top:15rpx;
			height: 6rpx;
			width: 100rpx;
			border-radius: 2rpx;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			background: linear-gradient(90deg, #5EA6F8 0%, #3B7CF4 100%);
		}
	}
	.uni-imType-defaultChoose{
		width: 120rpx;
		display: flex;
		padding-bottom: 15rpx;
		justify-content: center;
		position: relative;
		font-size: 40rpx;
		font-weight: bold;
	}

	.uni-medical-item{
		color:#333333;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 2rpx solid #F6F6F6;
		padding: 40rpx 30rpx;
	}

	.uni-medical-tips{
		color:#333333;
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background: rgba(40, 132, 255, 0.1);
		border-radius: 0rpx 0rpx 10rpx 10rpx;
	}

	.uni-btn-v {
		padding: 40rpx 54rpx;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		position: fixed;
		z-index: 100;
		background-color: #fff;
		left: 0;
		bottom: 0;
		text-align: center;
		width: 100%;
	}

	.uni-btn-v-double{
		padding: 40rpx 24rpx;
	}
</style>
