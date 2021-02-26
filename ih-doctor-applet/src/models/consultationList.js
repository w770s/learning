import {HTTP} from '@/util/http.js'
import {config} from '@/config/index.js'
const GET = 'GET'
const POST = 'POST'

class consultationList extends HTTP {
/**
  体检报告接口
**/
	getAdviceAndSummarize(data) {  // 小程序--检查报告
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

	listCheckupResult(data) {  // 小程序--检查报告
		return this.request({
			method: GET,
			url: '/ems/applet/listCheckupResult',
			data: data
		})
	}

	selectRepeatDiagnosisOrder(data){ // 查询复诊订单详情
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/selectRepeatDiagnosisOrder',
			data: data
		})
	}

	updateRepeatDiagnosisOrder(data){ // 修改复诊订单
		return this.request({
			method: POST,
			url: '/prescription/repeatDiagnosis/updateRepeatDiagnosisOrder',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: data
		})
	}

	cancelRegister(data){ //  取消预约锁定的号源
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/registerRefundNo',
			data: data
		})
	}

	getOrderDetails(data){ // orderNumber查询处方详情
		return this.request({
			method: GET,
			url: '/prescription/prescriptionOrder/getOrderDetails',
			data: data,
		})
	}

	getStatus(data){ // 控制医生端开处方入口
		return this.request({
			method: GET,
			url: '/outpatient01/applet/getStatus',
		})
	}

	healthCardDetails(data) { // 健康卡详情
		return this.request({
			method: GET,
			url: '/basics/healthCard/selectHealthCardDetails',
			data
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
	consultationList
}
