import {
	config
} from '../config.js'

const tips = {
	1: '抱歉，出现了一个错误',
	1005: 'appkey无效，请前往http://36.22.178.70:10084申请',
	3000: '账号不存在'
}
// # 解构
class HTTP {
	request({
		url,
		data = {},
		method ,
		header = {'content-type': 'application/json'}
	}) {
		return new Promise((resolve, reject) => {
			this._request(url, resolve, reject, data, method, header)
		})
	}
	_request(url, resolve, reject, data = {}, method, header) {
		uni.request({
			url: config.api_base_url + url,
			method: method,
			data: data,
			header: header,
			success: (res) => {
				const code = res.statusCode.toString()
				if (code.startsWith('2')) {
					resolve(res.data)
				} else {
					reject()
					const error_code = res.data.error_code
					this._show_error(error_code)
				}
			},
			fail: (err) => {
				reject()
				this._show_error(1)
			}
		})

	}

	_show_error(error_code) {
		if (!error_code) {
			error_code = 1
		}
		const tip = tips[error_code]
		wx.showToast({
			title: tip ? tip : tips[1],
			icon: 'none',
			duration: 2000
		})
	}


}

export {
	HTTP
}
