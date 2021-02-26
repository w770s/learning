import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class prescriptionModel extends HTTP {
/**
  设置接口
**/
	testOrderList(data) 	{ // 查询检查验订单列表信息
		return this.request({
			method: GET,
			url: '/prescription/ihInspectionOrder/orderList',
			data
		})
	}

	testOrderDetail(data){ // 查询检查验订单信息
		return this.request({
			method: GET,
			url: '/prescription/ihInspectionOrder/getOrderDetail',
			data: data
		})
	}

	ihInspectionOrderUpdate(data){ // 检查检验支付同步
		return this.request({
			method: POST,
			url: '/prescription/ihInspectionOrder/updateOrder',
			data: data
		})
	}

	getOrderDetailChek(data){ // id查询处方订单信息
		return this.request({
			method: GET,
			url: '/prescription/prescriptionOrder/getOrderDetailChek',
			data: data
		})
	}

	orderList(data) { // 查询处方订单列表
		return this.request({
			method: GET,
			url: '/prescription/prescriptionOrder/orderList',
			data
		})
	}

	getOrderDetail(data){ // id查询处方订单信息
		return this.request({
			method: GET,
			url: '/prescription/prescriptionOrder/getOrderDetail',
			data: data
		})
	}

	ihInspectionOrderGetOrderDetail(data){ // 查询检查验订单信息
		return this.request({
			method: GET,
			url: '/prescription/ihInspectionOrder/getOrderDetail',
			data: data
		})
	}

	updateOrder(data) { // 创建处方订单
		return this.request({
			method: POST,
			url: '/prescription/prescriptionOrder/updateOrder',
			data
		})
	}

	defaultAddress(data) { // 查找默认收货地址
		return this.request({
			method: GET,
			url: '/prescription/receiveAddress/defaultAddress',
			data
		})
	}

	addAddress(data) { // 添加收货地址
		return this.request({
			method: POST,
			url: '/prescription/receiveAddress/add',
			data
		})
	}

	listAddress(data) { // 地址列表
		return this.request({
			method: GET,
			url: '/prescription/receiveAddress/list',
			data
		})
	}

	updateAddress(data) { // 更新收货地址
		return this.request({
			method: POST,
			url: '/prescription/receiveAddress/update',
			data
		})
	}

	deleteAddress(data) { // 删除收货地址
		return this.request({
			method: POST,
			url: '/prescription/receiveAddress/delete',
	        header:{ 'content-type': 'application/x-www-form-urlencoded'},
			data
		})
	}

	queryAddress(data) { // 地址信息查询接口
		return this.request({
			method: POST,
			url: '/basics/baseAddressInfo/queryAddress',
			data
		})
	}

	queryOrder(data) { // 物流信息查询接口
		return this.request({
			method: GET,
			url: '/prescription/sfExpress/queryOrder',
			data
		})
	}

	addressList(data) { // 药房信息接口
		return this.request({
			method: GET,
			url: '/prescription/prescriptionMedicineStoreInfo/list',
			data
		})
	}
}

export {
	prescriptionModel
}
