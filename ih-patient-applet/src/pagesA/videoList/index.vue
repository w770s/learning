<template>
    <view>
        <u-bar :nav="setNav" />
        <view class="uni-video-listBox">
            <view class="uni-video-list">
                <view class="uni-video-item" v-for="(item,index) in videoFour" :key="index">
                    <img @tap="videoClick(item)" :src="item.imageUrl" style="width: 340rpx;height:188rpx;border-radius: 10rpx;background:rgba(0,0,0,0.2);" />
                    <view class="uni-video-topic">{{item.titleName}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        loginModel
    } from '@/models/login.js'
    const login = new loginModel()
    export default {
        name: "index",
        data(){
            return{
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '健康宣教'
                },
                videoFour:[],
            }
        },
        onShow() {
            this.apiListHealthPropaganda()
        },
        methods: {
            videoClick(item){
                uni.navigateTo({
                    url: `/pagesA/videoList/videoDetail?item=${JSON.stringify(item)}`
                })
            },
            apiListHealthPropaganda() {
                login.listHealthPropaganda().then(res => {
                    this.videoFour = []
                    let cacheData = uni.getStorageSync('homePageListPropaganda')
                    if(cacheData){
                        this.videoFour = cacheData
                    }
                    if(cacheData!=res.data){
                        this.videoFour = res.data
                    }
                    uni.setStorageSync('homePageListPropaganda',this.videoFour)
                }).catch((err) => {
                    console.log(err);
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .uni-video-listBox{
        padding: 40rpx 24rpx;
    }
    .uni-video-list{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .uni-video-item{
            width: 340rpx;
            margin-bottom: 20rpx;
            .uni-video-topic{
                font-size: 30rpx;
                text-align: left;
                width: 340rpx;
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow:ellipsis;
            }
        }

    }
</style>
