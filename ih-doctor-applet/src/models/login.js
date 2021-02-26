import {HTTP} from '@/util/http.js'
import {config} from '@/config/index.js'
const GET = 'GET'
const POST = 'POST'

class loginModel extends HTTP {
/**
  经典程序流程接口
**/

	getCommonToken() { // 获取公共token
		return this.request({
			method: GET,
			url: '/auth/oauth/getCommonToken',
			type: 3
		})
	}

	getUserPhone(data) { // 获取用户手机号
		return this.request({
			url: '/basics/user/getUserPhone',
			data: data
		})
	}

	selectUser(data) { // 查询用户是否存在
		return this.request({
			method: GET,
			url: '/basics/user/selectUser',
			data: data
		})
	}

	addUser(data) { // 添加用户
		return this.request({
			method: GET,
			url: '/basics/user/addUser',
			data: data
		})
	}

	verifyToken(data) { // 修改用户的手机号
		return this.request({
			method: GET,
			url: '/basics/user/updateUserInfo',
			header: {
				'content-type': 'multipart/form-data',
			},
			data: data
		})
	}

	getDoctorByPhone(data) { // 根据手机号查询医生信息
		return this.request({
			method: GET,
			url: '/basics/doctor/getDoctorByPhone',
			data: data
		})
	}
}

export {
	loginModel
}
