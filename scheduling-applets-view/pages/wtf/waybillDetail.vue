<template>
	<view class="content">
		<uni-steps 
		v-if="specialStatus!=='异常'"
		:data="[
		    {title: '待派车'}, 
		    {title: '待装货'}, 
		    {title: '待卸货'}, 
			{title: '待签收'},
		    {title: '已完成'}]" 
		    :active="activeStep">
		</uni-steps>
		<view class="abnormal-box" v-if="specialStatus==='异常'">
			<image src='../../static/image/abnormal.png' />
			<text>运单异常!</text>
			<view>请时刻关注最新运单信息</view>
		</view>
		<form>
			<view class="uni-form-item uni-column">
				<view class="uni-list-box">
					<view class="uni-form-title-box" @tap="ChangeItemForSee('one')">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
								订单信息
							</text>
							<view :class="['iconfont-box',hasChangeItemOne?'iconfont-transfrom':'']">
								<text class="iconfont">&#xe625;</text>
							</view>
						</view>
					</view>
					<view v-if="hasChangeItemOne">
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
				<view class="uni-list-box" v-if="specialStatus!=='待派车'">
					<view class="uni-form-title-box" @tap="ChangeItemForSee('two')">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
								调度信息
							</text>
							<view :class="['iconfont-box',hasChangeItemTwo?'iconfont-transfrom':'']">
								<text class="iconfont">&#xe625;</text>
							</view>
						</view>
					</view>
					<view v-if="hasChangeItemTwo">
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
				<view class="uni-list-box" v-if="specialStatus==='待签收'||specialStatus==='已完成'">
					<view class="uni-form-title-box" @tap="ChangeItemForSee('thr')">
						<view class="uni-form-title-line">
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
				<view class="uni-list-box" v-if="waybillVO.isException===1&&specialStatus!=='待派车'">
					<view class="uni-form-title-box" @tap="ChangeItemForSee('for')">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
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
			<view class="uni-btn-v" v-if="specialStatus==='待签收'&&waybillVO.isException===0">
				<button class="big-orange" @tap="cancelOrderBill">签收</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		WtfModel
	} from '../../models/wtf.js';
	import {
		config
	} from '@/config.js'
	const wtfModel = new WtfModel();
	import uniSteps from "@/components/uni-steps/uni-steps.vue"
	export default {
		components:{
			uniSteps
		},
		onLoad(option) {
			if (option.id) {
				this.apiGetOrderDetail(option.id)
				this.specialId = option.id
			}
			if (option.waybillStatus) {
				this.specialStatus = option.status
				switch(option.waybillStatus){
					case 'WAYBILL-STATUS-DPC':
						return this.activeStep = 0
					case 'WAYBILL-STATUS-DZH':
						return this.activeStep = 1
					case 'WAYBILL-STATUS-DXH':
						return this.activeStep = 2
					case 'WAYBILL-STATUS-DQS':
						return	this.activeStep = 3
					case 'WAYBILL-STATUS-YWC':
					    return this.activeStep = 4
					default:
					    return this.activeStep = 0
				}
			}
		},
		data() {
			return {
				activeStep: '',
				specialId: '',
				specialStatus: '',
				hasChangeItemOne: true,
				hasChangeItemTwo: false,
				hasChangeItemThr: false,
				hasChangeItemFor: false,
				loadingVoucher: '',
				unloadingVoucher: '',
				orderHeaderVO: {
					// 装货信息
					loadingEnterprise: '',
					originDesc: '',
					loadingAddress: '',
					loadingContact: '',
					loadingContactPhone: '',
					// 卸货信息
					unloadingEnterprise: '',
					destinationDesc: '',
					unloadingAddress: '',
					unloadingContact: '',
					unloadingContactPhone: '',
					// 承运方
					carrierEnterpriseName: '',
					carrierEnterpriseId: '',
					// 其他信息
					stevedoreType: '',
					// 可选参数
					totalPrice: '',
					clearingType: '',
					orderNum: '',
					remark: '',
					// 其他必要参数
					orderStatus: ''
				},
				orderProductVO: {
					type: '',
					productName: '',
					packageUnit: '',
					weight: '',
					// 货物信息非必要字段
					specifications: '',
					number: '',
					volume: ''
				},
				waybillVO: {
					// 调度信息
					vanCert: '',
					truckCert: '',
					tankerNo: '',
					driverName: '',
					driverPhone: '',
					driverName2: '',
					driverPhone2: '',
					reservationLoadingDate: '',
					loadingPeriod: '',
					reservationUnloadingDate: '',
					unloadingPeriod: '',
					id: '',
					// 回单
					loadingVoucher: '',
					unloadingVoucher: '',
					loadingWeight: '',
					unloadingWeight: '',
					lossingWeight: '',
					loadingDate: '',
					unloadingDate: '',
					// 异常情况
					isException: '',
					exceptionStatus: '',
					exceptionShow: '',
					remark: ''
				}
			};
		},
		methods: {
			ChangeItemForSee(item) {
				if(item==='one'){
					this.hasChangeItemOne = !this.hasChangeItemOne;
					this.hasChangeItemTwo = false;
					this.hasChangeItemThr = false;
					this.hasChangeItemFor = false;
				}
				if(item==='two'){
					this.hasChangeItemTwo = !this.hasChangeItemTwo;
					this.hasChangeItemOne = false;
					this.hasChangeItemThr = false;
					this.hasChangeItemFor = false;
				}
				if(item==='thr'){
					this.hasChangeItemThr = !this.hasChangeItemThr;
					this.hasChangeItemOne = false;
					this.hasChangeItemTwo = false;
					this.hasChangeItemFor = false;
				}
				if(item==='for'){
					this.hasChangeItemFor = !this.hasChangeItemFor;
					this.hasChangeItemOne = false;
					this.hasChangeItemTwo = false;
					this.hasChangeItemThr = false;
				}
			},
			cancelOrderBill() { // 签收
				const data = {
					'id': this.waybillVO.id,
					'waybillStatus': 'WAYBILL-STATUS-YWC',
				}
				wtfModel.apiUpdateWaybill(data).then(res => {
					if (res.code === 1) {
						uni.showToast({
							icon: 'none',
							title: '签收成功'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 700)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			mergeData(orderHeaderVO, orderProductVO, waybillVO) {
				Object.keys(this.orderHeaderVO).map((key) => {
					this.orderHeaderVO[key] = orderHeaderVO[key]
				})
				Object.keys(this.orderProductVO).map((key) => {
					this.orderProductVO[key] = orderProductVO[key]
				})
				Object.keys(this.waybillVO).map((key) => {
					this.waybillVO[key] = waybillVO[key]
				})
				this.loadingVoucher = config.api_base_url + waybillVO.loadingVoucher
				this.unloadingVoucher = config.api_base_url + waybillVO.unloadingVoucher
			},
			apiGetOrderDetail(id) {
				const obj = {
					id: id
				}
				wtfModel.apiGetWaybillDetail(obj).then((res) => {
					const orderHeaderVO = res.data.orderHeader
					const orderProductVO = res.data.product[0]
					const waybillVO = res.data.waybill
					this.mergeData(orderHeaderVO, orderProductVO, waybillVO)
				}).catch(res => {
					console.log(res)
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/waybillDetail'
</style>
