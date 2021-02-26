import {
	HTTP
} from '@/util/http.js'
const GET = 'GET'
const POST = 'POST'

class MedicalReportModel extends HTTP {
	/**
	  体检报告接口
	**/

	weixinPay(data) { // 微信支付
		return this.request({
			method: POST,
			url: '/pay/wxpay/AppletPay2',
			data: data,
			type: 3
		})
	}

	// weixinPay(data) {  // 聚合支付
	// 	return this.request({
	// 		method: POST,
	// 		url: '/pay/aggPay/miniPay',
	// 		data: data,
	// 		type: 3
	// 	})
	// }


	frontNotify(data) { // 微信支付回调
		return this.request({
			method: POST,
			url: '/pay/aggPay/frontNotify?orderNo='+data,
		})
	}

	weixinPayRefund(data) { // 微信支付退款
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

	getAdviceAndSummarize(data) { // 小程序--检查报告（组合接口:根据体检编码获取员工体检综述和医生建议）
		return this.request({
			method: GET,
			url: '/ems/applet/getAdviceAndSummarize',
			data: data
		})
	}


	listCheckup(data) { // 获取患者体检记录
		return this.request({
			method: GET,
			url: '/ems/applet/listCheckup',
			data: data
		})
	}

	listCheckupResult(data) { // 小程序--检查报告（组合接口:根据体检编码获取员工体检疾病种类和结果）
		return this.request({
			method: GET,
			url: '/ems/applet/listCheckupResult',
			data: data
		})
	}


	listCheckup(data) { // 获取患者体检记录
		return this.request({
			method: GET,
			url: '/ems/applet/listCheckup',
			data
		})
	}


	recommendDepart(data) { // 疾病标签
		return this.request({
			method: GET,
			url: '/advisory/combination/recommendDepart',
			data: data
		})
	}

	addAdvisoryOrder(data) { // 添加咨询订单
		return this.request({
			method: POST,
			url: '/advisory/advisoryOrder/addAdvisoryOrder',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		})
	}

	addUpdateAdvisoryOrder(data) { // 修改订单状态
		return this.request({
			method: POST,
			url: '/advisory/advisoryOrder/updateAdvisoryOrder',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		})
	}


	selectAdvisoryOrder(data) { // 查询咨询订单
		return this.request({
			method: GET,
			url: '/advisory/advisoryOrder/selectAdvisoryOrder',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		})
	}

	listClinicOrder(data) { // 就诊
		return this.request({
			method: GET,
			url: '/outpatient01/clinicPay/listClinicOrder',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		})
	}

}

export {
	MedicalReportModel
}
