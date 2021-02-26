import {HTTP} from '@/util/http.js'
const GET = 'GET'
const POST = 'POST'

class orderModel extends HTTP {
/**
  经典程序流程接口
**/
	advisoryOrderList(data){ //查询医生咨询订单
		return this.request({
			method: GET,
			url: '/advisory/advisoryOrder/advisoryOrderList',
			data: data
		})
	}

	getDoctorOrderList(data){ //查询医生端复诊订单列表
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/getDoctorOrderList',
			data: data
		})
	}

	selectRepeatDiagnosisOrder(data) { // 查询复诊订单详情
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/selectRepeatDiagnosisOrder',
			data
		})
	}

	selectHealthCardDetails(data){ // 查询健康卡详情
		return this.request({
			method: GET,
			url: '/basics/healthCard/selectHealthCardDetails',
			data: data,
		})
	}

	specificQuestionnaireData(data) { // 根据关联的业务id查询问卷内容
		return this.request({
			method: GET,
			url: '/basics/questionnaireData/getContentByCorrelationId',
			data: data,
		})
	}

	selectAdvisoryOrder(data){ //查询医生咨询订单详情
		return this.request({
			method: GET,
			url: '/advisory/advisoryOrder/selectAdvisoryOrder',
			data: data
		})
	}


	getAdvisoryOrder(data){ //查询咨询订单详情
		return this.request({
			method: GET,
			url: '/advisory/combination/getAdvisoryOrder',
			data: data
		})
	}

	updateAdvisoryOrder(data){ //修改医生咨询订单状态
		return this.request({
			method: POST,
			url: '/advisory/advisoryOrder/updateAdvisoryOrder',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: data
		})
	}

	addAdvisoryOrder(data){ //修改医生咨询订单状态
		return this.request({
			method: POST,
			url: '/advisory/advisoryOrder/addAdvisoryOrder',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: data
		})
	}

	weixinPayRefund(data) {  // 微信支付退款
	   return this.request({
	      method: POST,
	      url: '/pay/aggPay/refund',
	      data: data,
	      type: 3
	   })
	}

	advisoryOrderRefund(data) { // 健康咨询订单退款
		return this.request({
			method: POST,
			url: '/advisory/advisoryOrder/advisoryOrderRefund',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		})
	}


}

export {
	orderModel
}
