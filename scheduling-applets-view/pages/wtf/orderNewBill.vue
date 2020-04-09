<template>
	<view class="content">
		<form @reset="formReset">
			<view class="uni-form-item uni-column">
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
								<text class="uni-number">01</text>
								装货信息
							</text>
						</view>
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>装货企业</text>
						<input @input="remoteMethod(orderHeaderVO.loadingEnterprise,'装货企业')" class="uni-input" v-model="orderHeaderVO.loadingEnterprise"
						 placeholder="请输入" />
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>装货地区</text>
						<input @tap="regionSelectTab('装货地区')" disabled="true" class="uni-input" v-model="orderHeaderVO.originDesc"
						 placeholder="请选择" />
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>详细地址</text>
						<input class="uni-input" v-model="orderHeaderVO.loadingAddress" placeholder="请输入" />
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>联系人</text>
						<input class="uni-input" v-model="orderHeaderVO.loadingContact" placeholder="请输入" />
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>联系电话</text>
						<input class="uni-input" type="number" v-model="orderHeaderVO.loadingContactPhone" placeholder="请输入" />
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">02</text>卸货信息</text>
						</view>
					</view>
					<view>
						<view class="list-item">
							<text><text class="must-write">*</text>卸货企业</text>
							<input @input="remoteMethod(orderHeaderVO.unloadingEnterprise,'卸货企业')" class="uni-input" v-model="orderHeaderVO.unloadingEnterprise"
							 placeholder="请输入" />
						</view>
						<view class="list-item">
							<text><text class="must-write">*</text>卸货地区</text>
							<input @tap="regionSelectTab('卸货地区')" disabled="true" class="uni-input" v-model="orderHeaderVO.destinationDesc"
							 placeholder="请选择" />
						</view>
						<view class="list-item">
							<text><text class="must-write">*</text>详细地址</text>
							<input class="uni-input" v-model="orderHeaderVO.unloadingAddress" placeholder="请输入" />
						</view>
						<view class="list-item">
							<text><text class="must-write">*</text>联系人</text>
							<input class="uni-input" v-model="orderHeaderVO.unloadingContact" placeholder="请输入" />
						</view>
						<view class="list-item">
							<text><text class="must-write">*</text>联系电话</text>
							<input class="uni-input" type="number" v-model="orderHeaderVO.unloadingContactPhone" placeholder="请输入" />
						</view>
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">03</text>承运方信息</text>
						</view>
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>运输企业</text>
						<input @tap="chooseFirm" class="uni-input" disabled="true" placeholder="请选择" v-model="orderHeaderVO.carrierEnterpriseName" />
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">04</text>货物信息</text>
						</view>
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>类别</text>
						<input @tap="selectorSelectTab('类别')" disabled="true" class="uni-input" placeholder="请选择" v-model="orderProductVO.type" />
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>货物名称</text>
						<input @tap="selectorSelectTab('货物名称')" disabled="true" class="uni-input" placeholder="请选择" v-model="orderProductVO.productName" />
					</view>
					<view class="list-item">
						<text>货物规格</text>
						<input @tap="selectorSelectTab('货物规格')" disabled="true" class="uni-input" placeholder="请选择" v-model="orderProductVO.specifications" />
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>包装</text>
						<input @tap="selectorSelectTab('包装')" disabled="true" class="uni-input" placeholder="请选择" v-model="orderProductVO.packageUnit" />
					</view>
					<view class="list-item">
						<text>件数</text>
						<view class="uni-input">
							<numberCalculate
							 :count="orderProductVO.number"
							 @addNum="addNum"
							 @minusNum="minusNum" />
						</view>
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>重量</text>
						<input class="uni-input" v-model="orderProductVO.weight" placeholder="请输入重量(吨)" />
					</view>
					<view class="list-item">
						<text>体积</text>
						<input class="uni-input" v-model="orderProductVO.volume" placeholder="请输入体积(立方米)" />
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">05</text>其他信息</text>
						</view>
					</view>
					<view class="list-item">
						<text><text class="must-write">*</text>运输意向</text>
						<input @tap="selectorSelectTab('运输意向')" disabled="true" class="uni-input" v-model="orderHeaderVO.stevedoreType"
						 placeholder="请选择" />
					</view>
					<view class="list-item">
						<text>运费(元）</text>
						<input class="uni-input" v-model="orderHeaderVO.totalPrice" placeholder="请输入" />
					</view>
					<view class="list-item">
						<text>结算方式</text>
						<input @tap="selectorSelectTab('结算方式')" disabled="true" class="uni-input" v-model="orderHeaderVO.clearingType"
						 placeholder="请选择" />
					</view>
					<view class="list-item">
						<text>订单数量</text>
						<view class="uni-input">
							<numberCalculate
							 :count="orderHeaderVO.orderNum"
							 @addNum="addOrderNum"
							 @minusNum="minusOrderNum" />
						</view>
					</view>
					<view class="list-item">
						<text>备注</text>
						<input class="uni-input" v-model="orderHeaderVO.remark" placeholder="请输入" />
					</view>
					<view class="list-item specific-switch" v-if="specialStatus!=='已拒绝'">
						<switch :checked="switchValue" color='#18B5F9' @change="switchChange" />
						<text>存为模板</text>
					</view>
					<view class="list-item" v-if="orderDraftVO.draftName">
						<text>模板名称</text>
						<input class="uni-input" disabled="true" v-model="orderDraftVO.draftName" />
					</view>
				</view>
			</view>
			<view class="uni-btn-v" v-if="specialStatus!=='已拒绝'">
				<button class="select-template" @tap="chooseTemplate">选择模板</button>
				<button class="issue-bill" @tap="publishTempleSon">发布订单</button>
				<button class="save-mes" @tap="publishTempleSon('保存')">保存</button>
				<button class="cancel-mes" type="default" formType="reset">取消</button>
			</view>
			<view class="uni-btn-v" v-if="specialStatus==='已拒绝'">
				<button v-if="specialStatus==='已拒绝'" class="big-orange" @tap="publishTempleSon">重新发单</button>
			</view>
		</form>
		<view class="uni-fuzzy-box" v-if="showMessage">
			<view class="uni-fuzzy-search">
				<view @tap="chooseFrim(item.value, item.id)" v-for="(item,index) in options" :key="index">{{item.value}}</view>
			</view>
		</view>
		<wPicker mode="region" :defaultVal="[10,0,5]" @confirm="regionConfirm" ref="region" themeColor="#f00"></wPicker>
		<w-picker v-if="selectList.length!=0" mode="selector" :defaultVal="[1]" @confirm="selectListConfirm" ref="selector"
		 themeColor="#f00" :selectList="selectList"></w-picker>
		<prompt :visible.sync="promptVisible" title="输入模板名称" placeholder="输入模板名称" @confirm="clickPromptConfirm" @close="clickPromptClose"
		 mainColor="#29B6F6">
		</prompt>
		<uni-popup ref="popup" type="center">
			<view class="flex-box">请选择货物规格</view>
			<view class="flex-button" v-for="(item,index) in cargoOption" :key='index'>
				<button @click="closePopup(item.value)">{{item.value}}</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import uniPopup from "@/components/uni-popup.vue"
	import Prompt from '@/components/prompt.vue';
	import numberCalculate from './components/countCalculate.vue'
	import * as SingelOptions from './js/option.js';
	import {
		WtfModel
	} from '../../models/wtf.js';
	const wtfModel = new WtfModel();
	export default {
		components: {
			wPicker,
			uniPopup,
			Prompt,
			numberCalculate
		},
		onLoad(option) {
			if (option.id && option.useWay !== '使用模版') {
				this.apiGetOrderDetail(option.id)
				console.log('正常发单')
				this.specialId = option.id
			}
			if (option.id && option.useWay === '使用模版') {
				this.apiWaybillTemplateDetail(option.id)
				console.log('使用模版')
			}
			if (option.status) {
				this.specialStatus = option.status
			}
			this.apiFuzzySearch()
		},
		onShow() {
			this.apiChangPingData()
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if (currPage.data.enterpriseId == undefined || currPage.data.enterpriseName == '') {
				return
			} else {
				this.orderHeaderVO.carrierEnterpriseName = currPage.data.enterpriseName
				this.orderHeaderVO.carrierEnterpriseId = currPage.data.enterpriseId
			}
		},
		data() {
			return {
				specialId: '',
				specialStatus: '',
				promptVisible: false,
				pickerHidden: true,
				switchValue: false,
				showMessage: false,
				whichCompany: '',
				regionStatus: '',
				selectorStatus: '',
				cargoID: '',
				orderbillID: '',
				options: [],
				orderArray: [],
				productArray: [],
				selectList: [],
				allFirmObjList: [],
				cargoOption: [],
				nameOption: [],
				orderDraftVO: {
					draftName: ''
				},
				orderHeaderVO: {
					// 装货信息
					loadingEnterprise: '',
					originDesc: '',
					loadingAddress: '',
					loadingRegionCode: '',
					loadingContact: '',
					loadingContactPhone: '',
					// 卸货信息
					unloadingEnterprise: '',
					destinationDesc: '',
					unloadingAddress: '',
					unloadingRegionCode: '',
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
					orderStatus: '',
					unloadingEnterpriseId: '',
					loadingEnterpriseId: ''
				},
				orderProductVO: {
					casNo: '',
					isBaseInfo: '',
					msdsUrl: '',
					unNo: '',
					masterRiskType: '',
					type: '',
					productName: '',
					packageUnit: '',
					weight: '',
					weightUnit: '吨',
					// 货物信息非必要字段
					specifications: '',
					number: '',
					volume: '',
					volumeUnit: '立方米'
				}
			};
		},
		methods: {
			addNum(number) {
				this.orderProductVO.number = number
			},
			minusNum(number) {
				this.orderProductVO.number = number
			},
			addOrderNum(number) {
				this.orderHeaderVO.orderNum = number
			},
			minusOrderNum(number) {
				this.orderHeaderVO.orderNum = number
			},
			openPopup() {
				this.$refs.popup.open()
			},
			closePopup(value) {
				this.orderProductVO.specifications = value
				this.$refs.popup.close()
			},
			apiFuzzySearch() { // 企业模糊查询
				wtfModel.apiFuzzySearch().then(res => {
					const array = []
					res.data.forEach((item, index) => {
						const obj = {
							id: '',
							value: ''
						}
						obj.id = item.registrationNo
						obj.value = item.name
						array.push(obj)
					})
					this.allFirmObjList = array;
					this.orderArray = SingelOptions.orderHeader;
					this.productArray = SingelOptions.orderProduct;
				}).catch(err => {
					console.log(err)
				})
			},
			chooseFrim(value, id) { // 选择装货卸货企业
				if (this.whichCompany === '装货企业') {
					this.orderHeaderVO.loadingEnterprise = value
					if (id) {
						this.orderHeaderVO.loadingEnterpriseId = id
					}
				}
				if (this.whichCompany === '卸货企业') {
					this.orderHeaderVO.unloadingEnterprise = value
					if (id) {
						this.orderHeaderVO.unloadingEnterpriseId = id
					}
				}
				this.showMessage = false
			},
			remoteMethod(query, company) { // 企业模糊查询
				if (query !== '') {
					this.whichCompany = company
					this.showMessage = true;
					setTimeout(() => {
						this.options = this.allFirmObjList.filter(item => {
							return item.value.toLowerCase()
								.indexOf(query.toLowerCase()) > -1
						})
						if (this.options.length === 0) {
							const obj = {
								value: ''
							}
							obj.value = query
							this.options.push(obj)
						}
					}, 200)
				} else {
					this.options = []
					this.showMessage = true;
				}
			},
			apiChangPingData(value) {
				const data = {
					'size': 100
				}
				const array1 = []
				const array2 = []
				wtfModel.apiChangPingData(data).then(res => {
					// 产品库分页
					res.data.records.forEach((item) => {
						if (item.nameCh === value) { // 检测到产品 货物规格
							this.orderProductVO.casNo = item.casNo
							this.orderProductVO.isBaseInfo = item.isBaseInfo
							this.orderProductVO.msdsUrl = item.msdsUrl
							this.orderProductVO.unNo = item.unNo
							this.orderProductVO.masterRiskType = item.masterRiskType
							const barry = item.specifications.split(',').splice(0, item.specifications.split(',').length - 1)
							barry.forEach((item) => {
								const obj1 = {
									value: '',
									label: ''
								}
								obj1.value = item
								obj1.label = item
								array2.push(obj1)
							})
							this.cargoOption = array2
							console.log(array2)
						}
						const obj2 = {
							value: '',
							label: ''
						}
						obj2.value = item.nameCh
						obj2.label = item.nameCh
						array1.push(obj2)
					})
					this.nameOption = array1
				}).catch(err => {
					console.log(err)
				})
			},
			switchChange(e) {
				this.switchValue = e.target.value
				if (e.target.value) {
					this.promptVisible = true
				} else {
					this.orderDraftVO.draftName = ''
				}
			},
			clickPromptConfirm(val) { // 模版谈框
				this.promptVisible = false
				if (val) {
					this.orderDraftVO.draftName = val
				} else {
					this.switchValue = false
				}
			},
			clickPromptClose() { // 模版谈框
				this.promptVisible = false
				this.switchValue = false
			},
			chooseTemplate() {
				uni.navigateTo({
					url: 'orderTemplate'
				})
			},
			chooseFirm() {
				uni.navigateTo({
					url: 'orderChooseCyf'
				})
			},
			regionSelectTab(value) { // 省市区框
				this.$refs['region'].show();
				this.regionStatus = value
			},
			regionConfirm(val) { // 省市区
				const orderHeaderVO = this.orderHeaderVO
				if (this.regionStatus === '装货地区') {
					orderHeaderVO.originDesc = val.checkArr.join('/')
					orderHeaderVO.loadingRegionCode = val.checkValue[2]
				} else if (this.regionStatus === '卸货地区') {
					orderHeaderVO.destinationDesc = val.checkArr.join('/')
					orderHeaderVO.unloadingRegionCode = val.checkValue[2]
				}
			},
			selectorSelectTab(value) { // 单选框
				if (value === '类别') {
					this.selectList = SingelOptions.typeOption
				}
				if (value === '包装') {
					this.selectList = SingelOptions.packOption;
				}
				if (value === '运输意向') {
					this.selectList = SingelOptions.transportIntension
				}
				if (value === '结算方式') {
					this.selectList = SingelOptions.paymentsWay
				}
				if (value === '货物名称') {
					this.selectList = this.nameOption
				}
				if (value === '货物规格') {
					this.openPopup()
					console.log(this.cargoOption)
					// this.selectList = this.cargoOption
					return
				}
				if (this.selectList.length !== 0) {
					this.$nextTick(() => {
						this.$refs['selector'].show();
					})
				}
				this.selectorStatus = value;
			},
			selectListConfirm(val) { // 运输意向 结算方式 类别 货物名称 货物规格 包装
				console.log(val)
				if (this.selectorStatus === '类别') {
					this.orderProductVO.type = val.result
				}
				if (this.selectorStatus === '包装') {
					this.orderProductVO.packageUnit = val.result
				}
				if (this.selectorStatus === '货物名称') {
					this.orderProductVO.specifications = ''
					this.orderProductVO.productName = val.result
					this.apiChangPingData(val.result)
				}
				if (this.selectorStatus === '货物规格') {
					this.orderProductVO.specifications = val.result
				}
				if (this.selectorStatus === '运输意向') {
					this.orderHeaderVO.stevedoreType = val.result
				}
				if (this.selectorStatus === '结算方式') {
					this.orderHeaderVO.clearingType = val.result
				}
			},
			publishTempleSon(buttonName) { // 新增订单
				// 都为必填选项
				const order = this.orderHeaderVO
				const product = this.orderProductVO
				const orderToastArray = []
				const productToastArray = []
				this.orderArray.map((item) => {
					if (order[item.value] === '') {
						orderToastArray.push(item.name)
					}
				})
				this.productArray.map((item) => {
					if (product[item.value] === '') {
						productToastArray.push(item.name)
					}
				})

				if (orderToastArray.length > 0) {
					uni.showToast({
						title: `注意:所有 * 都为必填信息,请先填写——${orderToastArray[0]}——信息`,
						icon: 'none',
						duration: 2000
					})
					return
				}

				if (productToastArray.length > 0) {
					uni.showToast({
						title: `注意:所有 * 都为必填信息,请先填写——${productToastArray[0]}——信息`,
						icon: 'none',
						duration: 2000
					})
					return
				}

				if (this.orderHeaderVO.stevedoreType === '进园装货') {
					this.orderHeaderVO.stevedoreType = 0
				}
				if (this.orderHeaderVO.stevedoreType === '进园卸货') {
					this.orderHeaderVO.stevedoreType = 1
				}
				const data = {
					'orderHeaderVO': this.orderHeaderVO,
					'orderProductVO': this.orderProductVO
				}
				if (this.orderDraftVO.draftName !== '') {
					const key = 'orderDraftVO'
					const value = this.orderDraftVO
					data[key] = value
				}
				// 其他非必填信息
				if (this.cargoID !== '') { // 货物id
					const key = 'id'
					const value = this.cargoID
					data['orderProductVO'][key] = value
				}
				if (this.orderbillID !== '') { // 运单信息id
					const key = 'id'
					const value = this.orderbillID
					data['orderHeaderVO'][key] = value
				}
				if (buttonName === '保存') {
					data['orderHeaderVO'].orderStatus = 'ORDER-STATUS-DFD'
				}
				if(buttonName !== '保存'){
					data['orderHeaderVO'].orderStatus = 'ORDER-STATUS-DJD'
				}
				wtfModel.apiAddWaybillPage(data).then(() => {
					uni.showToast({
						icon: 'none',
						title: '操作成功'
					})
					setTimeout(() => {
						uni.reLaunch({
							url: 'order'
						})
					}, 700)
				}).catch(err => {
					console.log(err)
				})
			},
			mergeData(orderHeaderVO, orderProductVO) {
				Object.keys(this.orderHeaderVO).map((key) => {
					this.orderHeaderVO[key] = orderHeaderVO[key]
				})
				Object.keys(this.orderProductVO).map((key) => {
					this.orderProductVO[key] = orderProductVO[key]
				})
				if (parseInt(this.orderHeaderVO.stevedoreType) === 0) {
					this.orderHeaderVO.stevedoreType = '进园装货'
				}
				if (parseInt(this.orderHeaderVO.stevedoreType) === 1) {
					this.orderHeaderVO.stevedoreType = '进园卸货'
				}
			},
			apiWaybillTemplateDetail(id) { // 使用模板
				const data = {
					'orderDraftId': id
				}
				wtfModel.apiWaybillTemplateDetail(data).then(res => {
					if(res.code!==-1){
						const orderHeaderVO = res.data.orderHeaderVO
						const orderProductVO = res.data.orderProductVO
						this.mergeData(orderHeaderVO, orderProductVO)
					}else{
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},
			apiGetOrderDetail(id) { // 待发单列表
				wtfModel.apiGetOrderDetail(id).then((res) => {
					if (res.code !== -1) {
						const orderHeaderVO = res.data.orderHeaderVO
						const orderProductVO = res.data.orderProductVO
						this.mergeData(orderHeaderVO, orderProductVO)
						if (orderProductVO.id) {
							this.cargoID = orderProductVO.id // 货物id
						}
						if (orderHeaderVO.id) {
							this.orderbillID = orderHeaderVO.id // 运单信息id
						}
						console.log(123)
						this.apiChangPingData(this.orderProductVO.productName)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},
			formReset(e) {
				uni.reLaunch({
					url: 'order'
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/newBill'
</style>
