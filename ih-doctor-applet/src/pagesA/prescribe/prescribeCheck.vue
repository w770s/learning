<template>
    <view class="content">
        <u-topBar :nav="setNav" :route="'/pagesA/prescribe/routeAndFrequency'" :type="titleType" />
        <form>
            <view class="uni-form-item uni-column">
                <view class="uni-list-box">
                    <view class="uni-form-title-box"></view>
                    <view class="uni-form-itemBox">
                        <view class="list-item-special">
                            <text>{{prescribeType==='2'?'检查单开具':'检验单开具'}}:{{dosageData.examineName?dosageData.examineName:'暂无'}}</text>
                        </view>
                        <u-datePicker
                                @onConfirm="onConfirm"
                                :changeType="'department'"
                                :mainTitle="'执行科室'"
                                :defaultValue="pickerData">
                            <view :class="['list-item,list-item-border',prescribeType==='2'?'list-itemSpecial-border':''] ">
                                <view><text class="uni-special-mustWrite" style="" type="number">*</text>执行科室：</view>
                                <view class="uni-input uni-input-imgDeal">
                                    <text v-if="dosageData.departName">{{dosageData.departName}}</text>
                                    <text v-if="!dosageData.departName" style="color:#ACACAC;">请选择</text>
                                    <img v-if="!dosageData.departName" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                                </view>
                            </view>
                        </u-datePicker>
                        <view v-if="prescribeType==='2'">
                            <view class="list-item-specialSelect" v-for="(item,index) in examineArray" :key="index">
                                <view class="list-item list-item-border" @click="goForDetail('9',index)">
                                    <view><text class="uni-special-mustWrite" style=""></text>检查部位：</view>
                                    <view class="uni-input uni-input-imgDeal">
                                        <text v-if="item.partName">{{item.partName}}</text>
                                        <text v-if="!item.partName" style="color:#ACACAC;">请选择</text>
                                        <img v-if="!item.partName" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                                    </view>
                                </view>
                                <view class="uni-list-box">
                                    <view class="uni-form-title-specialBox"></view>
                                    <view class="uni-form-itemBox">
                                        <view class="list-item-special">
                                            <text style="color: #464747;font-size: 30rpx;"><text class="uni-special-mustWrite" style=""></text>检查方法：</text>
                                        </view>
                                        <view class="uni-user-box" @click="showChoose(item.methodName,index,item.partName)">
                                            <view class="uni-user-mainBox">
                                                <view class="uni-textarea-area">{{item.methodName}}</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>

                            <view class="uni-addMore">
                                <view id="comment" @click="addMore" style="color:#fff;font-weight: bold;">添加</view>
                            </view>
                        </view>
                        <view v-if="prescribeType==='3'">
                            <view class="list-item list-item-border" @click="goForDetail('11')">
                                <view><text class="uni-special-mustWrite" style="" type="number"></text>检验标本：</view>
                                <view class="uni-input uni-input-imgDeal">
                                    <text v-if="dosageData.itemName">{{dosageData.itemName}}</text>
                                    <text v-if="!dosageData.itemName" style="color:#ACACAC;">请选择</text>
                                    <img v-if="!dosageData.itemName" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                                </view>
                            </view>
                            <view class="list-item list-item-border" @click="goForDetail('10')">
                                <view><text class="uni-special-mustWrite" style="" type="number"></text>采集方法：</view>
                                <view class="uni-input uni-input-imgDeal">
                                    <text v-if="dosageData.methodName">{{dosageData.methodName}}</text>
                                    <text v-if="!dosageData.methodName" style="color:#ACACAC;">请选择</text>
                                    <img v-if="!dosageData.methodName" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                                </view>
                            </view>
                            <u-datePicker
                                    @onConfirm="onDetailConfirm"
                                    :changeType="'detailItemDepartName'"
                                    :mainTitle="'采集科室'"
                                    :defaultValue="pickerSpecialData">
                                <view class="list-item list-item-border">
                                    <view><text class="uni-special-mustWrite" style="" type="number"></text>采集科室：</view>
                                    <view class="uni-input uni-input-imgDeal">
                                        <text v-if="dosageData.detailItemDepartName">{{dosageData.detailItemDepartName}}</text>
                                        <text v-if="!dosageData.detailItemDepartName" style="color:#ACACAC;">请选择</text>
                                        <img v-if="!dosageData.detailItemDepartName" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                                    </view>
                                </view>
                            </u-datePicker>
                        </view>
                    </view>
                </view>
                <view class="uni-list-box">
                    <view class="uni-form-title-box"></view>
                    <view class="uni-form-itemBox">
                        <view class="list-item-special">
                            <text>注意事项</text>
                        </view>
                        <view class="uni-user-box">
                            <view class="uni-user-mainBox">
                                <textarea v-if="showtextarea" placeholder="请输入您对患者服药的注意事项 (选填)" placeholder-style="font-size:15px;color:#989898;" maxlength="100" class="uni-textarea-area" v-model="dosageData.remark"></textarea>
                                <view v-if="!showtextarea" class="uni-textarea-area">{{dosageData.remark}}</view>
                                <view class="uni-textarea-word">{{dosageData.remark.length +'/'+ 100}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="uni-btn-v">
                <u-button @click="buttonSureConsult" :throttleTime="1000" :customStyle="buttonStyle" type="primary" shape="square" size="default">确认</u-button>
            </view>
            <u-prompt :visible.sync="popShow" title="选择检查方法" :sureValue="'确认'" @close="promptClose" @confirm="promptConfirm">
                <view style="padding: 20rpx 40rpx 0rpx 40rpx;color:#333333;width: 100%;box-sizing: border-box;">
                    <view class="uni-user-box">
                        <view class="uni-user-mainBox">
                            <textarea :disabled="true" placeholder="请选择下方的检查方法" placeholder-style="font-size:15px;color:#989898;" maxlength="100" class="uni-textarea-area-special" v-model="dosageTextarea"></textarea>
<!--                            <scroll-view v-if="checkMethodsArray.length" class="u-drawer__scroll-view" scroll-y="true">-->
<!--                            </scroll-view>-->
                            <scroll-view class="u-drawer__scroll-view" scroll-y="true">
                                <view class="u-drawer__scroll-viewFlex">
                                     <view :class="['u-drawer__scroll-viewBox',item.isChoose?'u-drawer__scroll-choose':'']" @click="itemClinic(index)" v-for="(item,index) in checkMethodsArray" :key="index">{{item.methodName}}</view>
                                </view>
                            </scroll-view>
                        </view>
                    </view>
                </view>
            </u-prompt>
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
                buttonCanClick: false,
                showtextarea: true,
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': ''
                },
                buttonStyle:{
                    textAlign: 'center',
                    width: '690rpx',
                    height: '47px',
                    lineHeight: '47px',
                    borderRadius: '8px',
                    color: '#fff',
                    background: 'rgba(40, 132, 255, 1)'
                },
                doctorUrl: '',
                top: app.globalData.ImTitleBarHeight,
                dosageData: {
                    "detailPartAndMethodName": '', // 检查部位及方法名称
                    'departId': '', // 检查科室/检验科室id
                    'departName': '', // 科室名称
                    "methodId": '', // 检验采集方法id（检验需
                    "methodName": '', // 检验采集/检查 方法名称
                    "remark": "", // 检验/查注意事项（医生书写）

                    "itemName": "", // 检验标本
                    "detailItemDepartId": '', // 采集科室id
                    "detailItemDepartName": '', // 采集科室名称

                    "examineName": "", // 项目名称
                    "defaultItemName": "", // 检验标本名称（检验才有））itemId
                    "examineId": "", // 项目id
                    "retailPrice": "" // 项目单价（元）
                },
                examineArray: [
                    {
                        partName: '',
                        methodName: '',
                    }
                ],
                prescribeIndex:{},
                prescribeType: '',
                pickerData: [],
                pickerSpecialData: [],
                titleType: '',
                popShow: false,
                checkWhichIndex: '',
                dosageTextarea: '',
                checkMethodsArray: []
            }
        },
        onLoad(options) {
            console.log(options);
            if(options.clear){
                uni.removeStorageSync('dosageData')
                uni.removeStorageSync('examineArray')
                uni.removeStorageSync('checkWhichIndex')
            }
            if(uni.getStorageSync('checkWhichIndex')+''){
                this.checkWhichIndex = uni.getStorageSync('checkWhichIndex')
                console.log(this.checkWhichIndex);
            }
            if(uni.getStorageSync('examineArray')){
                this.examineArray = JSON.parse(uni.getStorageSync('examineArray'))
                console.log(this.examineArray);
            }
            if(uni.getStorageSync('dosageData')){
                this.dosageData = JSON.parse(uni.getStorageSync('dosageData'))
                console.log(this.dosageData);
            }
            if(options.item){
                let optionsMes = JSON.parse(options.item)
                Object.assign(this.dosageData,optionsMes)
                if(optionsMes.itemName){
                    this.$set(this.dosageData,'itemName',optionsMes.itemName)
                }
                if(optionsMes.defaultItemName){
                    this.$set(this.dosageData,'itemName',optionsMes.defaultItemName)
                }
                console.log(optionsMes,this.dosageData.itemName,this.dosageData);
                if(optionsMes.partName){
                    console.log(this.checkWhichIndex,this.examineArray[this.checkWhichIndex]);
                    this.examineArray[this.checkWhichIndex].partName = optionsMes.partName
                }
                console.log(optionsMes,this.dosageData);
            }
            if(uni.getStorageSync('prescribeType')){
                this.prescribeType = uni.getStorageSync('prescribeType')
                this.prescribeIndex = JSON.parse(uni.getStorageSync('prescribeIndex'))
                if(this.prescribeType==='2'){
                    this.setNav.navTitle = '开检查'
                    this.titleType = '5'
                    this.dosageData.itemName = ''
                    this.apiIhCheckInspectionInfoCheckb('1','')
                }
                if(this.prescribeType==='3'){
                    this.setNav.navTitle = '开检验'
                    this.titleType = '6'
                    this.apiIhCheckInspectionInfoCheckb('2','')
                    this.apiIhCheckInspectionInfoCheckb('3','')
                }
                this.changeButton()
            }
        },
        mounted() {
            if(this.checkWhichIndex){
                this.buttonScrollTo()
            }
        },
        methods: {
            clearMes(str,allStr){
                let strArray = allStr.split(',')
                let returnStr = ''
                strArray.forEach((item,index)=>{
                    if((item+',')===str){
                        console.log(item, str);
                        strArray.splice(index,1)
                    }
                    else{
                        if(item){
                            returnStr+=item+','
                        }
                    }
                })
                return returnStr
            },
            itemClinic(index){
                if(this.checkMethodsArray[index].isChoose){
                    let str = this.checkMethodsArray[index].methodName + ','
                    let stringEx = this.clearMes(str,this.dosageTextarea)
                    console.log(str,stringEx);
                    this.dosageTextarea = JSON.parse(JSON.stringify(stringEx))
                    this.checkMethodsArray[index].isChoose = false
                    return
                }
                if(!this.checkMethodsArray[index].isChoose){
                    this.dosageTextarea += this.checkMethodsArray[index].methodName+','
                    this.checkMethodsArray[index].isChoose = true
                    return
                }
            },
            promptClose(){
                this.dosageTextarea = ''
                this.checkMethodsArray.forEach((item)=>{
                    item.isChoose = false
                })
                this.popShow = false
            },
            promptConfirm(){
                this.popShow = false
                let lastStr = this.dosageTextarea.substring(this.dosageTextarea.length-1,this.dosageTextarea.length)
                console.log(lastStr);
                if(lastStr===','){
                    this.dosageTextarea = this.dosageTextarea.substring(0,this.dosageTextarea.length-1)
                }
                console.log(this.dosageTextarea);
                this.examineArray[this.checkWhichIndex].methodName = this.dosageTextarea
                this.dosageTextarea = ''
                console.log(this.dosageTextarea,this.examineArray[this.checkWhichIndex]);
            },
            showChoose(data,index,partName){
                if(!partName){
                    wx.showToast({
                        title: '请先完善当前检查部位选项哦~',
                        icon: 'none'
                    })
                    return
                }
                this.popShow = true
                this.checkWhichIndex = index
                this.apiCheckmethods(partName)
                this.checkMethodsArray = []
                if(this.dosageTextarea.length){
                    let lastStr = this.dosageTextarea.substring(this.dosageTextarea.length-1,this.dosageTextarea.length)
                    if(lastStr!==','&&this.dosageTextarea.length){
                        this.dosageTextarea = data+','
                    }
                    if(lastStr===','&&this.dosageTextarea.length){
                        this.dosageTextarea = data
                    }
                    let dosageTextareaArray = this.dosageTextarea.split(',')
                    this.checkMethodsArray.forEach((item)=>{
                        dosageTextareaArray.forEach((items)=>{
                            if(items===item.methodName){
                                item.isChoose = true
                            }
                        })
                    })
                }
            },
            buttonScrollTo(){
                let me = this;
                let query = wx.createSelectorQuery().in(me);
                query.selectViewport().scrollOffset()
                query.select("#comment").boundingClientRect();
                query.exec(function (res) {
                    console.log(res);
                    let miss = res[0].scrollTop + res[1].top - 10;
                    wx.pageScrollTo({
                        scrollTop: miss,
                        duration: 300
                    });
                });
            },
            addMore(){
                let examineLength = this.examineArray.length
                if(examineLength===0||!this.examineArray[examineLength-1].partName){
                    wx.showToast({
                        title: '请先完善当前检查部位选项哦~',
                        icon: 'none'
                    })
                    return
                }
                let pushObject = {
                    partName: '',
                    methodName: '',
                }
                this.examineArray.push(pushObject)
                wx.showToast({
                    title: '添加成功~',
                    icon: 'none'
                })
                this.buttonScrollTo()
            },
            changeButton(){
                console.log(this.dosageData);
                if( this.dosageData.departName ){
                    this.buttonCanClick = true
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 1)'
                    return
                }
                else{
                    this.buttonCanClick = false
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 0.2)'
                }
            },
            apiCheckmethods(partName){ // 检查方法
                const dataMes = {
                    "examineId": this.dosageData.examineId,
                    "examineType": 1 ,
                    "partName": partName
                }
                prescript.checkmethods(dataMes).then(res=>{
                    if(!res.data){
                        wx.showToast({
                            title: `${res.message}`,
                            icon: 'none'
                        })
                        return
                    }
                    if(res.data.data){
                        res.data.data.forEach((item)=>{
                            item['isChoose'] = false
                        })
                        this.checkMethodsArray = res.data.data
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            apiIhCheckInspectionInfoCheckb(type,searchValue){ // 检查科室/检验/采集科室检索
                const dataMes = {
                    "partId" : searchValue,
                    "examineId" : this.dosageData.examineId,
                    "examineType" : type
                }
                prescript.ihCheckInspectionInfoCheckb(dataMes).then(res=>{
                    if(res.data.data){
                        if(type==='1'||type==='2'){
                            this.pickerData = res.data.data
                        }
                        if(type==='3'){
                            this.pickerSpecialData = res.data.data
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            onConfirm(e) {
                console.log(e.dateValue);
                let whichIndex = e.dateValue[0]
                this.dosageData.departId = this.pickerData[whichIndex].departId
                this.dosageData.departName = this.pickerData[whichIndex].departName
                this.changeButton()
            },
            onDetailConfirm(e){
                let whichIndex = e.dateValue[0]
                console.log(this.pickerData[whichIndex]);
                this.dosageData.detailItemDepartId = this.pickerData[whichIndex].departId
                this.dosageData.detailItemDepartName = this.pickerData[whichIndex].departName
                this.changeButton()
            },
            buttonSureConsult(){
                if(!this.buttonCanClick){
                    wx.showToast({
                        title: '请先完善执行科室哦~',
                        icon: 'none'
                    })
                    return
                }
                this.examineArray.forEach((item)=>{
                    if(item.partName){
                        this.dosageData.detailPartAndMethodName += `${item.partName}(${item.methodName});`
                    }
                })
                if(this.dosageData.detailPartAndMethodName){
                    let dosageDataDetailPart = this.dosageData.detailPartAndMethodName
                    let detailLength = dosageDataDetailPart.length
                    if(dosageDataDetailPart.substring(detailLength-1,detailLength)===';'){
                        let str = dosageDataDetailPart.substring(0,detailLength-1)
                        this.dosageData.detailPartAndMethodName = JSON.parse(JSON.stringify(str))
                    }
                }
                console.log(this.examineArray,this.dosageData.detailPartAndMethodName);
                this.sureConsult()
            },
            sureConsult(){
                let copyDosageData = JSON.parse(JSON.stringify(this.dosageData))
                if(!this.prescribeIndex.ihCheckInspectionDetails&&!this.prescribeIndex.ihCheckInspectionDetails.length){
                    let dataInit = [JSON.stringify(copyDosageData)]
                    this.prescribeIndex.ihCheckInspectionDetails = dataInit
                    uni.setStorageSync('prescribeIndex',JSON.stringify(this.prescribeIndex))
                }
                else{
                    this.prescribeIndex.ihCheckInspectionDetails.push(copyDosageData)
                    console.log(this.prescribeIndex.ihCheckInspectionDetails);
                    uni.setStorageSync('prescribeIndex', JSON.stringify(this.prescribeIndex))
                }
                uni.removeStorageSync('dosageData')
                uni.removeStorageSync('examineArray')
                uni.removeStorageSync('checkWhichIndex')
                uni.redirectTo({
                    url: '/pagesA/prescribe/index'
                })
            },
            goForDetail(type,index){
                console.log(type);
                if(this.prescribeType==='2'){
                    uni.setStorageSync('checkWhichIndex',index)
                    uni.setStorageSync('examineArray',JSON.stringify(this.examineArray))
                }
                uni.setStorageSync('dosageData',JSON.stringify(this.dosageData))
                uni.redirectTo({
                    url: `/pagesA/prescribe/routeAndFrequency?type=${type}`
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .u-drawer__scroll-view {
        width: 100%;
        margin-top: 20rpx;
        max-height: 200rpx;
        border-radius: 10rpx;
        display: flex;
        flex-wrap: wrap;
        padding-left: 10rpx;
        box-sizing: border-box;
        .u-drawer__scroll-viewFlex{
            display: flex;
            flex-wrap: wrap;
            .u-drawer__scroll-viewBox{
                background: #EDF4FE;
                border-radius: 12rpx;
                padding: 15rpx 20rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 30rpx;
                margin-bottom: 20rpx;
                margin-right: 20rpx;
            }
            .u-drawer__scroll-choose{
                color: #ffffff;
                background: #ff0000;
            }
        }
    }

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

        .uni-textarea-area-special{
            width: 100%;
            height: 78px;
            padding: 10px;
            background-color: #fff;
            box-sizing: border-box;
            color: #333333;
            font-size: 15px;
            border-radius: 4rpx;
            border: 1px solid #0083FF;
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

    .uni-form-title-specialBox{
        background-color: #F6F6F6;
        height: 1rpx;
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
        display: inline-block;
        width: 20rpx;
        text-align: left;
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

    .list-itemSpecial-border{
        border-bottom: 10rpx solid rgba(238, 238, 238, 1);
    }

    .uni-input-width{
        max-width: 400rpx;
        min-width: 450rpx;
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

        .big-orange {
            width: 100%;
            background-color: #FE6D00;
            color: #fff;
        }
    }

    .uni-addMore{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15rpx;
        view{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 640rpx;
            height: 94rpx;
            background: linear-gradient(90deg, #FFB554 0%, #FFA36A 100%);
            border-radius: 10rpx;
        }
    }

    .list-item-specialSelect{
        background: #FFFFFF;
        box-shadow: 0px 2px 6px 0px rgba(59, 124, 244, 0.15);
        border-radius: 5px;
        margin-top:16rpx;
    }
</style>
