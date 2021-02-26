<template>
    <view>
        <u-bar :nav="setNav" />
        <view class="u-skeleton">
            <view class="tui-banner-box">
                <swiper
                    :autoplay="true"
                    :interval="5000"
                    :duration="140"
                    class="tui-banner-swiper u-skeleton-rect"
                    :circular="true"
                    @change="change"
                >
                    <swiper-item v-for="(item, index) in banner" :key="index">
                        <img
                            :src="item.url"
                            @tap="advertiseDetail(item)"
                            class="tui-slide-image u-skeleton-fillet"
                        />
                    </swiper-item>
                </swiper>
            </view>
            <view class="uni-home-box">
                <view class="uni-topTwo-relativeBox uni-topBox" v-if="menuBarList.oneMenuBar.length>0">
                    <view class="uni-topTwo-choose u-skeleton-fillet">
                        <view v-for="(item,index) in menuBarList.oneMenuBar" :key="index" @tap="selectOptions(item.name,item)" class="uni-topTwo-item">
                            <view>
                                <img class="uni-topTwo-itemImg u-skeleton-fillet" :src="item.imageUrl">
                            </view>
                            <view class="u-skeleton-fillet"><text>{{item.name}}</text></view>
                        </view>
                    </view>
                </view>
				<view class="uni-middleFive-choose">
				    <view class="uni-topTwo-relativeBox">
                        <view v-for="(item,index) in menuBarList.twoMenuBar" :key="index" @tap="selectOptions(item.name,item)" class="uni-topFive-item">
                            <view><img class="uni-topFive-itemImg u-skeleton-fillet" :src="item.imageUrl"></view>
                            <view class="u-skeleton-fillet"><text>{{item.name}}</text></view>
                        </view>
                    </view>
				</view>
                <view class="uni-choose-box">
                    <img v-if="loading" class="uni-middle-banner u-skeleton-fillet" src="">
                    <img v-if="middleBanner.length===1&&!loading" class="uni-middle-banner u-skeleton-fillet" @tap="advertiseDetail(middleBanner[0])" :src="middleBanner[0].url">
                    <view class="tui-banner-box" v-if="middleBanner.length>1">
                        <swiper
                                :autoplay="true"
                                :interval="5000"
                                :duration="87"
                                class="tui-middlebanner-swiper u-skeleton-rect"
                                :circular="true"
                                @change="change"
                        >
                            <swiper-item v-for="(item, index) in middleBanner" :key="index">
                                <img
                                    :src="item.url"
                                    @tap="advertiseDetail(item)"
                                    class="tui-middleSlide-image u-skeleton-fillet"
                                />
                            </swiper-item>
                        </swiper>
                    </view>
                </view>
                <view>
                    <view class="uni-video-topName">
                        <view class="u-skeleton-fillet"><text style="color: #333333">健康宣教</text></view>
                        <view class="u-skeleton-fillet" @tap="forMoreDatail" v-if="videoFour.length>8">
                            <text class="uni-doctor-line-more">更多</text>
                            <img src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png"></img>
                        </view>
                    </view>
                    <view class="uni-video-list">
                        <view class="uni-video-item" v-if="index<8" v-for="(item,index) in videoFour" :key="index">
                            <img @tap="videoClick(item)" class="u-skeleton-img" :src="item.imageUrl" />
                            <img @tap="videoClick(item)" class="u-skeleton-icon" src="../../static/play.png" />
                            <view class="uni-video-topic u-skeleton-fillet">{{item.titleName}}</view>
                        </view>
                    </view>
                </view>
                <view class="" style="text-align: center;font-size: 30rpx;color: #989898;">V4.3</view>
            </view>
        </view>
        <u-skeleton bg-color="rgb(250, 250, 250)" :loading="loading" :animation="animation" ></u-skeleton>
    </view>
</template>

<script>
    import {
        loginModel
    } from '@/models/login.js'
    import {homeSkeleton} from '@/util/version1.js';
    const login = new loginModel()
    let app = getApp()
    import {
        healthyCardModel
    } from '@/models/healthyCard.js'
    import {createIMClient} from "../../util/util";
    const healthyCard = new healthyCardModel()
    const { TextMessage,Event } = require('../../libs/leancloud-realtime.js');
    export default {
        name: "home",
        data(){
            return{
                loading: true,
                animation: true,
                userId: '',
                current: 0,
                whichIndex: 0,
                isFullScree:false,
                setNav: {
                    'navTitle': '安徽医科大学附属海螺医院'
                },
                banner:[],
                middleBanner:[],
                cacheBanner: [],
                cacheMiddleBanner: [],
                personData: [],
                videoFour: homeSkeleton.videoFour,
                menuBarList:{
                    oneMenuBar:homeSkeleton.oneMenuBar,
                    twoMenuBar:homeSkeleton.twoMenuBar
                }
            }
        },
        onLoad(){
            setTimeout(()=>{
                this.loading = false
            },1500)
        },
        onShow(){
            this.userId = uni.getStorageSync('userInfo').userId
            this.userImg = uni.getStorageSync('userInfo').logo
            this.apiListMenuBar()
            this.apiListAdvert()
            this.apiListHealthPropaganda()
            if(this.userId){
                this.apiListHealthCard(this.userId)
            }
        },
        methods: {
            change(e) {
                this.current = e.detail.current;
            },
            initIM(){
                if(this.personData.length>0){
                    this.whichIndex = 0
                    let scanIndex = uni.getStorageSync('whichIndex')
                    if(!scanIndex){
                        uni.setStorageSync('whichIndex',this.whichIndex)
                    }
                    if(scanIndex){this.whichIndex = scanIndex;}
                    createIMClient(this.personData[this.whichIndex].accId)
                }
            },
            apiListHealthCard(userId) {
                healthyCard.listHealthCard({userId}).then(res => {
                    this.personData = res.data.healthCardList
                    this.initIM()
                }).catch((err) => {
                    console.log(err);
                })
            },
            advertiseDetail(item){
                console.log(item);
                if(item.pagePath){
                    return uni.navigateTo({
                        url: `${item.pagePath}`
                    })
                }
            },
            apiListMenuBar() {
                login.listMenuBar().then(res => {
                    this.menuBarList.oneMenuBar = res.data.oneMenuBar
                    this.menuBarList.twoMenuBar = res.data.twoMenuBar
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiListAdvert() {
                login.listAdvert().then(res => {
                    this.cacheBanner = []
                    this.cacheMiddleBanner = []
                    let cacheData = uni.getStorageSync('homePageListAdvert')
                    if(cacheData){
                        this.banner = cacheData.banner
                        this.middleBanner = cacheData.middleBanner
                    }
                    res.data.forEach((item,index)=>{
                        if(item.type===1){
                            this.cacheBanner.push(item)
                        }
                        if(item.type===2){
                            this.cacheMiddleBanner.push(item)
                        }
                    })
                    console.log(this.cacheBanner, this.banner);
                    if(cacheData.banner!=this.cacheBanner){
                        this.banner = this.cacheBanner
                    }
                    if(cacheData.middleBanner!=this.cacheMiddleBanner){
                        this.middleBanner = this.cacheMiddleBanner
                    }
                    uni.setStorageSync('homePageListAdvert',{banner:this.cacheBanner,middleBanner:this.cacheMiddleBanner})
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiListHealthPropaganda() {
                login.listHealthPropaganda().then(res => {
                    this.videoFour = res.data
                }).catch((err) => {
                    console.log(err);
                })
            },
            videoClick(item){
                console.log(item);
                uni.navigateTo({
                    url: `/pagesA/videoList/videoDetail?item=${JSON.stringify(item)}`
                })
            },
            forMoreDatail(){
                uni.navigateTo({
                    url: '/pagesA/videoList/index'
                })
            },
            selectOptions(name,item) {
                if (!this.userId) {
                    wx.showModal({
                        title: '请先登录哦~',
                        success(res) {
                            if (res.confirm) {
                                uni.navigateTo({
                                    url: `./guide?fromType=loginHome`
                                })
                            }
                        }
                    });
                    return false
                } else {
                    uni.navigateTo({
                        url: `${item.pagePath}`
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
	.tui-banner-box {
		width: 100%;
		background: #fff;
        position: relative;
	}

	.tui-banner-swiper {
		width: 100%;
		height: 280rpx;
	}

    .tui-middlebanner-swiper{
        width: 100%;
        height: 240rpx;
    }

    .tui-middleSlide-image{
        height: 240rpx;
        width: 720rpx;
        display: block;
        border-radius: 10rpx;
        transition: all 0.1s linear;
    }

	.tui-slide-image {
		width: 100%;
		height: 300rpx;
		display: block;
		transition: all 0.1s linear;
	}

    .uni-choose-box{
        margin: 30rpx 16rpx;
    }
    .uni-home-box{
        width: 100%;
        background-color: #fff;
        font-size: 24rpx;
        position: absolute;
        top: 380rpx;
        border-radius: 20rpx 20rpx 0 0;
    }
    .uni-topBox{
        padding: 0 15px;
    }
    .uni-topTwo-relativeBox{
        margin-bottom: 40rpx;
    }
    .uni-topTwo-choose{
        padding: 28rpx 32rpx;
        display: flex;
        justify-content: space-between;
        border-bottom: 4rpx solid #F0F0F0;
        .uni-topTwo-item{
            text-align: center;
            .uni-topTwo-itemImg{
                width: 100rpx;
                height: 100rpx;
                margin-bottom: 6rpx;
            }
        }
    }
    .uni-middleFive-choose{
        padding: 0 32rpx;
        .uni-topTwo-relativeBox{
            display: flex;
            flex-wrap: wrap;
            border-bottom: 4rpx solid #F0F0F0;
            .uni-topFive-item{
                width: 25%;
                text-align: center;
                margin-bottom: 30rpx;
                .uni-topFive-itemImg{
                    width: 78rpx;
                    height: 78rpx;
                    margin-bottom: 6rpx;
                }
            }
        }
    }
    .uni-middle-banner{
        width: 100%;
        height: 168rpx;
    }
    .uni-video-topName{
        padding: 0 26rpx;
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .uni-doctor-line-more{
            font-size:30rpx;
            margin-right:12rpx;
            font-weight: normal;
        }
        img {
            height: 30rpx;
            width: 20rpx;
            vertical-align: middle;
        }
    }
    .uni-video-list{
        padding: 0 26rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .uni-video-item{
            width: 340rpx;
            line-height: 40rpx;
            margin-bottom: 20rpx;
            box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.15);
            border-radius: 10rpx;
            position: relative;
            .u-skeleton-img{
                width: 340rpx;
                height:188rpx;
                background:rgba(0,0,0,0.2);
                border-radius: 10rpx 10rpx 0 0;
            }
            .u-skeleton-icon{
                width: 60rpx;
                height: 60rpx;
                border-radius: 50%;
                position: absolute;
                left: 140rpx;
                top: 64rpx;
            }
            .uni-video-topic{
                width: 300rpx;
                padding: 0 20rpx;
                font-size: 28rpx;
                text-align: left;
                display: inline-block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow:ellipsis;
            }
        }
    }
</style>

