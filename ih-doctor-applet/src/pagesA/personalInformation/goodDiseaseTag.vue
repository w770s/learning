<template>
	<view style="height: 100vh; background: #F6F6F6;">
		<u-topBar :nav="setNav" />
		<view class="addDiseaseTag">
		        <xfl-select
		            :list="diseaseList"
		            :clearable="false"
		            :showItemNum="10"
		            :listShow="listShow"
		            :isCanInput="true"
		            :style_Container="'height: 50px; font-size: 16px;'"
		            :placeholder = "'请添加'"
		            :selectHideType="'hideAll'"
					:focusShowList="true"
					v-model="name"
					@visible-change="listDisease"
					@change="addDiseaseTag"
					@input="listDisease"
		        >
		        </xfl-select>
		    </view>
		<view class="diseaseTags">
			<view class="diseaseTag" v-for="(item,index) in diseaseTags" :key="index"><text>{{item.name}}</text><img src="http://file.aihuihc.com/ih-doctor-applet/image/personalInformation/remove.png" @click="removeDiseaseTag(item,index)"></img></view>
		</view>
	</view>
</template>

<script>
import xflSelect from '../../components/xfl-select/xfl-select.vue';     //导入
import { personalModel } from '@/models/personalInformation.js'
const personal = new personalModel()
export default {
	components: {
		xflSelect
	},
	data() {
		return {
			setNav: {
				'isdisPlayNavTitle': true,
				'navTitle': '擅长疾病标签'
			},
			listShow: false,
			name: '',
			diseaseLists: [],
			diseaseList: [],
			diseaseTag: '',
			diseaseTags: []
		}
	},
	onLoad(options) {
		//此处接收传递过来的参数wx.navigateTo跳转时传递的参数   doctorDiseaseList
		this.diseaseTags = JSON.parse(options.doctorDiseaseList)
	},
	methods:{
		// 查询所有疾病标签
		listDisease(){
			this.diseaseList=[];
			var name = ''
			if(this.name){
				name = this.name.detail.value
			}
			const data = {
				name
			}
			personal.listDisease(data).then(res=>{
				this.diseaseLists = res.data
					this.diseaseLists.forEach((item,index)=>{
						this.diseaseList.push(item.name)
					})
			}).catch(err=>{

			})
		},
		addDiseaseTag(event){
			console.log(event)
			var tags = this.diseaseTags.filter(item=>{
				return event.newVal == item.name
			})
			if(tags.length<=0){
				var tag = this.diseaseLists.filter(item=>{
					return event.newVal== item.name
				})
				console.log(tag)
				this.diseaseTags.push({name: event.newVal,id: tag[0].id})
				const data = {
					doctorId: wx.getStorageSync('doctorId'),
					diseaseId: tag[0].id,
					hospitalId: 1
				}
				personal.addDoctorDisease(data).then(res=>{
					wx.showToast({
						title: '添加成功'
					})
				}).catch(err=>{

				})
			}else{
				wx.showToast({
					title: '该标签已添加',
					icon: 'none'
				})
			}
		},
		removeDiseaseTag(item,index){
			console.log(item,index)
			this.diseaseTags.splice(index,1)
			const data = {
				id: item.id
			}
			personal.deleteDoctorDisease(data).then(res=>{
			}).catch(err=>{

			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.addDiseaseTag{
			margin: 19px 12px 0 12px;
			display: flex;
			justify-content: space-between;
			background-color: #FFFFFF;
			border-radius: 10px;
			xfl-select{
				width: 100%;
				border: none;
				font-size: 15px;
			}
		}
	.diseaseTags{
		margin: 10px 12px 0 12px;
		img{
			width: 14px;
			height: 14px;
			position: relative;
			top: -7px
		}
		.diseaseTag{
			display: inline-block;
			padding-left: 10px;
			height: 30px;
			line-height: 30px;
			background-color: #2884FF;
			color: #FFFFFF;
			font-size: 15px;
			margin: 0 15px 10px 0;
			border-radius: 5px;
		}
	}
	.addDiseaseTag /deep/ .show-box{
		border: none;
	}
</style>
