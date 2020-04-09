<template>
	<view>
		<view class="choose-content">
			<view class="choose-box">
				<view @tap="selectBar(index)" :class="['choose-same', chooseIndex == index ? 'choose-active' : '']" v-for="(item, index) in chooseBar"
				 :key="index">
					{{item}}
				</view>
			</view>
		</view>
		<view class="content">
			<view class="border-nomessage" v-if="List.length === 0">暂无数据</view>
			<view v-if="List.length!==0">
				<scroll-view class="scrollView" scroll-y="true" @scrolltolower="reachToBottom">
					<view v-for="(item,index) in List" :key="index">
						<cyfWaybill :list="item" />
					</view>
				</scroll-view>
			</view>
		</view>
		<w-loading text="加载中.." mask="true" click="true" ref="loading" />
		<footerNav />
	</view>
</template>
<script>
	import wLoading from '@/components//w-loading.vue'
	import footerNav from '../../components/footer_nav.vue';
	import cyfWaybill from './components/cyfTheWaybill.vue';
	import {
		CyfModel
	} from '../../models/cyf.js';
	const cyfModel = new CyfModel();
	export default {
		components: {
			wLoading,
			footerNav,
			cyfWaybill
		},
		data() {
			return {
				chooseIndex: 0,
				size: 10,
				total: 0,
				status: 'WAYBILL-STATUS-DPC',
				noMessage: '暂无数据',
				chooseBar: ['待派车', '待装货', '待卸货', '待签收', '异常'],
				List: []
			};
		},
		onShow() {
			this.chooseIndex = 0;
			this.$refs.loading.open();
			this.apiTask(10, 'WAYBILL-STATUS-DPC', 0);
		},
		methods: {
			reachToBottom() {
				if (this.total > this.size) {
					this.size += 10
					let abnormalNum = this.chooseIndex === 4 ? 1 : 0
					if (this.chooseIndex === 0) {
						this.status = 'WAYBILL-STATUS-DPC'
					}
					if (this.chooseIndex === 1) {
						this.status = 'WAYBILL-STATUS-DZH'
					}
					if (this.chooseIndex === 2) {
						this.status = 'WAYBILL-STATUS-DXH'
					}
					if (this.chooseIndex === 3) {
						this.status = 'WAYBILL-STATUS-DQS'
					}
					if (this.chooseIndex === 4) {
						this.status = ''
					}
					this.apiTask(this.size, this.status, abnormalNum);
				} else {
					uni.showToast({
						icon: "none",
						title: "到底了"
					})
				}
			},
			apiTask(size, status, abnormalNum) {
				let data = {
					size: size,
					waybillStatus: status
				};
				if(abnormalNum===1){
					data['isException'] = 1
				}
				cyfModel.apiGetWaybillList(data).then(res => {
					if (res.data.length !== 0) {
						this.List = res.data.records;
						this.total = res.data.total;
						this.size = res.data.size;
						this.$refs.loading.close();
					}
				});
			},
			deleteBill(id) {
				const data = {
					orderHeaderId: id
				}
				wtfModel.apiDeleteBill(data).then((res) => {
					if (res.code !== -1) {
						uni.showToast({
							title: '删除成功',
							icon: 'none',
							duration: 2000,
						})
					}
					this.selectBar(this.chooseIndex)
				}).catch(res => console.log(res))
			},
			selectBar(index) {
				this.chooseIndex = index;
				let abnormalNum = this.chooseIndex === 4 ? 1 : 0
				if (this.chooseIndex === 0) {
					this.status = 'WAYBILL-STATUS-DPC'
				}
				if (this.chooseIndex === 1) {
					this.status = 'WAYBILL-STATUS-DZH'
				}
				if (this.chooseIndex === 2) {
					this.status = 'WAYBILL-STATUS-DXH'
				}
				if (this.chooseIndex === 3) {
					this.status = 'WAYBILL-STATUS-DQS'
				}
				if (this.chooseIndex === 4) {
					this.status = ''
				}
				this.$refs.loading.open();
				this.apiTask(this.size, this.status, abnormalNum);
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/waybill'
</style>
