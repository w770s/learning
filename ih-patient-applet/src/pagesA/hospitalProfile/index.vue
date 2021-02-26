<template>
	<view>
		<u-bar :nav="setNav" :goHomePage="true" />
		<view class="uni-detailedBox">
			<view style="font-size: 30rpx;" @click="changeIndex(index)" v-for="(item, index) in navBar" :key="index" :class="whichIndex == index ? 'app-navTitle' : ''">{{item.name}}</view>
		</view>
		<view class="uni-detailed-box" v-if="whichIndex==0">
			<view class="uni-text">
				<text>哈哈</text>2013年,安徽海螺创业投资有限责任公司为尽显海螺集团大企业的社会责任，按照芜湖市委市政府的规划要求，在芜湖市城南投资新建了一所大型综合性医院——芜湖海螺医院。医院占地面积116亩，建筑面积17万平方米，总设计床位1000张。<br>
				<text>哈哈</text>医院创始人郭文叁先生确立了“服务企业，回馈社会”的办院宗旨和“医者仁心、追求卓越”的经营理念，致力于将医院建设成新型的现代化医院。
			</view>
			<view style="display:baitable-cell;text-align: center;vertical-align: middle;" class="uni-detailed-box">
				<view style="margin: 0 auto;">
					<img src="http://file.aihuihc.com/patient/map.png" mode=""></img>
				</view>
			</view>
			<view class="uni-text">
				<text>哈哈</text>医院配备先进的医疗设备，为高品质的医疗服务提供了有力的保障。医院拥有东芝640层CT、西门子Skyra3.0T磁共振、智能轨道小车、飞利浦FD20平板血管造影机、奥林巴斯电子肠胃镜及镜下治疗设备，GE Voluson E8、飞利浦EPIQ7等尖端超声诊断系统，日立全自动生化仪，数字化多功能手术室、大型体检专用车等设备。医院整体采用了先进的智能信息化系统，使患者就医流程更为简化、便捷，以实现无纸化和区域信息共享，保障患者安全，提高医疗质量和临床效率。<br>
				<text>哈哈</text>2016年9月至2019年9月，香港仁安医院在作为医院管理顾问期间，在护理体系、学科建设等方面开展了卓有成效的工作。通过引入JCI 国际化医疗管理理念，为医院的后续发展奠定基础。<br>
				<text>哈哈</text>2017年9月至今，医院借助弋矶山医院、芜湖二院等医疗机构的技术优势建立医联体合作关系，在妇产科、神经内科、消化科、康复科等科室开展紧密型合作关系，促进学科建设，提升医院的医疗技术水平和综合服务能力。<br>
				<text>哈哈</text>2020年9月7日-10日医院顺利通过JCI认证评审，成为安徽省第二家、省内非公医疗机构中通过JCI认证的医院。2020年9月30日，医院与安徽医科大学签署合作协议，正式成为安徽医科大学直属附属医院。
			</view>
			<view class="uni-text">
				医院地址：芜湖市弋江区九华南路327号
			</view>
		</view>
		<view class="uni-detailed-box" v-if="whichIndex==1">
			<view class="uni-text">
				<view>医院附近停车指南：</view>
				<view>
					1、停车场-白马山路南150米
				</view>
				<view>
					2、安徽医科大学附属海螺医院停车场-九华南路327号
				</view>
				<view>
					3、四联家园停车场-九华南路四联家园
				</view>
				<view>
					4、芜湖海螺国际会议中心停车场-九华南路1005号
				</view>
			</view>
		</view>
		<view style="display:baitable-cell;text-align: center;vertical-align: middle;" class="uni-detailed-box" v-if="whichIndex==2">
			<view style="margin: 0 auto;">
				<img style="height: 1000rpx;" src="http://file.aihuihc.com/patient/hospitalCard.png" mode=""></img>
				<img style="height: 1400rpx;" src="http://file.aihuihc.com/patient/chuyuan.png" mode=""></img>
			</view>
		</view>
		<view style="display:baitable-cell;text-align: center;vertical-align: middle;" class="uni-detailed-box" v-if="whichIndex==3">
			<view style="margin: 0 auto;">
				<img style="height: 1000rpx;" src="http://file.aihuihc.com/patient/ruyuan.png" mode=""></img>
			</view>
		</view>
		<view style="display:baitable-cell;text-align: center;vertical-align: middle;" class="uni-detailed-box" v-if="whichIndex==4">
			<view style="margin: 0 auto;">
				<img style="height: 1000rpx;" src="http://file.aihuihc.com/patient/jiuyi.png" mode=""></img>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				next: false,
				setNav: {
					'navTitle': '医院介绍',
					'isdisPlayNavTitle': true,
				},
				whichIndex: 0,
				navBar: [{
						name: '医院简介'
					},
					{
						name: '停车指南'
					},
					{
						name: '门诊就医'
					},
					{
						name: '入院指南'
					},
					{
						name: '出院指南'
					}
				]
			}
		},
		methods: {
			changeIndex(type) {
				this.whichIndex = type
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-detailedBox {
		padding: 30rpx 30rpx 0 30rpx;
		display: flex;
		justify-content: space-around;
		border-bottom: 2rpx solid #E5E5E5;
		overflow-x: auto;

		white-space: nowrap;

		overflow-y: hidden;
	}

	.app-navTitle {
		padding-bottom: 30rpx;
		border-bottom: 4rpx solid #2884FF;
	}

	.uni-detailed-box {
		padding: 30rpx 30rpx;
		font-size: 30rpx;
	}

	.uni-text {
		line-height: 60rpx;
	}

	.uni-text {
		text {
			color: rgb(248, 248, 248);
		}
	}
</style>
