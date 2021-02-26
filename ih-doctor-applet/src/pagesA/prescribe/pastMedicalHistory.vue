<template>
<view class="uni-content">
    <u-topBar :nav="setNav" :route="'/pagesA/prescribe/index'" />
    <view>
        <view v-if="medicalRecord.length>0">
            <view class='uni-select-box' @tap.prevent.stop="radioTap(index)" v-for="(item,index) in medicalRecord" :key="index">
                <view class='uni-select-img'>
                    <radio color="#2984FF" :checked="item.checked" />
                </view>
                <view style="width: 100%;">
                    <view class="uni-select-all">{{item.medRecord?item.medRecord:'无'}}</view>
                    <view class='uni-select-mes'>
                        <view>就诊科室名: {{item.departName?item.departName:'暂无'}}</view>
                        <view>就诊日期: {{item.medicalDate?item.medicalDate:'暂无'}}</view>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="medicalRecord.length===0" class='no-recent'>
            <img src="http://file.aihuihc.com/ih-doctor-applet/image/message.png" class='no-recent-image' />
            <text class='no-recent-text'>暂无您的既往史哦~</text>
        </view>
    </view>
    <view class="uni-btn-v" v-if="medicalRecord.length!==0">
        <u-button v-if="medicalRecord.length!==0" @click="sureConsult" :throttleTime="1000" :customStyle="buttonStyle" type="primary" shape="square" size="default">导入</u-button>
    </view>
</view>
</template>

<script>
    import {prescriptions} from '@/models/prescriptions.js'
    const prescript = new prescriptions()
    const app = getApp()
    export default {
        name: "pastMedicalHistory",
        data(){
            return{
                medicalRecordString:'',
                setNav: {
                    'isdisPlayNavTitle': true,
                        'navTitle': '既往史导入'
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
                medicalRecord:[],
            }
        },
        onLoad(options){
            console.log(options.patientId);
            this.patientId = options.patientId
            this.apiListPatientMedicalRecord(options.patientId)
        },
        methods: {
            apiListPatientMedicalRecord(patientId){
                prescript.listPatientMedicalRecord({patientId}).then(res=>{
                    this.medicalRecord = res.data
                    if(this.medicalRecord.length>0){
                        this.medicalRecord.forEach((item)=>{
                            return item['checked'] = false
                        })
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            radioTap(index) {
                console.log(index);
                this.medicalRecord[index].checked = !this.medicalRecord[index].checked;
                let chooseArray = []
                this.medicalRecordString = ''
                this.medicalRecord.forEach((item, index) => {
                    if(item.checked){
                        this.medicalRecordString += item.medRecord
                        chooseArray.push(item)
                    }
                })
                if(chooseArray.length > 0){
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 1)'
                }
                if(chooseArray.length === 0){
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 0.2)'
                }
                console.log(chooseArray,this.medicalRecordString);
            },
            sureConsult(){
                if(!this.medicalRecordString){
                    uni.showModal({
                        title: '提示',
                        showCancel: false,
                        content: `还未选择既往史数据哦~`,
                        success(res) {
                            if (res.confirm) {
                            }
                        }
                    });
                    return
                }
                console.log(this.medicalRecordString);
                uni.redirectTo({
                    url: '/pagesA/prescribe/index?history=' + this.medicalRecordString
                });
            },
        }
    }
</script>
<style lang="scss">
    page{
        background-color:#F6F6F6;
    }
</style>

<style lang="scss" scoped>
    .uni-content{
        font-size: 30rpx;
        padding-bottom:180rpx;
    }

    .uni-select-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        margin-top: 20rpx;
        color: #464747;
    }

    .uni-select-all {
        padding: 30rpx 0px;
        font-size: 24rpx;
        display: flex;
        justify-content: left;
        align-items: center;
        margin-right: 10px;
        border-bottom: 1px solid #E5E5E5;
    }

    .uni-select-mes {
        /*display: flex;*/
        /*justify-content: space-between;*/
        padding-top: 10px;
        font-size: 12px;
        margin-right: 10px;
        color:#3E3E3E;

        view {
            margin-bottom: 10px;
        }

        .uni-color-normal {
            color: #000000;
        }

        .uni-color-error {
            color: red;
        }
    }

    .uni-select-img {
        width: 200rpx;
        min-height: 200rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .uni-btn-v {
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        position: fixed;
        z-index: 100;
        background-color: #fff;
        bottom: 0;
        text-align: center;
        width: 100%;
        border-top: 1px solid #EEEEEE;
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
            margin:100px 0px 30px 0px;
        }
        .no-recent-text {
            width: 100%;
            text-align: center;
        }
    }
</style>
