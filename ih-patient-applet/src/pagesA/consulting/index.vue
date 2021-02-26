<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view style="position:relative;">
			<view style="position:fixed;height: 44px;z-index:1;width: 100%;">
				<u-filter-dropdown :filterData="filterData" :defaultSelected="filterDropdownValue" :updateMenuName="true" @confirm="confirm"
				 dataFormat="Object"></u-filter-dropdown>
			</view>
            <view style="padding: 57px 12px 0px 12px;">
				<view v-if="doctorList.length===0" style="text-align: center;">
					<img class='uni-default-img' src="http://file.aihuihc.com/patient/patientImages/images/messageKnock.png"></img>
					<view class='uni-default-tip'>
						<text>医生还没有入驻哦～</text>
					</view>
				</view>
			    <view v-for="(item,index) in doctorList" v-if="doctorList.length>0" :key="index">
			    <view class="uni-content-box">
				<view class="uni-content-item" @tap="goConsult(item.hisDoctorId,item.canShowDetail)">
					<view class="uni-content-line">
						<view class="uni-content-doctor">
							<view>
								<img :src="item.imageUrl" />
							</view>
							<view>
								<view class="uni-content-name-box">
									<text class="uni-content-personName">{{item.name}}</text>
									<text style="margin-right:6px;">{{item.level}}</text>
									<text>{{item.departName}}</text>
								</view>
								<view style="color:#B2B2B2;margin-bottom:8px;">
									<view>擅长: {{item.specialty?item.specialty:'暂无'}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="uni-divide-line"></view>
					<view class="uni-content-consult-box">
						<view>
							<!-- <text class="uni-currency-price">{{item.price/100}}元起</text> -->
<!--							<text class="uni-last-price">50元</text>-->
						</view>
						<view style="display: flex;flex-direction: row-reverse;">
							<view :class="['uni-content-consult',item.canShowDetail?'uni-can-consult':'uni-canNot-consult']">去咨询</view>
							<view class="uni-currency-time">最近排班：周{{ formatterWeek(item.week) }} {{formatterDate(item.startTime,'排班')+'-'+formatterDate(item.endTime,'排班')}}</view>
						</view>
					</view>
				</view>
			</view>
		    </view>
            </view>
		</view>
		<u-loading text="加载中.." mask="true" click="true" ref="loading" />
	</view>
</template>

<script>
	import {version1} from '@/util/version1.js'; //筛选菜单数据
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
					'navTitle': '健康咨询'
				},
				filterDropdownValue: [],
				filterData: [],
				doctorList: [],
                selectData: [],
				needArrayIndex: [0,0],
				userId: '',
				departId: '',
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
				if(this.userId){
					this.apiListDoctorSchedul({departId:this.userId})
				}else{
					this.apiListDoctorSchedul() //正常
				}
				this.filterData = version1
				this.apiListDepart()
			},
			formatterDate(startTime,type,endTime){
				if(type==='排班'){
					return startTime.substring(11,16)
				}
				if(type==='咨询'){
					let timeForNow = new Date().getTime()
					let start = startTime?new Date(startTime.replace(/-/g,'/')).getTime():''
					let end = endTime?new Date(endTime.replace(/-/g,'/')).getTime():''
					if(timeForNow>start&&timeForNow<end){
						return true
					}
					return false
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
			apiListDoctorSchedul(data) {
				consulting.listDoctorSchedul(data).then(res => {
					res.data.forEach((item)=>{
						return Object.assign(item,{canShowDetail:this.formatterDate(item.startTime,'咨询',item.endTime)})
					})
					this.doctorList = res.data
					this.$refs.loading.close();
				}).catch((err) => {
					this.$refs.loading.close();
					console.log(err);
				})
			},
            apiListDepart() {
                consulting.listDepart().then(res => {
                    this.firlList = res.data
                    let dataList = []
                    this.firlList.forEach((item,index)=>{
                        let departListData = []
                        item.departList.forEach((items,inde)=>{
                            if(item.id === items.parentDepartId){
                                let theDataList = {
                                    value: items.name,
                                    name: items.name,
                                    id:items.id
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
					let topData = {
						value: '全部科室',
						name: '全部科室',
						id:'',
						submenu: []
					}
					dataList.unshift(topData)
					this.filterDropdownValue = [
						this.needArrayIndex, //第0个菜单选中 一级菜单的第1项，二级菜单的第1项，三级菜单的第3项
						[0] //第2个菜单选中 一级菜单的第1项
					];
                    if(dataList){
                        this.selectData = JSON.parse(JSON.stringify(dataList))
                        this.filterData[0].submenu = dataList
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },
			//接收菜单结果
			confirm(e) {
				console.log(e)
				this.indexArr = e.index;
				let keyIndex = this.indexArr[0][0]
                let submenuIndex = this.indexArr[0][1]
				this.valueArr = e.value;
				if(this.selectData[keyIndex].submenu.length>0){
					this.doctorId = this.selectData[keyIndex].submenu[submenuIndex].id
				}
				if(this.selectData[keyIndex].submenu.length===0){
					this.doctorId = ''
				}
				if(this.valueArr[1][0]!=='全部职称'){
					this.departName = this.valueArr[1][0]
				}else{
					this.departName = ''
				}
				this.$refs.loading.open();
				this.apiListDoctorSchedul({departId:this.doctorId,level:this.departName})
			},
			goConsult(id,isShow) {
				console.log(id)
				if(!isShow){
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
						url: `./doctorDetail?doctorId=${id}`
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-default-img {
		text-align: center;
		height: 360rpx;
		width: 360rpx;
		margin-top: 160rpx;
		margin-bottom:40rpx;
	}

	.uni-default-tip {
		text-align: center;
		font-size: 40rpx;
		color:#333333;
	}

	.uni-content-box {
		height: 100%;
		/*background-color: #F6F6F6;*/
		padding-bottom:15px;
	}

	.uni-content-item {
		background-color: #fff;
		border-radius: 8px;
		position: relative;
		z-index:0;
	}

	.uni-content-line{
		font-size: 24rpx;
		color:#333333;
		padding: 30rpx 20rpx 30rpx 30rpx;
	}

	.uni-content-doctor {
		display: flex;

		img {
			width: 45px;
			height: 45px;
			border-radius: 50%;
			margin-right: 10px;
		}
	}

	.uni-content-name-box{
		margin-bottom:16rpx;
		font-size:30rpx
	}

	.uni-content-personName{
		font-size:36rpx;
		font-weight:bold;
		margin-right:12rpx;
	}

	.uni-content-img {
		position: absolute;
		width: 37px;
		height: 37px;
		top: 0px;
		left: 0px;
	}

    .uni-divide-line{
        background-color: #E5E5E5;
        height:1px;
    }

	.uni-content-consult-box {
		display: flex;
		padding: 10px 10px 10px 15px;
		justify-content: space-between;
		align-items: center;

		.uni-currency-price {
			color: #FF745F;
			font-size: 15px;
			margin-right: 8px;
		}

		.uni-currency-time{
			color:#2884FF;
			font-size:12px;
			display:flex;
			justify-content: center;
			align-items: center;
			margin-right: 10px;
		}

		.uni-last-price {
			color: #B2B2B2;
			font-size: 12px;
			text-decoration:line-through;
		}

		.uni-content-consult {
			width: 68px;
			height: 30px;
			border-radius: 3px;
			font-size: 13px;
			color: #fff;
			text-align: center;
			line-height: 30px;
		}

		.uni-can-consult{
			background: linear-gradient(90deg, rgba(94, 166, 248, 1) 0%, rgba(59, 124, 244, 1) 100%);
		}

		.uni-canNot-consult{
			background:rgba(40,132,255,0.2);
		}
	}
</style>
