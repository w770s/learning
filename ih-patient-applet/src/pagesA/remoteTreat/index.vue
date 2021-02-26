<template>
    <view>
        <u-bar :nav="setNav" :goHomePage="true" />
        <img class="uni-bg-img" src="http://file.aihuihc.com/patient/patientImages/images/remoteSection.png" />
        <view style="padding: 0px 12px 12px 12px;">
            <view class="uni-hospital-box">
                <text style="font-weight: bold;">中国人民解放军总医院（301医院）</text>创建于1953年，是集医疗、保健、教学、科研于一体的大型现代化综合性医院，直属于中国人民解放军联勤保障部队。
                <view v-if="showReview">
                 医院是中央重要保健基地，承担军委、总部等多个体系单位、官兵的医疗保健和各军区、军兵种转诊、后送的疑难病诊治任务。医院同时又是解放军医学院，以研究生教育为主，是全军唯一一所医院办学单位。
                </view>
                <view class='uni-default-changeIcon' @tap="forMoreDetail">
                    <text>{{showReview?'收起医院详情':'查看医院详情'}}</text>
                    <img v-if="showReview" src="http://file.aihuihc.com/patient/patientImages/images/consulting/packup.png" />
                    <img v-if="!showReview" src="http://file.aihuihc.com/patient/patientImages/images/consulting/unfold.png" />
                </view>
            </view>
            <view style="margin-bottom:50px;">
                <view class="uni-tip-title">301远程会诊预约流程</view>
                <view class="uni-step-box" v-for="(item,index) in stepList" :key="index">
                    <view class="uni-step-number">
                        <view :class="['uni-step-ball',index===0?'uni-line-boxBlue':'uni-line-boxGray']">{{index+1}}</view>
                        <view class="uni-line-box" >
                            <view v-if="index!==stepList.length-1" :class="['uni-step-line',index===0?'uni-step-lineBlue':'uni-step-lineGray']"></view>
                        </view>
                    </view>
                    <view style="margin-left:15px;width: 100%;">
                        <view style="font-size:40rpx;font-weight:bold;">{{item.stepName}}</view>
                        <view style="font-size:30rpx;">{{item.stepTip}}</view>
                    </view>
                </view>
            </view>
            <view class="display: flex;justify-content: center;">
                <button class="uni-bottom-button" @tap="reservedNow">立即预约</button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                showReview: false,
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '远程会诊'
                },
                stepList:[{
                    stepName: '第一步',
                    stepTip: '线上预约远程会诊的科室'
                },{
                    stepName: '第二步',
                    stepTip: '按照预约时间到达医院就诊，并提交院方需要的材料'
                },{
                    stepName: '第三步',
                    stepTip: '支付会诊费用，院方安排预约301专家'
                },{
                    stepName: '第四步',
                    stepTip: '等待会诊结果'
                }]
            };
        },
        onShow(){
            this.userId = uni.getStorageSync('userInfo').userId
        },
        methods: {
            forMoreDetail(){
                this.showReview = ! this.showReview
            },
            reservedNow(){
                uni.navigateTo({
                    url: `./sectionDetail`,
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    .uni-bg-img{
        width:100%;
        height:220rpx;
    }

    .uni-hospital-box{
        position: relative;
        top: -40rpx;
        width: 100%;
        box-sizing: border-box;
        padding: 30rpx 30rpx 20rpx 30rpx;
        background:rgba(255,255,255,1);
        box-shadow:0px 4rpx 12rpx 0px rgba(59,124,244,0.15);
        border-radius:10rpx;
        font-size: 30rpx;
    }

    .uni-default-changeIcon {
        text-align: center;
        color: #B2B2B2;
        font-size: 26rpx;
        margin-top: 10rpx;

        img {
            width: 36rpx;
            height: 20rpx;
            margin-left: 20rpx;
        }
    }

    .uni-tip-title{
        margin-bottom:40rpx;
        font-weight:bold;
        font-size: 40rpx;
    }

    .uni-step-box{
        display: flex;
        .uni-step-number{
            width:80rpx;
            display: flex;
            flex-wrap: wrap;
            .uni-step-ball{
                width:80rpx;
                height:80rpx;
                text-align: center;
                line-height: 80rpx;
                color: #fff;
                border-radius: 40rpx;
            }
            .uni-line-box{
                display:flex;
                justify-content:center;
                width:80rpx;
            }
            .uni-line-boxBlue{
                background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
            }
            .uni-line-boxGray{
                background:rgba(229,229,229,1);
            }
            .uni-step-line{
                height: 80rpx;
                width: 2rpx;
            }
            .uni-step-lineBlue{
                background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
            }
            .uni-step-lineGray{
                background:rgba(229,229,229,1);
            }

        }
    }

    .uni-bottom-button{
        max-width:640px;
        height:94rpx;
        font-size:36rpx;
        line-height: 94rpx;
        color: #fff;
        background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
        border-radius:10rpx;
    }
</style>
