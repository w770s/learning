<template>
	<view class="content">
		<view class="choose-content">
			<view class="choose-box">
				<view @tap="selectBar(index)" :class="['choose-same', chooseIndex == index ? 'choose-active' : item.class]" v-for="(item, index) in chooseBar" :key="index">
					{{ item.name }}
				</view>
			</view>
		</view>
		<view v-if="!selectWait">
			<view v-for="(item, index) in list" :key="index">
				<common-box
					v-if="!(item.reservationStatus === 'PLAN-STATUS-DZH' && item.stevedoreType === 1)"
					@chooseWait="chooseWaiting"
					@fourCome="fourComing"
					@noticeComing="noticeCome"
					@permitOver="permitEnd"
					:parkingOne="item.isParking == 0 && item.reservationStatus == 'PLAN-STATUS-DJC'"
					:data="item"
					:isCheck="
					item.isCheck == 0 &&
						(item.reservationStatus === 'PLAN-STATUS-QRRC' ||
						item.reservationStatus === 'PLAN-STATUS-OK' ||
						(item.reservationStatus === 'PLAN-STATUS-DZH' && item.stevedoreType === 0 ) ||
						item.reservationStatus === 'PLAN-STATUS-DXH')
					"
				/>
			</view>
			<view class="border-nomessage" v-if="list.length === 0">{{ noMessage }}</view>
		</view>
		<view v-if="selectWait">
			<view v-for="(item, index) in list" :key="index">
				<common-box :selectWait="selectWait" :data="item" />
			</view>
			<view class="border-nomessage" v-if="list.length === 0">{{ noMessage }}</view>
		</view>
		<footerNav />
	</view>
</template>
<script>
import footerNav from '../../components/footer_nav.vue';
import commonBox from './components/commonBox';
import { ClassicModel } from '../../models/classic.js';
const classicModel = new ClassicModel();
export default {
	components: {
		commonBox,
		footerNav
	},
	data() {
		return {
			title: 'Hello',
			chooseIndex: 0,
			selectWait: false,
			carPark: [],
			noMessage: '暂无数据',
			chooseBar: [
				{
					name: '已到达',
					class: 'left-noboard'
				},
				{
					name: '停车场',
					class: 'right-noboard'
				}
			],
			list: []
		};
	},
	onShow() {
		this.apiTask();
	},
	onHide() {
		this.list = [];
	},
	onPullDownRefresh() {
		// 下拉刷新
		this.apiTask();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 500);
	},
	methods: {
		apiTask(index) {
			if (!index) {
				index = 0;
				this.chooseIndex = index;
			}
			let data = {
				isParking: index,
				isCheck: 0
			};
			classicModel.task(data).then(res => {
				//默认获取 已达到 调度列表
				if (index === 0) {
					this.selectWait = false;
				} else {
					this.selectWait = true;
				}
				this.list = res.data;
			});
		},
		selectBar(index) {
			this.chooseIndex = index;
			if (index === 0) {
				this.apiTask(index);
			} else {
				this.apiTask(index);
			}
		},
		// 通知入场
		noticeCome() {
			this.apiTask(1);
		},
		// 跳转到停车场
		chooseWaiting(number) {
			this.selectWait = true;
			this.chooseIndex = 1;
			this.apiTask(1);
		},
		// 允许入场 按钮 四必查
		fourComing(number) {
			this.selectWait = false;
			this.chooseIndex = 0;
			this.apiTask(0);
		},
		// 允许入场步骤走完数据消失
		permitEnd(number) {
			this.apiTask(0);
		}
	}
};
</script>

<style lang="scss" scoped>
@import './css/loadAndUnload'
</style>
