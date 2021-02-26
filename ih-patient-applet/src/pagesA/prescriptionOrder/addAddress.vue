<template>
    <view>
        <u-bar :nav="setNav"/>
        <view class="uni-content">
            <view class="uni-content-box">
                <view class="userList-details">
                    <view class="userList-detailsTitle">收货人</view>
                    <input placeholder="收货人" placeholder-style="color:#B2B2B2;" v-model="addressDetails.receiveName"
                           class="userList-detailsText" @input="userInputName"/>
                </view>
                <view class="userList-details">
                    <view class="userList-detailsTitle">手机号码</view>
                    <input type="number" placeholder="手机号码" placeholder-style="color:#B2B2B2;" v-model="addressDetails.receivePhone"
                           class="userList-detailsText" @input='userInputPhone'/>
                </view>
                <view v-preventReClick class="userList-details" @click="btnClick">
                    <view class="userList-detailsTitle">所在地区</view>
                    <input disabled="false" placeholder="请选择所在地区" placeholder-style="color:#B2B2B2;" v-model="addressName"
                           class="userList-detailsText"/>
                </view>
				<selectAddress v-preventReClick ref='selectAddress' @selectAddress="selectAddress" :addressDetailArray='addressDetailArray' :pickerSize="pickerSize" :pickerUrl="pickerUrl"></selectAddress>
				<view class="userList-details">
				    <view class="userList-detailsTitle">详细地址</view>
				    <input placeholder="家庭住址" placeholder-style="color:#B2B2B2;" v-model="addressDetails.receiveAddressDetail"
				           class="userList-detailsText" @input="userAddressDetails"/>
				</view>
                <view class="userList-details" style="justify-content: space-between;">
                    <view class=".userList-detailsTitle-bottom">设为默认地址</view>
                    <view class="uni-list-cell uni-list-cell-pd">
						<switch v-preventReClick v-model="displayBtn" :checked="displayBtn" @change="frontIsShow" color="#3B7CF4" class="uni-switch" />
					</view>
                </view>
				<view class="" style="padding: 120rpx 24rpx;display: flex;justify-content: space-between;">
					<view v-preventReClick @tap.stop.prevent="goBack" class="" style="color: #2884FF; border: 2rpx solid #2884FF;width: 340rpx; height: 70rpx; line-height: 70rpx;font-size: 26rpx; border-radius: 10rpx;text-align: center;margin-right: 10rpx;">取消</view>
					<view v-if="next" v-preventReClick @tap.stop.prevent="goSubmit" class="uni-submit uni-submitBtn">确定保存</view>
					<view v-if="!next" v-preventReClick @tap.stop.prevent="goSubmit" class="uni-submit uni-submitText">确定保存</view>
				</view>
            </view>
        </view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
    </view>
</template>

<script>
	import {prescriptionModel} from '@/models/prescriptionOrder.js'
	const prescription = new prescriptionModel()
	import selectAddress from '@/components/selectAddress/selectAddress.vue'
    export default {
		components: {
			selectAddress
		},
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '编辑地址'
                },
				loading: false,
				title: 'Hello',
				pickerSize: 4,//级别
				pickerUrl: 'https://g.aihuihc.com/basics/baseAddressInfo/queryAddress',//地址
				orderId: '',
				addressName: '',
				displayBtn: '',
				prescriptType: '',
				inputName: false,
				inputPhone: false,
				inputAddressName: false,
				inputAddressDetails: false,
				next: false,
				addressDetails: {
					userId: '',
					receiveName: '',
					receivePhone: '',
					receiveProvince: '',
					receiveCity: '',
					receiveZone: '',
					receiveStreet: '',
					receiveAddressDetail: '',
					defaultAddress: 0,
				},
				addressDetailArray:[],
                next: false
            }
        },
		onLoad(options) {
			this.prescriptType = options.type
			if(options.item){
				this.inputName = true
				this.inputPhone = true
				this.inputAddressName = true
				this.inputAddressDetails = true
				this.next = true
				this.addressDetail = JSON.parse(options.item)
				this.addressDetails = this.addressDetail
				if(this.addressDetails.receiveProvince){
					this.addressDetailArray.push(this.addressDetails.receiveProvince);
					if(this.addressDetails.receiveCity){
						this.addressDetailArray.push(this.addressDetails.receiveCity);
						if(this.addressDetails.receiveZone){
							this.addressDetailArray.push(this.addressDetails.receiveZone);
							if(this.addressDetails.receiveStreet){
								this.addressDetailArray.push(this.addressDetails.receiveStreet);
							}
						}
					}
				}
				this.addressName = this.addressDetails.receiveProvince+this.addressDetails.receiveCity+this.addressDetails.receiveZone+this.addressDetails.receiveStreet
				if(this.addressDetails.defaultAddress==1){
					this.displayBtn = true
				}else{
					this.displayBtn = false
				}
			}
			this.orderId = options.id
			this.typeUrl = options.typeUrl
		},
		onShow() {
		},
        methods: {
			btnClick() {
				this.$refs.selectAddress.show()
			},
			selectAddress(address) {
				this.addressDetails.receiveProvince = address[0]
				this.addressDetails.receiveCity =  address[1]
				this.addressDetails.receiveZone =  address[2]
				this.addressDetails.receiveStreet =  address[3]
				this.addressDetails.userId = uni.getStorageSync('userInfo').userId
				this.addressName = this.addressDetails.receiveProvince+this.addressDetails.receiveCity+this.addressDetails.receiveZone+this.addressDetails.receiveStreet
				if(this.addressName){
					this.inputAddressName = true
				}else{
					this.inputAddressName = false
				}
				this.isAllright()
			},
			userInputName() {
				var reg1 = /^.{1,20}$/;
				if(!reg1.test(this.addressDetails.receiveName)){
					this.inputName = false
				}else {
					this.inputName = true
				}
				this.isAllright()
			},
			userInputPhone() {
				var reg2 = /^[1][0-9]{10}$/;
				if(!reg2.test(this.addressDetails.receivePhone)){
					this.inputPhone = false
				}else {
					this.inputPhone = true
				}
				this.isAllright()
			},
			userAddressDetails() {
				if(!this.addressDetails.receiveAddressDetail){
					this.inputAddressDetails = false
				}else{
					this.inputAddressDetails = true
				}
				this.isAllright()
			},
			isAllright() {
				if (this.inputName && this.inputPhone && this.inputAddressName && this.inputAddressDetails) {
					this.next = true
				} else {
					this.next = false
				}
			},
			goSubmit(){
				if(this.next){
					const data = this.addressDetails
					if(this.addressDetail){
						this.$refs.loading.open();
						this.updateAddress(data)
					}else{
						this.$refs.loading.open();
						this.addAddress(data)
					}
					wx.redirectTo({
						url: '/pagesA/prescriptionOrder/editAddress?id='+this.orderId+'&typeUrl='+this.typeUrl+'&type='+this.prescriptType
					})
					setTimeout(()=>{
						this.addressDetails = ''
						this.addressName = ''
					},2000)
				}else if(!this.inputName){
					wx.showToast({
						title: '收货人填写不正确，请重新填写',
						icon: 'none'
					});
					return
				}else if(!this.inputPhone){
					wx.showToast({
						title: '请输入11位手机号码',
						icon: 'none'
					});
					return
				}else if(!this.inputAddressName){
					wx.showToast({
						title: '请选择所在地区',
						icon: 'none'
					});
					return
				}else if(!this.inputAddressDetails){
					wx.showToast({
						title: '请输入详细地址',
						icon: 'none'
					});
					return
				}
			},
			goBack(){
				wx.navigateBack({
				  delta: 1
				})
			},
			addAddress(data){
				prescription.addAddress(data).then(res=>{
					this.$refs.loading.close();
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err)
				})
			},
			updateAddress(data){
				prescription.updateAddress(data).then(res=>{
					this.$refs.loading.close();
				}).catch(err=>{
					this.$refs.loading.close();
					console.log(err)
				})
			},
			frontIsShow(){
				this.displayBtn = !this.displayBtn
				if(this.displayBtn == true){
					this.addressDetails.defaultAddress = 1
				}else {
					this.addressDetails.defaultAddress = 0
				}
			}
        }
    }
</script>

<style lang="scss" scoped>
    .uni-content {
		height: 100vh;
		background: #FFFFFF;
        padding: 12px;
    }

    .uni-content-box {
        height: 254px;
        background-color: #FFFFFF;
        border-radius: 8px;
    }

    .flex-item {
        width: 90%;
        margin: 0 auto;
        margin-top: 10px;
        height: 150px;
        background-color: white;
    }

    .userList-details {
        height: 50px;
        display: flex;
        border-bottom: 1px solid #E5E5E5;
    }

    .userList-detailsTitle {
        width: 190rpx;
		font-size: 30rpx;
        line-height: 100rpx;
        padding-left: 30rpx;
    }
	.userList-detailsTitle-bottom {
	    width: 330rpx;
		font-size: 30rpx;
	    line-height: 100rpx;
	    padding-left: 30rpx;
	}

    .userList-detailsText {
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 30rpx;
        padding: 0 20rpx;

        view {
            width: 120rpx;
            border-radius: 16rpx;
            text-align: center;
        }

    }

    .uni-black-color {
        color: #333333;
    }

    .uni-gray-color {
        color: #B2B2B2;
    }


    .uni-right-img {
        position: absolute;
        right: 10px;
        top: 15px;
        height: 20px;
        width: 10px;
        z-index: 100;
        background-color: #fff;
    }

    .isDisable {
        background-color: #F5F9FF;
        color: #B2B2B2;
        border: none !important;
    }

    .nodisable {
        background: #2884FF;
        color: #FFFFFF;
        border: none;
    }

    .uni-button-next {
        height: 47px;
        margin-top: 40px;
        line-height: 47px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        border-radius: 8px;
    }

    .uni-button-disabled {
        background: rgba(40, 132, 255, 0.2);
    }

    .uni-button-color {
        background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
    }
	.uni-switch{
		line-height: 50px;
	}
	.uni-submit{
		width: 340rpx;
		height: 70rpx;
		color: #FFFFFF;
		line-height: 70rpx;
		font-size: 26rpx;
		border-radius: 10rpx;
		text-align: center;
		margin-left: 10rpx;
	}
	.uni-submitBtn{
		background: linear-gradient(to right,#5EA6F8,#3B7CF4);
	}
	.uni-submitText{
		background: linear-gradient(to right,rgba(94, 166, 248, .2),rgba(59, 124, 244, .2));
	}
</style>

