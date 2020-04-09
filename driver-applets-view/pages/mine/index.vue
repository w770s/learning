<template>
	<view class="content">
		<view class="personal-box">
			<image src="../../static/image/bg.png" />
			<view class="personal-flex">
				<view class="personal-img">
					<open-data type="userAvatarUrl" class="userAvatar"></open-data>
				</view>
				<view class="personal-mes">
					<open-data type="userNickName"></open-data>
				</view>
			</view>
		</view>
		<view class="personal-over-box">
			<view class="personal-over" v-for="(item,index) in chooseList" :key="index" @tap="overDone(item)">
				<view class="personal-all-item">
					<image v-if="item==='已完成任务'" src="../../static/image/carbill.png" class="iconSize-img"/>
					<image v-if="item==='我的订单'" src="../../static/image/bill.png" class="iconSize-img"/>
					<image v-if="item==='系统设置'" src="../../static/image/groop.png" class="iconSize-img"/>
					<text class='item-name'>{{item}}</text>
				</view>
				<text class="iconfont icon-dayuhao icon-right"></text>
			</view>
		</view>
		<view class="personal-exit" @tap="backToLogin">退出登录</view>
	</view>
</template>

<script>
import { ClassicModel } from '../../models/classic.js';
const classicModel = new ClassicModel();
export default {
	data() {
		return {
			title: 'Hello',
			userIcon: '',
			account: '',
			nickName: '',
			avatarUrl: '',
			chooseList: [
				'已完成任务',
				'我的订单',
				'系统设置'
			]
		};
	},
	methods: {
		backToLogin(){
			uni.clearStorage();
			uni.reLaunch({
				url: '../login/index'
			});
		},
		overDone(item) {
			if(item==='已完成任务'){
				uni.navigateTo({
					url: 'history'
				});
			}
			else{
				uni.showToast({
					title: `--${item}--功能正在加紧规划开发中,请大家敬请期待`,
					icon: 'none'
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import './css/index';
</style>
