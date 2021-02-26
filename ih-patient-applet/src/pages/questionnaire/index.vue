<template>
    <view>
        <u-bar v-if="advisoryType" :nav="setNavs" :route="'/pagesA/questionnaire/index'" />
        <u-bar v-if="!advisoryType" :nav="setNav" />
        <view class="uni-questionnaire-title">
            <view style="font-size:40rpx;font-weight:bold;text-align: center;margin-bottom: 20rpx;color:#2884FF;"><text>{{QuestionDetail.questionnaireName}}</text></view>
            <view style="font-size:30rpx;"><text>各位患者：</text></view>
            <view style="font-size:30rpx;"><text>请您根据在本医院的就诊情况完成以下的满意度调查</text></view>
        </view>
        <view class="uni-padding-wrap">
            <form @submit="formSubmit">
                <view class="uni-form-item" v-for="(item, index) in QuestionDetail.ihQuestionnaireTopicData" :key="index">
                    <view class="uni-form-title"><text v-if="item.type==='1'||item.type==='2'" style="color:red;margin-right:4rpx;">*</text>{{item.name}}</view>
                    <view style="color:#B2B2B2;font-size:15px;margin-bottom: 15rpx;">{{item.remark}}</view>
                    <radio-group v-if="item.type==='1'" :name="'radio' + index" class="form-radio-gap">
                        <label class="uni-list-cell uni-list-cell-pd" @tap="starClick(index,inde,itemSon)" v-for="(itemSon, inde) in item.ihQuestionnaireTopicOptionData" :key="inde">
                            <view>
                                <radio :disabled="finished" :checked="itemSon.optionContent"  color="#2884FF" :value="itemSon.optionName" class="form-radio" />
                            </view>
                            <view>{{itemSon.optionName}}</view>
                        </label>
                        <br>
                    </radio-group>
                    <checkbox-group v-if="item.type==='2'" :name="'checkbox' + index">
                        <label class="uni-list-cell uni-list-cell-pd" @tap="starClick(index,inde,itemSon)" v-for="(itemSon, inde) in item.ihQuestionnaireTopicOptionData" :key="inde">
                            <view>
                                <checkbox :disabled="finished" :checked="itemSon.optionContent" class="form-radio" color="#2884FF" :value="itemSon.optionName" />
                            </view>
                            <view>{{itemSon.optionName}}</view>
                        </label>
                    </checkbox-group>
                    <view class="uni-user-box" v-if="item.type==='3'">
                        <view v-for="(items,indexs) in item.ihQuestionnaireTopicOptionData" :key="indexs">
                            <textarea :disabled="finished" v-if="showTextarea" @input="changeArea(index,indexs,items.optionContent,item.ihQuestionnaireTopicOptionData)" v-model="items.optionContent" placeholder="请输入对医生的评语..." placeholder-style="font-size:15px;color:#B2B2B2;" maxlength="100" class="uni-textarea-area"></textarea>
                            <view v-if="!showTextarea" class="uni-textarea-area">{{items.optionContent}}</view>
                        </view>
                    </view>
                </view>
                <view class="uni-btn-v">
                    <button formType="submit" :class="['uni-sure-btn',QuestionDetail.isFinish?'uni-user-appraise':'']">确认提交</button>
                </view>
            </form>
        </view>
<!--        <textarea placeholder="请输入对医生的评语..." placeholder-style="font-size:15px;color:#B2B2B2;" maxlength="100" class="uni-textarea-area"></textarea>-->
        <view class="uni-padding-background" v-if="isShowBack">
            <view style="position:relative;">
                <img src="http://file.aihuihc.com/patient/patientImages/images/bulletWound.png" ></img>
                <view class="uni-padding-tip">
                    <view style="font-size:36rpx;font-weight:bold;margin-bottom: 10rpx;">提交成功</view>
                    <view>感谢您的真挚反馈！</view>
                    <view style="display: flex;justify-content: center;align-items: center;margin-top: 50rpx;">
                        <navigator @tap="hasKnow" open-type="exit" target="miniProgram">
                            <view class="uni-login-out">我知道了</view>
                        </navigator>
                    </view>
                </view>
            </view>
        </view>
        <u-loading text="加载中.." mask="true" click="true" ref="loading" />
    </view>
</template>

<script>
    import {consultingModel} from '@/models/consulting.js'
    const consulting = new consultingModel()
    export default {
        data(){
            return{
                isShowBack: false,
                setNav: {
                    'navTitle': '问卷调查'
                },
                setNavs: {
                    isdisPlayNavTitle: true,
                    'navTitle': '问卷调查'
                },
                advisoryType:false,
                orderNo: '',
                showTextarea:true,
                finished: false,
                QuestionDetail: {},
                questionData:{},
                submitList:[],
                clickArray:[],
                checkBoxArray: []
            }
        },
        onLoad(options) {
            console.log(options)
            this.orderNo = options.orderNo
            this.orderId = options.id
            if(options.advisoryType){
                this.advisoryType = true
            }
            const data = {
                id: options.id
            }
            if(options.orderNo){
                data['correlationNo'] = options.orderNo
            }
            this.apiDetailQuestion(data)
        },
        methods: {
            formSubmit(e) {
                if(this.QuestionDetail.isFinish){
                    wx.showModal({
                        title: '您已评价过了哦~',
                        showCancel: false,
                        success(res) {
                        }
                    });
                }
                this.hasError = false
                this.questionData = e.detail.value
                console.log(this.questionData);
                Object.keys(this.questionData).forEach((item)=>{
                    if(!this.questionData[item]&&!item.includes('checkbox')){
                        this.hasError = true
                        return
                    }
                    else if(this.questionData[item].length<1&&item.includes('checkbox')){
                        this.hasError = true
                        return
                    }
                })
                if(this.hasError){
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: `所有带*的必填项不可为空哦`,
                        success(res) {
                            if (res.confirm) {
                            }
                        }
                    });
                }
                if(!this.hasError){
                    this.surveySection()
                }
            },
            surveySection(){
                console.log(this.submitList);
                let submitData = {questionnaireContentList:[]}
                this.indexList = []
                this.submitList.forEach((item)=>{
                    submitData.questionnaireContentList.push({content:item.content,id:item.id})
                })
                if(this.submitList.length>0){
                    this.$refs.loading.open();
                    this.apiSubmitQuestion(submitData)
                }
            },
            hasKnow(){
                if (!this.advisoryType){
                    uni.clearStorageSync()
                }
                this.showTextarea = true
                this.isShowBack = false
            },
            starClick(index,indexs,data){
                if(this.submitList.length>0){
                    this.submitList.forEach((item,inde)=>{
                        if(data.type==='1' || data.type==='2'){
                            if(item.index===index && data.type==='1'){
                                let theID = data.id
                                if(item.id!==data.id){
                                    this.submitList[inde] = {content:indexs,id:theID,index:index}
                                }
                            }
                            if(item.index===index && data.type==='2'){
                                let theID = data.id
                                if(item.id!==data.id && data.isShow){
                                    if(this.checkBoxArray.indexOf(indexs)===-1){
                                        this.submitList.push({content:indexs,id:theID,index:index})
                                        this.checkBoxArray.push(indexs)
                                        data.isShow = false
                                    }
                                }
                                if(item.id===data.id && !data.isShow){
                                    data.isShow = true
                                    this.checkBoxArray.forEach((item,keyIndex)=>{
                                        if(item===indexs){
                                            this.checkBoxArray[keyIndex] = ''
                                        }
                                    })
                                    this.submitList.splice(inde,inde+1)
                                }
                            }
                            if(item.index!==index){
                                if(this.clickArray.indexOf(index)===-1){
                                    let theID = data.id
                                    this.submitList.push({content:indexs,id:theID,index:index})
                                    this.clickArray.push(index)
                                }
                            }
                        }
                        else if(data.type==='3'){

                        }
                    })
                }
                else if(this.submitList.length===0){
                    let theID = data.id
                    if(data.type==='2'){
                        data.isShow = false
                        this.checkBoxArray.push(indexs)
                    }
                    this.clickArray.push(index)
                    this.submitList.push({content:indexs,id:theID, index:index})
                }
                console.log(this.submitList);
            },
            changeArea(keyIndex,index,value,ihQuestionnaireTopicOptionData){
                if(this.submitList.length>0){
                    this.submitList.forEach((item,inde)=>{
                        if(item.index===keyIndex){
                            if(item.id===ihQuestionnaireTopicOptionData[index].id){
                                this.submitList[inde] = {content:value,id:ihQuestionnaireTopicOptionData[index].id,index:keyIndex}
                            }
                        }
                        else if(item.index!==keyIndex){
                            if(this.clickArray.indexOf(keyIndex)===-1){
                                this.clickArray.push(keyIndex)
                                this.submitList.push({content:value,id:ihQuestionnaireTopicOptionData[index].id,index:keyIndex})
                            }
                        }
                    })
                }
                else if(this.submitList.length===0){
                    this.clickArray.push(keyIndex)
                    let theID = ihQuestionnaireTopicOptionData[index].id
                    this.submitList.push({content:value,id:theID,index: keyIndex})
                }
            },
            apiDetailQuestion(data) {
                consulting.detailQuestion(data).then(res => {
                    this.QuestionDetail = res.data
                    if(this.QuestionDetail.isFinish){
                        this.finished = true
                        wx.showModal({
                            title: '您已评价过了哦~',
                            showCancel: false,
                            success(res) {
                            }
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiSubmitQuestion(data) {
                consulting.submitQuestion(data).then(res => {
                    this.showTextarea = false
                    this.isShowBack = true
                    const datas = {
                        id: this.orderId
                    }
                    if(this.orderNo){
                        datas['correlationNo'] = this.orderNo
                    }
                    this.apiDetailQuestion(datas)
                    this.$refs.loading.close();
                }).catch((err) => {
                    this.$refs.loading.close();
                    console.log(err);
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .uni-questionnaire-title{
        padding: 30rpx;
        border-bottom:2rpx solid #E5E5E5;
    }

    .uni-textarea-area {
        width: 100%;
        height: 110px;
        padding:10px;
        background-color: #fff;
        box-sizing: border-box;
        color: #333333;
        font-size: 15px;
        border-radius: 8px;
        border:1px solid #E5E5E5;
        margin-bottom: 20rpx;
    }

    .uni-padding-wrap {
        padding: 30rpx;
        font-size: 30rpx;
    }
    .uni-form-item {
        line-height: 50rpx;
        .uni-form-title{
            color: #333333;
            font-size:30rpx;
            font-weight:bold;
            margin-bottom: 20rpx;
        }
    }
    .form-radio-gap {
        margin-bottom: 30rpx;
    }
    .form-radio {
        margin-bottom: 10rpx;
        transform: scale(0.7);
    }
    .uni-btn-v{
        display: flex;
        justify-content: center;
        .uni-sure-btn{
            width:649rpx;
            height:94rpx;
            color: #fff;
            line-height:94rpx;
            margin-top: 40rpx;
            background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
            border-radius:10rpx;
        }
        .uni-user-appraise{
            background: #E5E5E5;
        }
    }

    .uni-list-cell {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20rpx;
    }
    .uni-input{
        padding: 0rpx 28rpx;
        width:664rpx;
        height:80rpx;
        line-height: 100rpx;
        border-radius: 5rpx;
        box-sizing: border-box;
        border:2rpx solid rgba(178,178,178,1);
        margin-bottom: 50rpx;
    }

    .uni-padding-background{
        position:fixed;
        top:0rpx;
        right:0rpx;
        left:0rpx;
        bottom: 0rpx;
        z-index: 9999;
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background:rgba(0,0,0,0.5);

        img{
            width:580rpx;
            height:592rpx;
        }

        .uni-padding-tip{
            position: absolute;
            height: 200rpx;
            width: 100%;
            right: 0rpx;
            left: 0rpx;
            bottom: 60rpx;
            font-size: 30rpx;
            text-align: center;
            .uni-login-out{
                color: #fff;
                font-size: 36rpx;
                width:360rpx;
                height:70rpx;
                line-height:70rpx;
                text-align: center;
                background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
                border-radius:8rpx;
            }
        }
    }
</style>
