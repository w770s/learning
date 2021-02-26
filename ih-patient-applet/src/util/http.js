import {
	config
} from '@/config/index.js'
import secret from '@/util/cropto.js'
import ENVIRONMENT_CONFIG from '../config/envConfig.js'
const tips = {
	1: '抱歉，出现了一个错误',
	'Authorization': ENVIRONMENT_CONFIG.Authorization
}

// type：1.MD5 2.AES 3.MD5+AES
// # 解构
class HTTP {
	request({
			url,
			data = {},
			method,
			header,
			type
		}) {
		return new Promise((resolve, reject) => {
			this._request(url, resolve, reject, data, method, header, type)
		})
	}
	_request(url, resolve, reject, data = {}, method, header={}, type=0) {
		let storageAuthorization = uni.getStorageSync('Authorization')
		if(url!=='/auth/oauth/getCommonToken'){
			var headerAddToken =  Object.assign(header,{'Authorization':tips.Authorization || storageAuthorization})
		}
		if(url==='/auth/oauth/getCommonToken'){
			var headerAddToken =  header
			console.log(headerAddToken,'header');
		}
		if(type===1){
			const needData = JSON.parse(JSON.stringify(data))
			console.log(needData)
			data['signature'] = secret.md5sort_ASCII(data)
			data['v'] = 1
		}
		if(type===2){
			data['param'] = secret.Encrypt(data,2)
			Object.keys(data).forEach((item)=>{
				if(item!=='param'){
					delete data[item]
				}
			})
			data['v'] = 2
		}
		else if(type===3){
			const needData = JSON.parse(JSON.stringify(data))
			console.log(JSON.stringify(needData))
			data['param'] = secret.Encrypt(data,3)
			Object.keys(data).forEach((item)=>{
				if(item!=='param'){
					delete data[item]
				}
			})
			data['v'] = 3
		}
		else if(type!==1&&type!==2&&type!==3){
			console.log(JSON.parse(JSON.stringify(data)),'1232sdds');
			data['v'] = 0
		}
		// if(url!=='/advisory/leanCloud/messageCopyCallBack'){
		// 	var finalUrl =  config.api_base_url + url,
		// }
		// if(url!=='/advisory/leanCloud/messageCopyCallBack'){
		// 	var finalUrl =
		// }
		uni.request({
			url: config.api_base_url + url,
			method: method,
			data: data,
			header: headerAddToken,
			success: (res) => {
				const code = res.data.code.toString()
				if (code.startsWith('2')) {
					resolve(res.data)
				} else {
					reject()
					const error_code = res.data.message
					this._show_error(error_code)
				}
			},
			fail: (err) => {
				console.log(err);
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
		uni.showToast({
			title: error_code ? error_code : error_code,
			icon: 'none',
			duration: 2000
		})
	}
}

export {
	HTTP
}
