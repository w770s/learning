<template>
	<view class="gpp-datePicker" @click.stop="show">
		<slot />
		<view class="g-dp-mask" :class="{'show':pipkerShowFlag}" @click.stop="hide" @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="g-dp-content" :class="{'show':pipkerShowFlag}" @touchmove.stop.prevent catchtouchmove="true">
			<view class="g-dp-ctt-head">
				<view class="g-dp-ctt-hd-btn" @click.stop="onCancel">取消</view>
				<view class="g-dp-ctt-hd-title">{{mainTitle}}</view>
				<view class="g-dp-ctt-hd-btn" :style="{'color':themeColor}" @click.stop="onConfirm">确定</view>
			</view>
			<view class="g-dp-ctt-wrapper">
				<picker-view :indicator-style="indicatorStyle" :value="selectedValue" @change="wrapperChange">
					<picker-view-column>
						<view v-if="changeType==='pharmacy'" :class="['g-dp-ctt-wp-item']" v-for="(item,index) in showDataArray" :key="index">{{item.name}}</view>
						<view v-if="changeType==='department'" :class="['g-dp-ctt-wp-item']" v-for="(item,index) in showDataArray" :key="index">{{item.departName}}</view>
						<view v-if="changeType==='detailItemDepartName'" :class="['g-dp-ctt-wp-item']" v-for="(item,index) in showDataArray" :key="index">{{item.departName}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			themeColor:{
				type:String,
				default(){
					return "#6ba1ff"
				}
			},
			mainTitle:{
				type:String,
				default(){
					return ""
				}
			},
			changeType:{
				type:String,
				default(){
					return ""
				}
			},
			defaultValue:{
				type:Array,
				default(){
					return []
				}
			}
		},
		data() {
			return {
				flag: false,
				pipkerShowFlag: false,
				indicatorStyle: `height: ${uni.upx2px(88)}px;background: #BED9FF;color:red;z-index: 0;`,
				selectedValue: [0],
				showDataArray:[]
			}
		},
		watch: {
			defaultValue:function(newVal, oldVal){
				setTimeout(()=>{
					this.init()
				},1000)
			}
		},
		mounted() {
			setTimeout(()=>{
				this.init()
			},1000)
		},
		methods: {
			/**
			 * props值校验
			 */
			init(){
				this.flag = false;
				if(!this.defaultValue.length){
					this.flag = true;
				}
				if(this.flag&&this.changeType==='pharmacy'){
					uni.showToast({
						title: '药房数据不存在',
						icon: "none"
					})
					return
				}
				if(this.flag&&this.changeType==='department'){
					uni.showToast({
						title: '执行科室数据不存在',
						icon: "none"
					})
					return
				}
				if(this.flag&&this.changeType==='detailItemDepartName'){
					uni.showToast({
						title: '采集科室数据不存在',
						icon: "none"
					})
					return
				}
				this.showDataArray = this.defaultValue
			},
			show(){
				this.init()
				if(!this.flag){
					this.pipkerShowFlag = true;
				}
			},
			hide(){
				this.pipkerShowFlag = false;
			},
			onCancel(){
				this.pipkerShowFlag = false;
				this.$emit("onCancel", {
					dateValue: this.selectedValue,
					dateValueIndex: this.selectedValue
				});
			},
			onConfirm(){
				this.pipkerShowFlag = false;
				this.$emit("onConfirm", {
					dateValue: this.selectedValue,
				});
			},
			/**
			 * picker change时间触发
			 * @param {Object} e
			 */
			wrapperChange(e){
				console.log(e);
				let detailValue = e.detail.value;
				this.selectedValue = detailValue;
			}
		}
	}
</script>

<style lang="scss">
	.gpp-datePicker{
		position: relative;
		.g-dp-mask{
			position: fixed;
			z-index: 1;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
			visibility: hidden;
			opacity: 0;
			transition: all 0.3s ease;
		}
		.g-dp-mask.show{
			visibility: visible;
			opacity: 1;
		}
		.g-dp-content{
			position: fixed;
			z-index: 1001;
			bottom: 0;
			right: 0;
			width: 100%;
			transition: all 0.3s ease;
			transform: translateY(100%);
			.g-dp-ctt-head{
				height: 130rpx;
				background-color: #FFFFFF;
				border-bottom: 1px solid #e5e5e5;
				padding: 0 40upx;
				display: flex;
				text-align: center;
				align-items: center;
				font-size: 36rpx;
				line-height: 130rpx;
				border-radius: 34rpx 34rpx 0rpx 0rpx;
				.g-dp-ctt-hd-btn{
					color: #888;
					width: 25%;
					height: 100%;
				}
				.g-dp-ctt-hd-title{
					color:#333333;
					width: 50%;
					height: 100%;
				}
			}
			.g-dp-ctt-wrapper{
				height: 350rpx;
				width: 100%;
				background-color: #FFFFFF;
			}
			.g-dp-ctt-wp-item{
				text-align: center;
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 30upx;
			}
		}
		.g-dp-content.show{
			transform: translateY(0);
		}
		picker-view-column{
			height: 350rpx !important;
		}
	}
</style>
