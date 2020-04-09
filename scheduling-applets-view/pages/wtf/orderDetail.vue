<template>
	<view class="content">
		<form>
			<view class="uni-form-item uni-column">
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title">
								<text class="uni-number">01</text>
								装货信息
							</text>
						</view>
					</view>
					<view class="list-item">
						<text>装货企业</text>
						<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingEnterprise" placeholder="--" />
					</view>
					<view class="list-item">
						<text>装货地区</text>
						<input disabled="true" class="uni-input" v-model="orderHeaderVO.originDesc" placeholder="--" />
					</view>
					<view class="list-item">
						<text>详细地址</text>
						<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingAddress" placeholder="--" />
					</view>
					<view class="list-item">
						<text>联系人</text>
						<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingContact" placeholder="--" />
					</view>
					<view class="list-item">
						<text>联系电话</text>
						<input disabled="true" class="uni-input" v-model="orderHeaderVO.loadingContactPhone" placeholder="--" />
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">02</text>卸货信息</text>
						</view>
					</view>
					<view>
						<view class="list-item">
							<text>卸货企业</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingEnterprise" placeholder="--" />
						</view>
						<view class="list-item">
							<text>卸货地区</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.destinationDesc" placeholder="--" />
						</view>
						<view class="list-item">
							<text>详细地址</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingAddress" placeholder="--" />
						</view>
						<view class="list-item">
							<text>联系人</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingContact" placeholder="--" />
						</view>
						<view class="list-item">
							<text>联系电话</text>
							<input disabled="true" class="uni-input" v-model="orderHeaderVO.unloadingContactPhone" placeholder="--" />
						</view>
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">03</text>承运方信息</text>
						</view>
					</view>
					<view class="list-item">
						<text>运输企业</text>
						<input disabled="true" class="uni-input" placeholder="--" v-model="orderHeaderVO.carrierEnterpriseName" />
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">04</text>货物信息</text>
						</view>
					</view>
					<view class="list-item">
						<text>类别</text>
						<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.type" />
					</view>
					<view class="list-item">
						<text>货物名称</text>
						<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.productName" />
					</view>
					<view class="list-item">
						<text>货物规格</text>
						<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.specifications" />
					</view>
					<view class="list-item">
						<text>包装</text>
						<input disabled="true" class="uni-input" placeholder="--" v-model="orderProductVO.packageUnit" />
					</view>
					<view class="list-item">
						<text>件数</text>
						<input disabled="true" class="uni-input" v-model="orderProductVO.number" placeholder="--" />
					</view>
					<view class="list-item">
						<text>重量(吨)</text>
						<input type='number' class="uni-input" v-model="orderProductVO.weight" placeholder="--" />
					</view>
					<view class="list-item">
						<text>体积(立方米)</text>
						<input type='number' class="uni-input" v-model="orderProductVO.volume" placeholder="--" />
					</view>
				</view>
				<view class="uni-list-box">
					<view class="uni-form-title-box">
						<view class="uni-form-title-line">
							<text class="uni-form-title"><text class="uni-number">05</text>其他信息</text>
						</view>
					</view>
					<view class="list-item">
						<text>运输意向</text>
						<input disabled="true" class="uni-input" v-model="orderHeaderVO.stevedoreType" placeholder="--" />
					</view>
					<view class="list-item">
						<text>运费(元）</text>
						<input type='number' class="uni-input" v-model="orderHeaderVO.totalPrice" placeholder="--" />
					</view>
					<view class="list-item">
						<text>结算方式</text>
						<input disabled="true" class="uni-input" v-model="orderHeaderVO.clearingType" placeholder="--" />
					</view>
					<view class="list-item">
						<text>订单数量</text>
						<input type='number' class="uni-input" v-model="orderHeaderVO.orderNum" placeholder="--" />
					</view>
					<view class="list-item">
						<text>备注</text>
						<input type='number' class="uni-input" v-model="orderHeaderVO.remark" placeholder="--" />
					</view>
				</view>
			</view>
			<view class="uni-btn-v" v-if="specialStatus==='待接单'">
				<button v-if="specialStatus==='待接单'" class="big-orange" @tap="cancelOrderBill">取消订单</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		WtfModel
	} from '../../models/wtf.js';
	const wtfModel = new WtfModel();
	export default {
		onLoad(option) {
			if (option.id) {
				this.apiGetOrderDetail(option.id)
				this.specialId = option.id
			}
			if (option.status) {
				this.specialStatus = option.status
			}
		},
		data() {
			return {
				specialId:'',
				specialStatus:'',
				orderHeaderVO: {},
				orderProductVO: {}
			};
		},
		methods: {
			cancelOrderBill(){
				const data = {
					'orderStatus': 'ORDER-STATUS-YJJ',
					'id': this.specialId
				}
				wtfModel.apiChangeOrderStatus(data).then(res => {
					if (res.code === 1) {
						uni.showToast({
							icon: 'none',
							title: '操作成功'
						})
						setTimeout(()=>{
							uni.navigateBack()
						},700)
					}
				}).catch(err => {
					 console.log(err)
				})
			},
			apiGetOrderDetail(id) { // 除了 待发单和已取消
				wtfModel.apiGetOrderDetail(id).then((res) => {
					this.orderHeaderVO = res.data.orderHeaderVO
					this.orderProductVO = res.data.orderProductVO
					if (parseInt(this.orderHeaderVO.stevedoreType) === 0) {
						this.orderHeaderVO.stevedoreType = '进园装货'
					}
					if (parseInt(this.orderHeaderVO.stevedoreType) === 1) {
						this.orderHeaderVO.stevedoreType = '进园卸货'
					}
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './css/orderDetail'
</style>
