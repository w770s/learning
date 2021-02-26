import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class clinicModel extends HTTP {
/**
  设置接口
**/
	listMedicalRecord(data) { // 获取门诊病历列表
		return this.request({
			method: GET,
			url: '/outpatient01/outpatientMedicalRecord/listMedicalRecord',
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

}

export {
	clinicModel
}
