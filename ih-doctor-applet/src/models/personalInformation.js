import {HTTP} from '@/util/http.js'
import {config} from '@/config/index.js'
const GET = 'GET'
const POST = 'POST'

class personalModel extends HTTP {
/**
  经典程序流程接口
**/
	selectDoctor(data) { // 查询医生个人信息
		return this.request({
			method: GET,
			url: '/basics/doctor/selectDoctor',
			data: data
		})
	}

	updateDoctorInfo(data) { // 修改医生信息
		return this.request({
			method: POST,
			url: '/basics/doctor/updateDoctorInfo',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: data
		})
	}

	addImage(data){ //添加照片
		return this.request({
			method: POST,
			url: '/basics/doctor/addImage',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: data
		})
	}

	listDisease(data){ //查询医生与疾病的关系
		return this.request({
			method: GET,
			url: '/basics/disease/listDisease',
			data: data
		})
	}

	addDoctorDisease(data){ //添加医生与疾病的关系
		return this.request({
			method: POST,
			url: '/basics/disease/addDoctorDisease',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: data
		})
	}

	deleteDoctorDisease(data){ //删除医生与疾病的关系
		return this.request({
			method: POST,
			url: '/basics/disease/deleteDoctorDisease',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: data
		})
	}
}

export {
	personalModel
}
