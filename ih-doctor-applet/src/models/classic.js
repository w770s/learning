import {HTTP} from '../util/http.js'
import {config} from '../config.js'
const GET = 'GET'
const POST = 'POST'

class ClassicModel extends HTTP {
/**
  经典程序流程接口
**/
	verifyToken(data) { // 获取认证token
		return this.request({
			method: POST,
			url: '/token',
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			data: data
		})
	}
}

export {
	ClassicModel
}
