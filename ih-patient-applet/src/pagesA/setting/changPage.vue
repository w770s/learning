<template>
	<view>
		<u-bar :nav="setNav" />
		<view style="padding:12px;">
			<view class="uni-change-box">
				<view style="width: 100px;">昵称</view>
				<view style="width: 100%;">
					<input style="padding-right:20px;" @input="replaceInput" v-model="nickName" placeholder="请输入新昵称" />
				</view>
			</view>
			<view class="uni-chang-box">
				<view class="uni-login-out" @tap="sureChange">确认修改</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		settingModel
	} from '@/models/setting.js'
	const setting = new settingModel()
	export default {
		data() {
			return {
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '修改昵称',
				},
				userId: '',
				nickName: '',
				needMes:{}
			}
		},
		onLoad(options){
			this.userId = uni.getStorageSync('userInfo').userId
			this.needMes = uni.getStorageSync('userInfo')
			this.nickName = options.nickName
		},
		methods: {
			apiUpdateUserInfo(data) {
				setting.updateUserInfo(data).then(res => {
					uni.setStorageSync('userInfo',this.needMes)
					uni.navigateBack()
				}).catch((err) => {
					console.log(err);
				})
			},
			sureChange(){
				const data = {
					userId: this.userId,
					nickName: this.nickName,
					avatarUrl: this.needMes.logo
				}
				this.needMes.nickname = this.nickName
				this.apiUpdateUserInfo(data)
			},
			replaceInput(e){
				this.changeValue =  e.target.value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-change-box{
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		font-size: 15px;
		padding: 15px;
		border-radius: 8px;
	}

	.uni-chang-box {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 50px;
	}

	.uni-login-out {
		width: 320px;
		height: 47px;
		background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		border-radius: 8px;
		line-height: 47px;
		text-align: center;
		color: #fff;
	}
</style>
