<template>
	<view class="content">
		<view class="materials-and-time part-line">
			<text>{{ data.materials }}</text>
			<text>{{ data.tiemSection }}</text>
		</view>
		<view class="materials-mes part-line">
			<text class="material-flex">运单编号：{{ data.number }}</text>
			<view class="material-flex">
				<colorful-tag :textword="chen" />
				<view>{{ data.firm }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="qian" />
				<view>{{ data.truckCar }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="guai" />
				<view>{{ data.vertCar }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="jia" />
				<view>{{ data.driver }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="ya" />
				<view>{{ data.drivers }}</view>
			</view>
		</view>
		<view class="materials-button" v-if="formMes">
			<button
				:class="['select-button', index === 1 ? 'select-button1' : '']"
				v-if="!selectWait && permitButton"
				@tap="showStatus(item, index, data.number)"
				v-for="(item, index) in chooseButton"
				:key="index"
				:plain="index == 0"
				type="primary"
				size="mini"
			>
				{{ item.name }}
			</button>
			<button v-if="selectWait" type="primary">通知入场</button>
			<button v-if="!selectWait && !permitButton && !formList" type="primary" @tap="surveySection(data.number)">{{ survery }}</button>
		</view>
		<view class="uni-padding-wrap uni-common-mt" v-if="formList">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-column" v-for="(item, index) in radioList" :key="index">
					<view class="title">{{ item.attention }}</view>
					<radio-group :name="'radio' + index" class="form-radio-gap">
						<view>
							<label>
								<radio :value="item.radio1" class="form-radio" />
								{{ item.radio1 }}
							</label>
						</view>
						<view>
							<label>
								<radio :value="item.radio2" class="form-radio" />
								{{ item.radio2 }}
							</label>
						</view>
						<view>
							<label v-if="item.radio3">
								<radio :value="item.radio3" color="red" class="form-radio" />
								{{ item.radio3 }}
							</label>
						</view>
					</radio-group>
				</view>
				<view class="uni-btn-v">
					<button formType="submit" type="primary" @tap="surveySection">{{ survery }}</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
import colorfulTag from './colorfulTag';
export default {
	data() {
		return {
			chen: '承',
			qian: '牵',
			guai: '挂',
			jia: '驾',
			ya: '押',
			survery: '四必查',
			surveryOver: '完成查验',
			stratShipment: '开始装货',
			effectShipment: '完成装货',
			permitButton: true,
			formList: false,
			formMes: true,
			formSelect: {},
			chooseButton: [
				{
					name: '等待入场',
					toast: '确定让车辆去停车场等待吗？'
				},
				{
					name: '允许入场',
					toast: '确定让车辆直接进场装卸吗？'
				}
			],
			radioList: [
				{
					attention: '1、车辆《道路运输证》、驾驶人、押运人员及装卸作业人员的从业资格证',
					radio1: '查验合格',
					radio2: '查验不合格'
				},
				{
					attention: '2、压力容器检验合格有效期',
					radio1: '查验合格',
					radio2: '查验不合格',
					radio3: '不用查验'
				},
				{
					attention: '3、车辆是否悬挂危货标志',
					radio1: '查验合格',
					radio2: '查验不合格'
				},
				{
					attention: '4、相应的购买许可证件或证明文件',
					radio1: '查验合格',
					radio2: '查验不合格',
					radio3: '不用查验'
				}
			]
		};
	},
	props: ['data', 'selectWait'],
	components: {
		colorfulTag
	},
	methods: {
		// 等待入场和允许入场
		showStatus(item, index, number) {
			let that = this;
			uni.showModal({
				title: item.name,
				content: item.toast,
				confirmColor: '#43A8F3',
				success: function(res) {
					if (res.confirm) {
						if (index === 0) {
							that.$emit('chooseWait', number);
						} else {
							that.permitButton = false;
						}
					} else if (res.cancel) {
						console.log(`用户点击${item.name}取消`);
					}
				}
			});
		},
		// 允许入场所有步骤
		surveySection(number) {
			if (this.survery == '四必查') {
				this.formList = true;
				this.formMes = false;
				this.$set(this, 'survery', '完成查验');
			} else if (this.survery == '完成查验') {
				for (var x in this.formSelect) {
					// 四必查全添
					if (this.formSelect[x] === '') {
						this.formList = true;
						this.formMes = false;
						uni.showToast({
							icon: 'none',
							title: '所有选项都为必填，请先完成选择',
							duration: 2000
						});
						return;
					}
				}
				this.$set(this, 'survery', '开始装货');
				this.formList = false;
				this.formMes = true;
			} else if (this.survery == '开始装货') {
				this.$set(this, 'survery', '完成装货');
			} else if (this.survery == '完成装货') {
				// 回复初始状态
				this.permitButton = true;
				this.$set(this, 'survery', '四必查');
				this.$emit('permitOver', number);
			}
		},
		formSubmit(e) {
			console.log(e.detail.value);
			this.formSelect = e.detail.value;
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	text-align: left;
	background-color: #fff;
	margin-bottom: 30upx;
}
.part-line {
	padding: 20upx;
	border-bottom: 1upx solid #e4e4e4;
}
.materials-and-time {
	display: flex;
	justify-content: space-between;
}
.material-flex {
	display: flex;
	margin-bottom: 20upx;
}
.materials-button {
	padding: 30upx;
}
.select-button {
	width: 45%;
}
.select-button1 {
	margin-left: 10%;
}
.uni-padding-wrap {
	padding: 20upx;
}
.uni-form-item {
	line-height: 50upx;
}
.form-radio-gap {
	margin-bottom: 20upx;
}
.form-radio {
	transform: scale(0.7);
}
</style>
