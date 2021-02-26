<template>
    <view class="content">
            <u-topBar :nav="setNav" :route="'/pagesA/prescribe/routeAndFrequency'" :type="'2'" />
        <form>
            <view class="uni-form-item uni-column">
                <view class="uni-list-box">
                    <view class="uni-form-title-box"></view>
                    <view class="uni-form-itemBox">
                        <view class="list-item list-item-border">
                            <view>基本信息：</view>
                            <view class="uni-input">
                                {{dosageData.name?dosageData.name:'暂无'}}
                            </view>
                        </view>
                        <view class="list-item" style="padding-top: 25rpx;">
                            <view>药品规格：</view>
                            <view class="uni-input">
                                {{dosageData.spec?dosageData.spec:'暂无'}}
                            </view>
                        </view>
                        <view class="list-item">
                            <view>药量单位：</view>
                            <view class="uni-input">
                                {{dosageData.doseUnit?dosageData.doseUnit:'暂无'}}
                            </view>
                        </view>
                        <view class="list-item">
                            <view>药品厂商：</view>
                            <view class="uni-input">
                                {{dosageData.company?dosageData.company:'暂无'}}
                            </view>
                        </view>
                        <view class="list-item">
                            <view>药品单价：</view>
                            <view class="uni-input">
                                {{dosageData.retailPrice?dosageData.retailPrice+'元':'暂无'}}
                            </view>
                        </view>
                    </view>
                </view>
                <view class="uni-list-box">
                    <view class="uni-form-title-box"></view>
                    <view class="uni-form-itemBox">
                        <view class="list-item-special">
                            <text>开药信息</text>
                        </view>
                        <view class="list-item list-item-border">
                            <view><text class="uni-special-mustWrite" style="">*</text>单次药量：</view>
                            <input v-show="!showDosageOneView" confirm-type="done" type="digit" :focus="!showDosageOneView" @blur="dosageOneChange" class="uni-input uni-input-width"  @input="hasInputRequired('单次药量')" v-model="dosageData.dosageOne" placeholder-style="color:#ACACAC;" :placeholder="`请输入单次药量 ${dosageData.doseUnit}`" />
                            <view v-show="showDosageOneView" @click="showDosageOneView=false" :class="['uni-input uni-input-width',dosageData.dosageOne?'':'uni-input-default']">{{dosageData.dosageOne?dosageData.dosageOne+dosageData.doseUnit:'请输入单次药量 '+dosageData.doseUnit}}</view>
                        </view>
                        <view class="list-item list-item-border" @click="goForDetail('3')">
                            <view><text class="uni-special-mustWrite" style="">*</text>用药频率：</view>
                            <view class="uni-input uni-input-imgDeal">
                                <text v-if="dosageData.medicineFrequency">{{dosageData.medicineFrequency}}</text>
                                <text v-if="!dosageData.medicineFrequency" style="color:#ACACAC;">请选择</text>
                                <img v-if="!dosageData.medicineFrequency" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                            </view>
                        </view>
                        <view class="list-item list-item-border" @click="goForDetail('4')">
                            <view><text class="uni-special-mustWrite" style="">*</text>用药途径：</view>
                            <view class="uni-input uni-input-imgDeal">
                                <text v-if="dosageData.medicineWay">{{dosageData.medicineWay}}</text>
                                <text v-if="!dosageData.medicineWay" style="color:#ACACAC;">请选择</text>
                                <img v-if="!dosageData.medicineWay" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                            </view>
                        </view>
                        <view class="list-item list-item-border">
                            <view><text class="uni-special-mustWrite" style="">*</text>用药天数：</view>
                            <input v-show="!showDayView" type="number" confirm-type="done" :focus="!showDayView" @blur="daysChange" class="uni-input uni-input-width"  @input="hasInputRequired('用药天数')" v-model="dosageData.medicineUsedDays" placeholder-style="color:#ACACAC;" :placeholder="`请输入用药天数`" />
                            <view v-show="showDayView" @click="showDayView=false" :class="['uni-input uni-input-width',dosageData.medicineUsedDays?'':'uni-input-default']">{{dosageData.medicineUsedDays?dosageData.medicineUsedDays+'天':'请输入用药天数'}}</view>
                        </view>
                        <view class="list-item list-item-border">
                            <view><text class="uni-special-mustWrite" style="" type="number">*</text>开药量：</view>
                            <input v-show="!showDosageView" type="number" confirm-type="done" :focus="!showDosageView" @blur="dosageChange" class="uni-input uni-input-width" @input="hasInputRequired('开药量')" v-model="dosageData.count" placeholder-style="color:#ACACAC;" :placeholder="`请输入开药量 ${dosageData.saleUnit}`" />
                            <view v-show="showDosageView" @click="showDosageView=false" :class="['uni-input uni-input-width',dosageData.count?'':'uni-input-default']">{{dosageData.count?dosageData.count+dosageData.saleUnit:'请输入开药量 '+ dosageData.saleUnit}}</view>
                        </view>
                    </view>
                </view>
                <view class="uni-list-box">
                    <view class="uni-form-title-box"></view>
                    <view class="uni-form-itemBox">
                        <view class="list-item-special">
                            <text>医嘱</text>
                        </view>
                        <view class="uni-user-box">
                            <view class="uni-user-mainBox">
                                <textarea v-if="showtextarea" placeholder="请输入您对患者服药的注意事项 (选填) " placeholder-style="font-size:15px;color:#989898;" maxlength="100" class="uni-textarea-area" v-model="dosageData.doctorAdvice"></textarea>
                                <view v-if="!showtextarea" class="uni-textarea-area">{{dosageData.doctorAdvice}}</view>
                                <view class="uni-textarea-word">{{dosageData.doctorAdvice.length +'/'+ 100}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="uni-btn-v">
                <u-button :disabled="!buttonCanClick" :loading="buttonLoading" @click="buttonSureConsult" :throttleTime="1000" :customStyle="buttonStyle" shape="square" size="default">确认</u-button>
            </view>
        </form>
    </view>
</template>

<script>
    import {prescriptions} from '@/models/prescriptions.js'
    const prescript = new prescriptions()
    import store from '@/store/index.js'
    const state = store.state.user
    const app = getApp()
    export default {
        data() {
            return {
                keyboardShow: true,
                showDosageOneView: true,
                showDosageView: true,
                showDayView: true,
                buttonLoading: false,
                buttonCanClick: false,
                showtextarea: true,
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '西药处方剂量'
                },
                buttonStyle:{
                    textAlign: 'center',
                    width: '690rpx',
                    height: '47px',
                    lineHeight: '47px',
                    borderRadius: '8px',
                    color: '#fff',
                    background: 'rgba(40, 132, 255, 0.2)'
                },
                dosageData:{
                    "id": "",
                    "drugId": "",
                    "name": "",
                    "code": "",
                    "doseUnit": "",
                    "doseCount": "",
                    "company": "",
                    "spec": "",
                    "saleUnit": '', // 药房销售单位

                    // TODO other params
                    'dosageOne': '', // 单次药量
                    'medicineFrequency': '', // 用药频率
                    'detailFrequencyCode': '', // 用药频率code
                    'count': '', // '开药量' 单位是销售单位saleUnit
                    'medicineWay': '', // '用药途径'
                    'medicineUsedDays': '', // '用药天数'
                    'doctorAdvice': '', // '医嘱'

                    'dosage': '', // '总量'
                    'unit': '', // 药量单位 = doseCount
                },
                doctorUrl: '',
                top: app.globalData.ImTitleBarHeight,
                prescribeIndex:{},
                dosageDataCount: ''
            }
        },
        onShow(){
            this.hasInputRequired()
        },
        onLoad(options) {
            console.log(options);
            if(uni.getStorageSync('prescribeIndex')){
                this.prescribeIndex = JSON.parse(uni.getStorageSync('prescribeIndex'))
                console.log(this.prescribeIndex);
            }
            if(uni.getStorageSync('dosageData')){
                this.dosageData = JSON.parse(uni.getStorageSync('dosageData'))
            }
            if(options.item){
                let optionsMes = JSON.parse(options.item)
                console.log(optionsMes);
                Object.assign(this.dosageData,JSON.parse(options.item))
                this.dosageData['price'] = optionsMes.retailPrice
                this.dosageData['productAddress'] = optionsMes.company
                this.dosageData['unit'] = optionsMes.doseCount
                this.dosageData['drugId'] = optionsMes.id
                console.log(this.dosageData,123123);
                return
            }
            if(options.medicineWay){
                this.dosageData = JSON.parse(uni.getStorageSync('dosageData'))
                this.dosageData['medicineWay'] = options.medicineWay
                this.dosageData['detailUsageId'] = options.detailUsageId
                this.hasInputRequired()
                return
            }
            if(options.medicineFrequency){
                this.dosageData = JSON.parse(uni.getStorageSync('dosageData'))
                this.dosageData['medicineFrequency'] = options.medicineFrequency
                this.dosageData['detailFrequencyCode'] = options.code
                this.dosageData['frequencyInterval'] = options.interval
                this.dosageData['frequencyTimes'] = options.times
                this.hasInputRequired()
                return
            }
        },
        methods: {
            daysChange(){
                this.showDayView = true
                if(this.dosageData.medicineUsedDays==='0'||this.dosageData.medicineUsedDays.startsWith('0')){
                    wx.showToast({
                        title: '用药天数输入不可为零且为整数哦,将帮你清空了哦~',
                        icon: 'none'
                    })
                    this.dosageData.medicineUsedDays = ''
                }
            },
            dosageChange(){
                this.showDosageView = true
                if(this.dosageData.count==='0'||this.dosageData.count.startsWith('0')){
                    wx.showToast({
                        title: '开药量用药天数输入不可为零且为整数哦,将帮你清空了哦~',
                        icon: 'none'
                    })
                    this.dosageData.count = ''
                    return
                }
                const data = this.dosageData
                if( data.dosageOne &&
                    data.frequencyTimes &&
                    data.frequencyInterval &&
                    data.count &&
                    data.unit &&
                    data.dosage &&
                    data.medicineUsedDays){
                    console.log('changeTie');
                    let unit = parseFloat(data.unit)
                    let count = parseInt(data.count)
                    let dosage = parseInt(data.dosage)
                    let dosageOne = Number(data.dosageOne)
                    let frequencyTimes = parseInt(data.frequencyTimes)
                    let frequencyInterval = parseInt(data.frequencyInterval)
                    if(frequencyTimes!=0&&frequencyInterval!=0){
                        data.dosage = count*unit
                        let sequenceDay = ((frequencyTimes/frequencyInterval)*dosageOne)
                        let resetDays = (data.dosage/sequenceDay) % 1
                        if(resetDays===0){
                            data.medicineUsedDays = (data.dosage/sequenceDay)+''
                        }
                        if(resetDays!=0){
                            let parseDay =(data.dosage/sequenceDay)+1+''
                            data.medicineUsedDays = parseInt(parseDay)+''
                        }
                        console.log(resetDays,(frequencyTimes/frequencyInterval),dosageOne,data.medicineUsedDays,data.dosage,unit,count);
                    }
                }
            },
            dosageOneChange(){
                this.showDosageOneView = true
                if(this.dosageData.dosageOne==='0'){
                    wx.showToast({
                        title: '单次药量输入不可为零哦,将帮你清空了哦~',
                        icon: 'none'
                    })
                    this.dosageData.dosageOne = ''
                    return;
                }
                if(this.dosageData.dosageOne){
                    let x = String(this.dosageData.dosageOne).indexOf('.') + 1; //小数点的位置
                    if(x!==0) {
                        let y = String(this.dosageData.dosageOne).length - x; //小数的位数
                        if (y > 2) {
                            wx.showToast({
                                title: '最多保留两位小数哦~',
                                icon: 'none'
                            })
                        }
                        this.dosageData.dosageOne = JSON.parse(JSON.stringify(this.dosageData.dosageOne.substring(0, x + 2)))
                        return
                    }
                }
            },
            buttonSureConsult(){
                this.buttonLoading = true
                console.log(123);
                this.apiCheckMedcineIsAvailable()
            },
            apiCheckMedcineIsAvailable(){
                let data = {
                    hospitalId: parseInt(this.prescribeIndex.hospitalId || this.prescribeIndex.ihBusiHealthCard.hospitalId),
                    medicineCount: this.dosageData.count,
                    medicineId: this.dosageData.id,
                    medicineSaleUnit: this.dosageData.saleUnit
                }
                prescript.checkMedcineIsAvailable(data).then(res=>{
                    this.sureConsult()
                }).catch(err=>{
                    this.buttonLoading = false
                    uni.removeStorageSync('dosageData')
                    console.log(err);
                })
            },
            sureConsult(){
                this.buttonLoading = false
                uni.removeStorageSync('dosageData')
                let copyDosageData = JSON.parse(JSON.stringify(this.dosageData))
                delete copyDosageData['retailPrice']
                console.log(this.prescribeIndex, this.prescribeIndex.prescriptionMedicineList);
                if(!this.prescribeIndex.prescriptionMedicineList&&!this.prescribeIndex.prescriptionMedicineList.length){
                    let dataInit = [JSON.stringify(copyDosageData)]
                    this.prescribeIndex.prescriptionMedicineList = dataInit
                    uni.setStorageSync('prescribeIndex',JSON.stringify(this.prescribeIndex))
                }
                else{
                    this.prescribeIndex.prescriptionMedicineList.push(copyDosageData)
                    console.log(this.prescribeIndex.prescriptionMedicineList);
                    uni.setStorageSync('prescribeIndex', JSON.stringify(this.prescribeIndex))
                }
                uni.redirectTo({
                    url: '/pagesA/prescribe/index'
                })
            },
            goForDetail(type){
                console.log(type);
                uni.setStorageSync('dosageData',JSON.stringify(this.dosageData))
                uni.redirectTo({
                    url: `/pagesA/prescribe/routeAndFrequency?type=${type}`
                })
            },
            hasInputRequired(type){
                const data = this.dosageData
                if( type!=='开药量' &&
                    data.dosageOne &&
                    data.medicineFrequency &&
                    data.frequencyTimes &&
                    data.frequencyInterval &&
                    data.unit &&
                    data.medicineUsedDays){
                    let unit = parseFloat(data.unit)
                    let days = parseInt(data.medicineUsedDays)
                    let dosageOne = Number(data.dosageOne)
                    let frequencyTimes = parseInt(data.frequencyTimes)
                    let frequencyInterval = parseInt(data.frequencyInterval)
                    if(frequencyTimes!=0&&frequencyInterval!=0){
                        let resetDosage =((frequencyTimes/frequencyInterval)*dosageOne*days) % 1
                        if(resetDosage===0){
                            data.dosage = ((frequencyTimes/frequencyInterval)*dosageOne*days) + ''
                        }
                        if(resetDosage!=0){
                            let pointDosage =(((frequencyTimes/frequencyInterval)*dosageOne*days)+1)+''
                            data.dosage = parseInt(pointDosage)+''
                        }
                        if(data.dosage){
                            let interValue = (data.dosage/unit) % 1
                            if(interValue===0){
                                data.count = (data.dosage/unit) + ''
                            }
                            if(interValue!=0){
                                let pointCount =((data.dosage/unit)+1)+''
                                data.count = parseInt(pointCount)+''
                            }
                            console.log(interValue,data.count);
                        }
                        console.log((frequencyTimes/frequencyInterval),dosageOne,days,data.dosage,unit,data.count,'dosage-count');
                    }
                }
                if( data.dosageOne &&
                    data.medicineFrequency &&
                    data.frequencyTimes &&
                    data.frequencyInterval &&
                    data.unit &&
                    data.count &&
                    data.medicineWay &&
                    data.medicineUsedDays){
                    this.buttonCanClick = true
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 1)'
                }
                else{
                    this.buttonCanClick = false
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 0.2)'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uni-user-box {
        font-size: 12px;
        color: gray;
        border-radius: 8px;
        margin-bottom: 20px;

        .uni-user-mainBox{
            position: relative;
            word-wrap: break-word;
            word-break:break-all;
        }

        .uni-user-title {
            font-size: 18px;
            font-weight: bold;
            margin-right: 6px;
            margin-bottom: 10px;
            color: #333333;
        }

        .uni-textarea-area {
            width: 100%;
            height: 110px;
            padding: 10px 10px 30px 10px;
            background-color: #EDF4FE;
            box-sizing: border-box;
            color: #333333;
            font-size: 15px;
            border-radius: 4rpx;
        }

        .uni-textarea-word {
            position: absolute;
            right: 15px;
            bottom: 10px;
            color: #B2B2B2;
        }

    }

    .content {
    }

    .uni-form-item {
        padding-bottom: 150rpx;
        background-color: #fff;
    }

    .uni-form-title-box {
        background-color: #F6F6F6;
        height: 10rpx;
    }

    .uni-form-itemBox{
        padding:20rpx;
        box-sizing: border-box;
        .list-item-special{
            padding: 10rpx 0rpx 20rpx 10rpx;
        }
    }

    .uni-special-mustWrite{
        color:red;
        margin-right: 5rpx;
    }

    .uni-list-box view:nth-last-child(1) {
        border-bottom: none;
    }

    .uni-input-textarea{
        text-align: left;
        width: 500rpx;
        min-height: 200rpx;
        position: left;
    }

    .list-item {
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;
        font-weight: 400;
        color: #333333;
        padding: 15rpx 30rpx;
        view:nth-of-type(1){
            color: #B2B2B2;
            max-width: 230rpx;
            min-width: 180rpx;
        }

        .uni-input {
            text-align: right;
        }
    }

    .list-item-border{
        padding: 30rpx;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        view:nth-of-type(1){
            color: #464747;
        }
    }

    .uni-input-width{
        max-width: 400rpx;
        min-width: 450rpx;
    }
    .uni-input-default{
        color: #ACACAC;
    }

    .uni-input-imgDeal{
        display: flex;
        align-items: center;
        justify-content: right;
        img{
            margin-left: 20rpx;
            width: 9.9px;
            height: 20px;
        }
    }

    .uni-btn-v {
        padding: 30rpx;
        display: flex;
        box-sizing: border-box;
        position: fixed;
        z-index: 100;
        background-color: #fff;
        bottom: 0;
        text-align: center;
        width: 100%;
    }
</style>
