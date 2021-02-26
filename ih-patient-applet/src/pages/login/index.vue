<template>
    <view>
        <u-bar :nav="setNav" />
        <u-prompt :visible.sync="promptVisible" :closeName='closeName' :confirmName='confirmName' :cancelShow="false" :title="val" @confirm="clickPromptConfirm">
            <view style="height: 96px;width: 100%;padding:10px;box-sizing: border-box;">
                <u-barcode cid="code129" :loadMake="true" :val="healthNo" :opations="opations" format="code128" ref="code128" />
            </view>
        </u-prompt>
        <view class="personal-box">
            <view class="personal-flex-box">
                <view>
                    <img :src="userImg" @tap="selectOptions('设置')"/>
                </view>
                <view class="personal-login-status">
                    <view style="font-size: 18px;margin-bottom:4px;">{{ isLogin?nickName:'未登录'}}</view>
                    <view style="font-size: 12px;">{{ isLogin?'欢迎使用海螺互联网医院':'登录后可进行预约挂号健康咨询...'}}</view>
                </view>
            </view>
        </view>
        <view class="swiper-box">
            <view class="swiper-no-box" v-if="personData.length===0">
                <view class="swiper-no-status">
                    <view @tap="selectOptions('添加健康卡')">
                        <img src='http://file.aihuihc.com/patient/patientImages/images/medicalReport/addPatient.png'>
                    </view>
                    <view style="font-size: 18px;margin-bottom:4px;">{{personData.length===0?'您还没有添加健康卡': '添加健康卡'}}</view>
                    <view style="font-size: 12px;color:#B2B2B2;">添加健康卡，使用预约挂号等医疗服务</view>
                </view>
            </view>
            <swiper class="swiper" previous-margin="20px" next-margin='20px' v-if="personData.length>0">
				<span v-for="(item,index) in personData" :key="index">
					<swiper-item>
						<view @tap="goForDetail(item)" class="swiper-item" v-if="item.name" @tap.prevent.stop="">
							<view class="swiper-item-person" >
								<view>
									<view style="font-size: 18px;margin-bottom:4px;">{{item.name}}</view>
									<view style="font-size: 12px;color:#B2B2B2;">{{item.gender===0?'男':'女'}} &nbsp;{{item.age}}岁</view>
								</view>
								<view @tap.prevent.stop="weixinQrcode(item)" class="uni-imggroup-box" style="position:relative;">
									<img src='http://file.aihuihc.com/patient/patientImages/images/login/qrcode.png'>
									<img class="uni-imggroup-back" src='http://file.aihuihc.com/patient/patientImages/images/login/cardBack.png'>
								</view>
							</view>
                            <view @tap="switchChange(index,item)" @tap.prevent.stop="" style="font-size: 15px; color: #B2B2B2; height: 40px;position:relative;">
                                <switch style="transform:scale(0.7,0.7);position:absolute;z-index:1;left: -10px;top:6px;" color="#3B7CF4" :checked="index===whichIndex" :disabled="index===whichIndex" />
                                <text style="transform:scale(0.7,0.7);position:absolute;z-index:2;height:50px;width: 55px; left: -10px;top:0px;"></text>
                                <text style="line-height: 45px;margin-left: 55px;">默认健康卡</text>
                            </view>
						</view>
						<view class="swiper-item" v-if="!item.name">
                            <view style="width: 100%;height:100%;margin:0;position:relative;text-align: center;">
                                <view @tap="selectOptions('添加健康卡')">
                                    <img class="uni-add-img" src='http://file.aihuihc.com/patient/patientImages/images/medicalReport/addPatient.png'>
                                </view>
                                <view style="font-size: 18px;margin-bottom:4px;">{{personData.length===1?'您还没有添加健康卡':'添加健康卡'}}</view>
                                <view style="font-size: 12px;color:#B2B2B2;">添加健康卡，使用预约挂号等医疗服务</view>
                            </view>
						</view>
					</swiper-item>
				</span>
            </swiper>
        </view>
        <view class="uni-options-box">
            <view style="margin-top:20px;" v-for="(item,index) in medicalservices" :key="index">
                <text style="color: #3E3E3E;font-size: 20px;font-weight: bold;">{{item.name}}</text>
                <view class="uni-options-flex">
                    <view
                      class="uni-options-item"
                      @tap="selectOptions(items.name)"
                      v-for="(items,inde) in item.itemImage"
                      :key="inde">
                            <img :src='items.imgIcon' />
                            <view>
                                <text>{{items.name}}</text>
                            </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {createIMClient} from "../../util/util";
    let app = getApp()
    import {
        healthyCardModel
    } from '@/models/healthyCard.js'
    import {loginMedicalservices} from '@/util/version1.js';
    const healthyCard = new healthyCardModel()
    import { settingModel } from '@/models/setting.js'
    const setting = new settingModel()
    export default {
        data() {
            return {
                skeleton1 : {
                    avatarSize: '52px',
                    row: 3,
                    showTitle: true,
                },
                setNav: {
                    'navTitle': '健康管家'
                },
                medicalservices: loginMedicalservices,
                val: '',
                healthNo: '',
                defaultVal: '123',
                size: 600,
                background: '#000000',
                foreground: '#fff',
                onval: true,
                loadMake: true,
                userImg: '',
                userId: '',
                nickName: '',
                isLogin: false,
                promptVisible: false,
                whichIndex: 0,
                personData: [],
				closeName: '再想想',
				confirmName: '确认',
                opations: {
                    format: "CODE128",//选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
                    width: 80,//设置条之间的宽度
                    displayValue: false,//是否在条形码下方显示文字
                    height: 150,
                    fontSize: 100,
                    textAlign: "left",//设置文本的水平对齐方式
                    textPosition: "bottom",//设置文本的垂直位置
                    textMargin: 0,//设置条形码和文本之间的间距
                    background: "#FFFFFF",//设置条形码的背景色
                    margin: 0,//设置条形码周围的空白边距
                },
            }
        },
        onShow() {
            this.userId = uni.getStorageSync('userInfo').userId
            let whichIndex = uni.getStorageSync('whichIndex')+''
            if(whichIndex){
                this.whichIndex = parseInt(whichIndex)
                console.log(this.whichIndex);
            }
            this.isLogin = false
            if (this.userId) {
                this.isLogin = true
                this.userId = uni.getStorageSync('userInfo').userId
                this.apiListHealthCard(this.userId)
                this.apiSelectUserInfo(this.userId)
                this.$refs['code128']._makeCode()
            }
            if(!this.userId){
                this.userImg = ''
                this.personData = []
            }
        },
        methods: {
            initIM(){
                if(this.personData.length>1){
                    createIMClient(this.personData[this.whichIndex].accId)
                }
            },
            weixinQrcode(item) {
                this.$refs['code128']._makeCode()
                this.val = item.name
                this.healthNo = item.healthCardNo
                this.promptVisible = true
            },
            clickPromptConfirm() {
                this.promptVisible = false
            },
            goForDetail(item) {
                wx.navigateTo({
                    url: '/pagesA/healthyCard/userCard?healthCardNo=' + item.healthCardNo,
                })
            },
            switchChange(index, item) {
                if(index!==this.whichIndex){
                    const that = this
                    wx.showModal({
                        title: '提示',
                        cancelText: '再想想',
                        content: `需要添加${item.name}为默认健康卡吗？`,
                        success(res) {
                            if (res.confirm) {
                                that.whichIndex = index
                                uni.setStorageSync('whichIndex',that.whichIndex)
                                that.initIM()
                            } else if (res.cancel) {
                                console.log(that.whichIndex);
                                // 用户点击取消
                            }
                        }
                    });
                }
            },
            apiSelectUserInfo(userId) {
                setting.selectUserInfo({userId}).then(res => {
                    this.userImg = res.data.avatarUrl
                    this.nickName = res.data.nickName
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiListHealthCard(userId) {
                healthyCard.listHealthCard({userId}).then(res => {
                    let cacheData = uni.getStorageSync('loginPage')
                    if(cacheData){
                        this.personData = cacheData
                    }
                    this.personData = []
                    uni.setStorageSync('loginPage',JSON.parse(JSON.stringify(res.data.healthCardList)))
                    this.personData = res.data.healthCardList
                    if(this.personData.length<5){
                        this.personData.push({name: ''})
                    }
                    if(this.personData[this.whichIndex].accId){
                        this.initIM(this.personData[this.whichIndex].accId)
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            selectOptions(name) {
                if (!this.isLogin) {
                    wx.showModal({
                        title: '请先登录哦~',
                        success(res) {
                            if (res.confirm) {
                                uni.navigateTo({
                                    url: `./guide?fromType=loginIndex`
                                })
                            } else if (res.cancel) {
                                // 用户点击取消
                            }
                        }
                    });
                    return false
                } if(name==='医保电子凭证'){
                    wx.navigateToMiniProgram({
                        appId: 'wx308bd2aeb83d3345',
                        path: 'pages/jump/main?serviceId=1000836&path=https%3A%2F%2Fmp.weixin.qq.com%2Finsurance%2Fcard%2Fcreditjump%3Fcityid%3D441300%26from%3D6wUjC78c875vfNHGa7zbgw.%253D%23wechat_redirect',
                        envVersion: 'release',
                        success(res) {
                            console.log(res,'打开成功');
                            // 打开成功
                        }
                    })
                }else {
                    uni.setStorageSync('whichIndex',this.whichIndex)
                    switch (name) {
                        case '我的消息':
                            return uni.navigateTo({
                                url: '/pagesA/myNews/index'
                            })
						case '我的问卷':
                            return uni.navigateTo({
                                url: '/pagesA/questionnaire/index'
                            })
                        case '健康卡':
                            return uni.navigateTo({
                                url: `/pagesA/healthyCard/index`
                            })
                        case '设置':
                            return uni.navigateTo({
                                url: '/pagesA/setting/index'
                            })
                        case '咨询订单':
                            return uni.navigateTo({
                                url: '/pagesA/myOrder/index'
                            })
                        case '挂号订单':
                            return uni.navigateTo({
                                url: '/pagesA/registerOrder/index'
                            })
                        case '缴费订单':
                            return uni.navigateTo({
                                url: '/pagesA/payOrder/index'
                            })
                        case '复诊订单':
                            return uni.navigateTo({
                                url: '/pagesA/consultationOrder/index'
                            })
                        case '处方订单':
                            return uni.navigateTo({
                                url: '/pagesA/prescriptionOrder/index'
                            })
                        case '添加健康卡':
                            uni.navigateTo({
                                url: '/pagesA/healthyCard/addCard'
                            })
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personal-box {
        height: 134px;
        background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
    }

    .personal-flex-box {
        display: flex;
        align-items: center;
        padding: 16px 12px;
        box-sizing: border-box;

        img {
            height: 60px;
            width: 60px;
            border-radius: 50%;
            margin-right: 16px;
            background-color: #fff;
        }

        .personal-login-status {
            color: #fff;
        }
    }

    .swiper-box {
        position: relative;
        height: 95px;
    }

    .swiper-no-box {
        position: absolute;
        top: -26px;
        width: 100%;
        height: 135px;
    }

    .swiper-no-status {
        margin-left: 11px;
        margin-right: 11px;
        height: 135px;
        padding: 15px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.15);
        border-radius: 8px;
        text-align: center;

        img {
            margin-top: 10px;
            height: 34px;
            width: 34px;
        }
    }

    .uni-add-img {
        margin-top: 10px;
        height: 34px;
        width: 34px;
    }

    .swiper {
        position: absolute;
        top: -26px;
        width: 100%;
        height: 140px;
    }

    .swiper-item {
        /*margin-left: 11px;*/
        margin-right: 22upx;
        padding: 30upx;
        box-sizing: border-box;
        height: 260upx;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 4upx 12upx 0upx rgba(59, 124, 244, 0.15);
        border-radius: 16upx;
    }

    .swiper-item-person {
        display: flex;
        justify-content: space-between;

        .uni-imggroup-box {
            position: relative;
            height: 120upx;
            width: 120upx;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            img {
                position: relative;
                z-index: 1;
                height: 68upx;
                width: 68upx;
            }

            .uni-imggroup-back {
                position: absolute;
                right: -30upx;
                top: -30upx;
                width: 220upx;
                height: 234upx;
            }

        }
    }

    .uni-options-box {
        padding: 0upx 26upx;
        font-size: 24upx;
        color: #333333;
    }

    .uni-options-flex {
        display: flex;
        flex-wrap: wrap;
        color: #333333;
        font-size: 24upx;

        .uni-options-item {
            width: 25%;
            text-align: center;
            margin: 20upx 0upx;

            img {
                height: 56upx;
                width: 56upx;
                margin-bottom: 10upx;
            }
        }
    }
</style>

