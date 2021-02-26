import {HTTP} from '@/util/http.js'
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
			data: data,
			type: 3
		})
	}

/**
 新首页
 **/

	listMenuBar() { // 获取菜单栏列表
		return this.request({
			method: GET,
			url: '/cms/menuBar/listMenuBar',
		})
	}

	listAdvert() { // 获取广告栏列表
		return this.request({
			method: GET,
			url: '/cms/advert/listAdvert',
		})
	}

	listHealthPropaganda() { // 获取健康宣教列表
		return this.request({
			method: GET,
			url: '/cms/healthPropaganda/listHealthPropaganda',
		})
	}

}

export {
	loginModel
}
