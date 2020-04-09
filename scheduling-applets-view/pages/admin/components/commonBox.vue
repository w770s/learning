<template>
	<view class="content">
		<view class="materials-and-time part-line">
			<view class="materials-image-box">
				<img class="materials-image" src="../../../static/image/时间.png" />
				<text>{{ data.stevedoreType === '0' ? data.unloadingPeriod : data.loadingPeriod }}</text>
			</view>
			<view class="materials-details">{{ data.productName }}</view>
		</view>
		<view class="materials-mes part-line">
			<view class="material-flex">
				<colorful-tag :textword="chen" />
				<view>{{ data.carrierEnterpriseName }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="qian" />
				<view>{{ data.vanCert }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="guai" />
				<view>{{ data.truckCert }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="jia" />
				<view>{{ data.driverName + ' ' + data.driverPhone }}</view>
			</view>
			<view class="material-flex">
				<colorful-tag :textword="ya" />
				<view>{{ data.driverName2 + ' ' + data.driverPhone2 }}</view>
			</view>
		</view>
		<view class="driver-mes" v-if="cancelComing || data.reservationStatus === 'PLAN-STATUS-TZRC'">司机确认中</view>
		<view class="materials-button" v-if="formMes">
			<button
				:class="['select-button', index === 1 ? 'select-button1' : 'select-button0']"
				v-if="parkingOne"
				@tap="showStatus(item, index, data.number, data.id)"
				v-for="(item, index) in chooseButton"
				:key="index"
				size="mini"
			>
				{{ item.name }}
			</button>
			<button v-if="data.reservationStatus === 'PLAN-STATUS-DDRC'" @tap="informComing(data.id, informMes)" class="select-button select-button1">{{ informMes }}</button>
			<button v-if="data.reservationStatus === 'PLAN-STATUS-TZRC'" @tap="informComing(data.id, '取消入场')" class="select-button select-button1">取消入场</button>
			<button v-if="isCheck" class="select-button select-button1" @tap="surveySection(data.waybillNo, survery)">{{ survery }}</button>
		</view>
		<view class="uni-padding-wrap uni-common-mt" v-if="formList">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-column" v-for="(item, index) in radioList" :key="index">
					<view class="title">{{ item.attention }}</view>
					<radio-group :name="'radio' + index" class="form-radio-gap">
						<view>
							<label>
								<radio :value="0" class="form-radio" />
								{{ item.radio1 }}
							</label>
						</view>
						<view>
							<label>
								<radio :value="1" class="form-radio" />
								{{ item.radio2 }}
							</label>
						</view>
						<view>
							<label v-if="item.radio3">
								<radio :value="2" class="form-radio" />
								{{ item.radio3 }}
							</label>
						</view>
					</radio-group>
				</view>
				<view class="uni-btn-v">
					<button formType="submit" class="select-button select-button1" @tap="surveySection(data.waybillNo, overDone)">{{ overDone }}</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
import colorfulTag from '../../../components/colorfulTag.vue';
import { ClassicModel } from '../../../models/classic.js';
const classicModel = new ClassicModel();
export default {
	data() {
		return {
			chen: '承',
			qian: '牵',
			guai: '挂',
			jia: '驾',
			ya: '押',
			survery: '四必查',
			overDone: '完成查验',
			informMes: '通知入场',
			formList: false,
			formMes: true,
			cancelComing: false,
			driverCancel: false,
			formSelect: {},
			number: '',
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
	props: ['data', 'selectWait', 'isCheck', 'parkingOne'],
	components: {
		colorfulTag
	},
	methods: {
		apiTask(index) {
			let data = {
				isParking: index
			};
			classicModel.task(data).then(res => {
				//默认获取 已达到 调度列表
				if (index === 0) {
					this.selectWait = false;
				} else {
					this.selectWait = true;
				}
				this.list = res.data;
			});
		},
		apiDispatch(id, status) {
			// 修改调度状态
			let data = {
				id: id,
				reservationStatus: status
			};
			classicModel.dispatch(data).then(res => {
				if (data.reservationStatus === 'PLAN-STATUS-TZRC') {
					this.$emit('noticeComing');
					this.cancelComing = true;
					this.apiTask(1);
				} else if (data.reservationStatus === 'PLAN-STATUS-DDRC') {
					this.$emit('chooseWait', this.number);
					this.cancelComing = false;
					this.driverCancel = true;
					this.apiTask(1);
				} else if (data.reservationStatus === 'PLAN-STATUS-QRRC') {
					this.$emit('fourCome', this.number);
				}
			});
		},
		// 通知入场
		informComing(id, name) {
			if (name === '通知入场') {
				this.apiDispatch(id, 'PLAN-STATUS-TZRC');
				this.$set(this, 'informMes', '取消入场');
				console.log(this.informMes);
			} else if (name === '取消入场') {
				this.$set(this, 'informMes', '通知入场');
				this.apiDispatch(id, 'PLAN-STATUS-DDRC');
				setTimeout(() => {
					this.driverCancel = false;
				}, 60000);
			}
		},
		// 等待入场和允许入场(确认入场)
		showStatus(item, index, number, id) {
			let that = this;
			uni.showModal({
				title: item.name,
				content: item.toast,
				confirmColor: '#43A8F3',
				success: function(res) {
					if (res.confirm) {
						if (index === 0) {
							that.apiDispatch(id, 'PLAN-STATUS-DDRC');
						} else {
							that.apiDispatch(id, 'PLAN-STATUS-QRRC');
						}
					} else if (res.cancel) {
						console.log(`用户点击${item.name}取消`);
					}
				}
			});
		},
		// 允许入场所有步骤
		surveySection(number, name) {
			this.number = number;
			console.log(number);
			if (name == '四必查') {
				this.formList = true;
				this.formMes = false;
			}
		},
		formSubmit(e) {
			// 四必查
			let data = {
				verifyIsBuyLicense: e.detail.value.radio0,
				verifyPressVesseValid: e.detail.value.radio1,
				verifyTransportCertificate: e.detail.value.radio2,
				verifyVehicleHangDangerSign: e.detail.value.radio3,
				waybillNo: this.number
			};
			this.formSelect = e.detail.value;
			for (var x in this.formSelect) {
				// 四必查全添
				console.log(123);
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
			classicModel.fourCheck(data).then(res => {
				this.list = res.data;
				this.formList = false;
				this.formMes = true;
				this.$emit('permitOver', this.number);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	box-sizing: border-box;
	padding: 0upx 35upx;
	width: 100%;
	box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
	border-radius: 16upx;
	text-align: left;
	background-color: #fff;
	margin-bottom: 20upx;
	color: #7f8389;
	font-size: 28upx;
}
.part-line {
	padding: 20upx 0upx;
	border-bottom: 1upx solid #eeeeee;
}
.materials-and-time {
	height: 56upx;
	display: flex;
	justify-content: space-between;
}
.materials-image-box {
	height: 56upx;
	display: flex;
	align-items: center;
	font-size: 28upx;
}
.materials-image {
	width: 32upx;
	height: 32upx;
	margin-right: 15upx;
}
.driver-mes {
	text-align: center;
	line-height: 100upx;
}
.materials-details {
	text-align: center;
	line-height: 56upx;
	padding: 0upx 55upx;
	border-radius: 28upx;
	border: solid 1upx #eeeeee;
}
.material-flex {
	display: flex;
	margin-bottom: 20upx;
}
.materials-button {
	display: flex;
	justify-content: center;
	padding: 20upx 60upx;
}
.select-button {
	width: 200upx;
	height: 56upx;
	line-height: 56upx;
	border-radius: 28upx;
	text-align: center;
	font-size: 28upx;
}
.select-button1 {
	background-color: #29B6F6;
	color: #fff;
}
.select-button0 {
	border: solid 1upx #7f8389;
	background-color: #fff;
	color: #7f8389;
}
.uni-padding-wrap {
	padding: 20upx;
}
.uni-form-item {
	line-height: 50upx;
}
.form-radio-gap {
	margin-top: 20upx;
	margin-bottom: 20upx;
}
.form-radio {
	transform: scale(0.7);
}
</style>
