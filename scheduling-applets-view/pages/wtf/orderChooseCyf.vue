<template>
	<view>
		<view class="search-waybill">
			<view class="search-input">
				<text class="iconfont search-icon">&#xe65e;</text>
				<input v-model="inputValue" placeholder="请输入公司名称或社会信用代码" />
				<i class="iconfont del-choose" @tap="resetInput">&#xe808;</i>
			</view>
			<view class="search-button" @tap='searchCyf'>搜索</view>
		</view>
		<view class="icon-history-title" v-if="!hasSearch"><i class="iconfont histoty-icon">&#xe612;</i>历史数据</view>
		<view class="materials-mes" v-for="(item,index) in List" :key="index">
			<view class="materials-left-frim">
				<view class="material-icon">
					<i class="iconfont">&#xe613;</i>
				</view>
				<view class="material-flex">
					<view>{{item.enterpriseName}}</view>
					<view>{{item.enterpriseId}}</view>
				</view>
			</view>
			<view class="materials-right-edit">
				<view class="edit-button"><button @tap="chooseCyf(item)">选择</button></view>
			</view>
		</view>
		<view class="uni-without-mes" v-if="List.length===0">暂无历史数据</view>
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
			total: 0,
			inputValue:'',
			hasSearch: false
		};
	},
	onShow(){
		this.getHistory()
	},
	methods: {
		resetInput(){
			this.inputValue = ''
		},
		chooseCyf(item){
			let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
			let prevPage = pages[ pages.length - 2 ];
			//prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
			prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
			    enterpriseId: item.enterpriseId,
				enterpriseName: item.enterpriseName
			})
			uni.navigateBack()
		},
		searchCyf(){
			if(this.inputValue){
				this.List = []
				this.hasSearch = true
				const data = {
					'name': this.inputValue
				}
				wtfModel.apiEnterpriseInfo(data).then(res => {
				  if (res.code === 1) {
					if (res.data.length === 1) {
					  this.List.push(res.data[0])
					}
				  }
				})
			}else{
				this.hasSearch = false
				this.getHistory()
			}
		},
		getHistory() {
			wtfModel.apiGetHistory().then((res) => {
				this.List = res.data.records;
				this.total = res.data.total
				this.size = res.data.size
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	@import './css/orderChooseCyf'
</style>
