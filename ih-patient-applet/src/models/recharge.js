import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class prepayModel extends HTTP {
/**
  设置接口
**/
	listPrepayRecords(data) { // 查看预缴金充值记录
		return this.request({
			method: GET,
			url: '/inpatient/prepay/listPrepayRecords',
			data: data
		})
	}

	rechargePay(data) { // 添加预交金订单
	    return this.request({
	        method: POST,
	        url: '/inpatient/prepay/rechargePay',
	        data
	    })
	}
	
	balance(data) { // 查看预缴金余额
		return this.request({
			method: GET,
			url: '/inpatient/prepay/balance',
			data: data
		})
	}

}

export {
	prepayModel
}
