<template>
	<view class="numberCalculate-box">
		<view class="enlarge-size enlarge-left" @tap="minusNum">
			<text class="iconfont">&#xe64a;</text>
		</view>
		<input class="uni-inputs" type="number" v-model="number" placeholder="请输入" />
		<view class="enlarge-size enlarge-right" @tap="addNum">
			<text class="iconfont">&#xe64b;</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'countCalculate',
		props: ['count'],
		data() {
			return {
				number:''
			}
		},
		computed:{
			carNumber: function () {
				return this.number = this.count
			}
		},
		methods: {
			addNum() {
				this.number++
				this.$emit('addNum', this.number)
			},
			minusNum() {
				if(this.number===''){
					uni.showToast({
						icon: 'none',
						title: '内容不可为空'
					})
					return
				}
				if (this.number === 1) {
					uni.showToast({
						icon: 'none',
						title: '已经是最小了'
					})
					return
				}
				this.number--
				this.$emit('minusNum', this.number)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.numberCalculate-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.enlarge-size{
			width: 100upx;
			height: 100%;
			display: flex;
			align-items: center;
		}
		.enlarge-left{
			justify-content: flex-start;
		}
		.enlarge-right{
			justify-content: flex-end;
		}
		.iconfont {
			color: #32BCF7;
			font-size: 48upx;
		}

		.uni-inputs {
			text-align: center;
			width: 150upx;
		}
	}
</style>
