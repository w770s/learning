<template>
	<view>
		<view class="header" :style="{'height':titleBarHeight+'px','padding-top':statusBarHeight+'px','background': nav.bg}">
			<view class="iconfont leftArrow header-back weight" :style="{'color':nav.textColor,'top':statusBarHeight-5+'px'}" v-if="nav.isdisPlayNavTitle" @click="back"></view>
			<view class="header-title weight" :style="{'color':nav.textColor,'top':statusBarHeight+10+'px'}">{{nav.navTitle}}</view>
		</view>
		<view class="search-waybill" v-if="nav.navTitle !== '采集方法'&&nav.navTitle !== '检验标本'" :style="{'height':externalHeight+'px','top':topTitleBox+'px','background': nav.bg}">
			<view class="search-input">
				<img class="icon-sousuo" src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/search.png" />
				<input @input="inputValueBlur" v-if="nav.navTitle!=='开西药'&&nav.navTitle!=='检查信息'&&nav.navTitle!=='检验信息'" v-model="inputValue" placeholder="搜索" />
				<input @input="inputValueBlur" v-if="nav.navTitle==='开西药'" v-model="inputValue" :placeholder="`可通过西药首字母搜索哦`" />
				<input @input="inputValueBlur" v-if="nav.navTitle==='检查信息'" v-model="inputValue" :placeholder="`可通过检查信息首字母搜索哦`" />
				<input @input="inputValueBlur" v-if="nav.navTitle==='检验信息'" v-model="inputValue" :placeholder="`可通过检验信息首字母搜索哦`" />
				<view v-if="inputValue" class="icon-cancel" @tap="delInputMes">
					<img src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/cancelicon.png" />
				</view>
			</view>
		</view>
		<view v-if="nav.navTitle !== '采集方法'&&nav.navTitle !== '检验标本'" :style="{'height':additionBarHeight+'px','padding-top':statusBarHeight+'px'}"></view>
		<view v-if="nav.navTitle === '采集方法'||nav.navTitle === '检验标本'" :style="{'height':titleBarHeight+'px','padding-top':statusBarHeight+'px'}"></view>
	</view>
</template>
<script>
	import {prescriptions} from '@/models/prescriptions.js'
	const prescript = new prescriptions()
	import debounce from '../../util/debounce'
	export default {
		props: {
			"nav": {
				type: Object,
				default: {
					'isdisPlayNavTitle': false,
					'navTitle': ''
				}
			},
			"route": {
				type: String,
				default: ''
			},
			"type": {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				inputValue: '',
				topTitleBox: 0,
				statusBarHeight: 0,
				titleBarHeight: 0,
				externalHeight: 0,
				additionBarHeight: 0
			}
		},
		mounted() {
			if(this.nav.externalHeight){
				this.externalHeight = this.nav.externalHeight
			}
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					if (res.model.indexOf('iPhone') !== -1) {
						that.titleBarHeight = 44;
						that.additionBarHeight = 44 + that.externalHeight;
					} else {
						that.titleBarHeight= 48;
						that.additionBarHeight = 48 + that.externalHeight;
					}
					that.topTitleBox = res.statusBarHeight + that.titleBarHeight
					that.statusBarHeight = res.statusBarHeight;
				}
			})
			if(this.nav.navTitle==='用药频率'){
				this.apiMedicineFrequencyList(this.inputValue)
			}
			if(this.nav.navTitle==='用药途径'){
				this.apiMedicineWay(this.inputValue)
			}
			if(this.nav.navTitle === '检查部位'){
				this.apiCheckpoint(this.inputValue)
			}
			if(this.nav.navTitle === '采集方法'){
				this.apiCheckmethods()
			}
			if(this.nav.navTitle === '检验标本'){
				this.apiCheckmethings()
			}
			console.log(this.nav);
		},
		methods: {
			returnFn(dataBoard,dataMes,dataReturn){
				if(!dataBoard){
					wx.showToast({
						title: `${dataMes}`,
						icon: 'none'
					})
					this.$emit('inputData', []);
					return
				}
				else{
					this.$emit('inputData', dataReturn);
				}
			},
			delInputMes(){
				this.inputValue = ''
				this.inputValueBlur()
			},
			apiIcdDisease(name){ // 临床诊断
				if(!name){
					this.$emit('inputData', []);
					return
				}
				else{
					prescript.icdDisease({name}).then(res=>{
						this.returnFn(res.data,res.message,res.data)
					}).catch(err=>{
						console.log(err);
					})
				}
			},
			apiMedicineSearch(name){ // 药品检索
				if(!name){
					this.$emit('inputData', []);
					return
				}
				else{
					prescript.medicineSearch({hospitalId: 1,abbreviationCode:name}).then(res=>{
						this.returnFn(res.data,res.message,res.data)
					}).catch(err=>{
						console.log(err);
					})
				}
			},
			apiMedicineFrequencyList(name){ // 用药频率
				prescript.medicineFrequencyList({name}).then(res=>{
					this.returnFn(res.data,res.message,res.data)
				}).catch(err=>{
					console.log(err);
				})
			},
			apiMedicineWay(name){ // 用药途径
				prescript.medicineWay({name}).then(res=>{
					this.returnFn(res.data,res.message,res.data)
				}).catch(err=>{
					console.log(err);
				})
			},
			apiIhCheckInspectionInfoChecka(type,searchValue){ // 检查信息/检验信息
				if(!searchValue){
					this.$emit('inputData', []);
					return
				}
				else {
					const dataMes = {
						"hospitalId": "1",
						"abbreviationCode": searchValue,
						"examineType": type
					}
					prescript.ihCheckInspectionInfoChecka(dataMes).then(res => {
						if (!res.data) {
							this.returnFn(res.data, res.message, '')
							return
						} else {
							this.returnFn(res.data, res.message, res.data.data)
						}
					}).catch(err => {
						console.log(err);
					})
				}
			},
			apiIhCheckInspectionInfoCheckb(type,searchValue){ //检验科室检索
				if(uni.getStorageSync('dosageData')){
					const dataSync = JSON.parse(uni.getStorageSync('dosageData'))
					console.log(dataSync);
					const dataMes = {
						"abbreviationCode" : searchValue,
						"examineCode" : dataSync.examineCode,
						"examineType" : type
					}
					prescript.ihCheckInspectionInfoCheckb(dataMes).then(res=>{
						if(!res.data){
							this.returnFn(res.data,res.message,'')
							return
						}
						else{
							this.returnFn(res.data,res.message,res.data.data)
						}
					}).catch(err=>{
						console.log(err);
					})
				}
			},
			apiCheckpoint(searchValue){ // 检查部位
				const dataSync = JSON.parse(uni.getStorageSync('dosageData'))
				const dataMes = {
					"abbreviationCode" : searchValue,
					"examineId" : dataSync.examineId,
				}
				prescript.checkpoint(dataMes).then(res=>{
					if(!res.data){
						this.returnFn(res.data,res.message,'')
						return
					}
					else{
						this.returnFn(res.data,res.message,res.data.data)
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			apiCheckmethods(){ // 采集方法,采集方法
				const dataSync = JSON.parse(uni.getStorageSync('dosageData'))
				const dataMes = {
					"examineId": dataSync.examineId,
					"examineType": 2,
					"partName": ""
				}
				prescript.checkmethods(dataMes).then(res=>{
					if(!res.data){
						this.returnFn(res.data,res.message,'')
						return
					}
					else{
						this.returnFn(res.data,res.message,res.data.data)
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			apiCheckmethings(){ // 检验标本
				const dataSync = JSON.parse(uni.getStorageSync('dosageData'))
				const dataMes = {
					"examineId" : dataSync.examineId
				}
				prescript.checkmethings(dataMes).then(res=>{
					if(!res.data){
						this.returnFn(res.data,res.message,'')
						return
					}
					else{
						this.returnFn(res.data,res.message,res.data.data)
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			inputValueBlur(e){
				debounce((e) => {
					this.inputValue = JSON.parse(JSON.stringify(this.inputValue.replace(/\s+/g, '')))
					if(this.nav.navTitle==='临床诊断'){
						this.apiIcdDisease(this.inputValue)
					}
					if(this.nav.navTitle==='开西药'){
						this.apiMedicineSearch(this.inputValue)
					}
					if(this.nav.navTitle==='用药频率'){
						this.apiMedicineFrequencyList(this.inputValue)
					}
					if(this.nav.navTitle==='用药途径'){
						this.apiMedicineWay(this.inputValue)
					}
					if(this.nav.navTitle==='检查信息'){
						this.apiIhCheckInspectionInfoChecka('1',this.inputValue)
					}
					if(this.nav.navTitle==='检验信息'){
						this.apiIhCheckInspectionInfoChecka('2',this.inputValue)
					}
					if(this.nav.navTitle==='检查部位'){
						this.apiCheckpoint(this.inputValue)
					}
					console.log(this.inputValue);
				}, 500);
			},
			// 回到上一页
			back() {
				if(this.route&&this.type!=='3'&&this.type!=='4'&&this.type!=='9'&&this.type!=='10'&&this.type!=='11'){
					console.log(this.route);
					uni.redirectTo({
						url: this.route
					})
					return
				}
				if(this.route&&(this.type==='3'||this.type==='4')){
					console.log(this.route);
					uni.redirectTo({
						url: '/pagesA/prescribe/prescribeDosage'
					})
					return
				}
				if(this.route&&(this.type==='9'||this.type==='10'||this.type==='11')){
					console.log(this.route);
					uni.redirectTo({
						url: '/pagesA/prescribe/prescribeCheck'
					})
					return
				}
				else{
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 100;
		left: 0;
		background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.header-addition {
		display: flex;
		align-items: center;
		position: fixed;
		width: 100%;
		z-index: 100;
		left: 0;
		background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.header .header-title {
		color: #fff;
		position: absolute;
		left: 50%;
		/*top: 30px;*/
		font-size: 18px;
		transform: translateX(-50%);
	}

	.header-back {
		position: absolute;
		// left: 12x;
		font-size: 18px;
		padding: 20px 20px 10px 10px;
		/*padding: 10px;*/
		border-radius: 50%;
		color: #fff;
	}

	.search-waybill {
		padding: 0rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		width: 100%;
		z-index: 100;
		left: 0;
		background:linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

	.search-input {
		width: 100%;
		height: 72rpx;
		background-color: #fff;
		border-right: none;
		font-size: 24rpx;
		line-height: 72rpx;
		border-radius: 36rpx;
		position: relative;
	}

	.icon-sousuo {
		width: 32rpx;
		height: 34rpx;
		top: 19rpx;
		margin-left: 24rpx;
		z-index: 100;
		position: absolute;
	}

	.icon-cancel{
		width: 100rpx;
		height: 72rpx;
		top: 0rpx;
		right: 0rpx;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		img{
			width: 28rpx;
			height: 28rpx;
		}
	}

	.search-input input {
		width: 100%;
		height: 72rpx;
		background-color: #fff;
		border-right: none;
		font-size: 24rpx;
		line-height: 72rpx;
		border-radius: 36rpx;
		padding: 10rpx 80rpx 10rpx 70rpx;
		box-sizing: border-box;
	}
</style>
