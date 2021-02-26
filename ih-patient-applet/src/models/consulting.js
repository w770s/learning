import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class consultingModel extends HTTP {
/**
  健康咨询接口
**/

	listDoctorSchedul(data) { // 根据标准科室获取对应科室医生排班信息
		return this.request({
			method: GET,
			url: '/advisory/combination/listDoctorSchedul',
			data
		})
	}

	listRepeatDiagnosisSchedules(data) { // 线上复诊医生排班
		return this.request({
			method: GET,
			url: '/prescription/repeatDiagnosis/listRepeatDiagnosisSchedules',
			data
		})
	}

	listDepart() { // 查询标准科室
		return this.request({
			method: GET,
			url: '/basics/depart/listDepart',
		})
	}


	selectDoctor(data) { // 查询医生信息（详情）
		return this.request({
			method: GET,
			url: '/advisory/combination/selectDoctor',
			data
		})
	}


	selectBlackList(data) { // 查询用户是否是黑名单
		return this.request({
			method: GET,
			url: '/outpatient01/register/selectBlackList',
			data
		})

	}

	addRegisterOrder(data) { // 添加loading
	    return this.request({
	        method: POST,
	        url: '/outpatient01/register/addRegisterOrder',
	        header:{ 'content-type': 'application/x-www-form-urlencoded'},
	        data
	    })
	}

	listRegisterOrder(data) { // 列表
		return this.request({
			method: GET,
			url: '/outpatient01/register/listRegisterOrder',
			data
		})
	}

	selectRegisterOrder(data) { // 查询预约挂号订单详情
		return this.request({
			method: GET,
			url: '/outpatient01/register/selectRegisterOrder',
			data
		})
	}

	creatQuestion(data) { // 问卷数据创建
		return this.request({
			method: POST,
			url: '/basics/questionnaireData/create',
			data
		})
	}

	detailQuestion(data) { // 问卷数据详情
		return this.request({
			method: GET,
			url: '/basics/questionnaireData/detail',
			data
		})
	}

	submitQuestion(data) { // 问卷提交
		return this.request({
			method: POST,
			url: '/basics/questionnaireData/submit',
			data
		})
	}

	listQuestion(data) { // 问卷数据提交内容列表
		return this.request({
			method: GET,
			url: '/basics/questionnaireData/optionList',
			data
		})
	}

	communityResourceList(data) { // 根据内容获取导诊列表
		return this.request({
			method: GET,
			url: '/basics/communityResource/list',
			data
		})
	}

	communityResourceDetail(data) { // 导诊症状详细描述
		return this.request({
			method: GET,
			url: '/basics/communityResource/detail',
			data
		})
	}

	listDoctorSchedules(data) { // 科室及医生出诊排班
		return this.request({
			method: GET,
			url: '/outpatient01/register/listDoctorSchedules',
			data
		})
	}

	listClinicOrder(data) { // 就诊订单列表(待支付订单和挂号订单)
		return this.request({
			method: GET,
			url: '/outpatient01/clinicPay/listClinicOrder',
			data
		})
	}

	getRegisterTips(data) { // 获取门诊科室预约提示详情
		return this.request({
			method: POST,
			url: '/basics/outpatientDepart/getRegisterTips',
			header:{ 'content-type': 'application/x-www-form-urlencoded'},
			data
		})
	}

	listRemoteDepart() { // 查询远程就诊科室列表
		return this.request({
			method: GET,
			url: '/basics/remote/listRemoteDepart',
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
			url: '/outpatient01/register/cancelRegister',
			data: data
		})
	}
	
	payable(data){ //  判断是否满足挂号支付条件
		return this.request({
			method: GET,
			url: '/outpatient01/register/payable',
			data: data
		})
	}

}

export {
	consultingModel
}
