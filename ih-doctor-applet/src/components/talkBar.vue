<template>
	<view class="talkBar">
		<view class="header" :style="{ height: titleBarHeight+ 'px', 'padding-top': statusBarHeight+ 'px', background: nav.bg }">
			<text class="iconfont leftArrow header-back weight" v-if="nav.isdisPlayNavTitle" @click="back"></text>
			<view class="header-title weight talkBtn">
				<button class="selectRecord" @click="goMedicalRecord">电子病历</button>
				<button class="selectTalk" @click="goTalk">对话</button>
			</view>
		</view>
		<view :style="{ height: titleBarHeight+ 'px', 'padding-top': statusBarHeight+ 'px' }"></view>
	</view>
</template>
<script>
export default {
	props: {
		nav: {
			type: Object,
			default: {
				isdisPlayNavTitle: false,
				navTitle: '海螺互联网医院'
			}
		}
	},
	data() {
		return {
			statusBarHeight: 0,
			titleBarHeight: 0
		};
	},
	created() {
		var that = this;
		uni.getSystemInfo({
			success: function(res) {
				if (res.model.indexOf('iPhone') !== -1) {
					that.titleBarHeight = 44;
				} else {
					that.titleBarHeight = 48
				}
				that.statusBarHeight = res.statusBarHeight;
			}
		});
	},
	methods: {
		// 回到上一页
		back() {
			this.$emit('back');
		},
		goMedicalRecord() {
			this.$emit('recordClick');
		},
		goTalk() {
			this.$emit('talkClick');
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	align-items: center;
	top: 0;
	position: fixed;
	width: 100%;
	z-index: 100;
	left: 0;
	background: #ffffff;
}

.header .header-title {
	color: #333333;
	position: absolute;
	left: 50%;
	font-size: 18px;
	transform: translateX(-50%);
	box-shadow: 0 0 1px 4px #F5F9FF;

}

.header-back {
	position: absolute;
	font-size: 18px;
	padding: 10px;
	border-radius: 50%;
	color: #333333;
}

.talkBtn {
	display: flex;
	button {
		font-size: 13px;
		font-weight: normal;
		border-radius: 0px;
	}
	button::after {
	  border: none;
	}
	.selectRecord{
		border-radius: 5px 0 0 5px;
	}
	.selectTalk{
		border-radius: 0 5px 5px 0;
	}
}
</style>
