import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class payOrderModel extends HTTP {
/**
  缴费订单接口
**/
	listClinicPayOrder(data) { // 查询待缴费订单列表
		return this.request({
			method: GET,
			url: '/outpatient01/clinicPay/listClinicPayOrder',
			data: data
		})
	}

	listPayOrder(data) { // 查询诊已缴费订单列表
		return this.request({
			method: GET,
			url: '/outpatient01/clinicPay/listPayOrder',
			data: data
		})
	}

	addClinicPayOrder(data) { // 添加门诊待缴费订单
	    return this.request({
	        method: POST,
	        url: '/outpatient01/clinicPay/addClinicPayOrder',
	        header:{ 'content-type': 'application/x-www-form-urlencoded'},
	        data
	    })
	}
}

export {
	payOrderModel
}
