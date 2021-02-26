<template>
    <view style="height:100%;">
        <u-topBar :nav="setNav"/>
        <view :style="{'height':`calc(100% - ${mainTop}px)`,'padding':` 20rpx`,'box-sizing': 'border-box'}">
            <view class="uni-content-item">
                <view class="uni-content-theItem">
                    <view class="uni-content-doctor">
                        <view>
                            <img v-if="clinicDetail.gender===0" src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultMan.png" mode=""></img>
                            <img v-if="clinicDetail.gender===1" src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultWoman.png" mode=""></img>
                        </view>
                        <view>
                            <view style="font-size:30rpx;line-height: 90rpx;">
                                <text class="uni-content-doctorName">{{clinicDetail.patientName}}</text>
                                <text style="margin-right:12rpx;">{{clinicDetail.gender===0?'男':'女'}}</text>
                                <text>{{clinicDetail.age?clinicDetail.age+'岁':'---'}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 医生信息 -->
            <view class="uni-doctor-mes">
                <view class="uni-doctor-mesItem">
                    <view>{{doctorDetail.name}}</view>
                    <view>医生姓名</view>
                </view>
                <view class="uni-doctor-mesItem">
                    <view>{{doctorDetail.level}}</view>
                    <view>职称</view>
                </view>
                <view class="uni-doctor-mesItem">
                    <view>{{doctorDetail.departName}}</view>
                    <view>科室</view>
                </view>
            </view>
            <view :style="{'height':`calc(100% - ${top1}px)`}">
                <view class="uni-businessType-choose">
                    <view v-for="(item,index) in list" :key="index" @tap="changeTabs(index)"
                          :class="['uni-businessType-defaultChoose',index===swiperCurrent?'uni-businessType-sureChoose':'uni-businessType-notChoose']">
                        {{item}}
                    </view>
                </view>
                <view :style="{'height':`100%`}">
                    <scroll-view style="height: 100%;width: 100%;">
                        <swiper class="swiper-box" :current="swiperCurrent" @animationfinish="animationfinish">
                            <swiper-item class="swiper-item">
                                <scroll-view scroll-y style="height: 100%;width: 100%;" v-if="clinicDetail.patientName" @scrolltolower="reachBottom">
                                    <view class="uni-list-box">
                                        <view class="list-item">
                                            <view>诊断结果：</view>
                                            <view class="uni-input">
                                                {{clinicDetail.diagnosis?clinicDetail.diagnosis:'---'}}
                                            </view>
                                        </view>
                                        <view class="list-item">
                                            <view>就诊时间：</view>
                                            <view class="uni-input">
                                                {{clinicDetail.medicalDate?clinicDetail.medicalDate:'---'}}
                                            </view>
                                        </view>
                                        <view class="list-item">
                                            <view>病情主诉：</view>
                                            <view class="uni-input">
                                                {{clinicDetail.chiefComplaint?clinicDetail.chiefComplaint:'---'}}
                                            </view>
                                        </view>
                                        <view class="list-item">
                                            <view>简要病史：</view>
                                            <view class="uni-input">
                                                {{clinicDetail.medRecord?clinicDetail.medRecord:'---'}}
                                            </view>
                                        </view>
                                        <view class="list-item">
                                            <view>医嘱：</view>
                                            <view class="uni-input">
<!--                                                todo-->
                                                {{clinicDetail.order?clinicDetail.order:'---'}}
                                            </view>
                                        </view>
                                        <view class="list-item">
                                            <view>备注：</view>
                                            <view class="uni-input uni-noBorder-input">
                                                {{clinicDetail.remark?clinicDetail.remark:'---'}}
                                            </view>
                                        </view>
                                    </view>
                                </scroll-view>
                                <view v-if="!clinicDetail.patientName" class='no-recent'>
                                    <img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
                                    <text class='no-recent-text'>暂无您的门诊病历哦~</text>
                                </view>
                            </swiper-item>
                            <swiper-item class="swiper-item">
                                <scroll-view v-if="checkoutMes.length>0" scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
                                    <view class='uni-user-box' @tap="reportDetail(item,'检查')" v-for="(item,index) in checkoutMes" :key="index">
                                        <view style="display: flex;align-items: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                            <view class='uni-user-name'>
                                                <view>检查</view>
                                                <view>报告</view>
                                            </view>
                                            <view class='uni-user-mes'>
                                                <view class="uni-item-packageName">{{ item.reportTitle }}</view>
                                                <view>
                                                    <view style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                                                          :class="[item.clinicalDiagnosis?'uni-color-normal':'uni-color-error']">
                                                        报告结果: {{item.clinicalDiagnosis?item.clinicalDiagnosis:'指标正常'}}
                                                    </view>
                                                    <view style="color:gray;">检查时间: {{item.reportDate }}</view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class='uni-user-img'>
                                            <img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/formore.png" />
                                        </view>
                                    </view>
                                    <u-loadmore v-if="checkoutMes.length>4" :status="loadStatus[1]" bgColor="#f2f2f2"></u-loadmore>
                                </scroll-view>
                                <view v-if="checkoutMes.length===0" class='no-recent'>
                                    <img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
                                    <text class='no-recent-text'>暂无您的检查报告哦~</text>
                                </view>
                            </swiper-item>
                            <swiper-item class="swiper-item">
                                <scroll-view v-if="examineMes.length>0" scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
                                    <view class='uni-user-box' @tap="reportDetail(item,'检验')" v-for="(item,index) in examineMes" :key="index">
                                        <view style="display: flex;align-items: center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                            <view class='uni-user-name'>
                                                <view>检验</view>
                                                <view>报告</view>
                                            </view>

                                            <view class='uni-user-mes'>
                                                <view class="uni-item-packageName">{{ item.inspectionName?item.inspectionName:'暂无' }}</view>
                                                <view>
                                                    <view style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                                                          :class="[item.clinicalDiagnosis?'uni-color-normal':'uni-color-error']">
                                                        报告结果: {{item.clinicalDiagnosis?item.clinicalDiagnosis:'指标正常'}}
                                                    </view>
                                                    <view style="color:gray;">检验时间: {{item.inspectionDate?item.inspectionDate:'暂无' }}</view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class='uni-user-img'>
                                            <img src="http://file.aihuihc.com/patient/patientImages/images/medicalReport/formore.png" />
                                        </view>
                                    </view>
                                    <u-loadmore v-if="examineMes.length>4" :status="loadStatus[2]" bgColor="#f2f2f2"></u-loadmore>
                                </scroll-view>
                                <view v-if="examineMes.length===0" class='no-recent'>
                                    <img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
                                    <text class='no-recent-text'>暂无您的检验报告哦~</text>
                                </view>
                            </swiper-item>
                        </swiper>
                    </scroll-view>
                </view>
            </view>
        </view>
        <u-popup v-model="popShow">
            <view style="font-size:30rpx;position:relative;">
                <view class="uni-examine-title">
                    <view>{{testReportRepDataTitle}}</view>
                    <view>{{testReportRepDataDate}}</view>
                </view>
                <view v-if="checkout">
                    <scroll-view class="u-drawer__scroll-view" scroll-y="true">
                        <view class="list-item list-pop-item">
                            <view>检查科室：</view>
                            <view class="uni-input uni-pop-input">
<!--                                todo-->
                                {{inspectReportRepData.departName}}
                            </view>
                        </view>
                        <view class="list-item list-pop-item">
                            <view>检查部位：</view>
                            <view class="uni-input uni-pop-input">
                                {{inspectReportRepData.checkParts}}
                            </view>
                        </view>
                        <view class="list-item list-pop-item">
                            <view>检查所见：</view>
                            <view class="uni-input uni-pop-input">
                                {{inspectReportRepData.examination}}
                            </view>
                        </view>
                        <view class="list-item list-pop-item">
                            <view>检查结果：</view>
                            <view class="uni-input uni-pop-input">
                                {{inspectReportRepData.diagnosis}}
                            </view>
                        </view>
                        <view class="list-item list-pop-item">
                            <view>检查医生：</view>
                            <view class="uni-input uni-pop-input">
                                {{inspectReportRepData.checkDoctorName}}
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view v-if="examine">
                    <view class="uni-detail-colors" style="font-size:30rpx;line-height: 92rpx;padding: 0;">
                        <view>检验指标</view>
                        <view>检测结果</view>
                        <view>剂量单位</view>
                        <view>参考值</view>
                        <view>结果</view>
                    </view>
                    <scroll-view class="u-drawer__scroll-view-report" scroll-y="true">
                        <view>
                            <view :class="['uni-detail-colors',ind%2===0?'uni-detail-blue':'uni-detail-white',items.quaResult?'warning-row':'']"
                                  v-for="(items,ind) in testReportRepData"
                                  :key="ind">
                                <view>{{items.itemName ?items.itemName:'---'}}</view>
                                <view>{{items.examResult ?items.examResult:'---'}}</view>
                                <view>{{items.itemUnit ?items.itemUnit:'---'}}</view>
                                <view>{{items.itemRef ?items.itemRef:'---'}}</view>
                                <view :class="[items.quaResult?'uni-white-font':'']">{{items.quaResult?items.quaResult:'---'}}</view>
                            </view>
                        </view>
                    </scroll-view>
                </view>

            </view>
        </u-popup>
    </view>
</template>

<script>
    import { testReportModel } from '@/models/testReport.js'
    const testReport = new testReportModel()
    const app = getApp()
    export default {
        name: "index",
        data(){
            return {
                mainTop: app.globalData.ImTitleBarHeight,
                top1: app.globalData.ImTitleBarHeight + 160,
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '电子病历',
                },
                clinicDetail: {},
                doctorDetail: {},
                list: ['门诊病历', '检查报告', '检验报告'],
                swiperCurrent: 0,
                loadStatus: ['loadmore', 'loadmore', 'loadmore'],
                medicalList: [{
                    personalName: '放丽丽',
                    packageName: '白领常规体检套餐',
                    abnormal: false,
                    signTime: '2019-02-01',
                },
                    {
                        personalName: '卡死',
                        packageName: '白领常规体检套餐',
                        abnormal: true,
                        signTime: '2020-11-01',
                    }
                ],
                inspectReportRepData: {},
                testReportRepData: [],
                testReportRepDataTitle: '',
                testReportRepDataDate: '',
                popShow: false,
                checkout: false,
                examine: false,
                checkoutMes: [],
                examineMes: []
            }
        },
        onLoad(options){
            // const data = {
            //     medicalId: options.medicalId || '5EE04024B028464EA43564C590A4EDFF',
            //     patientId: options.patientId || '5659291'
            // }
            // this.apiGgtDetailList(data)
            // this.apiSelectDoctor(options.doctorId || '71')
            // this.apiListByClinicNoAndType({clinicNo:'U0036004',hospitalId:'1',patientId:'5910864',type:'0'})
            // this.apiListByClinicNoAndType({clinicNo:'U0036004',hospitalId:'1',patientId:'5910864',type:'1'})
            // return
            const data = {
                medicalId: options.medicalId,
                patientId: options.patientId
            }
            this.apiGgtDetailList(data)
            this.apiSelectDoctor(options.doctorId)
            this.apiListByClinicNoAndType({clinicNo: options.clinicNo,hospitalId:'1',patientId: options.patientId,type:'0'})
            this.apiListByClinicNoAndType({clinicNo: options.clinicNo,hospitalId:'1',patientId: options.patientId,type:'1'})
        },
        onShow() {
        },
        methods: {
            apiGgtDetailList(data){
                testReport.medicalRecordDetails(data).then(res=>{
                    this.clinicDetail = res.data
                }).catch(err=>{
                    console.log(err)
                })
            },
            apiSelectDoctor(doctorId) {
                testReport.selectDoctor({doctorId}).then(res => {
                    res.data.doctorImageList.forEach((userInfo) => {
                        if (userInfo.imageType === 1 && userInfo.sourceType === 10) {
                            res.data.doctorImageList = userInfo.url
                        }
                    })
                    this.doctorDetail = res.data
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiListByClinicNoAndType(data){
                testReport.listByClinicNoAndType(data).then(res=>{
                    if(data.type==='0'){ // 检查
                        this.checkoutMes = res.data
                    }
                    if(data.type==='1'){
                        this.examineMes = res.data
                    }
                    console.log(res.data)
                }).catch(err=>{
                    console.log(err)
                })
            },
            apiCheckReportDetail(data){
                testReport.checkReportDetail(data).then(res=>{
                    this.inspectReportRepData = res.data.inspectReportRepData
                    this.testReportRepData = res.data.testReportRepData
                }).catch(err=>{
                    console.log(err)
                })
            },
            reportDetail(item,type){
                this.popShow = true
                if(type==='检查'){
                    this.examine = false
                    this.checkout = true
                    this.testReportRepDataTitle = item.reportTitle
                    this.testReportRepDataDate = item.reportDate
                    this.apiCheckReportDetail({hospitalId:1,id:item.reportId,type:'0'})
                }
                if(type==='检验'){
                    this.examine = true
                    this.checkout = false
                    this.testReportRepDataTitle = item.inspectionName
                    this.testReportRepDataDate = item.inspectionDate
                    this.apiCheckReportDetail({hospitalId:1,id:item.inspectionId,type:'1'})
                }
            },
            reachBottom() {
                // 此tab为空数据
                if(this.swiperCurrent !== 0) {
                    this.loadStatus.splice(this.swiperCurrent,1,"loading")
                    setTimeout(() => {
                        // data = this.getOrderList(this.current);
                        // if(data.length == 0) {
                        this.loadStatus.splice(this.swiperCurrent,1,"nomore")
                        //     this.loadStatus.splice(this.swiperCurrent,1,"nomore")
                        // }
                    }, 1200);
                }
            },
            animationfinish({ detail: { current } }) {
                this.swiperCurrent = current;
            },
            changeTabs(index){
                this.swiperCurrent = index
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrap{
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--window-top));
        width: 100%;
    }
    .swiper-box {
        flex: 1;
        height: 100%;
    }
    .swiper-item {
        height: 100%;
    }
    .uni-content-item {
        position: relative;
        z-index: 0;
        background-color: #fff;
        box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);
        border-radius: 16rpx;
    }

    .uni-content-theItem{
        font-size: 24rpx;
        color:#333333;
        padding:30rpx;
    }


    .uni-content-doctor {
        display: flex;
        img {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            margin-right: 20rpx;
        }
    }

    .uni-content-doctorName{
        font-size:36rpx;
        font-weight:bold;
        margin-right:12rpx;
    }

    .uni-doctor-mes{
        display: flex;
        justify-content: space-around;
        background: rgba(40, 132, 255, 0.1);
        text-align: center;
        border-radius: 10rpx;
        margin: 30rpx 0rpx;
        padding: 30rpx 0rpx;
    }

    .uni-doctor-mesItem{
        view:nth-of-type(odd){
            font-size: 36rpx;
            margin-bottom: 5rpx;
        }
        view:nth-of-type(even){
            color: #B2B2B2;
            font-size: 26rpx;
        }
    }

    .uni-businessType-choose{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 52rpx;
        line-height: 52rpx;
        padding: 0rpx 55rpx;
        margin-bottom: 30rpx;
        box-sizing: border-box;
        font-size: 26rpx;
        view:nth-of-type(1){
            border-right: none;
            border-radius: 16rpx 0rpx 0rpx 16rpx;
        }
        view:nth-of-type(2){
            border-right: none;
        }
        view:nth-of-type(3){
            border-radius: 0rpx 16rpx 16rpx 0rpx;
        }
    }
    .uni-businessType-defaultChoose{
        width: 50%;
        text-align: center;
    }
    .uni-businessType-sureChoose{
        color: #ffffff;
        border: 1px solid #5EA6F8;
        background: linear-gradient(90deg, #5EA6F8 0%, #3B7CF4 100%);
    }

    .uni-businessType-notChoose{
        color: #B2B2B2;
        border: 1px solid #CACACA;
        background: #ffffff;
    }

    .uni-list-box{
        margin:5rpx;
        box-shadow: 0rpx 4rpx 12rpx 5rpx rgba(59, 124, 244, 0.15);
        border-radius: 10rpx;
    }


    .list-item {
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;
        font-weight: 400;
        color: #333333;
        padding: 30rpx 0rpx;
        border-bottom: 1px solid #eeeeee;
        view:nth-of-type(1){
            color: #B2B2B2;
            box-sizing: border-box;
            padding-left: 30rpx;
        }

        .uni-input {
            text-align: right;
            width: 500rpx;
            box-sizing: border-box;
            padding-right: 30rpx;
            /*border-bottom: 1px solid rgba(238, 238, 238, 1);*/
        }

        .uni-pop-input{
            letter-spacing: 2px;
            border-bottom: none;
            text-align: left;
        }

        .uni-noBorder-input{
            border-bottom: none;
        }

        .input-placeholder {
            color: red;
        }
    }

    .list-pop-item{
        margin-bottom: 20rpx;
        padding: 0rpx;
        border: none;
    }

    /*检查检验*/
    .uni-user-box {
        position: relative;
        font-size: 12px;
        color: gray;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items:center;
        border-radius: 8px;
        height:86px;
        background-color: #fff;
        color:#333333;
        box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);
    }

    .uni-user-name{
        color: #fff;
        font-size: 20px;
        border-radius: 8px;
        display: inline-block;
        margin-right:10px;
        width: 184rpx;
        height:60px;
        line-height: 30px;
        text-align: center;
        padding: 10px;
        box-sizing: content-box;
        overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-break: break-word;
        background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
    }
    .uni-user-mes{
        width: 100%;
        height: 80px;
        font-size:12px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        /*display: flex;*/
        /*flex-wrap: wrap;*/
        /*align-content: space-around;*/
        view{
            /*width: 100%;*/
            margin-bottom: 10px;
        }
        .uni-color-normal{
            color:#333333;
        }
        .uni-color-error{
            color:#FF745F;
        }
    }

    .uni-item-packageName{
        font-size:18px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .uni-user-img {
        height: 100%;
        width: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            height: 20px;
            width: 20px;
        }
    }

    .uni-examine-title{
        text-align: center;
        padding: 40rpx;
        font-weight: bold;
        view:nth-of-type(1){
            font-size: 36rpx;
            margin-bottom: 10rpx;
        }
    }

    .u-drawer__scroll-view{
        width: 100%;
        height: 780rpx;
    }

    .u-drawer__scroll-view-report{
        width: 100%;
        height: 688rpx;
    }

    .uni-detail-colors {
        display: flex;
        background: rgba(40, 132, 255, 0.3);
        font-size: 26rpx;

        view {
            display: flex;
            width: 20%;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10rpx 0;
        }

        view:nth-of-type(1){
            width: 20%;
        }

        view:nth-of-type(2){
            width: 20%;
        }

        view:nth-of-type(3){
            width: 20%;
        }

        view:nth-of-type(4){
            width: 20%;
        }

        view:nth-of-type(5){
            width: 20%;
        }

    }

    .uni-detail-white {
        background-color: #fff;
    }

    .uni-detail-blue {
        background-color: #F5F9FF;
    }

    .warning-row {
        background: #FF745F !important;
    }

    .uni-white-font {
        color: #fff;
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
            height: 180px;
            width: 180px;
            margin:30px 0px;
        }
        .no-recent-text {
            width: 100%;
            text-align: center;
        }
    }
</style>
