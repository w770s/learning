<template>
	<view class="content">
		<picker @change="bindPickerChange" :value="index" :range="pickerList">
			<view class="uni-input">
				<text class="uni-date">日期</text>
				<text class="iconfont icon-xiangzuo icon-left"></text>
				{{ pickerListLine[index] }}
				<text class="iconfont icon-xiangyou icon-right"></text>
			</view>
		</picker>
		<view class="uni-material-box">
			<view class="uni-material" v-bind:id="item.productName" @tap="choosematerial(item.productName, item.handlingId, index)" v-for="(item, inde) in mesList" :key="inde">
				<view class="material-name">
					<view>{{ item.productName }}</view>
					<view class="material-name-num">可预约车辆: {{ item.vehicleVolume }}</view>
				</view>
				<view class="material-Car">
					<view class="material-Car-num">{{ item.bookedVehicle }}</view>
					<view class="material-Car-done">已预约车辆</view>
				</view>
			</view>
		</view>
		<footerNav />
	</view>
</template>

<script>
import footerNav from '../../components/footer_nav.vue';
import {ClassicModel} from '../../models/classic.js';
const classicModel = new ClassicModel();
export default {
	components:{
		footerNav
	},
	data() {
		return {
			index: 0,
			pickerList: [],
			mesList: [],
			pickerListLine: []
		};
	},
	onShow() {
		this.getSevenDay();
		this.searchNewVersion();
	},
	methods: {
		doFirst() {
			const data = {
				time: this.pickerListLine[this.index]
			}
			classicModel.list(data).then(res => {
				this.mesList = res.data;
			});
		},
		searchNewVersion(){
			// 检测是否可以调用getUpdateManager检查更新
			if (!wx.canIUse('getUpdateManager')) return;
			
			let updateManager = wx.getUpdateManager();
			// 获取全局唯一的版本更新管理器，用于管理小程序更新
			updateManager.onCheckForUpdate(function(res) {
				// 监听向微信后台请求检查更新结果事件
				console.log('是否有新版本：' + res.hasUpdate);
				if (res.hasUpdate) {
					//如果有新版本
					// 小程序有新版本，会主动触发下载操作
					updateManager.onUpdateReady(function() {
						//当新版本下载完成，会进行回调
						wx.showModal({
							title: '更新提示',
							content: '新版本已经准备好，单击确定重启小程序',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启小程序
									updateManager.applyUpdate();
								}
							}
						});
					});
					// 小程序有新版本，会主动触发下载操作（无需开发者触发）
					updateManager.onUpdateFailed(function() {
						//当新版本下载失败，会进行回调
						wx.showModal({
							title: '提示',
							content: '检查到有新版本，但下载失败，请稍后尝试',
							showCancel: false
						});
					});
				}
			});
		},
		getSevenDay() {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
				this.timeSelect(day, month, 31, year);
			} else if (month === 2) {
				if (year % 4 === 0) {
					this.timeSelect(day, month, 28, year);
				} else {
					this.timeSelect(day, month, 29, year);
				}
			} else {
				this.timeSelect(day, month, 30, year);
			}
			this.doFirst();
		},
		timeSelect(day, month, num, year) {
			let days = [];
			let dayss = [];
			if (day + 7 <= num) {
				for (let j = day; j < day + 7; j++) {
					days.push(month + '月' + j + '日');
					if (month < 10) {
						if (j < 10) {
							dayss.push(year + '-' + 0 + '' + month + '-' + 0 + '' + j);
						} else {
							dayss.push(year + '-' + 0 + '' + month + '-' + j);
						}
					} else {
						if (j < 10) {
							dayss.push(year + '-' + month + '-' + 0 + '' + j);
						} else {
							dayss.push(year + '-' + month + '-' + j);
						}
					}
				}
			} else {
				let number = 0;
				for (let j = day; j <= num; j++) {
					number++;
					if (j <= num) {
						if (month <= 10) {
							dayss.push(year + '-' + 0 + '' + month + '-' + j);
						} else {
							dayss.push(year + '-' + month + '-' + j);
						}
						days.push(month + '月' + j + '日');
					}
					if (j == num) {
						for (let j = 1; j < 7 - number; j++) {
							let theYear = month + 1 === 13 ? year + 1 : year;
							if (month + 1 < 10) {
								dayss.push(year + '-' + 0 + '' + (month + 1) + '-' + 0 + '' + j);
							} else {
								dayss.push(theYear + '-' + (month + 1 === 13 ? '0' + '1' : month + 1) + '-' + 0 + '' + j);
							}
							days.push((month + 1 === 13 ? 1 : month + 1) + '月' + j + '日');
						}
					}
				}
			}
			this.pickerList = days;
			this.pickerListLine = dayss;
		},
		bindPickerChange(e) {
			this.index = e.target.value;
			this.doFirst();
		},
		choosematerial(product, id, index) {
			let clearday = this.pickerListLine[index];
			uni.navigateTo({
				url: `plan?product=${product}&id=${id}&clearday=${clearday}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import './css/index'
</style>
