import {HTTP} from '../util/http.js'
import {config} from '../config.js'
const GET = 'GET'
const POST = 'POST'

class CyfModel extends HTTP {
	
   // 订单
   
	apiGetList(data) { // 获取订单列表
		return this.request({
			method: GET,
			url: '/zd-xt/orderHeader/page',
			header: {
				'zd-auth': config.appHeader
			},
			data
		})
	}
	
	apiGetWaybillList(data) { //  获取运单列表
		return this.request({
		   url: '/zd-xt/waybill/page',
		   method: GET,
		   header: {
		   	'zd-auth': config.appHeader
		   },
		   data
		})
	}
	
	// 运单 
	
	apiChangeOrderStatus(data) { // 修改订单状态
	  return this.request({
	    url: '/zd-xt/orderHeader/status',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiGetWaybillDetail(data) {// 获取运单详情
	  return this.request({
	    url: '/zd-xt/waybill/detail',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiWayBillIsException(data) { // 运单异常
	  return this.request({
	    url: '/zd-xt/waybill/isException',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiSearchbillListTree() {// 异常树列表
	  return this.request({
	    url: '/zd-system/dictionary/listTree',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data: {
	      'parentCode': 'WAYBILL-ERROR-STATUS'
	    }
	  })
	}
	
	apiGetTrailerList(data) { // 获取车辆列表
	  return this.request({
	    url: '/zd-xt/trailer/page',
	    method: GET,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiGetHandling(data) { // 获取装卸货时间段
	  return this.request({
	    url: '/zd-xt/waybill/handling',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}

	apiGetTankerList(data) { //  获取所有罐体
	  return this.request({
	    url: '/zd-xt/tanker/page',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}

	apiGetEmployee(data) {// 获取员工列表
	  return this.request({
	    url: '/zd-xt/employee/page',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiDispatchingCar(data) {// 派车
	  return this.request({
	    url: '/zd-xt/waybill/dispatching',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
	apiOverDownChange(data) { // 修改异常运单派车信息
	  return this.request({
	    url: '/zd-xt/waybill/exceptionPlan',
	    method: POST,
		header: {
			'zd-auth': config.appHeader
		},
	    data
	  })
	}
	
}

export {
	CyfModel
}
