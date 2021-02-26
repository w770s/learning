<template>
    <view>
        <u-bar :nav="setNav" />
        <view class="uni-content-box">
            <view style="padding-bottom:30px;">
                <view class="uni-doctor-line-title">
                    <view>咨询患者评价({{evaluateList.length}})</view>
                </view>

                <view v-for="(item,index) in evaluateList" :key="index" class="uni-grade-box">
                    <view style="display: flex;justify-content: space-between;align-items: center;">
                        <view style="display: flex;">
                            <view style="margin-right:15px;">{{item.receiveName?isFormatName(item.receiveName):'***'}}</view>
                            <view style="font-size:12px;color:#B2B2B2;display: flex;line-height:1.8;">
                                <view>评分：</view>
                                <u-sunui-star v-if="item.optionContent" :defaultStar="item.optionContent" starSize="1em" :disabledStar="true" />
                            </view>
                        </view>
                        <view style="font-size:12px;color:#B2B2B2;">{{item.createTime?formatterDate(item.createTime):'---'}}</view>
                    </view>
                    <view style="padding-top:10px;">{{item.textareaData}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        consultingModel
    } from '@/models/consulting.js'
    import {dateToString} from "../../util/util";
    const consulting = new consultingModel()
    export default {
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '患者评价'
                },
                evaluateList: []
            }
        },
        onLoad(options){
            this.apiListQuestion(options.doctorId)
        },
        methods: {
            formatterDate(date){
                return dateToString(date,'yyyy-mm-dd')
            },
            isFormatName(name){
                switch (name.length) {
                    case 1:
                        return name;
                    case 2:
                        return name.slice(0,1)+'*';
                    case 3:
                        return name.slice(0,1)+'*'+name.slice(name.length-1,name.length);
                    default:
                        return name.slice(0,1)+'**'+name.slice(name.length-1,name.length);
                }
            },
            apiListQuestion(doctorId) {
                let data = {senderId: doctorId,pageNum: 1,pageSize: 100}
                consulting.listQuestion(data).then(res => {
                    let evaluateList = res.data.list
                    var tempDataList = []
                    res.data.list.forEach((item, index) => {
                        if (this.evaluateList.filter(n => n.questionnaireDataId === item.questionnaireDataId).length === 0) {
                            tempDataList = evaluateList.filter(
                                n => n.questionnaireDataId === item.questionnaireDataId
                            );
                            tempDataList.forEach(item_temp => {
                                if (item_temp.type === '1') {
                                    item['optionContent'] = parseInt(item_temp.optionContent);
                                }
                                if (item_temp.type === '3') {
                                    item['textareaData'] = item_temp.optionContent;
                                }
                            })
                            this.evaluateList.push(item);
                        }
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uni-content-box {
        height: 100vh;
        background-color: #fff;
        padding: 15px 12px;
        font-size: 15px;
    }

    .uni-doctor-line-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .uni-grade-box{
        padding: 10px;
        border-bottom: 1px solid #E5E5E5;
    }

    .uni-grade-box:nth-last-child(1){
        border-bottom: none;
        padding-bottom: none;
    }
</style>
