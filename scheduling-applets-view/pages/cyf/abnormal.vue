<template>
	<view class="ui-content">
		<form @submit="formSubmit">
			<view class="ui-abnormalType" @tap="selectAbnormal" >
				<view>
					<text>*</text>
					<text>异常类型</text>
				</view>
				<input 
					disabled="true" 
					v-model="abnormalType" 
					placeholder="请选择异常类型"
					placeholder-style='color:#BBBBBB'
				/>
			</view>
			<view class="ui-abnormalRemark">
				<view>备注</view>
				<textarea
					@input='countLength'
					:value="abnormalRemark"
					placeholder-style="color:#BBBBBB"
					placeholder="请输入异常关闭原因" 
				/>
				<text class="ui-remarknumber">{{textareaValue}}/100</text>
			</view>
			<view class="ui-confirmChoose">
				<button formType="submit">确定</button>
			</view>
		</form>
		<w-picker 
			v-if="selectList.length!=0" 
			mode="selector" 
			:defaultVal="[0]" 
			@confirm="selectListConfirm" 
			ref="selector"
			themeColor="#f00" 
			:selectList="selectList">
		</w-picker>
	</view>
</template>

<script>
import {CyfModel} from '../../models/cyf.js'
import wPicker from '@/components/w-picker/w-picker.vue'
const cyfModel = new CyfModel()
export default {
	onLoad(option) {
		if (option.id) {
			this.waybillId = option.id
			console.log(option.id)
		}
	},
	onShow(){
		this.apiSearchbillListTree()
	},
	components: {
		wPicker
	},
	data() {
		return {
			selectList: [],
			waybillId: '',
			abnormalType: '',
			exceptionStatus: '',
			abnormalRemark: '',
			textareaValue: 0
		}
	},
	methods: {
		apiSearchbillListTree(){
			cyfModel.apiSearchbillListTree().then((res) => {
				res.data.forEach((item) => {
					const obj = {
						value: item.value,
						label: item.value,
						code: item.code
					}
					this.selectList.push(obj)
				})
			})
		},
		countLength(e){
			this.textareaValue = e.target.value.length
			this.abnormalRemark = e.target.value
		},
		selectAbnormal(){
			this.$refs['selector'].show()
		},
		selectListConfirm(val){
			this.abnormalType = val.result
			this.exceptionStatus = val.checkArr.code
		},
		formSubmit(e){
			let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
			let prevPage = pages[ pages.length - 2 ];
			prevPage.setData({ 
			    exceptionShow: this.abnormalType,
				exceptionStatus: this.exceptionStatus, // code
				remark: this.abnormalRemark,
				waybillId: this.waybillId
			})
			const obj = {
				'remark': this.abnormalRemark,
				'exceptionShow': this.abnormalType,
				'exceptionStatus': this.exceptionStatus,
				'waybillId': this.waybillId
			}
			if (this.abnormalType === '其他（关闭运单)') { // 不可编辑
				obj['isExceptionEditor'] = 1
			}
			cyfModel.apiWayBillIsException(obj).then((res) => {
				uni.navigateBack()
			}).catch(res=>console.log(res))
		}
	}
}
</script>

<style lang='scss' scoped>
	@import './css/abnormal'
</style>
