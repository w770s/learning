<template>
	<view class="personal">
		<u-topBar :nav="setNav" />
		<view class="personal-box">
			<view class="personalInformation">
				<view class="uni-content-box">
					<view class="doctorDetails-details doctorDetails-detailsImage-box" @click="chooseImage">
						<view class="doctorDetails-detailsTitle doctorDetails-detailsImage">头像</view>
						<view v-model="doctorDetails.portrait" class="doctorDetails-detailsText doctorDetails-details-box">
							<image :src="userUrl" mode=""></image>
							<view class="doctorIntroduce-titleText"><img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png"></img></view>
						</view>
					</view>
					<view class="doctorDetails-details">
						<view class="doctorDetails-detailsTitle">姓名</view>
						<input disabled=false v-model="doctorDetails.name" class="doctorDetails-detailsText"/>
					</view>
					<view class="doctorDetails-details">
						<view class="doctorDetails-detailsTitle">职称</view>
						<input disabled=false v-model="doctorDetails.level" class="doctorDetails-detailsText"/>
					</view>
					<view class="doctorDetails-details">
						<view class="doctorDetails-detailsTitle">科室</view>
						<input disabled=false v-model="doctorDetails.departName" class="doctorDetails-detailsTextButtom"/>
					</view>
				</view>
			</view>
			<view :class="['uni-button-next',next?'uni-button-color':'uni-button-disabled']">确定修改</view>
		</view>
	</view>
</template>

<script>
import { personalModel } from '@/models/personalInformation.js'
const OBSupload = require('../../obs/OBSUploadFile.js');
const personal = new personalModel()
let app = getApp()
import store from '../../store/index.js'
const state = store.state.user
export default {
	data() {
		return {
			setNav: {
				'isdisPlayNavTitle': true,
				'navTitle': '个人信息'
			},
			doctorDetails: {},
			url: [],
			userUrl: '',
			disabledMale: true,
			disabledFamale: true,
			next: false
		}
	},
	onLoad(options) {
		//此处接收传递过来的参数wx.navigateTo跳转时传递的参数   doctorDetails
			this.doctorDetails = JSON.parse(options.doctorDetails)
	},
	onShow() {
		this.url = this.doctorDetails.doctorImageList.filter(item => {
				return item.imageType == 1
		})
		if(this.url.length != 0){
			this.userUrl = this.url[0].url
		}
	},
	methods:{
		chooseImage() {
			let that = this;
		    uni.showActionSheet({
		        itemList: ['从相册选择'],
		        success: function (e) {
		            uni.chooseImage({
		                count: 1, // 默认9
		                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		                sourceType: ['camera', 'album'], // 可以指定来源是相机
		                success: function (res) {
		                    const tempFilePaths = res.tempFilePaths;
		                    OBSupload(tempFilePaths[0]);
							// wx.setStorageSync('url',obj)
							setTimeout(function(){
								if(wx.getStorageSync('url')){
									console.log(2)
									const file = wx.getStorageSync('fileName')
									const changUrl = 'http://file.aihuihc.com/'+file
									that.userUrl = changUrl
									that.next = true
									if(that.next){
										var imageId  = ''
										if(that.url.length>0){
											imageId = that.url[0].id
										}else{
											imageId  = ''
										}
										const data = {
											imageId,
											relatedId: that.doctorDetails.hisDoctorId ,
											hospitalId: that.doctorDetails.hospitalId,
											sourceType: 10,
											imageType: 1,
											url: that.userUrl
										}
										personal.addImage(data).then(res=>{
											wx.navigateBack({
											delta: 1
											})
										}).catch(err=>{

										})
									}else{
										return
									}
									app.globalData.nim.updateMyInfo({
										avatar: changUrl
									})
									// 更新本地数据
									store.dispatch({
										type: 'UserInfo_Update_Avatar',
										payload: changUrl
									})
								}
							}, 3000);
		                }
		            })
		        }
		    })
		}
	}
}
</script>

<style lang="scss" scoped>
.personal {
	height: 100vh;
	background: #F6F6F6;
}
.personal-box {
	height: 30px;
	background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
}
.personalInformation{
	margin: 0 12px 0 12px;
	background: #FFFFFF;
	position: relative;
	z-index: 1;
	border-radius: 10px;
}
.uni-content-box {
		height: 225px;
		background-color: #FFFFFF;
		border-radius: 10px;
	}
.doctorDetails-details {
		height: 50px;
		display: flex;
	}
.doctorDetails-detailsImage-box {
	height: 75px;
}

	.doctorDetails-detailsTitle {
		width: 95px;
		line-height: 50px;
		padding-left: 15px;
		color: #333333;
	}
	.doctorDetails-detailsImage {
		line-height: 75px;
	}
	.doctorIntroduce-titleText{
		font-size: 14px;
		color: #3E3E3E;
		img{
			width: 9.9px;
			height: 20px;
		}
	}

	.doctorDetails-detailsText {
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 15px;
		color: #333333;
		border-bottom: 1upx solid #E5E5E5;
		padding-right: 10px;
		image{
			width: 45px;
			height: 45px;
			line-height: 75px;
			vertical-align: middle;
		}
		view {
			border-radius: 3px;
			text-align: center;
		}

	}
	.doctorDetails-details-box {
		height: 75px;
		line-height: 75px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		image {
			border-radius: 50%;
		}
	}
	.doctorDetails-detailsTextButtom{
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 15px;
		color: #333333;
		padding-right: 10px;
	}

	.uni-button-next {
		height: 47px;
		color: #FFFFFF;
		margin: 50px 12px 0 12px;
		line-height: 47px;
		text-align: center;
		font-size: 18px;
		color: #fff;
		border-radius: 5px;
	}

	.uni-button-disabled {
		background: rgba(40, 132, 255, 0.2);
	}

	.uni-button-color {
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
	}

</style>
