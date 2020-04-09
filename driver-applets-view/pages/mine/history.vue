<template>
	<view>
		<view class="uni-input" @tap='toggleTab'>
			<text class="uni-date">日期</text>
			<text class="iconfont icon-xiangzuo icon-left"></text>
			{{ resultInfo }}
			<text class="iconfont icon-xiangyou icon-right"></text>
		</view>
		<w-picker
			mode="date" 
			startYear="2019" 
			endYear="2030"
			:defaultVal="[0,1,3]" 
			:current="true" 
			@confirm="onConfirm" 
			ref="date" 
			themeColor="#f00"
		></w-picker>
		<view class="border-nomessage" v-if="list.length===0">
			<view class="flex-box">
				<view class="iconfont-box">
					<i class="iconfont">&#xe620;</i>
				</view>
				<view class="no-message">暂无新任务</view>
			</view>
		</view>
		<view class="status-itemBox">
			<view class="status-item" v-for="(item, index) in list" :key="index">
				<view class="item-number">
					运单编号：{{ item.waybillNo }}
					<img src="../../static/复制图标.png" />
				</view>
				<view class="message-box">
					<view class="message-flex-box">
						<view class="message-image-box"><image src="../../static/image/zhuang.png" /></view>
						<view class="message-message-box">
							<view class="anchor">{{ item.loadingEnterprise }}</view>
							<view class="anchor">{{ item.loadingAddress }}</view>
						</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box"><image src="../../static/image/xie.png" /></view>
						<view class="message-message-box">
							<view class="anchor">{{ item.unloadingEnterprise }}</view>
							<view class="anchor">{{ item.unloadingAddress }}</view>
						</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box"><text class="iconfont reserve-laodtime icon-lishijilu" /></view>
						<view class="anchor">预约装货时间：{{ item.reservationLoadingDate }} &nbsp;{{ item.loadingPeriod }}</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box"><text class="iconfont reserve-unlaodtime icon-lishijilu" /></view>
						<view class="anchor">预约卸货时间：{{ item.reservationUnloadingDate }} &nbsp;{{ item.unloadingPeriod }}</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box"><image class="product-name" src="../../static/image/product.png" /></view>
						<view class="anchor">货物：{{ item.productName }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import wPicker from "@/components/w-picker/w-picker.vue";
import { ClassicModel } from '../../models/classic.js';
const classicModel = new ClassicModel();
export default {
	data() {
		return {
			list: [],
			resultInfo: '12121'
		}
	},
	components:{
		wPicker
	},
	onShow() {
		this.formatDate()
		this.TaskList();
	},
	methods: {
		toggleTab(){
			this.$refs['date'].show();
		},
		onConfirm(val){
			this.resultInfo = val.result;
			this.TaskList();
		},
		formatDate(){
			const date = new Date()
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			this.resultInfo = y + '-' + m + '-' + d;
		},
		TaskList() {
			const phoneNum = uni.getStorageSync('userPassword')[0];
			let data = {
				updateTime: this.resultInfo,
				driverPhone2: phoneNum,
				reservationStatus: 'PLAN-STATUS-OK'
			};
			classicModel.getTask(data).then(res => {
				this.list = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import './css/history';
</style>
