<template>
	<view>
		<scroll-view class="scrollView" v-if="List.length>0" scroll-y="true" @scrolltolower="reachToBottom">
			<view class="uni-mes-item" v-for="(item,index) in List" :key="index">
				 <view class='uni-mes-index'>{{index+1}}</view>
				 <view class="materials-mes">
					<view class="material-flex">
						模板名称：
						<view class="material-item">{{ item.draftName}}</view>
					</view>
					<view class="material-flex">
						运输企业：
						<view class="material-item">{{ item.carrierEnterpriseName}}</view>
					</view>
					<view class="material-flex">
						货物：
						<view class="material-item">{{ item.productName}}</view>
					</view>
					<view class="material-flex">
						重量：
						<view class="material-item">{{ item.weightShow }}吨</view>
					</view>
				 </view>
				  <view class="choose-template">
					  <button @tap="chooseTemplate(item.id)">选择</button>
				  </view>
			</view>
		</scroll-view>
		<view class="uni-without-mes" v-if="List.length===0">暂无模版数据</view>
	</view>
</template>

<script>
import {WtfModel} from '../../models/wtf.js';
const wtfModel = new WtfModel();
export default {
	data() {
		return {
			List: [],
			size: 10,
			total: 0
		};
	},
	onShow(){
		this.apiGetTemplate()
	},
	methods: {
		reachToBottom(){
			if(this.total>this.size){
				let size = this.size + 10
				const data = {
					size: size
				}
				this.apiGetTemplate(data)
			}
			uni.showToast({
				icon:"none",
				title: '到底了'
			})
		},
		chooseTemplate(id){
			uni.navigateTo({
				url:`orderNewBill?id=${id}&useWay=使用模版`
			})
		},
		apiGetTemplate(data) {
			wtfModel.apiWaybillTemplatePage(data).then((res) => {
				this.List = res.data.records;
				this.total = res.data.total
				this.size = res.data.size
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	@import './css/orderTemplate'
</style>
