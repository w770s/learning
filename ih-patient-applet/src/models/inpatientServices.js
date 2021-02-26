import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class serviceModel extends HTTP {
/**
  设置接口
**/
	seriviceList(data) { // 查询住院服务列表
		return this.request({
			method: GET,
			url: '/inpatient/inpatientSerivice/list',
			data: data
		})
	}

	seriviceDetail(data) { // 查询住院信息详情
		return this.request({
			method: GET,
			url: '/inpatient/inpatientSerivice/detail',
			data: data
		})
	}

	seriviceDailyBill(data) { // 查询每日消费清单
		return this.request({
			method: GET,
			url: '/inpatient/inpatientSerivice/dailyBill',
			data: data
		})
	}



	seriviceTotalCost(data) { // 查询住院总费用
		return this.request({
			method: GET,
			url: '/inpatient/inpatientSerivice/totalCost',
			data: data
		})
	}

	costDetails(data) { // 查询住院费用分类明细
		return this.request({
			method: GET,
			url: '/inpatient/inpatientSerivice/costDetails',
			data: data
		})
	}

}

export {
	serviceModel
}
