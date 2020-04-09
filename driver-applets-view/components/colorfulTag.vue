<template>
	<view v-bind:class="[textword==='承'?'uni-tag1':'uni-tag2','uni-tag']">
		{{textword}}
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: ['textword'],
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.uni-tag {
		height: 35upx;
		width: 35upx;
		display: flex;
		justify-content: center;
		align-item: center;
		border-radius: 5upx;
		margin-right: 10upx;
	}

	.uni-tag1 {
		border: 1px solid #FF8100;
		color: #FF8100;
	}

	.uni-tag2 {
		border: 1px solid #00CF66;
		color: #00CF66;
	}
</style>
