<template>
	<view style="position: relative;min-height:100vh;">
		<u-bar :nav="setNav" :goLoginPage="true" />
		<u-prompt :visible.sync="promptVisible" :closeName='closeName' :confirmName='confirmName' :cancelShow="false" :title="val" @confirm="clickPromptConfirm">
			<view style="height: 96px;width: 100%;padding:10px;box-sizing: border-box;">
				<u-barcode cid="code128" :loadMake="false" :val="healthNo" :opations="opations" format="code128" ref="code128" />
			</view>
		</u-prompt>
		<!-- 健康卡列表 -->
		<view class="uni-content-box">
			<view v-for="(item, index) in personData" :key="index" class="flex-item" @tap="goUserCard(item)">
				<view style="display: flex;justify-content: space-between; height: 80px;">
					<view class="uni-title uni-common-mt" style="font-size: 18px;margin-left: 3%;">
						<p style="font-size: 18px; margin-top: 20px;">{{ item.name }}</p>
						<p style="font-size: 15px; color: #B2B2B2;">
							{{item.gender===0?'男':'女'}}
							<text style="font-size: 15px; margin-left: 15px;">{{ item.age }}岁</text>
						</p>
					</view>
					<view class="uni-imggroup-box" style="position:relative;" @tap.prevent.stop="weixinQrcode(item)">
						<img class="uni-imggroup-qrcode" src='http://file.aihuihc.com/patient/patientImages/images/login/qrcode.png'>
						<img class="uni-imggroup-back" src='http://file.aihuihc.com/patient/patientImages/images/login/cardBack.png'>
					</view>
				</view>
				<view style="font-size: 15px; color: #B2B2B2; height: 40px;position:relative;" @tap="switchChange(index,item)" @tap.prevent.stop="">
					<switch style="transform:scale(0.7,0.7);position:absolute;z-index:1;left: 0px;top:6px;" color="#3B7CF4" :checked="index===whichIndex" :disabled="index===whichIndex"  />
					<text style="transform:scale(0.7,0.7);position:absolute;z-index:2;height:60px;width: 55px; left: 0px;top:6px;" ></text>
					<text style="line-height: 40px;margin-left: 55px;">默认健康卡</text>
				</view>
			</view>

			<!-- 添加健康卡 -->
			<view class="flex-item" @click="addCard" v-if="personData.length<5">
				<!-- 此处为添加按钮 -->
				<view style="height: 70px;">
					<img style="width: 34px;height: 34px; display: block; margin: 0 auto; padding-top: 20px;" src="http://file.aihuizhongyi.com/ih-applet/addPatient.png"></img>
				</view>
				<view style="font-size: 18px; text-align: center;">添加健康卡({{5-personData.length}}张)</view>
				<view style="font-size: 12px; text-align: center; color: #B2B2B2;">添加健康卡使用健康管家服务</view>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {createIMClient} from "../../util/util";
	import {
		healthyCardModel
	} from '@/models/healthyCard.js'
	const healthyCard = new healthyCardModel()
	export default {
		data() {
			return {
				val: '',
				healthNo: '',
				size: 600,
				background: '#000000',
				foreground: '#fff',
				onval: true,
				loadMake: true,
				promptVisible: false,
				closeName: '再想想',
				confirmName: '确认',
				userId: '',
				personData:[],
				whichIndex: 0,
				opations: {
					format: "CODE128",//选择要使用的条形码类型 微信支持的条码类型有 code128\code39\ena13\ean8\upc\itf14\
					width: 80,//设置条之间的宽度
					displayValue: false,//是否在条形码下方显示文字
					height: 150,
					fontSize: 100,
					textAlign: "left",//设置文本的水平对齐方式
					textPosition: "bottom",//设置文本的垂直位置
					textMargin: 0,//设置条形码和文本之间的间距
					background: "#FFFFFF",//设置条形码的背景色
					margin: 0,//设置条形码周围的空白边距
				},
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '健康服务'
				},
				img: 'http://file.aihuihc.com/patient/patientImages/images/addPatient.png'
			};
		},
		onShow() {
			this.userId = uni.getStorageSync('userInfo').userId
			const whichIndex = uni.getStorageSync('whichIndex')
			if(whichIndex){
				this.whichIndex = whichIndex
			}
			this.apiListHealthCard(this.userId)
		},
		methods: {
			restoreIM(account,token){ // todo
				createIMClient(account)
				uni.setStorageSync('whichIndex', this.whichIndex)
			},
			switchChange(index, item) {
				if(index!==this.whichIndex){
					const that = this
					wx.showModal({
						title: '提示',
						cancelText: '再想想',
						content: `需要添加${item.name}为默认健康卡吗？`,
						success(res) {
							if (res.confirm) {
								that.whichIndex = index
								that.restoreIM(item.accId,item.token)
							} else if (res.cancel) {
								console.log(that.whichIndex);
								// 用户点击取消
							}
						}
					});
				}
			},
			weixinQrcode(item) {
				this.$refs['code128']._makeCode()
				this.val = item.name
				this.healthNo = item.healthCardNo
				this.promptVisible = true
			},
			clickPromptConfirm() {
				this.promptVisible = false
			},
			apiListHealthCard(userId) {
				healthyCard.listHealthCard({userId}).then(res => {
					let cacheData = uni.getStorageSync('loginPage')
					if(cacheData){
						this.personData = cacheData
					}
					uni.setStorageSync('loginPage',JSON.parse(JSON.stringify(res.data.healthCardList)))
					this.personData = []
					res.data.healthCardList.forEach((item,index) => {
						if(item){
							this.personData.push({
								healthCardNo: item.healthCardNo,
								name: item.name,
								gender: item.gender,
								birthday: item.birthday,
								cardId: item.cardId,
								age: item.age,
								accId: item.accId,
								token: item.token
							})
						}
					})
				}).catch((err) => {
					console.log(err);
				})
			},
			goUserCard(item) {
				console.log(item);
				wx.navigateTo({
					url: './userCard?healthCardNo=' + item.healthCardNo,
				})
			},
			addCard() {
				wx.navigateTo({
					url: './addCard',
				})
			}
		},
	};
</script>

<style scoped lang="scss">
	.uni-content-box{
		padding: 10px 12px;
	}

	.flex-item {
		margin: 0 auto;
		margin-bottom: 10px;
		height: 135px;
		border-radius: 8px;
		background-color: white;
	}

	.uni-imggroup-box {
		position: relative;
		height: 60px;
		width: 60px;
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.uni-imggroup-qrcode {
			height: 34px;
			width: 34px;
			position: relative;
			z-index: 1;
			left: -15px;
			top: 15px;
		}

		.uni-imggroup-back {
			position: absolute;
			right: 0px;
			top: 0px;
			width: 110px;
			height: 117px;
		}

	}
</style>
