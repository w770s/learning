<template>
	<view>
		<view class="status-itemBox">
			<view class="search-waybill">
				<view class="search-input">
					<text class="iconfont icon-sousuo"></text>
					<input v-model="inputValue" type="number" placeholder="输入运单编号" />
				</view>
				<view class="search-button" @tap="searchBill">搜索</view>
			</view>
			<view class="border-nomessage" v-if="List.length === 0">暂无数据</view>
			<scroll-view class="status-item" v-if="List.length!==0" scroll-y="true" @scrolltolower="reachToBottom">
				<view v-for="(item,index) in List" :key='index'>
					<cyf-waybill @deleteBill='deleteBill' :list="item" />
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
import cyfWaybill from './components/cyfTheWaybill.vue';
import {CyfModel} from '../../models/cyf.js';
const cyfModel = new CyfModel();
export default {
	components: {
		cyfWaybill
	},
	data() {
		return {
			inputValue: '',
			size: 10,
			total: '',
			List: []
		};
	},
	onShow() {
		this.apiGetList(10);
	},
	methods: {
		apiGetList(size) {
			let data = {
				size: size,
				waybillStatus: '',
				waybillNo: this.inputValue
			};
			cyfModel.apiGetWaybillList(data).then(res => {
				if(res.data.length!==0){
					this.List = res.data.records;
					this.total = res.data.total;
				}
			});
		},
		reachToBottom(){
			if(parseInt(this.total)>this.size){
				this.size += 10
				this.apiGetList(this.size);
			}
			else{
				uni.showToast({
					icon:"none",
					title:"到底了"
				})
			}
		},
		searchBill(){
			this.size = 10
			this.apiGetList(10);
		}
	}
};
</script>

<style lang="scss" scoped>
	@import './css/history'
</style>
