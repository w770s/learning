<template>
    <view class="content" @touchstart="touchStart">
        <u-topBar :nav="setNav"/>
        <view class="uni-form-title-box"></view>
        <view class="uni-form-item">
            <view class="uni-list-box">
                <view class="list-item list-item-border" @click="goForDetail('1')">
                    <view class="uni-input-imgDeal-special"><text class="uni-special-mustWrite" style="">*</text>临床诊断(ICD)：</view>
                    <view class="uni-input uni-input-imgDeal">
                        <text v-if="createPrescript.clinicalDiagnosis">{{createPrescript.clinicalDiagnosis}}</text>
                        <text v-if="!createPrescript.clinicalDiagnosis" style="color:#ACACAC;">请选择</text>
                        <img v-if="!createPrescript.clinicalDiagnosis" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                    </view>
                </view>
                <view class="list-item list-item-border list-item-bottom-noBorder">
                    <view><text class="uni-special-mustWrite" style="">*</text>主述：</view>
                    <view class="uni-input" @click="importClinic"><view class="uni-text-underline">导入患者病情描述</view></view>
                </view>
                <view class="uni-user-box">
                    <view class="uni-user-mainBox">
                        <textarea
                                @input="changeButtonStatus"
                                v-if="showMainStatement"
                                :auto-focus="true"
                                @blur="showMainStatement=false"
                                placeholder="指患者就诊的最主要症状(或体征)及其持续的时间，内容不超过20个字为宜。"
                                placeholder-style="font-size:15px;color:#989898;"
                                maxlength="100" class="uni-textarea-area"
                                v-model="createPrescript.chiefComplaint">
                        </textarea>
                        <view v-if="!showMainStatement" :class="['uni-textarea-area',createPrescript.chiefComplaint?'':'uni-textarea-view-word']" @click="showMainStatement=true">
                            {{createPrescript.chiefComplaint?createPrescript.chiefComplaint:'指患者就诊的最主要症状(或体征)及其持续的时间，内容不超过20个字为宜。'}}
                        </view>
                        <view class="uni-textarea-word">{{createPrescript.chiefComplaint.length>100?100 +'/100':createPrescript.chiefComplaint.length +'/100'}}</view>
                    </view>
                </view>
                <view class="list-item list-item-border list-item-bottom-noBorder">
                    <view><text class="uni-special-mustWrite" style=""></text>既往史：</view>
                    <view class="uni-input" @click="goForHistory"><view class="uni-text-underline">导入电子病历既往史</view></view>
                </view>
                <view class="uni-user-box">
                    <view class="uni-user-mainBox">
                         <textarea
                                 @input="changeButtonStatus"
                                 v-if="showHistoryTextData"
                                 :auto-focus="true"
                                 @blur="showHistoryTextData=false"
                                 placeholder="患者既往的健康状况和过去患病情况,外科手术预防接种,过敏史等。特别是与目前所患疾病有密切关系的情况。可为空。"
                                 placeholder-style="font-size:15px;color:#989898;"
                                 maxlength="100" class="uni-textarea-area"
                                 v-model="createPrescript.medRecord">
                        </textarea>
                        <view v-if="!showHistoryTextData" :class="['uni-textarea-area',createPrescript.medRecord?'':'uni-textarea-view-word']" @click="showHistoryTextData=true">
                            {{createPrescript.medRecord?createPrescript.medRecord:'患者既往的健康状况和过去患病情况,外科手术预防接种,过敏史等。特别是与目前所患疾病有密切关系的情况。可为空。'}}
                        </view>
                        <view class="uni-textarea-word">{{createPrescript.medRecord.length>100?100 +'/100':createPrescript.medRecord.length +'/100'}}</view>
                    </view>
                </view>

                <!--   开处方   -->
                <view v-if="prescribeType==='1'">
                    <u-datePicker
                              @onConfirm="onConfirm"
                              :changeType="'pharmacy'"
                              :mainTitle="'选择药房'"
                              :defaultValue="pickerData">
                        <view class="list-item list-item-border">
                            <view><text class="uni-special-mustWrite" style=""></text>药房选择</view>
                            <view class="uni-input uni-input-imgDeal">
                                <text v-if="createPrescript.medicineStore">{{createPrescript.medicineStore}}</text>
                                <text v-if="!createPrescript.medicineStore" style="color:#ACACAC;">请选择</text>
                                <img v-if="!createPrescript.medicineStore" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                            </view>
                         </view>
                    </u-datePicker>
                    <view v-if="createPrescript.medicineStore">
                        <view class="list-item-prescribe">
                            <view class="list-item-prescribe-title">
                                <view></view>
                                <view>开药</view>
                            </view>
                            <view class="uni-form-item-medical" v-for="(item,index) in createPrescript.prescriptionMedicineList" :key="index">
                                <view class="uni-form-item-medical-line">
                                    <view style="font-weight: bold;margin-bottom: 10rpx;">
                                        <text>{{item.name?item.name:''}}</text>
                                        <text style="margin:0rpx 10rpx;">{{item.name&&item.name?'x':''}}</text>
                                        <text>{{item.count?item.count+item.saleUnit:''}}</text>
                                    </view>
                                    <view style="color: #989898;">
                                        <text>{{item.medicineWay?item.medicineWay:''}}</text>
                                        <text style="margin:0rpx 10rpx;">{{item.dosageOne?item.dosageOne+item.doseUnit+'/次':''}}</text>
                                        <text>{{item.medicineFrequency?item.medicineFrequency:''}}</text>
                                    </view>
                                </view>
                                <view class="uni-form-item-medical-del" @click="delMedical(index,'prescribe')">删除</view>
                            </view>
                        </view>
                        <view class="list-item list-item-border list-item-top-border" @click="goForDetail('2')">
                            <view><text class="uni-special-mustWrite" style=""></text>开西药：</view>
                            <view class="uni-input uni-input-imgDeal">
                                <img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                            </view>
                        </view>
                    </view>
                    <view class="list-item-bottom-line"  @click="changeButton">
                        <view style="color:#ACACAC;font-size: 30rpx;display: flex;align-items: center;">
                            <radio color="#2984FF" :checked="situationShow" /><text>说明</text>
                        </view>
                        <view style="font-size: 24rpx;">
                            <text style="color:#549AF7;font-size: 24rpx;">《中华人民共和国卫生部令(第53号)——处方管理办法》</text>
                            <text style="color:#ACACAC;">根据《中华人民共和国卫生部令(第53号)——处方管理办法》第⼗十九条 处方一般不得超过7日用量;急诊处方一般不得超过3日用量;对于某些慢性病、老 年病或特殊情况，处方用量可适当延长，但医师应当注明理由。</text>
                        </view>
                    </view>
                </view>

                <!--   开检查   -->
                <view v-if="prescribeType==='2'||prescribeType==='3'">
                    <view class="list-item-prescribe">
                        <view class="list-item-prescribe-title">
                            <view></view>
                            <view v-if="prescribeType==='2'">检查信息</view>
                            <view v-if="prescribeType==='3'">检验信息</view>
                        </view>
                        <view class="uni-form-item-medical" v-if="prescribeType==='2'" v-for="(item,index) in createPrescript.ihCheckInspectionDetails" :key="index">
                            <view class="uni-form-item-medical-line">
                                <view style="font-weight: bold;margin-bottom: 10rpx;">
                                    <text style="margin-right:10rpx;">{{item.examineName?item.examineName:''}}</text>
                                    <text>{{item.detailPartAndMethodName?'('+item.detailPartAndMethodName+')':''}}</text>
                                </view>
                                <view style="color: #989898;">
                                    <text>执行科室：</text>
                                    <text>{{item.departName?item.departName:''}}</text>
                                </view>
                            </view>
                            <view class="uni-form-item-medical-del" @click="delMedical(index,'check')">删除</view>
                        </view>
                        <view class="uni-form-item-medical" v-if="prescribeType==='3'" v-for="(item,index) in createPrescript.ihCheckInspectionDetails" :key="index">
                            <view class="uni-form-item-medical-line">
                                <view style="font-weight: bold;margin-bottom: 10rpx;">
                                    <text>{{item.examineName?item.examineName:''}}</text>
                                </view>
                                <view style="color: #989898;">
                                    <text>检验标本：</text>
                                    <text>{{item.itemName?item.itemName:''}}</text>
                                </view>
                            </view>
                            <view class="uni-form-item-medical-del" @click="delMedical(index,'check')">删除</view>
                        </view>
                    </view>
                    <view v-if="prescribeType==='2'" class="list-item list-item-border list-item-top-border" @click="goForDetail('5')">
                        <view><text class="uni-special-mustWrite" style=""></text>添加检查项目：</view>
                        <view class="uni-input uni-input-imgDeal">
                            <img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                        </view>
                    </view>
                    <view v-if="prescribeType==='3'" class="list-item list-item-border list-item-top-border" @click="goForDetail('6')">
                        <view><text class="uni-special-mustWrite" style=""></text>添加检验项目：</view>
                        <view class="uni-input uni-input-imgDeal">
                            <img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png" />
                        </view>
                    </view>
                    <view class="uni-list-box">
                        <view class="uni-form-title-box"></view>
                        <view class="uni-form-itemBox">
                            <view style="padding: 30rpx 0rpx;">
                                <text>给患者留言</text>
                            </view>
                            <view class="uni-user-box">
                                <view class="uni-user-mainBox">
                                    <textarea @input="changeButtonStatus" v-if="showTextArea" placeholder="请输入您对患者服药的注意事项 (选填) " placeholder-style="font-size:15px;color:#989898;" class="uni-textarea-area" v-model="createPrescript.leaveMessage"></textarea>
                                    <view v-if="!showTextArea" class="uni-textarea-area">{{createPrescript.leaveMessage}}</view>
                                    <view class="uni-textarea-word">{{createPrescript.leaveMessage.length +'/'+ 100}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

            </view>
         </view>
        <view class="uni-btn-v">
            <u-button :loading="buttonLoading" @click="sureConsult" :throttleTime="1000" :customStyle="buttonStyle" type="primary" shape="square" size="default">确认</u-button>
        </view>
        <u-prompt :visible.sync="popShow" title="确认咨询" :sureValue="'导入'" @close="promptClose" @confirm="promptConfirm">
            <view style="padding: 20rpx 40rpx 40rpx 40rpx;color:#333333;">
                {{contentData}}
            </view>
        </u-prompt>
    </view>
</template>


<script>
    import {prescriptions} from '@/models/prescriptions.js'
    const prescript = new prescriptions()
    export default {
        name: "index",
        data(){
            return{
                showTextArea: true,
                canSendButton: false,
                situationShow: false,
                showMainStatement: false,
                showHistoryTextData: false,
                contentData: '',
                popShow: false,
                pickerData: [],
                history:'',
                buttonLoading: false,
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': ''
                },
                createPrescript:{
                    // 开方
                    "medicineStore": "", // 药房
                    "medicineType": 1, // 开药类型
                    "prescriptionMedicineList": [],
                    "prescriptionDoctorId": '', // 医生id
                    "prescriptionDoctorName": "", // 医生
                    "prescriptionDoctorDepartment": "",
                    "prescriptionDoctorDepartmentId": '',
                    "prescriptionDoctorRanks": "",//
                    "healthCardNo": "", // 患者健康卡号

                    // together
                    'clinicNo': '', //就诊流水号
                    "diagnosisOrderNo": '', // 复诊订单编号 必填
                    "chiefComplaint": "", // 主诉
                    "clinicalDiagnosis": "", // 临床诊断结果
                    "clinicalDiagnosisId": '', // 临床诊断结果ID
                    'clinicalhisDiagnosisId': '', // 临床诊断结果hisicdid
                    "medRecord": "", // 既往史
                    "hospitalId": 1, // 医院id
                    "patientId": "", // 患者id
                    "age": '',
                    "gender": '', // 患者性别
                    "idCard": "", // 身份证号
                    "name": "", // 患者姓名

                    // new
                    'healthRardNo': '', // 患者健康卡号
                    'departname': '', // 科室名称
                    'inspectionDoctorId': '', // 开检验医生id
                    'inspectionDoctorDepartmentId': '', // 开检验医生科室id
                    'examinetype': '', // 1：检查，2：检验
                    'leaveMessage': '', // 医生留言/给患者留言
                    'ihCheckInspectionDetails': [], // 检验查详情
                    'inspectionDoctorName': '' // 医生名称
                },
                doctorMes: {},
                prescribeType: '',
                buttonStyle:{
                    textAlign: 'center',
                    width: '690rpx',
                    height: '47px',
                    lineHeight: '47px',
                    borderRadius: '8px',
                    color: '#fff',
                    background: 'rgba(40, 132, 255, 0.2)'
                }
            }
        },
        onLoad(options) {
            this.firstDoing()
            if(options.imData){
                let data = JSON.parse(options.imData)
                this.createPrescript.hospitalId = data.hospitalId
                this.createPrescript.patientId = data.patientId
                this.createPrescript.clinicNo = data.clinicNo
                this.createPrescript.diagnosisOrderNo = data.orderNo
                if(this.prescribeType === '1'){
                    console.log('开处方携带特有参数');
                    this.createPrescript.bookingNo = data.bookingNo
                }
                console.log(data,'123123');
                this.apiSelectHealthCardDetails(data.patientId)
                this.apiSelectOrderDataRecord(data.orderNo)
                uni.removeStorageSync('dosageData')
                uni.removeStorageSync('prescribeIndex')
            }
            if(options.history){
                this.createPrescript.medRecord+=options.history
                if(this.createPrescript.medRecord.length>100){
                    wx.showToast({
                        title: '最多显示100个字哦~',
                        icon: 'none'
                    })
                    this.createPrescript.medRecord = this.createPrescript.medRecord.slice(0,100)
                }
            }
            if(options.clinicalData){
                let originData = JSON.parse(options.clinicalData)
                console.log(originData);
                this.createPrescript.clinicalDiagnosis = originData.name
                this.createPrescript.clinicalDiagnosisId = originData.id
                this.createPrescript.clinicalDiagnosisId = originData.hisDiseaseId
            }
        },
        methods: {
           apiSelectOrderDataRecord(orderNo) {
                prescript.selectOrderDataRecord({orderNo}).then(res => {
                    if(res.data){
                        this.contentData = res.data.description
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiSelectHealthCardDetails(patientId) {
                prescript.selectHealthCardDetails({patientId}).then(res => {
                    this.createPrescript.age = res.data.age
                    this.createPrescript.gender = res.data.gender
                    this.createPrescript.healthCardNo = res.data.healthCardNo
                    this.createPrescript.healthRardNo = res.data.healthCardNo
                    this.createPrescript.idCard = res.data.cardId
                    this.createPrescript.name = res.data.name
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiMedicineStoreInfo(){
                prescript.MedicineStoreInfo().then(res=>{
                    this.pickerData = res.data
                }).catch(err=>{
                    console.log(err);
                })
            },
            changeButtonStatus(){
                if(this.createPrescript.chiefComplaint &&
                   this.createPrescript.clinicalDiagnosis &&
                   this.createPrescript.clinicalDiagnosisId){
                   this.canSendButton = true
                }
                if( this.createPrescript.chiefComplaint &&
                    this.createPrescript.clinicalDiagnosis &&
                    this.createPrescript.clinicalDiagnosisId &&
                    this.situationShow
                ){
                    this.canSendButton = true
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 1)'
                }
                else{
                    this.canSendButton = false
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 0.2)'
                }
            },
            firstDoing(){
                if(uni.getStorageSync('prescribeType')){
                    this.prescribeType = uni.getStorageSync('prescribeType')
                    if(this.prescribeType === '1'){
                        this.setNav.navTitle = '开处方'
                        delete this.createPrescript['examinetype']
                        delete this.createPrescript['healthRardNo']
                        delete this.createPrescript['departname']
                        delete this.createPrescript['leaveMessage']
                        delete this.createPrescript['inspectionDoctorId']
                        delete this.createPrescript['inspectionDoctorDepartmentId']
                        delete this.createPrescript['ihCheckInspectionDetails']
                        delete this.createPrescript['inspectionDoctorName']
                        console.log(this.createPrescript,'createPrescript');
                        this.apiMedicineStoreInfo()
                    }
                    if(this.prescribeType === '2'||this.prescribeType === '3'){
                        delete this.createPrescript['medicineStore']
                        delete this.createPrescript['medicineType']
                        delete this.createPrescript['prescriptionMedicineList']
                        delete this.createPrescript['prescriptionDoctorId']
                        delete this.createPrescript['prescriptionDoctorName']
                        delete this.createPrescript['prescriptionDoctorDepartment']
                        delete this.createPrescript['prescriptionDoctorDepartmentId']
                        delete this.createPrescript['prescriptionDoctorRanks']
                        delete this.createPrescript['healthCardNo']
                        this.situationShow = true // 无需点击说明
                        if(this.prescribeType === '2'){
                            this.createPrescript.examinetype = 1
                            this.setNav.navTitle = '开检查'
                        }
                        if(this.prescribeType === '3'){
                            this.createPrescript.examinetype = 2
                            this.setNav.navTitle = '开检验'
                        }
                        console.log(this.createPrescript,'createPrescript');
                    }
                }
                if(uni.getStorageSync('doctorMes')){
                    this.doctorMes = JSON.parse(uni.getStorageSync('doctorMes'))
                    if(this.prescribeType === '1'){
                        this.createPrescript.prescriptionDoctorId = this.doctorMes.hisDoctorId
                        this.createPrescript.prescriptionDoctorName = this.doctorMes.name
                        this.createPrescript.prescriptionDoctorRanks = this.doctorMes.level
                        this.createPrescript.prescriptionDoctorDepartment = this.doctorMes.departName
                        this.createPrescript.prescriptionDoctorDepartmentId	 = this.doctorMes.hisDepartId
                    }
                    if(this.prescribeType === '2'||this.prescribeType === '3'){
                        this.createPrescript.departname	 = this.doctorMes.departName
                        this.createPrescript.inspectionDoctorName = this.doctorMes.name
                        this.createPrescript.inspectionDoctorId	 = this.doctorMes.hisDoctorId
                        this.createPrescript.inspectionDoctorDepartmentId	 = this.doctorMes.hisDepartId
                    }
                }
                if(uni.getStorageSync('prescribeIndex')){

                    let createPrescriptCopy = JSON.parse(uni.getStorageSync('prescribeIndex'))
                    let objectKeysArray = Object.keys(createPrescriptCopy)
                    let createPrescriptArray = Object.keys(this.createPrescript)
                    objectKeysArray.forEach((item)=>{
                        createPrescriptArray.forEach((items)=>{
                            if(item===items){
                                this.createPrescript[items] = createPrescriptCopy[item]
                            }
                        })
                    })
                    this.apiSelectHealthCardDetails(this.createPrescript.patientId)
                    this.apiSelectOrderDataRecord(this.createPrescript.diagnosisOrderNo)
                    console.log(this.createPrescript);
                }
                this.changeButtonStatus()
            },
            changeButton(){
                this.situationShow = !this.situationShow
                if(this.situationShow){
                    if( this.createPrescript.chiefComplaint &&
                        this.createPrescript.clinicalDiagnosis &&
                        this.createPrescript.clinicalDiagnosisId ){
                        this.canSendButton = true
                        this.buttonStyle['background'] = 'rgba(40, 132, 255, 1)'
                    }
                }
                if(!this.situationShow){
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 0.2)'
                }
            },
            touchStart(){
                this.showMainStatement = false
                this.showHistoryTextData = false
            },
            importClinic(){
                if(this.contentData){
                    this.popShow = true
                }
                if(!this.contentData){
                    wx.showToast({
                        title: '暂无查询到该患者的主述哦~',
                        icon: 'none'
                    })
                }
            },
            promptClose(){
                this.popShow = false
            },
            promptConfirm(){
                this.createPrescript.chiefComplaint += this.contentData
                if(this.createPrescript.chiefComplaint.length>100){
                    wx.showToast({
                        title: '最多显示100个字哦~',
                        icon: 'none'
                    })
                    this.createPrescript.chiefComplaint = this.createPrescript.chiefComplaint.slice(0,100)
                }
                this.popShow = false
            },
            goForHistory(){
                uni.setStorageSync('prescribeIndex', JSON.stringify(this.createPrescript))
                uni.redirectTo({
                    url: `/pagesA/prescribe/pastMedicalHistory?patientId=${this.createPrescript.patientId}`
                })
            },
            delMedical(index,type){
                const that = this
                uni.showModal({
                    title: '提示',
                    content: '确定要删除该处方吗？',
                    success: function (res) {
                        if (res.confirm) {
                            if(type==='prescribe'){
                                that.createPrescript.prescriptionMedicineList.splice(index,1)
                            }
                            if(type==='check'){
                                that.createPrescript.ihCheckInspectionDetails.splice(index,1)
                            }
                            uni.setStorageSync('prescribeIndex', JSON.stringify(that.createPrescript))
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            goForDetail(type){
                console.log(type,this.createPrescript)
                uni.setStorageSync('prescribeIndex', JSON.stringify(this.createPrescript))
                uni.redirectTo({
                    url: `/pagesA/prescribe/routeAndFrequency?type=${type}`
                })
            },
            onConfirm(e) {
                console.log(e.dateValue);
                let whichIndex = e.dateValue[0]
                this.pickerDataRoom = this.pickerData[whichIndex] // todo
                this.createPrescript.medicineStore = this.pickerData[whichIndex].name
            },
            sureConsult() {
                console.log(this.situationShow, this.canSendButton);
                if (this.situationShow && this.canSendButton) {
                    console.log(this.createPrescript);
                    uni.redirectTo({
                        url: '/pagesA/myPrescription/details?prescribeIndex=' + JSON.stringify(this.createPrescript)
                    })
                    uni.setStorageSync('prescribeIndex', JSON.stringify(this.createPrescript))
                }
                if (!this.situationShow) {
                    wx.showToast({
                        title: '请确保勾选底部说明内容哦~',
                        icon: 'none'
                    })
                }
                if (!this.canSendButton) {
                    wx.showToast({
                        title: '请确保带*的选项已填写哦~',
                        icon: 'none'
                    })
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
        border-bottom: 1px solid #eeeeee;

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
            height: 130px;
            padding: 10px 10px 30px 10px;
            background-color: #EDF4FE;
            box-sizing: border-box;
            color: #333333;
            font-size: 15px;
            border-radius: 4rpx;
            margin-bottom: 40rpx;
        }

        .uni-textarea-word {
            position: absolute;
            right: 15px;
            bottom: 10px;
            color: #B2B2B2;
        }

        .uni-textarea-view-word{
            font-size:15px;
            color:#989898;
        }

    }

    .content {
    }

    .uni-form-item {
        padding: 24rpx 24rpx 150rpx 24rpx;
        box-sizing: border-box;
        background-color: #fff;
    }

    .uni-form-title-box {
        background-color: #F6F6F6;
    }

    .list-item-bottom-line{
        padding: 40rpx 0;
        radio{
            transform:scale(0.7);
        }
    }

    .list-item-prescribe{
        padding-top:40rpx;
        font-size: 30rpx;
        color: #464747;
        .list-item-prescribe-title{
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;
            view:nth-of-type(1){
                width: 6rpx;
                height: 26rpx;
                background: #2884FF;
                margin-right: 10rpx;
            }
        }
        .uni-form-item-medical{
            display: flex;
            position: relative;
            justify-content: space-between;
            box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(59, 124, 244, 0.15);
            border-radius: 10rpx;
            background-color: #fff;
            margin-top: 20rpx;
            padding: 10rpx 20rpx;
            font-size: 30rpx;
            box-sizing: border-box;
            .uni-form-item-medical-line{
                min-width: 500rpx;
                max-width: 550rpx;
                word-break: break-all;
            }
            .uni-form-item-medical-del{
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 120rpx;
                max-width: 150rpx;
                color: #fff;
                border-radius: 0rpx 10rpx 10rpx 0rpx;
                background: #FF7560;
            }
        }
        .uni-form-item-medical:nth-last-of-type(1){
            margin-bottom: 40rpx;
        }
    }

    .list-item {
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;
        font-weight: 400;
        color: #333333;
        padding: 30rpx;
        view:nth-of-type(1){
            color: #B2B2B2;
            max-width: 280rpx;
            min-width: 250rpx;
        }

        .uni-input-imgDeal-special{
            min-width: 280rpx !important;
        }

        .uni-input {
            text-align: right;
            .uni-text-underline{
                padding-bottom:5rpx;
                text-decoration:underline;
                color:#549AF7;
            }
        }

        .uni-special-mustWrite{
            color:red;
            width: 40rpx;
            text-align: left;
            display: inline-block;
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

    }

    .list-item-top-border{
        border-top: 1px solid rgba(238, 238, 238, 1);
    }

    .list-item-border{
        padding: 30rpx 0rpx;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        view:nth-of-type(1){
            color: #464747;
        }
    }

    .list-item-bottom-noBorder{
        border-bottom: none;
    }

    .uni-btn-v {
        padding: 30rpx;
        display: flex;
        box-sizing: border-box;
        position: fixed;
        z-index: 10;
        background-color: #fff;
        bottom: 0;
        text-align: center;
        width: 100%;
    }
</style>
