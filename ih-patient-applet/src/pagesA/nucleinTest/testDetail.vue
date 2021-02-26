<template>
    <view>
        <u-bar :nav="setNav" />
        <view class="uni-top-back"></view>
        <view class="uni-user-box-top">
            <view class="uni-block-top" style="color:#B2B2B2;">
                <view class='uni-user-name'>{{testDetail.patientName}}</view>
                <view class="uni-block-right">
                    <view><text>性别：</text>{{testDetail.gender==0?'男':testDetail.gender==1?'女':'---'}}</view>
                    <view><text>检验时间：</text>{{testDetail.testReportRepData[0].examDate}}</view>
                    <view><text>身份证号：</text>{{testDetail.cardId?testDetail.cardId:'---'}}</view>
                    <view><text>执行科室：</text>{{testDetail.departName?testDetail.departName:'---'}}</view>
                </view>
            </view>
            <view class="uni-block-bottom">
                <view class="uni-middle-right">
                    <view>
                        <text>检测结果</text>
                    </view>
                    <view class="uni-img-box">
                        <view style="margin: 0 auto;">
                            <img v-if="testDetail.testReportRepData[0].exceptionResult==0" style="width: 416rpx;height: 416rpx;" src="../../static/hidden.png" />
                            <img v-if="testDetail.testReportRepData[0].exceptionResult==1" style="width: 416rpx;height: 416rpx;" src="../../static/positive.png" />
                            <view class="uni-testTime"><text>报告日期：</text>{{testDetail.inspectionDate?testDetail.inspectionDate:'---'}}</view>
                        </view>
                    </view>
                    <view class="uni-textBox"><view class="uni-title">声明：</view><view class="uni-text">1、本检测结果可能受到采样时间，采样部位及方法学局限性等因素影响，结果需要结合临床进行分析。<br>
                        2、此报告仅对本次送检标本负责。</view></view>
                </view>
            </view>
        </view>
        <u-loading text="加载中.." mask="true" click="true" ref="loading" />
    </view>
</template>

<script>
    import {
        dateToString
    } from "../../util/util";
    import {reportModel} from '@/models/testReport.js'
    const report = new reportModel()
    export default {
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '核酸检测报告'
                },
                userInfo: {},
                testDetail: {}
            }
        },
        onLoad(options) {
            this.$refs.loading.open();
            this.userInfo = JSON.parse(options.item)
        },
        onShow(){
            const data = {
                hospitalId: this.userInfo.hospitalId,
                id: this.userInfo.inspectionId,
                userId: uni.getStorageSync('userInfo').userId
            }
            this.detailsList(data)
        },
        methods: {
            detailsList(data){
                report.nucleicDetail(data).then(res=>{
                    this.$refs.loading.close();
                    this.testDetail = res.data
                }).catch(err=>{
                    this.$refs.loading.close();
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uni-user-box-top {
        padding: 24rpx;
    }
    .uni-top-back {
        height: 60rpx;
        background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
    }
    .uni-block-top {
        position: relative;
        top: -60rpx;
        width: 100%;
        height: 240rpx;
        padding: 20rpx;
        border-radius: 16rpx;
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .uni-user-name{
            color: #fff;
            font-size: 40rpx;
            border-radius: 16rpx;
            display: inline-block;
            width: 160rpx;
            height:160rpx;
            line-height: 160rpx;
            text-align: center;
            box-sizing: content-box;
            overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-break: break-word;
            background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
        }
        .uni-block-right{
            flex: 1;
            padding-bottom: 14rpx;
            font-size: 30rpx;
            view{
                margin-top: 14rpx;
                color: #333333;
                text{
                    display: inline-block;
                    width: 155rpx;
                    padding-left: 20rpx;
                    color: #B2B2B2;
                }
            }
        }
    }
    .uni-block-bottom{
        position: relative;
        top: -30rpx;
        padding: 30rpx 30rpx 50rpx;
        border-radius: 16rpx;
        background-color: #fff;
        box-sizing: border-box;
    }
    .uni-middle-right{
        .uni-textBox{
            display: flex;
            padding-top: 16rpx;
            .uni-title{
                width: 120rpx;
                color: #989898;
            }
            .uni-text{
                flex: 1;
                color: #989898;
            }
        }
        .uni-img-box{
            display:baitable-cell;
            text-align: center;
            vertical-align: middle;
        }
        .uni-testTime{
            font-size: 38rpx;
            color: #4386F5;
            padding: 30rpx 0 120rpx 0;
            text{
                color: #4386F5 !important;
            }
        }
        view{
            color: #333333;
            img{
                width: 416rpx;
                height: 416rpx;
            }
            text{
                display: inline-block;
                width: 200rpx;
                color: #333333;
            }
        }
    }
</style>
