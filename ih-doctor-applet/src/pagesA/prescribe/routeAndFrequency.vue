<template>
    <view class="uni-content">
        <u-topSearchBar @inputData="inputData" :nav="setNav" :route="'/pagesA/prescribe/index'" :type="type" />
        <view class="uni-form-title-box"></view>
        <view class="status-itemBox">
            <view v-if="list.length===0" class='no-recent'>
                <img src="http://file.aihuihc.com/ih-doctor-applet/image/home/forthVersion/unfind.png" class='no-recent-image' />
                <text class='no-recent-text' v-if="setNav.navTitle!=='开西药'">未找到此{{setNav.navTitle}}</text>
                <text class='no-recent-text' v-if="setNav.navTitle==='开西药'">未找到此西药</text>
            </view>
            <view style="height: 100%;position: relative;">
                <view v-if="setNav.navTitle!=='检查信息'&&setNav.navTitle!=='检验信息'&&setNav.navTitle!=='检查部位'&&setNav.navTitle!=='采集方法'&&setNav.navTitle!=='检验标本'" v-for="(item,index) in list" @click="whichChoose(item)" :key='index' class="uni-status-item">
                    <view>{{item.name}}</view>
                    <view v-if="!item.shortCode" style="color:#ACACAC;min-width: 100rpx;text-align: right;">{{item.id}}</view>
                    <view v-if="item.shortCode" style="color:#ACACAC;min-width: 100rpx;text-align: right;">{{item.shortCode}}</view>
                </view>
                <view v-if="setNav.navTitle==='检查信息'||setNav.navTitle==='检验信息'" v-for="(item,index) in list" @click="whichChoose(item)" :key='index' class="uni-status-item">
                    <view>{{item.examineName}}</view>
                    <view style="color:#ACACAC;min-width: 100rpx;text-align: right;">{{item.examineCode}}</view>
                </view>
                <view v-if="setNav.navTitle==='检查部位'" v-for="(item,index) in list" @click="whichChoose(item)" :key='index' class="uni-status-item">
                    <view>{{item.partName}}</view>
                    <view style="color:#ACACAC;min-width: 100rpx;text-align: right;">{{item.partId}}</view>
                </view>
                <view v-if="setNav.navTitle==='采集方法'" v-for="(item,index) in list" @click="whichChoose(item)" :key='index' class="uni-status-item">
                    <view>{{item.methodName}}</view>
                    <view style="color:#ACACAC;min-width: 100rpx;text-align: right;">{{item.methodId}}</view>
                </view>
                <view v-if="setNav.navTitle==='检验标本'" v-for="(item,index) in list" @click="whichChoose(item)" :key='index' class="uni-status-item">
                    <view>{{item.itemName}}</view>
                    <view style="color:#ACACAC;min-width: 100rpx;text-align: right;">{{item.itemId}}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'externalHeight': 60,
                    'navTitle': ''
                },
                inputValue: '',
                list: [],
                type: ''
            };
        },
        onLoad(options) {
            this.type = options.type
            if(this.type){
                this.forMatStatus(this.type)
            }
            console.log(this.setNav);
        },
        methods: {
            forMatStatus(type){
                if(type==='1'){
                    this.setNav.navTitle = '临床诊断'
                }
                if(type==='2'){
                    this.setNav.navTitle = '开西药'
                }
                if(type==='3'){
                    this.setNav.navTitle = '用药频率'
                }
                if(type==='4'){
                    this.setNav.navTitle = '用药途径'
                }
                if(type==='5'){
                    this.setNav.navTitle = '检查信息'
                }
                if(type==='6'){
                    this.setNav.navTitle = '检验信息'
                }
                if(type==='9'){
                    this.setNav.navTitle = '检查部位'
                }
                if(type==='10'){
                    this.setNav.navTitle = '采集方法'
                }
                if(type==='11'){
                    this.setNav.navTitle = '检验标本'
                }
            },
            inputData(data){
                this.list = []
                this.list = data
            },
            whichChoose(item){
                console.log(item, this.type, typeof(this.type));
                if (this.type==='1') {
                    uni.redirectTo({
                        url: '/pagesA/prescribe/index?clinicalData='+JSON.stringify(item)
                    })
                }
                if (this.type==='2') {
                    uni.removeStorageSync('dosageData')
                    uni.redirectTo({
                        url: `/pagesA/prescribe/prescribeDosage?item=${JSON.stringify(item)}`
                    })
                }
                if (this.type==='3') {
                    uni.redirectTo({
                        url: `/pagesA/prescribe/prescribeDosage?medicineFrequency=${item.name}&code=${item.code}&times=${item.frequencyTimes}&interval=${item.frequencyInterval}`
                    })
                }
                if (this.type==='4') {
                    uni.redirectTo({
                        url: `/pagesA/prescribe/prescribeDosage?medicineWay=${item.name}&detailUsageId=${item.hisId}`
                    })
                }
                if (this.type==='5'||this.type==='6'||this.type==='7'||this.type==='8'||this.type==='9'||this.type==='10'||this.type==='11') {
                    if(this.type==='5'||this.type==='6'){
                        uni.redirectTo({
                            url: `/pagesA/prescribe/prescribeCheck?item=${JSON.stringify(item)}&clear=true`
                        })
                    }
                    else{
                        uni.redirectTo({
                            url: `/pagesA/prescribe/prescribeCheck?item=${JSON.stringify(item)}`
                        })
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    .uni-form-title-box {
        background-color: #F6F6F6;
        height: 10rpx;
    }

    .uni-status-item{
        padding: 30rpx 20rpx;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E5E5E5;
    }

    .status-itemBox {
        box-sizing: border-box;
        padding: 0rpx 24rpx;
        width: 750rpx;
    }

    .uni-input {
        position: relative;
        width: 750rpx;
        height: 80rpx;
        padding: 20rpx 0;
        font-size: 30rpx;
        line-height: 40rpx;
        color: #7f8389;
        box-sizing: border-box;
        text-align: center;
        border-bottom: solid 1rpx #eeeeee;

        .icon-left {
            margin-right: 20rpx;
        }

        .icon-right {
            margin-left: 20rpx;
        }

        .uni-date {
            position: absolute;
            left: 30rpx;
        }
    }

    .border-nomessage {
        font-size: 24rpx;
        background-color: #fff;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }


    .no-recent {
        width: 100%;
        display: flex;
        font-size: 40rpx;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: -20rpx;
        .no-recent-image {
            text-align: center;
            height: 105px;
            width: 140px;
            margin:85px 30px 30px 30px;
        }
        .no-recent-text {
            width: 100%;
            color: #999999;
            text-align: center;
        }
    }

</style>
