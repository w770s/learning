<template>
    <view>
        <u-bar :nav="setNav"/>
        <view style="padding:12px;">
            <view class="uni-consult-box">
                <view class="uni-user-box">
                    <view style="width:95px;">
                        头像
                    </view>
                    <view @tap="doSomething" class="uni-user-item" style="padding: 15px 0px;">
                        <view>
                            <img v-if="avatarUrl.length>0" :src="avatarUrl" style="height:60px;width: 60px;border-radius: 50%;" />
                        </view>
                        <view><img src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png" style="height:20px;width: 10px;" />
                        </view>
                    </view>
                </view>
                <view class="uni-user-box">
                    <view style="width:95px;">
                        昵称
                    </view>
                    <view @tap="doChangePage" class="uni-user-item" style="padding: 15px 0px;border-bottom: none;">
                        <view>{{nickName}}</view>
                        <view>
                            <img src="http://file.aihuihc.com/patient/patientImages/images/consulting/rightArrow.png" style="height:20px;width: 10px;" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="uni-chang-box">
                <view style="width: 100%;" @tap="clearStorge" open-type="exit" target="miniProgram">
                    <view class="uni-login-out">退出登录</view>
                </view>
            </view>
        </view>
        <u-loading text="加载中.." mask="true" click="true" ref="loading" />
    </view>
</template>

<script>
    import OBSupload from '@/obs/OBSUploadFile.js'
    import {
        settingModel
    } from '@/models/setting.js'
    let app = getApp()
    const setting = new settingModel()
    export default {
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '设置'
                },
                userId: '',
                avatarUrl:'',
                nickName: ''
            }
        },
        onShow() {
            this.userId = uni.getStorageSync('userInfo').userId
            this.needMes = uni.getStorageSync('userInfo')
            if (this.userId) {
                this.apiSelectUserInfo(this.userId)
            }
        },
        methods: {
            apiSelectUserInfo(userId) {
                setting.selectUserInfo({userId}).then(res => {
                    this.avatarUrl = res.data.avatarUrl
                    this.nickName = res.data.nickName
                }).catch((err) => {
                    console.log(err);
                })
            },
            apiUpdateUserInfo(data) {
                setting.updateUserInfo(data).then(res => {
                    this.apiSelectUserInfo(this.userId)
                }).catch((err) => {
                    console.log(err);
                })
            },
            clearStorge() {
                uni.clearStorageSync()
                uni.switchTab({
                    url: `/pages/login/index`
                })
            },
            doChangePage() {
                uni.navigateTo({
                    url: `./changPage?nickName=${this.nickName}`
                })
            },
            doSomething() {
                let that = this;
                uni.showActionSheet({
                    itemList: ['从相册选择'],
                    success: function (e) {
                        uni.chooseImage({
                            count: 1, // 默认9
                            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                            sourceType: ['camera', 'album'],
                            success: function (res) {
                                const tempFilePaths = res.tempFilePaths;
                                let datass = OBSupload(tempFilePaths[0]);
                                console.log(tempFilePaths[0],datass,'图片上传');
                                const file = wx.getStorageSync('fileName')
                                const changUrl = 'http://file.aihuihc.com/'+file
                                console.log(changUrl);
                                that.avatarUrl = changUrl
                                that.needMes.logo = changUrl
                                uni.setStorageSync('userInfo',that.needMes)
                                const data = {
                                    userId: that.userId,
                                    nickName: that.nickName,
                                    avatarUrl: changUrl
                                }
                                that.apiUpdateUserInfo(data)
                                setTimeout(()=>{
                                    wx.switchTab({
                                        url: '/pages/login/index'
                                    })
                                },200)
                            },

                        });
                    },
                    fail:function(e){
                        wx.showToast({
                            title: '上传失败',
                            icon: '失败'
                        });
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uni-chang-box {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 50px;
    }

    .uni-login-out {
        height: 47px;
        background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
        border-radius: 8px;
        line-height: 47px;
        text-align: center;
        color: #fff;
    }

    .uni-consult-box {
        background-color: #fff;
        border-radius: 8px;
        padding: 0px 10px;
    }

    .uni-user-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .uni-user-item {
        width: 100%;
        border-bottom: 0.5px solid #E5E5E5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0px;
    }
</style>
