<template>
	<view class='swipedelete-wrapper' @touchmove='touchMoveHandler' @touchstart='touchStartHandler' ref="swife" :style="{transform:`translateX(${translateX}px)`}">
		<slot></slot>
		<view class='swipedelete-btn' @tap='deleteItem'>删除</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				translateX: 0,
				startX: 0
			};
		},
		methods: {
			deleteItem(e) {
				this.translateX = 0
				this.$emit('deleteItem')
			},
			/**
			 * 滑动删除事件-滑动开始
			 */
			touchStartHandler(e) {
				this.startX = e.touches[0].pageX
			},
			/**
			 * 滑动删除事件-滑动
			 */
			touchMoveHandler(e) {
				let pageX = e.touches[0].pageX
				let moveX = pageX - this.startX
				if (Math.abs(moveX) < 40) {
					return
				}
				// e.target.style.WebkitTransform = `translateX(${moveX}px)`
				if (moveX > 0) { // 右滑 隐藏删除
					if (Math.abs(this.translateX) == 0) {
						return
					} else {
						this.translateX = 0
					}
				} else { // 左滑 显示删除
					if (Math.abs(this.translateX) >= 80) {
						return
					} else {
						this.translateX = -80
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swipedelete-wrapper {
		width: 100%;
		transition: all .4s ease;
	}

	.swipedelete-btn {
		position: absolute;
		top: 0;
		right: -180rpx;
		text-align: center;
		background: #f00;
		color: #fff;
		width: 160rpx;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
