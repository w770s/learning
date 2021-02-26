<template>
    <view>
        <u-bar :nav="setNav"/>
        <view class="swiper-box">
            <view class="uni-swipper-title"></view>
            <swiper class="swiper" previous-margin="20rpx" next-margin='240rpx' v-if="personData.length>0">
				<span v-for="(item,index) in personData" :key="index">
					<swiper-item>
						<view class="swiper-item" v-if="item.name">
							<view class="swiper-item-person" @tap.prevent.stop="radioTap(index,'person',item)">
								<view style="display: flex;flex-wrap: wrap;align-content: space-between;">
									<view style="font-size: 36rpx;margin-bottom:8rpx;font-weight: normal;width: 100%;">{{item.name}}</view>
									<view style="font-size: 30rpx;color:#B2B2B2;">{{item.gender===0?'男':'女'}} &nbsp;{{item.age}}岁</view>
								</view>
								<view class="uni-radio-choose">
									<radio style="transform:scale(1.2,1.2);" color="#2984FF"
                                           :checked="whichIndex===index"/>
								</view>
							</view>
						</view>
						<view class="swiper-item" v-if="!item.name">
                           <view class="swiper-item-default">
								<view>
									<view @tap="addPerson">
										<img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/addPatient.png"/>
									</view>
									<view style="font-size: 36rpx;color:#333333;">添加就诊人</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</span>
            </swiper>
        </view>
        <view class="uni-content">
            <view class="uni-user-box">
                <view class="uni-user-title">
                    <text>预约详情</text>
                </view>
                <view style="position: relative;background-color: #fff;border-radius:10rpx;padding: 30rpx;">
                    <view class="uni-cost" v-if="userInfo.doctorName">
                        <text class="uni-cost-text">就诊专家：</text>
                        <text class="uni-cost-content">
                            {{userInfo.doctorName?userInfo.doctorName:'---'}}({{(userInfo.doctorLevel?userInfo.doctorLevel:'')}})
                        </text>
                    </view>
                    <view class="uni-cost">
                        <text class="uni-cost-text">就诊科室：</text>
                        <text class="uni-cost-content">{{userInfo.departName}}{{isRemoteControl?'远程就诊':''}}</text>
                    </view>
                    <view class="uni-cost">
                        <text class="uni-cost-text">就诊时间：</text>
                        <text class="uni-cost-content">{{userInfo.clinicTimeTemp?userInfo.clinicTimeTemp:'---'}}</text>
                    </view>
                    <view class="uni-cost uni-cost-noMargin">
                        <text class="uni-cost-text">挂号费用：</text>
                        <text class="uni-cost-content">{{userInfo.regFee?userInfo.regFee/100+'元（实际价格请以支付时为准）':'---'}}</text>
                    </view>
                </view>
            </view>
            <view class="uni-user-sure">
<!--                <button @tap="sureConsult" class="uni-user-hasMes">确认预约</button>-->
                <u-button :loading="loading" @click="sureConsult" :throttleTime="1000" :customStyle="buttonStyle" type="primary" shape="square" size="default">确认预约</u-button>
            </view>
        </view>
        <u-prompt :visible.sync="promptVisible" title="确认预约" :closeName='closeName' :confirmName='confirmName' @close="clickPromptClose" @confirm="clickPromptConfirm">
            <view style="padding: 40rpx 40rpx 0rpx 40rpx;color:#333333;">
                <view style="margin-bottom: 50rpx;" v-for="(item,index) in tipsArray" :key="index">{{item?item:''}}</view>
            </view>
        </u-prompt>
        <u-prompt :visible.sync="isRemoteClinic" title="确认预约" :closeName='closeName' :confirmName='confirmName' @close="clickPromptClose" @confirm="clickPromptConfirm">
            <view style="padding: 40rpx 40rpx 0rpx 40rpx;color:#333333;">
                <view style="margin-bottom: 50rpx;">1、门诊时请带上历史检查资料及最后一次的出院小结；</view>
                <view style="margin-bottom: 50rpx;">2、门诊后医生会依据您的情况安排不同的远程会诊类型，并告知会诊费用和参与方式。</view>
            </view>
        </u-prompt>
    </view>
</template>

<script>
    import {createIMClient} from '../../util/util.js'
    import {
        healthyCardModel
    } from '@/models/healthyCard.js'
    const healthyCard = new healthyCardModel()
    import {
        consultingModel
    } from '@/models/consulting.js'
    const consulting = new consultingModel()
    const app = getApp()
    export default {
        data() {
            return {
                loading: false,
                twoData: false,
                visible: true,
                isDetail: false,
                promptVisible: false,
                isRemoteClinic: false,
                isRemoteControl: false,
				closeName: '再想想',
				confirmName: '确认',
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '医生预约'
                },
                whichIndex: 0,
                personData: [],
                listCheckData: [],
                filePath: {},
                userInfo: {},
                IdCards: '',
                price: '',
                userId: '',
                openId: '',
                doctorId: '',
                orderId: '',
                accid: '',
                orderNumber: '',
                hisDepartId: '',
                tipsArray: [],
                registerTips: '',
                buttonStyle:{
                    width: '640rpx',
                    textAlign: 'center',
                    lineHeight: '94rpx',
                    borderRadius: '16rpx',
                    color: '#fff',
                    background: 'linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%)'
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
            this.userInfo = JSON.parse(options.val)
            this.hisDepartId = options.hisDepartId
            this.userId = uni.getStorageSync('userInfo').userId
            this.openId = uni.getStorageSync('userInfo').openId
            this.isRemoteControl = uni.getStorageSync('isRemoteClinic')
            if (this.userId) {
                this.apiListHealthCard(this.userId)
                this.apiGetAdvisoryTips(this.hisDepartId)
            }
        },
        methods: {
            restoreIM(account, token) { // todo
                // createIMClient(account)
                uni.setStorageSync('whichIndex', this.whichIndex)
            },
            apiGetAdvisoryTips(departId) {
                consulting.getRegisterTips({departId}).then(res => {
                    this.registerTips = res.data.registerTips
                    if (this.registerTips) {
                        this.tipsArray = this.registerTips.split(/\n|\r\n/g,)
                        console.log(this.tipsArray);
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
            apiListHealthCard(userId) {
                healthyCard.listHealthCard({userId}).then(res => {
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
                                phone: item.phone,
                                id: item.id,
                                hisPatientId: item.hisPatientId,
                                address: item.address
                            })
                        }
                    })
                    if (this.personData.length < 5) {
                        this.personData.push({name: ''})
                    }
                    this.IdCards = this.personData[this.whichIndex].cardId
                }).catch((err) => {
                    console.log(err);
                })
            },
            radioTap(index, type, item) {
                console.log(index);
                if (type === 'person' && index !== this.whichIndex) {
                    this.IdCards = item.cardId
                    this.whichIndex = index
                    this.restoreIM(item.accid, item.token)
                }
            },
            clickPromptClose() {
                if(this.isRemoteControl){
                    this.isRemoteClinic = false
                    uni.setStorageSync('isRemoteClinic',false)
                }
                else if(!this.isRemoteControl){
                    this.promptVisible = false
                }
                this.loading = false
            },
            sureConsult() {
                let that = this
                if(this.personData.length>1){
                    this.isInBlackList()
                }
                else{
                    this.loading = false
                    wx.showModal({
                        title: '提示',
                        content: '您还没有添加健康卡,请添加健康卡后继续预约挂号',
                        cancelText: '再想想',
                        confirmText: '去添加',
                        success: function (res) {
                            that.addPerson()
                        }
                    })
                }
            },
            clickPromptConfirm(){
                this.loading = true
                this.promptVisible = false
                this.apiRegisterOrder()
            },
            apiRegisterOrder(){
                const data = {
                    endTime: this.userInfo.endTime,
                    shiftName: this.userInfo.specialName,
                    hospitalId: this.userInfo.hospitalId,
                    relationId: this.userInfo.relationId,
                    name: this.userInfo.name,
                    type: this.userInfo.type,
                    schedulesId: this.userInfo.scheduleId,
                    clinicTime: this.userInfo.regDate,
                    regFee: this.userInfo.regFee,
                    phone: this.personData[this.whichIndex].phone,
                    address: this.personData[this.whichIndex].address,
                    patientId: this.personData[this.whichIndex].hisPatientId,
                    idCard: this.personData[this.whichIndex].cardId,
                    healthCardId: this.personData[this.whichIndex].id,
                    patientName: this.personData[this.whichIndex].name,
                    headImage: 'http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png',
                }
                if(this.userInfo.departName){
                    data['departName'] = this.userInfo.departName
                }
                if(this.userInfo.doctorLevel){
                    data['doctorLevel'] = this.userInfo.doctorLevel
                }
                if(this.userInfo.doctorLevelCode){
                    data['doctorLevelCode'] = this.userInfo.doctorLevelCode
                }
                if(this.userInfo.description){
                    data['description'] = this.userInfo.description
                }
                if(this.userInfo.type === 1){
                    data['departId'] = this.hisDepartId
                }
                if(this.userInfo.clinicTimeTemp){
                    data['clinicTimeTemp'] = this.userInfo.clinicTimeTemp
                }
                this.addRegisterOrder(data)
            },
            isInBlackList() {
                const data = {
                    patientId: this.personData[this.whichIndex].hisPatientId
                }
                consulting.selectBlackList(data).then(res => {
                    if(!res.data || res.data.status !== 1){
                        if(this.isRemoteControl){
                            this.isRemoteClinic = true
                        }
                        else if(!this.isRemoteControl){
                            this.promptVisible = true
                        }
                    }
                    if(res.data.status === 1){
                        wx.showModal({
                            title: '提示',
                            content: '抱歉！当前号源暂时不对您开放，请联系电话0553-8397999',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {//这里是点击了确定以后
                                    console.log('用户点击确定')
                                }
                            }
                        })
                    }
                    console.log(this.personData)
                }).catch(err => {
                    this.loading = false
                    console.log(err);
                })
            },
            addRegisterOrder(data) {
                consulting.addRegisterOrder(data).then(res => {
                    let registerData = wx.getStorageSync('registerData')
                    if(registerData.length>0){
                        console.log('删除了');
                        wx.removeStorageSync('registerData')
                    }
                    uni.redirectTo({
                        url: `/pagesA/registerOrder/orderDetails?id=${res.data.id}`
                    })
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            addPerson() {
                let dataArray = [this.userInfo,this.hisDepartId]
                wx.setStorageSync('registerData',dataArray)
                uni.navigateTo({
                    url: `/pagesA/healthyCard/addCard`
                })
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

    .uni-user-box {
        font-size: 24rpx;
        color: gray;
        border-radius: 16rpx;
        margin-bottom: 40rpx;

        .uni-user-title {
            font-size: 36rpx;
            font-weight: bold;
            margin-right: 12px;
            margin-bottom: 20rpx;
            color: #333333;
        }

    }


    .uni-cost {
        font-size: 30rpx;
        margin-bottom: 15rpx;

        .uni-cost-text {
            display: inline-block;
            color: #989898FF;
            font-size: 30rpx;
        }

        .uni-cost-content {
            color: #3E3E3EFF;
            font-size: 30rpx;
        }
    }

    .uni-cost-noMargin{
        margin-bottom: 0rpx;
    }

    .uni-user-sure {
        position: fixed;
        width: 640rpx;
        height: 94rpx;
        left: 56rpx;
        bottom: 70rpx;
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;

        button {
            width: 100%;
            text-align: center;
            line-height: 94rpx;
            border-radius: 16rpx;
            color: #fff;
            background: rgba(40, 132, 255, 0.2);
        }

        .uni-user-hasMes {
            background: rgba(40, 132, 255, 1);

        }
    }

    .swiper-box {
        position: relative;
        height: 180rpx;
    }

    .uni-swipper-title {
        height: 104rpx;
        background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
    }

    .swiper {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 180rpx;

        .swiper-item {
            margin-right: 22rpx;
            padding: 30rpx;
            box-sizing: border-box;
            height: 180rpx;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 4rpx 12rpx 0px rgba(59, 124, 244, 0.15);
            border-radius: 16rpx;
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
                height: 68rpx;
                width: 68rpx;
                border-radius: 50%;
                margin-right: 20rpx;
            }
        }

        .messageTitle {
            color: #333333;
            font-size: 36rpx;
            font-weight: 600;
        }
    }
</style>

