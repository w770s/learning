<template>
	<view class="content">
		<adminIndex v-if="page_code == 'admin-plan'" />
		<adminLoading v-if="page_code == 'admin-shipping'" />
		<adminMine v-if="page_code == 'admin-my'" />
		<wtfOrder v-if="page_code == 'wtf-order'" />
		<wtfWaybill v-if="page_code == 'wtf-waybill'" />
		<wtfMine v-if="page_code == 'wtf-mine'" />
		<cyfOrder v-if="page_code == 'cyf-order'" />
		<cyfWaybill v-if="page_code == 'cyf-waybill'" />
		<cyfMine v-if="page_code == 'cyf-mine'" />
	</view>
</template>

<script>
import adminIndex from './admin/index.vue';
import adminLoading from './admin/loadAndUnload.vue';
import adminMine from './admin/mine.vue';
import wtfOrder from './wtf/order.vue';
import wtfWaybill from './wtf/waybill.vue';
import wtfMine from './wtf/mine.vue';
import cyfOrder from './cyf/order.vue';
import cyfWaybill from './cyf/waybill.vue';
import cyfMine from './cyf/mine.vue';
export default {
	data() {
		return {};
	},
	components: {
		adminIndex,
		adminLoading,
		adminMine,
		wtfOrder,
		wtfWaybill,
		wtfMine,
		cyfOrder,
		cyfWaybill,
		cyfMine
	},

	computed: {
		page_code() {
			return this.$store.state.footer_store.footer_nav[this.$store.state.footer_store.now_page_index].name_code;
		}
	},
	onLoad() {},
	methods: {}
};
</script>

<style>
.content {
	text-align: center;
	padding-bottom: 400upx;
}

.logo {
	height: 200upx;
	width: 200upx;
	margin-top: 200upx;
}

.title {
	font-size: 36upx;
	color: #8f8f94;
}
</style>
