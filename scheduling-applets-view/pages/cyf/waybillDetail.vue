<template>
	<view class="content">
		<uni-steps
		 v-if="specialStatus!=='异常'"
		 :data="[ {title: '待派车'},{title: '待装货'},{title: '待卸货'},{title: '待签收'},{title: '已完成'}]"
		 :active="activeStep">
		</uni-steps>
		<view class="abnormal-box" v-if="specialStatus==='异常'">
			<image src='../../static/image/abnormal.png' />
			<text>运单异常!</text>
			<view>请时刻关注最新运单信息</view>
		</view>
		<form>
			<view class="uni-form-item uni-column">
				<view class="uni-list-box" 
					v-if="specialStatus==='待派车'||
					specialStatus==='待装货'&&waybillVO.exceptionShow==='派车信息填写错误'||
					specialStatus==='待卸货'&&waybillVO.exceptionShow==='派车信息填写错误'">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
								调度信息
							</text>
						</view>
					</view>
					<view>
						<view class="list-item" @tap="singleSelect('车牌号')">
							<text><text class="ui-mustWrite">*</text>车牌号</text>
							<input disabled="true" class="uni-input" v-model="sendCarForms.vanCert" placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('挂车号')">
							<text><text class="ui-mustWrite">*</text>挂车号</text>
							<input disabled="true" type='number' class="uni-input" v-model="sendCarForms.truckCert" placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('罐体编号')">
							<text><text class="ui-mustWrite">*</text>罐体编号</text>
							<input disabled="true" class="uni-input" v-model="sendCarForms.tankerNo" placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('驾驶员')">
							<text><text class="ui-mustWrite">*</text>驾驶员</text>
							<input disabled="true" type='number' class="uni-input" v-model="sendCarForms.driverName" placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('押运员')">
							<text><text class="ui-mustWrite">*</text>押运员</text>
							<input disabled="true" type='number' class="uni-input" v-model="sendCarForms.driverName2" placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('装货日期')">
							<text><text class="ui-mustWrite">*</text>装货日期</text>
							<input disabled="true" type='number' class="uni-input" v-model="sendCarForms.reservationLoadingDate" placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('装货时间段')">
							<text><text class="ui-mustWrite">*</text>装货时间段</text>
							<input disabled="true" type='number' class="uni-input" v-model="sendCarForms.loadingPeriod" placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('卸货日期')">
							<text><text class="ui-mustWrite">*</text>卸货日期</text>
							<input disabled="true" type='number' class="uni-input" v-model="sendCarForms.reservationUnloadingDate"
							 placeholder="请选择" />
						</view>
						<view class="list-item" @tap="singleSelect('卸货时间段')">
							<text><text class="ui-mustWrite">*</text>卸货时间段</text>
							<input disabled="true" type='number' class="uni-input" v-model="sendCarForms.unloadingPeriod" placeholder="请选择" />
						</view>
					</view>
				</view>
				<view class="uni-list-box" v-if="specialStatus!=='待派车'&&waybillVO.exceptionShow!=='派车信息填写错误'">
					<view class="uni-form-title-box" @tap="ChangeItemForSee('one')">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
								调度信息
							</text>
							<view :class="['iconfont-box',hasChangeItemOne?'iconfont-transfrom':'']">
								<text class="iconfont">&#xe625;</text>
							</view>
						</view>
					</view>
					<view v-if="hasChangeItemOne">
						<view class="list-item">
							<text>车牌号</text>
							<input disabled="true" class="uni-input" v-model="waybillVO.vanCert" placeholder="--" />
						</view>
						<view class="list-item">
							<text>挂车号</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.truckCert" placeholder="--" />
						</view>
						<view class="list-item">
							<text>罐体编号</text>
							<input disabled="true" class="uni-input" v-model="waybillVO.tankerNo" placeholder="--" />
						</view>
						<view class="list-item">
							<text>驾驶员</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.driverName" placeholder="--" />
						</view>
						<view class="list-item">
							<text>驾驶员手机号</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.driverPhone" placeholder="--" />
						</view>
						<view class="list-item">
							<text>押运员</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.driverName2" placeholder="--" />
						</view>
						<view class="list-item">
							<text>押运员手机号</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.driverPhone2" placeholder="--" />
						</view>
						<view class="list-item">
							<text>装货日期</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.reservationLoadingDate" placeholder="--" />
						</view>
						<view class="list-item">
							<text>装货时间段</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.loadingPeriod" placeholder="--" />
						</view>
						<view class="list-item">
							<text>卸货日期</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.reservationUnloadingDate" placeholder="--" />
						</view>
						<view class="list-item">
							<text>卸货时间段</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.unloadingPeriod" placeholder="--" />
						</view>
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box" @tap="ChangeItemForSee('two')">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
								订单信息
							</text>
							<view :class="['iconfont-box',hasChangeItemTwo?'iconfont-transfrom':'']">
								<text class="iconfont">&#xe625;</text>
							</view>
						</view>
					</view>
					<view v-if="hasChangeItemTwo">
						<view class="list-item">
							<text>装货企业</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingEnterprise" placeholder="--" />
						</view>
						<view class="list-item">
							<text>装货地区</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.originDesc" placeholder="--" />
						</view>
						<view class="list-item">
							<text>详细地址</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingAddress" placeholder="--" />
						</view>
						<view class="list-item">
							<text>联系人</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingContact" placeholder="--" />
						</view>
						<view class="list-item">
							<text>联系电话</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingContactPhone" placeholder="--" />
						</view>
						<view class="uni-form-title-box"></view>
						<view>
							<view class="list-item">
								<text>卸货企业</text>
								<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingEnterprise" placeholder="--" />
							</view>
							<view class="list-item">
								<text>卸货地区</text>
								<input disabled="true" class="uni-input" v-model="orderHeaderVO.destinationDesc" placeholder="--" />
							</view>
							<view class="list-item">
								<text>详细地址</text>
								<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingAddress" placeholder="--" />
							</view>
							<view class="list-item">
								<text>联系人</text>
								<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingContact" placeholder="--" />
							</view>
							<view class="list-item">
								<text>联系电话</text>
								<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingContactPhone" placeholder="--" />
							</view>
						</view>
						<view class="uni-form-title-box"></view>
						<view class="list-item">
							<text>运输企业</text>
							<input disabled="true" class="uni-input" placeholder="--" v-model="orderHeaderVO.carrierEnterpriseName" />
						</view>
						<view class="list-item">
							<text>统一信用代码</text>
							<input disabled="true" class="uni-input" placeholder="--" v-model="orderHeaderVO.carrierEnterpriseId" />
						</view>
						<view class="uni-form-title-box"></view>
						<view class="list-item">
							<text>类别</text>
							<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.type" />
						</view>
						<view class="list-item">
							<text>货物名称</text>
							<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.productName" />
						</view>
						<view class="list-item">
							<text>货物规格</text>
							<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.specifications" />
						</view>
						<view class="list-item">
							<text>包装</text>
							<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.packageUnit" />
						</view>
						<view class="list-item">
							<text>件数</text>
							<input disabled="true" class="uni-input" v-model="orderProductVO.number" placeholder="--" />
						</view>
						<view class="list-item">
							<text>重量(吨)</text>
							<input disabled="true" type='number' class="uni-input" v-model="orderProductVO.weight" placeholder="--" />
						</view>
						<view class="list-item">
							<text>体积(立方米)</text>
							<input disabled="true" type='number' class="uni-input" v-model="orderProductVO.volume" placeholder="--" />
						</view>
						<view class="uni-form-title-box"></view>
						<view class="list-item">
							<text>运输意向</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.stevedoreType" placeholder="--" />
						</view>
						<view class="list-item">
							<text>运费(元）</text>
							<input disabled="true" type='number' class="uni-input" v-model="orderHeaderVO.totalPrice" placeholder="--" />
						</view>
						<view class="list-item">
							<text>结算方式</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.clearingType" placeholder="--" />
						</view>
						<view class="list-item">
							<text>订单数量</text>
							<input disabled="true" type='number' class="uni-input" v-model="orderHeaderVO.orderNum" placeholder="--" />
						</view>
						<view class="list-item">
							<text>备注</text>
							<input disabled="true" type='number' class="uni-input" v-model="orderHeaderVO.remark" placeholder="--" />
						</view>
					</view>
				</view>

				<view class="uni-list-box" v-if="specialStatus==='待签收'||specialStatus==='已完成'">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line" @tap="ChangeItemForSee('thr')">
							<text class="uni-form-title">
								回单信息
							</text>
							<view :class="['iconfont-box',hasChangeItemThr?'iconfont-transfrom':'']">
								<text class="iconfont">&#xe625;</text>
							</view>
						</view>
					</view>
					<view v-if="hasChangeItemThr">
						<view class="list-item">
							<view class="image-edit-box">
								<text>装货凭证</text>
								<image :src='loadingVoucher' alt='正在加载中' />
							</view>
							<view class="image-edit-box">
								<text>卸货凭证</text>
								<image :src='unloadingVoucher' alt='正在加载中' />
							</view>
						</view>
						<view class="list-item">
							<text>实际装货数量</text>
							<input disabled="true" class="uni-input" v-model="waybillVO.loadingWeight" placeholder="--" />
						</view>
						<view class="list-item">
							<text>实际卸货数量</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.unloadingWeight" placeholder="--" />
						</view>
						<view class="list-item">
							<text>损耗数量</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.lossingWeight" placeholder="--" />
						</view>
						<view class="list-item">
							<text>装货时间</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.loadingDate" placeholder="--" />
						</view>
						<view class="list-item">
							<text>卸货时间</text>
							<input disabled="true" type='number' class="uni-input" v-model="waybillVO.unloadingDate" placeholder="--" />
						</view>
					</view>
				</view>
				<view class="uni-list-box" v-if="waybillVO.isException===1">
					<view class="uni-form-title-box" v-if="waybillVO.isException===1&&specialStatus!=='待派车'">
						<view class="uni-form-title-line" @tap="ChangeItemForSee('for')">
							<text class="uni-form-title">
								<!-- <text class="uni-number">04</text> -->
								异常信息
							</text>
							<view :class="['iconfont-box',hasChangeItemFor?'iconfont-transfrom':'']">
								<text class="iconfont">&#xe625;</text>
							</view>
						</view>
					</view>
					<view v-if="hasChangeItemFor">
						<view class="list-item">
							<text>异常类型</text>
							<input disabled="true" class="uni-input" v-model="waybillVO.exceptionShow" placeholder="--" />
						</view>
						<view class="list-item">
							<text>备注</text>
							<input disabled="true" class="uni-input" v-model="waybillVO.remark" placeholder="--" />
						</view>
					</view>
				</view>
			</view>
			<view class="uni-btn-v" v-if="specialStatus==='待派车'&&waybillVO.isException===0">
				<button class="big-blue" @tap="dispatchCar">派车</button>
			</view>
			<view class="uni-btn-v" v-if="waybillVO.isException===1&&waybillVO.isExceptionEditor!==1">
				<button class="big-blue" @tap="overDownButton">完成修改</button>
			</view>
			<view class="uni-btn-v" v-if="(specialStatus==='待装货'||specialStatus==='待卸货')&&waybillVO.isException===0&&waybillVO.isExceptionEditor!==1">
				<button class="big-orange" @tap="abnormalSituation(waybillVO.id)">异常情况</button>
			</view>
		</form>
		<w-picker
		 v-if="selectList.length!=0"
		 mode="selector"
		 :defaultVal="[0]"
		 @confirm="onSelectConfirm"
		 ref="selector"
		 themeColor="#f00"
		 :selectList="selectList"></w-picker>
		<w-picker
		 mode="date"
		 startYear="2019"
		 endYear="2030"
		 :defaultVal="[0,1,3]"
		 :current="true"
		 @confirm="onDateConfirm"
		 ref="date"
		 themeColor="#f00"></w-picker>
		<w-picker
		 mode="piece"
		 :defaultVal="[0,0]"
		 @confirm="onPieceConfirm"
		 ref="piece"
		 themeColor="#f00"></w-picker>
	</view>
</template>

<script>
	import {
		CyfModel
	} from '../../models/cyf.js';
	import {
		config
	} from '@/config.js'
	const cyfModel = new CyfModel();
	import uniSteps from "@/components/uni-steps/uni-steps.vue"
	import wPicker from "@/components/w-picker/w-picker.vue"
	import { sendCarMust } from './js/option.js'
	export default {
		components: {
			wPicker,
			uniSteps
		},
		onLoad(option) {
			if (option.id) {
				this.apiGetWaybillDetail(option.id)
				this.specialId = option.id
			}
			if (option.waybillStatus) {
				this.specialStatus = option.status
				if (this.specialStatus === '待派车') {
					uni.setNavigationBarTitle({
						title: '派车'
					});
				}
				switch (option.waybillStatus) {
					case 'WAYBILL-STATUS-DPC':
						return this.activeStep = 0
					case 'WAYBILL-STATUS-DZH':
						return this.activeStep = 1
					case 'WAYBILL-STATUS-DXH':
						return this.activeStep = 2
					case 'WAYBILL-STATUS-DQS':
						return this.activeStep = 3
					case 'WAYBILL-STATUS-YWC':
						return this.activeStep = 4
					default:
						return this.activeStep = 0
				}
			}
		},
		onShow() { // 异常情况参数
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			console.log(currPage.data.exceptionShow, currPage.data.remark, '异常情况参数一')
			if (currPage.data.exceptionShow !== '' && currPage.data.exceptionShow !== undefined) {
				this.waybillVO.exceptionShow = currPage.data.exceptionShow
				this.waybillVO.remark = currPage.data.remark
				console.log(123, currPage.data.waybillId, '异常情况参数二',this.specialStatus)
				if (currPage.data.waybillId) {
					this.apiGetWaybillDetail(currPage.data.waybillId)
				}
			}
		},
		data() {
			return {
				activeStep: '',
				specialId: '',
				specialStatus: '',
				selectStatus: '',
				hasChangeItemOne: true,
				hasChangeItemTwo: false,
				hasChangeItemThr: false,
				hasChangeItemFor: false,
				loadingVoucher: '',
				unloadingVoucher: '',
				orderHeaderVO: {},
				orderProductVO: {},
				waybillVO: {},
				sendCarMustOption: [],
				selectList: [],
				sendCarOption: {
					driversOption: [],
					escortsOption: [],
					tankersOption: [],
					vanCertsOption: [],
					truckCertsOption: [],
					timePeriodsOption: [],
					loadTimeOption: [],
					unloadTimeOption: [],
					// selectList
					vanCerts: [],
					tankers: [],
					drivers: [],
					escorts: [],
					// 对于企业的装卸能力 产品ID 产品名
					handlings: {},
					// 对于企业的装卸能力 具体时间
					Periods: [],
					loadingPeriods: [],
					unloadingPeriods: []
				},
				sendCarForms: {
					driverIdcard: '',
					driverIdcard2: '',
					driverName: '',
					driverName2: '',
					driverNo: '',
					driverNo2: '',
					driverPhone: '',
					driverPhone2: '',
					reservationLoadingDate: '',
					reservationUnloadingDate: '',
					stevedoreType: '',
					tankerNo: '',
					truckCert: '',
					truckCertLength: '',
					truckCertType: '',
					vanCert: '',
					vanCertCode: '',
					vanCertLength: '',
					vanCertType: '',
					waybillId: '',
					productName: '',
					productId: '',
					// 情况选择参数
					loadingPeriod: '',
					unloadingPeriod: '',
					handlingId: '',
					handlingDetailsId: ''
				}
			};
		},
		methods: {
			haveSelectList(name,kind){
				if(this.selectList.length===0&&name !== ''){
					uni.showToast({
						icon: 'none',
						title: `获取${name}失败,无法选择`
					});
					return
				}else{
					this.$nextTick(() => {
						this.$refs[`${kind}`].show();
					})
				}
			},
			singleSelect(name) {
				this.selectStatus = name;
				if (name === '车牌号') {
					this.selectList = this.sendCarOption.vanCertsOption
					this.haveSelectList(name,'selector')
				}
				if(name === '挂车号'){
					this.selectList = this.sendCarOption.truckCertsOption
					this.haveSelectList(name,'selector')
				}
				if (name === '罐体编号') {
					this.selectList = this.sendCarOption.tankersOption
					this.haveSelectList(name,'selector')
				}
				if (name === '驾驶员') {
					this.selectList = this.sendCarOption.driversOption
					this.haveSelectList(name,'selector')
				}
				if (name === '押运员') {
					this.selectList = this.sendCarOption.escortsOption
					this.haveSelectList(name,'selector')
				}
				if (name === '装货日期' || name === '卸货日期') {
					this.haveSelectList('','date')
				}
				console.log(this.selectList)
				if (name === '装货时间段' || name === '卸货时间段') {
					if (this.sendCarOption.Periods.length !== 0) {
						if (this.sendCarOption.loadTimeOption.length !== 0 && name === '装货时间段') {
							this.selectList = this.sendCarOption.loadTimeOption
							this.haveSelectList('','selector')
						}
						if (this.sendCarOption.unloadTimeOption.length !== 0 && name === '卸货时间段') {
							this.selectList = this.sendCarOption.unloadTimeOption;
							this.haveSelectList('','selector')
						}
						if (this.sendCarOption.loadTimeOption.length === 0 && name === '装货时间段') {
							this.haveSelectList('','piece')
						}
						if (this.sendCarOption.unloadTimeOption.length === 0 && name === '卸货时间段') {
							this.haveSelectList('','piece')
						}
					} else {
						this.haveSelectList(name,'piece')
					}
				}
			},
			onPieceConfirm(val) { // 装卸货时间段
				console.log(val)
				if (this.selectStatus === '装货时间段') { //进园装货，无装卸能力
					this.sendCarForms.loadingPeriod = val.result
				}
				if (this.selectStatus === '卸货时间段') {
					this.sendCarForms.unloadingPeriod = val.result
				}
			},
			onDateConfirm(val) { // 装卸货日期
				console.log(val)
				if (this.selectStatus === '装货日期') { //进园装货
					this.sendCarForms.reservationLoadingDate = val.result
					return
				}
				if (this.selectStatus === '卸货日期') {
					this.sendCarForms.reservationUnloadingDate = val.result
					return
				}
			},
			onSelectConfirm(val) { // 单选
				console.log(val)
				switch (this.selectStatus) {
					case '车牌号':
						this.sendCarForms.vanCert = val.result
						this.sendCarForms.vanCertCode = val.checkArr.vanCertCode
						this.sendCarForms.vanCertLength = val.checkArr.vanCertLength
						this.sendCarForms.vanCertType = val.checkArr.vanCertType
						break;
					case '挂车号':
						this.sendCarForms.truckCert = val.result
						this.sendCarForms.truckCertLength = val.checkArr.truckCertLength
						this.sendCarForms.truckCertType = val.checkArr.truckCertType
						break;
					case '罐体编号':
						this.sendCarForms.tankerNo = val.result
						break;
					case '驾驶员':
						this.sendCarForms.driverName = val.result
						this.sendCarForms.driverPhone = val.checkArr.phone
						this.sendCarForms.driverIdcard = val.checkArr.idCard
						break;
					case '押运员':
						this.sendCarForms.driverName2 = val.result
						this.sendCarForms.driverPhone2 = val.checkArr.phone
						this.sendCarForms.driverIdcard2 = val.checkArr.idCard
						break;
					case '装货时间段':  //进园装卸货，有装卸能力
						this.sendCarForms.loadingPeriod = val.result
						this.sendCarForms.handlingId = val.checkArr.handlingId
						this.sendCarForms.handlingDetailsId = val.checkArr.id
						break;
					case '卸货时间段':
						this.sendCarForms.unloadingPeriod = val.result
						this.sendCarForms.handlingId = val.checkArr.handlingId
						this.sendCarForms.handlingDetailsId = val.checkArr.id
						break;
					default:
						break;
				}
			},
			abnormalSituation(id) { // 异常情况
				uni.navigateTo({
					url: `abnormal?id=${id}`
				})
			},
			overDownButton(){ // 完成修改
				const changeCarOption = this.sendCarForms
				if(this.sendCarOption.Periods.length!==0){
					this.sendCarOption.Periods.map((item)=>{// 维护了装货能力
						if(this.orderHeaderVO.stevedoreType==='进园装货'&&item.time==changeCarOption.loadingPeriod){
							changeCarOption.handlingId = item.handlingId
							changeCarOption.handlingDetailsId = item.id
						}
					})
				}
				cyfModel.apiOverDownChange(this.sendCarForms).then(res=>{
					if (res.code === 1) {
						uni.showToast({
							icon: 'none',
							title: '修改成功'
						});
						setTimeout(()=>{
							uni.navigateBack()
						}, 700);
					}
				})
			},
			dispatchCar() { // 派车
				let toastArray = []
				this.sendCarMustOption.map((item)=>{
					if(this.sendCarForms[item.value]===''){
						toastArray.push(item.name)
					}
				})
				if(toastArray.length!==0){
					uni.showToast({
						icon: 'none',
						title: `注意所有*号都为必填项,请先填写<--${toastArray[0]}-->`
					});
					return
				}
				const driverData = this.sendCarOption.drivers.find(res => {
					return this.sendCarForms.driverName === res.name
				})
				const driverCertData = driverData.certifications.find(res => {
					// 驾驶员从业资格证
					return res.code === 'TERM_OF_DRIVER_QUALIFICATION_CERTIFICATE'
				})
				if (!driverCertData.licenseNo) {
					driverCertData.licenseNo = ''
				}
				const driver2Data = this.sendCarOption.escorts.find(res => {
					return this.sendCarForms.driverName2 === res.name
				})
				const driver2CertData = driver2Data.certifications.find(res => {// 押运员从业资格证
					return res.code === 'TERM_OF_ESCORT_QUALIFICATION_CERTIFICATE'
				})
				if (!driver2CertData.licenseNo) {
					driver2CertData.licenseNo = ''
				}
				this.sendCarForms.stevedoreType = this.orderHeaderVO.stevedoreType === '进园装货' ? 0 : 1
				this.sendCarForms.waybillId = this.waybillVO.id
				this.sendCarForms.driverNo = driverCertData.licenseNo
				this.sendCarForms.driverNo2 = driver2CertData.licenseNo
				console.log(this.sendCarForms)
				if (this.sendCarOption.Periods.length === 0) { // 企业没有维护了该产品的装卸时间
					uni.showToast({
						icon: 'none',
						title: '装卸企业没有维护该产品装卸能力，无法派车'
					});
					return
				}
				cyfModel.apiDispatchingCar(this.sendCarForms).then(res => {
					if (res.code === 1) {
						uni.showToast({
							icon: 'none',
							title: '派车成功'
						});
						setTimeout(()=>{
							uni.navigateBack()
						}, 700);
					}
					else{
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					}
				})
			},
			ChangeItemForSee(item) { // 详情拉伸
				switch(item){
					case 'one':
						return this.hasChangeItemOne = !this.hasChangeItemOne;
					case 'two':
						return this.hasChangeItemTwo = !this.hasChangeItemTwo;
					case 'thr':
						return this.hasChangeItemThr = !this.hasChangeItemThr;
					case 'for':
						return this.hasChangeItemFor = !this.hasChangeItemFor;	
					default:
						return null 
				}
			},
			apiGetWaybillDetail(id) { // 详情
				const obj = {
					id: id
				}
				cyfModel.apiGetWaybillDetail(obj).then((res) => {
					this.orderHeaderVO = res.data.orderHeader
					this.orderProductVO = res.data.product[0]
					this.waybillVO = res.data.waybill
					this.loadingVoucher = config.api_base_url + this.waybillVO.loadingVoucher
					this.unloadingVoucher = config.api_base_url + this.waybillVO.unloadingVoucher
					if (parseInt(this.orderHeaderVO.stevedoreType) === 0) {
						this.orderHeaderVO.stevedoreType = '进园装货'
					}
					if (parseInt(this.orderHeaderVO.stevedoreType) === 1) {
						this.orderHeaderVO.stevedoreType = '进园卸货'
					}
					console.log(this.sendCarOption)
					console.log(this.sendCarForms)
					if (this.specialStatus === '待派车' || 
					this.specialStatus==='待装货'&&this.waybillVO.exceptionShow==='派车信息填写错误'|| 
					this.specialStatus==='待卸货'&&this.waybillVO.exceptionShow==='派车信息填写错误') {
						this.apiGetTankerList()
						this.apiGetTrailerList()
						this.apiGetEmployee()
						this.apiGetHandling()
						this.sendCarMustOption = sendCarMust
						if(this.specialStatus!=='待派车'){
						  const resData = this.waybillVO
						  const showEditObj = this.sendCarForms
						  showEditObj.driverName = resData.driverName
						  showEditObj.driverName2 = resData.driverName2
						  showEditObj.driverPhone = resData.driverPhone
						  showEditObj.driverPhone2 = resData.driverPhone2
						  showEditObj.loadingPeriod = resData.loadingPeriod
						  showEditObj.reservationLoadingDate = resData.reservationLoadingDate
						  showEditObj.reservationUnloadingDate = resData.reservationUnloadingDate
						  showEditObj.tankerNo = resData.tankerNo
						  showEditObj.truckCert = resData.truckCert
						  showEditObj.unloadingPeriod = resData.unloadingPeriod
						  showEditObj.vanCert = resData.vanCert
						  showEditObj.waybillId = resData.id
						  showEditObj.driverIdcard = resData.driverIdcard
						  showEditObj.driverIdcard2 = resData.driverIdcard2
						}
					}
				})
			},
			apiGetTankerList() { // 获取所有罐体
				const data = {
					name: '',
					pageNum: 1,
					pageSize: 1000
				}
				cyfModel.apiGetTankerList(data).then(res => {
					if (res.code === 1&&res.data.length!==0) {
						this.sendCarOption.tankers = res.data
						res.data.some(res => {
							const obj = {
								label: res.tankerNo,
								value: res.tankerNo
							}
							this.sendCarOption.tankersOption.push(obj)
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '获取罐体失败'
						});
					}
				})
			},
			apiGetTrailerList() { // 获取车辆列表
				const params = {
					pageNum: 1,
					size: 1000
				}
				cyfModel.apiGetTrailerList(params).then(res => {
					if (res.code === 1&&res.data.list!==0) {
						this.sendCarOption.vanCerts = res.data.list
						res.data.list.some(res => {
							const obj1 = {
								label: res.plateNo,
								value: res.plateNo,
								vanCertCode: res.nationalCode,
								vanCertLength: res.length,
								vanCertType: res.type
							}
							const obj2 = {
								label: res.plateNo,
								value: res.plateNo,
								truckCertLength: res.length,
								truckCertType: res.type
							}
							this.sendCarOption.vanCertsOption.push(obj1)
							this.sendCarOption.truckCertsOption.push(obj2)
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '获取车辆失败'
						});
					}
				})
			},
			apiGetEmployee() { // 驾驶员，押运员
				const data = {
					name: '',
					pageNum: 1,
					pageSize: 1000,
					position: 'driver'
				}
				const data2 = {
					name: '',
					pageNum: 1,
					pageSize: 1000,
					position: 'escort'
				}
				cyfModel.apiGetEmployee(data).then(res => {
					if (res.code === 1&&res.data.length!==0) {
						this.sendCarOption.drivers = res.data
						res.data.some(res => {
							const obj = {
								label: res.name,
								value: res.name,
								phone: res.phone,
								idCard: res.idCard
							}
							this.sendCarOption.driversOption.push(obj)
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '获取司机信息失败'
						});
					}
				})
				cyfModel.apiGetEmployee(data2).then(res => {
					if (res.code === 1&&res.data.length!==0) {
						this.sendCarOption.escorts = res.data
						res.data.some(res => {
							const obj = {
								label: res.name,
								value: res.name,
								phone: res.phone,
								idCard: res.idCard
							}
							this.sendCarOption.escortsOption.push(obj)
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '获取押运员信息失败'
						});
					}
				})
			},
			apiGetHandling() { // 获取装卸时间
				const data = {
					loadingEnterpriseId: this.orderHeaderVO.loadingEnterpriseId,
					productName: this.orderHeaderVO.productName,
					stevedoreType: this.orderHeaderVO.stevedoreType === '进园装货' ? 0 : 1,
					unloadingEnterpriseId: this.orderHeaderVO.unloadingEnterpriseId
				}
				console.log(data.loadingEnterpriseId, data.productName, data.stevedoreType, data.unloadingEnterpriseId)
				if (data.loadingEnterpriseId === '' && data.unloadingEnterpriseId === '') {
					uni.showToast({
						icon: 'none',
						title: '非系统内企业,无法查询装卸能力'
					});
					return
				}
				cyfModel.apiGetHandling(data).then(res => {
					if (res.code === 1&&JSON.stringify(res.data) !== "{}") {
						this.sendCarOption.Periods = res.data.handlingDetailsVOS.map(res => {
							res.time = res.startTime + '-' + res.endTime
							const obj = {
								label: res.time,
								value: res.time,
								handlingId: res.handlingId,
								id: res.id
							}
							if (this.orderHeaderVO.stevedoreType === '进园装货') {
								this.sendCarOption.loadTimeOption.push(obj)
							}
							if (this.orderHeaderVO.stevedoreType === '进园卸货') {
								this.sendCarOption.unloadTimeOption.push(obj)
							}
							return res
						})
						this.sendCarOption.handlings = res.data
						this.sendCarForms.productId = res.data.productId
						this.sendCarForms.productName = res.data.productName
					} else {
						uni.showToast({
							icon: 'none',
							title: '装卸能力获取失败,无法派车'
						});
					}
				})
			}

		}
	};
</script>

<style lang="scss" scoped>
	@import './css/waybillDetail'
</style>
