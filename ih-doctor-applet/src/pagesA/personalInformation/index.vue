<template>
	<view class="personal">
		<u-topBar :nav="setNav" />
		<view class="personal-box">
		<view class="doctorTag" @tap="goUpdate">
			<view class="doctorTag-box">
				<img class="uni-avatar-icon" :src="userUrl" mode="" />
				<view class="doctorTag-tagBox">
					<view class="doctorTag-name">{{doctorDetails.name}}</view>
					<view class="doctorTag-tag">
						<view>{{doctorDetails.level}}</view>
						<view class="doctorTag-tagName">{{doctorDetails.departName }}</view>
					</view>
				</view>
			</view>
			<img class="uni-arrow-icon" src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png"></img>
		</view>

		<view class="doctorIntroduce">
			<view class="doctorIntroduce-box" @click="goGoodSpecialty">
				<view class="doctorIntroduce-headerBox">
					<view class="doctorIntroduce-title">擅长描述</view>
					<view class="doctorIntroduce-titleText"><img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png"></img></view>
				</view>
				<view class="doctorIntroduce-footerBox">{{doctorDetails.specialty ==null?'':doctorDetails.specialty}}</view>
			</view>

			<view class="doctorIntroduce-box" @click="goGoodDiseaseTag">
				<view class="doctorIntroduce-headerBox">
					<view class="doctorIntroduce-title">擅长疾病标签</view>
					<view class="doctorIntroduce-titleText"><img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png"></img></view>
				</view>
				<view class="doctorIntroduce-footerBox">
					<view class="diseaseTags">
						<button class="diseaseTag" v-for="(item,index) in doctorDetails.doctorDiseaseList " :key="index">{{item.name}}</button>
					</view>
				</view>
			</view>

			<view class="doctorIntroduce-box" @click="goDescription">
				<view class="doctorIntroduce-headerBox">
					<view class="doctorIntroduce-title">个人简介</view>
					<view class="doctorIntroduce-titleText"><img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png"></img></view>
				</view>
				<view class="doctorIntroduce-footerBox">{{doctorDetails.description ==null?'':doctorDetails.description}}</view>
			</view>
			<view class="doctorIntroduce-box" @click="goWelcome">
				<view class="doctorIntroduce-headerBox">
					<view class="doctorIntroduce-title">欢迎语</view>
					<view class="doctorIntroduce-titleText"><img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/next.png"></img></view>
				</view>
				<view class="doctorIntroduce-footerBox">{{doctorDetails.welcome ==null?'':doctorDetails.welcome}}</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
import { personalModel } from '@/models/personalInformation.js'
const personal = new personalModel()
export default {
	data() {
		return {
			setNav: {
				'isdisPlayNavTitle': true,
				'navTitle': '个人信息'
			},
			title: 'Hello',
			doctorDetails: {},
			userUrl: ''
		}
	},
	onShow() {
		this.getSelectDoctor()
	},
	methods: {
		// 获取医生个人信息
		getSelectDoctor(){
			let that = this
			var doctorId = wx.getStorageSync('doctorId')
			const data = {
				doctorId
			}
			personal.selectDoctor(data).then(res=>{
				that.doctorDetails = res.data
				var url = that.doctorDetails.doctorImageList.filter(item => {
					return item.imageType == 1
				})
				if(url.length != 0){
					that.userUrl = url[0].url
				}
			}).catch(err => {
			})
		},
		goUpdate(){
			wx.navigateTo({
				url: './upDatePersonalInformation?doctorDetails=' + JSON.stringify(this.doctorDetails)
			})
		},
		goGoodSpecialty(){
			if(this.doctorDetails.specialty == null){
				this.doctorDetails.specialty = ''
			}
			wx.navigateTo({
				url: './goodSpecialty?specialty=' + this.doctorDetails.specialty
			})
		},
		goGoodDiseaseTag(){
			wx.navigateTo({
				url: './goodDiseaseTag?doctorDiseaseList=' + JSON.stringify(this.doctorDetails.doctorDiseaseList)
			})
		},
		goDescription(){
			if(this.doctorDetails.description == null){
				this.doctorDetails.description = ''
			}
			wx.navigateTo({
				url: './personalDescription?description=' + this.doctorDetails.description
			})
		},
		goWelcome(){
			if(this.doctorDetails.welcome == null){
				this.doctorDetails.welcome = ''
			}
			wx.navigateTo({
				url: './welcome?welcome=' + this.doctorDetails.welcome
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.personal {
	height: 100%;
	background: #FFFFFF;
}
.personal-box {
	height: 30px;
	background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
}
	.doctorTag {
		height: 75px;
		margin: 0 12px 0 12px;
		background: #FFFFFF;
		position: relative;
		z-index: 1;
		border-radius: 10px;
		box-shadow: 0rpx 0rpx 20rpx 4rpx #3B7CF415;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.doctorTag-box{
			display: flex;
			.doctorTag-tagBox{
				margin: 0 10px 0 10px;
			}
		}
		.uni-avatar-icon{
			width: 45px;
			height: 45px;
			border-radius: 50%;
			margin-left: 10px;
		}
		.doctorTag{
			color: #3E3E3E;
			font-size: 15px;
			font-weight: 600;
		}
		.doctorTag-tag{
			display: flex;
			color: #333333;
			font-size: 12px;
			.doctorTag-tagName{
				margin-left: 10px;
			}
		}
		.uni-arrow-icon{
			width: 9.9px;
			height: 20px;
			margin-right: 10px;
		}
	}
	.doctorIntroduce{
		.doctorIntroduce-box{
			margin: 15px 12px 0 12px;
			background: #FFFFFF;
			border-radius: 10px;
			box-shadow: 0rpx 8rpx 12rpx 4rpx #3B7CF415;
			.doctorIntroduce-headerBox{
				padding: 20px 10px 10px 10px;
				display: flex;
				justify-content: space-between;
				line-height: 26px;
				.doctorIntroduce-title{
					font-size: 20px;
					font-weight: 600;
					color: #3E3E3E;
				}
				.doctorIntroduce-titleText{
					font-size: 14px;
					color: #3E3E3E;
					img{
						width: 9.9px;
						height: 20px;
						margin-left: 15px;
					}
				}
			}
			.doctorIntroduce-footerBox{
				color: #333333;
				font-size: 15px;
				margin: 0 12px 0 12px;
				padding: 0 0 20px 0;
				.diseaseTags{
					.diseaseTag{
						display: inline-block;
						height: 30px;
						margin: 0 15px 10px 0;
						border-radius: 5px;
						font-size: 12px;
						background: rgba(40, 132, 255, 0.6);
						color: rgba(255, 255, 255, 1);
					}
					button::after {
					  border: none;
					}
				}
			}
		}
	}
</style>
