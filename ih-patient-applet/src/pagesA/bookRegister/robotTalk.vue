<template>
    <view>
        <u-bar :nav="setNav"/>
        <!--         空盒子用来防止消息过少时 拉起键盘会遮盖消息 -->
        <!--        <view :animation="anData"  style="height:0;">-->
        <!--        </view>-->
        <view style="font-size: 26rpx;">
            <!-- 消息体 -->
            <scroll-view :scroll-with-animation="true" scroll-y="true"
                         style="width: 750rpx;" :style="{'height':srcollHeight}" :scroll-top="go">
                <!-- 用来获取消息体高度 -->
                <view id="okk" :scroll-with-animation="true">
                    <!-- 消息 -->
                    <view  class="flex-column-start" v-for="(x,i) in msgList" :key="i">

                        <!-- 用户消息 头像可选加入-->
                        <view v-if="x.my" class="uni-patient-box">
                            <img class="chat-img margin-left" :src="defaultIcon" mode="aspectFill" />
                            <view style="display: flex;align-items: center;">
                                <view class="uni-patient-message">
                                    <text style="word-break: break-all;">{{x.msg}}</text>
                                </view>
                            </view>
                        </view>
                        <!-- 机器人消息 -->
                        <view v-if="!x.my" class="flex-row-start margin-left margin-top one-show" >
                            <view class="chat-img flex-row-center">
                                <img style="height: 100rpx;width: 100rpx;" src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png" mode="aspectFit"/>
                            </view>
                            <view class="flex" style="max-width: 500rpx;">
                                <view class="margin-left padding-chat flex-column-start" style="border-radius: 10rpx;background-color: #fff;">
                                    <!--                                    <text style="word-break: break-all;" >{{x.msg}}</text>-->
                                    <rich-text :nodes="x.msg"></rich-text>
                                    <view v-if="x.questionList.length>0" style="height:1px;background-color: #D8D8D8;margin:20rpx 0px;"></view>
                                    <!-- 消息模板 =>多个答案 -->
                                    <!--                                    <view class="flex-column-start" v-if="x.type==2" style="color: #2884FF;">-->
                                    <!--                                        &lt;!&ndash; 连接服务器应该用item.id &ndash;&gt;-->
                                    <!--                                        <text @click="answer(index)" style="margin-bottom: 24rpx;"-->
                                    <!--                                              v-for="(item,index) in x.questionList" :key="index" >{{item}}</text>-->
                                    <!--                                    </view>-->
                                    <!-- 消息模板 =>初次问候 -->
                                    <view class="flex-column-start" style="color: #2884FF;">
                                        <view @click="answer(item.id,item)" style="height:60rpx;line-height: 60rpx;"
                                              v-for="(item,index) in x.questionList" :key="index" >{{item.title}}</view>
                                        <button class="uni-more-detail" @tap="forMore(x,i)" v-if="x.type==1">
                                            以上都没有
                                        </button>
                                    </view>
                                    <!-- 消息模板 => 去挂号-->
                                    <view class="flex-column-start" v-if="x.type==0">
                                        <button class="uni-reserve-box" @tap="goForRegister(x.departId,x.departName,x)">预约挂号</button>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <!-- loading是显示 -->
                    <view v-show="msgLoad" class="flex-row-start margin-left margin-top">
                        <view class="chat-img flex-row-center">
                            <img style="height:100rpx;width: 100rpx;" src="http://file.aihuihc.com/patient/patientImages/images/consulting/defaultDoctor.png" mode="aspectFit"/>
                        </view>
                        <view class="flex" style="max-width: 500rpx;">
                            <img style="height:100rpx;width: 100rpx;" src="http://file.aihuihc.com/patient/patientImages/images/loading.gif" mode="aspectFit"/>
                        </view>
                    </view>
                    <!-- 防止消息底部被遮 -->
                    <view style="height: 120rpx;">

                    </view>
                </view>

            </scroll-view>

            <!-- 底部导航栏 -->
            <view class="flex-column-center" :style="{bottom:inputBottom+'px'}">
                <view class="bottom-dh-char flex-row-around">
                    <input
                        v-model="msg"
                        class="dh-input"
                        type="text"
                        :adjust-position="false"
                        @confirm="sendMsg"
                        confirm-type="send"
                        placeholder="请输入您要发送的内容…"
                        @focus="focusTextarea"
                        @blur="blurTextarea"
                    />
                    <button @click="sendMsg" class="uni-send-message">
                        发送
                    </button>
                </view>
            </view>

        </view>

    </view>
</template>

<script>
    import {consultingModel} from "../../models/consulting.js";
    const consulting = new consultingModel()
    // rpx和px的比率
    let l = 0
    // 可用窗口高度
    let wh = 0
    // 顶部空盒子的高度
    let mgUpHeight = 0
    export default {
        onLoad(){
            let gender = uni.getStorageSync('userInfo').gender
            this.defaultIcon = gender === 1 ? 'http://file.aihuihc.com/patient/patientImages/images/consulting/defaultMan.png' : 'http://file.aihuihc.com/patient/patientImages/images/consulting/defaultWoman.png'
            // 如果需要缓存消息缓存msgList即可
            // 监听键盘拉起
            // 因为无法控制键盘拉起的速度,所以这里尽量以慢速处理
            uni.onKeyboardHeightChange(res => {
                const query = uni.createSelectorQuery()
                query.select('#okk').boundingClientRect(data => {
                    // 若消息体没有超过2倍的键盘则向下移动差值,防止遮住消息体
                    let up=res.height*2-data.height-l*110
                    if(up>0){
                        // 动态改变空盒子高度
                        this.msgMove(up,300)
                        // 记录改变的值,若不收回键盘且发送了消息用来防止消息过多被遮盖
                        mgUpHeight=up
                    }
                    // 收回
                    if(res.height==0){
                        this.msgMove(0,0)
                    }
                }).exec();
            })
            let query=uni.getSystemInfoSync()

            l=query.screenWidth/750
            wh=query.windowHeight
            this.srcollHeight=query.windowHeight+"px"
        },
        data() {
            return {
                setNav: {
                    'isdisPlayNavTitle': true,
                    'navTitle': '智能导诊'
                },
                defaultIcon: '',
                msgData: {},
                msgDataDetail:{},
                msgLoad:false,
                anData:{},
                showTow:false,
                // 消息体,定义机器人初次的消息(或者自定义出现时机)
                // my->谁发的消息 msg->消息文本 type->客服消息模板类型 questionList->快速获取问题答案的问题列表
                msgList:[{my:false,msg:"hi～请描述您的症状"}],
                msg:"",
                go:0,
                inputBottom: 0,
                srcollHeight:0
            }
        },
        methods: {
            focusTextarea(e) {
                this.inputBottom = e.detail.height;
            },
            blurTextarea(e) {
                this.inputBottom = 0;
                uni.hideKeyboard()
            },
            apiCommunityResourceList(data,msg){
                this.msgLoad = true
                consulting.communityResourceList(data).then((res)=>{
                    this.msgData = res.data
                    this.msgLoad=false
                    if(res.data.list.length===0){
                        this.msgList.push({my:false,msg:"小螺不太能理解呢"})
                    }
                    else{
                        this.msgList.push({my:false,msg:"您是想问以下问题吗？",type:1,questionList:res.data.list,tipMsg:msg})
                    }
                    this.msgGo()
                }).catch((err)=>{
                    this.msgLoad=false
                    this.msgList.push({my:false,msg:"小螺不太能理解呢"})
                    console.log(err);
                })
            },
            apiCommunityResourceDetail(data){
                this.msgLoad = true
                consulting.communityResourceDetail(data).then((res)=>{
                    this.msgDataDetail = res.data
                    if(res.data.content && res.data.departId && res.data.departName){
                        this.msgLoad = false
                        this.msgList.push({my:false,msg:res.data.content+`<br><br>建议你挂号[${res.data.departName}]`,type:0,departId:res.data.departId,departName:res.data.departName})
                        // this.msgGo()
                    }
                    else{
                        this.msgLoad=false
                        this.msgList.push({my:false,msg:"暂无相应说明呢"})
                    }
                }).catch((err)=>{
                    this.msgLoad=false
                    this.msgList.push({my:false,msg:"暂无相应说明呢"})
                    console.log(err);
                })
            },
            forMore(item,index){
                this.msg = ''
                this.msgList[index].type = 2
                let countPage = JSON.parse(JSON.stringify(this.msgData.pageNum))
                let pageNum = this.msgData.pageNum<this.msgData.totalPage?countPage++:1
                console.log(this.msgData.pageNum, this.msgData.totalPage, pageNum)
                const data = {
                    searchContent: item.tipMsg,
                    pageNum: this.msgData.pageNum<this.msgData.totalPage?countPage++:1,
                    pageSize: 5
                }
                this.apiCommunityResourceList(data,item.tipMsg)
            },
            goForRegister(id,name,x){
                uni.navigateTo({
                    url: `./doctorFilter?departId=${id}&name=${name}`,
                })
            },
            // 移动顶部的空盒子
            msgMove(x,t){
                let animation = uni.createAnimation({
                    duration: t,
                    timingFunction: 'linear',
                })

                this.animation = animation

                animation.height(x/2).step()

                this.anData = animation.export()
            },
            // 保持消息体可见
            msgGo(){
                const query = uni.createSelectorQuery()
                // 延时100ms保证是最新的高度
                setTimeout(()=>{
                    // 获取消息体高度
                    query.select('#okk').boundingClientRect(data => {
                        // 如果超过scorll高度就滚动scorll
                        if(data.height-wh>0){
                            this.go=data.height-wh
                        }
                        // 保证键盘第一次拉起时消息体能保持可见
                        let moveY=(wh-data.height)/2
                        // 超出页面则缩回空盒子
                        if(moveY-mgUpHeight<0){
                            // 小于0则视为0
                            if(moveY<0){
                                this.msgMove(0,200)
                            }else{
                                // 否则缩回盒子对应的高度
                                this.msgMove(moveY,200)
                            }
                        }
                    }).exec();
                },100)
            },
            // 回答问题的业务逻辑
            answer(id,item){
                this.msg = ''
                this.msgList.push({"msg":item.title,"my":true})
                this.msgGo()
                this.apiCommunityResourceDetail({id})
            },
            sendMsg(){
                this.inputBottom = 0;
                uni.hideKeyboard()
                let msgBrother = JSON.parse(JSON.stringify(this.msg))
                // 消息为空不做任何操作
                if(msgBrother==""){
                    return 0;
                }
                this.msg=""
                // 显示消息 msg消息文本,my鉴别是谁发的消息(不能用俩个消息数组循环,否则消息不会穿插)
                this.msgList.push({"msg":msgBrother,"my":true})
                // 保证消息可见
                this.msgGo()
                // 回答问题
                this.msgKf(msgBrother)
            },
            msgKf(msg){
                const data = {
                    searchContent: msg,
                    pageNum: 1,
                    pageSize: 5
                }
                this.apiCommunityResourceList(data,msg)
            }
        }
    }
</script>

<style>
    /* 转圈动画 */
    .turn-load{
        animation:turnmy 1s linear infinite;
    }
    @keyframes turnmy{
        0%{-webkit-transform:rotate(0deg);}
        25%{-webkit-transform:rotate(90deg);}
        50%{-webkit-transform:rotate(180deg);}
        75%{-webkit-transform:rotate(270deg);}
        100%{-webkit-transform:rotate(360deg);}
    }
    .one-show{
        animation: oneshow 0.8s ease 1;
    }
    @keyframes oneshow{
        from{opacity: 0;}
        to{opacity: 1;}
    }

    .flex-column-center{
        display: flex;
        position: fixed;
        transition: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .flex-column-start{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .uni-more-detail{
        width:200rpx;
        height:60rpx;
        background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
        border-radius:6rpx;
        line-height: 60rpx;
        color:#fff;
        font-size: 26rpx;
        margin-left: 0rpx;
    }

    .uni-reserve-box{
        width:100%;
        height:70rpx;
        background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
        border-radius:8rpx;
        line-height: 70rpx;
        color:#fff;
        margin-top:30rpx;
    }

    .uni-patient-box{
        display: flex;
        flex-direction: row-reverse;
        padding: 10px;
    }
    .uni-patient-message{
        max-width: 400rpx;
        background:rgba(40,132,255,1);
        border-radius: 10rpx;
        padding:17rpx 20rpx;
        color:#fff;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .flex-row-start{
        display: flex;
        flex-direction: row;
    }
    .flex-row-around{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .flex-row-center{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .margin-top{
        margin-top: 20rpx;
    }

    .margin-left{
        margin-left: 20rpx;
    }
    .bottom-dh-char{
        background-color: #fff;
        width: 750rpx;
        height: 110rpx;
    }

    .dh-input{
        width: 540rpx;
        height: 70rpx;
        border-radius: 10rpx;
        padding-left: 15rpx;
        background-color: #FFFFFF;
        margin-left: 24rpx;
        border:2rpx solid #E7E7E7;
    }

    .chat-img{
        border-radius: 50%;
        width: 100rpx;
        height: 100rpx;
        background-color: #f7f7f7;
    }

    .padding-chat{
        padding: 17rpx 20rpx;
    }

    .cu-modal.drawer-modal.justify-end .cu-dialog {
        transform: translateX(100%);
    }
    .uni-send-message{
        width:136rpx;
        height:60rpx;
        color: #fff;
        background:linear-gradient(90deg,rgba(94,166,248,1) 0%,rgba(59,124,244,1) 100%);
        border-radius: 6rpx;
        font-size: 26rpx;
    }

</style>
