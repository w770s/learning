<template>
    <view>
        <u-bar :nav="setNav" :goHomePage="true" />
        <view class="uni-content">
            <view v-if="medicalList.length==0" style="text-align: center;">
                <img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/report.png" />
                <view class='uni-default-tip'>
                    <text>绑定健康卡查看核酸检测报告哦～</text>
                </view>
                <view style="display: flex;justify-content: center;" @tap="addCard"><button class='uni-add-card'>添加健康卡</button></view>
            </view>
            <view v-if="medicalList.length>0">
                <view class='uni-user-box' @tap="reportDetail(item)" v-for="(item,index) in medicalList" :key="index">
                    <view style="display: flex;align-items: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        <view class='uni-user-name'>{{item.patientName}}</view>
                        <view class='uni-user-mes'>
                            <view class="uni-item-packageName">{{ item.inspectionName }}</view>
                            <view style="color:#3E3E3E;">时间: {{item.inspectionDate }}</view>
                        </view>
                    </view>
<!--                    <view class='uni-user-img'>-->
<!--                        <img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/formore.png" />-->
<!--                    </view>-->
                </view>
            </view>
        </view>
        <u-loading text="加载中.." mask="true" click="true" ref="loading" />
    </view>
</template>

<script>
    import {reportModel} from '@/models/testReport.js'
    const report = new reportModel()
    let app = getApp()
    export default {
        data() {
            return {
                userId: uni.getStorageSync('userInfo').userId,
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '核酸检测报告'
                },
                medicalList: [],
                loading: false
            }
        },
        onLoad(){
            if(this.userId){
                this.$refs.loading.open();
                this.apiNucleicList(this.userId)
            }
            // else if(!this.userId){
            //     wx.showModal({
            //         title: '请先登录哦~',
            //         showCancel: false,
            //         success(res) {
            //             if (res.confirm) {
            //                 uni.navigateTo({
            //                     url: `/pages/login/guide?fromType=${'nucleinIndex'}`
            //                 })
            //             }
            //         }
            //     })
            // }
        },
        methods: {
            apiNucleicList(userId) {
                this.$refs.loading.open();
                report.nucleicList({userId}).then(res => {
                    this.$refs.loading.close();
                    this.medicalList = res.data
                }).catch((err) => {
                    this.$refs.loading.close();
                    console.log(err);
                })
            },
            addCard(){
                uni.navigateTo({
                    url: '/pagesA/healthyCard/addCard'
                })
            },
            reportDetail(item){
                uni.navigateTo({
                    url: `./testDetail?item=${JSON.stringify(item)}`
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uni-content {
        padding: 30rpx 24rpx;
        .uni-default-tip {
            text-align: center;
            font-size: 40rpx;
            color:#333333;
        }
        .uni-default-img {
            text-align: center;
            height: 360rpx;
            width: 360rpx;
            margin-top:160rpx;
            margin-bottom:40rpx;
        }
        .uni-add-card{
            width:360rpx;
            height:70rpx;
            margin-top:30rpx;
            padding: 0rpx 50rpx;
            box-sizing: border-box;
            border-radius:16rpx;
            font-size:32rpx;
            color:#fff;
            text-align: center;
            line-height:70rpx;
            background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
        }
    }
    .uni-user-name{
        color: #fff;
        font-size: 40rpx;
        border-radius: 16rpx;
        display: inline-block;
        margin-right:20rpx;
        width: 184rpx;
        height:160rpx;
        line-height: 160rpx;
        text-align: center;
        padding: 0 20rpx;
        box-sizing: content-box;
        overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-break: break-word;
        background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
    }
    .uni-user-mes{
        width: 100%;
        height: 160rpx;
        font-size:24rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        .uni-color-normal{
            color:#333333;
        }
        .uni-color-error{
            color:#FF745F;
        }
    }
    .uni-item-packageName{
        padding: 40rpx 0 12rpx 0;
        font-size:36rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .uni-user-img {
        height: 100%;
        width: 84rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            height: 40rpx;
            width: 40rpx;
        }
    }
    .uni-user-box {
        position: relative;
        font-size: 24rpx;
        color: gray;
        margin-bottom: 40rpx;
        display: flex;
        justify-content: space-between;
        align-items:center;
        border-radius: 16rpx;
        height:172rpx;
        background-color: #fff;
        color:#333333;
    }
</style>
