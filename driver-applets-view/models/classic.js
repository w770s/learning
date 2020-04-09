import {HTTP} from '../util/http.js'
import {config} from '../config.js'
const GET = 'GET'
const POST = 'POST'

class ClassicModel extends HTTP {
	
	// GET
	verify(phoneNumber) { // 发送验证码
		return this.request({
			url: '/zd-xt/weChat/driver/vCode',
			method: GET,
			data: {
				phone: phoneNumber
			}
		})
	}
	
	waybillNo(waybillNo) { // 查询运单详情
		return this.request({
			url: '/zd-xt/weChat/driver/waybillNo',
			method: GET,
			header: {
				'zd-auth': config.appHeader
			},
			data: {
				waybillNo: waybillNo
			}
		})
	}
	
	orderDelete(waybillNo) { // 取消预约
		return this.request({
			url: '/zd-xt/weChat/driver/orderDelete',
			method: GET,
			header: {
				'zd-auth': config.appHeader
			},
			data: {
				waybillNo: waybillNo
			},
		})
	}
	
	// POST
	user() { // 企业端获取认证token
		return this.request({
			url: '/zd-auth/user',
			method: POST,
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			}
		})
	}

	baseUpload(data) { // base图片上传
		return this.request({
			url: '/zd-system/file/upload-b64',
			method: POST,
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}

	verifyToken(phoneNumber, vCode) { // 获取token
		return this.request({
			url: '/zd-auth/token/driver',
			method: POST,
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			data: {
				phone: phoneNumber,
				vCode: vCode
			}
		})
	}

	changeStatus(data) { // 修改调度状态
		return this.request({
			url: '/zd-xt/weChat/driver/dispatch',
			method: POST,
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}
	
	reservedPark(data) { // 预约停车
		return this.request({
			url: '/zd-xt/weChat/driver/reservedPark',
			method: POST,
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}

	getTask(data) { // 获取任务列表
		return this.request({
			url: '/zd-xt/weChat/driver/task',
			method: POST,
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}

	updateWaybill(data) { // 修改运单
		return this.request({
			url: '/zd-xt/weChat/driver/updateWaybill',
			method: POST,
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			},
			data: data,
		})
	}
}


export {
	ClassicModel
}
