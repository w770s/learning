import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class settingModel extends HTTP {
/**
  设置接口
**/
	selectUserInfo(data) { // 查询用户信息
		return this.request({
			method: GET,
			url: '/basics/user/selectUserInfo',
			data
		})
	}

	updateUserInfo(data) { // 修改用户账号信息
		return this.request({
			method: GET,
			url: '/basics/user/updateUserInfo',
			data
		})
	}

}

export {
	settingModel
}
