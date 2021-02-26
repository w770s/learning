<template>
    <view>
        <u-bar :nav="setNav"/>
        <view style="padding: 12px;">
            <view style="padding:20px;margin-bottom:15px; background-color: #FFFFFF; border-radius: 8px;">
                <view style="display: flex;justify-content: space-between;padding-bottom: 15px; ">
                    <view style="">健康卡</view>
                    <view>
                        <view
                            type="primary"
                            style="border-radius:8px;padding:10px 15px;color:#fff;text-align:center;line-height:1;font-size: 13px; background: linear-gradient(to right,#5EA6F8,#3B7CF4);"
                            @click="removeBind"
                        >
                            解除绑定
                        </view>
                    </view>
                </view>
                <view>
                    <view style="height: 96px;width: 100%;">
                        <u-barcode cid="code128" :loadMake="true" :opations="opations" :onval="true" format="code128" :val="val" ref="code128" />
                    </view>
                    <view style="margin-top:8px;color:#686868;">No.{{userInfo.healthCardNo?userInfo.healthCardNo:'---'}}</view>
                </view>
            </view>
            <view style="height: 305px; background-color: #FFFFFF;border-radius: 8px;">
                <view class="userList-details">
                    <view class="userList-detailsTitle">姓名</view>
                    <view class="userList-detailsText">{{ userInfo.name?userInfo.name:'---' }}</view>
                </view>
                <view class="userList-details">
                    <view class="userList-detailsTitle">电话</view>
                    <view class="userList-detailsText">{{ userInfo.phone?userInfo.phone:'---' }}</view>
                </view>
                <view class="userList-details">
                    <view class="userList-detailsTitle">身份证</view>
                    <view class="userList-detailsText">{{ userInfo.cardId?userInfo.cardId:'---' }}</view>
                </view>
                <view class="userList-details">
                    <view class="userList-detailsTitle">性别</view>
                    <view class="userList-detailsText">{{ userInfo.gender===0||userInfo.gender===1?userInfo.gender===0?'男':'女':'---'}}</view>
                </view>
                <view style="height: 50px; display: flex; border-bottom: 0.5px solid #B2B2B2;">
                    <view class="userList-detailsTitle">生日</view>
                    <view class="userList-detailsText" style="border-bottom: none;">{{ userInfo.birthday?formatterDate(userInfo.birthday):'---'}}</view>
                </view>
                <view style="display: flex;" v-if="false">
                    <img style="width: 18px; height: 18px; margin-left: 129px; padding-top: 16px;"
                         src="http://file.aihuizhongyi.com/ih-applet/updateCard.png"/>
                    <view @tap="toChange" style="line-height: 50px; padding-left: 15px;color:#4295DF;">修改健康卡</view>
                </view>
            </view>
        </view>
        <u-loading text="加载中.." mask="true" click="true" ref="loading" />
    </view>
</template>

<script>
    import {
        healthyCardModel
    } from '@/models/healthyCard.js'
    import {dateToString} from "../../util/util";
    const healthyCard = new healthyCardModel()
    export default {
        data() {
            return {
                setNav: {
                    isdisPlayNavTitle: true,
                    navTitle: '健康卡详情'
                },
                userId: '',
                userInfo: {},
                val:'12312',
                opations: {
                    format: "CODE128",//选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
                    width: 100,//设置条之间的宽度
                    displayValue: false,//是否在条形码下方显示文字
                    height: 190,
                    fontSize: 100,
                    textAlign: "left",//设置文本的水平对齐方式
                    textPosition: "bottom",//设置文本的垂直位置
                    textMargin: 0,//设置条形码和文本之间的间距
                    background: "#FFFFFF",//设置条形码的背景色
                    margin: 0,//设置条形码周围的空白边距
                }
            };
        },
        onLoad(options) {
            if (options.healthCardNo) {
                this.$refs.loading.open();
                this.userId = uni.getStorageSync('userInfo').userId
                this.$refs['code128']._makeCode()
                this.val = options.healthCardNo
                this.apiHealthCardDetails(options.healthCardNo)
            }
        },
        methods: {
            formatterDate(date){
                return dateToString(date,'yyyy-mm-dd')
            },
            apiHealthCardDetails(healthCardNo) {
                healthyCard.healthCardDetails({healthCardNo}).then(res => {
                    this.userInfo = res.data
                    setTimeout(()=>{
                        this.$refs.loading.close();
                    },1000)
                }).catch((err) => {
                    this.$refs.loading.close();
                    console.log(err);
                })
            },
            apiUnboundHealthCard(userId,healthCardId) {
                healthyCard.unboundHealthCard({userId,healthCardId}).then(res => {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                    uni.navigateBack()
                }).catch((err) => {
                    console.log(err);
                })
            },
            toChange() {
                uni.navigateTo({
                    url: `./addCard`
                })
            },
            removeBind() {
                const that = this
                wx.showModal({
                    title: '提示',
                    content: '确定要解除' + this.userInfo.name + '的健康卡绑定吗？',
                    success(res) {
                        if (res.confirm) {
                            that.apiUnboundHealthCard(that.userId, that.userInfo.id)
                        } else if (res.cancel) {
                            uni.showToast({
                                title: '已取消',
                                icon: 'none'
                            })
                        }
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
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
        line-height: 50px;
        padding-right: 10px;
        border-bottom: 1px solid #E5E5E5;
    }

</style>
