<template>
	<view>
		<view class="uni-input">
			<text class="uni-date">日期</text>
			{{ clearday }}
		</view>
		<view class="content">
			<view class="uni-timeBox" v-for="(item, index) in detailList" :key="index">
				<view class="uni-timeSection" @tap="slectBar(index)">
					<img src="../../static/image/时间.png" />
					{{ item.startTime + '-' + item.endTime }}
					<view class="uni-getCarNum">
						{{item.enterpriseList.length}} 辆
						<view :class="['icon-right',selectIndex===index?'icon-right-trans':'']">
							<text class="iconfont icon-dayuhao" />
						</view>
					</view>
				</view>
				<view v-if="selectIndex===index" class="uni-firmList" v-for="(items, inde) in item.enterpriseList" :key="inde">
					<view class="uni-tagicon">
						<colorful-tag :textword="wtf" />
						<view>{{ items.shipperEnterpriseName }}</view>
					</view>
					<view class="uni-tagicon">
						<colorful-tag :textword="chen" />
						<view>{{ items.carrierEnterpriseName }}</view>
					</view>
					<view class="uni-tagicon">
						<colorful-tag :textword="qian" />
						<view>{{ items.vanCert }}</view>
					</view>
					<view class="material-status">
						<button>{{items.handPlanStatus}}</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import colorfulTag from '../../components/colorfulTag.vue';
import {ClassicModel} from '../../models/classic.js';
const classicModel = new ClassicModel();
export default {
	data() {
		return {
			wtf: '委',
			qian: '牵',
			chen: '承',
			clearday: '',
			handingId: '',
			selectIndex: -1,
			detailList: []
		};
	},
	components: {
		colorfulTag
	},
	onLoad(e) {
		let title = e.product;
		this.clearday = e.clearday;
		this.handingId = e.id;
		uni.setNavigationBarTitle({
			title: title + '计划'
		});
		this.apiDoFirst();
	},
	methods: {
		slectBar(index){
			if(this.selectIndex === index){
				this.selectIndex = -1
			}
			else{
				this.selectIndex = index
			}
		},
		apiDoFirst() {
			// 获取调度计划详情
			const data = {
				handingId: this.handingId,
				time: this.clearday
			}
			classicModel.detail(data).then(res => {
				this.detailList = res.data;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import './css/plan'
</style>
