import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class questionnaireModel extends HTTP {
/**
  我的订单接口
**/

	questionList(data) { // 问卷数据列表
		return this.request({
			method: GET,
			url: '/basics/questionnaireData/list',
			data: data,
			// type: 3
		})
	}

	questionListDetails(data) { // 问卷数据详情
		return this.request({
			method: GET,
			url: '/basics/questionnaireData/detail',
			data: data,
			// type: 3
		})
	}

	specificQuestionnaireData(data) { // 根据关联的业务id查询问卷内容
		return this.request({
			method: GET,
			url: '/basics/questionnaireData/getContentByCorrelationId',
			data: data,
			// type: 3
		})
	}


}

export {
	questionnaireModel
}
