<template>
	<view>
		<view class="choose-content">
			<view class="choose-box">
				<view @tap="selectBar(index)" :class="['choose-same', chooseIndex == index ? 'choose-active' : item.class]" v-for="(item, index) in chooseBar"
				 :key="index">
					{{ item.name }}
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
				noMessage: '暂无数据',
				chooseBar: [{
						name: '待接单',
						class: 'right-noboard'
					},
					{
						name: '已拒绝',
						class: 'left-noboard'
					},
					{
						name: '全部',
						class: 'left-noboard'
					}
				],
				List: []
			};
		},
		onShow() {
			this.chooseIndex = 0;
			this.$refs.loading.open();
			this.apiTask(10, 'ORDER-STATUS-DJD');
		},
		methods: {
			reachToBottom() {
				if (this.total > this.size) {
					this.size += 10
					let status = this.chooseIndex === 0 ? 'ORDER-STATUS-DJD' : this.chooseIndex === 1 ? 'ORDER-STATUS-YJJ' : ''
					this.apiTask(this.size, status);
				} else {
					uni.showToast({
						icon: "none",
						title: "到底了"
					})
				}
			},
			apiTask(size, status) {
				let data = {
					size: size,
					orderStatus: status
				};
				cyfModel.apiGetList(data).then(res => {
					if (res.data.length !== 0) {
						this.List = res.data.records;
						this.total = res.data.total
						this.size = res.data.size
						this.$refs.loading.close();
					}
				});
			},
			addNewBill(id) {
				uni.navigateTo({
					url: 'orderNewBill'
				})
			},
			selectBar(index) {
				this.chooseIndex = index;
				let status = index === 0 ? 'ORDER-STATUS-DJD' : index === 1 ? 'ORDER-STATUS-YJJ' : ''
				this.apiTask(10, status);
				this.$refs.loading.open();
				if (index === 2) {
					this.$set(this.chooseBar[1], 'class', 'right-noboard')
				} else {
					this.$set(this.chooseBar[1], 'class', 'left-noboard')
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/order'
</style>
