<template>
	<view class="personal">
		<u-topBar :nav="setNav" />
		<view class="personal-box">
			<text class="phone-title">手机号码</text>
			<text class="phone">{{phone}}</text>
		</view>
		<view class="tips">如果需要修改登录手机号请联系客服</view>
		<button class="gooutBtn" @click="accountSetting">退出登录</button>
	</view>
</template>

<script>
import store from "../../store";

export default {
	data() {
		return {
			setNav: {
				isdisPlayNavTitle: true,
				navTitle: '账号设置'
			},
			phone: ''
		};
	},
	onShow() {
		this.phone = wx.getStorageSync('phone')
		this.phone = this.phone.substr(0,3)+ '****' +this.phone.substr(7)
	},
	methods: {
		accountSetting() {
			wx.showModal({
				title: '提示',
				content: '确定退出吗？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success(res) {
					if (res.confirm) {
						uni.clearStorage();
						wx.switchTab({
							url: '/pages/home/index'
						});
					} else {
					}
				},
				fail(err) {}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.personal {
	height: 100vh; background: #F6F6F6;
}
.personal-box {
	height: 50px;
	margin: 15px 12px 0 12px;
	background-color: #ffffff;
	color: #333333;
	font-size: 15px;
	line-height: 50px;
	border-radius: 10px;
	.phone-title {
		margin-left: 15px;
	}
	.phone {
		margin-left: 19px;
	}
}
.tips {
	color: #b2b2b2;
	font-size: 12px;
	margin: 8px 0 0 12px;
}
.gooutBtn {
	margin: 50px 27px 0 28px;
	color: #ffffff;
	background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
}
</style>
