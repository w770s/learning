<template>
	<view>
		<picker @change="bindPickerChange" :value="index" :range="pickerList">
			<view class="uni-input">
				<text class="uni-date">日期</text>
				<text class="iconfont icon-xiangzuo icon-left"></text>
				{{ pickerListLine[index] }}
				<text class="iconfont icon-xiangyou icon-right"></text>
			</view>
		</picker>
		<view class="status-itemBox">
			<view class="border-nomessage" v-if="List.length < 1">
				<view class="flex-box">
					<view class="iconfont-box">
						<i class="iconfont">&#xe620;</i>
					</view>
					<view class="no-message">暂无数据</view>
				</view>
			</view>
			<view class="status-item" v-for="(item, index) in List" :key="index">
				<history-box :data="item" />
			</view>
		</view>
	</view>
</template>
<script>
	import historyBox from './components/historyBox.vue';
	import {ClassicModel} from '../../models/classic.js';
	const classicModel = new ClassicModel();
	export default {
		data() {
			return {
				index: 0,
				List: [],
				pickerList: [],
				pickerListLine: []
			};
		},
		onShow() {
			this.getPassMonth();
			this.apiTask();
		},
		components: {
			historyBox
		},
		methods: {
			getPassMonth() {
				// 过去一个月时间
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
					this.timeSelect(day, month, 31, year);
				} else if (month === 2) {
					if (year % 4 === 0) {
						this.timeSelect(day, month, 28, year);
					} else {
						this.timeSelect(day, month, 29, year);
					}
				} else {
					this.timeSelect(day, month, 30, year);
				}
			},
			selectMonth() {
				const date = new Date();
				let month = date.getMonth();
				if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
					return 31;
				} else if (month === 2) {
					if (year % 4 === 0) {
						return 28;
					} else {
						return 29;
					}
				} else {
					return 30;
				}
			},
			timeSelect(day, month, num, year) {
				let days = [];
				let dayss = [];
				if (day - 30 >= 0) {
					for (let j = 1; j <= day; j++) {
						days.push(month + '月' + j + '日');
						if (month - 1 < 10) {
							if (j < 10) {
								dayss.push(year + '-' + 0 + '' + month + '-' + 0 + '' + j);
							} else {
								dayss.push(year + '-' + 0 + '' + month + '-' + j);
							}
						} else {
							if (j < 10) {
								dayss.push(year + '-' + month + '-' + 0 + '' + j);
							} else {
								dayss.push(year + '-' + month + '-' + j);
							}
						}
					}
				} else {
					let number = 0;
					let allDay = this.selectMonth();
					for (let j = day; j <= allDay; j++) {
						if (j <= allDay) {
							let theYear = month - 1 === 0 ? year - 1 : year;
							let theMonth = month - 1 === 0 ? 12 : `0${month - 1}`;
							if (month - 1 < 10) {
								if (j < 10) {
									dayss.push(theYear + '-' + theMonth + '-' + 0 + '' + j);
								} else {
									dayss.push(theYear + '-' + theMonth + '-' + j);
								}
							} else {
								if (j < 10) {
									dayss.push(year + '-' + (month - 1) + '-' + 0 + '' + j);
								} else {
									dayss.push(year + '-' + (month - 1) + '-' + j);
								}
							}
							days.push((month - 1 === 0 ? 12 : month - 1) + '月' + j + '日');
						}
						if (j == allDay) {
							for (let j = 1; j <= day; j++) {
								if (month < 10) {
									if (j < 10) {
										dayss.push(year + '-' + 0 + '' + month + '-' + 0 + '' + j);
									} else {
										dayss.push(year + '-' + 0 + '' + month + '-' + j);
									}
								} else {
									if (j < 10) {
										dayss.push(year + '-' + month + '-' + 0 + '' + j);
									} else {
										dayss.push(year + '-' + month + '-' + j);
									}
								}
								days.push(month + '月' + j + '日');
							}
						}
					}
				}
				this.pickerList = days;
				this.pickerListLine = dayss;
			},
			bindPickerChange(e) {
				this.index = e.target.value;
				this.apiTask(this.index);
			},
			apiTask(index) {
				if (index) {
					var time = this.pickerListLine[index];
				} else {
					this.index = this.pickerListLine.length - 1;
					var time = this.pickerListLine[this.index];
				}
				let data = {
					isCheck: 1,
					updateTime: time
				};
				classicModel.task(data).then(res => {
					//已完成 调度列表
					this.List = res.data;
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/history'
</style>
