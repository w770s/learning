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
						<wtfWaybill @deleteBill='deleteBill' :list="item" />
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
	import wtfWaybill from './components/wtfTheWaybill.vue';
	import {WtfModel} from '../../models/wtf.js';
	const wtfModel = new WtfModel();
	export default {
		components: {
			wLoading,
			footerNav,
			wtfWaybill
		},
		data() {
			return {
				chooseIndex: 0,
				size: 10,
				total: 0,
				noMessage: '暂无数据',
				chooseBar: [{
						name: '待签收',
						class: 'right-noboard'
					},
					{
						name: '异常',
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
			this.apiTask(10,'WAYBILL-STATUS-DQS',0);
		},
		methods: {
			reachToBottom(){
				if(this.total>this.size){
					this.size += 10
					let status = this.chooseIndex===0?'WAYBILL-STATUS-DQS':this.chooseIndex===1?'':''
					let abnormalNum = this.chooseIndex===1?1:0
					this.apiTask(this.size,status,abnormalNum);
				}
				else{
					uni.showToast({
					    icon:"none",
					    title:"到底了"
					})
				}
			},
			apiTask(size,status,abnormalNum) {
				let data = {
					size: size,
					waybillStatus: status,
					isException: abnormalNum
				};
				wtfModel.apiGetWaybillList(data).then(res => {
					if(res.data.length!==0){
						this.List = res.data.records;
						this.total = res.data.total
						this.size = res.data.size
						this.$refs.loading.close()
					}
				});
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
					this.selectBar(this.chooseIndex)
				}).catch(res=>console.log(res))
			},
			selectBar(index) {
				this.chooseIndex = index;
				let status = this.chooseIndex===0?'WAYBILL-STATUS-DQS':this.chooseIndex===1?'':''
				let abnormalNum = this.chooseIndex===1?1:0
				this.apiTask(10,status,abnormalNum)
				this.$refs.loading.open()
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
	@import './css/waybill'
</style>
