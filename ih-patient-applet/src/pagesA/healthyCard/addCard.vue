<template>
    <view>
        <u-bar :nav="setNav"/>
        <view class="uni-content">
            <view class="uni-content-box">
                <view class="userList-details">
                    <view class="userList-detailsTitle">姓名</view>
                    <input placeholder="请输入姓名" placeholder-style="color:#B2B2B2;" v-model="userList.name"
                           class="userList-detailsText"
                           @input='changeInput'
                          />
                </view>
                <view class="userList-details">
                    <view class="userList-detailsTitle">电话</view>
                    <input placeholder="请输入电话" placeholder-style="color:#B2B2B2;" v-model="userList.phone"
                           class="userList-detailsText"
                           @input='changeInput'
                           />
                </view>
                <view class="userList-details">
                    <view class="userList-detailsTitle">身份证</view>
                    <input placeholder="请输入身份证号码" placeholder-style="color:#B2B2B2;" v-model="userList.idCard"
                           class="userList-detailsText"
                           @input='changeIdCard'/>
                </view>
                <view class="userList-details">
                    <view class="userList-detailsTitle">性别</view>
                    <view class="userList-detailsText"
                          style="display: flex;align-items: center; justify-content: left;">
                        <view :disabled="disabledMale" :class="[disabledMale == true?'isDisable':'nodisable']"
                              style="margin:0 !important;width: 60px; height: 30px; line-height: 30px; font-size: 12px;">
                            男
                        </view>
                        <view :disabled="disabledFamale" :class="[disabledFamale == true?'isDisable':'nodisable']"
                              style="margin-left:14px;width: 60px; height: 30px; line-height: 30px; font-size: 12px;">女
                        </view>
                    </view>
                </view>
                <view style=" height: 50px; display: flex;position: relative;">
                    <view class="userList-detailsTitle">生日</view>
                    <view v-model="userList.birthdayVal" class="userList-detailsText" style="border-bottom: none;">
                        <u-datePicker @onCancel="onCancel" @onConfirm="onConfirm" :startDate="startDate"
                                         :endDate="endDate"
                                         :defaultValue="pickerDate">
                            <text :class="[userList.birthdayVal!==''?'uni-black-color':'uni-gray-color']">
                                {{userList.birthdayVal || '请输入'}}
                            </text>
                        </u-datePicker>
                    </view>
                    <img class="uni-right-img" src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png"></img>
                </view>
                <u-button :loading="loading" @click="goUserTest" :throttleTime="2000" :customStyle="buttonStyle" type="primary" shape="square" size="default">下一步</u-button>
                <view style="width: 100%; height: 17px; line-height: 17px; font-size: 12px; color: #B2B2B2FF;margin-top: 5px;text-align: center;">
                    点击下一步发送短信验证码
                </view>
            </view>
        </view>
<!--        <u-loading text="加载中.." mask="true" click="true" ref="loading" />-->
    </view>
</template>

<script>
    import {
        healthyCardModel
    } from '@/models/healthyCard.js'
    const healthyCard = new healthyCardModel()
    export default {
        data() {
            return {
                startDate: "1900-01-01",
                endDate: "2030-12-31",
                pickerDate: this.fun_date(),
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '添加健康卡'
                },
                userList: {
                    name: '',
                    phone: '',
                    idCard: '',
                    gender: '',
                    birthdayVal: ''
                },
                buttonStyle:{
                    height: '47px',
                    marginTop: '40px',
                    lineHeight: '47px',
                    textAlign: 'center',
                    fontSize: '18px',
                    color: '#fff',
                    borderRadius: '8px',
                    background: 'rgba(40, 132, 255, 0.2)'
                },
                whichIndex: 3,
                disabledMale: true,
                disabledFamale: true,
                next: false,
                loading: false,
            }
        },
        onLoad(){
            this.changeIdCard()
        },
        methods: {
            fun_date() {
                let date1 = new Date();
                return date1.getFullYear() +'-'+ ((date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1) : (date1.getMonth() +
                    1)) +'-'+ (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate())
            },
            onCancel(e) {
                console.log(e);
            },
            changeInput(){
                this.mustWrite()
            },
            mustWrite() {
                const hasNoWrite = []
                Object.keys(this.userList).forEach((item) => {
                    if(!this.userList[item]){
                        hasNoWrite.push(item)
                    }
                })
                if(hasNoWrite.length>0){
                    this.next = false
                    this.buttonStyle['background'] = 'rgba(40, 132, 255, 0.2)'
                }
                if(hasNoWrite.length==0){
                    this.next = true
                    this.buttonStyle['background'] = 'linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%)'
                }
            },
            onConfirm(e) {
                this.pickerDate = e.dateValue;
                this.userList.birthdayVal = e.dateValue;
                this.mustWrite()
            },
            apiSendVerifyCode(phone) {
				const data ={
					phone,
					title: '安徽医科大学附属海螺医院'
				}
                healthyCard.sendVerifyCode(data).then(res => {
                    uni.navigateTo({
                        url: `./securityCode?item=${JSON.stringify(this.userList)}`
                    })
                    this.loading = false
                }).catch((err) => {
                    this.loading = false
                    console.log(err);
                })
            },
            changeIdCard() {
                if (this.userList.idCard) {
                    const genderNum = this.userList.idCard.substring(16, 17)
                    const year = this.userList.idCard.substring(6, 10)
                    const month = this.userList.idCard.substring(10, 12)
                    const day = this.userList.idCard.substring(12, 14)
                    if(year && month && day && genderNum){
                        this.userList.birthdayVal = year+'-'+month+'-'+day
                    }
                    if (this.userList.idCard.length === 18 && genderNum % 2 !== 0) {
                        this.disabledMale = false
                        this.disabledFamale = true
                        this.userList.gender = genderNum === '0'?'1':'0'
                    } else if (this.userList.idCard.length === 18 && genderNum % 2 === 0) {
                        this.disabledFamale = false
                        this.disabledMale = true
                        this.userList.gender = genderNum === '0'?'1':'0'
                    } else {
                        this.userList.gender = ''
                        this.disabledFamale = true
                        this.disabledMale = true
                    }
                }
                this.mustWrite()
            },
            showModelMes(mes){
                wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: mes,
                    success(res) {
                    },
                    fail(err){
                    }
                });
            },
            goUserTest(e) {
                this.next = false
                this.mustWrite()
                if (this.userList.idCard) {
                    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
					this.userList.idCard = this.userList.idCard.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！''""@#￥%……&*"（）——\-+={}|《》' '？：“”【】" "、；‘'，。、]/g,"")
                    if (!reg.test(this.userList.idCard)) {
                        wx.showModal({
                            title: '提示',
                            content: `身份证格式不正确`,
                            success(res) {
                                if (res.confirm) {
                                    console.log(res.confirm);
                                } else if (res.cancel) {
                                    console.log(res.cancel);
                                }
                            }
                        });
                        return
                    }
                }
                if (this.userList.phone) {
                    const reg = /^[1][0-9]{10}$/
					this.userList.phone = this.userList.phone.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！''""@#￥%……&*"（）——\-+={}|《》' '？：“”【】" "、；‘'，。、]/g,"")
                    if (!reg.test(this.userList.phone)) {
                        wx.showModal({
                            title: '提示',
                            content: `手机号码有误`,
                            success(res) {
                                if (res.confirm) {
                                    console.log(res.confirm);
                                } else if (res.cancel) {
                                    console.log(res.cancel);
                                }
                            }
                        });
                        return
                    }
                }
                if(this.next === false){
                    this.showModelMes('请先完善信息')
                    return
                }
                this.loading = true
                this.apiSendVerifyCode(this.userList.phone)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uni-content {
        padding: 12px;
    }

    .uni-content-box {
        height: 254px;
        background-color: #FFFFFF;
        border-radius: 8px;
    }

    .flex-item {
        width: 90%;
        margin: 0 auto;
        margin-top: 10px;
        height: 150px;
        background-color: white;
    }

    .userList-details {
        height: 50px;
        display: flex;
    }

    .userList-detailsTitle {
        width: 95px;
        line-height: 50px;
        padding-left: 15px;
    }

    .userList-detailsText {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        border-bottom: 1px solid #E5E5E5;
        padding-right: 10px;

        view {
            width: 60px;
            border-radius: 8px;
            text-align: center;
        }

    }

    .uni-black-color {
        color: #333333;
    }

    .uni-gray-color {
        color: #B2B2B2;
    }


    .uni-right-img {
        position: absolute;
        right: 10px;
        top: 15px;
        height: 20px;
        width: 10px;
        z-index: 100;
        background-color: #fff;
    }

    .isDisable {
        background-color: #F5F9FF;
        color: #B2B2B2;
        border: none !important;
    }

    .nodisable {
        background: #2884FF;
        color: #FFFFFF;
        border: none;
    }

    .uni-button-next {
        height: 47px;
        margin-top: 40px;
        line-height: 47px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        border-radius: 8px;
    }

    .uni-button-disabled {
        background: rgba(40, 132, 255, 0.2);
    }

    .uni-button-color {
        background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
    }
</style>

