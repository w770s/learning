import {HTTP} from '../util/http.js'
import {config} from '../config.js'
const GET = 'GET'
const POST = 'POST'

class ClassicModel extends HTTP {
/**
 企业端 经典程序流程接口
**/
	detail(data) { // 获取调度计划详情
		return this.request({
			method: GET,
			url: '/zd-xt/weChat/enterprise/detail',
			header: {
				'content-type': 'multipart/form-data',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}
	
	list(data) { // 获取调度计划列表
		return this.request({
			method: GET,
			url: '/zd-xt/weChat/enterprise/list',
			header: {
				'content-type': 'multipart/form-data',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}

	user() { // 企业端获取认证token
		return this.request({
			method: POST,
			url: '/zd-auth/user',
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			}
		})
	}

	verifyToken(data) { // 企业端获取认证token
		return this.request({
			method: POST,
			url: '/zd-auth/token',
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			data: data
		})
	}

	fourCheck(data) { // 四必查
		return this.request({
			method: POST,
			url: '/zd-xt/weChat/enterprise/fourCheck',
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}

	task(data) { // 获取调度列表
		return this.request({
			method: POST,
			url: '/zd-xt/weChat/enterprise/task',
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}

	dispatch(data) { // 修改调度状态
		return this.request({
			method: POST,
			url: '/zd-xt/weChat/enterprise/dispatch',
			header: {
				'content-type': 'application/json',
				'zd-auth': config.appHeader
			},
			data: data
		})
	}
}

export {
	ClassicModel
}
