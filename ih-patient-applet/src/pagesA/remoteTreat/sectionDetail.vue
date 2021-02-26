<template>
    <view>
        <u-bar :nav="setNav" />
        <view class="uni-flex-box">
            <button @tap="goForDetail(item)" class="uni-ill-box" v-for="(item,index) in IllList" :key="index">
                {{item.name}}
            </button>
        </view>
    </view>
</template>

<script>
    import {
        consultingModel
    } from '@/models/consulting.js'
    const consulting = new consultingModel()
    export default {
        data(){
            return{
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '远程会诊'
                },
                IllList:[]
            }
        },
        mounted() {
            this.apiListRemoteDepart()
        },
        methods: {
            apiListRemoteDepart() {
                consulting.listRemoteDepart().then(res => {
                    this.IllList = res.data
                }).catch((err) => {
                    console.log(err);
                })
            },
            goForDetail(item){
                uni.setStorageSync('isRemoteClinic',true)
                uni.navigateTo({
                    url:`/pagesA/consulting/doctorDetail?departId=${item.outpatientDepartId}&hisDepartId=${item.hisDepartId}`
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .uni-flex-box{
        padding: 40rpx 0rpx 40rpx 24rpx;
        display:flex;
        flex-wrap: wrap;
    }

    .uni-ill-box{
        width:220rpx;
        height:92rpx;
        line-height:92rpx;
        font-size:30rpx;
        color: #fff;
        margin: 0rpx 22rpx 40rpx 0rpx;
        background:rgba(40,132,255,1);
        border-radius:10rpx;
    }

</style>
