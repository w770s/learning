<template>
	<view class="content">
		<view class="personal-box">
			<image :src="bgbanner" />
			<view class="personal-flex">
				<view class="personal-img"><img :src="userIcon" alt="" /></view>
				<view class="personal-mes">
					<text>{{ enterpriseName }}</text>
				</view>
			</view>
		</view>
		<view class="personal-over-box">
			<view class="personal-over" v-for="(item,index) in chooseList" :key="index" @tap="overDone">
				<view class="personal-all-item">
					<text v-if="item==='已完成任务'" class="iconfont iconSize">&#xe787;</text>
					<text v-if="item==='我的订单'" class="iconfont iconSize">&#xe628;</text>
					<text v-if="item==='系统设置'" class="iconfont iconSize">&#xe62c;</text>
					<text class='item-name'>{{item}}</text>
				</view>
				<text class="iconfont icon-dayuhao icon-right"></text>
			</view>
		</view>
		<view class="personal-exit" @tap="backToLogin">退出</view>
		<footerNav />
	</view>
</template>

<script>
import footerNav from '../../components/footer_nav.vue';
import {ClassicModel} from '../../models/classic.js';
import icHeader from '../../static/image/ic_header.png';
import banner from './images/bg.png';
const classicModel = new ClassicModel();
	export default {
		components:{
			footerNav
		},
		data() {
			return {
				title: 'Hello',
				userIcon: '',
				enterpriseName: '',
				bgbanner: '',
				chooseList: [
					'已完成任务',
					'我的订单',
					'系统设置'
				]
			};
		},
		onLoad() {
			this.getUser();
		},
		methods: {
			backToLogin() {
				uni.clearStorage();
				uni.reLaunch({
					url: '/pages/login'
				});
			},
			getUser() {
				this.bgbanner = banner;
				classicModel.user().then(res => {
					this.enterpriseName = res.data.userInfo.enterpriseName;
					if (res.data.userInfo.userIcon) {
						this.userIcon = 'http://api.asoco.com.cn' + res.data.userInfo.userIcon;
					} else {
						this.userIcon = icHeader;
					}
				});
			},
			overDone() {
				uni.navigateTo({
					url: 'history'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
@import './css/mine'
</style>
