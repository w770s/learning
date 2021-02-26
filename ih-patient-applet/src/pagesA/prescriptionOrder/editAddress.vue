<template>
	<view class="uni-box">
		<u-bar :nav="setNav"/>
		<view class="uni-nav-box">
			<view class="uni-nav-contentBox">
				<view>取药方式</view>
				<view class="uni-nav-type">
					<view v-preventReClick @click="express" :class="['uni-select-btn uni-selectBtn',isIndex===1?'uni-select-name':'uni-default-name']">快递</view>
					<view v-preventReClick @click="invite" :class="['uni-select-btn',isIndex===0?'uni-select-name':'uni-default-name']">自取</view>
				</view>
			</view>
		</view>
		<view v-if="isIndex==1" class="uni-address-topBox" style="padding: 0 44rpx;">
			<view class="" style=" display: flex;align-items: center;justify-content: space-between;padding: 40rpx 0;border-bottom: 2rpx solid #E5E5E5;">
				<view class="">配送地址</view>
				<view v-preventReClick @click="goAddAddress" class="" style="display: flex;">
					<view class="">添加地址</view>
					<img style="width: 20rpx;height: 40rpx;" src="http://file.aihuihc.com/patient/patientImages/images/selectAddress.png" mode=""></img>
				</view>
			</view>
		</view>
		<view v-if="isIndex==1" v-for="(item,index) in addressList" :key="index" class="" style="padding: 0 44rpx;">
			<view class="" style=" display: flex;align-items: center; justify-content: space-between;padding: 40rpx 0;border-bottom: 2rpx solid #E5E5E5;">
				<view class="">
					<view class="" style="display: flex;align-items: center;">
						<view class="" style="font-size: 24rpx; color: #989898;">收货地址</view>
						<view v-if="item.defaultAddress===1" class="" style="width: 120rpx;height: 44rpx;text-align: center;font-size: 22rpx;border-radius: 6rpx;margin-left: 10rpx; line-height: 44rpx;color: #FFFFFF;background: linear-gradient(to right,#FFB554,#FFA36A);">默认地址</view>
					</view>
					<view class="" style="margin-top: 10rpx;">{{item.receiveProvince}}{{item.receiveCity}}{{item.receiveZone}}{{item.receiveStreet}}{{item.receiveAddressDetail}}</view>
					<view class="" style="margin-top: 10rpx;">联系人：{{item.receiveName}}</view>
					<view class="" style="margin-top: 10rpx;">联系电话：{{item.receivePhone}}</view>
				</view>
				<view class="" style="display: flex;align-items: center;">
					<img v-preventReClick @click="changeAddress(item)" style="width: 56rpx; height: 56rpx;margin-right: 40rpx;" src="http://file.aihuihc.com/patient/patientImages/images/edit.png" mode=""></img>
					<evan-radio v-preventReClick @change="changeRadio(index,item)" v-model="baseRadio" :label="item.id"></evan-radio>
				</view>
			</view>
		</view>
		<view v-if="isIndex==0" class="" style="padding: 0 44rpx;">
			<view class="" style=" display: flex;align-items: center;justify-content: space-between;padding: 40rpx 0;border-bottom: 2rpx solid #E5E5E5;">
				<view class="">自取地址</view>
			</view>
		</view>
		<view v-if="isIndex==0" v-for="(item,index) in addressList" :key="index" class="" style="padding: 0 44rpx;">
			<view class="" style=" display: flex;align-items: center; justify-content: space-between;padding: 40rpx 0;border-bottom: 2rpx solid #E5E5E5;">
				<view class="">
					<view class="">{{item.name}}<text style="color: #2884FF;">医院药房</text></view>
					<view class="" style="color: #989898;">{{item.address}}</view>
				</view>
				<view class="">
					<evan-radio v-preventReClick @change="changeRadio(index,item)" v-model="ziquRadio" :label="item.id"></evan-radio>
				</view>
			</view>
		</view>
		<view class="" style="padding: 120rpx 24rpx;display: flex;justify-content: space-between;">
			<view v-preventReClick @click="goBack" class="" style="color: #2884FF; border: 2rpx solid #2884FF;width: 340rpx; height: 70rpx; line-height: 70rpx;font-size: 26rpx; border-radius: 10rpx;text-align: center;margin-right: 10rpx;">取消</view>
			<view @tap.stop.prevent="goPay" class="" style="width: 340rpx; height: 70rpx; color: #FFFFFF;background: linear-gradient(to right,#5EA6F8,#3B7CF4);line-height: 70rpx;font-size: 26rpx;border-radius: 10rpx;text-align: center;margin-left: 10rpx;">确定保存</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import wybPopup from '@/components/wyb-popup/wyb-popup.vue'
	import {prescriptionModel} from '@/models/prescriptionOrder.js'
	const prescription = new prescriptionModel()
	import store from '@/store/index.js'
	let app = getApp()
	export default {
		components: {
			wybPopup
		},
		data() {
			return {
				baseRadio:0,
				ziquRadio:0,
				setNav: {
					isdisPlayNavTitle: true,
					'navTitle': '编辑地址'
				},
				loading: false,
				isIndex: '',
				orderId: '',
				userId: '',
				typeUrl: '',
				prescriptType: '',
				addressList: []
			}
		},
		onLoad(options){
			this.orderId = options.id
			this.typeUrl = options.typeUrl
			this.prescriptType = options.type
		},
		onShow(){
			this.userId = uni.getStorageSync('userInfo').userId
			this.apiListAddress(this.userId)
			this.isIndex= 1
		},
		methods:{
			apiListAddress(userId){
				this.$refs.loading.open();
				prescription.listAddress({userId}).then(res=>{
					this.$refs.loading.close();
					this.addressList = res.data
					var addressDetails = res.data.filter(item=>{
						return item.defaultAddress == 1
					})
					this.addressDetail = addressDetails[0]
					if(this.addressDetail){
						this.baseRadio = this.addressDetail.id;
					}
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
			goAddAddress(){
				wx.redirectTo({
					url: '/pagesA/prescriptionOrder/addAddress?id='+this.orderId+'&typeUrl='+this.typeUrl+'&type='+this.prescriptType
				})
			},
			changeAddress(item){
				wx.redirectTo({
					url: '/pagesA/prescriptionOrder/addAddress?item='+JSON.stringify(item)+'&id='+this.orderId+'&typeUrl='+this.typeUrl+'&type='+this.prescriptType
				})
			},
			changeRadio(index,item){
				this.addressDetail = item
			},
			goPay(){
				if(this.addressDetail){
					if(this.typeUrl == 'orderDetails'){
						wx.redirectTo({
							url: '/pagesA/prescriptionOrder/orderDetails?id='+this.orderId+'&addressDetail='+JSON.stringify(this.addressDetail)+'&isIndex='+this.isIndex+'&detailsId='+ this.detailsId
						})
					}
					if(this.typeUrl == 'prescriptionDetails'){
						wx.redirectTo({
							url:'/pagesA/consulting/prescriptionDetails?id='+this.orderId+'&addressDetail='+JSON.stringify(this.addressDetail)+'&isIndex='+this.isIndex+'&detailsId='+ this.detailsId+'&type='+this.prescriptType
						})
					}
				}else{
					wx.showToast({
						title: '请选择收货地址',
						icon: 'none'
					})
				}
			},
			getInvite(){
				this.$refs.loading.open();
				prescription.addressList().then(res=>{
					this.$refs.loading.close();
					this.addressList = res.data
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err)
				})
			},
			goBack(){
				wx.navigateTo({
					url:'/pagesA/prescriptionOrder/orderDetails?id='+this.orderId
				})
			},
			invite(){
				this.isIndex = 0
				this.getInvite()
			},
			express(){
				this.isIndex = 1
				this.apiListAddress(this.userId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-box{
		background: #FFFFFF;
		min-height:100vh;
	}
	.uni-nav-box{
		padding: 0 44rpx;
	}
	.uni-nav-contentBox{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 0;
		border-bottom: 2rpx solid #E5E5E5;
	}
	.uni-nav-type{
		display: flex;
	}
	.uni-select-btn{
		width: 120rpx;
		height: 44rpx;
		line-height: 44rpx;
		font-size: 24rpx;
		border-radius: 10rpx;
		text-align: center;
	}
	.uni-selectBtn{
		margin-right: 24rpx;
	}
	.uni-default-name{
		color: #2884FF;
		border: 2rpx solid #2884FF;
	}
	.uni-select-name{
		color: #FFFFFF;
		background: linear-gradient(to right,#5EA6F8,#3B7CF4);
	}
</style>
