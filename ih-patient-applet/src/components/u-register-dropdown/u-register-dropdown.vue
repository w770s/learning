<template>
	<view class="HMfilterDropdown" @touchmove.stop.prevent="discard" @tap.stop="discard">
		<block v-for="(page,page_index) in subData" :key="page_index">
			<view class="sub-menu-class" :class="{'show':showPage==page_index,'hide':pageState[page_index]!=true}">
				<block v-if="page.type=='hierarchy'&& page.submenu.length>0">
					<scroll-view class="sub-menu-list" :class="[activeMenuArr[page_index].length>1?'first':'alone']"
					 :scroll-y="true" :scroll-into-view="'first_id'+firstScrollInto">
						<block v-for="(sub,index) in page.submenu" :key="index">
							<view class="sub-menu" :id="'first_id'+index" :class="{'on':activeMenuArr[page_index][0]==index}" @tap="selectHierarchyMenu(page_index,index,null,null)">
								<view class="menu-name">
									<text>{{sub.name}}</text>
									<text class="iconfont selected"></text>
								</view>
							</view>
						</block>
					</scroll-view>
					<block v-for="(sub,index) in page.submenu" :key="index">
						<scroll-view class="sub-menu-list not-first" :scroll-y="true" v-if="activeMenuArr[page_index][0]==index&&sub.submenu.length>0"
						 :scroll-into-view="'second_id'+secondScrollInto">
							<block v-for="(sub_second,second_index) in sub.submenu" :key="second_index">
								<view class="sub-menu" :id="'second_id'+second_index" :class="{'on':activeMenuArr[page_index][1]==second_index}">
									<view class="menu-name" @tap="selectHierarchyMenu(page_index,activeMenuArr[page_index][0],second_index,null)">
										<text>{{sub_second.name}}</text>
										<text class="iconfont selected"></text>
									</view>
									<view class="more-sub-menu" v-if="sub_second.submenu&&sub.submenu.length>0&&sub_second.submenu.length>0">
										<block v-for="(sub2,sub2_index) in sub_second.submenu" :key="sub2_index">
											<text v-if="sub_second.showAllSub || (sub2_index<8)" :class="{'on':activeMenuArr[page_index][1]==second_index&&activeMenuArr[page_index][2]==sub2_index}"
											 @tap="selectHierarchyMenu(page_index,activeMenuArr[page_index][0],second_index,sub2_index)">{{sub2.name}}</text>
										</block>
									</view>
								</view>
							</block>
						</scroll-view>
					</block>
				</block>
			</view>
		</block>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				subData: [], //菜单数据
				menu: [], //顶部横条数据
				showPage: 0, //菜单页面显示/隐藏动画控制
				pageState: [], //页面的状态
				activeMenuArr: [], //UI状态
				shadowActiveMenuArr: [], //记录选中
				defaultActive:[],
				triangleDeg: [], //小三角形的翻转动画控制
				//滚动区域定位
				firstScrollInto: 0,
				secondScrollInto: 0,
				componentTop:0	,//组件top
				isReadNewSelect:false
			}
		},
		props: {
			filterData: {
				value: Array,
				default: []
			},
			defaultSelected:{
				value: Array,
				default: []
			},
			updateMenuName:{
				value: Boolean,
				default: true
			},
			dataFormat:{
				value: String,
				default: 'Array'
			}
		},
		watch: {
			filterData: {
				handler() {
					this.initMenu(); //filterData重新赋值初始化菜单
				},
				immediate: true
			},
			defaultSelected(newVal) {
				if(newVal.length==0){
					return;
				}
				this.defaultActive = JSON.parse(JSON.stringify(newVal));
				this.activeMenuArr = JSON.parse(JSON.stringify(newVal));
				this.shadowActiveMenuArr = JSON.parse(JSON.stringify(newVal));
				console.log(this.defaultActive, this.activeMenuArr);
				if(this.updateMenuName){
					this.setMenuName();
				}
			}
		},
		onShow() {
			this.showPageLayer(0);
		},
		methods: {
			initMenu() {
				let tmpMenuActiveArr=[];
				let tmpMenu=[];
				for (let i = 0; i < this.filterData.length; i++) {
					let tmpitem = this.filterData[i];
					tmpMenu.push({
						//如果没有设置name，则取第一个菜单作为menu.name,filter类型则将"筛选"作为menu.name
						name: tmpitem.name || (tmpitem.type == "filter" ? "筛选" : tmpitem.submenu[0].name),
						type: tmpitem.type
					});
					//初始化选中项数组-ui状态
					tmpMenuActiveArr.push(this.processActive(tmpitem));
					//初始化角度数组
					this.triangleDeg.push(0);
					//初始化控制显示状态数组
					this.pageState.push(true);
					//递归处理子菜单数据
					tmpitem = this.processSubMenu(tmpitem);
					this.filterData[i] = tmpitem;
				}
				this.menu = tmpMenu;
				//初始化选中项数组
				tmpMenuActiveArr = this.defaultActive.length>0?this.defaultActive:this.activeMenuArr.length>0?this.activeMenuArr:tmpMenuActiveArr;
				this.defaultActive = [];
				this.activeMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
				this.shadowActiveMenuArr = JSON.parse(JSON.stringify(tmpMenuActiveArr));
				//加载菜单数据
				this.subData = this.filterData;
				//设定顶部菜单名字
				if(this.updateMenuName){
					// this.setMenuName();
				}
			},
			setMenuName(){
				for(var i=0;i<this.activeMenuArr.length;i++){
					let row = this.activeMenuArr[i];
					if (typeof(row[0]) != 'object'){
						var tmpsub = false;
						if(row.length>0 && row[0]!=null){
							tmpsub = this.subData[i].submenu[row[0]];
							if(row.length>1 && row[1]!=null){
								tmpsub = tmpsub.submenu[row[1]];
								if(row.length>2 && row[2]!=null){
									tmpsub = tmpsub.submenu[row[2]];
								}
							}
						}else{
							tmpsub = false;
						}
						if(tmpsub){
							this.menu[i].name = tmpsub.name;
						}
					}
				}
			},
			//选中
			selectHierarchyMenu(page_index, level1_index, level2_index, level3_index) {
				//读取记录
				if (level1_index != null && level2_index == null && level3_index == null && this.shadowActiveMenuArr[page_index][0] ==
					level1_index) {
					this.activeMenuArr.splice(page_index, 1, JSON.parse(JSON.stringify(this.shadowActiveMenuArr[page_index])));
				} else {
					this.activeMenuArr[page_index].splice(0, 1, level1_index);
					(level2_index!=null||this.activeMenuArr[page_index].length>=2)&&this.activeMenuArr[page_index].splice(1, 1, level2_index) || this.activeMenuArr[page_index].splice(1, 1);
					(level3_index!=null||this.activeMenuArr[page_index].length>=3)&&this.activeMenuArr[page_index].splice(2, 1, level3_index) || this.activeMenuArr[page_index].splice(2, 1);
				}
				//写入结果
				if (level3_index != null || level2_index != null || (level1_index != null && this.subData[page_index].submenu[level1_index].submenu.length == 0)
				) {
					let sub = this.subData[page_index].submenu[level1_index].submenu[level2_index];
					if(this.updateMenuName){
						this.menu[page_index].name = (level3_index != null && sub.submenu[level3_index].name) || (level2_index != null && sub.name) || this.subData[page_index].submenu[level1_index].name;
					}
					this.shadowActiveMenuArr[page_index] = JSON.parse(JSON.stringify(this.activeMenuArr[page_index]));
					this.togglePage();
				}
			},
			//选中筛选类label-UI状态
			selectFilterLabel(page_index, box_index, label_index) {
				let find_index = this.activeMenuArr[page_index][box_index].indexOf(label_index);
				if (find_index > -1) {
					this.activeMenuArr[page_index][box_index].splice(find_index, 1);
					this.subData[page_index].submenu[box_index].submenu[label_index].selected = false;
				} else {
					this.activeMenuArr[page_index][box_index].push(label_index);
					this.subData[page_index].submenu[box_index].submenu[label_index].selected = true;
				}
				this.$forceUpdate();
			},
			//选中单选类label-UI状态
			selectRadioLabel(page_index, box_index, label_index) {

				let activeIndex = this.activeMenuArr[page_index][box_index][0];
				if(activeIndex == label_index){
					this.subData[page_index].submenu[box_index].submenu[activeIndex].selected = false;
					this.activeMenuArr[page_index][box_index][0] = null;
				}else{
					if(activeIndex!=null && activeIndex<this.subData[page_index].submenu[box_index].submenu.length){
						this.subData[page_index].submenu[box_index].submenu[activeIndex].selected = false;
					}

					this.subData[page_index].submenu[box_index].submenu[label_index].selected = true;
					this.activeMenuArr[page_index][box_index][0] = label_index;
				}
				this.$forceUpdate();
			},
			//菜单开关
			togglePage() {
				this.confirm();
			},
			//hide菜单页
			hidePageLayer(isAnimation) {
				this.triangleDeg[this.showPage] = 0;
				let tmpIndex = this.showPage;
				if (isAnimation) {
					setTimeout(() => {
						this.pageState.splice(tmpIndex, 1, false);
					}, 200);
					this.confirm();
				} else {
					this.pageState.splice(tmpIndex, 1, false)
				}
				this.firstScrollInto = null;
				this.secondScrollInto = null;
			},
			confirm() {
				let index = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));
				let value = JSON.parse(JSON.stringify(this.shadowActiveMenuArr));

				//对结果做一下处理
				index.forEach((item, i) => {
					if (typeof(item[0]) == 'object') {
						//针对筛选结果过一个排序
						item.forEach((s, j) => {
							if(s!=null){
								s.sort((val1, val2) => {
									return val1 - val2;
								});
								item[j] = s;
								s.forEach((v, k) => {
									value[i][j][k] = (v==null||v>=this.subData[i].submenu[j].submenu.length)?null:this.subData[i].submenu[j].submenu[v].value;
									if(this.subData[i].type == 'radio' && value[i][j][k] == null){
										value[i][j] = [];
										index[i][j] = [];
									}
								});
							}
						});
					}else{
						let submenu = this.subData[i].submenu[item[0]];
						value[i][0] = submenu.value;
						if(value[i].length>=2  && item[1]!=null){
							if(submenu.submenu.length>0){
								submenu = submenu.submenu[item[1]];
								value[i][1] = submenu.hasOwnProperty('value')?submenu.value:null;
							}else{
								value[i][1] = null
							}
							if(value[i].length>=3 && item[2]!=null){
								if(submenu.submenu.length>0){
									submenu = submenu.submenu[item[2]];
									value[i][2] = submenu.hasOwnProperty('value')?submenu.value:null;
								}else{
									value[i][2] = null;
								}
							}
						}
					}
					index[i] = item;

				});
				// 输出
				this.$emit('confirm', {
					index: index,
					value: value
				});
			},
			//show菜单页
			showPageLayer(index) {
				this.processPage(index);
				this.pageState.splice(index, 1, true);
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPage = index;
					}, 0);
				})
				this.triangleDeg[index] = 180;
			},
			reloadActiveMenuArr(){
				for (let i = 0; i < this.filterData.length; i++) {
					let tmpitem = this.filterData[i];
					let tmpArr = this.processActive(tmpitem);
					tmpitem = this.processSubMenu(tmpitem);
					if(this.activeMenuArr[i].length!=tmpArr.length){
						this.filterData[i] = tmpitem;
						this.activeMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
						this.shadowActiveMenuArr.splice(i, 1, JSON.parse(JSON.stringify(tmpArr)));
					}
				}
				this.subData = this.filterData;
				this.$forceUpdate();
			},
			processPage(index) {
				//check UI控制数组，结果数组,防止传入数据层级和UI控制数组不同步
				this.reloadActiveMenuArr();
				//重置UI控制数组
				this.activeMenuArr.splice(index, 1, JSON.parse(JSON.stringify(this.shadowActiveMenuArr[index])));
				if (this.menu[index].type == 'filter') {
					//重载筛选页选中状态
					let level = this.shadowActiveMenuArr[index].length;
					for (let i = 0; i < level; i++) {
						let box = this.subData[index].submenu[i].submenu;
						for (let j = 0; j < box.length; j++) {
							if (this.shadowActiveMenuArr[index][i].indexOf(j) > -1) {
								this.subData[index].submenu[i].submenu[j].selected = true;
							} else {
								this.subData[index].submenu[i].submenu[j].selected = false;
							}
						}
					}
				} else if (this.menu[index].type == 'hierarchy') {
					this.$nextTick(() => {
						setTimeout(() => {
							//滚动到选中项
							this.firstScrollInto = parseInt(this.activeMenuArr[index][0]);
							this.secondScrollInto = parseInt(this.activeMenuArr[index][1]);
						}, 0);
					})
				} else if (this.menu[index].type == 'radio') {
					//重载筛选页选中状态
					let level = this.shadowActiveMenuArr[index].length;
					for (let i = 0; i < level; i++) {
						let box = this.subData[index].submenu[i].submenu;
						for (let j = 0; j < box.length; j++) {
							if (this.shadowActiveMenuArr[index][i].indexOf(j) > -1) {
								this.subData[index].submenu[i].submenu[j].selected = true;
							} else {
								this.subData[index].submenu[i].submenu[j].selected = false;
							}
						}
					}
				}
			},
			processActive(tmpitem) {
				let tmpArr = []
				if (tmpitem.type == 'hierarchy'&&tmpitem.hasOwnProperty('submenu')&&tmpitem.submenu.length>0) {
					let level = this.getMaxFloor(tmpitem.submenu);
					while (level > 0) {
						tmpArr.push(0);
						level--;
					}
				} else if (tmpitem.type == 'filter') {
					let level = tmpitem.submenu.length;
					while (level > 0) {
						tmpArr.push([]);
						level--;
					}
				} else if (tmpitem.type == 'radio') {
					let level = tmpitem.submenu.length;
					while (level > 0) {
						tmpArr.push([]);
						level--;
					}
				}
				return tmpArr;
			},
			processSubMenu(menu) {
				if (menu.hasOwnProperty('submenu') && menu.submenu.length > 0) {
					for (let i = 0; i < menu.submenu.length; i++) {
						menu.submenu[i] = this.processSubMenu(menu.submenu[i]);
					}
				} else {
					menu.submenu = [];
				}
				return menu;
			},
			//计算菜单层级
			getMaxFloor(treeData) {
				let floor = 0
				let max = 0
				function each(data, floor) {
					data.forEach(e => {
						max = floor > max ? floor : max;
						if (e.hasOwnProperty('submenu') && e.submenu.length > 0) {
							each(e.submenu, floor + 1)
						}
					})
				}
				each(treeData, 1)
				return max;
			},
			discard() {

			}
		}
	}
</script>
<style lang="scss" scoped>
	.HMfilterDropdown {
		flex-shrink: 0;
		width: 100%;
		// position: fixed;
		// z-index: 2;
		// flex-wrap: nowrap;
		display: flex;
		flex-direction: row;
		// top: var(--window-top);
		left:0;
		view {
			display: flex;
			flex-wrap: nowrap;
		}
	}
	.region {
		flex: 1;
		/*height: 44px;*/
	}
	.sub-menu-class {
		width: 100%;
		position: absolute;
		left: 0;
		transform: translate3d(0, - 100%, 0);
		max-height: calc(100vh - 100px);
		background-color: #ffffff;
		z-index: 11;
		box-shadow: 0 5px 5px rgba(0, 0, 0, .1);
		overflow: hidden;
		flex-direction: row;
		transition: transform .15s linear;
		&.hide {
			display: none;
		}

		&.show {
			transform: translate3d(0, calc(44px + 1rpx), 0);
		}
	}
	.sub-menu-list {
		width: 100%;
		height: calc(100vh - 100px);
		flex-direction: column;
		.sub-menu {
			min-height: 44px;
			font-size: 13px;
			flex-direction: column;
			padding-right: 15px;
			>.menu-name {
				height: 44px;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				>.iconfont {
					display: none;
					font-size: 18px;
					color: #2884FF;
				}
			}
		}
		&.first {
			flex-shrink: 0;
			width: 236rpx;
			background-color: #f0f0f0;
			.sub-menu {
				padding-left: 15px;

				&.on {
					background-color: #fff;
				}
			}
		}
		&.alone {
			max-height: calc(100vh - 100px);
			min-height: 170px;
			width: 193px;
			height: auto;
			background-color: #F7F4F8;
			.sub-menu {
				min-height: calc(44px - 1rpx);
				margin-left: 15px;
				border-bottom: solid 1rpx #f5f5f5;

				&.on {
					color: #2884FF;

					>.menu-name {
						>.iconfont {
							display: block;
						}
					}
				}
			}
		}
		&.not-first {
			.sub-menu {
				min-height: calc(44px - 1rpx);
				margin-left: 15px;
				border-bottom: solid 1rpx #f5f5f5;
				>.menu-name {
					height: 44px;
					>.iconfont {
						display: none;
						font-size: 18px;
						color: #2884FF;
					}
				}
				&.on {
					color: #2884FF;
					>.menu-name {
						>.iconfont {
							display: block;
						}
					}
				}
				.more-sub-menu {
					flex-direction: row;
					flex-wrap: wrap;
					padding-bottom: 9px;
					>text {
						height: 30px;
						border-radius: 3px;
						background-color: #f5f5f5;
						color: #9b9b9b;
						margin-bottom: 6px;
						margin-right: 6px;
						text-align: center;
						line-height: 30px;
						border: solid #f5f5f5 1rpx;
						flex: 0 0 calc(33.33% - 6px);
						overflow: hidden;
						font-size: 12px;
						&:nth-child(3n) {
							margin-right: 0;
						}
						&.on {
							border-color: #f6c8ac;
							color: #2884FF;
						}
						.iconfont {
							color: #9b9b9b;
						}
					}
				}
			}
		}
	}
	/* 字体图标 */
	@font-face {
		font-family: "HM-FD-font";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALAAAsAAAAABpQAAAJzAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgp4gQIBNgIkAwwLCAAEIAWEbQc5G8sFERWMIbIfCbbzqA4hp7InSBibVsYGb4J42o82b3e/nJlHMw/NHbGOlwKJRCRpwzPtpAECCOZubdqxjYpQLMlVg+70/08edrgQOtx2ukpVyApZn+dyehPoQObHo3O85rYx9vOjXoBxQIHugW2yIkqIW2QXcScu4jwE8CSWbKSmrqUHFwOaJoCsLM5P4haSGIxRcRHshrUGucLCVcfqI3AZfV/+USguKCwNmtsxVztDxU/n55C+3W0Z4QQpEOTNFqCBbMCAjDUWB9CIwWk87aa70cYgqLkyd3dEmm+18R8eKATEBrV7A5CulBT8dKiWOYZk412XNcDdKSEKSGODnyKIDl+dmVt9/Dx4pu/xyeutkMlHISGPTsPCnoTNP9nOT6wTtDdlO6dPr47efvj942lkYuQzrhMKEjq9N6y98P3340gmlJ/RStUD6F31CAEEPtUW94/7rf+7XgaAz57X0ZHXAGsFFwVgw38yALuMb0IBbVyNamFYEw4oKMDTj3AHRQP5Pt4dci9VwSVkRNQh5r7CLskZadhsWHhRDBsXczk8ZYk3ewnCxmQeQKa3BOHvA8XXO2j+vqRhf7CE+sPmn4anvoL29JLa4qqaUQkmoK+QG2osCckq7txi2leK86aIPyJ3eQZ8xytXYmyQ51jQndJAxIJlqiGSLsOqImiZCjTiZCJt6Lq26U2OoXqwUo0hRaAE0K5AziANy/uLVeXzWyjVqyjcoeupjxDr5MMDn8MDkLG9Aenu5ZrOSSoghAUsRmogkkahSoWAtnlUARnCkY3It0Iu7mWhdmd9Z/19BwBP6GidEi0G56opckXTGZVSPxgAAAA=');
	}
	.iconfont {
		font-family: "HM-FD-font" !important;
		font-size: 13px;
		font-style: normal;
		color: #757575;
		&.triangle {
			&:before {
				content: "\e65a";
			}
		}
		&.selected {
			&:before {
				content: "\e607";
			}
		}
	}
</style>
