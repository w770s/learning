<template>
	<view>
		<view class="footer">
			<view
				:class="['footer_item', index == now_index ? 'select_word' : 'default_word']"
				@click="change_nav(index)"
				v-for="(item, index) in footer_nav"
				:key="index"
			>
				<image class="image-top" :src="index == now_index ? item.select_icon : item.icon" alt="" />
				</br>
				{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		change_nav(index) {
			this.$store.commit('change_page', index);
		}
	},
	computed: {
		footer_nav() {
			return this.$store.state.footer_store.footer_nav;
		},
		now_index() {
			return this.$store.state.footer_store.now_page_index;
		}
	}
};
</script>

<style lang="scss" scoped>
.footer {
	border-top: 2upx solid #f3f3f3;
	height: 120upx;
	display: flex;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 750upx;
	background-color: #fff;
	color: #999999;
}
.footer_item {
	text-align: center;
	width: 250upx;
	font-size: 24upx;
	height: 120upx;
}
.image-top{
	margin-top:5upx;
}
.select_word {
	color: #3b95fa;
}
.default_word {
	color: #999999;
}
.footer_item image {
	width: 70upx;
	height: 70upx;
}
</style>
