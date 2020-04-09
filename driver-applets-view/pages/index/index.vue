<template>
	<view style="position: relative;min-height:100vh;">
		<view class="border-nomessage" v-if="rejected">
			<view class="flex-box">
				<view class="iconfont-box">
					<i class="iconfont">&#xe620;</i>
				</view>
				<view class="no-message">暂无新任务</view>
			</view>
		</view>
		<view class="content" v-if="!rejected">
			<view class="status-itemBox">
				<icon-status v-if="iconComing" :iconStatus="iconStatus"></icon-status>
				<view class="status-item" v-for="(item, index) in list" :key="index">
					<view v-if="item.reservationStatus !== ('PLAN-STATUS-JJRC' || 'PLAN-STATUS-YJJ')">
						<!-- <view class="item-content-masking" v-if="item.reservationStatus === 'PLAN-STATUS-DJD' && onlyOrder" @tap="itemHasDone">
							<text>{{index+1}}</text>
						</view> -->
						<view class="item-number">
							运单编号：{{ item.waybillNo }}
							<img @tap="weixinQrcode(item.waybillNo)" src="../../static/复制图标.png" />
						</view>
						<view class="message-box">
							<view class="message-flex-box">
								<view class="message-image-box">
									<image src="../../static/image/zhuang.png" />
								</view>
								<view class="message-message-box">
									<view class="anchor">{{ item.loadingEnterprise }}</view>
									<view class="anchor">{{ item.loadingAddress }}</view>
								</view>
							</view>
							<view class="message-flex-box">
								<view class="message-image-box">
									<image src="../../static/image/xie.png" />
								</view>
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
								<view class="message-image-box">
									<image class="product-name" src="../../static/image/product.png" />
								</view>
								<view class="anchor">货物：{{ item.productName }}</view>
							</view>
						</view>
						<view class="item-button">
							<button @tap="unloadcargoclick(index, item.waybillNo, item.stevedoreType)" v-if="item.reservationStatus === 'PLAN-STATUS-DXH' || (item.reservationStatus === 'PLAN-STATUS-QRRC' && item.stevedoreType === 1)"
							 class="item-receive" size="mini" plain="true">
								卸货
							</button>
							<button @tap="receive(index, item.stevedoreType)" class="accept-task" size="mini" plain="true" v-if="item.reservationStatus === 'PLAN-STATUS-DJD'">
								接受任务
							</button>
							<button @tap="refuse(index)" class="refuse-task" size="mini" v-if="item.reservationStatus === 'PLAN-STATUS-DJD'"
							 plain="true">
								拒绝任务
							</button>
							<button @tap="arrive(index, item.stevedoreType)" class="item-receive" v-if="
									(item.reservationStatus === 'PLAN-STATUS-YSZ' && item.stevedoreType === 0) ||
									(item.reservationStatus === 'PLAN-STATUS-YSZ' && item.stevedoreType === 1)
								"
							 size="mini" plain="true">
								确认抵达
							</button>
							<button @tap="loadcargoclick(index, item.waybillNo, item.stevedoreType)" v-if="(item.reservationStatus === 'PLAN-STATUS-QRRC' && item.stevedoreType === 0) || item.reservationStatus === 'PLAN-STATUS-DZH'"
							 class="item-receive" size="mini" plain="true">
								装货
							</button>
							<button @tap="orderPark(index)" class="item-receive" size="mini" v-if="
									(item.reservationStatus === 'PLAN-STATUS-DDRC' && item.parkingStatus === '' && cancleRes) ||
										(item.parkingStatus === 'PARKING-STATUS-SHSB' && cancleRes)
								"
							 plain="true">
								预约停车
							</button>
						</view>
						<view class="item-button" v-if="item.parkingStatus === 'PARKING-STATUS-SHCG'">
							<button @tap="cancellation(item.waybillNo)" class="item-receive" size="mini" plain="true">取消预约</button>
						</view>
						<view class="item-button" v-if="item.reservationStatus === 'PLAN-STATUS-TZRC'">
							<button @tap="sureInCome(index)" class="item-receive" size="mini" plain="true">确认入场</button>
							<!-- <button @tap="refuseComing(index)" class="item-receive button-right" size="mini" plain="true">拒绝入场</button> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<popup-layer ref="popupRef" :direction="'top'" v-model="boolShow">
			<view class="main">
				<view class="main-popup">
					<view @tap="popupCancel">取消</view>
					<view @tap="popupOver">完成</view>
				</view>
				<picker-view v-if="visible" class="picker" :value="value" @change="bindChange">
					<picker-view-column>
						<view class="column" v-for="(item, index) in days" :key="index">{{ month }}月{{ item }}日</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column" v-for="(item, index) in hours" :key="index">{{ item }}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column" v-for="(item, index) in minutes" :key="index">{{ item }}分</view>
					</picker-view-column>
				</picker-view>
			</view>
		</popup-layer>
		<view class="qrimg" @tap="hasClick = false" v-show="hasClick">
		</view>
		<view class="qrimgss" v-show="hasClick">
			<tki-qrcode ref="qrcode" :val="val" :size="size" :background="background" :foreground="foreground" :pdground="pdground"
			 :onval="onval" :loadMake="loadMake" @result="qrR" />
		</view>
	</view>
</template>
<script>
	import popupLayer from '@/components/popup-layer/popup-layer.vue';
	import iconStatus from '@/components/iconStatus.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		ClassicModel
	} from '../../models/classic.js';
	const classicModel = new ClassicModel();
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	export default {
		components: {
			tkiQrcode,
			iconStatus,
			popupLayer
		},
		data() {
			return {
				val: '',
				size: 600,
				background: '#000000',
				foreground: '#fff',
				onval: true,
				loadMake: true,
				hasClick: false,

				currentIndex: 0,
				onlyOrder: false,
				itemChooseOne: false,
				rejected: false,
				cancleRes: true,
				comingLoading: false,
				timeStamapCome: false,
				chooseIndex: 0,
				iconStatus: 0,
				iconComing: false,
				carPark: [],
				noMessage: '暂无数据',
				list: [],
				minutes: [],
				minute: '',
				hours: [],
				hour: '',
				months: [],
				month: '',
				year: '',
				days: [],
				day: '',
				value: [],
				visible: false,
				orderclick: true,
				timeStamap: ''
			};
		},
		onShow() {
			this.doFirst();
			this.time();
			this.searchNewVersion();
		},
		onPullDownRefresh() {
			// 下拉刷新
			this.TaskList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},
		computed: mapState(['loading', 'loadHeader', 'waybillSelect']),
		methods: {
			...mapMutations(['loadCargo']),
			qrR(res) {
				console.log(res)
			},
			weixinQrcode(billNo) {
				this.val = billNo
				this.hasClick = true
			},
			searchNewVersion() {
				// 检测是否可以调用getUpdateManager检查更新
				if (!uni.canIUse('getUpdateManager')) return;

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
							uni.showModal({
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
							uni.showModal({
								title: '提示',
								content: '检查到有新版本，但下载失败，请稍后尝试',
								showCancel: false
							});
						});
					}
				});
			},
			time() {
				const date = new Date();
				this.months = [];
				this.year = date.getFullYear();
				this.month = date.getMonth() + 1;
				this.days = [];
				this.day = date.getDate();
				this.hours = [];
				this.hour = date.getHours();
				this.minutes = [];
				this.minute = date.getMinutes();
				this.value = [this.day, this.hour, this.minute];
				if (this.month === 1 || this.month === 3 || this.month === 5 || this.month === 7 || this.month === 8 || this.month ===
					10 || this.month === 12) {
					for (let j = 1; j <= 31; j++) {
						this.days.push(j);
					}
				} else if (this.month === 2) {
					if (this.year % 4 === 0) {
						for (let j = 1; j <= 28; j++) {
							this.days.push(j);
						}
					} else {
						for (let j = 1; j <= 29; j++) {
							this.days.push(j);
						}
					}
				} else {
					for (let j = 1; j <= 30; j++) {
						this.days.push(j);
					}
				}

				for (let i = 1; i <= 24; i++) {
					this.hours.push(i);
				}
				for (let i = 1; i <= 60; i++) {
					this.minutes.push(i);
				}
			},
			bindChange: function(e) {
				// 时间选择
				const val = e.detail.value;
				console.log(val);
				this.day = this.days[val[0]];
				this.hour = this.hours[val[1]];
				this.minute = this.minutes[val[2]];
				this.timeStamap = this.year + '-' + this.month + '-' + this.day + ' ' + this.hour + ':' + this.minute;
				console.log(this.timeStamap);
			},
			itemHasDone() {
				uni.showToast({
					title: '请先完成未完成的任务',
					icon: 'none',
					duration: 2000
				});
			},
			TaskList(reservationStatus, waybillNo, number, clickButton) {
				// 获取任务列表
				const arr = uni.getStorageSync('userPassword');
				let data = {
					driverPhone2: arr[0]
				};
				classicModel.getTask(data).then(res => {
					if (res.code === 666) {
						// token失效返回首页登陆
						uni.showToast({
							title: 'token失效，请重新登陆',
							icon: 'none',
							duration: 2000
						});
						uni.clearStorage();
						uni.navigateTo({
							url: '/pages/login/index'
						});
						return;
					}
					this.list = res.data;
					this.onlyOrder = false;
					this.rejected = false;
					this.list.forEach((item, index) => {
						if (item.reservationStatus !== 'PLAN-STATUS-DJD') {
							this.currentIndex = index;
							this.onlyOrder = true;
						}
					});
					if (this.list.length === 0) {
						// 暂无新任务
						this.rejected = true;
						return;
					}
					if (waybillNo && clickButton) {
						// 装卸按钮
						uni.navigateTo({
							url: `loadAndUnload?status=${clickButton}&id=${number}&bill=${waybillNo}`
						});
					}
					if (this.currentIndex === '') {
						// 未接受任务
						return;
					}
					if (res.data[this.currentIndex].reservationStatus === 'PLAN-STATUS-JJRC') {
						// 拒绝任务
						this.iconComing = false;
						uni.removeStorageSync('loading');
					}
					if (res.data[this.currentIndex].reservationStatus === 'PLAN-STATUS-DJC') {
						// 待进场
						this.iconStatus = 0;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].reservationStatus === 'PLAN-STATUS-DZH' || res.data[this.currentIndex].reservationStatus ===
						'PLAN-STATUS-DXH') {
						// 装卸货
						this.iconStatus = 1;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].reservationStatus === 'PLAN-STATUS-DDRC' && res.data[this.currentIndex].parkingStatus ===
						'') {
						this.iconComing = true;
						this.iconStatus = 2;
					}
					if (res.data[this.currentIndex].parkingStatus === 'PARKING-STATUS-SHSB') {
						// 审核失败
						this.iconStatus = 8;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].parkingStatus === 'PARKING-STATUS-SHZ') {
						// 审核成功
						this.cancleRes = false;
						this.iconStatus = 3;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].parkingStatus === 'PARKING-STATUS-SHCG') {
						// 审核成功
						this.iconStatus = 4;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].parkingStatus === 'PARKING-STATUS-QXCG') {
						// 取消成功
						this.iconStatus = 6;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].parkingStatus === 'PARKING-STATUS-QXSB') {
						// 取消失败
						this.iconStatus = 7;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].parkingStatus === 'PARKING-STATUS-QXYY') {
						this.iconComing = true;
						this.iconStatus = 5;
					}
					if (res.data[this.currentIndex].reservationStatus === 'PLAN-STATUS-TZRC') {
						// buff 通知入场
						this.iconStatus = 9;
						this.iconComing = true;
					}
					if (res.data[this.currentIndex].reservationStatus === 'PLAN-STATUS-QRRC') {
						console.log(this.currentIndex)
						if (res.data[this.currentIndex].stevedoreType === 0) {
							this._changeStatus(this.currentIndex, 'PLAN-STATUS-DZH');
						} else if (res.data[this.currentIndex].stevedoreType === 1) {
							this._changeStatus(this.currentIndex, 'PLAN-STATUS-DXH');
						}
						this.iconStatus = 1;
						this.iconComing = true;
					}

				});
			},
			_changeStatus(index, reservationStatus, waybillNo, number, clickButton) {
				// 修改调度状态
				var data = {
					id: this.list[index].id,
					reservationStatus: reservationStatus
				};
				if (reservationStatus === 'PARKING-STATUS-QXYY') {
					var data = {
						id: this.list[index].id,
						parkingStatus: reservationStatus
					};
				}
				classicModel.changeStatus(data).then(res => {
					if (res.code !== 1) {
						uni.showToast({
							title: '任务失败,请重新操作',
							icon: 'none',
							duration: 2000
						});
						return;
					}
					this.TaskList(reservationStatus, waybillNo, number, clickButton);
				});
			},
			doFirst() {
				const loading = uni.getStorageSync('loading');
				if (loading === '已卸货') {
					// 流程走完 返回初始值
					this.TaskList();
					this.comingLoading = false;
					this.iconComing = false;
					this.onlyOrder = false;
					uni.removeStorageSync('loading');
					return;
				}
				this.iconComing = false;
				this.TaskList(); // 默认
			},
			sureInCome(index) {
				// 确定进场
				this._changeStatus(index, 'PLAN-STATUS-QRRC');
				if (this.list[index].stevedoreType === 0) {
					// 进园装货
					this.comingLoading = false;
				} else {
					// 进园卸货
					this.comingLoading = true;
				}
			},
			receive(index, status) {
				// 接收任务
				this.currentIndex = index;
				if (status === 0) {
					// 进园装货 -> 确认抵达装货
					this._changeStatus(index, 'PLAN-STATUS-YSZ');
					this.iconComing = false;
				} else {
					// 进园卸货
					this._changeStatus(index, 'PLAN-STATUS-DZH');
				}
			},
			arrive(index, stevedoreType) {
				// 确认抵达
				this._changeStatus(index, 'PLAN-STATUS-DJC');
			},
			loadcargoclick(index, waybillNo, number) {
				//装货
				this._changeStatus(index, 'PLAN-STATUS-DZH', waybillNo, number, '装货');
			},
			unloadcargoclick(index, waybillNo, number) {
				//卸货
				this._changeStatus(index, 'PLAN-STATUS-DXH', waybillNo, number, '卸货');
			},
			orderPark(index) {
				// 预约停车
				this.currentIndex = index;
				this.iconComing = true;
				this.visible = true;
				this.$refs.popupRef.show(); // 弹出
			},
			popupCancel() {
				// 时间底部弹出框 取消
				this._changeStatus(this.currentIndex, 'PLAN-STATUS-DDRC');
				this.$refs.popupRef.close();
			},
			_reservedPark(index, time) {
				// 预约停车
				let data = {
					id: this.list[index].id,
					time: time
				};
				classicModel.reservedPark(data).then(res => {
					if (res.code === -1) {
						uni.showToast({
							title: '任务失败,请重新操作',
							icon: 'none',
							duration: 2000
						});
					} else if (res.code === 1) {
						uni.showToast({
							title: res.data,
							icon: 'none',
							duration: 2000
						});
						this.TaskList(); // shz
					}
					// 停车场审核
				});
			},
			popupOver() {
				// 时间底部弹出框 完成
				if (this.timeStamap == '') {
					this.timeStamap = this.year + '-' + this.month + '-' + this.value[0] + ' ' + this.value[1] + ':' + this.value[2];
				}
				this._reservedPark(this.currentIndex, this.timeStamap);
				this.$refs.popupRef.close(); // 关闭
				// 审核成功
				// this.iconStatus = 3;
				// this.iconComing = true;
			},
			cancleOrder(waybillNo) {
				classicModel.orderDelete(waybillNo).then(res => {
					if (res.code === -1) {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						});
					} else if (res.code === 1) {
						uni.showToast({
							title: '取消成功',
							icon: 'none',
							duration: 2000
						});
						this.iconStatus = 6; // 预约审核
						this.TaskList();
					}
				});
			},
			cancellation(waybillNo) {
				// 取消预约
				let that = this;
				uni.showModal({
					title: '取消预约',
					content: '确定取消预约吗',
					success: function(res) {
						if (res.confirm) {
							that.cancleOrder(waybillNo);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			refuse(index) {
				// 拒绝任务
				this._changeStatus(index, 'PLAN-STATUS-YJJ');
			},
			refuseComing(index) {
				// 拒绝(入场)任务
				this._changeStatus(index, 'PLAN-STATUS-JJRC');
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/index';
</style>
