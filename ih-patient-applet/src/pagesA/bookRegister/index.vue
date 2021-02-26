<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view style="position:relative;">
			<view class="uni-consult-box">
				<view>不知道选择哪个科室</view>
				<view style="color:#4A90E2;font-weight: bold;" @click="consultNow">点我立即咨询</view>
			</view>
			<view style="position:fixed;z-index:1;width: 100%;">
				<u-register-dropdown :filterData="filterData" :defaultSelected="filterDropdownValue" @confirm="confirm"
				 dataFormat="Object"></u-register-dropdown>
			</view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {version2} from '@/util/version1.js'; //筛选菜单数据
	import {
		consultingModel
	} from '@/models/consulting.js'
	const consulting = new consultingModel()
	export default {
		data() {
			return {
				indexArr: [],
				valueArr: [],
				setNav: {
					'isdisPlayNavTitle': true,
					'navTitle': '选择科室'
				},
				filterDropdownValue: [],
				filterData: [],
                selectData: [],
				needArrayIndex: [0],
				userId: '',
				hisDepartId: '',
				departName: '',
				healCardUserId: '',
			}
		},
		onLoad(options) {
			this.$refs.loading.open();
			this.userId = options.id
			this.healCardUserId = wx.getStorageSync('userInfo').userId
			if(!this.healCardUserId){
				wx.showModal({
					title: '请先登录哦~',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/guide?fromType=QrCode'
							})
						}
					}
				});
			}
			this.apGetData()
		},
		methods: {
			getNowDate(){
				const dateMonth = new Date().getMonth()+1
				const month = dateMonth<10?'0'+dateMonth:dateMonth
				const day = new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate()
				return new Date().getFullYear()+'-'+month+'-'+day
			},
			apGetData(){
				this.filterData = version2
				this.apiListDepart()
			},
			formatterDate(date,type){
				if(type==='排班'){
					return date.substring(11,16)
				}
				if(type==='咨询'){
					return date.substring(0,10)
				}
			},
			formatterWeek(week){
				switch (week) {
					case 1:
						return '一'
					case 2:
						return '二'
					case 3:
						return '三'
					case 4:
						return '四'
					case 5:
						return '五'
					case 6:
						return '六'
					case 7:
						return '日'
				}
			},
            apiListDepart() {
                consulting.listDepart().then(res => {
					this.$refs.loading.close();
                    this.firlList = res.data
                    let dataList = []
                    this.firlList.forEach((item,index)=>{
                        let departListData = []
                        item.departList.forEach((items,inde)=>{
                            if(item.id === items.parentDepartId){
                                let theDataList = {
                                    value: items.name,
                                    name: items.name,
                                    id:items.id,
									hisDepartId:items.hisDepartId,
                                }
                                if(items.id === parseInt(this.userId)){
									this.needArrayIndex = [index+1,inde]
								}
                                departListData.push(theDataList)
                            }
                        })
                        let theData = {
                            value: item.name,
                            name: item.name,
                            id:item.id,
                            submenu: departListData
                        }
                        dataList.push(theData)
                    })
					this.filterDropdownValue = [
						this.needArrayIndex, //第0个菜单选中
					];
					if(dataList){
                        this.selectData = JSON.parse(JSON.stringify(dataList))
                        this.filterData[0].submenu = dataList
                    }
                }).catch((err) => {
					this.$refs.loading.close();
                    console.log(err);
                })
            },
			consultNow(){
				uni.navigateTo({
					url: './robotTalk'
				})
			},
			//接收菜单结果
			confirm(e) {
				console.log(e,this.selectData);
				this.indexArr = e.index;
				this.valueArr = e.value;
				let keyIndex = this.indexArr[0][0]
                let submenuIndex = this.indexArr[0][1]
                let keyValue = this.valueArr[0][1]
                let submenuValue = this.valueArr[0][1]
				if(this.selectData[keyIndex].submenu.length>0){
					this.departId = this.selectData[keyIndex].submenu[submenuIndex].id
				}
				uni.setStorageSync('isRemoteClinic',false)
				uni.navigateTo({
					url: `./doctorFilter?departId=${this.departId}&name=${submenuValue}`,
				})
			},
			goConsult(id,time) {
				const timeIsToday = this.formatterDate(time,'咨询')+''===this.getNowDate()?true:false
				if(!timeIsToday){
					wx.showModal({
						title: '该医生当前未排班，暂无法咨询~',
						showCancel: false,
						success(res) {
							if (res.confirm) {
							} else if (res.cancel) {
							}
						}
					});
					return
				}else{
					uni.navigateTo({
						url: `./doctorDetail?id=${id}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-consult-box{
		display: flex;
		justify-content: space-between;
		position:fixed;
		height:44px;
		z-index:2;
		width: 100%;
		padding: 10px;
		color:15px;
		box-sizing: border-box;
	}
</style>
