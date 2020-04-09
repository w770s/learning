<template>
	<view class="banner-gray-color">
		<view class="content">
			<view class="status-item">
				<view class="item-number">
					运单编号：{{ list.waybillNo }}
					<img src="../../static/复制图标.png" />
				</view>
				<view class="message-box">
					<view class="message-flex-box">
						<view class="message-image-box">
							<image src="../../static/image/zhuang.png" />
						</view>
						<view class="message-message-box">
							<view class="anchor">{{ list.loadingEnterprise }}</view>
							<view class="anchor">{{ list.loadingAddress }}</view>
						</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box">
							<image src="../../static/image/xie.png" />
						</view>
						<view class="message-message-box">
							<view class="anchor">{{ list.unloadingEnterprise }}</view>
							<view class="anchor">{{ list.unloadingAddress }}</view>
						</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box"><text class="iconfont reserve-laodtime icon-lishijilu" /></view>
						<view class="anchor">预约装货时间：{{ list.reservationLoadingDate }} &nbsp;{{ list.loadingPeriod }}</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box"><text class="iconfont reserve-unlaodtime icon-lishijilu" /></view>
						<view class="anchor">预约卸货时间：{{ list.reservationUnloadingDate }} &nbsp;{{ list.unloadingPeriod }}</view>
					</view>
					<view class="message-flex-box">
						<view class="message-image-box">
							<image class="product-name" src="../../static/image/product.png" />
						</view>
						<view class="anchor">货物：{{ list.productName }}</view>
					</view>
				</view>
			</view>
			<view class="actual-loading" v-if="unloading">{{ title === '装货' ? '实际卸货吨位: ' : '实际装货吨位: ' }}{{ list.loadingWeight }}吨</view>
			<view class="content-img" v-if="unloading">
				<view>装货凭证：</view>
				<view class="content-img-flex"><img class="content-img-item fullImgs" :src="Imglists" /></view>
			</view>
			<view class="actual-number">
				<text>{{ title === '装货' ? '实际装货吨位: ' : '实际卸货吨位: ' }}</text>
				<view class="uni-needMath">
					<view class="uni-needMath-box" @tap="minusNum"><img src="../../static/减法-01.png" /></view>
					<view class="uni-needMath-wBox"><input type="text" class="uni-input-num" @change="handleInput" v-model="tonValue" /></view>
					<view class="uni-needMath-box" @tap="addNum"><img src="../../static/加法.png" /></view>
					<view class="uni-choose-quickly" @tap="chooseQuickly" v-if="selectList.length!==0"><button>快速选择</button></view>
				</view>
			</view>
			<view class="content-img">
				<view>{{ title === '装货' ? '装货凭证: ' : '卸货凭证: ' }}</view>
				<view class="content-img-flex">
					<view v-if="Imglist !== ''" class="content-img-item fullImgs">
						<img :src="Imglist" class="big-one-pic" />
						<text @click="imgClear" class="iconfont icon-shanchu"></text>
					</view>
					<view v-if="Imglist === ''" class="content-img-item fullImg" @tap="dosome"><img class="all-the-same" :src="Imgcamera" /></view>
				</view>
			</view>
			<view class="content-button">
				<button @tap="loadingSure(title === '装货')">{{ title === '装货' ? '确认装货' : '确认卸货' }}</button>
			</view>
		</view>
		<w-picker
		 v-if="selectList.length!==0"
		 mode="selector"
		 :defaultVal="[10]"
		 @confirm="selectListConfirm"
		 ref="selector"
		 themeColor="#f00"
		 :selectList="selectList">
		</w-picker>
		<w-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import wLoading from '@/components/w-loading.vue'
	import wPicker from '@/components/w-picker/w-picker.vue';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import {
		ClassicModel
	} from '../../models/classic.js';
	import {
		config
	} from '../../config.js';
	const classicModel = new ClassicModel();
	export default {
		data() {
			return {
				selectList: [],
				tonValue: 1,
				iconStatus: 0,
				iconComing: false,
				unloading: false,
				title: '',
				Imgcamera: require('../../static/相机.png'),
				Imglist: '',
				Imglists: '',
				imgPart: '',
				list: {}
			};
		},
		components: {
			wPicker,
			wLoading
		},
		computed: mapState(['loading', 'waybillSelect']),
		onLoad(e) {
			this.$refs.loading.open();
			this.title = e.status;
			this.number = e.id; // 0 进园装货 1进园卸货
			// this.wayBillNo = e.bill // wayBillNo
			this.WayBill(e.bill);
			if (this.title == '卸货') {
				// 卸货按钮进来
				this.unloading = true;
			} else if (e.id) {
				// 装货按钮进来
				if (e.id == 1) {
					// 进园卸货的装货
					this.iconComing = true;
					this.iconStatus = 10;
				}
			}
			uni.setNavigationBarTitle({
				title: this.title
			});
		},
		methods: {
			...mapMutations(['loadCargo']),
			...mapActions(['ShowBillNum']),
			handleInput(e) {
				var price = '' + this.tonValue;
				price = price
					.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
					.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
					.replace('.', '$#$')
					.replace(/\./g, '')
					.replace('$#$', '.')
					.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
				if (price.indexOf('.') < 0 && price != '') {
					// 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
					price = parseFloat(price);
				}
				this.tonValue = price;
			},
			chooseQuickly() {
				this.$refs['selector'].show();
			},
			selectListConfirm(val) {
				this.tonValue = val.result
			},
			addNum() {
				//数字加一
				if (this.tonValue > 39) {
					uni.showToast({
						title: '40吨以下货物吨位',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				this.tonValue++;
			},
			minusNum() {
				//数字减一
				if (this.tonValue <= 0) {
					uni.showToast({
						title: '请输入0吨以上',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				this.tonValue--;
			},
			WayBill(waybillNo) {
				// 查询运单详情
				classicModel.waybillNo(waybillNo).then(res => {
					this.list = res.data;
					this.tonValue = res.data.weightShow;
					if (this.tonValue > 0.1) {
						let original = this.tonValue
						let minus = this.tonValue - 0.1
						let addition = this.tonValue + 0.1
						for (minus; minus < original; minus += 0.01) {
							const obj = {
								label: parseFloat(minus).toFixed(2),
								value: parseFloat(minus).toFixed(2)
							}
							this.selectList.push(obj)
							this.selectList.splice(10, 1)
						}
						for (original; original < addition; original += 0.01) {
							const obj = {
								label: parseFloat(original).toFixed(2),
								value: parseFloat(original).toFixed(2)
							}
							this.selectList.push(obj)
						}
					}
					if (this.unloading) {
						this.Imglists = config.imgBaseUrl + res.data.loadingVoucher; // 装货凭证
					}
					this.$refs.loading.close();
				});
			},
			changeBill(isLoading, params) {
				// 修改运单
				let data = '';
				if (isLoading) {
					data = {
						loadingVoucher: params.loadingVoucher,
						loadingWeight: params.loadingWeight,
						waybillNo: params.waybillNo,
						waybillStatus: params.waybillStatus
					};
				} else {
					data = {
						unloadingVoucher: params.unloadingVoucher,
						unloadingWeight: params.unloadingWeight,
						loadingWeight: this.list.loadingWeight,
						waybillNo: params.waybillNo,
						waybillStatus: params.waybillStatus
					};
				}
				classicModel.updateWaybill(data).then(res => {
					uni.switchTab({
						url: 'index'
					});
					this.iconComing = false;
				});
			},
			loadingSure(title) {
				if (this.tonValue <= 0 || this.tonValue > 40) {
					uni.showToast({
						title: '请输入0吨以上,40吨以下货物吨位',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (this.imgPart == '') {
					uni.showToast({
						title: '请添加必要信息凭证照片哦！',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				let params = {
					loadingVoucher: this.imgPart,
					loadingWeight: this.tonValue,
					unloadingVoucher: this.imgPart,
					unloadingWeight: this.tonValue,
					waybillNo: this.list.waybillNo,
					waybillStatus: ''
				};
				if (title && this.number === '0') {
					// 下一步 待卸货
					params.waybillStatus = 'WAYBILL-STATUS-DXH';
					this.changeBill(title, params);
				} else if (title && this.number === '1') {
					// 接收任务是为 进园卸货 先装货 下一步 待卸货
					params.waybillStatus = 'WAYBILL-STATUS-DXH';
					this.changeBill(title, params);
				} else {
					// 确认卸货 任务完成
					params.waybillStatus = 'WAYBILL-STATUS-DQS';
					this.changeBill(title, params); // 直接代签收
					uni.setStorageSync('loading', '已卸货');
				}
			},
			imgClear(index) {
				// 特定图片的删除
				this.Imglist = '';
			},
			dosome() {
				let that = this;
				uni.showActionSheet({
					itemList: ['拍摄', '从相册选择'],
					success: function(e) {
						if (e.tapIndex === 0) {
							// 拍摄
							uni.chooseImage({
								count: 1, // 默认9
								sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
								sourceType: ['camera'], // 可以指定来源是相机
								success: function(res) {
									const filePath = res.tempFilePaths[0];
									// 上传图片
									uni.uploadFile({
										url: config.api_base_url + '/zd-system/file/upload',
										filePath: filePath,
										name: 'file',
										success: res => {
											that.imgPart = JSON.parse(res.data).data;
											let Imgurl = config.imgBaseUrl + JSON.parse(res.data).data;
											that.Imglist = Imgurl;
										}
									});
								}
							});
						} else if (e.tapIndex === 1) {
							// 从相册选择
							uni.chooseImage({
								count: 1, // 默认9
								sizeType: ['original', 'compressed'],
								sourceType: ['album'], // 可以指定来源是相册
								success: function(res) {
									const filePath = res.tempFilePaths[0];
									// 上传图片
									uni.uploadFile({
										url: config.api_base_url + '/zd-system/file/upload',
										filePath: filePath,
										name: 'file',
										success: res => {
											that.imgPart = JSON.parse(res.data).data;
											let Imgurl = config.imgBaseUrl + JSON.parse(res.data).data;
											that.Imglist = Imgurl;
										}
									});
								}
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/loadAndUnload';
</style>
