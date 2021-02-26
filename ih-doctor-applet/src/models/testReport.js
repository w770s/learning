import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class testReportModel extends HTTP {

	listPatientMedicalRecord(data) { // 获取门诊病历列表
		return this.request({
			method: GET,
			url: '/outpatient01/outpatientMedicalRecord/listPatientMedicalRecord',
			data
		})
	}

	medicalRecordDetails(data) { // 门诊病历详情
		return this.request({
			method: GET,
			url: '/outpatient01/outpatientMedicalRecord/medicalRecordDetails',
			data
		})
	}

	selectDoctor(data) { // 查询医生信息（详情）
		return this.request({
			method: GET,
			url: '/advisory/combination/selectDoctor',
			data
		})
	}

	listByClinicNoAndType(data) { // 检查,检验报告单列表(通过就诊流水号查询)
		return this.request({
			method: GET,
			url: '/inpatient/checkReport/listByClinicNoAndType',
			data
		})
	}

	checkReportDetail(data) { // 检查,检验报告单明细
		return this.request({
			method: GET,
			url: '/inpatient/checkReport/detail',
			data
		})
	}

	listCheckup(data) { // 获取患者体检记录
		return this.request({
			method: GET,
			url: '/ems/applet/listCheckup',
			data: data
		})
	}

}

export {
	testReportModel
}
