import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class consultationModel extends HTTP {
/**
  设置接口
**/

	listCheckup(data) { // 获取患者体检记录
		return this.request({
			method: GET,
			url: '/ems/applet/listCheckup',
			data: data
		})
	}

	addRepeatDiagnosisOrder(data) { // 添加复诊订单
		return this.request({
			method: POST,
			url: '/prescription/repeatDiagnosis/addRepeatDiagnosisOrder',
			data
		})
	}

	ListRepeatDiagnosisOrder(data) { // 查询复诊订单列表
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/ListRepeatDiagnosisOrder',
			data
		})
	}

	selectRepeatDiagnosisOrder(data) { // 查询复诊订单详情
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/selectRepeatDiagnosisOrder',
			data
		})
	}


	addOrderDataRecordadvisory(data) { // 健康咨询添加订单信息记录
		return this.request({
			method: POST,
			url: '/advisory/orderData/addOrderDataRecord',
			data
		})
	}

	addOrderDataRecordprescription(data) { // 在线问诊添加订单信息记录
		return this.request({
			method: POST,
			url: '/prescription/orderData/addOrderDataRecord',
			data
		})
	}

	selectOrderDataRecord(data) { // 查询订单信息记录
		return this.request({
			method: GET,
			url: '/prescription/orderData/selectOrderDataRecord',
			data
		})
	}

	updateRepeatDiagnosisOrder(data) { // 修改复诊订单
		return this.request({
			method: POST,
			url: '/prescription/repeatDiagnosis/updateRepeatDiagnosisOrder',
			header:{ 'content-type': 'application/x-www-form-urlencoded'},
			data
		})
	}

	cancelRegister1(data) { // 取消预约挂号锁定的号源
		return this.request({
			method: GET,
			url: '/outpatient01/register/cancelRegister',
			data
		})
	}

	cancelRegister2(data) { // 取消在线问诊锁定的号源
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/registerRefundNo',
			data
		})
	}

	getOrderDetail(data){ // id查询处方详情
		return this.request({
			method: GET,
			url: '/prescription/prescriptionOrder/getOrderDetail',
			data: data,
		})
	}

	healthInquiryMessageCallBack(data){ // LeanCloud消息回调接口（在线咨询）
		return this.request({
			method: POST,
			url: '/advisory/leanCloud/messageCopyCallBack',
			data: data,
		})
	}

	onlineInquiryMessageCallBack(data){ // LeanCloud消息回调接口（在线问诊）
		return this.request({
			method: POST,
			url: '/prescription/leanCloud/messageCopyCallBack',
			data: data,
		})
	}

}

export {
	consultationModel
}
