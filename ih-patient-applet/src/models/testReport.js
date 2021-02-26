import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class reportModel extends HTTP {
/**
  设置接口
**/
	reportList(data) { // 检查,检验报告单列表
		return this.request({
			method: GET,
			url: '/inpatient/checkReport/list',
			data
		})
	}

	nucleicList(data) { // 核酸报告列表
		return this.request({
			method: GET,
			url: '/inpatient/checkReport/nucleicList',
			data
		})
	}

	reportDetail(data) { // 检查,检验报告单明细
		return this.request({
			method: GET,
			url: '/inpatient/checkReport/detail',
			data
		})
	}

	nucleicDetail(data) { // 核酸检测详情报告
		return this.request({
			method: GET,
			url: '/inpatient/checkReport/nucleicDetail',
			data
		})
	}

}

export {
	reportModel
}
