import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class myOrderModel extends HTTP {
/**
  我的订单接口
**/

	getAdvisoryOrder(data) { // 小程序--查询咨询订单详情
		return this.request({
			method: GET,
			url: '/advisory/combination/getAdvisoryOrder',
			data: data,
			// type: 3
		})
	}

	advisoryOrderList(data) { // 小程序--查询咨询订单
		return this.request({
			method: GET,
			url: '/advisory/combination/advisoryOrderList',
			data: data,
			// type: 3
		})
	}

	specificQuestionnaireData(data) { // 根据关联的业务id查询问卷内容
		return this.request({
			method: GET,
			url: '/basics/questionnaireData/getContentByCorrelationId',
			data: data,
			// type: 3
		})
	}


}

export {
	myOrderModel
}
