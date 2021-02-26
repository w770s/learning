<template>
	<view class="personal">
		<u-topBar :nav="setNav" />
		<view class="uni-textarea personal-box">
		    <textarea @input="updateGoodText" disable-default-padding="true" auto-focus="true" auto-height="true" hold-keyboard="true" adjust-position maxlength='-1' v-model="goodText" />
		</view>
		<view :class="['uni-button-next',next?'uni-button-color':'uni-button-disabled']" @click="updateWelcome">确定修改</view>
	</view>
</template>

<script>
import { personalModel } from '@/models/personalInformation.js'
const personal = new personalModel()
export default {
	data() {
		return {
			setNav: {
				'isdisPlayNavTitle': true,
				'navTitle': '欢迎语'
			},
			goodText: '',
			next: false
		}
	},
	onLoad(options) {
		//此处接收传递过来的参数wx.navigateTo跳转时传递的参数   welcome
		this.goodText = options.welcome
	},
	methods:{
		updateGoodText(){
			if(this.goodText != ''){
				this.next = true
			}else{
				this.next = false
			}
		},
		// 修改欢迎语
		updateWelcome(){
			const data = {
				doctorId: wx.getStorageSync('doctorId'),
				welcome: this.goodText
			}
			if(this.next){
				personal.updateDoctorInfo(data).then(res=>{
					wx.navigateTo({
						url: './index'
					})
				}).catch(err=>{

				})
			}else{
				return
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.personal {
	height: 100vh;
	background: #F6F6F6;
}
.personal-box {
	position: relative;
	top: 19px;
	width: 95%;
	margin: 0 auto;
	background-color: #FFFFFF;
	font-size: 15px;
	color: #333333;
	border-radius: 10px;
	textarea{
		padding: 20px 5px;
		margin: 0 auto;
		width: 100%;
	}
}
.personalInformation{
	margin: 0 12px 0 12px;
	background: #FFFFFF;
	position: relative;
	z-index: 1;
	border-radius: 10px;
}
.uni-button-next {
	height: 47px;
	color: #FFFFFF;
	margin: 50px 12px 0 12px;
	line-height: 47px;
	text-align: center;
	font-size: 18px;
	color: #fff;
	border-radius: 5px;
}
.uni-button-disabled {
	background: rgba(40, 132, 255, 0.2);
}
.uni-button-color {
	background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
}
</style>
