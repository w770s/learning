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
					<wtf-waybill @deleteBill='deleteBill' :list="item" />
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
import wtfWaybill from './components/wtfTheWaybill.vue';
import {WtfModel} from '../../models/wtf.js';
const wtfModel = new WtfModel();
export default {
	components: {
		wtfWaybill
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
				waybillNo: this.inputValue
			};
			wtfModel.apiGetWaybillListRelevant(data).then(res => {
				this.List = res.data.records;
				this.total = res.data.total;
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
		deleteBill(id){
			const data = {
				orderHeaderId: id
			}
			wtfModel.apiDeleteBill(data).then((res)=>{
				if(res.code!==-1){
					uni.showToast({
						title: '删除成功',
						icon: 'none',
						duration: 2000,
					})
				}
				this.apiGetList(10);
			}).catch(res=>console.log(res))
		},
		searchBill(){
			this.apiGetList(10);
		}
	}
};
</script>

<style lang="scss" scoped>
	@import './css/history'
</style>
