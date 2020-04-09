<template>
	<view class="content">
		<view class="personal-box">
			<view class="personal-flex">
				<view class="personal-flex">
					<view class="personal-img"><img :src="userIcon" alt="" /></view>
					<view class="personal-mes">
						<view>{{ enterpriseName }}</view>
						<view>ID: {{ enterpriseId }}</view>
					</view>
				</view>
			</view>
			<view class="white-series-box">
				<view class="serices-item" v-for="(item,index) in billList" :key="index">
					<view class="serices-status">{{item.name}}</view>
					<view class="serices-number">{{item.value}}</view>
				</view>
			</view>
		</view>

		<view class="personal-over-box">
			<view class="personal-over" v-for="(item,index) in chooseList" :key="index" @tap="overDone">
				<view class="personal-all-item">
					<text v-if="item==='我的运单'" class="iconfont iconSize">&#xe787;</text>
					<text v-if="item==='我的订单'" class="iconfont iconSize">&#xe628;</text>
					<text v-if="item==='系统设置'" class="iconfont iconSize">&#xe62c;</text>
					<text v-if="item==='关于我们'" class="iconfont iconSize">&#xe60c;</text>
					<text class='item-name'>{{item}}</text>
				</view>
				<text class="iconfont icon-dayuhao icon-right"></text>
			</view>
		</view>
		<view class="personal-exit" @tap="backToLogin">退出登陆</view>
		<footerNav />
	</view>
</template>

<script>
	import footerNav from '../../components/footer_nav.vue';
	import {
		ClassicModel
	} from '../../models/classic.js';
	import icHeader from '../../static/image/ic_header.png';
	const classicModel = new ClassicModel();
	import {
		WtfModel
	} from '../../models/wtf.js';
	const wtfModel = new WtfModel();
	export default {
		components: {
			footerNav
		},
		data() {
			return {
				title: 'Hello',
				userIcon: '',
				enterpriseId: '',
				enterpriseName: '',
				account: '',
				nickName: '',
				avatarUrl: '',
				chooseList: [
					'我的运单',
					'我的订单',
					'系统设置',
					'关于我们'
				],
				billList: [{
						name: '待接单',
						value: '200'
					},
					{
						name: '待派车',
						value: '300'
					},
					{
						name: '待对账',
						value: '400'
					},
					{
						name: '本月运单',
						value: '500'
					}
				]
			};
		},
		onLoad() {
			this.getUser()
		},
		methods: {
			getUser() {
				classicModel.user().then(res => {
					this.enterpriseName = res.data.userInfo.enterpriseName;
					this.enterpriseId = res.data.userInfo.enterpriseCode;
					if (res.data.userInfo.userIcon) {
						this.userIcon = 'http://api.asoco.com.cn' + res.data.userInfo.userIcon;
					} else {
						this.userIcon = icHeader;
					}
				});
				wtfModel.apiHomePageStatistic().then(res => {
					if (res.data.hasOwnProperty('status_djd')) { // cyf
						this.billList = []
						this.billList[0] = {
							name: '待接单',
							value: parseInt(res.data['status_djd'])
						}
						this.billList[1] = {
							name: '待派车',
							value: parseInt(res.data['status_dpc'])
						}
						this.billList[2] = {
							name: '待对账',
							value: parseInt(res.data['status_ddz'])
						}
						this.billList[3] = {
							name: '本月运单',
							value: parseInt(res.data['waybill_month'])
						}
					}
				})
			},
			backToLogin() {
				uni.clearStorage();
				uni.reLaunch({
					url: '/pages/login'
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
